const assert = require('assert');
const NumberFormat = require('./dist/frost-numberformat.min');

describe('NumberFormat', function() {

    describe('#format', function() {
        it('formats a number to a string', function() {
            assert.strictEqual(
                new NumberFormat('en-us').format(123456.789),
                '123,456.789'
            );
        });

        it('works with locales', function() {
            assert.strictEqual(
                new NumberFormat('de-de').format(123456.789),
                '123.456,789'
            );
        });

        it('works with locale numerals', function() {
            assert.strictEqual(
                new NumberFormat('ar-eg').format(123456.789),
                '١٢٣٬٤٥٦٫٧٨٩'
            );
        });

        it('works with currencies', function() {
            assert.strictEqual(
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
            assert.strictEqual(
                new NumberFormat(
                    'de-de',
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
            assert.deepStrictEqual(
                new NumberFormat('en-us').formatToParts(123456.789),
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
            assert.deepStrictEqual(
                new NumberFormat('de-de').formatToParts(123456.789),
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
            assert.deepStrictEqual(
                new NumberFormat('ar-eg').formatToParts(123456.789),
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
            assert.deepStrictEqual(
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
            assert.deepStrictEqual(
                new NumberFormat(
                    'de-de',
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
            assert.strictEqual(
                new NumberFormat('en-us').parse('123,456.789'),
                123456.789
            );
        });

        it('works with locales', function() {
            assert.strictEqual(
                new NumberFormat('de-de').parse('123.456,789'),
                123456.789
            );
        });

        it('works with locale numerals', function() {
            assert.strictEqual(
                new NumberFormat('ar-eg').parse('١٢٣٬٤٥٦٫٧٨٩'),
                123456.789
            );
        });

        it('works with currencies', function() {
            assert.strictEqual(
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
            assert.strictEqual(
                new NumberFormat(
                    'de-de',
                    {
                        style: 'currency',
                        currency: 'AUD'
                    }
                ).parse('123.456,78 AU$'),
                123456.78
            );
        });

        it('throws error with invalid string', function() {
            assert.throws(_ => {
                new NumberFormat(
                    'de-de',
                    {
                        style: 'currency',
                        currency: 'AUD'
                    }
                ).parse('INVALID');
            });
        });
    });

});
