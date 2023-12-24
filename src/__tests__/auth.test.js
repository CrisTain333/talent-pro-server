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

let TOKEN;

describe('Auth', () => {
    let mongod;
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
    beforeAll(async () => {
        mongod = await MongoMemoryServer.create();
        const uri = mongod.getUri();
        await mongoose.connect(uri);
    });
    afterAll(async () => {
        await mongoose.disconnect();
        await mongod.stop();
    });
    describe('register', () => {
        it('should return 201 and Access Token', async () => {
            const { statusCode, body } = await supertest(
                app
            )
                .post(`/api/v1/auth/register`)
                .send(dummyUser)
                .set('Accept', 'application/json');

            expect(statusCode).toBe(201);
            console.log(body);
            expect(body?.result?.access).toBeDefined();
        });
    });
    describe('login', () => {
        const payload = {
            email: 'john.doe@example.com',
            password: 'securepassword'
        };

        it('should return 200 and Access Token', async () => {
            const { statusCode, body } = await supertest(
                app
            )
                .post(`/api/v1/auth/token`)
                .send(payload)
                .set('Accept', 'application/json');

            TOKEN = body?.result?.access;
            expect(statusCode).toBe(200);
            expect(body?.result?.access).toBeDefined();
        });
    });
    describe('Get own profile', () => {
        it('should return user', async () => {
            const { statusCode, body } = await supertest(
                app
            )
                .get(`/api/v1/me`)
                .set('Authorization', `Bearer ${TOKEN}`)
                .expect(200);

            console.log(body);
            expect(statusCode).toBe(200);
            expect(body?.result).toBeTruthy();
        });
    });
});
