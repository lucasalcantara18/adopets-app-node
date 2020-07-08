import { createLogger, format, transports } from 'winston';
import { json } from 'envalid';
const { combine, timestamp, label, printf, prettyPrint  } = format;
 
const myFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});

const logger = createLogger({
    transports:[
        new transports.Console(),
        new transports.File({filename: './error.log', level: 'error'}),
        new transports.File({filename: './info.log', level: 'info' }),
    ],
    format: combine(
        myFormat,
        label({ label: '<-------' }),
        timestamp(),
        format.json()
    ) ,
    exitOnError: true
});

export default logger;