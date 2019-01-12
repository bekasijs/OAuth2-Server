const winston = require('winston');
const path = require('path');
const logger = winston.createLogger({
    levels: winston.config.syslog.levels,
    transports: [
        new winston.transports.Console({ level: 'error', json: true, colorize: true }),
        new winston.transports.Console({ level: 'warn', json: true, colorize: true }),
        new winston.transports.File({
            filename: 'access_log.log',
            level: 'info',
            handleExceptions: true,
            json: true
        })
    ],
});

logger.stream = {
    write: (message, encoding) => {
        logger.info(message);
    }
}

module.exports = logger;