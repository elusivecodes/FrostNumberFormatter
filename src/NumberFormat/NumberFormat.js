/**
 * NumberFormat class
 * @class
 */
class NumberFormat {

    /**
     * New NumberFormat constructor.
     * @param {string|string[]} [locale] The locale(s) to use for formatting.
     * @param {object} [options] The options to use for formatting.
     * @param {string} [options.localeMatcher] The locale matching algorithm to use.
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
        this._formatter = new Intl.NumberFormat(locale, options);

        const baseFormatter = new Intl.NumberFormat(locale);

        this._digits = new Array(10)
            .fill()
            .map((_, i) =>
                baseFormatter.format(i)
            );

        const digitRegExp = `[${this._digits.map(NumberFormat._escapeRegExp).join('')}]`,
            parts = this._formatter.formatToParts(-10000000.1);

        this._minus = parts.find(part => part.type === 'minusSign').value || '-';
        this._group = parts.find(part => part.type === 'group').value || '';
        this._decimal = parts.find(part => part.type === 'decimal').value || '.';
        this._minusIndex = 1;
        this._numberIndex = 2;

        let numberAdded = false;

        const numberRegExp = (
            this._group ?
                `(?:${digitRegExp}{1,3}${NumberFormat._escapeRegExp(this._group)})*${digitRegExp}{1,3}` :
                `${digitRegExp}+`
        ) + `(?:${NumberFormat._escapeRegExp(this._decimal)}${digitRegExp}+)?`,
            regExp = parts.reduce((acc, part) => {
                if (['literal', 'currency'].includes(part.type)) {
                    acc += `(?:${NumberFormat._escapeRegExp(part.value)})?`;
                } else if (part.type === 'minusSign') {
                    if (numberAdded) {
                        this._minusIndex = 2;
                        this._numberIndex = 1;
                    }

                    acc += `(${NumberFormat._escapeRegExp(part.value)})?`;
                } else if (part.type === 'integer' && !numberAdded) {
                    numberAdded = true;

                    acc += `(${numberRegExp})`;
                }

                return acc;
            }, '');

        this._regExp = new RegExp(regExp);
    }

    /**
     * Return a formatted number string, using the locale and formatting options.
     * @param {number} number The number to format.
     * @returns {string} The formatted number string.
     */
    format(number) {
        return this._formatter.format(number);
    }

    /**
     * Return an array of objects, containing the formatted number string in parts.
     * @param {number} number The number to format.
     * @returns {object[]} The formatted number, as an array of parts.
     */
    formatToParts(number) {
        return this._formatter.formatToParts(number);
    }

    /**
     * Return a parsed number from a formatted number string.
     * @param {string} numberString The formatted number string.
     * @returns {number} The parsed number.
     */
    parse(numberString) {
        const match = this._regExp.exec(numberString);

        if (!match) {
            throw new Error('Invalid number string');
        }

        return parseFloat(
            `${(
                match[this._minusIndex] ?
                    '-' :
                    ''
            )}${match[this._numberIndex].replace(
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
     * Return an object with the locale and formatting options.
     * @returns {object} The computed locale and formatting options.
     */
    resolvedOptions() {
        return this._formatter.resolvedOptions();
    }

    /**
     * Return an array of supported locales.
     * @param {string|string[]} locales The locale(s) to test for support.
     * @param {object} [options] The options to use for testing support.
     * @param {string} [options.localeMatcher] The locale matching algorithm to use.
     * @returns {string[]} An array of strings, containing matching supported locales.
     */
    static supportedLocalesOf(locales, options) {
        return Intl.NumberFormat.supportedLocalesOf(locales, options);
    }

    /**
     * Return an escaped string for use in RegEx.
     * @param {string} string The string to escape.
     * @returns {string} The escaped string.
     */
    static _escapeRegExp(string) {
        return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$$&');
    }

}
