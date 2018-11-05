const chai = require('chai');
const expect = require('chai').expect;
const request = require('supertest');
const Analytic = require('../../../backend/models/analytic');
const Teacher = require('../../../backend/models/teacher');
const Student = require('../../../backend/models/student');
const Focus_Item = require('../../../backend/models/focus_item');
const app = require('../../../server');


describe('Creates new analytics', function() {
	var token;
    var createdStudents = [];
    var analytics = [];
    var focusItemId;

	before(async function() {
		await Analytic.deleteMany({}).exec();
		await Teacher.deleteMany({}).exec();
	});

	after(async function() {
		await Analytic.deleteMany({}).exec();
		await Teacher.deleteMany({}).exec();
	});

	it('Creates a teacher to get a JSON token', async function() {
		var teacher_json = {
			name: 'Luke Senseney',
			email: 'lsenseney3@gatech.edu',
			password: 'DefinitlyMyPassword',
		};

		const res = await request(app)
			.post('/api/session/register')
			.send(teacher_json)
			.expect('Content-Type', /json/)
			.expect(200);

		token = res.body.token;

        var other_teacher = {
			name: 'Asher Kenerly',
			email: 'akenerly3@gatech.edu',
			password: 'tawcigwotwd',
		};

		const res2 = await request(app)
			.post('/api/session/register')
			.send(other_teacher)
			.expect('Content-Type', /json/)
			.expect(200);

        var studentJsons = [{ student_id: '007', teacher: res.body.teacher._id },
            { student_id: '011', teacher: res.body.teacher._id },
            { student_id: '012', teacher: res.body.teacher._id },
            { student_id: '023', teacher: res2.body.teacher._id }];

        for(i in studentJsons)
            createdStudents.push(await new Student(studentJsons[i]).save());


        focusItem = {
            name:"adhd medicine",
            program: '123456789012',
            unit: "grams"
        }
        var createdFocusItem = await new Focus_Item(focusItem).save();
        focusItemId = createdFocusItem._id;
	});

    var invalid_app_analytic;


	it('hearatale - responds with a status ok', async function() {
        var valid_hearatale_analytic = {
            student:createdStudents[0]._id,
            focus_item:focusItemId,
            program: '123456789012',
            time_watching: '3',
            total_video_time: '10000',
            updated_at: Date.now(),
            created_at: Date.now(),
        };

		const res = await request(app)
			.post('/api/analytics/hearatale')
			.set('Authorization', 'Bearer ' + token)
			.send(valid_hearatale_analytic)
            .expect('Content-Type', /json/)
            .expect(200);
	});

	it('application - responds with a status ok', async function() {
        for(i in createdStudents){
            var valid_app_analytic = {
                student: createdStudents[i]._id,
                focus_item:focusItemId,
                program: '123456789012',
                correct_on: parseInt(i) + 1,
                time_spent: 10000,
                updated_at: Date.now(),
                created_at: Date.now(),
            };

            const res = await request(app)
                .post('/api/analytics/application')
                .set('Authorization', 'Bearer ' + token)
                .send(valid_app_analytic)
                .expect('Content-Type', /json/)
                .expect(200);
            analytics.push(valid_app_analytic);
        }
	});
	it('hearatale - invalid', async function() {
        invalid_app_analytic = {
            student:createdStudents[0]._id,
            focus_item:focusItemId,
            program: '123456789012',
            correct_on: '3',
            time_watching: '10000',
        };

		const res = await request(app)
			.post('/api/analytics/hearatale')
			.set('Authorization', 'Bearer ' + token)
			.send(invalid_app_analytic)
			.expect('Content-Type', /json/)
			.expect(500);
	});
	it('application - invalid', async function() {
		const res = await request(app)
			.post('/api/analytics/application')
			.set('Authorization', 'Bearer ' + token)
			.send(invalid_app_analytic)
			.expect('Content-Type', /json/)
			.expect(500);
	});

    it('fetches analytics for a single student', async function() {
        const res = await request(app)
            .get('/api/analytics/focusitem')
			.set('Authorization', 'Bearer ' + token)
            .send({student:createdStudents[0]._id, focus_item:focusItemId})
            .expect('Content-Type', /json/)
            .expect(200);

        var analytic = res.body.analytics[createdStudents[0]._id.toString()];
        expect(analytic.correct_on).equal(analytics[0].correct_on);
        expect(analytic.focus_item).equal(analytics[0].focus_item.toString());
        expect(analytic.student).equal(analytics[0].student.toString());
        expect(analytic.time_spent).equal(analytics[0].time_spent);
    });

    it('fetches analytics for two out of three students', async function() {
    });
});
