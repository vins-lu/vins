/*
    "name": "object.extend",
    "version": "1.0.0",
    "description": "es6中常用的Object方法的polyfill",
    "author": "vins <luyuchen627@gmail.com>",
*/

//object.is
if (!Object.is) {
    Object.defineProperty(Object, 'is', {
        value: function(x, y) {
            if (x === y) {
                // 针对+0 不等于 -0的情况
                return x !== 0 || 1 / x === 1 / y;
            }
            // 针对NaN的情况
            return x !== x && y !== y;
        },
        configurable: true,
        enumerable: false,
        writable: true
    });
}
//Object.assign
if (!Object.assign) {
    Object.defineProperty(Object, "assign", {
        value: function(target, firstSource) {
            "use strict";
            if (target === undefined || target === null)
                throw new TypeError("Cannot convert first argument to object");
            var to = Object(target);
            for (var i = 1; i < arguments.length; i++) {
                var nextSource = arguments[i];
                if (nextSource === undefined || nextSource === null) continue;
                var keysArray = Object.keys(Object(nextSource));
                for (var nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex++) {
                    var nextKey = keysArray[nextIndex];
                    var desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
                    if (desc !== undefined && desc.enumerable) to[nextKey] = nextSource[nextKey];
                }
            }
          return to;
        },
        enumerable: false,
        configurable: true,
        writable: true,
    });
}