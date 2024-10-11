process.env.NODE_ENV = 'test';

const expect = require('chai').expect;
const request = require('supertest');

const appMaker = require('../../app');
const app = appMaker.makeApp();
const conn = require('../../db_connection');

describe("Label API", () => {

    beforeAll(async () => {

        // connect to mongodb and listen

        try {
            await conn.connect();
        }
        catch (err) {
            console.log(err);
        }
    });

    afterAll(async () => {

        // close DB connection

        try {
            await conn.close();
        }
        catch (err) {
            console.log(err);
        }
    });

    describe("GET /label/getAll", () => {

        it("should return all labels", async () => {

            const res = await request(app)
                .get('/label/getAll')
                .send();

            expect(res.statusCode).to.equal(200);
            expect(res.body).to.be.an('array');
        });
    });

    describe("POST /label/create", () => {

        it("should create a new label", async () => {

            const res = await request(app)
                .post('/label/create')
                .send({
                    "name": "label1",
                    "parentId": null
                });

            expect(res.statusCode).to.equal(200);
            expect(res.body).to.be.an('object');
            expect(res.body.name).to.equal("label1");
        });

        it("should return an error with name field for already exsisting label name", async () => {

            const res = await request(app)
                .post('/label/create')
                .send({
                    "name": "label1",
                    "parentId": null
                });

            expect(res.statusCode).to.equal(400);
            expect(res.body).to.be.an('object');
            expect(res.body.name).to.equal("label1");
        });
    });

    describe("GET /label/find/:id", () => {

        it("should return a label by id", async () => {

            const res = await request(app)
                .get('/label/find/6708d433f35d36eebcfbd31d')
                .send();

            expect(res.statusCode).to.equal(200);
            expect(res.body).to.be.an('object');
            expect(res.body._id).to.equal("1");
        });

        it("should return an error for non-exsisting label id", async () => {

            const res = await request(app)
                .get('/label/find/100')
                .send();

            expect(res.statusCode).to.equal(404);
            expect(res.body).to.be.an('object');
            expect(res.body._id).to.equal("100");
        });
    });

    describe("PUT /label/update/:id", () => {

        it("should update a label by id", async () => {

            const res = await request(app)
                .put('/label/update/6708d433f35d36eebcfbd31d')
                .send({
                    "name": "label1",
                    "parentId": null
                });

            expect(res.statusCode).to.equal(200);
            expect(res.body).to.be.an('object');
            expect(res.body._id).to.equal("1");
        });

        it("should return an error for non-exsisting label id", async () => {

            const res = await request(app)
                .put('/label/update/100')
                .send({
                    "name": "label100",
                    "parentId": null
                });

            expect(res.statusCode).to.equal(404);
            expect(res.body).to.be.an('object');
            expect(res.body._id).to.equal("100");
        });
    });

    describe("DELETE /label/delete/:id", () => {

        it("should delete a label by id", async () => {

            const res = await request(app)
                .delete('/label/delete/6708d433f35d36eebcfbd31d')
                .send();

            expect(res.statusCode).to.equal(200);
            expect(res.body).to.be.an('object');
            expect(res.body._id).to.equal("1");
        });

        it("should return an error for non-exsisting label id", async () => {

            const res = await request(app)
                .delete('/label/delete/100')
                .send();

            expect(res.statusCode).to.equal(404);
            expect(res.body).to.be.an('object');
            expect(res.body._id).to.equal("100");
        });
    });
});
