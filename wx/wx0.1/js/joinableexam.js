$(document).ready(function() {
	var args = parseQueryArgs();
	var openid = args.openid;
	var	uuid = args.uuid;
	var	schoolid = args.schoolid;
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
		},
		getStateName: function (state){
			var stateName = "";
			switch (state){
				case "waitupload":
					stateName = "没有上传空白试卷";
					break;
				case "analyzing":
					stateName = "试卷分析中";
					break;
				case "failed":
					stateName = "试卷有问题";
					break;
				case "useable":
					stateName = "试卷分析已完成";
					break;
				default:
					break;
			}
			return stateName;
		}
	}
	api.getProject({
		data:{},
		success: function(res){
			if(res.ok){
				project = res.rows;
				api.getExams({
					data: {
						openid: openid,
						schoolid: schoolid,
						listtype: "joinable",
						uuid: uuid,
						orderby: "createtime",
						orderasc:0
					},
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
									"status":data[i].status,
								});
								var projectName = util.getProjectName(data[i].classifyid);
								var examname = data[i].title;
								if(data[i].title == "" || data[i].title === null){
									examname = "名字获取中...";
								}
								var stateName = util.getStateName(data[i].status);
								var imgurl = getProjectImg(projectName);
								newExam.find(".projectImg img").attr("src","img/" + imgurl + ".png");
								newExam.find(".examname").text(examname);
								newExam.find(".examgrade").text(projectName);
								newExam.find(".examdate").text(data[i].create_time.slice(0,10));
								newExam.find(".examstate").text(stateName);
								wrap.append(newExam);
							}
						}else if(data.length == 0){
							//数据为空
							$(".empty").removeClass("hidden").emptyState({
								type:"nolist",
								content:"目前没有可以参加的考试，快去发起一次考试吧！",
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
		var	status = _this.attr("status");
		if(status == "useable"){
			var argsobj = ["openid=",openid,"&uuid=",uuid,"&schoolid=",schoolid,"&classifyid=",classifyid,"&examineid=",examineid];
			window.location.href = "joinexam.html?" + argsobj.join("");
		}else{
			$.toast({
				type:"tip",
				text:util.getStateName(status),
			});
		}
	});

	setInterval(function(){
		window.location.reload();
	},30000);

})