$(document).ready(function() {
	//获取openid
	var args = parseQueryArgs();
	var openid = args.openid;
	var schoolid = args.schoolid;

	var grades = gradeList();
	var gradeid = "";
	var classid = "";
	var classname = "";

	var obtainState = true; //能否点击获取验证码
	var registState = true; //能否点击绑定按钮

	var api = {
		//获取学校的详细信息
		getSchoolInfo: function(params) {
			var ajaxUrl = baseUrl + "system.listschools";
			query("post",ajaxUrl,params.data,params.success,params.fail,params.complate);
		},
		//获取班级
		getClasses: function(params) {
			var ajaxUrl = baseUrl + 'classes.list';
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
		//初始化页面
		initDom: function() {
			//初始化年级
			$(".selectClass").selectAction({
				labelText: "年级:",
			});
			//初始化班级
			$(".selectClass").selectAction({
				labelText: "班级:",
			});
			//初始化绑定人与被绑定学生的关系
			$(".relation").selectAction({
				id: "toggleRelation",
				labelText: "与学生的关系:",
				data: relations,
				showField: "text",
			});
		},
		//获取学校详情
		getSchoolInfo: function() {
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
		//获取年级列表
		getGrades: function() {
			gradeid = grades[0].val;
			util.getClassList(gradeid);//获取班级
			$(".selectGrade").selectAction({
				id: "toggleGrade",
				labelText: "年级:",
				data: grades,
				showField: "text",
				onSelect: function(ele){
					var index = $(ele).attr("index");
					gradeid = grades[index].val;
					util.getClassList(gradeid);//获取班级
				}
			});
		},
		//获取班级列表
		getClassList: function (gradeid){
			api.getClasses({
				data:{
					openid: openid,
					schoolid: schoolid,
					level: gradeid,
				},
				success: function(res) {
					if(res && res.rows){
						if(res.rows.length > 0){
							var currentGradeName = $(".selectedGrade").text();
							var regexp = /初一|初二|初三|高一|高二|高三/gi;
							var classList = res.rows.map(function(item){
								if(item.classname.indexOf(currentGradeName) != -1){
									var className = "";
									if(regexp.test(item.classname)){
										className = item.classname.replace(regexp,"");
									}
									if(className != ""){
										item.classname = className;
									}
								}
								return item;
							});
							if(classList.length > 0){
								classid = classList[0].classid;
								$(".selectClass").selectAction({
									id: "toggleClass",
									labelText: "班级:",
									data: classList,
									showField: "classname",
									onSelect: function(ele){
										var index = $(ele).attr("index");
										classid = classList[index].classid;
									}
								});
							}
						}else{
							$(".selectedClass").text("该年级没有任何班级!");
						}
					}
				}
			});
		},
		//注册
		regist: function(){
			$(":focus").blur();
			var _this = $(this);
			var parentname = $("#userName").val();
			var realname = $("#studentName").val();
			var relation = $(".relation").find(".selectedText").text();
			var mobile = $("#mobile").val();
			var code = $("#code").val();
			var pass = $("#pass").val();
			var confirmPsw = $("#confirmPsw").val();
			if(registState) {
				if(gradeid == ""){
					$.toast({
						type:"tip",
						text:"请选择一个年级"
					});
					return;
				}
				if(classid == ""){
					$.toast({
						type:"tip",
						text:"请选择一个班级"
					});
					return;
				}
				if(relation == ""){
					$.toast({
						type:"tip",
						text:"请选择您与学生的关系"
					});
					return;
				}
				if(parentname == "") {
					$.toast({
						type: "tip",
						text: "请输入您的姓名"
					});
					return;
				}
				if(realname == "") {
					$.toast({
						type: "tip",
						text: "请输入您孩子的姓名"
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
				api.regist({
					data: {
						parentname: parentname,
						realname: realname,
						mobile: mobile,
						code: code,
						openid: openid,
						school: schoolid,
						classid: classid,
						relation: relation,
						gradename: getGradeName(gradeid),
						pass: pass,
						identity: "guardian"
					},
					success: function(res) {
						if(res.ok){
							localData.set("user",res.userinfo);
							$.showTip({
								content: "注册成功，您可以查看孩子的考试成绩了！",
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
	util.initDom();
	util.getSchoolInfo();
	util.getGrades();

	$("#pass").blur(function(){
		var pass = $(this).val();
		if(!testPassWord(pass)){
			$.toast({
				type: "tip",
				text: "密码格式不正确<br />密码为：6-20位数字和字母的组合"
			});
			return;
		}
	});
	$("#confirmPsw").blur(function(){
		var pass = $("#pass").val();
		var confirmPsw = $(this).val();
		if(!testPassWord(pass)){
			$.toast({
				type: "tip",
				text: "密码格式不正确<br />密码为：6-20位数字和字母的组合"
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
	});

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
				_this.text(num + " 秒").css("color", "#fff");

				var t1 = setInterval(function() {
					num--;
					_this.text(num + " 秒").css("color", "#fff");
					if(num == 0) {
						clearInterval(t1);
						_this.html("获取验证码").css("color", "#fff");
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
							$("button").css("background", "#fff");
						}
					}
				});
			}
		}
	});

	$(".registBtn").click(function() {
		util.regist();
	});
})