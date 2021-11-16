const userRoute = require('../routes/user');

// create api endpoint
module.exports = (app) => {
    app.use("/v1/user",userRoute)
    app.use("/healthstatus",(req, res) => {
        res.send(200);
    })
}