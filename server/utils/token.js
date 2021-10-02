const baseAuth = require('basic-auth-token');

function generateToken(username, password){
    return new token(username, password)
}

function validateToken(req, res){

    const token = (req.headers.authorization || '').split(' ')[1] || ''
    const credentials = Buffer.from(token, 'base64').toString('ascii');
    const [user, pass] = credentials;
    const { UserName, Password } = req.body 
    if (token == null) return res.sendStatus(401);

    if(user != UserName && pass != Password){
        return res.sendStatus(403);
        next();
    }  
}

module.exports = {
    generateToken,
    validateToken
}