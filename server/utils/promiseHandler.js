
// Function to handle errors in promises
const handleError = (err, response) => {
    return response.status(400).json(err);
}

const handleFailure = (res,status,msg) =>{
    return res.status(status).json({message:msg});
}

// Function to send success response
const handleSuccess = (res,status,msg,data) => {
    return res.status(status).json({message:msg,data:data});
}

module.exports = {
    handleError,handleFailure,handleSuccess
}