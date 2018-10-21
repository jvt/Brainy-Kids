const chai = require('chai');
const request = require('supertest');
const Analytic = require('../../../backend/models/analytic');
const app = require('../../../server');

var valid_app_analytic = {
	student: '123456789012',
	focus_item: '123456789012',
	program: '123456789012',
	correct_on: '3',
	time_spent: '10000',
	updated_at: Date.now(),
	created_at: Date.now(),
};

var invalid_app_analytic = {
	student: '123456789012',
	focus_item: '123456789012',
	program: '123456789012',
	correct_on: '3',
	time_watching: '10000',
};

var valid_hearatale_analytic = {
	student: '123456789012',
	focus_item: '123456789012',
	program: '123456789012',
	time_watching: '3',
	total_video_time: '10000',
	updated_at: Date.now(),
	created_at: Date.now(),
};

describe('Creates new analytics', () => {
	it('hearatale - responds with a status ok', async () => {
		const res = await request(app)
			.post('/api/analytics/hearatale')
			.send(valid_hearatale_analytic)
			.expect('Content-Type', /json/)
			.expect(200);
	});
	it('application - responds with a status ok', async () => {
		const res = await request(app)
			.post('/api/analytics/application')
			.send(valid_app_analytic)
			.expect('Content-Type', /json/)
			.expect(200);
	});
	it('hearatale - invalid', async () => {
		const res = await request(app)
			.post('/api/analytics/hearatale')
			.send(invalid_app_analytic)
			.expect('Content-Type', /json/)
			.expect(500);
	});
	it('application - invalid', async () => {
		const res = await request(app)
			.post('/api/analytics/application')
			.send(invalid_app_analytic)
			.expect('Content-Type', /json/)
			.expect(500);
	});
});
