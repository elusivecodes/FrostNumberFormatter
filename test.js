const assert = require('assert').strict;
const NumberFormat = require('./dist/frost-numberformat.min');

try {
    const formatter1 = new NumberFormat('en-US');
    const formatter2 = new NumberFormat('en-GB', { style: 'currency', currency: 'GBP' });
    const formatter3 = new NumberFormat('en-US', { style: 'currency', currency: 'INR' });

    const num1 = 100000.123;
    const num2 = 999999.50;
    const num3 = -66733.15;

    const numString1 = formatter1.format(num1);
    const numString2 = formatter2.format(num2);
    const numString3 = formatter3.format(num3);

    console.log('\x1b[0m');
    console.log('Testing format method');
    assert.equal(
        numString1,
        '100,000.123'
    );
    assert.equal(
        numString2,
        '£999,999.50'
    );
    assert.equal(
        numString3,
        '-₹66,733.15'
    );
    console.log('\x1b[32m', 'passed');

    const numParsed1 = formatter1.parse(numString1);
    const numParsed2 = formatter2.parse(numString2);
    const numParsed3 = formatter3.parse(numString3);

    console.log('\x1b[0m');
    console.log('Testing parse method');
    assert.equal(
        numParsed1,
        num1
    );
    assert.equal(
        numParsed2,
        num2
    );
    assert.equal(
        numParsed3,
        num3
    );
    console.log('\x1b[32m', 'passed');
} catch (error) {
    console.error('\x1b[31m', error.message);
}