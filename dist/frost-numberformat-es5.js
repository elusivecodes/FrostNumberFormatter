"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/**
 * FrostNumberFormat v1.0
 * https://github.com/elusivecodes/FrostNumberFormat
 */
(function (global, factory) {
  if ((typeof module === "undefined" ? "undefined" : _typeof(module)) === 'object' && _typeof(module.exports) === 'object') {
    module.exports = factory();
  } else {
    global.NumberFormat = factory();
  }
})(void 0, function () {
  'use strict';
  /**
   * NumberFormat class
   * @class
   */

  var NumberFormat =
  /*#__PURE__*/
  function () {
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
    function NumberFormat(locale, options) {
      var _this = this;

      _classCallCheck(this, NumberFormat);

      this._formatter = new Intl.NumberFormat(locale, options);
      var baseFormatter = new Intl.NumberFormat(locale);
      this._digits = new Array(10).fill().map(function (_, i) {
        return baseFormatter.format(i);
      });

      var digitRegex = "[".concat(this._digits.map(NumberFormat._regExEscape).join('|'), "]"),
          parts = this._formatter.formatToParts(-10000000.1);

      this._minus = parts.find(function (part) {
        return part.type === 'minusSign';
      }).value || '-';
      this._group = parts.find(function (part) {
        return part.type === 'group';
      }).value || '';
      this._decimal = parts.find(function (part) {
        return part.type === 'decimal';
      }).value || '.';
      var numberRegex = '';

      if (this._group) {
        numberRegex += "(?:".concat(digitRegex, "{1,3}").concat(NumberFormat._regExEscape(this._group), ")*").concat(digitRegex, "{1,3}");
      } else {
        numberRegex += "".concat(digitRegex, "+");
      }

      numberRegex += "(?:".concat(NumberFormat._regExEscape(this._decimal)).concat(digitRegex, "+)?");
      var regex = '',
          numberAdded = false;
      this._minusIndex = 1;
      this._numberIndex = 2;
      parts.forEach(function (part) {
        if (['literal', 'currency'].includes(part.type)) {
          regex += "".concat(NumberFormat._regExEscape(part.value), "?");
        } else if (part.type === 'minusSign') {
          regex += "(".concat(NumberFormat._regExEscape(part.value), "?)");

          if (numberAdded) {
            _this._minusIndex = 2;
            _this._numberIndex = 1;
          }
        } else if (part.type === 'integer' && !numberAdded) {
          regex += "(".concat(numberRegex, ")");
          numberAdded = true;
        }
      });
      this._regex = new RegExp(regex);
    }
    /**
     * Return a formatted number string, using the locale and formatting options.
     * @param {number} number The number to format.
     * @returns {string} The formatted number string.
     */


    _createClass(NumberFormat, [{
      key: "format",
      value: function format(number) {
        return this._formatter.format(number);
      }
      /**
       * Return an array of objects, containing the formatted number string in parts.
       * @param {number} number The number to format.
       * @returns {object[]} The formatted number, as an array of parts.
       */

    }, {
      key: "formatToParts",
      value: function formatToParts(number) {
        return this._formatter.formatToParts(number);
      }
      /**
       * Return a parsed number from a formatted number string.
       * @param {string} numberString The formatted number string.
       * @returns {number} The parsed number.
       */

    }, {
      key: "parse",
      value: function parse(numberString) {
        var _this2 = this;

        var match = this._regex.exec(numberString);

        if (!match) {
          throw new Error('Invalid number string');
        }

        return parseFloat("".concat(match[this._minusIndex] ? '-' : '').concat(match[this._numberIndex].replace(/./g, function (match) {
          return _this2._digits.includes(match) ? _this2._digits.indexOf(match) : match === _this2._decimal ? '.' : '';
        })));
      }
      /**
       * Return an object with the locale and formatting options.
       * @returns {object} The computed locale and formatting options.
       */

    }, {
      key: "resolvedOptions",
      value: function resolvedOptions() {
        return this._formatter.resolvedOptions();
      }
      /**
       * Return an array of supported locales.
       * @param {string|string[]} locales The locale(s) to test for support.
       * @param {object} [options] The options to use for testing support.
       * @param {string} [options.localeMatcher] The locale matching algorithm to use.
       * @returns {string[]} An array of strings, containing matching supported locales.
       */

    }], [{
      key: "supportedLocalesOf",
      value: function supportedLocalesOf(locales, options) {
        return Intl.NumberFormat.supportedLocalesOf(locales, options);
      }
      /**
       * Return an escaped string for use in RegEx.
       * @param {string} string The string to escape.
       * @returns {string} The escaped string.
       */

    }, {
      key: "_regExEscape",
      value: function _regExEscape(string) {
        return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      }
    }]);

    return NumberFormat;
  }();

  return NumberFormat;
});