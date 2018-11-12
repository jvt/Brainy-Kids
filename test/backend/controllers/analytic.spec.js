const ingest = require('../ingest')
const Analytic = require('../../../backend/models/analytic');
const Teacher = require('../../../backend/models/teacher');
const Student = require('../../../backend/models/student');
const Focus_Item = require('../../../backend/models/focus_item');
const Program = require('../../../backend/models/program');

describe('Runs ingest script', function() {
    it('Runs it.', function(done) {
        this.timeout(15000);
        Analytic.deleteMany({}).then(function() {
            Teacher.deleteMany({}).then(function() {
                Student.deleteMany({}).then(function() {
                    Focus_Item.deleteMany({}).then(function() {
                        Program.deleteMany({}).then(function() {
                            ingest.ingest(45,100,15);
                            done();
                        });
                    });
                });
            });
        });
    });
});