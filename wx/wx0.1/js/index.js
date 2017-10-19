$(document).ready(function() {
	var args = parseQueryArgs();
	var openid = args.openid;
	var uuid = args.uuid;
	var schoolid = args.schoolid;

	var subject = null;

	var project = null;
	var api = {
		//获取科目
		getProject: function(params) {
			var ajaxUrl = pageLoader.url + 'system.listclassifies';
			var ajaxParam = params.data;
			query("post",ajaxUrl,ajaxParam,params.success);
		},
		getUpload: function(params) {
			var ajaxUrl = pageLoader.url + 'upload.listfiles';
			var ajaxParam = params.data;
			query("post",ajaxUrl,ajaxParam,params.success);
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
				api.getUpload({
					data: {
						uuid: uuid,
						schoolid: schoolid,
				        begintime:'current',
						method: "listall",
					},
					success: function(res){
						var data = res.rows;
						if(data.length > 0){
							if(!$(".empty").hasClass(".hidden")){
								$(".empty").addClass(".hidden");
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
								var examname = data[i].title == "" ? "名字正在获取中" : data[i].title;
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
								content:"您还没有一次考试记录，快去发起一次考试吧！",
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
	// var ajaxUrl = pageLoader.url + 'system.listclassifies',
	// 	ajaxParam = {};
	// query('post', ajaxUrl, ajaxParam, function(jsonData) {
	// 	subject = jsonData.rows;
	// 	var ajaxUrl = pageLoader.url + 'upload.listfiles',
	// 		ajaxParam = {
	// 			uuid: uuid,
	// 			method: "listall",
	// 			schoolid: schoolid,
	// 	        begintime:'current',
	// 		}
	// 	query('post', ajaxUrl, ajaxParam, function(jsonData) {
	// 		//当试卷包列表不为空时设置页面样式及数据
	// 		var len = jsonData.rows.length,
	// 			li = "";
	// 		if(len > 0) {
	// 			$(".noneExam").css("display", "none");
	// 			var subjectname = null;
	// 			var subjectname = "";
	// 			var imgsrc = null;
	// 			for(var i = 0; i < len; i++) {
	// 				var classifyid = jsonData.rows[i].classifyid;
	// 				for(var j = 0, len1 = subject.length; j < len1; j++) {
	// 					if(classifyid == subject[j].id) {
	// 						subjectname = subject[j].name;
	// 						if(subjectname == "地理") {
	// 							imgsrc = "geography.png";
	// 						} else if(subjectname == "历史") {
	// 							imgsrc = "history.png";
	// 						} else if(subjectname == "数学") {
	// 							imgsrc = "math.png";
	// 						} else if(subjectname == "语文") {
	// 							imgsrc = "language.png";
	// 						} else if(subjectname == "政治") {
	// 							imgsrc = "political.png";
	// 						} else {
	// 							imgsrc = "language.png";
	// 						}
	// 					}
	// 				}
	// 				li += '<li class="examlist" classifyid="' + classifyid + '" classid="'+jsonData.rows[i].classid+'" uploadid="'+jsonData.rows[i].uploadid+'"><img src="img/' + imgsrc + '"/><p class="examname">' + jsonData.rows[i].title + '</p><p class="examgrade">&nbsp;' + subjectname + '</p><p class="examdate">' + returnPapersStatus(jsonData.rows[i].status) + '</p></li>'
	// 			}
	// 			$(".examList").append(li);
	// 			$(".examdate").each(function(i,n){
	// 				if($(n).html() == "报表已生成"){
	// 					$(n).css("color","limegreen").parent("li").click(function(){
	// 						location.href = "testAnalysis.html?uploadid="+$(this).attr("uploadid")+"&openid="+openid+"&uuid="+uuid+"&schoolid="+schoolid+"&classid="+$(this).attr("classid");
	// 					})
	// 				}
	// 			})
				
	// 		}
	// 	})
	// })
})