const userService = require('../service/userService');
const validator = require('../utils/encryptor');
const validateToken = require('../utils/token');
const promiseHandler = require('../utils/promiseHandler');

//Create new user
const saveUser = async (req,res) => {
    const { userName, password, firstName, lastName} = req.body;
    // Encrypt user using bcrypt algorithm
    const hashpassword = validator.encryptPassword(password)
    if (! userName || ! password || !firstName || !lastName) {
        promiseHandler.handleFailure(res,400,"Credentials missing");
    }
    // handling invalid credentials
    if (!validator.compare2(req.body)){
        promiseHandler.handleFailure(res,400,"Invalid credentials");
    }
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
            promiseHandler.handleSuccess(res,201,"User created successfully",data)
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
    if(!Username || !Password){
        promiseHandler.handleFailure(res,400,"Credentials missing")
    }
    const user = await userService.findUserByUserName(Username);
    if (user){
        // validate password
        const passwordValidation = validator.authenticate(Password,user.dataValues.Password)
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
    if(req.body&&Object.keys(req.body).length == 0){
        promiseHandler.handleFailure(res,400,"No data values to be updated")
    }
    else if(!validator.compare(req.body)){
        promiseHandler.handleFailure(res,400,"Invalid data imported")
    }
    else{
        // get base64 token
        const [Username, Password] = validateToken(authorization);
        if(!Username || !Password){
            promiseHandler.handleFailure(res,400,"Credentials missing")
        }
        // find for user details
        const user = await userService.findUserByUserName(Username);

        // get parameters
        var {firstName, lastName, password} = req.body;
        if(user){
            const passwordValidation = validator.authenticate(Password,user.dataValues.Password)
            if(passwordValidation){

                // replaces missing fields in request with existing values
                firstName = firstName?firstName: user.dataValues.FirstName
                lastName = lastName?lastName:user.dataValues.LastName
                password = password?password: Password

                // encrypt password using bcrypt
                hashedPassword = validator.encryptPassword(password)
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