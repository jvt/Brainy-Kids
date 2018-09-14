const chai = require('chai');
const request = require('supertest');
const Teacher = require('../../../backend/models/teacher');
const app = require('../../../server');

describe('Creates new teacher', () => {
	it('responds with a status ok', async () => {
        var teacher_json = {name:"Luke Senseney", email:"lsenseney3@gatech.edu", password:"DefinitlyMyPassword"};
		const res = await request(app)
			.post('/api/session/newTeacher')
            .send({name:"Luke Senseney", email:"lsenseney3@gatech.edu", password:"DefinitlyMyPassword"})
			.expect('Content-Type', /json/)
			.expect(200);

		chai.expect(res.body).to.be.an('object');
		chai.expect(res.body.status).to.be.a('string');
		chai.expect(res.body.status).to.equal('success');

        Teacher.deleteMany({name:"Luke Senseney"}).exec();
	});
});

