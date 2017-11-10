$(document).ready(function() {
	var args = parseQueryArgs();
	var openid = args.openid;
	var	uuid = args.uuid;
	var	schoolid = args.schoolid;

	var grades = gradeList();
	var gradeid = "";
	var classid = "";
	var classname = "";

	var api = {
		//获取班级
		getClasses: function(params) {
			var ajaxUrl = baseUrl+ 'classes.list';
			query({type:"post",loading:true},ajaxUrl,params.data,params.success,params.fail);
		},
	}
	var util = {
		//初始化页面
		initDom: function() {
			//初始化年级
			$(".selectedGrade").selectAction({
				labelText: "年级:",
			});
			//默认班级下拉列表
			$(".selectedClass").selectAction({
				labelText:"班级",
			});
		},
		//获取年级列表
		getGrades: function() {
			if(grades.length > 0){
				gradeid = grades[0].val;	
				util.getClassList(gradeid);//获取班级
				$(".selectedGrade").selectAction({
					id:"toggleGrade",
					labelText:"年级",
					data: grades,
					showField:"text",
					onSelect:function(ele){
						var index = $(ele).attr("index");
						gradeid = grades[index].val;	
						util.getClassList(gradeid);//获取班级
					}
				});
			}
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
									}
								}
								return item;
							});
							if(classList.length > 0){
								classid = classList[0].classid;//默认班级列表
								$(".selectedClass").selectAction({
									id: "toggleClass",
									labelText: "选择班级",
									data: classList,
									showField: "classname",
									onSelect:function(ele){
										var index = $(ele).attr("index");
										classid = classList[index].classid;
									}
								});
							}
						}
					}
				}
			});
		},
	}
	util.initDom();
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
		var hrefArgs = ["openid=",openid,"&uuid=",uuid,"&schoolid=",schoolid,"&gradeid=",gradeid,"&classid=",classid];
		window.location.href = "./wxforschoolinitial/selectsubject.html?" + hrefArgs.join("");
	});
})