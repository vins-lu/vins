/*
	"name": "query",
	"version": "2.0.0",
	"description": "基于jquery版本的ajax请求封装,对象参数版本",
	"author": "vins <luyuchen627@gmail.com>",
*/

var query = function(payload) {
	// payload：the_type, the_url, the_param, succ_callback, err_callback, complete_callback, processData, contentType
	var loadType = false;//loading加载方式：true:全屏加载，false:局部加载
	var queryType = "post";//请求方式
	if(!payload.the_url) {
		return false;
	}
	if(payload.the_type && $.isPlainObject(payload.the_type)) {
		loadType = payload.the_type.loading ? payload.the_type.loading : false;
		queryType = payload.the_type.type;
	}

	queryType = queryType.toLowerCase();

	var param = {
		type: queryType,
		cache: false,
		url: payload.the_url,
		data: payload.the_param,
		dataType: "json",
		beforeSend: null,
		success: function(response) {
			//根据服务端规定的响应，做出的数据以及错误处理
			if($.isPlainObject(response)) {
				if(response.ok || response.rows != null) {
					payload.succ_callback(response);
				} else {
					if(!payload.err_callback || !payload.err_callback(response)) {
						//数据错误处理
						/*if(response.lang) {
							$.showTip({
								title: "错误",
								content: errMsg(response.lang),
								success: function(){
									if(response.lang == "identity_error"){
										$("body").emptyState({
											type: "nopermission",
											content: errMsg(response.lang),
											replace: true,
											style: {
												position: "absolute",
												top: "38.2%",
												transform: "translate(0,-50%)"
											}
										});
									}
								}
							});
						}else if(response.errcode){
							$.showTip({
								title: "错误",
								content: "发生网络错误，错误信息为: " + errCode(response.errcode.toString()) + "，请拨打客服电话 400-640-8688 以解决此问题",
								success: function() {
									if(response.errcode == 2){
										(parent || top).location.reload();
									}
								}, 
							});
						}*/
					}
				}
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			//请求错误处理
			/*$.showTip({
				title: "错误",
				content: "发生了不可描述的错误<br/>,请稍后再试!<br/>请联系客服:400-640-8688"
			});*/
		},
		complete: function() {
			//closeToast();//如果有全局加载，请求完成后关闭
			if(payload.complete_callback && typeof payload.complete_callback == "function"){
				payload.complete_callback();
			}
		}
	};

	if(payload.processData == false)
		param["processData"] = false;
	if(payload.contentType == false)
		param["contentType"] = false;
	if(loadType){
		$.toast();//全局加载
	}
	$.ajax(param);
};
