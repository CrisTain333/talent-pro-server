const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors = require('cors');
const router = require('./routes/routes');
const { globalErrorHandler } = require('./middleware/globalErrorHandler');
const config = require('./config/config');
const limiter = require('./middleware/rateLimit');

const app = express();

dotenv.config();
// All Parsers
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Morgan setup
// if (config.env === 'development') {
app.use(morgan('dev'));
// }

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

// deploy:
//         runs-on: ip-172-31-38-150

//         steps:
//             - name: Pull image from docker hub
//               run: docker pull ${{ secrets.DOCKER_USERNAME }}/talent-pro-backend:latest
//             - name: Delete old container
//               run: docker rm -f talent-pro-server
//             - name: Run docker container
//               run: docker run -d -p 5000:5000 --name talent-pro-server ${{ secrets.DOCKER_USERNAME }}/talent-pro-backend
