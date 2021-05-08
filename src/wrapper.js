/**
 * FrostNumberFormat v1.0.8
 * https://github.com/elusivecodes/FrostNumberFormat
 */
(function(global, factory) {
    'use strict';

    if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = factory();
    } else {
        global.NumberFormat = factory();
    }

})(this, function() {
    'use strict';

    // {{code}}
    return NumberFormat;

});