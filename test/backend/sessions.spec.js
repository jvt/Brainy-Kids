//const chai = require('chai');
//const request = require('supertest');
//const app = require('../../server');
//
//describe('Creates new teacher', () => {
//	it('responds with a status ok', async () => {
//		const res = await request(app)
//			.get('/sessions/new/teacher')
//			.set('Accept', 'application/json')
//            .send({name:"Luke Senseney", email:"lsenseney3@gatech.edu", password:"DefinitlyMyPassword"})
//			.expect('Content-Type', /json/)
//			.expect(200);
//
//		expect(res.body).to.be.an('object');
//		expect(res.body.status).to.be.a('string');
//		expect(res.body.status).to.equal('ok');
//	});
//});
//
