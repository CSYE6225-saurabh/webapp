const aws = require('aws-sdk');
const logs = require('./logs')
aws.config.update({
    region: "us-east-1"
});
const conn = require('../config/db.config');
const docClient = new aws.DynamoDB.DocumentClient()
const snsClient = new aws.SNS()
const TTL_DELTA = 60 * 60 * 24 * 7
const addItemToDynamoDB = (res,userName,token) => {
    const params = {
        TableName: "csye6225-dynamodb",
        Item: { 
            UserName: userName,
            Token: token
        },
        ttl: { N: (Math.floor(+new Date() / 1000) + TTL_DELTA).toString() }
    }
    docClient.put(params,(err,resp) => {
        if (err) {
            console.error(err)
            logs.error(err)
        }
        else{
            logs.success(resp)
            const paramSNS = {
                "message-type": "email",
                "email":userName,
                "token":token
            }
            const data = {
                Message: JSON.stringify(paramSNS),
                TopicArn: conn.topicArn
            }
            snsClient.publish(data,(er,pay)=>{
                if (er) {
                    logs.error(er)
                    return {er,err,status:400}
                    
                }else{
                    logs.success(pay)
                    return {pay,resp,status:200}
                }
            })
        }

    })
}



module.exports = {
    addItemToDynamoDB
}
