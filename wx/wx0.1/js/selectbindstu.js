$(document).ready(function() {
	var args = parseQueryArgs();
	var openid = args.openid;
	var	uuid = args.uuid;
	var	schoolid = args.schoolid;

	var grades = gradeList();
	var gradeid = "";
	var classid = "";
	var classname = "";
	var studentid = "";//学生id

	var api = {
		//获取班级
		getClasses: function(params) {
			var ajaxUrl = pageLoader.url + 'classes.list';
			query("post",ajaxUrl,params.data,params.success,params.fail);
		},
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
	}
	var util = {
		//获取年级列表
		getGrades: function() {
			$.sheetAction({
				id:"toggleGrade",
				title:"选择年级",
				data:grades,
				showField:"text",
				onSelect:function(ele){
					var index = $(ele).attr("index");
					gradeid = grades[index].val;
					$(".selectedGrade").attr("val",grades[index].val).text(grades[index].text);
					$(ele).addClass("selected").siblings().removeClass("selected");
					util.getClassList(gradeid);//获取班级
					$(".selectedClass").text("请选择班级!");
					$(".selectedGrade").removeClass("rotate");
					$("#toggleGrade").hideSheetAction();
				},
				cancel:function(){
					$(".selectedGrade").removeClass("rotate");
					$("#toggleGrade").hideSheetAction();
				}
			});

			$(".selectedGrade").click(function(){
				if($("#toggleGrade").length > 0){
					$(this).addClass("rotate");
					$("#toggleGrade").showSheetAction();
				}else{
					$.toast({
						type:"tip",
						text:"没有相关数据"
					});
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
										return item;
									}
								}else{
									return item;
								}
							});
							$.sheetAction({
								id:"toggleClass",
								title:"选择班级",
								data:classList,
								showField:"classname",
								onSelect:function(ele){
									var index = $(ele).attr("index");
									classid = classList[index].classid;
									$(".selectedClass").attr("classid",classList[index].classid).text(classList[index].classname);
									$(ele).addClass("selected").siblings().removeClass("selected");
									util.getstudents();//选择学生
									$(".selectedStudent").text("请选择学生!");
									$(".selectedClass").removeClass("rotate");
									$("#toggleClass").hideSheetAction();
								},
								cancel:function(){
									$(".selectedClass").removeClass("rotate");
									$("#toggleClass").hideSheetAction();
								}
							});

							$(".selectedClass").click(function(){
								if($("#toggleClass").length > 0){
									$(this).addClass("rotate");
									$("#toggleClass").showSheetAction();
								}else{
									$.toast({
										type:"tip",
										text:"没有相关数据"
									});
								}
							});
						}else{
							$(".selectedClass").text("该年级没有任何班级!");
						}
					}
				}
			});
		},
		//获取学生列表
		getstudents: function() {
			api.getstudents({
				data:{
					uuid: uuid,
					classid: classid,
				},
				success: function(res) {
					students = res.rows;
					if(students.length <= 0){
						$(".selectedStudent").text("该班级还没有学生!");
						return;
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
				}
			});
		}
	}

	util.getGrades();

	$(".nextBtn").click(function(){
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
		if(studentid == ""){
			$.toast({
				type:"tip",
				text:"请先选择一个学生"
			});
			return;
		}
		var studentname = $(".selectedStudent").text();
		var hrefArgs = ["openid=",openid,"&uuid=",uuid,"&schoolid=",schoolid,"&gradeid=",gradeid,"&classid=",classid,"&studentid=",studentid,"&studentname=",escape(studentname)]
		window.location.href = "bind.html?" + hrefArgs.join("");
	});
})