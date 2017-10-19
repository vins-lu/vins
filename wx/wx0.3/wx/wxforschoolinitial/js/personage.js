$(document).ready(function() {
	//设置body
	var args = parseQueryArgs();
	var uuid = args.uuid;
	var openid = args.openid;
	var schoolid = args.schoolid;
	var usertype = args.usertype;
	if(usertype == "school"){
		$(".school_report").removeClass("hidden");
	}else{
		$(".school_report").addClass("hidden");
	}
	
	var ajaxUrl = baseUrl + 'users.getuserinfo';
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
				}
			}
			$(".name").text(initText(userinfo.realname)); //姓名
			$(".useridentity").text(getUserType(usertype)) //身份
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

	//查看考试
	$(".lookexam").click(function(){
		var hrefArgs = ["openid=",openid,"&uuid=",uuid,"&schoolid=",schoolid];
		window.location.href = "./teacher_selectclass.html?" + hrefArgs.join("");
	});
	$(".school_report").click(function(){
		var hrefArgs = ["openid=",openid,"&uuid=",uuid,"&schoolid=",schoolid];
		window.location.href = "./reportschool.html?" + hrefArgs.join("");
	});

	//重置密码
	$(".resetpw").click(function() {
		window.location.href = "./wxforschoolinitial/getmsgcode.html?openid=" + openid + "&uuid=" + uuid + "&schoolid=" + schoolid; 
	});
	//绑定新的手机号
	$(".bindNewMobile").click(function(){
		window.location.href = "./wxforschoolinitial/verifyoldmobile.html?openid=" + openid + "&uuid=" + uuid + "&schoolid=" + schoolid; 
	});
})