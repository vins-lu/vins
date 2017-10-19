//es6中常用的Number方法的polyfill

//Number.isFinite(只对数值有效)
if (!Number.isFinite) {
	Object.defineProperty(Number, 'isFinite', {
	  	value: function (value) {
	    	return typeof value === 'number' && isFinite(value);
	  	},
	  	configurable: true,
	  	enumerable: false,
	  	writable: true
	});
}

//Number.isNaN(只对数值有效)
if (!Number.isNaN) {
	Object.defineProperty(Number, 'isNaN', {
	    value: function (value) {
	      return typeof value === 'number' && isNaN(value);
	    },
	    configurable: true,
	    enumerable: false,
	    writable: true
	});
}

//Number.parseInt
if (!Number.parseInt) {
	Object.defineProperty(Number, 'parseInt', {
	    value: function (value) {
	      return parseInt(value);
	    },
	    configurable: true,
	    enumerable: false,
	    writable: true
	});
}

//Number.parseFloat
if (!Number.parseFloat) {
	Object.defineProperty(Number, 'parseFloat', {
	    value: function (value) {
	      return parseFloat(value);
	    },
	    configurable: true,
	    enumerable: false,
	    writable: true
	});
}

//Number.isInteger
if (!Number.isInteger) {
	Object.defineProperty(Number, 'isInteger', {
	    value: function (value) {
	      return typeof value === 'number' &&
	        isFinite(value) &&
	        Math.floor(value) === value;
	    },
	    configurable: true,
	    enumerable: false,
	    writable: true
	});
}

//es6中常用的Math方法的polyfill

//Math.trunc 去除一个数的小数部分
Math.trunc = Math.trunc || function(x) {
  return x < 0 ? Math.ceil(x) : Math.floor(x);
};

//Math.sign判断一个数是正数，负数还是0
Math.sign = Math.sign || function(x) {
  x = +x; // convert to a number
  if (x === 0 || isNaN(x)) {
    return x;
  }
  return x > 0 ? 1 : -1;
};