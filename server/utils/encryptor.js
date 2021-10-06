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

//field validator
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

const compare2 = (key) => {
    const compare = ["firstName","lastName","password","userName"]
    let count = 0
    for (k in key){
        if (compare.includes(k)){
            count += 1
        }
    }   
    return count == Object.keys(key).length
}

module.exports = {
    encryptPassword, authenticate, compare, compare2
}