$(document).ready(function() {
	//获取openid
	var args = parseQueryArgs();
	var openid = args.openid;
	var schoolid = args.schoolid;
	var uuid = args.uuid;
	var gradeid = args.gradeid;
	var classid = args.classid;
	var studentid = args.studentid;
	var studentname = args.studentname;
	if(studentname){
		$("#realname").attr("readonly",true).val(unescape(studentname));
	}
	//点击提示框的确定后所有状态都恢复
	function btnClick(){
		obtainState = true;
		buttonState = true;
		$("button").css("background", "#fff");
		// $("#getCode").html("获取验证码").css("color", "#fff");
	}
	
	window.btnClick = btnClick;
	var obtainState = true; //能否点击获取验证码
	var buttonState = true; //能否点击绑定按钮
	$("#getCode").click(function() {
		if($("#mobile").val() == "") {
			//判断手机号码是不是空的 如果是弹出提示框
			$.showTip("请输入您的手机号码");
		} else if(!testMobile($("#mobile").val())){
			$.showTip("请输入正确的手机号");
		}else {
			var obj = this;
			if(obtainState) {
				obtainState = false;
				buttonState = false;
				var num = 60;
				$(obj).html(num + " 秒").css("color", "#e4393c");
				$("button").css("background", "#999");

				var mobile = $("#mobile").val();
				ajaxUrl = pageLoader.url + 'validcodes.mobilecode';
				ajaxParam = {
					mobile: mobile,
					reason: 'register',
				}

				var t1 = setInterval(function() {
					num--;
					$(obj).html(num + " 秒").css("color", "#e4393c");
					if(num == 0) {
						clearInterval(t1);
						$(obj).html("获取验证码").css("color", "#fff");
						num = 60;
						obtainState = true;
					}
				}, 1000);

				query('post', ajaxUrl, ajaxParam, function(jsonData) {
					//console.log(jsonData);
					if(jsonData.ok) {
						$("button").css("background", "#fff");
						buttonState = true;
					}else{
						$.showTip("请求异常，请稍后再试！");
					}
				})
			}
		}
	})

	$("button.bind").click(function() {
		if(buttonState) {
			if($("#realname").val() == "") {
				$.showTip("请输入您的姓名");
			}else if($("#mobile").val() == ""){
				$.showTip("请输入您的手机号码");
			}else if(!testMobile($("#mobile").val())){
				$.showTip("请输入正确的手机号");
			}else if(!testPassWord($("#pw").val())){
				$.showTip("密码格式不正确<br />密码为：6-20位数字和字母的组合");
			}else if($("#pw").val() != $("#pw1").val()){
				$.showTip("密码输入不一致");
			}else if($("#pass").val() == "") {
				$.showTip("请输入验证码");
			}else {
				var ajaxUrl = pageLoader.url + 'users.wxbind';
				var ajaxParam = {
					realname:$("#realname").val(),
					mobile: $("#mobile").val(),
					code: $("#pass").val(),
					openid: openid,
					school:schoolid,
					pass:$("#pw").val(),
				};
				console.log(ajaxParam);
				if (studentname) {
					ajaxParam.gradename = gradeid;
					ajaxParam.identity = 'guardian';
				} else {
					ajaxParam.identity = 'manager';
				}
				query('post', ajaxUrl, ajaxParam, function(jsonData) {
					if(jsonData.ok){
						localData.set("user",jsonData.userinfo);
						$.showTip("注册成功，您可以在公众号下方的考试功能中发起考试了！",function(){
							WeixinJSBridge.call('closeWindow');
						});
					}else{
						$.showTip("绑定失败，请重新绑定",function(){
							location.reload();
						})
					}
				})
			}
		}
	});
	// $(".login").click(function(){
	// 	window.location.href = "login.html?openid=" + openid + "&uuid=" + uuid + "&schoolid=" + schoolid;
	// })
})