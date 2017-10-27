/*
	"name": "wxRequest",
	"version": "1.0.0",
	"description": "js数据类型检测",
	"author": "vins <luyuchen627@gmail.com>",
*/

function typeis (obj, type){
	if (!type) {
		throw new Error("Miss required parameter -- type");
	}
	if (type != "RegExp" && type != "HTMLDocument"){
		type = type.toString().toLowerCase();
		type = type.substr(0,1).toUpperCase() + type.substring(1);
	}
	// var types = ["Array", "Boolean", "Date", "Number", "Object", "RegExp", "String", "Window", "HTMLDocument"];
	return Object.prototype.toString.call(obj) === "[object " + type + "]";
}

export default {
	typeis
}