const { createLogger, format, transports } = require("winston");
const { combine, timestamp, label, printf } = format;

const myFormat = printf(({ level, message, label, timestamp }) => {
    return `${timestamp} [${label}] ${level}: ${message}`;
});

const logger = createLogger({
    format: combine(label({ label: "API" }), timestamp(), myFormat),
    transports: [
        new transports.Console(),
        new transports.File({ filename: "server.log" }),
    ],
});

module.exports = logger;
