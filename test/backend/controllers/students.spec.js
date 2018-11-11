const sinon = require('sinon');
const expect = require('chai').expect;
const request = require('supertest');
const app = require('../../../server');

const mongoose = require('mongoose');
const Student = require('../../../backend/models/student');
const Teacher = require('../../../backend/models/teacher');
const fixtures = require('../../fixtures/student');

const sessionFixtures = require('../../fixtures/session');

describe('GET /api/students', function() {
	beforeEach(function() {
		sinon.stub(Student, 'find');
		sinon.stub(Teacher, 'findById'); // For the auth token
		Teacher.findById
			.withArgs('5bdf58e7b9bfebb9ee3848d9') // Authorization ID
			.resolves(sessionFixtures.TEACHER_MODEL);
	});
	afterEach(function() {
		Student.find.restore();
		Teacher.findById.restore();
	});
	it('responds with an unauthroized if theres no auth token', function(done) {
		request(app)
			.get('/api/students')
			.set('Accept', 'application/json')
			.expect(function(res) {
				expect(res.text).to.be.a('string');
				expect(res.text).to.equal('Unauthorized');
			})
			.expect(401, done);
	});
	it('responds with an array of students', function(done) {
		Student.find.resolves(fixtures.validGetAll);

		request(app)
			.get('/api/students')
			.set('Authorization', `Bearer ${sessionFixtures.TEACHER_TOKEN}`)
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/)
			.expect(function(res) {
				expect(res.body).to.be.an('object');
				expect(res.body.status).to.be.a('string');
				expect(res.body.status).to.equal('ok');
				expect(res.body.students).to.be.an('array');
				expect(res.body.students).to.deep.equal(fixtures.validGetAll);
			})
			.expect(200, done);
	});
	it('responds with an empty array if there are no students', function(done) {
		Student.find.resolves(null);

		request(app)
			.get('/api/students')
			.set('Authorization', `Bearer ${sessionFixtures.TEACHER_TOKEN}`)
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/)
			.expect(function(res) {
				expect(res.body).to.be.an('object');
				expect(res.body.status).to.be.a('string');
				expect(res.body.status).to.equal('ok');
				expect(res.body.students).to.be.an('array');
				expect(res.body.students.length).to.equal(0);
			})
			.expect(200, done);
	});
});

describe('GET /api/student/:id', function() {
	beforeEach(function() {
		sinon.stub(Student, 'findById');
		sinon.stub(Teacher, 'findById'); // For the auth token
		Teacher.findById
			.withArgs('5bdf58e7b9bfebb9ee3848d9') // Authorization ID
			.resolves(sessionFixtures.TEACHER_MODEL);
	});
	afterEach(function() {
		Student.findById.restore();
		Teacher.findById.restore();
	});
	it('responds with an unauthroized if theres no auth token', function(done) {
		request(app)
			.get('/api/students')
			.set('Accept', 'application/json')
			.expect(function(res) {
				expect(res.text).to.be.a('string');
				expect(res.text).to.equal('Unauthorized');
			})
			.expect(401, done);
	});
	it('responds with a student object', function(done) {
		Student.findById.resolves(fixtures.valid);

		request(app)
			.get('/api/student/5bb1495f63240ad534d40c2d')
			.set('Authorization', `Bearer ${sessionFixtures.TEACHER_TOKEN}`)
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/)
			.expect(function(res) {
				expect(res.body).to.be.an('object');
				expect(res.body.status).to.be.a('string');
				expect(res.body.status).to.equal('ok');
				expect(res.body.student).to.be.an('object');
				expect(res.body.student).to.deep.equal(fixtures.valid);
			})
			.expect(200, done);
	});
	it('responds with null if no student is found', function(done) {
		Student.findById.resolves(null);

		request(app)
			.get('/api/student/5bb1495f63240ad534d40c2d')
			.set('Authorization', `Bearer ${sessionFixtures.TEACHER_TOKEN}`)
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/)
			.expect(function(res) {
				expect(res.body).to.be.an('object');
				expect(res.body.status).to.be.a('string');
				expect(res.body.status).to.equal('ok');
				expect(res.body.student).to.equal(null);
			})
			.expect(200, done);
	});
});

describe('POST /api/student', function() {
	beforeEach(function() {
		sinon.stub(Teacher, 'findById'); // For the auth token
		Teacher.findById
			.withArgs('5bdf58e7b9bfebb9ee3848d9') // Authorization ID
			.resolves(sessionFixtures.TEACHER_MODEL);

		sinon.stub(Student.prototype, 'save');
	});
	afterEach(function() {
		Teacher.findById.restore();
		Student.prototype.save.restore();
	});
	it('responds with an unauthroized if theres no auth token', function(done) {
		request(app)
			.post('/api/student')
			.set('Accept', 'application/json')
			.expect(function(res) {
				expect(res.text).to.be.a('string');
				expect(res.text).to.equal('Unauthorized');
			})
			.expect(401, done);
	});
	it('responds with a 200 and student object if the student is created successfully', function(done) {
		Teacher.findById.withArgs('test_id').resolves({
			_id: 'test_id',
			name: 'George Burdell',
			teacher_id: '998',
			email: 'gburdell3@gatech.edu',
		});

		Student.prototype.save.resolves({
			_id: mongoose.Types.ObjectId(),
			teacher: 'test_id',
			student_id: '100',
			deleted: false,
		});

		request(app)
			.post('/api/student')
			.set('Authorization', `Bearer ${sessionFixtures.TEACHER_TOKEN}`)
			.set('Accept', 'application/json')
			.send({
				teacher: 'test_id',
				student_id: '100',
				deleted: false,
			})
			.expect('Content-Type', /json/)
			.expect(function(res) {
				expect(res.body).to.be.an('object');
				expect(res.body.status).to.be.a('string');
				expect(res.body.status).to.equal('ok');
				expect(res.body.student).to.be.an('object');
				expect(res.body.student._id).to.be.a('string');
				expect(res.body.student.teacher).to.equal('test_id');
				expect(res.body.student.deleted).to.be.false;
				expect(res.body.student.student_id).to.equal('100');
			})
			.expect(200, done);
	});
	it("responds with a 404 if the teacher can't be found", function(done) {
		Teacher.findById.withArgs('missing teacher').resolves(null);

		request(app)
			.post('/api/student')
			.set('Authorization', `Bearer ${sessionFixtures.TEACHER_TOKEN}`)
			.set('Accept', 'application/json')
			.send({
				teacher: 'missing teacher',
				student_id: '100',
				deleted: false,
			})
			.expect('Content-Type', /json/)
			.expect(function(res) {
				expect(res.body).to.be.an('object');
				expect(res.body.status).to.be.a('string');
				expect(res.body.status).to.equal('error');
				expect(res.body.message).to.be.a('string');
			})
			.expect(404, done);
	});
});
