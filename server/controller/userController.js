const userService = require('../service/userService');
const validatePassword = require('../utils/encryptor');
const validateToken = require('../utils/token');
const errorHandler = require('../utils/errorHandler');

//Create new user
const saveUser = async (req,res) => {
    const { userName, password, firstName, lastName} = req.body;
    //Encrypt user using bcrypt algorithm
    const hashpassword = validatePassword.encryptPassword(password)

    // check for existing user
    const findUser = await userService.findUserByUserName(userName);
    if(findUser){
        res.status(400).json({message: "User details already exists"})
    }else{
        // create new user
        const promise = userService.newUser({
            UserName: userName,
            Password: hashpassword,
            FirstName: firstName,
            LastName: lastName
        })
        promise.then((newUser) => {
            res.status(200).json({
                message: "User created successfully",
                data: {
                    UserName: newUser.UserName,
                    FirstName: newUser.FirstName,
                    LastName: newUser.LastName,
                    Account_Created: newUser.Account_Created,
                    Account_Updated: newUser.Account_Updated
                }
            });
        }).catch((err)=>{
            errorHandler(err,res)
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
            res.status(200).json({
                message: "User details found successfully",
                data: {
                    FirstName : user.dataValues.FirstName,
                    LastName : user.dataValues.LastName,
                    UserName : user.dataValues.UserName
                }
            })
        }
        else{
            res.status(404).json({
                message: "Authorization Failed"
            })
        }
    }
    else{
        res.status(404).json({
            message: "User Not Found"
        })
    }
}

const editUser = async (req, res) => {
    const authorization = req.headers.authorization
    if(!req.body){
        res.status(204).json({
            message: "No data values to be updated"
        })
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
                if(!firstName){
                    firstName = user.dataValues.FirstName
                }
                else if(!lastName){
                    lastName = user.dataValues.LastName
                }
                else if(!password){
                    password = Password
                }

                // encrypt password using bcrypt
                hashedPassword = validatePassword.encryptPassword(password)
                userService.updateUser(user.dataValues.UserName, hashedPassword, firstName, lastName)
                .then(async () => {

                    // call update service
                    const userUpdated = await userService.findUserByUserName(user.dataValues.UserName);
                    res.status(200).json({
                        message: 'User updated successfully',
                        data: {
                            UserName: userUpdated.UserName,
                            FirstName: userUpdated.FirstName,
                            LastName: userUpdated.LastName,
                            Account_Updated: userUpdated.Account_Updated
                        }
                    })
                }).catch(err=>{
                    errorHandler(err,res);
                })
            }
            else{
                res.status(404).json({
                    message: "Authorization Failed"
                })
            }
        }
        else{
            res.status(404).json({
                message: "User Not Found"
            })
        }
    }
}


module.exports = {
    saveUser, 
    getUser, 
    editUser
}