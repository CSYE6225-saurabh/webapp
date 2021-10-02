const userRoute = require('../routes/user');

module.exports = (app) => {
    app.use("/v1/user",userRoute)
}