const chai = require('chai');
const request = require('supertest');
const Teacher = require('../../../backend/models/teacher');
const app = require('../../../server');

describe('Creates new teacher', () => {
	it('responds with a status ok', async () => {
        Teacher.deleteMany({name:"Luke Senseney"}).exec();
        Teacher.deleteMany({name:"Not Senseney"}).exec();

        var teacher_json = {name:"Luke Senseney", email:"lsenseney3@gatech.edu", password:"DefinitlyMyPassword"};
		const res = await request(app)
			.post('/api/session/register')
            .send(teacher_json)
			.expect('Content-Type', /json/)
			.expect(200);

		chai.expect(res.body).to.be.an('object');
		chai.expect(res.body.status).to.be.a('string');
		chai.expect(res.body.status).to.equal('success');
        chai.expect(res.body.teacher.email).equal("lsenseney3@gatech.edu");
        chai.expect(res.body.teacher.name).equal("Luke Senseney");

        var createdTeacher = await Teacher.find({email:"lsenseney3@gatech.edu"});
        chai.expect(createdTeacher.length).equal(1);
        chai.expect(createdTeacher[0].name).equal("Luke Senseney");

        var teacher_json2 = {name:"Not Senseney", email:"LSEnseney3@gatech.edu", password:"DefinitlyMyPasswordblah"};
		const res2 = await request(app)
			.post('/api/session/register')
            .send(teacher_json2)
			.expect(409);

        var teacher_json3 = {name:"Not Senseney", email:"lsenseney4@gatech.edu", password:"DefinitlyMyPasswordblah"}
		const res3 = await request(app)
			.post('/api/session/register')
            .send(teacher_json3)
			.expect(200);

        var createdTeacher2 = await Teacher.find({email:"lsenseney4@gatech.edu"});
        chai.expect(createdTeacher2.length).equal(1);
        chai.expect(parseInt(createdTeacher2[0].teacher_id)).equal(parseInt(createdTeacher[0].teacher_id) + 1);

        Teacher.deleteMany({name:"Luke Senseney"}).exec();
        Teacher.deleteMany({name:"Not Senseney"}).exec();
	});
});
