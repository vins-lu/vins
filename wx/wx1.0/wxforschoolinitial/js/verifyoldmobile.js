$(document).ready(function() {
	//获取openid
	var args = parseQueryArgs();

	var obtainState = true; //能否点击获取验证码
	var nextState = true; //能否点击绑定按钮

	var api = {
		//获取验证码
		getCode: function(params) {
			var ajaxUrl = baseUrl + "validcodes.mobilecode";
			query("post",ajaxUrl,params.data,params.success,params.fail,params.complate);
		},
	}

	$("#getCode").click(function() {
		var mobile = $("#mobile").val();//手机号
		var _this = $(this);
		if(mobile == "") {
			//判断手机号码是不是空的 如果是弹出提示框
			$.toast({
				type: "tip",
				text: "请输入您的手机号码"
			});
		} else if(!testMobile(mobile)){
			$.toast({
				type: "tip",
				text: "请输入正确的手机号"
			});
		}else {
			if(obtainState) {
				obtainState = false;
				var num = 60;
				_this.text(num + " 秒");

				var t1 = setInterval(function() {
					num--;
					_this.text(num + " 秒");
					if(num == 0) {
						clearInterval(t1);
						_this.html("获取验证码");
						num = 60;
						obtainState = true;
					}
				}, 1000);

				api.getCode({
					data: {
						mobile: mobile,
						reason: 'changemobile',
					},
					success: function(res) {
						if(res.ok) {
							setTimeout(function(){
								$.toast({
									type: "success",
									text: "已发送验证码"
								});
							},0);
						}else{
							$.toast({
								type: "error",
								text: "获取验证码失败，请重新尝试"
							});
							clearInterval(t1);
							obtainState = true;
							_this.text("获取验证码");
						}
					},
					fail: function() {
						clearInterval(t1);
						obtainState = true;
						_this.text("获取验证码");
					}
				});
			}
		}
	})

	$(".nextBtn").click(function() {
		var mobile = $("#mobile").val();
		var code = $("#code").val();
		if(nextState) {
			if(mobile == ""){
				$.toast({
					type: "tip",
					text: "请输入您的手机号码"
				});
				return;
			}
			if(!testMobile(mobile)){
				$.toast({
					type: "tip",
					text: "请输入正确的手机号"
				});
				return;
			}
			if(code == "") {
				$.toast({
					type: "tip",
					text: "请输入验证码"
				});
				return;
			}
			nextState = false;
			var hrefArgs = ["openid=",args.openid,"&uuid=",args.uuid,"&schoolid=",args.schoolid,"&mobile=",mobile,"&code=",code];
			window.location.href = "bindnewmobile.html?" + hrefArgs.join("");
		}
	});
})