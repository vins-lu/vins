$(document).ready(function() {
	var args = parseQueryArgs();
	var openid = args.openid;
	var uuid = args.uuid;
	var	schoolid = args.schoolid;

	var grades = [];
	var gradeid = "";
	var project = [];

	var statid = "";

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
		//获取科目
		getProject: function(params) {
			var ajaxUrl = baseUrl + 'system.listclassifies';
			query({type:"post",loading:true},ajaxUrl,params.data,params.success,params.fail);
		},
		//获取参加过考试的年级
		getGrade: function(params) {
			var ajaxUrl = baseUrl + 'classes.list';
			query("post",ajaxUrl,params.data,params.success,params.fail);
		},
		//获取年级参加过的考试
		getExam: function(params) {
			var ajaxUrl = baseUrl + 'examine.list';
			query("post",ajaxUrl,params.data,params.success,params.fail);
		},
		//获取报表
		getReport: function(params) {
			var ajaxUrl = baseUrl + 'stat.fetchreport';
			query("post",ajaxUrl,params.data,params.success,params.fail);
		},
	}
	var util = {
		//根据科目id返回科目名称
		getProjectName: function (projectid){
			if(!project || project.length <= 0){
				return "";
			}
			for(var i = 0; i < project.length; i++){
				if(project[i].id == projectid){
					return project[i].name;
				}
			}
			return "";
		},
		//初始化科目
		initProject: function () {
			var project_con = $(".project_con");
			api.getProject({
				data:{},
				success: function(res) {
					var data = res.rows;
					for(var i = 0;i < data.length; i++){
						if(data[i].normal == "1"){
							project.push(data[i]);
						}
					}
				}
			});
		},
		//获取年级列表
		initGrades: function() {
			api.getGrade({
				data: {
					uuid: uuid,
					schoolid: schoolid,
				},
				success: function (res) {
					grades = res.rows;
	    			var gradesSet = {};
	    			if(grades.length > 0){
	    				gradeid = grades[0].levelid;
	    				util.getExam();
	    				var gradeCon = $(".grades");
	    				var gradeList = null;
	    				for(var i = 0; i < grades.length; i++) {
	    					if(!gradesSet[grades[i].levelid]){
	    						gradesSet[grades[i].levelid] = true;
	    						gradeList = $("<div></div>").addClass("gradeList").attr("gradeid",grades[i].levelid).text(getGradeName(grades[i].levelid)).appendTo(gradeCon);
	    						if(i == 0){
	    							gradeList.addClass("selected");
	    						}
	    					}
	    				}
	    				gradeList = null;
					}else{
						$("body").emptyState({
							type: "nolist",
							content: "当前还没有一个年级的考试报表",
							replace: true,
							style: {
								position: "absolute",
								top: "38.2%",
								transform: "translate(0,-50%)"
							}
						});
					}
				}
			});
		},
	    getExam: function () {
	    	// 获取年级参加的考试
	    	api.getExam({
	    		data: {
	    			uuid: uuid,
	    			schoolid: schoolid,
	    			listtype: "grade",
	    			level: gradeid,
	    		},
	    		success: function (res) {
	    			var data = res.rows;
	    			if(data.length > 0){
	    				var statids = [];
	    				data.map(function(item){
	    					if(item.statid && item.statid != "0"){
	    						statids.push(item.statid);
	    					}
	    					return item;
	    				});
	    				if(statids.length > 0){
	    					statid = statids.join(",");
	    				}else{
	    					statid = "";
	    				}
	    				util.getReport();
	    			}else{
	    				$(".exams").emptyState({
	    					type: "nolist",
	    					content: "当前还没有一个年级的考试报表",
	    					replace: true,
	    					style: {
	    						position: "absolute",
	    						top: "38.2%",
	    						transform: "translate(0,-50%)"
	    					}
	    				});
	    			}
	    		}
	    	});
	    },
	    getReport: function() {
	    	if(statid == ""){
	    		$(".exams").emptyState({
	    			type: "nolist",
	    			content: "当前还没有一个年级的考试报表",
	    			replace: true,
	    			style: {
	    				position: "absolute",
	    				top: "38.2%",
	    				transform: "translate(0,-50%)"
	    			}
	    		});
	    		return;
	    	}
    		api.getReport({
    			data:{
    				uuid: uuid,
    				statid: statid
    			},
    			success: function(res) {
    				$(".exams").empty();
    				var examlist = $(".model").find(".examList");
    				var elprojectList = $(".model").find(".elprojectList");
    				if(res.report){
    					var report = res.report;
    					var newExamlist = examlist.clone(true);
    					var elproList = elprojectList.clone(true);
    					elproList.attr("examineid",report.examineid);
    					newExamlist.find(".label_text").text(getGradeName(gradeid));
    					newExamlist.find(".examTitle").text(report.title);

    					elproList.find(".projectText").text(util.getProjectName(res.classifyid));
    					elproList.find(".avgText").text(report.average);

    					var overninety = report.scores_ordered.filter(function(item){
    						return item.score > 90;
    					});
    					elproList.find(".overNinety").text(Math.round(overninety.length * 100 / report.total) + "%");
    					elproList.find(".pass").text(Math.round(report.passed * 100 / report.total) + "%");

    					var classes_ordered = report.classes.sort(function(val1,val2){
    						return val1.average_scores > val2.average_scores;
    					});

    					function getClassName(cid){
    						var current_cla = report.classes.filter(function(item){
    							return item.classid == cid;
    						});
    						return current_cla ? current_cla[0].gradename + "-" + current_cla[0].classname : "";
    					}

    					elproList.find(".avgMax_class").text(classes_ordered[0].gradename + "-" + classes_ordered[0].classname);
    					elproList.find(".avgMax_score").text(classes_ordered[0].average_scores + "分");
    					elproList.find(".avgMin_class").text(classes_ordered[classes_ordered.length - 1].gradename + "-" + classes_ordered[classes_ordered.length - 1].classname);
    					elproList.find(".avgMin_score").text(classes_ordered[classes_ordered.length - 1].average_scores + "分");

    					var scores_ordered = report.scores_ordered;
    					elproList.find(".scoreMax_class").text(getClassName(scores_ordered[0].cid));
    					elproList.find(".scoreMax_stu").text(scores_ordered[0].name);
    					elproList.find(".scoreMax_score").text(scores_ordered[0].score + "分");
    					elproList.find(".scoreMin_class").text(getClassName(scores_ordered[scores_ordered.length - 1].cid));
    					elproList.find(".scoreMin_stu").text(scores_ordered[scores_ordered.length - 1].name);
    					elproList.find(".scoreMin_score").text(scores_ordered[scores_ordered.length - 1].score + "分");

    					newExamlist.append(elproList).appendTo($(".exams"));
    				}else if(res.reports){
    					var reports = res.reports;
    					for(var i = 0; i < reports.length; i++){
    						var newExamlist = examlist.clone(true);
	    					var elproList = elprojectList.clone(true);
	    					elproList.attr("examineid",reports[i].examineid);
	    					newExamlist.find(".label_text").text(getGradeName(gradeid));
	    					newExamlist.find(".examTitle").text(reports[i].title);

	    					elproList.find(".projectText").text(util.getProjectName(res.classifyid));
	    					elproList.find(".avgText").text(reports[i].average);

	    					var overninety = reports[i].scores_ordered.filter(function(item){
	    						return item.score > 90;
	    					});
	    					elproList.find(".overNinety").text(Math.round(overninety.length * 100 / reports[i].total) + "%");
	    					elproList.find(".pass").text(Math.round(reports[i].passed * 100 / reports[i].total) + "%");

	    					var classes_ordered = reports[i].classes.sort(function(val1,val2){
	    						return val1.average_scores > val2.average_scores;
	    					});

	    					function getClassName(cid){
	    						var current_cla = reports[i].classes.filter(function(item){
	    							return item.classid == cid;
	    						});
	    						return current_cla ? current_cla[0].gradename + "-" + current_cla[0].classname : "";
	    					}

	    					elproList.find(".avgMax_class").text(classes_ordered[0].gradename + "-" + classes_ordered[0].classname);
	    					elproList.find(".avgMax_score").text(classes_ordered[0].average_scores + "分");
	    					elproList.find(".avgMin_class").text(classes_ordered[classes_ordered.length - 1].gradename + "-" + classes_ordered[classes_ordered.length - 1].classname);
	    					elproList.find(".avgMin_score").text(classes_ordered[classes_ordered.length - 1].average_scores + "分");

	    					var scores_ordered = reports[i].scores_ordered;
	    					elproList.find(".scoreMax_class").text(getClassName(scores_ordered[0].cid));
	    					elproList.find(".scoreMax_stu").text(scores_ordered[0].name);
	    					elproList.find(".scoreMax_score").text(scores_ordered[0].score + "分");
	    					elproList.find(".scoreMin_class").text(getClassName(scores_ordered[scores_ordered.length - 1].cid));
	    					elproList.find(".scoreMin_stu").text(scores_ordered[scores_ordered.length - 1].name);
	    					elproList.find(".scoreMin_score").text(scores_ordered[scores_ordered.length - 1].score + "分");

	    					newExamlist.append(elproList).appendTo($(".exams"));

    					}
    				}else{
    					$(".exams").emptyState({
			    			type: "nolist",
			    			content: "当前还没有一个年级的考试报表",
			    			replace: true,
			    			style: {
			    				position: "absolute",
			    				top: "38.2%",
			    				transform: "translate(0,-50%)"
			    			}
			    		});
    				}
    			}
    		});
	    },
	}
	util.initProject();
	util.initGrades();

	$(".grades").on("click",".gradeList",function(){
		var _this = $(this);
		_this.addClass("selected").siblings().removeClass("selected");
		gradeid = _this.attr("gradeid");
		util.getExam();//获取该年级下面的所有考试信息
	});

	$(".exams").on("click",".elprojectList",function(){
		var examineid = $(this).attr("examineid");
		var hrefArgs = ["openid=",openid,"&uuid=",uuid,"&schoolid=",schoolid,"&gradeid=",gradeid,"&examineid=",examineid];
		window.location.href = "./wxforschoolinitial/reportgradeproject.html?" + hrefArgs.join("");
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
	});
})