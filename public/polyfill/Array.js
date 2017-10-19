//es6中常用的array方法的polyfill

//Array.isArray
if (!Array.isArray) {
    Object.defineProperty(Array, 'isArray', {
        value: function(arg) {
            return Object.prototype.toString.call(arg) === '[object Array]';
        },
        configurable: true,
        enumerable: false,
        writable: true
    });
}

//Array.from
if (!Array.from) {
    Object.defineProperty(Array, 'from', {
        value: function(arg) {
            return Array.prototype.slice.call(arg);
        },
        configurable: true,
        enumerable: false,
        writable: true
    });
}

//Array.of
if (!Array.of) {
    Object.defineProperty(Array, 'of', {
        value: function(arg) {
            return Array.prototype.slice.call(arg);
        },
        configurable: true,
        enumerable: false,
        writable: true
    });
}

//arr.find
if (!Array.prototype.find) {
    Object.defineProperty(Array.prototype, 'find', {
        value: function(predicate) {
            'use strict';
            if (this == null) {
                throw new TypeError('Array.prototype.find called on null or undefined');
            }
            if (typeof predicate !== 'function') {
                throw new TypeError('predicate must be a function');
            }
            var list = Object(this);
            var length = list.length >>> 0;
            var thisArg = arguments[1];
            var value;

            for (var i = 0; i < length; i++) {
                value = list[i];
                if (predicate.call(thisArg, value, i, list)) {
                    return value;
                }
            }
            return undefined;
        },
        configurable: true,
        enumerable: false,
        writable: true
    });
}

//arr.includes
if (!Array.prototype.includes) {
    Object.defineProperty(Array.prototype, 'includes', {
        value: function(item) {
            'use strict';
            if (this == null) {
                throw new TypeError('Array.prototype.includes called on null or undefined');
            }
            var O = Object(this);
            var len = parseInt(O.length, 10) || 0;
            if (len === 0) {
                return false;
            }
            var n = parseInt(arguments[1], 10) || 0;
            var k;
            if (n >= 0) {
                k = n;
            } else {
                k = len + n;
                if (k < 0) {k = 0;}
            }
            var citem;
            while (k < len) {
                citem = O[k];
                if (item === citem || (item !== item && citem !== citem)) { // NaN !== NaN
                return true;
                }
                k++;
            }
            return false;
        },
        configurable: true,
        enumerable: false,
        writable: true
    });
}

if (!Array.prototype.select) {
    Object.defineProperty(Array.prototype, 'select', {
        value: function(item) {
            'use strict';
            if (this == null) {
                throw new TypeError('Array.prototype.select called on null or undefined');
            }
            if (!Array.isArray(this)) {
                throw new TypeError('This Object is not Array');
            }
            var arr = [];
            var i = arguments[0] || 0;
            var len = this.length >>> 0;
            var end = len;
            if (!arguments[1]) {
                if (arguments[1] === 0){
                    end = 0;
                }
            }else{
                end = arguments[1] % len;
            }
            end = end >= 0 ? end : len + end;
            console.log(end)
            var step = arguments[2] || 1;
            step = Math.abs(step);
            if (arguments[2] < 0){
                for (i = end - 1; i >= 0; i = i - step){
                    arr.push(this[i]);
                }
            }else {
                for (i; i < end; i = i + step){
                    arr.push(this[i]);
                }
            }
            return arr;
        },
        configurable: true,
        enumerable: false,
        writable: true,
    });
}