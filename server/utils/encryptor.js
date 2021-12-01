// This function is used to encrypt password by Salt and hash
const bcrypt = require('bcryptjs');

const encryptPassword = (password) => {
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    return hashedPassword;
}

// This function is used to authenticate the password
const authenticate = (password, hash) => {
    const isAuthenticated = bcrypt.compareSync(password, hash);
    return isAuthenticated;
}

const generateTokenHash = (userName) => {
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(userName, salt);
    return hashedPassword;
}

const validateTokenHash = (userName,token) => {
    const isAuthenticated = bcrypt.compareSync(userName, token);
    return isAuthenticated;
}

module.exports = {
    encryptPassword, authenticate, generateTokenHash, validateTokenHash
}