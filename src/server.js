const app = require('./app');
// eslint-disable-next-line no-unused-vars
const colors = require('colors');
const connectToDatabase = require('./Database/ConnectDb');
const config = require('./config/config');
const cluster = require('node:cluster');
const os = require('node:os');
const http = require('http');
// const https = require('http')

connectToDatabase()
    .then(() => {
        // Start the Express app after successful database connection
        app.listen(config.port, () => {
            console.log(
                `Server running on http://localhost:${config.port}`.cyan
            );
        });
    })
    .catch(error => {
        console.error(
            `Worker ${process.pid} failed to connect to the database:`,
            error
        );
        process.exit(1); // Exit the worker process on database connection failure
    });

// ! Don't delete the code bellow

// connectToDatabase();
// app.listen(config.port, () => {
//     console.log(totalCpus);
//     console.log(process.pid);
//     console.log(
//         `Server running on  http://localhost:${config.port}`
//             .cyan
//     );
// });
// console.log(`Worker ${process.pid} started`);
