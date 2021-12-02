
const fs = require('fs');
const data = fs.readFileSync("/home/ubuntu/server/config.json");
const temp = JSON.parse(data);
module.exports = {
    HOST: temp.host.split(":")[0],
    HOSTREADREPLICA: "replica.cprdck0ambbc.us-east-1.rds.amazonaws.com",
    USER: temp.username,
    PASSWORD: temp.password,
    DB: temp.database,
    dialect : temp.hostReadReplics.split(":")[0],
    s3: temp.s3,
    port: temp.port,
    topicArn : temp.topic_arn
  };


// module.exports = {
//   HOST: "localhost",
//   USER: "root",
//   PASSWORD: "saurabh",
//   DB:"webapp",
//   dialect : 'mysql'
// };


  
