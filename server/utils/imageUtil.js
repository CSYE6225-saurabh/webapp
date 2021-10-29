const AWS = require('aws-sdk');

const imageUpload = async(file) => {
    try{
        const s3Bucket = new AWS.S3({
            accessKeyId : "AKIAR3MICE2A4R3NZ4D3",
            secretAccessKey : "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"
        });
        const params = {
            Bucket : "saumanu123",
            Key : "key",
            Body : new Buffer(file.data,'base64'),
            ContentEncoding : 'base64',
            ContentType : file.mime
        }
        try {
            return await s3Bucket.upload(params).promise();
        }
        catch(e){
            throw new Error(e);
        }
    }
    catch(e){
        throw new Error(e);
    }
}

module.exports = {imageUpload}