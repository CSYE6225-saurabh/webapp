const User = require("../model/user");


const newUser = (user) => {
    const userDetails = new User(user);
    return userDetails.save();
}

const findUserByUserName = (UserName) => { 
    const user =  User.findOne({where: {UserName: UserName}});
    return user;
}
module.exports = {
    newUser,
    findUserByUserName
}