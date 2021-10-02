const userService = require('../service/userService');
const validatePassword = require('../utils/encryptor');


const saveUser = async (req,res) => {
    const { UserName, Password, FirstName, LastName} = req.body;
    const password = validatePassword.encryptPassword(Password)
    console.log("Hit")

    const findUser = await userService.findUserByUserName(UserName);
    if(findUser){
        res.status(400).json({message: "User details already exists"})
    }else{
        const promise = userService.newUser({
            UserName: UserName,
            Password: password,
            FirstName: FirstName,
            LastName: LastName
        })
        promise.then((newUser) => {
            res.status(200).json({User: {
                UserName: newUser.UserName,
                FirstName: newUser.FirstName,
                LastName: newUser.LastName,
                Account_Created: newUser.createdAt,
                Account_Updated: newUser.updatedAt
            }});
        })
    }
}

const getUser = async (req, res) => {
    console.log("here")
    console.log(req.headers.authorization.split(' ')[1])
    const token = req.headers.authorization.split(' ')[1]
    const credentials = Buffer.from(token, 'base64').toString('ascii');
    const [Username, Password] = credentials.split(':');
    console.log(credentials);
    const user = await userService.findUserByUserName(Username);
    if (user){
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
                message: "User credentials are invalid",
            })
        }
    }
}

module.exports = {
    saveUser, 
    getUser
}