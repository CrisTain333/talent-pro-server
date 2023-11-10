const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(process.cwd(), '.env') });

module.exports = {
    env: process.env.NODE_ENV,
    port: process.env.PORT,
    database_url: process.env.DATABASE_URI,
    jwt: {
        secret: process.env.JWT_SECRET,
        expires_in: process.env.JWT_EXPIRES_IN
    },
    cloudy_nary: {
        cloud_name: process.env.CLOUD_NAME,
        cloud_api_key: process.env.CLOUD_API_KEY,
        cloud_api_secret: process.env.CLOUD_API_SECRET
    }
};

// NODE_ENV=development
// PORT=8000
// DATABASE_URI=mongodb+srv://talentprodev:3eitI9jeJuQN5iSU@talent-pro.rpkwmgs.mongodb.net/talent-pro-database
// JWT_SECRET=talent-pro12345!@
// JWT_EXPIRES_IN='24h'
// CLOUD_NAME=talent-pro
// CLOUD_API_KEY=672181378865551
// CLOUD_API_SECRET=DIWnV-MExxNFrVzPJUP1Ko7qwMc
