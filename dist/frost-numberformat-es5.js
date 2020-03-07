"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/**
 * FrostNumberFormat v1.0.0
 * https://github.com/elusivecodes/FrostNumberFormat
 */
(function (global, factory) {
  'use strict';

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

  var NumberFormat = /*#__PURE__*/function () {
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
      this._strict = false;
      this._minus = '-';
      this._group = '';
      this._decimal = '.';
      this._minusIndex = 1;
      this._numberIndex = 2;

      var parts = this._formatter.formatToParts(-10000000.1);

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = parts[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var part = _step.value;

          switch (part.type) {
            case 'minusSign':
              this._minus = part.value;
              break;

            case 'group':
              this._group = part.value;
              break;

            case 'decimal':
              this._decimal = part.value;
              break;
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      var baseFormatter = new Intl.NumberFormat(locale);
      this._digits = new Array(10).fill().map(function (_, i) {
        return baseFormatter.format(i);
      });
      var digitRegExp = "[".concat(this._digits.map(NumberFormat._escapeRegExp).join(''), "]");
      var numberRegExp = "".concat(this._group ? "(?:".concat(digitRegExp, "{1,3}").concat(NumberFormat._escapeRegExp(this._group), ")*").concat(digitRegExp, "{1,3}") : "".concat(digitRegExp, "+"), "(?:").concat(NumberFormat._escapeRegExp(this._decimal)).concat(digitRegExp, "+)?");
      var numberAdded = false;
      var regExp = parts.reduce(function (acc, part) {
        switch (part.type) {
          case 'literal':
          case 'currency':
            acc += "(?:".concat(NumberFormat._escapeRegExp(part.value), ")");

            if (!_this._strict) {
              acc += '?';
            }

            break;

          case 'minusSign':
            acc += "(".concat(NumberFormat._escapeRegExp(part.value), ")?");

            if (numberAdded) {
              _this._minusIndex = 2;
              _this._numberIndex = 1;
            }

            break;

          case 'integer':
            if (!numberAdded) {
              numberAdded = true;
              acc += "(".concat(numberRegExp, ")");
            }

            break;
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

        var match = this._regExp.exec(numberString);

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
      key: "_escapeRegExp",
      value: function _escapeRegExp(string) {
        return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      }
    }]);

    return NumberFormat;
  }();

  return NumberFormat;
});