/*
	"name": "hrefParse",
	"version": "1.0.0",
	"description": "基于js的获取URL传入的参数,以对象格式返回",
	"author": "vins <luyuchen627@gmail.com>",
*/

function hrefParse() {
	var loc = window.location.href;
	var pos = loc.indexOf('?');
	var r = {};

	if (pos > 0) {
		var args = loc.substr(pos + 1).split('&');
		for (var i = 0; i < args.length; ++i) {
			pos = args[i].indexOf('=');
			if (pos >= 0) {
				r[args[i].substr(0, pos)] = args[i].substr(pos + 1);
			} else {
				r[args[i]] = '';
			}
		}
	}
	return r;
}