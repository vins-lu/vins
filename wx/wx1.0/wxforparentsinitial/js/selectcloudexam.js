$(document).ready(function(){
	var args = parseQueryArgs();
	var openid = args.openid;
	var	schoolid = args.schoolid;
	var project = [];//所有科目

	var api = {
		//获取科目
		getProject: function(params) {
			var ajaxUrl = baseUrl + 'system.listclassifies';
			query({type:"post",loading:true},ajaxUrl,params.data,params.success,params.fail);
		},
	}
	var util = {
		init: function() {
			$.smartScroll($(".container"),".selectArea");
			util.initgrade();
			util.initProject();
		},
		initgrade: function() {
			var grades = gradeList();
			var gradeWrap = $(".gradeWrap");
			for(var i = 0;i < grades.length; i++){
				var list = $("<div></div>").addClass("gradelist");
				if(i == 0){
					list.addClass("selected");
				}
				list.attr("val",grades[i].val).text(grades[i].text).appendTo(gradeWrap);
			};
		},
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
			var project_con = $(".subjectWrap");
			api.getProject({
				data:{},
				success: function(res) {
					var data = res.rows;
					for(var i = 0;i < data.length; i++){
						if(data[i].normal == "1"){
							project.push(data[i]);
							var subjectlist = $("<div></div>").addClass("subjectlist").attr("projectid",data[i].id).text(data[i].name);
							project_con.append(subjectlist);
						}
					}
				}
			});
		},
	}

	util.init();

	$(".gradeWrap").on("click",".gradelist",function(){
		var val = $(this).attr("val");
		$(this).addClass("selected").siblings().removeClass("selected");
		console.log(val);
	});
	$(".subjectWrap").on("click",".subjectlist",function(){
		var projectid = $(this).attr("projectid");
		$(this).addClass("selected").siblings().removeClass("selected");
		console.log(projectid);
	});
});