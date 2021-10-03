
// Function to handle errors in promises
const handleError = (err, response) => {
    response.status(500);
    response.json(err);
}

module.exports = handleError;