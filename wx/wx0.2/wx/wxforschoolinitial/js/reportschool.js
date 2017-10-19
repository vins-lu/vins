$(document).ready(function() {
	var args = parseQueryArgs();
	var openid = args.openid;
	var uuid = args.uuid;
	var	schoolid = args.schoolid;
	var classifyid = args.classifyid;
	var students = null;
	var examHistory = null;
	var paperFiles = [];

	var grades = gradeList();
	var gradeid = "";

	if(!args.uuid || args.uuid == ""){
		$.showTip({
			content: "页面数据错误,即将返回上一个页面",
			success: function(){
				window.history.back();
			}
		});
		return;
	}


	var api = {
		//获取参加过考试的年级
		getGrade: function(params) {
			var ajaxUrl = baseUrl + 'classes.list';
			query("post",ajaxUrl,params.data,params.success,params.fail);
		},
		//获取报表
		getReport: function(params) {
			var ajaxUrl = baseUrl + 'stat.fetchreport';
			query("post",ajaxUrl,params.data,params.success,params.fail);
		},
	}
	var util = {
		//获取年级列表
		initGrades: function() {
			if(grades.length > 0){
				gradeid = grades[0].val;	
				var gradeCon = $(".grades");
				var gradeList = null;
				for(var i = 0; i < grades.length; i++) {
					gradeList = $("<div></div>").addClass("gradeList").attr("gradeid",grades[i].val).text(grades[i].text).appendTo(gradeCon);
					if(i == 0){
						gradeList.addClass("selected");
					}
				}
				gradeList = null;
			}
		},
	    getReport: function (type) {
	    	if(!type || type == "exam"){
	    		api.getReport({
	    			data:{
	    				uuid: uuid,
	    			},
	    			success: function(res) {
	    				if((res.reports && res.reports.length <= 0) || (res.report && res.report.length <= 0)){
	    					$.showTip({
	    						content: "报表不存在!"
	    					});
	    					$(".reportPanel").emptyState({
	    						type: "nolist",
	    						content: "报表不存在",
	    						replace: true,
	    					});
	    					return;
	    				}
	    			
	    			}
	    		});
	    	}
	    },
	}
	util.initGrades();
	util.getReport();

	$(".grades").on("click",".gradeList",function(){
		var _this = $(this);
		_this.addClass("selected").siblings().removeClass("selected");
		gradeid = _this.attr("gradeid");
		util.getReport();//获取该年级下面的所有考试信息
	});

	window.addEventListener("touchmove",function(e){
		var scrollTop = $("body").scrollTop();
		if(scrollTop > 100){
			$(".selectGrade").addClass("fixedTop").slideDown();
		}else{
			$(".selectGrade").removeClass("fixedTop");
		}
	});
	$(window).scroll(function(e){
		var scrollTop = $("body").scrollTop();
		if(scrollTop > 100){
			$(".selectGrade").addClass("fixedTop").slideDown();
		}else{
			$(".selectGrade").removeClass("fixedTop");
		}
	})
})