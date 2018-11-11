const ingest = require('../ingest')


describe('Runs ingest script', function() {
    it('Runs it.', function(done) {
        ingest.ingest(45,100,15).then(done());
    })
});