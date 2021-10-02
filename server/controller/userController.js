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
module.exports = {
    saveUser
}