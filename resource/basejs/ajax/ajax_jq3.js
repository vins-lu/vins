/*
	"name": "query",
	"version": "1.0.0",
	"description": "基于jquery版本的ajax请求封装,多参数版本",
	"author": "vins <luyuchen627@gmail.com>",
	"more": "errcode 写在一个配置文件中，需要单独引入"
*/

var query = function(url, params) {
	$.ajax({
		type: params.type && params.type.toUpperCase() || 'POST',
		cache: false,
		async: !params.sync || false,
		url: serverUrl + url,
		data: params.data || {},
		dataType: "json",
		beforeSend: null,
		headers: {
			Accept: 'application/json',
			"Content-Type": params.ContentType || "application/x-www-form-urlencoded" || "application/json "
			//文件上传multipart/form-data 
		},
		success: function (res) {
			res = parseJson(res);
			if (res.ok) {
				typeof params.success == "function" && params.success(res);
			} else {
				//接口请求返回错误的处理
				if (params.fail) {
					typeof params.fail == "function" && params.fail(res);
				} else {
					//接口请求错误的处理
					var errmsg = (res.errCode ? errCode[res.errCode] : res.msg) || errCode["default"];
					layer && layer.msg(errmsg, {icon:5}); 
				}
			}
		},
		error: function (res) {
			if (params.error) {
				typeof params.error == "function" && params.error(res);
			} else {
				//接口请求错误的处理
				var errmsg = (res.errCode ? errCode[res.errCode] : res.msg) || errCode["default"];
				layer && layer.msg(errmsg, {icon:5}); 
			}
		},
		complete: function (xhr, res) {
			//loading关闭
			typeof params.complete == "function" && params.complete(xhr, res);
		},
	});
};