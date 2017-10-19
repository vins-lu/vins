$(document).ready(function() {
	//设置body
	var ages = parseQueryArgs();
	var openid = ages.openid;
	var schoolid = ages.schoolid;
	
	var ajaxUrl = baseUrl + 'users.getuserinfo';
	var ajaxParam = {
		openid: openid,
		who: openid,
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
				}
			}
			$(".name").text(initText(userinfo.realname)); //姓名
			$(".useridentity").text("教师") //身份
			$(".phone").text("手机号：" + initText(userinfo.mobile)) //手机
			// $(".schoolname").text(initText(userinfo.schools[0].fullname)); //学校
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

	//查看考试
	$(".lookexam").click(function(){
		var hrefArgs = ["openid=",openid,"&schoolid=",schoolid];
		window.location.href = "./student_reportstuhistory.html?" + hrefArgs.join("");	
	});

	//重置密码
	$(".resetpw").click(function() {
		window.location.href = "./wxforstudentinitial/getmsgcode.html?openid=" + openid + "&schoolid=" + schoolid; 
	});
	//绑定新的手机号
	$(".bindNewMobile").click(function(){
		window.location.href = "./wxforstudentinitial/getmsgcode.html?openid=" + openid  + "&schoolid=" + schoolid; 
	});
})