const chai = require('chai');
const request = require('supertest');
const Teacher = require('../../../backend/models/teacher');
const Student = require('../../../backend/models/student');
const app = require('../../../server');

describe('Creates new teacher', function() {
    var createdTeacher;
    Teacher.deleteMany({name:"Luke Senseney"}).exec();
    Teacher.deleteMany({name:"Not Senseney"}).exec();

	it('creates a teacher', async () => {
        var teacher_json = {name:"Luke Senseney", email:"lsenseney3@gatech.edu", password:"DefinitlyMyPassword"};
		const res = await request(app)
			.post('/api/session/register')
            .send(teacher_json)
			.expect('Content-Type', /json/)
			.expect(200);

		chai.expect(res.body).to.be.an('object');
		chai.expect(res.body.status).to.be.a('string');
		chai.expect(res.body.status).to.equal('ok');
        chai.expect(res.body.teacher.email).equal("lsenseney3@gatech.edu");
        chai.expect(res.body.teacher.name).equal("Luke Senseney");

        createdTeacher = await Teacher.find({email:"lsenseney3@gatech.edu"});
        chai.expect(createdTeacher.length).equal(1);
        chai.expect(createdTeacher[0].name).equal("Luke Senseney");
    });

    it("Doesn't allow duplicates", async () => {
        var teacher_json2 = {name:"Not Senseney", email:"LSEnseney3@gatech.edu", password:"DefinitlyMyPasswordblah"};
		const res2 = await request(app)
			.post('/api/session/register')
            .send(teacher_json2)
			.expect(409);
    });

    it("Increments ids", async () => {
        var teacher_json3 = {name:"Not Senseney", email:"lsenseney4@gatech.edu", password:"DefinitlyMyPasswordblah"}
        const res3 = await request(app)
            .post('/api/session/register')
            .send(teacher_json3)
            .expect(200);

        var createdTeacher2 = await Teacher.find({email:"lsenseney4@gatech.edu"});
        chai.expect(createdTeacher2.length).equal(1);
        chai.expect(parseInt(createdTeacher2[0].teacher_id)).equal(parseInt(createdTeacher[0].teacher_id) + 1);

	});

    it("Logs in a student", async () => {
        studentJson = {student_id:"007", teacher:createdTeacher[0]._id};
        var studentId = "007";
        var createdStudent = await new Student(studentJson).save();
        const res = await request(app).post('/api/session/student').send(
            {student_id:createdTeacher[0].teacher_id + "007"}).expect(200);
        chai.expect(res.body.student._id).equal(createdStudent._id.toString());
        Student.deleteMany(studentJson);
    });

    Teacher.deleteMany({name:"Luke Senseney"}).exec();
    Teacher.deleteMany({name:"Not Senseney"}).exec();
});
