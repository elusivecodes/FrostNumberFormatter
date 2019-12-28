const assert = require('assert').strict;
const NumberFormat = require('./dist/frost-numberformat.min');

describe('NumberFormat tests', function() {

    describe('#format', function() {
        it('formats a number to a string', function() {
            assert.equal(
                new NumberFormat('en-US').format(123456.789),
                '123,456.789'
            );
        });

        it('works with locales', function() {
            assert.equal(
                new NumberFormat('de-DE').format(123456.789),
                '123.456,789'
            );
        });

        it('works with locale numerals', function() {
            assert.equal(
                new NumberFormat('ar-AR').format(123456.789),
                '١٢٣٬٤٥٦٫٧٨٩'
            );
        });

        it('works with currencies', function() {
            assert.equal(
                new NumberFormat(
                    'en-GB',
                    {
                        style: 'currency',
                        currency: 'GBP'
                    }
                ).format(123456.78),
                '£123,456.78'
            );
        });

        it('works with currencies and locales', function() {
            assert.equal(
                new NumberFormat(
                    'de-DE',
                    {
                        style: 'currency',
                        currency: 'AUD'
                    }
                ).format(123456.78),
                '123.456,78\xa0AU$'
            );
        });
    });

    describe('#formatToParts', function() {
        it('returns an array of formatted parts', function() {
            assert.deepEqual(
                new NumberFormat('en-US').formatToParts(123456.789),
                [
                    {
                        type: 'integer',
                        value: '123'
                    },
                    {
                        type: 'group',
                        value: ','
                    },
                    {
                        type: 'integer',
                        value: '456'
                    },
                    {
                        type: 'decimal',
                        value: '.'
                    },
                    {
                        type: 'fraction',
                        value: '789'
                    }
                ]
            );
        });

        it('works with locales', function() {
            assert.deepEqual(
                new NumberFormat('de-DE').formatToParts(123456.789),
                [
                    {
                        type: 'integer',
                        value: '123'
                    },
                    {
                        type: 'group',
                        value: '.'
                    },
                    {
                        type: 'integer',
                        value: '456'
                    },
                    {
                        type: 'decimal',
                        value: ','
                    },
                    {
                        type: 'fraction',
                        value: '789'
                    }
                ]
            );
        });

        it('works with locale numerals', function() {
            assert.deepEqual(
                new NumberFormat('ar-AR').formatToParts(123456.789),
                [
                    {
                        type: 'integer',
                        value: '١٢٣'
                    },
                    {
                        type: 'group',
                        value: '٬'
                    },
                    {
                        type: 'integer',
                        value: '٤٥٦'
                    },
                    {
                        type: 'decimal',
                        value: '٫'
                    },
                    {
                        type: 'fraction',
                        value: '٧٨٩'
                    }
                ]
            );
        });

        it('works with currencies', function() {
            assert.deepEqual(
                new NumberFormat(
                    'en-GB',
                    {
                        style: 'currency',
                        currency: 'GBP'
                    }
                ).formatToParts(123456.78),
                [
                    {
                        type: 'currency',
                        value: '£'
                    },
                    {
                        type: 'integer',
                        value: '123'
                    },
                    {
                        type: 'group',
                        value: ','
                    },
                    {
                        type: 'integer',
                        value: '456'
                    },
                    {
                        type: 'decimal',
                        value: '.'
                    },
                    {
                        type: 'fraction',
                        value: '78'
                    }
                ]
            );
        });

        it('works with currencies and locales', function() {
            assert.deepEqual(
                new NumberFormat(
                    'de-DE',
                    {
                        style: 'currency',
                        currency: 'AUD'
                    }
                ).formatToParts(123456.78),
                [
                    {
                        type: 'integer',
                        value: '123'
                    },
                    {
                        type: 'group',
                        value: '.'
                    },
                    {
                        type: 'integer',
                        value: '456'
                    },
                    {
                        type: 'decimal',
                        value: ','
                    },
                    {
                        type: 'fraction',
                        value: '78'
                    },
                    {
                        type: 'literal',
                        value: '\xa0'
                    },
                    {
                        type: 'currency',
                        value: 'AU$'
                    }
                ]
            );
        });
    });

    describe('#parse', function() {
        it('parses a number from a string', function() {
            assert.equal(
                new NumberFormat('en-US').parse('123,456.789'),
                123456.789
            );
        });

        it('works with locales', function() {
            assert.equal(
                new NumberFormat('de-DE').parse('123.456,789'),
                123456.789
            );
        });

        it('works with locale numerals', function() {
            assert.equal(
                new NumberFormat('ar-AR').parse('١٢٣٬٤٥٦٫٧٨٩'),
                123456.789
            );
        });

        it('works with currencies', function() {
            assert.equal(
                new NumberFormat(
                    'en-GB',
                    {
                        style: 'currency',
                        currency: 'GBP'
                    }
                ).parse('£123,456.78'),
                123456.78
            );
        });

        it('works with currencies and locales', function() {
            assert.equal(
                new NumberFormat(
                    'de-DE',
                    {
                        style: 'currency',
                        currency: 'AUD'
                    }
                ).parse('123.456,78 AU$'),
                123456.78
            );
        });
    });

});
