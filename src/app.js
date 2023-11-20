const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors = require('cors');
const router = require('./routes/routes');
const {
    globalErrorHandler
} = require('./middleware/globalErrorHandler');
const config = require('./config/config');
const limiter = require('./middleware/rateLimit');

const app = express();

dotenv.config();
// All Parsers
app.use(express.json());
app.use(
    bodyParser.urlencoded({ extended: true, limit: '50mb' })
);
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Morgan setup
if (config.env === 'development') {
    app.use(morgan('dev'));
}

app.use('/api/v1', router);

app.use(globalErrorHandler);

app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: 'Not Found',
        errorMessages: [
            {
                path: req.originalUrl,
                message: 'Api Not Found'
            }
        ]
    });
    next();
});

module.exports = app;
