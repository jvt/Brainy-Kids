const expect = require('chai').expect;
const request = require('supertest');
const Teacher = require('../../../backend/models/teacher');
const Student = require('../../../backend/models/student');
const app = require('../../../server');

const PRE_ALL_TEST_USER = {
    name: 'George Burdell',
    email: 'gburdell3@gatech.edu',
    password: '123456789',
    teacher_id: '102',
};

const GOOD_TEACHER_JSON_1 = {
    name: 'Luke Senseney',
    email: 'lsenseney3@gatech.edu',
    password: 'DefinitlyMyPassword',
};

const MISSING_EMAIL = {
    name: 'Luke Senseney',
    email: '',
    password: 'DefinitlyMyPassword',
};

describe('Teacher Controller', function() {
    let token;
    var createdTeacher;

    before(async function() {
        await Teacher.deleteMany({}).exec();

        const tokenUser = await request(app)
            .post('/api/session/register')
            .send(PRE_ALL_TEST_USER)
            .expect('Content-Type', /json/)
            .expect(200);
        token = tokenUser.body.token;
    });

    after(async function() {
        await Teacher.deleteMany({}).exec();
    });

    it('creates a teacher', async function() {
        const res = await request(app)
            .post('/api/session/register')
            .send(GOOD_TEACHER_JSON_1)
            .expect('Content-Type', /json/)
            .expect(200);

        expect(res.body).to.be.an('object');
        expect(res.body.status).to.be.a('string');
        expect(res.body.status).to.equal('ok');
        expect(res.body.teacher._id).be.a('string');
        expect(res.body.teacher.email).equal(GOOD_TEACHER_JSON_1.email);
        expect(res.body.teacher.name).equal(GOOD_TEACHER_JSON_1.name);
        expect(res.body.teacher.password).to.be.undefined;
        expect(res.body.token).to.be.a('string');

        createdTeacher = await Teacher.findById(res.body.teacher._id);
        expect(createdTeacher).to.be.an('object');
        expect(createdTeacher.name).equal(GOOD_TEACHER_JSON_1.name);
    });

    it('gets the info the logged in teacher', async function() {
        const res = await request(app)
            .get('/api/session/info')
            .set('Authorization', 'Bearer ' + token)
            .expect(200);
        expect(res.body).to.be.an('object');
        expect(res.body.status).to.be.a('string');
        expect(res.body.status).to.equal('ok');
        expect(res.body.teacher).to.be.an('object');
        expect(res.body.teacher.name).equals(PRE_ALL_TEST_USER.name);
        expect(res.body.teacher.email).equals(PRE_ALL_TEST_USER.email);
    });

    it("Doesn't allow duplicates", async function() {
        const res = await request(app)
            .post('/api/session/register')
            .send(GOOD_TEACHER_JSON_1)
            .expect(409);

        expect(res.body.status).to.be.a('string');
        expect(res.body.status).to.equal('error');
        expect(res.body.message).to.be.a('string');
    });

    it('Increments ids', async function() {
        const teacher_A = {
            name: 'Not Senseney',
            email: 'lsenseney4@gatech.edu',
            password: 'DefinitlyMyPasswordblah',
        };
        const teacher_B = {
            name: 'Not Senseney',
            email: 'lsenseney5@gatech.edu',
            password: 'ShhhhSecret',
        };
        const res = await request(app)
            .post('/api/session/register')
            .send(teacher_A)
            .expect(200);

        const res2 = await request(app)
            .post('/api/session/register')
            .send(teacher_B)
            .expect(200);

        const A_ID = parseInt(res.body.teacher.teacher_id);
        const B_ID = parseInt(res2.body.teacher.teacher_id);

        expect(A_ID).equal(B_ID - 1);
    });

    var studentToken;
     it('Logs in a student', async function() {
         studentJson = { student_id: '007', teacher: createdTeacher._id };
         var studentId = '007';
         var createdStudent = await new Student(studentJson).save();
         const res = await request(app)
             .post('/api/session/student')
             .send({ student_id: createdTeacher.teacher_id + '007' })
             .expect(200);
         expect(res.body.student._id).equal(createdStudent._id.toString());
         studentToken = res.body.token;
     });

     it('Gets the info of a student', async function() {
         const res = await request(app)
             .get('/api/session/studentinfo')
             .set('Authorization', 'Bearer ' + studentToken)
             .send({})
             .expect(200);
         expect(res.body.student.student_id).equals(studentJson.student_id);
         expect(res.body.student.teacher).equals(studentJson.teacher.toString());
         Student.deleteMany(studentJson);
     });
});
