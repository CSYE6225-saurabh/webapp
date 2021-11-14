const log4js = require('log4js');
log4js.configure({
    appenders: { logs: { type: 'file', filename: '/home/ubuntu/webapp/cloudwatch/webapp.log' } },
    categories: { default: { appenders: ['logs'], level: 'info' } }
});
const logger = log4js.getLogger('logs');

const success = (msg) => {
    return logger.info(msg);
}

const error = (msg) => {
    return logger.error(msg);
}

module.exports = {
    success,
    error
}