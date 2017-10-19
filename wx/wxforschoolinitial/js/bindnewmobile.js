$(document).ready(function() {
	//获取openid
	var args = parseQueryArgs();
	var openid = args.openid;
	var uuid = args.uuid;
	var code = args.code;
	var mobile = args.mobile;
	if(!code && !mobile){
		$.showTip({
			content: "数据有误，即将返回上一个页面！",
			success: function(){
				window.history.back();
			}
		});
		return;
	}

	var resetState = true; //能否点击绑定按钮
	var api = {
		//修改手机号
		setmobile: function(params) {
			var ajaxUrl = baseUrl + "users.setmobile";
			query("post",ajaxUrl,params.data,params.success,params.fail);
		},
	}

	$(".bindNewMobileBtn").click(function() {
		var newmobile = $("#newmobile").val();
		if(resetState) {
			
			resetState = false;
			api.setmobile({
				data: {
					uuid: uuid,
					mobile: mobile,
					code: code,
					newmobile: newmobile,
				},
				success: function(res) {
					if(res.ok) {
						setTimeout(function(){
							$.toast({
								type:"success",
								text:"新账号绑定成功!<br/>即将关闭当前页面",
								cb:function(){
									WeixinJSBridge.call('closeWindow');
								}
							});
						},0);
					}else{
						resetState = true;
					}
				},
				fail: function() {
					resetState = true;
				}
			});
		}
	});
})