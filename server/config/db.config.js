
const fs = require('fs');

const data = fs.readFileSync("/home/ubuntu/server/config.json");
const rdsCa = fs.readFileSync("/home/ubuntu/webapp/server/config/us-east-1-bundle.cer");
const temp = JSON.parse(data);
module.exports = {
    host: temp.host.split(":")[0],
    hostReplica: temp.hostReadReplica.split(":")[0],
    user: temp.username,
    password: temp.password,
    db: temp.database,
    dialect : "mysql",
    s3: temp.s3,
    port: temp.port,
    topicArn : temp.topic_arn,
    rdsCa: rdsCa
  };


// module.exports = {
//   HOST: "localhost",
//   USER: "root",
//   PASSWORD: "saurabh",
//   DB:"webapp",
//   dialect : 'mysql'
// };


  
