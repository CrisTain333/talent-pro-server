const app = require('./app');
// eslint-disable-next-line no-unused-vars
const colors = require('colors');
const connectToDatabase = require('./Database/ConnectDb');
const config = require('./config/config');
const { logger, errorLogger } = require('./shared/logger');
// const https = require('http')

connectToDatabase()
    .then(() => {
        // Start the Express app after successful database connection
        app.listen(config.port, () => {
            logger.info(
                `Server running on http://localhost:${config.port}`.cyan
            );
        });
    })
    .catch(error => {
        errorLogger.error(
            `Worker ${process.pid} failed to connect to the database:`,
            error
        );
        process.exit(1); // Exit the worker process on database connection failure
    });

// ! Don't delete the code bellow
