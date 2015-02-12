var headerfooter = require('../main');

exports['Exported Properly'] = function(test) {
    test.expect(3);

    test.equal(typeof headerfooter, 'object');
    test.equal(typeof headerfooter.In, 'function');
    test.equal(typeof headerfooter.Out, 'function');

    test.done();
};


exports['tearDown'] = function(done) {
    done();
};
