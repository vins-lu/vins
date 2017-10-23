/*
	"name": "formatTime",
	"version": "1.0.0",
	"description": "基于js的时间格式化,格式化日期格式为"2017-05-16 10:50:50"",
	"author": "vins <luyuchen627@gmail.com>",
*/

function formatNumber (n, digit) {//转化为digit位数的数字
  	n = parseInt(n).toString();
  	if (n == "NaN") {
  		throw new Error("parameter is not Number type");
  	}
	digit = digit || 2;//默认是两位数
	var fillStr = "";
	if (n.length >= digit) {
		return n;
	} else {
		for (var i = 0; i < digit - n.length; i++) {
			fillStr += "0";
		}
		return fillStr + n;
	}
}

function isDate (date) {//是否是日期格式
	return Object.prototype.toString.call(date) === "[object Date]";
}

function isLeapYear(year) {//是否是闰年
	year = year >>> 0;//参数必须是正整数
    return (year % 400 == 0) || (year % 4 == 0 && year % 100 != 0);
}

function formatTime(date) {
	if (!date) {
		date = new Date();
	} else if (isDate(date)){
		throw new Error("parameter is not Date format");
	}
  	var year = date.getFullYear();
  	var month = date.getMonth() + 1;
  	var day = date.getDate();

 	var hour = date.getHours();
  	var minute = date.getMinutes();
  	var second = date.getSeconds();
  	return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':');
}

function getMonthDays(year, month) {//一个月多少天,月份(1-12),参数最好是整数类型,不然会有意想不到的结果呦
	var date;//如果没有传参数，默认创建一个以今天为基础的日期
	if (isDate(arguments[0])) {//如果以日期格式为参数
		date = arguments[0];
		year = date.getFullYear();
  		month = date.getMonth() + 1;
	} else {
		date = new Date();
		year = year > 0 ? year >>> 0 : date.getFullYear();
		month = month > 0 ? month % 13 : date.getMonth() + 1;
	}
	return [31, null, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month - 1] || (isLeapYear(year) ? 29 : 28);
}

function getDayNumber(year, month, day) {//参数最好是整数类型，不然会有意想不到的结果呦
	var date;//如果没有传参数，默认创建一个以今天为基础的日期
	if (isDate(arguments[0])) {//如果以日期格式为参数
		date = arguments[0];
		year = date.getFullYear();
  		month = date.getMonth() + 1;
	} else {
		date = new Date();
		year = year > 0 ? year >>> 0 : date.getFullYear();
		month = month > 0 ? month % 13 : date.getMonth() + 1;
		day = day > 0 ? day >>> 0 : date.getDate();
	}
	//年内的第几天（001-366）
	for (var i = 1; i < month; i++) {
	    day += getMonthDays(year, i);
	}
	return day;
}

Date.prototype.format = function (fmt) {
	var week = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
	var weekShortName = ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat'];
	var month = ["December", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November"]
	var monthShortName = ["Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov"];
	var regs = {
		'%y': this.getFullYear() % 100,//两位数的年份表示（00-99）
		'%Y': this.getFullYear(),//四位数的年份表示（000-9999）
		'%m': this.getMonth() + 1,//月份（01-12）
		'%d': this.getDate(),//月内中的一天（0-31）
		'%H': this.getHours(),//24小时制小时数（0-23）
		'%I': this.getHours() % 12 + 1,//12小时制小时数（01-12）
		'%M': this.getMinutes(),//分钟数（00=59）
		'%S': this.getSeconds(),//秒（00-59）
		'%a': weekShortName[this.getDay()],//本地简化星期名称
		'%A': week[this.getDay()],//本地完整星期名称
		'%b': monthShortName[this.getMonth()],//本地简化的月份名称
		'%B': month[this.getMonth()],//本地完整的月份名称
		'%c': this.toLocaleString(),//本地相应的日期表示和时间表示
		'%j': getDayNumber(),//年内的第几天（001-366）
		'%u': Math.ceil(getDayNumber() / 7),//一年中的星期数（00-53）星期一为星期的开始
		'%U': this.getDay() == 0 ? parseInt(getDayNumber() / 7) + 1 : parseInt(getDayNumber() / 7),//一年中的星期数（00-53）星期日为星期的开始
		'%w': this.getDay(),//星期（0-6），星期日为星期的开始
		"%q": Math.ceil((this.getMonth() + 1) / 3), //季度
		'%x': this.toLocaleDateString(),//本地相应的日期表示
		'%X': this.toLocaleTimeString(),//本地相应的时间表示
	};

	for (var k in regs)
		if (new RegExp("(" + k + ")").test(fmt)) {
			fmt = fmt.replace(RegExp.$1, regs[k]);
		}
	return fmt;
}
