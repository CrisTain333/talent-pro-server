const app = require('./app');
// eslint-disable-next-line no-unused-vars
const colors = require('colors');
const connectToDatabase = require('./Database/ConnectDb');
const config = require('./config/config');

connectToDatabase();

app.listen(config.port, () => {
    console.log(
        `Server running on  http://localhost:${config.port}`
            .cyan
    );
});
