const userService = require('../service/userService');
const passwordEncrypt = require('../utils/encryptor');
const validateToken = require('../utils/token');
const promiseHandler = require('../utils/promiseHandler');
const validateInput = require('../utils/validation');
const log = require('../utils/logs');
//Create new user
const saveUser = async (req,res) => {
    const { userName, password, firstName, lastName} = req.body;
    // handling invalid credentials
    if (!validateInput.compare2(req.body)){
        promiseHandler.handleFailure(res,400,"Invalid credentials"); 
        log.error("Invalid credentials")   
    }
    // empty fields
    else if (! userName || ! password || !firstName || !lastName) {
        promiseHandler.handleFailure(res,400,"Credentials missing");
        log.error("Credentials missing")
    }
    // no body from request 
    else if(req.body&&Object.keys(req.body).length == 0){
        promiseHandler.handleFailure(res,400,"No data values to be updated")
        log.error("No data values to be updated")
    }
    else{
        // Encrypt user using bcrypt algorithm
        const hashpassword = passwordEncrypt.encryptPassword(password)

        // input validations
        if(validateInput.validate('userName',userName) && validateInput.validate('password',password) && validateInput.validate('firstName',firstName) && validateInput.validate('lastName',lastName)){
            // check for existing user
            const findUser = await userService.findUserByUserName(userName);
            if(findUser){
                promiseHandler.handleFailure(res,400,"User details already exists")
                log.error("User details already exists")
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
                        UserId : newUser.UserId,
                        UserName: newUser.UserName,
                        FirstName: newUser.FirstName,
                        LastName: newUser.LastName,
                        Account_Created: newUser.Account_Created,
                        Account_Updated: newUser.Account_Updated
                    }
                    promiseHandler.handleSuccess(res,201,"User created successfully",data)
                    log.success(`User created: ${newUser.UserId}`)
                }).catch((err)=>{
                    promiseHandler.handleError(err,res)
                    log.error("Error creating user")
                })
            }
        }
        else{
            promiseHandler.handleFailure(res,400,"Input fields are not valid");
            log.error("Input fields are not valid")
        }
    }
}

// get user details
const getUser = async (req, res) => {
    //get base64 token
    const authorization = req.headers.authorization

    //validate token value
    const [Username, Password] = validateToken(authorization)
    if(!Username || !Password){
        promiseHandler.handleFailure(res,401,"Credentials missing")
        log.error("Credentials missing")
    }
    else if(validateInput.validate('userName',Username) && validateInput.validate('password',Password)){
        const user = await userService.findUserByUserName(Username);
        if (user){
            // validate password
            const passwordValidation = passwordEncrypt.authenticate(Password,user.dataValues.Password)
            if(passwordValidation){
                const data = {
                    UserId : user.dataValues.UserId,
                    FirstName : user.dataValues.FirstName,
                    LastName : user.dataValues.LastName,
                    UserName : user.dataValues.UserName, 
                    Account_Created : user.dataValues.Account_Created,
                    Account_Updated : user.dataValues.Account_Updated
                }
                promiseHandler.handleSuccess(res,200,"User details found successfully",data)
                log.success("User details found successfully")
            }
            else{
                promiseHandler.handleFailure(res,401,"User Authentication Failed")
                log.error("User Authentication Failed");
            }
        }
        else{
            promiseHandler.handleFailure(res,404,"User Not Found")
            log.error("User Not Found");
        }
    }else{
        promiseHandler.handleFailure(res,400,"Input fields are not valid");
        log.error("Input fields are not valid")
    }
}

const editUser = async (req, res) => {
    // get base64 token
    const authorization = req.headers.authorization
    const [Username, Password] = validateToken(authorization);
    if(!Username || !Password){
        promiseHandler.handleFailure(res,401,"Credentials missing")
        log.error("Credentials missing")
    }
    else if(req.body&&Object.keys(req.body).length == 0){
        promiseHandler.handleFailure(res,400,"No data values to be updated")
        log.error("No data values to be updated")
    }
    else if(!validateInput.compare(req.body)){
        promiseHandler.handleFailure(res,400,"Invalid data imported")
        log.error("Invalid data imported")
    }
    else{
        // find for user details
        const user = await userService.findUserByUserName(Username);

        // get parameters
        var {firstName, lastName, password} = req.body;
        if(validateInput.validate('userName',Username) && validateInput.validate('password',Password)){
            if(validateInput.validate('firstName',firstName) && validateInput.validate('lastName',lastName) && validateInput.validate('password',password)){
                if(user){
                    const passwordValidation = passwordEncrypt.authenticate(Password,user.dataValues.Password)
                    if(passwordValidation){

                        // replaces missing fields in request with existing values
                        firstName = firstName?firstName: user.dataValues.FirstName
                        lastName = lastName?lastName:user.dataValues.LastName
                        password = password?password: Password

                        // encrypt password using bcrypt
                        hashedPassword = passwordEncrypt.encryptPassword(password)
                        userService.updateUser(user.dataValues.UserName, hashedPassword, firstName, lastName)
                        .then(() => {
                            promiseHandler.handlePromise(res,200);
                            log.success("User updated successfully")        
                        }).catch(err=>{
                            promiseHandler.handleError(err,res);
                            log.error("Error updating user")
                        })
                    }
                    else{
                        promiseHandler.handleFailure(res,401,"Authorization Failed")
                        log.error("Authentication Failed")
                    }
                }
                else{
                    promiseHandler.handleFailure(res,404,"User Not Found")
                    log.error("User not found")
                }
            }else{
                promiseHandler.handleFailure(res,400,"Input fields are not valid")
                log.error("Input fields are not valid")
            }
        }else{
            promiseHandler.handleFailure(res,400,"Input fields are not valid")
            log.error("Input fields are not valid")
        }
    }
}


module.exports = {
    saveUser, 
    getUser, 
    editUser
}