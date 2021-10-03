const User = require("../model/user");

//New User
const newUser = (user) => {
    const userDetails = new User(user);
    return userDetails.save();
}

//Find existing user details by email
const findUserByUserName = (UserName) => { 
    const user =  User.findOne({where: {UserName: UserName}});
    return user;
}

//Update existing user details
const updateUser = (userName,Password,FirstName,LastName) => {
    const updateParams = {
        Password: Password,
        FirstName: FirstName,
        LastName: LastName
    }
    return User.update(updateParams,{where: {UserName:userName}});
}

module.exports = {
    newUser,
    findUserByUserName, 
    updateUser
}