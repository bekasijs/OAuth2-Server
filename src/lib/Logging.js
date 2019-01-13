const winston = require('winston');
const path = require('path');
const logger = winston.createLogger({
    format: winston.format.json(),
    levels: winston.config.syslog.levels,
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({
            filename: path.join(__dirname, '../lib/logs/') + 'access-log.log',
            level: 'info',
            handleExceptions: true,
            json: true,
        }),
        new winston.transports.File({
            filename: path.join(__dirname, '../lib/logs/') + 'error-log.log',
            level: 'error',
            handleExceptions: true,
            json: true,
        })
    ],
});

logger.stream = {
    write: (message, encoding) => {
        logger.info(message);
    }
}

module.exports = logger;