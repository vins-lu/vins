$(document).ready(function() {
	var args = parseQueryArgs();
	var openid = args.openid;
	var	uuid = args.uuid;
	var	schoolid = args.schoolid;
	var gradeid = args.gradeid;//年级id
	var classid = args.classid;//班级id
	var projectid = "";//科目id
	var project = [];//所有科目

	var api = {
		//获取科目
		getProject: function(params) {
			var ajaxUrl = baseUrl + 'system.listclassifies';
			query({type:"post",loading:true},ajaxUrl,params.data,params.success,params.fail);
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
							var projectlist = $("<div></div>").addClass("projectlist").attr("projectid",data[i].id).text(data[i].name);
							project_con.append(projectlist);
						}
					}
					project_con.on("click",".projectlist",function(){
						var projectid = $(this).attr("projectid");
						var hrefArgs = ["openid=",openid,"&uuid=",uuid,"&schoolid=",schoolid,"&gradeid=",gradeid,"&classid=",classid,"&projectid=",projectid];
						window.location.href = "selectexam.html?" + hrefArgs.join("");
					});
				}
			});
		},
	}

	util.initProject();

	$(".backBtn").click(function(){
		window.history.back();
	});
})