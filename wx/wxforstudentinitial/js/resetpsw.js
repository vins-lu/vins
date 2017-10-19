$(document).ready(function() {
	//获取openid
	var args = parseQueryArgs();
	var openid = args.openid;
	var code = args.code;
	var mobile = args.mobile;

	var resetState = true; //能否点击绑定按钮
	var api = {
		//设置密码
		reset: function(params) {
			var ajaxUrl = baseUrl + "users.setpassword";
			query("post",ajaxUrl,params.data,params.success,params.fail);
		},
	}

	$(".resetBtn").click(function() {
		var pass = $("#pass").val();
		var confirmPsw = $("#confirmPsw").val();
		if(resetState) {
			if(pass == ""){
				$.toast({
					type: "tip",
					text: "请输入密码"
				});
				return;
			}
			if(!testPassWord(pass)){
				$.toast({
					type: "tip",
					text: "密码格式不正确<br />密码为：6-20位数字和字母的组合"
				});
				return;
			}
			if(confirmPsw == ""){
				$.toast({
					type: "tip",
					text: "请确认密码"
				});
				return;
			}
			if(pass != confirmPsw){
				$.toast({
					type: "tip",
					text: "密码输入不一致"
				});
				return;
			}
			resetState = false;
			api.reset({
				data: {
					openid: openid,
					mobile: mobile,
					code: code,
					newpass: pass,
				},
				success: function(res) {
					if(res.ok) {
						setTimeout(function(){
							$.toast({
								type:"success",
								text:"密码修改成功!<br/>即将关闭当前页面",
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