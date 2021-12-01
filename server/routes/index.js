const userRoute = require('../routes/user');
const verifyRoute = require('../routes/verify');
// create api endpoint
module.exports = (app) => {
    app.use("/v1/user",userRoute)
    app.use("/healthstatus",(req, res) => {
        res.send(200);
    })
    app.use("/v1/verifyUserEmail",verifyRoute)
}