const sendResponse = require('../../shared/sendResponse');

const startServer = async (req, res, next) => {
    try {
        sendResponse(res, {
            statusCode: 200,
            message: 'Server Started'
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { startServer };
