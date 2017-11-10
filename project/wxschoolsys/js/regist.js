$(document).ready(function() {
	//获取openid
	var args = parseQueryArgs();
	var openid = args.openid;
	var schoolid = args.schoolid;
	if(!schoolid || parseInt(schoolid) == 0){
		$("body").emptyState({
			type: "exception",
			content: "请扫描学校提供的正确二维码",
			replace: true,
			style: {
				position: "absolute",
				top: "38.2%",
				transform: "translate(0,-50%)"
			}
		});
		return;
	}

	var obtainState = true; //能否点击获取验证码
	var registState = true; //能否点击绑定按钮

	var api = {
		//获取学校的详细信息
		/*getSchoolDetail: function(params) {
			var ajaxUrl = baseUrl + "schools.getdetail";
			query("post",ajaxUrl,params.data,params.success,params.fail,params.complate);
		},*/
		//获取学校的列表信息
		getSchoolInfo: function(params) {
			var ajaxUrl = baseUrl + "system.listschools";
			query("post",ajaxUrl,params.data,params.success,params.fail,params.complate);
		},
		//获取验证码
		getCode: function(params) {
			var ajaxUrl = baseUrl + "validcodes.mobilecode";
			query("post",ajaxUrl,params.data,params.success,params.fail,params.complate);
		},
		//注册
		regist: function(params) {
			var ajaxUrl = baseUrl + "users.wxbind";
			query("post",ajaxUrl,params.data,params.success,params.fail,params.complate);
		},
	}

	var util = {
		//获取学校详情
		getSchoolInfo: function(){
			var schoolNameEle = $(".schoolName");
			if(!schoolid || parseInt(schoolid) == 0){
				$("body").emptyState({
					type: "exception",
					content: "请扫描学校提供的正确二维码",
					replace: true,
					style: {
						position: "absolute",
						top: "38.2%",
						transform: "translate(0,-50%)"
					}
				});
			}else{
				schoolNameEle.inline_loading();
				api.getSchoolInfo({
					data: {
						schoolid: schoolid,
					},
					success: function(res) {
						if(res.ok){
							var schoolName = res.rows[0].fullname;
							if(schoolName){
								schoolNameEle.text(schoolName);
							}else{
								schoolNameEle.text("学校名字获取失败!");
							}
						}
					},
					fail: function() {
						schoolNameEle.text("学校名字获取失败!");
					},
					complate: function(){
						schoolNameEle.close_inline_loading();
					}
				})
			}
		},
		//跳转到绑定页面
		gotoBind: function(page) {
			window.location.href = page + ".html?openid=" + openid + "&uuid=" + uuid + "&schoolid=" + schoolid;
		},
		//注册
		regist: function(){
			var _this = $(".registBtn");
			var userName = $("#userName").val();
			var mobile = $("#mobile").val();
			var code = $("#code").val();
			var pass = $("#pass").val();
			var confirmPsw = $("#confirmPsw").val();
			if(registState) {
				if(userName == "") {
					$.toast({
						type: "tip",
						text: "请输入您的姓名"
					});
					return;
				}
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
				if(!testPassWord(pass)){
					$.toast({
						type: "tip",
						text: "密码格式不正确<br />密码为：6-20位数字和字母的组合"
					});
					return;
				}
				if(pass == ""){
					$.toast({
						type: "tip",
						text: "请输入密码"
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
				if(code == "") {
					$.toast({
						type: "tip",
						text: "请输入验证码"
					});
					return;
				}
				registState = false;
				_this.inline_loading();
				api.regist({
					data: {
						realname: userName,
						mobile: mobile,
						code: code,
						openid: openid,
						school: schoolid,
						pass: pass,
						identity: 'manager',
					},
					success: function(res) {
						if(res.ok){
							localData.set("user",res.userinfo);
							$.showTip({
								content: "注册成功，您可以在公众号下方的考试功能中发起考试了！",
								success: function(){
									WeixinJSBridge.call('closeWindow');
								}
							});
						}else{
							$.showTip({
								content: "绑定失败，请重新绑定",
								success: function(){
									location.reload();
								}
							});
						}
					},
					complate: function() {
						registState = true;
						_this.close_inline_loading();
					}
				});
			}
		}
	}

	util.getSchoolInfo();

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
						_this.text("获取验证码");
						num = 60;
						obtainState = true;
					}
				}, 1000);

				api.getCode({
					data: {
						mobile: mobile,
						reason: 'register',
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
	});

	$(".registBtn").click(function() {
		util.regist();
	});
})