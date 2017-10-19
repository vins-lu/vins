$(document).ready(function() {
	var args = parseQueryArgs();
	var openid = args.openid;
	var	uuid = args.uuid;
	var	schoolid = args.schoolid;
	var classes = localData.get("classes");
	var usertype = args.usertype;
	if(usertype == "classmain"){
		$(".selectedExam").addClass("hidden");
	}
	var	uploadid = "";
	var examineid = "";
	if(!classes){
		window.location.href = "personage.html?openid=" + openid + "&uuid=" + uuid + "&schoolid=" + schoolid;
	}
	var	classid = classes[0].classid;
	$(".selectedClass").text(classes[0].fullname);
	var studentid = "";
	var students = null;
	var examHistory = null;

	var api = {
		//获取学生列表
		getstudents: function(params) {
			var ajaxUrl = pageLoader.url + 'classes.listnames';
			query("post",ajaxUrl,params.data,params.success,params.fail);
		},
		//获取学生的历次考试成绩
		getStudentHistory: function(params) {
			var ajaxUrl = pageLoader.url + 'stat.studenthistory';
			query("post",ajaxUrl,params.data,params.success,params.fail);
		},
		//获取科目
		getProject: function(params) {
			var ajaxUrl = pageLoader.url + 'system.listclassifies';
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
		getstudents: function() {
			api.getstudents({
				data:{
					uuid:uuid,
					classid:classid,
				},
				success: function(res) {
					students = res.rows;
					if(students.length <= 0){
						return;
					}
					studentid = students[0].studentid;
					$(".selectedStudent").text(students[0].realname);
					if(usertype == "classmain"){
						$(".selectedExam").addClass("hidden");
					}else if(usertype == "teacher"){
						util.getStudentHistory();//获取当前学生的所有历史考试
					}

					if($("#toggleStudent").length > 0){
						$("#toggleStudent").removeSheetAction();
					}
					if(students.length > 0){
						$.sheetAction({
							id:"toggleStudent",
							title:"选择学生",
							data:students,
							showField:"realname",
							onSelect:function(ele){
								var index = $(ele).attr("index");
								studentid = students[index].studentid;
								$(".selectedStudent").text(students[index].realname);
								$(ele).addClass("selected").siblings().removeClass("selected");
								if(usertype == "classmain"){
									$(".selectedExam").addClass("hidden");
								}else if(usertype == "teacher"){
									util.getStudentHistory();//获取当前学生的所有历史考试
								}
								$(".selectedStudent").removeClass("rotate");
								$("#toggleStudent").hideSheetAction();
							},
							cancel:function(){
								$(".selectedStudent").removeClass("rotate");
								$("#toggleStudent").hideSheetAction();
							}
						});
					}else{
						$(".selectedStudent").text("当前班级没有一个学生!");
					}
					$(".selectedStudent").click(function(){
						if($("#toggleStudent").length > 0){
							$(this).addClass("rotate");
							$("#toggleStudent").showSheetAction();
						}else{
							$.toast({
								type:"tip",
								text:"没有相关数据"
							});
						}
					});
				},
				fail: function(res) {

				}
			});
		},
		getStudentHistory: function() {
			api.getStudentHistory({
				data:{
					uuid:uuid,
					studentid:studentid,
					// classifyid:2
				},
				success: function(res) {
					examHistory = res.history;
					if(examHistory.length <= 0){
						return;
					}
					examineid = examHistory[0].examineid;
					uploadid = examHistory[0].uploadid;
					$(".selectedExam").text(examHistory[0].title);

					if($("#toggleExam").length > 0){
						$("#toggleExam").removeSheetAction();
					}
					if(examHistory.length > 0){
						$.sheetAction({
							id:"toggleExam",
							title:"选择考试",
							data:examHistory.map(function(item){return item.title;}),
							onSelect:function(ele){
								var index = $(ele).attr("index");
								examineid = examHistory[index].examineid;
								uploadid = examHistory[index].uploadid;
								$(".selectedExam").text(examHistory[index].title);
								// var report = examHistory[index].report;
								// console.log(report);
								$(ele).addClass("selected").siblings().removeClass("selected");
								// initDom(report);
								$(".selectedExam").removeClass("rotate");
								$("#toggleExam").hideSheetAction();
							},
							cancel:function(){
								$(".selectedExam").removeClass("rotate");
								$("#toggleExam").hideSheetAction();
							}
						});
					}else{
						$(".selectedExam").text("该学生还没有参加一个考试!");
					}
					$(".selectedExam").click(function(){
						if($("#toggleExam").length > 0){
							$(this).addClass("rotate");
							$("#toggleExam").showSheetAction();
						}else{
							$.toast({
								type:"tip",
								text:"没有相关数据"
							});
						}
					});
				}
			});
		}
	}

	util.getstudents();

	if(classes.length && classes.length > 0){
		$.sheetAction({
			id:"toggleClass",
			title:"选择班级",
			data:classes.map(function(item){
				if(item.levelid){
					item.fullname = getGradeName(item.levelid) + getClassNameNotGrade(item.fullname);
				}
				return item;
			}),
			showField:"fullname",
			onSelect:function(ele){
				var index = $(ele).attr("index");
				classid = classes[index].classid;
				$(".selectedClass").text(classes[index].fullname);
				$(ele).addClass("selected").siblings().removeClass("selected");
				util.getstudents();
				$(".selectedClass").removeClass("rotate");
				$("#toggleClass").hideSheetAction();
			},
			cancel:function(){
				$(".selectedClass").removeClass("rotate");
				$("#toggleClass").hideSheetAction();
			}
		});
	}
	$(".selectedClass").click(function(){
		if(classes.length && classes.length > 0){
			$(this).addClass("rotate");
			$("#toggleClass").showSheetAction();
		}else{
			$.toast({
				type:"tip",
				text:"没有相关数据"
			});
		}
	});
	$(".submitBtn").click(function(){
		var hrefArgs = null;
		if(studentid == ""){
			$.toast({
				type:"tip",
				text:"请先选择一个学生"
			});
			return;
		}
		if(usertype == "classmain"){
			hrefArgs = ["openid=",openid,"&uuid=",uuid,"&schoolid=",schoolid,"&studentid=",studentid];
			window.location.href = "report_stu_history.html?" + hrefArgs.join("");
		}else if(usertype == "teacher"){
			if(examineid == ""){
				$.toast({
					type:"tip",
					text:"请选择一次考试"
				});
				return;
			}
			hrefArgs = ["openid=",openid,"&uuid=",uuid,"&schoolid=",schoolid,"&studentid=",studentid,"&examineid=",examineid,"&uploadid=",uploadid];
			window.location.href = "report_student.html?" + hrefArgs.join("");
		}
	});
})