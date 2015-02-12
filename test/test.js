var headerfooter = require('../main');

exports['Exported Properly'] = function(test) {
    test.expect(3);

    test.equal(typeof headerfooter, 'object');
    test.equal(typeof headerfooter.In, 'function');
    test.equal(typeof headerfooter.Out, 'function');

    test.done();
};

exports['New Out'] = function(test) {
    test.expect(2);

    var add_headerfooter = new headerfooter.Out();
    add_headerfooter.header = {
        name: "streamA",
        metadata: [23, 33, 221, 222]
    };
    add_headerfooter.footer = {
        exit_code: 2
    };

    test.equal(typeof add_headerfooter.header, 'object');
    test.equal(typeof add_headerfooter.footer, 'object');

    test.done();
};

exports['tearDown'] = function(done) {
    done();
};
