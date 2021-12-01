
const fs = require('fs');
const data = fs.readFileSync("/home/ubuntu/server/config.json");
const temp = JSON.parse(data);
module.exports = {
    HOST: temp.host.split(":")[0],
    HOSTREADREPLICA: "replica.cprdck0ambbc.us-east-1.rds.amazonaws.com",
    USER: temp.username,
    PASSWORD: temp.password,
    DB: temp.database,
    dialect : 'mysql',
    s3: temp.s3,
    port: temp.port,
    topicArn : "arn:aws:sns:us-east-1:970904211705:EmailNotificationRecipeEndpoint"
  };


// module.exports = {
//   HOST: "localhost",
//   USER: "root",
//   PASSWORD: "saurabh",
//   DB:"webapp",
//   dialect : 'mysql'
// };


  
