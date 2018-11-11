const chai = require('chai');
const expect = require('chai').expect;
const request = require('supertest');
const Teacher = require('../../../backend/models/teacher');
const Student = require('../../../backend/models/student');
const Analytic = require('../../../backend/models/analytic');
const FocusItem = require('../../../backend/models/focus_item');
const Program = require('../../../backend/models/program');
const app = require('../../../server');
const ingest = require('../ingest');

const GOOD_TEACHER_JSON_1 = {
    name: 'Luke Senseney',
    email: 'lsenseney3@gatech.edu',
    password: 'DefinitlyMyPassword',
};

const GOOD_TEACHER_JSON_2 = {
    name: 'Asher Kenerly',
    email: 'akenerly3@gatech.edu',
    password: 'ButActuallyThisReallyIsMyPassword',
};

const program_jsons = [
    {
        name: "Test Program 1",
        description: "First program for database testing",
        type: 'mobile game'
    },
    {
        name: "Test Program 2",
        description: "Second program for database testing",
        type: 'website'
    },
    {
        name: "Test Program 3",
        description: "Third program for database testing",
        type: 'mobile game'
    }
];

describe('Program Controller', function () {
    before(async function () {
        this.timeout(15000);
        await Analytic.deleteMany({}).exec();
        await Teacher.deleteMany({}).exec();
        await FocusItem.deleteMany({}).exec();
        await Program.deleteMany({}).exec();
        await Student.deleteMany({}).exec();
    });

    after(async function () {
        this.timeout(15000);
        await Analytic.deleteMany({}).exec();
        await Teacher.deleteMany({}).exec();
        await FocusItem.deleteMany({}).exec();
        await Program.deleteMany({}).exec();
        await Student.deleteMany({}).exec();
    });

    describe('Tests with empty DB', async function () {
        var token;
        it('Registers a single teacher', async function () {
            res = await request(app)
                .post('/api/session/register')
                .send(GOOD_TEACHER_JSON_1);
            expect(res.body).to.be.an('object');
            expect(res.body.status).to.be.a('string');
            expect(res.body.status).to.equal('ok');
            expect(res.body.teacher._id).be.a('string');
            expect(res.body.teacher.email).equal(GOOD_TEACHER_JSON_1.email);
            expect(res.body.teacher.name).equal(GOOD_TEACHER_JSON_1.name);
            expect(res.body.teacher.password).to.be.undefined;
            expect(res.body.token).to.be.a('string');

            token = res.body.token
        });

        it('GETs /api/programs', async function () {
            res = await request(app)
                .get('/api/programs')
                .set('Authorization', 'Bearer ' + token)
            expect(res.body).to.be.an('object');
            expect(res.body.status).to.be.a('string');
            expect(res.body.status).to.equal('ok');
            expect(res.body.programs).to.be.a('array');
            expect(res.body.programs).to.have.lengthOf(0);
        });

        it('GETs /api/program/:id', async function () {
            res = await request(app)
                .get('/api/program/12345abcdef')
                .set('Authorization', 'Bearer ' + token)
                .expect(500)
            expect(res.body).to.be.an('object');
            expect(res.body.status).to.be.a('string');
            expect(res.body.status).to.equal('error');
        });

        it('GETs /api/programs/:id/focusitem', async function () {
            res = await request(app)
                .get('/api/program/12345abcdef/focusitem')
                .set('Authorization', 'Bearer ' + token)
                .expect(500);

            expect(res.body).to.be.an('object');
            expect(res.body.status).to.be.a('string');
            expect(res.body.status).to.equal('error');
        });

        it('POSTs an invalid program to /api/program', async function () {
            res = await request(app)
                .post('/api/program')
                .set('Authorization', 'Bearer ' + token)
                .send({
                    name: 'invalid',
                    description: 'yeah idk',
                    type: 'this is the invalid part that I just made up'
                })
                .expect(500);
        });

        it('PUTs an updated program to a program that does not exist', async function () {
            res = await request(app)
                .put('/api/program/12345abcdef')
                .set('Authorization', 'Bearer ' + token)
                .send({
                    name: 'invalid',
                    description: 'yeah idk',
                    type: 'this is the invalid part that I just made up'
                })
                .expect(500);
            expect(res.body).to.be.an('object');
            expect(res.body.status).to.be.a('string');
            expect(res.body.status).to.equal('error');
        });

        it('DELETEs a program that does not exist', async function () {
            res = await request(app)
                .delete('/api/program/12345abcdef')
                .set('Authorization', 'Bearer ' + token)
                .expect(500);
            expect(res.body).to.be.an('object');
            expect(res.body.status).to.be.a('string');
            expect(res.body.status).to.equal('error');
        });

        // it('GETs program analytics by focus item', async function() {
        //     res = await request(app)
        //         .get('/api/program/12345abcdef/analytics')
        //         .set('Authorization', 'Bearer ' + token)
            
        // });

        // it('GETs program analytics by focus item with no token', async function() {
        //     res = await request(app)
        //         .get('/api/program/12345abcdef/analytics')
        //         .expect(404)
        //     expect(res.error)
        //     expect(res.error.text).is.equal('Unauthorized');
        // });
    });



    // describe('Tests with sample db', async function () {
    //     before(function () {
    //         ingest.ingest(80, 750, 10);
    //     });

    //     var asher_token;
    //     it('Registers a single teacher', async function () {
    //         res = await request(app)
    //             .post('/api/session/register')
    //             .send(GOOD_TEACHER_JSON_2);
    //         expect(res.body).to.be.an('object');
    //         expect(res.body.status).to.be.a('string');
    //         expect(res.body.status).to.equal('ok');
    //         expect(res.body.teacher._id).be.a('string');
    //         expect(res.body.teacher.email).equal(GOOD_TEACHER_JSON_2.email);
    //         expect(res.body.teacher.name).equal(GOOD_TEACHER_JSON_2.name);
    //         expect(res.body.teacher.password).to.be.undefined;
    //         expect(res.body.token).to.be.a('string');
    //         // console.log(res.body.token)
    //         asher_token = res.body.token
    //     });

    //     var random_token;
    //     it('Logs in with a random teachers credentials', async function() {
    //         Teacher.findOne({})
    //             .skip(15)
    //             .then(async function(teacher) {
    //                 res = await request(app)
    //                     .post('/api/session/login')
    //                     .send({
    //                         email: teacher.email,
    //                         password: '123456'
    //                     });
    //                 // console.log(res.body.token)
    //                 random_token = res.body.token
                        
    //             });
    //     });

    //     it('GETs /api/programs', async function () {
    //         res = await request(app)
    //             .get('/api/programs')
    //             .set('Authorization', 'Bearer ' + asher_token)

    //         expect(res.body).to.be.an('object');
    //         expect(res.body.status).to.be.a('string');
    //         expect(res.body.status).to.equal('ok');
    //         expect(res.body.programs).to.be.a('array');
    //         expect(res.body.programs).to.have.lengthOf(3);
    //     });

    //     var valid_program;
    //     it('GETs /api/programs', async function () {
    //         res = await request(app)
    //             .get('/api/programs')
    //             .set('Authorization', 'Bearer ' + asher_token)

    //         expect(res.body).to.be.an('object');
    //         expect(res.body.status).to.be.a('string');
    //         expect(res.body.status).to.equal('ok');
    //         expect(res.body.programs).to.be.a('array');
    //         expect(res.body.programs).to.have.lengthOf(3);
    //         valid_program = res.body.programs[1]

    //     });

    //     it('GETs /api/program/:id', async function () {
    //         res = await request(app)
    //             .get('/api/program/' + valid_program._id)
    //             .set('Authorization', 'Bearer ' + asher_token)
    //             .expect(200)
    //         expect(res.body.program).is.an('object')
    //         expect(res.body.program._id).is.equal(valid_program._id)
    //         expect(res.body.program.name).is.equal(valid_program.name)
    //         expect(res.body.program.type).is.equal(valid_program.type)
    //     });

    //     it('GETs /api/programs/:id/focusitem', async function () {
    //         res = await request(app)
    //             .get('/api/program/' + valid_program._id + '/focusitem')
    //             .set('Authorization', 'Bearer ' + asher_token)
    //             .expect(200)
    //         expect(res.body).to.be.an('object');
    //         expect(res.body.status).to.be.a('string');
    //         expect(res.body.focus_items).to.be.an('array');

    //     });

    //     it('GETs /api/programs/:id/analytics', async function() {
    //         res = await request(app)
    //             .get('/api/program/' + valid_program._id + '/analytics')
    //             .set('Authorization', 'Bearer ' + random_token)
    //             .expect(200)
    //         // console.log(res.body)
    //         // console.log(res.error)
    //     });
    // });
});