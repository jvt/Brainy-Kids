const expect = require('chai').expect;
const request = require('supertest');
const app = require('../../../server');

describe('GET /status', function() {
	it('responds with a status ok', function(done) {
		request(app)
			.get('/status')
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/)
			.expect(function(res) {
				expect(res.body).to.be.an('object');
				expect(res.body.status).to.be.a('string');
				expect(res.body.status).to.equal('ok');
			})
			.expect(200, done);
	});
});
