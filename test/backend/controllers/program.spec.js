const chai = require('chai');
const expect = require('chai').expect;
const request = require('supertest');
const Teacher = require('../../../backend/models/teacher');
const Student = require('../../../backend/models/student');
const Analytic = require('../../../backend/models/analytic');
const FocusItem = require('../../../backend/models/focus_item');
const Program = require('../../../backend/models/program');
const app = require('../../../server');

const GOOD_TEACHER_JSON_1 = {
    name: 'Luke Senseney',
    email: 'lsenseney3@gatech.edu',
    password: 'DefinitlyMyPassword',
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

describe('Tests the /api/program routes', function() {
    var teacher;
    var token;

	before(async function() {
        this.timeout(15000);
		await Analytic.deleteMany({}).exec();
        await Teacher.deleteMany({}).exec();
        await FocusItem.deleteMany({}).exec();
        await Program.deleteMany({}).exec();
        await Student.deleteMany({}).exec();

        res = await request(app)
                    .post('/api/session/register')
                    .send(GOOD_TEACHER_JSON_1)
                    
        
        expect(res.body).to.be.an('object');
        expect(res.body.status).to.be.a('string');
        expect(res.body.status).to.equal('ok');
        expect(res.body.teacher._id).be.a('string');
        expect(res.body.teacher.email).equal(GOOD_TEACHER_JSON_1.email);
        expect(res.body.teacher.name).equal(GOOD_TEACHER_JSON_1.name);
        expect(res.body.teacher.password).to.be.undefined;
        expect(res.body.token).to.be.a('string');   
        res = await request(app)
            .post('/api/session/login')
            .send({
                email: GOOD_TEACHER_JSON_1.email,
                password: GOOD_TEACHER_JSON_1.password
            });
        
        teacher = res.body.teacher
        token = res.body.token
        teacher_ref = res.body.cleanTeacher;
        
        for (prog in program_jsons) {
            prog = program_jsons[prog]
            res = await request(app)
                .post('/api/program')
                .set('Authorization', 'Bearer ' + token)
                .send(prog)
                .expect(200)
                
            
            

        }
    });

    after(async function() {
        this.timeout(15000);
		await Analytic.deleteMany({}).exec();
        await Teacher.deleteMany({}).exec();
        await FocusItem.deleteMany({}).exec();
        await Program.deleteMany({}).exec();
        await Student.deleteMany({}).exec();
        return;
        
	});

	it('get /api/programs', async function() {
        const res = await request(app)
            .get('/api/programs')
            .set('Authorization', 'Bearer ' + token)
            .expect('Content-Type', /json/)
            .expect(200);

            expect(res.body).to.be.an('object');
            expect(res.body.status).to.be.a('string');
            expect(res.body.status).to.equal('ok');
            expect(res.body.programs).to.be.a('array');
            expect(res.body.programs.length).to.equal(program_jsons.length);
        
        
	});
});