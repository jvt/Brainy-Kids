const expect = require('chai').expect;
const mongoose = require('mongoose');
const sinon = require('sinon');
const sinonMongoose = require('sinon-mongoose');
const request = require('supertest');
const bcrypt = require('bcrypt');

const app = require('../../../server');

const Teacher = require('../../../backend/models/teacher');
const Student = require('../../../backend/models/student');

const teacherFixture = require('../../fixtures/teacher');
const sessionFixture = require('../../fixtures/session');
const studentFixture = require('../../fixtures/student');

describe('POST /api/session/login', function() {
    beforeEach(function() {
        sinon.stub(Teacher, 'findById');
    });
    afterEach(function() {
        Teacher.findById.restore();
    });
    it('errors out if email is not sent', function(done) {
        request(app)
            .post('/api/session/login')
            .send({
                password: '1234',
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(function(res) {
                expect(res.body).to.be.an('object');
                expect(res.body.status).to.be.a('string');
                expect(res.body.status).to.equal('error');
                expect(res.body.message).to.be.a('string');
            })
            .expect(403, done);
    });
    it('errors out if password is not sent', function(done) {
        request(app)
            .post('/api/session/login')
            .send({
                email: 'test@test.com',
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(function(res) {
                expect(res.body).to.be.an('object');
                expect(res.body.status).to.be.a('string');
                expect(res.body.status).to.equal('error');
                expect(res.body.message).to.be.a('string');
            })
            .expect(403, done);
    });
    it('errors out if the teacher cant be found', function(done) {
        sinon
            .mock(Teacher)
            .expects('findOne')
            .chain('select')
            .chain('exec')
            .resolves(null);

        request(app)
            .post('/api/session/login')
            .send({
                email: 'missing@email.com',
                password: '1234',
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(function(res) {
                expect(res.body).to.be.an('object');
                expect(res.body.status).to.be.a('string');
                expect(res.body.status).to.equal('error');
                expect(res.body.message).to.be.a('string');
            })
            .expect(403, done);
    });
    it('errors out if the password does not match', function(done) {
        sinon
            .mock(Teacher)
            .expects('findOne')
            .chain('select')
            .chain('exec')
            .resolves(new Teacher(teacherFixture.valid));

        request(app)
            .post('/api/session/login')
            .send({
                email: 'missing@email.com',
                password: '1234',
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(function(res) {
                expect(res.body).to.be.an('object');
                expect(res.body.status).to.be.a('string');
                expect(res.body.status).to.equal('error');
                expect(res.body.message).to.be.a('string');
            })
            .expect(403, done);
    });
    it('succeeds with a token and the user object if the password is correct', function(done) {
        sinon
            .mock(Teacher)
            .expects('findOne')
            .chain('select')
            .chain('exec')
            .resolves(new Teacher(teacherFixture.valid));

        Teacher.findById.resolves(teacherFixture.valid);

        request(app)
            .post('/api/session/login')
            .send({
                email: 'missing@email.com',
                password: '123456789',
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(function(res) {
                expect(res.body).to.be.an('object');
                expect(res.body.status).to.be.a('string');
                expect(res.body.status).to.equal('ok');
                expect(res.body.token).to.be.a('string');
                expect(res.body.teacher).to.be.an('object');
            })
            .expect(200, done);
    });
});

describe('POST /api/session/student', function() {
    it('errors out if student_id is not sent', function(done) {
        request(app)
            .post('/api/session/student')
            .send({})
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(function(res) {
                expect(res.body).to.be.an('object');
                expect(res.body.status).to.be.a('string');
                expect(res.body.status).to.equal('error');
                expect(res.body.message).to.be.a('string');
            })
            .expect(400, done);
    });
    it('errors out if the teacher cant be found', function(done) {
        sinon
            .mock(Teacher)
            .expects('findOne')
            .resolves(null);

        request(app)
            .post('/api/session/student')
            .send({
                student_id: '999123',
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(function(res) {
                expect(res.body).to.be.an('object');
                expect(res.body.status).to.be.a('string');
                expect(res.body.status).to.equal('error');
                expect(res.body.message).to.be.a('string');
            })
            .expect(403, done);
    });
    it('errors out if the student cant be found', function(done) {
        sinon
            .mock(Teacher)
            .expects('findOne')
            .resolves(new Teacher(teacherFixture.valid));

        sinon
            .mock(Student)
            .expects('findOne')
            .resolves(null);

        request(app)
            .post('/api/session/student')
            .send({
                student_id: '999123',
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(function(res) {
                expect(res.body).to.be.an('object');
                expect(res.body.status).to.be.a('string');
                expect(res.body.status).to.equal('error');
                expect(res.body.message).to.be.a('string');
            })
            .expect(403, done);
    });
    it('succeeds with a token and the user object if the correct ID is provided', function(done) {
        sinon
            .mock(Teacher)
            .expects('findOne')
            .resolves(new Teacher(teacherFixture.valid));

        sinon
            .mock(Student)
            .expects('findOne')
            .resolves(new Student(studentFixture.valid));

        request(app)
            .post('/api/session/student')
            .send({
                student_id: '999123',
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(function(res) {
                expect(res.body).to.be.an('object');
                expect(res.body.status).to.be.a('string');
                expect(res.body.status).to.equal('ok');
                expect(res.body.token).to.be.a('string');
                expect(res.body.student).to.be.an('object');
            })
            .expect(200, done);
    });
});

describe('GET /api/session/info', function() {
    beforeEach(function() {
        sinon.stub(Teacher, 'findById');
    });
    afterEach(function() {
        Teacher.findById.restore();
    });
    it('succeeds with a teacher object if the teacher is found in the database', function(done) {
        Teacher.findById.resolves(new Teacher(teacherFixture.valid));

        request(app)
            .get('/api/session/info')
            .set('Authorization', `Bearer ${sessionFixture.TEACHER_TOKEN}`)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(function(res) {
                expect(res.body).to.be.an('object');
                expect(res.body.status).to.be.a('string');
                expect(res.body.status).to.equal('ok');
                expect(res.body.teacher).to.be.an('object');
            })
            .expect(200, done);
    });
    it('responds with an unauthroized if theres no auth token', function(done) {
        request(app)
            .get('/api/session/info')
            .set('Accept', 'application/json')
            .expect(function(res) {
                expect(res.text).to.be.a('string');
                expect(res.text).to.equal('Unauthorized');
            })
            .expect(401, done);
    });
});

describe('GET /api/session/studentinfo', function() {
    beforeEach(function() {
        sinon.stub(Student, 'findById');
    });
    afterEach(function() {
        Student.findById.restore();
    });
    it('responds with an unauthroized if theres no auth token', function(done) {
        request(app)
            .get('/api/session/studentinfo')
            .set('Accept', 'application/json')
            .expect(function(res) {
                expect(res.text).to.be.a('string');
                expect(res.text).to.equal('Unauthorized');
            })
            .expect(401, done);
    });
    it('succeeds with a teacher object if the teacher is found in the database', function(done) {
        Student.findById.resolves(new Student(sessionFixture.STUDENT_MODEL));

        request(app)
            .get('/api/session/studentinfo')
            .set('Authorization', `Bearer ${sessionFixture.STUDENT_TOKEN}`)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(function(res) {
                expect(res.body).to.be.an('object');
                expect(res.body.status).to.be.a('string');
                expect(res.body.status).to.equal('ok');
                expect(res.body.student).to.be.an('object');
            })
            .expect(200, done);
    });
});

describe('POST /api/session/register', function() {
    beforeEach(function() {
        sinon.stub(bcrypt, 'hashSync');
        sinon.stub(bcrypt, 'genSaltSync');
    });
    afterEach(function() {
        bcrypt.hashSync.restore();
        bcrypt.genSaltSync.restore();
    });
    it('returns an error if a teacher with that email already exists', function(done) {
        const teacherMock = sinon.mock(Teacher);

        teacherMock
            .expects('findOne')
            .withArgs({ email: 'gburdell@gatech.edu' })
            .resolves(new Teacher(sessionFixture.TEACHER_MODEL));

        request(app)
            .post('/api/session/register')
            .send({
                email: 'gburdell@gatech.edu',
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(function(res) {
                expect(res.body).to.be.an('object');
                expect(res.body.status).to.be.a('string');
                expect(res.body.status).to.equal('error');
                expect(res.body.teacher).to.be.undefined;
                expect(res.body.token).to.be.undefined;
                expect(res.body.message).to.be.a('string');
                teacherMock.verify();
                teacherMock.restore();
            })
            .expect(409, done);
    });
    it('returns an error if a teacher with that email already exists - case insensitve check', function(done) {
        const teacherMock = sinon.mock(Teacher);

        teacherMock
            .expects('findOne')
            .withArgs({ email: 'gburdell@gatech.edu' })
            .resolves(new Teacher(sessionFixture.TEACHER_MODEL));

        request(app)
            .post('/api/session/register')
            .send({
                email: 'GBURDELL@GATECH.EDU',
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(function(res) {
                expect(res.body).to.be.an('object');
                expect(res.body.status).to.be.a('string');
                expect(res.body.status).to.equal('error');
                expect(res.body.teacher).to.be.undefined;
                expect(res.body.token).to.be.undefined;
                expect(res.body.message).to.be.a('string');
                teacherMock.verify();
                teacherMock.restore();
            })
            .expect(409, done);
    });
    it('creates a teacher successfully - NOT DONE', function(done) {
        // TODO: RETURN TO THIS TEST
        done();

        const teacherMock = sinon.mock(Teacher);

        // This should result in the new teacher_id being set to 001 since no
        // teachers could be found in the database
        teacherMock
            .expects('findOne')
            .withArgs({})
            .chain('sort')
            .resolves(null);

        teacherMock
            .expects('findOne')
            .withArgs({ email: 'gburdell@gatech.edu' })
            .onFirstCall()
            .resolves(null);

        teacherMock
            .expects('findOne')
            .withArgs({ email: 'gburdell@gatech.edu' })
            .onSecondCall()
            .resolves(new Teacher(sessionFixture.TEACHER_MODEL));

        teacherMock.expects('countDocuments').resolves(0);

        teacherMock
            .expects('create')
            .withArgs({
                email: 'gburdell@gatech.edu',
                name: 'George Burdell',
                password: 'SECRET_HASH',
                teacher_id: '001',
            })
            .resolves(sessionFixture.TEACHER_MODEL);

        bcrypt.genSaltSync.returns('SECRET_SALT');
        bcrypt.hashSync
            .withArgs('123456789', 'SECRET_SALT')
            .returns('SECRET_HASH');

        request(app)
            .post('/api/session/register')
            .send({
                name: 'George Burdell',
                email: 'gburdell@gatech.edu',
                password: '123456789',
                confirm_password: '123456789',
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(function(res) {
                console.log(res.body);
                expect(res.body).to.be.an('object');
                expect(res.body.status).to.be.a('string');
                expect(res.body.status).to.equal('ok');
                expect(res.body.teacher).to.be.an('object');
                expect(res.body.token).to.be.a('string');
                expect(res.body.teacher.password).to.be.undefined;

                expect(Teacher.prototype.save.called).to.be.true;

                teacherMock.verify();
                teacherMock.restore();
            })
            .expect(200, done);
    });
});
