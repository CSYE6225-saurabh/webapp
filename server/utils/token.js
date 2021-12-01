
//base64 token authorization
const validateToken = (authorization) =>{
    const token = authorization.split(' ')[1]
    const credentials = Buffer.from(token, 'base64').toString('ascii');
    const [Username, Password] = credentials.split(':');
    return [Username, Password];
}

module.exports = {
    validateToken,
}