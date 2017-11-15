/*
	"name": "rec_opt",
	"version": "1.0.0",
	" illustrate": "递归优化，防止栈溢出",
	"description": "基于斐波那契数列的生成函数，进行一些递归优化的操作，主要涉及记忆函数，Generator函数和尾递归",
	"author": "vins <luyuchen627@gmail.com>",
*/

var count = 0; //记录调用次数

//最大栈,递归调用，计算最大栈，不同的浏览器结果会不一样
function computeMaxCallStackSize() {
    try {
        return 1 + computeMaxCallStackSize();
    } catch (e) {
        // Call stack overflow
        return 1;
    }
}

//递归
var fibonacci_recur = function (n) {
    count ++ ;
    return n < 2 ? n : fibonacci_recur(n - 1) + fibonacci_recur(n - 2);
}

//记忆函数
var fibonacci_memory = function () {
    var cache = [0,1];
    var fib = function (n) {
        count++;
        if(!cache[n]){
            cache[n] = fib(n - 1) + fib(n - 2);
        }
        return cache[n];
    };
    return fib;
}();


//生成带有记忆功能的函数
var memorize = function (func) {
	var cache = {};
    var handle = function(n){
		count ++;
        if(!cache[n]){
            cache[n] = func(handle, n);
        }
        return cache[n];
    };
    return handle;
};
//example 
var fbr = memorize(function(recur,n){
	count ++;
	return n < 2 ? n : recur(n - 1) + recur(n - 2);
});

//防止栈溢出
function *fc (n) {
	let [prev, curr] = [0, 1];
	for (var i = 0; i< n;i++) {
	    [prev, curr] = [curr, prev + curr];
	    yield curr;
	}
}

//尾调用,递归的一种优化
function tailcall (n, a1, a2) {
	if (n == 1) {
		return a2;
	}
	return tailcall(n - 1, a2 ,a1 + a2);
}