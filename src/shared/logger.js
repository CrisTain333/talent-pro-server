/* eslint-disable no-undef */
// import path from 'path';
const path = require('path');
const { createLogger, format, transports } = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const { combine, timestamp, label, printf } = format;

//Customm Log Format

const myFormat = printf(({ level, message, label, timestamp }) => {
    const date = new Date(timestamp);
    const hour = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    return `${date.toDateString()} ${hour}:${minutes}:${seconds} - [${label}] ${level}: ${message}`;
});

const logger = createLogger({
    level: 'info',
    format: combine(label({ label: 'TP' }), timestamp(), myFormat),
    transports: [
        new transports.Console(),
        new DailyRotateFile({
            filename: path.join(
                process.cwd(),
                'logs',
                'winston',
                'successes',
                'tp-%DATE%-success.log'
            ),
            datePattern: 'YYYY-DD-MM-HH',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '14d'
        })
    ]
});

const errorLogger = createLogger({
    level: 'error',
    format: combine(label({ label: 'TP' }), timestamp(), myFormat),
    transports: [
        new transports.Console(),
        new DailyRotateFile({
            filename: path.join(
                process.cwd(),
                'logs',
                'winston',
                'errors',
                'tp-%DATE%-error.log'
            ),
            datePattern: 'YYYY-DD-MM-HH',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '14d'
        })
    ]
});

// export { logger, errorlogger };
module.exports = {
    logger,
    errorLogger
};
