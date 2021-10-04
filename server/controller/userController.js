const userService = require('../service/userService');
const validatePassword = require('../utils/encryptor');
const validateToken = require('../utils/token');
const promiseHandler = require('../utils/promiseHandler');

//Create new user
const saveUser = async (req,res) => {
    const { userName, password, firstName, lastName} = req.body;
    //Encrypt user using bcrypt algorithm
    const hashpassword = validatePassword.encryptPassword(password)

    // check for existing user
    const findUser = await userService.findUserByUserName(userName);
    if(findUser){
        promiseHandler.handleFailure(res,400,"User details already exists")
    }else{
        // create new user
        const promise = userService.newUser({
            UserName: userName,
            Password: hashpassword,
            FirstName: firstName,
            LastName: lastName
        })
        promise.then((newUser) => {
            const data = {
                UserName: newUser.UserName,
                FirstName: newUser.FirstName,
                LastName: newUser.LastName,
                Account_Created: newUser.Account_Created,
                Account_Updated: newUser.Account_Updated
            }
            promiseHandler.handleSuccess(res,200,"User created successfully",data)
        }).catch((err)=>{
            promiseHandler.handleError(err,res)
        })
    }
}

// get user details
const getUser = async (req, res) => {
    //get base64 token
    const authorization = req.headers.authorization

    //validate token value
    const [Username, Password] = validateToken(authorization)
    const user = await userService.findUserByUserName(Username);
    if (user){
        // validate password
        const passwordValidation = validatePassword.authenticate(Password,user.dataValues.Password)
        if(passwordValidation){
            const data = {
                FirstName : user.dataValues.FirstName,
                LastName : user.dataValues.LastName,
                UserName : user.dataValues.UserName
            }
            promiseHandler.handleSuccess(res,200,"User details found successfully",data)
        }
        else{
            promiseHandler.handleFailure(res,400,"User Not Found")
        }
    }
    else{
        promiseHandler.handleFailure(res,404,"User Not Found")
    }
}

const editUser = async (req, res) => {
    const authorization = req.headers.authorization
    const compare = (key) => {
        const compare = ["firstName","lastName","password"]
        let count = 0
        for (k in key){
            if (compare.includes(k)){
                count += 1
            }
        }   
        return count == Object.keys(key).length
    }
    if(req.body&&Object.keys(req.body).length == 0){
        promiseHandler.handleFailure(res,400,"No data values to be updated")
    }
    else if(!compare(req.body)){
        promiseHandler.handleFailure(res,400,"Invalid data imported")
    }
    else{
        // get base64 token
        const [Username, Password] = validateToken(authorization);

        // find for user details
        const user = await userService.findUserByUserName(Username);

        // get parameters
        var {firstName, lastName, password} = req.body;
        if(user){
            const passwordValidation = validatePassword.authenticate(Password,user.dataValues.Password)
            if(passwordValidation){

                // replaces missing fields in request with existing values
                firstName = firstName?firstName: user.dataValues.FirstName
                lastName = lastName?lastName:user.dataValues.LastName
                password = password?password: Password

                // encrypt password using bcrypt
                hashedPassword = validatePassword.encryptPassword(password)
                userService.updateUser(user.dataValues.UserName, hashedPassword, firstName, lastName)
                .then(async () => {

                    // call update service
                    const userUpdated = await userService.findUserByUserName(user.dataValues.UserName);
                    const data = {
                        UserName: userUpdated.UserName,
                        FirstName: userUpdated.FirstName,
                        LastName: userUpdated.LastName,
                        Account_Updated: userUpdated.Account_Updated
                    }
                    promiseHandler.handleSuccess(res,200,'User updated successfully',data);
                }).catch(err=>{
                    promiseHandler.handleError(err,res);
                })
            }
            else{
                promiseHandler.handleFailure(res,400,"Authorization Failed")
            }
        }
        else{
            promiseHandler.handleFailure(res,404,"User Not Found")
        }
    }
}


module.exports = {
    saveUser, 
    getUser, 
    editUser
}