$(document).ready(function() {
	var args = parseQueryArgs();
	var openid = args.openid;
	var	uuid = args.uuid;
	var	schoolid = args.schoolid;
	// var examineid = args.examineid;
	// var classifyid = args.classifyid;
	var project = null;
	var api = {
		//获取科目
		getProject: function(params) {
			var ajaxUrl = pageLoader.url + 'system.listclassifies';
			query("post",ajaxUrl,params.data,params.success);
		},
		getExams: function(params) {
			var ajaxUrl = pageLoader.url + 'examine.list';
			query("post",ajaxUrl,params.data,params.success);
		},
		createpackage: function(params) {
			var ajaxUrl = pageLoader.url + 'upload.createpackage';
			query("post",ajaxUrl,params.data,params.success);
		}
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
		}
	}
	api.getProject({
		data:{},
		success: function(res){
			if(res.ok){
				project = res.rows;
				var paramsData = {
					openid: openid,
					schoolid: schoolid,
					listtype: "joinable",
					uuid: uuid,
					orderby: "createtime",
					orderasc:0
				}
				if(args.examineid && args.classifyid){
					paramsData = {
						openid: openid,
						schoolid: schoolid,
						listtype: "examines",
						examineid: args.examineid,
						classifyid: args.classifyid,
						uuid: uuid,
						method: "listall",
					}
				}
				api.getExams({
					data: paramsData,
					success: function(res){
						var data = res.rows;
						if(data.length > 0){
							if(!$(".empty").hasClass("hidden")){
								$(".empty").addClass("hidden");
							}
							var wrap = $(".examWrap");
							var examItem = $(".modal .examlist").removeClass("hidden");
							for(var i = 0; i < data.length; i++){
								var newExam = examItem.clone(true);
								newExam.attr({
									"classifyid":data[i].classifyid,
									"examineid":data[i].examineid,
									"classid":data[i].classid,
									"title":data[i].title,
									"status":data[i].status,
								});
								var examname = data[i].title == "" ? "名字正在获取中" : data[i].title;
								var projectName = util.getProjectName(data[i].classifyid);
								var classname = data[i].classname;
								var imgurl = getProjectImg(projectName);
								newExam.find(".projectImg img").attr("src","img/" + imgurl + ".png");
								newExam.find(".examname").text(examname);
								newExam.find(".examgrade").text(classname + projectName);
								newExam.find(".examdate").text(data[i].create_time.slice(0,10));
								newExam.find(".examstate").text("参加");
								wrap.append(newExam);
							}
						}else if(data.length == 0){
							//数据为空
							$(".empty").removeClass("hidden").emptyState({
								type:"nomessage",
								content:"该考试已经被参加，请等待分析结果吧！",
								style:{
									marginTop:"38.2%"
								}
							});
						}else{
							//数据异常
							$(".empty").removeClass("hidden").emptyState({
								type:"exception",
								content:"数据异常，请稍后再试！",
							});
						}
					}
				});
			}
		}
	});

	$("body").on("click",".examlist",function(){
		var _this = $(this);
		var classifyid = _this.attr("classifyid");
		var examineid = _this.attr("examineid");
		var classid = _this.attr("classid");
		var title = _this.attr("title");
		$.Confirm({
			title: '提示',
			content:"确认参加考试？",
			success:function(res){
				if(res){
					api.createpackage({
						data:{
			            	uuid: uuid,
			            	classid: classid,
			            	classifyid: classifyid,
			            	examineid: examineid,
			            	platform:"pc",
			            	title: title,
			            },
			            success: function (res) {
			            	if(res.ok){
				            	$.showTip("成功参加考试,请在pc上传学生答卷");
			            	}
			            }
					});
				}
			}
		});
		// $.showTip("请在pc端参加考试");
	});

	$(".goback .btn").click(function(){
		window.history.back();
	});

})