/* eslint-disable node/no-extraneous-require */
/* eslint-disable node/no-unpublished-require */
const {
    describe,
    it,
    expect,
    beforeAll,
    afterAll
} = require('@jest/globals');
const supertest = require('supertest');
const {
    MongoMemoryServer
} = require('mongodb-memory-server');
const { default: mongoose } = require('mongoose');
const app = require('../app');
// let app;

describe('Auth Tests', () => {
    beforeAll(async () => {
        const mongod = await MongoMemoryServer.create();
        const uri = mongod.getUri();
        await mongoose.connect(uri);
    });
    afterAll(async () => {
        await mongoose.disconnect();
    });
    describe('register', () => {
        const dummyUser = {
            name: {
                first_name: 'John',
                last_name: 'Doe'
            },
            email: 'john.doe@example.com',
            password: 'securepassword',
            role: 'candidate',
            account_status: 'active',
            isOnboardComplete: true,
            image_url: 'https://example.com/avatar.jpg'
        };

        it('should return 201 and Access Token', async () => {
            const { statusCode, body } = await supertest(
                app
            )
                .post(`/api/v1/auth/register`)
                .send(dummyUser)
                .set('Accept', 'application/json');

            expect(statusCode).toBe(201);
            expect(body?.result?.access).toBeDefined();
            // console.log(body);
        });
    });
});
