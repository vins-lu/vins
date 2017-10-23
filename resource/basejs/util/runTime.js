/*
	"name": "runTime",
	"version": "1.0.0",
	"description": "基于浏览器的测试函数运行时间,以毫秒为计算单位",
	"author": "vins <luyuchen627@gmail.com>",
*/

function runTime(func){
	console.time(func.name);
	func();//执行待测函数
	console.timeEnd(func.name);
}