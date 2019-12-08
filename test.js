const assert = require('assert').strict;
const NumberFormat = require('./dist/frost-numberformat.min');

describe('NumberFormat tests', function() {

    describe('#format', function() {
        it('formats a number', function() {
            assert.equal(
                new NumberFormat('en-US').format(100000.123),
                '100,000.123'
            );
        });

        it('works with locales', function() {
            assert.equal(
                new NumberFormat(
                    'en-GB',
                    {
                        style: 'currency',
                        currency: 'GBP'
                    }
                ).format(999999.50),
                '£999,999.50'
            );
        });
    });

    describe('#parse', function() {
        it('parses a number', function() {
            assert.equal(
                new NumberFormat('en-US').parse('100,000.123'),
                100000.123
            );
        });

        it('works with locales', function() {
            assert.equal(
                new NumberFormat(
                    'en-GB',
                    {
                        style: 'currency',
                        currency: 'GBP'
                    }
                ).parse('£999,999.50'),
                999999.50
            );
        });
    });

});
