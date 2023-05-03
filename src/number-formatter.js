import { escapeRegExp } from './helpers.js';

/**
 * NumberFormatter class
 * @class
 */
export default class NumberFormatter {
    /**
     * New NumberFormatter constructor.
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
     */
    constructor(locale, options) {
        this.group = '';
        this.decimal = '.';
        this._minusIndex = 1;
        this._numberIndex = 2;

        this._formatter = new Intl.NumberFormat(locale, options);

        const parts = this._formatter.formatToParts(-10000000.1);
        for (const part of parts) {
            switch (part.type) {
                case 'group':
                    this.group = part.value;
                    break;
                case 'decimal':
                    this.decimal = part.value;
                    break;
            }
        }

        const baseFormatter = new Intl.NumberFormat(locale);

        this.digits = new Array(10)
            .fill()
            .map((_, i) => baseFormatter.format(i));

        const decimalRegExp = escapeRegExp(this.decimal);
        const digitRegExp = `[${this.digits.map(escapeRegExp).join('')}]`;
        const groupRegExp = escapeRegExp(this.group);

        const numberRegExp = this.group ?
            `(?:${digitRegExp}{1,3}${groupRegExp})*${digitRegExp}{1,3}(?:${decimalRegExp}${digitRegExp}+)?` :
            `${digitRegExp}+(?:${decimalRegExp}${digitRegExp}+)?`;

        let numberAdded = false;
        let regExp = '';

        for (const part of parts) {
            switch (part.type) {
                case 'literal':
                case 'currency':
                    regExp += `(?:${escapeRegExp(part.value)})?`;
                    break;
                case 'minusSign':
                    if (numberAdded) {
                        this._minusIndex = 2;
                        this._numberIndex = 1;
                    }

                    regExp += `(${escapeRegExp(part.value)})?`;
                    break;
                case 'integer':
                    if (!numberAdded) {
                        numberAdded = true;

                        regExp += `(${numberRegExp})`;
                    }
                    break;
            }
        }

        this._regExp = new RegExp(regExp);
    }

    /**
     * Return a formatted number string, using the locale and formatting options.
     * @param {number} number The number to format.
     * @return {string} The formatted number string.
     */
    format(number) {
        return this._formatter.format(number);
    }

    /**
     * Return an array of objects, containing the formatted number string in parts.
     * @param {number} number The number to format.
     * @return {object[]} The formatted number, as an array of parts.
     */
    formatToParts(number) {
        return this._formatter.formatToParts(number);
    }

    /**
     * Return a parsed number from a formatted number string.
     * @param {string} numberString The formatted number string.
     * @return {number} The parsed number.
     */
    parse(numberString) {
        const match = this._regExp.exec(numberString);

        if (!match) {
            throw new Error('Invalid number string');
        }

        let parsedString = '';

        if (match[this._minusIndex]) {
            parsedString += '-';
        }

        parsedString += match[this._numberIndex].replace(
            /./g,
            (match) => (
                this.digits.includes(match) ?
                    this.digits.indexOf(match) :
                    (
                        match === this.decimal ?
                            '.' :
                            ''
                    )
            ),
        );

        return parseFloat(parsedString);
    }

    /**
     * Return an object with the locale and formatting options.
     * @return {object} The computed locale and formatting options.
     */
    resolvedOptions() {
        return this._formatter.resolvedOptions();
    }

    /**
     * Return an array of supported locales.
     * @param {string|string[]} locales The locale(s) to test for support.
     * @param {object} [options] The options to use for testing support.
     * @param {string} [options.localeMatcher] The locale matching algorithm to use.
     * @return {string[]} An array of strings, containing matching supported locales.
     */
    static supportedLocalesOf(locales, options) {
        return Intl.NumberFormat.supportedLocalesOf(locales, options);
    }
}
