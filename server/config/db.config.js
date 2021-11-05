const fs = require('fs');
const data = fs.readFileSync("/home/ubuntu/server/config.json");
const temp = JSON.parse(data);

module.exports = {
    HOST: temp.host.split(":")[0]?temp.host.split(":")[0]:"localhost",
    USER: temp.username?temp.username:"root",
    PASSWORD: temp.password?temp.password:"saurabh",
    DB: temp.database?temp.database:"webapp",
    dialect : 'mysql',
    s3: temp.s3
  };
  
// module.exports = {
//   HOST: "localhost",
//   USER: "root",
//   PASSWORD: "saurabh",
//   DB:"webapp",
//   dialect : 'mysql'
// };