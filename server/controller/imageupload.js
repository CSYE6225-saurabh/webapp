const userService = require('../service/userService');
const imageService = require('../service/imageServices')
const promiseHandler = require('../utils/promiseHandler')
const validateToken = require('../utils/token');
const validateInput = require('../utils/validation');
const passwordEncrypt = require('../utils/encryptor')
const metrics = require('../utils/metrics');
const logs = require('../utils/logs');
const connection = require('../config/db.config')
const aws = require('aws-sdk');
const s3 = new aws.S3();
// Module import
const imageUpload = async (req,res) => {
  const timer = new Date();
  const databaseTime = new Date();
  const s3Time = new Date();
  metrics.increment("Image.POST.newUserImage");
  const authorization = req.headers.authorization
  var bufferedImage = new Buffer(req.body.toString("binary"),"base64");
  const fileType = req.headers['content-type'].split('/')[1];
  //validate token value
  const [Username, Password] = validateToken(authorization)
  if(!Username || !Password){
    promiseHandler.handleFailure(res,401,"Credentials missing")
  } 
  else if(validateInput.validate('userName',Username) && validateInput.validate('password',Password) && validateInput.compare3(fileType)){
    const user = await userService.findUserByUserName(Username);
    if(user){
      const passwordValidation = passwordEncrypt.authenticate(Password,user.dataValues.Password)
      if(passwordValidation){
        const params = {
          Bucket : connection.s3,
          Key : `${user.dataValues.UserId}-profile-picture.${fileType}`,
          Body : bufferedImage,
          ContentEncoding : 'base64',
          ContentType : fileType
        }       
        const image =await imageService.getImage(user.dataValues.UserId);
        if(!image){
          const promise = await s3.upload(params).promise();
          if(promise){
            metrics.timing("Image.POST.S3NewUserImage",s3Time);  
            let uploadData = {
                file_name : promise.Key,
                url : promise.Location,
                userID: user.dataValues.UserId
            }
            const prom = await imageService.uploadService(uploadData);
            if(prom){
              metrics.timing("Image.POST.databaseNewUserImage",databaseTime);
              promiseHandler.handleSuccess(res,200,"Image added for the user", prom)
              metrics.timing("Image.POST.newUserImage",timer);
              logs.success("Image updated for the user successfully");

            }else{
              promiseHandler.handleFailure(res,404,"Error adding image files")
              logs.error("Error adding image files");
            }
          }else{
            promiseHandler.handleFailure(res,400,"Error adding image files") 
            logs.error("Error adding image files")           
          }
        }else{
          s3.deleteObject({
            Bucket : params.Bucket,
            Key : params.Key
          },async (err,data)=>{
            if(err){
              promiseHandler.handleError(err,res);
            }
            else{
              metrics.timing("Image.DELETE.S3DeleteToCreateUserImage",s3Time);
              const promise = await s3.upload(params).promise();
              if(promise){
                metrics.timing("Image.POST.S3NewUserImage",s3Time);
                let uploadData = {
                  file_name : promise.Key,
                  url : promise.Location,
                  userID: user.dataValues.UserId
                }
                const prom1 = await imageService.updateImage(uploadData, user.dataValues.UserId);
                if(prom1){
                  metrics.timing("Image.POST.databaseNewUserImage",databaseTime);
                  promiseHandler.handlePromise(res,"Image updated successfully")
                  metrics.timing("Image.POST.newUserImage",timer);
                  logs.success("Image added to the bucket successfully")
                }else{
                  promiseHandler.handleFailure(res,404,"Error adding image files")
                  logs.error("Error adding image files")
                } 
              }else{
                promiseHandler.handleFailure(res,404,"Error adding image files")
                logs.error("Error adding image files")
              }
            }
          })          
        }
      }else{
        promiseHandler.handleFailure(res,401,"User Authentication Failed")
        logs.error("User Authentication Failed")
      }
    }else{
      promiseHandler.handleFailure(res,404,"User Not Found")
      logs.error("User Not Found")
    }  
  }
  else{
    promiseHandler.handleFailure(res,400,"Input fields are not valid");
    logs.error("Input fields are not valid")
  }
}

const getImage = async (req,res) =>{
  const timer = new Date();
  const databaseTime = new Date();
  metrics.increment("Image.GET.getUserImage");

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
              metrics.timing("User.GET.databaseGetUser",databaseTime);
              const params = {
                file_name : image.dataValues.file_name,
                id: image.dataValues.id,
                url : image.dataValues.url,
                upload_date: image.dataValues.createdAt,
                userId: image.dataValues.userID
              }
              promiseHandler.handleSuccess(res,200,"Image data found for user",params)
              metrics.increment("Image.GET.getUserImage",timer);
              logs.success("Image data found for user")
            }
            else{
              promiseHandler.handleFailure(res,404,"Image details not found")
              logs.error("Image details not found")
            }
          }
          else{
              promiseHandler.handleFailure(res,401,"User Authentication Failed")
              logs.error("User Authentication Failed")
          }
      }
      else{
          promiseHandler.handleFailure(res,404,"User Not Found")
          logs.error("User Not Found")
      }
  }else{
      promiseHandler.handleFailure(res,400,"Input fields are not valid");
      logs.error("Input fields are not valid")
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
                        promiseHandler.handlePromise(res,200);
                        logs.success("Image deleted successfully")
                      }else{
                        promiseHandler.handleFailure(res,400,"Error deleting image")
                        logs.error("Error deleting image")
                      }
                    }
                  })                          
            }
            else{
              promiseHandler.handleFailure(res,404,"Image details not found")
              logs.error("Image details not found")
            }
          }
          else{
              promiseHandler.handleFailure(res,401,"User Authentication Failed")
              logs.error("User Authentication Failed")
          }
      }
      else{
          promiseHandler.handleFailure(res,404,"User Not Found")
          logs.error("User Not Found")
      }
  }else{
      promiseHandler.handleFailure(res,400,"Input fields are not valid");
      logs.error("Input fields are not valid")
  } 
}
module.exports = {
  imageUpload: imageUpload,
  getImage: getImage,
  deleteImage : deleteImage
}