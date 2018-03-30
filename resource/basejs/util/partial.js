
// 调用数组的join方法重复字符串

var repeat = (function () {
	var join = Array.prototype.join, obj = {};
	return function (target, n) {
		obj.length = n + 1;
		return join.call(obj, target);
	}
})();

// 偏函数
function partial(func, ...argsBound) {
  return function(...args) { // (*)
    return func.call(this, ...argsBound, ...args);
  }
}

// 柯里化
function curry(func) {  //不要使用rest参数定义，func.length会为0
  return function curried(...args) {
    if (args.length >= func.length) {
      return func.apply(this, args);
    } else {
      return function(...args2) {
        return curried.apply(this, args.concat(args2));
      }
    }
  };
}

// 数组去重
Array.prototype.distinct = function (){
	var arr = this,
	 i,
	 obj = {},
	 result = [],
	 len = arr.length;
	for(i = 0; i< arr.length; i++){
	 if(!obj[arr[i]]){ //如果能查找到，证明数组元素重复了
		obj[arr[i]] = 1;
		result.push(arr[i]);
	 }
	}
	return result;
 };