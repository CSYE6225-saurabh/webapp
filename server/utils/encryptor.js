const bcrypt = require('bcrypt');

// This function is used to encrypt password by Salt and hash
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

module.exports = {
    encryptPassword, authenticate
}