$(document).ready(function() {
	//设置body
	$("body").height($(window).height());

	$(".message>li:first-child").click(function() {
		$(".selectschools").fadeIn();
	})
	
	var ages = parseQueryArgs();
	var uuid = ages.uuid;
	var openid = ages.openid;
	var schoolid = ages.schoolid;
	var usertype = "";
	
	var ajaxUrl = pageLoader.url + 'users.getuserinfo';
	var ajaxParam = {
		uuid: uuid,
		who: uuid,
	};
	function initText(text) {
		if(text == 0 || text == null || text == "undefined" || typeof text == "undefined") {
			return "无";
		} else {
			return text;
		}
	}
	query('post', ajaxUrl, ajaxParam, function(jsonData) {
		if(jsonData.ok){
			var userinfo = jsonData.userinfo;
			if(userinfo && userinfo.classes){	
				var classes = jsonData.userinfo.classes;
				var classmainInfo = [];
				localData.set("classes",classes);
				if(classes){
				    for(var cm = 0; cm < classes.length ; cm ++){
				        if(typeof classes[cm].is_classmain != undefined && classes[cm].is_classmain == true){
				            classmainInfo.push(classes[cm]);
				        }
				    }
				    if(classmainInfo.length > 0){
				        usertype = "classmain";
				    }else{
				    	usertype = "classmain";
				        // usertype = "teacher";
				    }
				}else{
					usertype = userinfo.usertype;
				}
			}
			if(userinfo.usertype){
				if(usertype == "teacher"){
					$.sheetAction({
						id:"report",
						title:"报表类型",
						data:["考试报表","学生报表"],
						onSelect:function(ele){
							var index = $(ele).attr("index");
							if(parseInt(index) == 0){
								location.href = "report_exam.html?openid=" + openid + "&uuid=" + uuid + "&schoolid=" + schoolid;
							}else if(parseInt(index) == 1){
								location.href = "selectstudent.html?openid=" + openid + "&uuid=" + uuid + "&schoolid=" + schoolid + "&usertype=teacher";
							}
							$(ele).addClass("selected").siblings().removeClass("selected");
							$(".lookexam").removeClass("rotate");
							$("#report").hideSheetAction();
						},
						cancel:function(){
							$(".lookexam").removeClass("rotate");
							$("#report").hideSheetAction();
						}
					});
				}else if(usertype == "classmain"){
					$.sheetAction({
						id:"report",
						title:"报表类型",
						data:["班级报表","学生报表"],
						onSelect:function(ele){
							var index = $(ele).attr("index");
							if(parseInt(index) == 0){
								location.href = "report_class.html?openid=" + openid + "&uuid=" + uuid + "&schoolid=" + schoolid;
							}else if(parseInt(index) == 1){
								location.href = "selectstudent.html?openid=" + openid + "&uuid=" + uuid + "&schoolid=" + schoolid + "&usertype=classmain";
							}
							$(ele).addClass("selected").siblings().removeClass("selected");
							$(".lookexam").removeClass("rotate");
							$("#report").hideSheetAction();
						},
						cancel:function(){
							$(".lookexam").removeClass("rotate");
							$("#report").hideSheetAction();
						}
					});
				}else if(userinfo.usertype == "student"){
					// $(".lookexam").find("span:last-child").text("我的考试");
					$(".lookexam").removeClass("right_arrow");
				}
				//查看考试
				$(".lookexam").click(function(){
					if(userinfo.usertype == "student"){
						var hrefArgs = ["openid=",openid,"&uuid=",uuid,"&schoolid=",schoolid,"&studentid=",userinfo.studentid];
						window.location.href = "report_stu_history.html?" + hrefArgs.join("");	
					}else{
						if($("#report").length > 0){
							$(this).addClass("rotate");
							$("#report").showSheetAction();
						}else{
							$.toast({
								type:"tip",
								text:"没有相关数据"
							});
						}
					}
				});
			}
			$(".name").text(initText(userinfo.realname)); //姓名
			$(".useridentity").text(initText(getUserType(usertype))) //身份
			$(".phone").text("手机号：" + initText(userinfo.mobile)) //手机
			$(".schoolname").text(initText(userinfo.schools[0].fullname)); //学校
			if(userinfo.schools.length > 1){
				$(".school").addClass("right_arrow");
				$.sheetAction({
					id:"toggleSchool",
					title:"切换学校",
					data:userinfo.schools,
					showField:"fullname",
					onSelect:function(ele){
						console.log($(ele).html());
						$(ele).addClass("selected").siblings().removeClass("selected");
						$(".schoolname").text($(ele).html());
						schoolid = userinfo.schools[index].schoolid;
						$(".school").removeClass("rotate");
						$("#toggleSchool").hideSheetAction();
					},
					cancel:function(){
						$(".school").removeClass("rotate");
						$("#toggleSchool").hideSheetAction();
					}
				});
			}else{
				$(".school").removeClass("right_arrow");
			}
			$(".school").click(function(){
				if($("#toggleSchool").length > 0){
					$(this).addClass("rotate");
					$("#toggleSchool").showSheetAction();
				}
			});
		}
	});

	//重置密码
	$(".resetpw").click(function() {
		/*$(".shade").css("display", "block");*/
		window.location.href = "resetpsw.html?openid=" + openid + "&uuid=" + uuid + "&schoolid=" + schoolid; 
	});
})