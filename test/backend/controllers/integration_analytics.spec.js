const expect = require('chai').expect;
const request = require('supertest');
const Teacher = require('../../../backend/models/teacher');
const Student = require('../../../backend/models/student');
const Analytic = require('../../../backend/models/analytic');
const Focus_Item = require('../../../backend/models/focus_item');
const Program = require('../../../backend/models/program');
const ingest = require('../ingest');
const app = require('../../../server');


describe('Tests analytics controller with fake database', function() {
    before(function(done) {
        this.timeout(40000);
        Analytic.deleteMany({}).then(function() {
            Teacher.deleteMany({}).then(function() {
                Student.deleteMany({}).then(function() {
                    Focus_Item.deleteMany({}).then(function() {
                        Program.deleteMany({}).then(function() {
                            ingest.ingest(15, 4000, 10, done);
                        });
                    });
                });
            });
        });
    });

    after(function(done) {
        Analytic.deleteMany({}).then(function() {
            Teacher.deleteMany({}).then(function() {
                Student.deleteMany({}).then(function() {
                    Focus_Item.deleteMany({}).then(function() {
                        Program.deleteMany({}).then(function() {
                            done();
                        });
                    });
                });
            });
        });
    });

    var teacher_token;
    it('Logs in with a teacher to yield a token', function(done) {
        request(app)
            .post('/api/session/login')
            .send({
                email: 'asa.klumpp@school.edu',
                password: '12345678'
            })
            .end(function(err, res) {
                teacher_token = res.body.token;
                done();
            });
    });

    it('Calls /api/program/analytics with no focus items', function(done) {
        Program.findOne({}, function(err, doc) {
            // console.log(doc)
            request(app)
                .get('/api/analytics/program')
                .set('Authorization', 'Bearer ' + teacher_token)
                .send({
                    program: doc._id
                })
                .end(function(err, res) {
                    // console.log(err);
                    // console.log(res.error)
                    console.log(res.body)
                    for (fc of res.body.focus_items) {
                        if (fc.analytics.length > 0) {
                            console.log(fc)
                        }
                    }
                    done();
                });
        });
        
    });
});