/**
 * NumberFormat class
 * @class
 */
class NumberFormat {

    /**
     * New NumberFormat constructor.
     * @param {string|array} [locale] The locale(s) to use for formatting.
     * @param {object} [options] The options to use for formatting.
     * @param {string} [options.localeMatch] The locale matching algorithm to use.
     * @param {string} [options.style] The formatting style to use.
     * @param {string} [options.currency] The currency to use in currency formatting.
     * @param {string} [options.currencyDisplay] The method for displaying currency formatting.
     * @param {Boolean} [options.useGrouping] Whether to use grouping separators.
     * @param {number} [options.minimumIntegerDigits] The minimum number of integer digits to use.
     * @param {number} [options.minimumFractionDigits] The minimum number of fraction digits to use.
     * @param {number} [options.maximumFractionDigits] The maximum number of fraction digits to use.
     * @param {number} [options.minimumSignificantDigits] The minimum number of significant digits to use.
     * @param {number} [options.maximumSignificantDigits] The maximum number of significant digits to use.
     * @returns {NumberFormat} The new NumberFormat object.
     */
    constructor(locale, options) {
        this.formatter = new Intl.NumberFormat(locale, options);

        const baseFormatter = new Intl.NumberFormat(locale);

        this._digits = new Array(10)
            .fill()
            .map((_, i) =>
                baseFormatter.format(i)
            );

        const digitRegex = `[${this._digits.map(NumberFormat.regExEscape).join('|')}]`,
            parts = this.formatter.formatToParts(-10000000.1);

        this._minus = parts.find(part => part.type === 'minusSign').value || '-';
        this._group = parts.find(part => part.type === 'group').value || '';
        this._decimal = parts.find(part => part.type === 'decimal').value || '.';

        let numberRegex = '';
        if (this._group) {
            numberRegex += `(?:${digitRegex}{1,3}${NumberFormat.regExEscape(this._group)})*${digitRegex}{1,3}`;
        } else {
            numberRegex += `${digitRegex}+`;
        }

        numberRegex += `(?:${NumberFormat.regExEscape(this._decimal)}${digitRegex}+)?`;

        let regex = '^',
            numberAdded = false,
            minusBefore = false;

        parts.forEach(part => {
            if (['literal', 'currency'].includes(part.type)) {
                regex += NumberFormat.regExEscape(part.value);
            } else if (part.type === 'minusSign') {
                regex += `(${NumberFormat.regExEscape(part.value)}?)`;
                if (!numberAdded) {
                    minusBefore = true;
                }
            } else if (part.type === 'integer' && !numberAdded) {
                regex += `(${numberRegex})`;
                numberAdded = true;
            }
        });

        regex += '$$';

        this.minusIndex = minusBefore ? 1 : 2;
        this.numberIndex = minusBefore ? 2 : 1;

        this.regex = new RegExp(regex);
    }

    format(number) {
        return this.formatter.format(number);
    }

    formatToParts(number) {
        return this.formatter.formatToParts(number);
    }

    /**
     * Return a parsed number from a formatted number string.
     * @param {string} numberString The formatted number string.
     * @returns {number} The parsed number.
     */
    parse(numberString) {
        const match = this.regex.exec(numberString);

        if (!match) {
            throw new Error('Invalid number string');
        }

        return parseFloat(
            `${(
                match[this.minusIndex] ?
                    '-' :
                    ''
            )}${match[this.numberIndex].replace(
                /./g,
                match =>
                    this._digits.includes(match) ?
                        this._digits.indexOf(match) :
                        match === this._decimal ?
                            '.' :
                            ''
            )}`
        );
    }

    /**
     * Return an escaped string for use in RegEx.
     * @param {string} string The string to escape.
     * @returns {string} The escaped string.
     */
    static regExEscape(string) {
        return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$$&');
    }

}
