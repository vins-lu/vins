/*
	"name": "query",
	"version": "1.0.0",
	"description": "基于jquery版本的ajax请求封装,多参数版本",
	"author": "vins <luyuchen627@gmail.com>",
*/

var query = function(the_type, the_url, the_param, succ_callback, err_callback, complete_callback, processData, contentType) {
	var loadType = false;//loading加载方式：true:全屏加载，false:局部加载
	var queryType = "post";//请求方式
	if(!the_url) {
		return false;
	}
	if(the_type && $.isPlainObject(the_type)) {
		loadType = the_type.loading ? the_type.loading : false;
		queryType = the_type.type;
	}

	queryType = queryType.toLowerCase();

	var param = {
		type: queryType,
		cache: false,
		url: the_url,
		data: the_param,
		dataType: "json",
		beforeSend: null,
		success: function(response) {
			//根据服务端规定的响应，做出的数据以及错误处理
			if($.isPlainObject(response)) {
				if(response.ok || response.rows != null) {
					succ_callback(response);
				} else {
					if(!err_callback || !err_callback(response)) {
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
			if(complete_callback && typeof complete_callback == "function"){
				complete_callback();
			}
		}
	};

	if(processData == false)
		param["processData"] = false;
	if(contentType == false)
		param["contentType"] = false;
	if(loadType){
		$.toast();//全局加载
	}
	$.ajax(param);
};
