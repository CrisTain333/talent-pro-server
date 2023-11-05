const app = require('./app');
// eslint-disable-next-line no-unused-vars
const colors = require('colors');
const connectToDatabase = require('./Database/ConnectDb');
require('dotenv').config();

const port = process.env.PORT || 5000;

connectToDatabase();

app.listen(port, () => {
    console.log(
        `Server running on  http://localhost:${port}`.cyan
    );
});
