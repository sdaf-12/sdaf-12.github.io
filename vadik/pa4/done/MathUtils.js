(function(global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
        typeof define === 'function' && define.amd ? define(['exports'], factory) :
            (factory((global.THREE = global.THREE || {})));
}(this, (function(exports) {
    'use strict';

    var MathUtils = {

        DEG2RAD: Math.PI / 180,
        RAD2DEG: 180 / Math.PI,

        // Random integer from <low, high> interval

        randInt: function(low, high) {

            return low + Math.floor(Math.random() * (high - low + 1));

        },

        // Random float from <low, high> interval

        randFloat: function(low, high) {

            return low + Math.random() * (high - low);

        }

    }

    // NOTE THIS LINE
    exports.MathUtils = MathUtils

})));

// IN ANOTHER JS FILE:

console.log(THREE.MathUtils.randInt(1, 10))