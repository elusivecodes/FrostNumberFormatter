"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

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
    function NumberFormat(locale, options) {
      _classCallCheck(this, NumberFormat);

      this.formatter = new Intl.NumberFormat(locale, options);
      var baseFormatter = new Intl.NumberFormat(locale);
      this._digits = new Array(10).fill().map(function (_, i) {
        return baseFormatter.format(i);
      });
      var digitRegex = "[".concat(this._digits.map(NumberFormat.regExEscape).join('|'), "]"),
          parts = this.formatter.formatToParts(-10000000.1);
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
        numberRegex += "(?:".concat(digitRegex, "{1,3}").concat(NumberFormat.regExEscape(this._group), ")*").concat(digitRegex, "{1,3}");
      } else {
        numberRegex += "".concat(digitRegex, "+");
      }

      numberRegex += "(?:".concat(NumberFormat.regExEscape(this._decimal)).concat(digitRegex, "+)?");
      var regex = '^',
          numberAdded = false,
          minusBefore = false;
      parts.forEach(function (part) {
        if (['literal', 'currency'].includes(part.type)) {
          regex += NumberFormat.regExEscape(part.value);
        } else if (part.type === 'minusSign') {
          regex += "(".concat(NumberFormat.regExEscape(part.value), "?)");

          if (!numberAdded) {
            minusBefore = true;
          }
        } else if (part.type === 'integer' && !numberAdded) {
          regex += "(".concat(numberRegex, ")");
          numberAdded = true;
        }
      });
      regex += '$';
      this.minusIndex = minusBefore ? 1 : 2;
      this.numberIndex = minusBefore ? 2 : 1;
      this.regex = new RegExp(regex);
    }

    _createClass(NumberFormat, [{
      key: "format",
      value: function format(number) {
        return this.formatter.format(number);
      }
    }, {
      key: "formatToParts",
      value: function formatToParts(number) {
        return this.formatter.formatToParts(number);
      }
      /**
       * Return a parsed number from a formatted number string.
       * @param {string} numberString The formatted number string.
       * @returns {number} The parsed number.
       */

    }, {
      key: "parse",
      value: function parse(numberString) {
        var _this = this;

        var match = this.regex.exec(numberString);

        if (!match) {
          throw new Error('Invalid number string');
        }

        return parseFloat("".concat(match[this.minusIndex] ? '-' : '').concat(match[this.numberIndex].replace(/./g, function (match) {
          return _this._digits.includes(match) ? _this._digits.indexOf(match) : match === _this._decimal ? '.' : '';
        })));
      }
      /**
       * Return an escaped string for use in RegEx.
       * @param {string} string The string to escape.
       * @returns {string} The escaped string.
       */

    }], [{
      key: "regExEscape",
      value: function regExEscape(string) {
        return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      }
    }]);

    return NumberFormat;
  }();

  return NumberFormat;
});