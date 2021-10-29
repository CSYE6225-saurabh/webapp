const userService = require('../service/userService');
const imageService = require('../service/imageServices')
const promiseHandler = require('../utils/promiseHandler')
const validateToken = require('../utils/token');
const validateInput = require('../utils/validation');
const passwordEncrypt = require('../utils/encryptor')
const connection = require('../config/db.config')
const fs = require('fs');
const aws = require('aws-sdk');
const s3 = new aws.S3();
const imageUpload =async (req,res) => {
  const authorization = req.headers.authorization
  console.log(req)
  const fileType = req.file.mimetype.split('/')[1];
  //validate token value
  const [Username, Password] = validateToken(authorization)
  if(!Username || !Password){
    promiseHandler.handleFailure(res,401,"Credentials missing")
  }
  
  else if(validateInput.validate('userName',Username) && validateInput.validate('password',Password) && validateInput.compare3(fileType)){
    const user = await userService.findUserByUserName(Username);
    if(user){
      console.log(user)
      const passwordValidation = passwordEncrypt.authenticate(Password,user.dataValues.Password)
      if(passwordValidation){
        const image =await imageService.getImage(user.dataValues.UserId);
        console.log(image)
        console.log(user.dataValues)
        if(image){
          promiseHandler.handleFailure(res,400,"Image details for user already exists")
        }else{
          fs.readFile(req.file.path,async (err,data)=>{

            let fileExtension = req.file.mimetype.split('/')[1];
            const params = {
              Bucket : connection.s3,
              Key : req.file.originalname,
              Body : new Buffer(data,'base64'),
              ContentEncoding : 'base64',
              ContentType : fileExtension
            }
            // Uploading files to the bucket
            const promise = await s3.upload(params).promise();
            console.log(promise)
            if(promise){
                let uploadData = {
                    file_name : promise.Key,
                    url : promise.Location,
                    userID: user.dataValues.UserId
                }
                const prom = await imageService.uploadService(uploadData);
                if(prom){
                  promiseHandler.handleSuccess(res,200,"Image added to the bucket successfully",prom);
                }else{
                  promiseHandler.handleFailure(res,404,"Error adding image files")
                }
            }else{
              promiseHandler.handleFailure(res,400,"Error adding image files")
            } 
          })
        } 
      }
      else{
        promiseHandler.handleFailure(res,401,"User Authentication Failed")
      }

    }else{
      promiseHandler.handleFailure(res,404,"User Not Found")
    }

  }
  else{
    promiseHandler.handleFailure(res,400,"Input fields are not valid");
  }
}
const getImage = async (req,res) =>{
  //get base64 token
  const authorization = req.headers.authorization

  //validate token value
  const [Username, Password] = validateToken(authorization)
  if(!Username || !Password){
      promiseHandler.handleFailure(res,401,"Credentials missing")
  }
  else if(validateInput.validate('userName',Username) && validateInput.validate('password',Password)){
      const user = await userService.findUserByUserName(Username);
      if (user){
          // validate password
          const passwordValidation = passwordEncrypt.authenticate(Password,user.dataValues.Password)
          if(passwordValidation){
            const image = await imageService.getImage(user.dataValues.UserId);
            if(image){
              const params = {
                file_name : image.dataValues.file_name,
                id: image.dataValues.id,
                url : image.dataValues.url,
                upload_date: image.dataValues.createdAt,
                userId: image.dataValues.userID
              }
              promiseHandler.handleSuccess(res,200,"Image data found for user",params)
            }
            else{
              promiseHandler.handleFailure(res,404,"Image details not found")
            }
          }
          else{
              promiseHandler.handleFailure(res,401,"User Authentication Failed")
          }
      }
      else{
          promiseHandler.handleFailure(res,404,"User Not Found")
      }
  }else{
      promiseHandler.handleFailure(res,400,"Input fields are not valid");
  }
}
const deleteImage = async (req, res) => {
  //get base64 token
  const authorization = req.headers.authorization

  //validate token value
  const [Username, Password] = validateToken(authorization)
  if(!Username || !Password){
      promiseHandler.handleFailure(res,401,"Credentials missing")
  }
  else if(validateInput.validate('userName',Username) && validateInput.validate('password',Password)){
      const user = await userService.findUserByUserName(Username);
      if (user){
          // validate password
          const passwordValidation = passwordEncrypt.authenticate(Password,user.dataValues.Password)
          if(passwordValidation){
            const image = await imageService.getImage(user.dataValues.UserId);
            if(image){
              const params = {
                Key : image.dataValues.file_name,
                id: image.dataValues.id,
                Bucket : connection.s3
              }
              s3.deleteObject({
                    Bucket : params.Bucket,
                    Key : params.Key
                  },(err,data)=>{
                    if(err){
                      promiseHandler.handleError(err,res);
                    }
                    else{
                      const promImDel =imageService.deleteImage(params.id);
                      if(promImDel){
                        console.log("here")
                        promiseHandler.handlePromise(res,200);

                      }else{
                        promiseHandler.handleFailure(res,400,"Error deleting image")
                      }
                    }
                  })                          
            }
            else{
              promiseHandler.handleFailure(res,404,"Image details not found")
            }
          }
          else{
              promiseHandler.handleFailure(res,401,"User Authentication Failed")
          }
      }
      else{
          promiseHandler.handleFailure(res,404,"User Not Found")
      }
  }else{
      promiseHandler.handleFailure(res,400,"Input fields are not valid");
  } 
}
module.exports = {
  imageUpload: imageUpload,
  getImage: getImage,
  deleteImage : deleteImage
}