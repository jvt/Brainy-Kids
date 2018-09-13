//const expect = require('chai').expect;
//const request = require('supertest');
//const app = require('../../server');
//
//describe('GET /status', () => {
//	it('responds with a status ok', async () => {
//		const res = await request(app)
//			.get('/status')
//			.set('Accept', 'application/json')
//			.expect('Content-Type', /json/)
//			.expect(200);
//
//		expect(res.body).to.be.an('object');
//		expect(res.body.status).to.be.a('string');
//		expect(res.body.status).to.equal('ok');
//	});
//});
