const aws = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../config/config.json")[env];
var StatsD = require("node-statsd"),
client = new StatsD();

// aws.config.update({
//   secretAccessKey: config.secretAccessKey,
//   accessKeyId: config.accessKeyId,
//   region: config.region,
// });

const s3 = new aws.S3();

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg"
  ) {
    cb(null, true);
  } else {
    return cb("Invalid Mime Type, only JPEG,PNG,JPG", false);
  }
};

var start = new Date().getTime();
const upload = multer({
  fileFilter,
  storage: multerS3({
    s3,
    bucket: config.s3_bucket,
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      cb(null, file.originalname + Date.now().toString());
    },
  }),
});
var end = new Date().getTime();
client.timing("addImage_s3_request", end - start);

module.exports = upload;
