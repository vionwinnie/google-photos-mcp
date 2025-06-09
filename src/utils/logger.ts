import winston from 'winston';

// Define log format
const logFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.printf(({ level, message, timestamp }) => {
    return `${timestamp} [${level.toUpperCase()}]: ${message}`;
  })
);

// Create the logger
const transports: winston.transport[] = [
  new winston.transports.File({ filename: 'error.log', level: 'error' }),
  new winston.transports.File({ filename: 'combined.log' }),
];

// Only add Console transport if NOT in stdio mode
if (!process.argv.includes('--stdio')) {
  transports.push(new winston.transports.Console());
}

// Set default log level to 'info'.
const logger = winston.createLogger({
  level: 'info',
  format: logFormat,
  transports,
});

// Add a stream for using with express-winston
logger.stream = {
  // @ts-ignore
  write: (message: string) => {
    logger.info(message.trim());
  },
};

export default logger;