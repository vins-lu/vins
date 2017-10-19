$(document).ready(function() {
	var args = parseQueryArgs();
	var openid = args.openid;
	var	uuid = args.uuid;
	var	schoolid = args.schoolid;
	var gradeid = "";//年级id
	var classid = "";//班级id
	var projectid = "";//科目id
	var project = [];//所有科目
	var ClassRooms = [{name:"1班",exist:false},{name:"2班",exist:false},{name:"3班",exist:false},{name:"4班",exist:false},{name:"5班",exist:false},{name:"6班",exist:false},{name:"7班",exist:false},{name:"8班",exist:false}];

	var api = {
		//获取报表
		getReport: function(params) {
			var ajaxUrl = pageLoader.url + 'stat.studentreport';
			query("post",ajaxUrl,params.data,params.success,params.fail);
		},
		//获取科目
		getProject: function(params) {
			var ajaxUrl = pageLoader.url + 'system.listclassifies';
			query("post",ajaxUrl,params.data,params.success,params.fail);
		},
		//获取班级
		getClasses: function(params) {
			var ajaxUrl = pageLoader.url + 'classes.list';
			query("post",ajaxUrl,params.data,params.success,params.fail);
		},
		//创建考试
		createSingle: function(params) {
			var ajaxUrl = pageLoader.url + 'examine.createsingle';
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
		//获取班级列表
		getClassList: function (gradeid){
			api.getClasses({
				data:{
					openid: openid,
					schoolid:schoolid,
					level: gradeid,
				},
				success: function(res) {
					if(res && res.rows){
						var currentGradeName = $(".gradeName").text();
						var regexp = /初一|初二|初三|高一|高二|高三/gi;
						var classList = res.rows.map(function(item){
							if(item.classname.indexOf(currentGradeName) != -1){
								var className = "";
								if(regexp.test(item.classname)){
									className = item.classname.replace(regexp,"");
								}
								if(className != ""){
									return className;
								}
							}else{
								return item.classname;
							}
						});
						var newClassRooms = ClassRooms.concat([]);
						if(classList.length > 0){
							for(var j = 0;j < classList.length; j++){
								if(classList[j] == undefined || classList[j] == ""){
									break;
								}
								for(var i = 0;i < newClassRooms.length; i++){
									if(classList[j] == newClassRooms[i].name){
										newClassRooms[i].exist = true;
										break;
									}
									if(i == newClassRooms.length - 1){
										//新增加的班级
										if(classList[j] != newClassRooms[i].name){
											newClassRooms.push({
												name:classList[j],
												exist:true
											});
											break;
										}
									}
								}
								
							}
						}
						$(".className").text("请选择班级");
						util.initClassRoom(newClassRooms);
						$(".classRoom").click(function(){
							if($("#selectClass").length > 0){
								$(this).addClass("rotate");
								$("#selectClass").showSheetAction();
							}else{
								$.toast({
									type:"tip",
									text:"没有相关数据"
								});
							}
						});
						ClassRooms = [{name:"1班",exist:false},{name:"2班",exist:false},{name:"3班",exist:false},{name:"4班",exist:false},{name:"5班",exist:false},{name:"6班",exist:false},{name:"7班",exist:false},{name:"8班",exist:false}];
					}
				}
			});
		},
		//实例化班级
		initClassRoom: function(classRooms){
			var parentNode = $("#selectClass");
			var addClassBtn = parentNode.find(".addClassBtn");
			parentNode.find(".sheetItem").remove();
			if(!classRooms){
				return;
			}
			if(classRooms.length > 0){
				for(var i = 0;i < classRooms.length;i++){
					var sheetItem = $("<span></span>").addClass("sheetItem").text(classRooms[i].name);
					if(classRooms[i].exist){
						sheetItem.addClass("exist");
					}
					sheetItem.insertBefore(addClassBtn);
				}
			}
		},
		//初始化科目
		initProject: function () {
			api.getProject({
				data:{},
				success: function(res) {
					var data = res.rows;
					for(var i = 0;i < data.length; i++){
						if(data[i].normal == "1"){
							project.push(data[i]);
						}
					}
					if(project.length > 0){
						$(".projectName").text(project[0].name);//默认科目
						projectid = project[0].id;
						//选择年级
						if($("#toggleProject").length > 0){
							$("#toggleProject").hideSheetAction();
						}
						$.sheetAction({
							id:"toggleProject",
							title:"选择科目",
							data:project,
							showField:"name",
							onSelect:function(ele){
								var index = $(ele).attr("index");
								$(ele).addClass("selected").siblings().removeClass("selected");
								projectid = project[index].id;
								$(".projectName").text(project[index].name);
								$(".project").removeClass("rotate");
								$("#toggleProject").hideSheetAction();
							},
							cancel:function(){
								$(".project").removeClass("rotate");
								$("#toggleProject").hideSheetAction();
							}
						});
					}else{
						$(".projectName").text("暂时缺少相关数据");
					}
					$(".project").click(function(){
						if($("#toggleProject").length > 0){
							$(this).addClass("rotate");
							$("#toggleProject").showSheetAction();
						}else{
							$.toast({
								type:"tip",
								text:"没有相关数据"
							});
						}
					});
				}
			});
		},
		//初始化年级
		initGrade: function() {
			//获取年级列表
			var gradeData = gradeList();
			if(gradeData.length > 0){
				$(".gradeName").text(gradeData[0].text);//默认年级
				gradeid = gradeData[0].val;
				util.getClassList(gradeid);//获取班级列表
				//选择年级
				if($("#toggleGrade").length > 0){
					$("#toggleGrade").removeSheetAction();
				}
				$.sheetAction({
					id:"toggleGrade",
					title:"选择年级",
					data:gradeData,
					showField:"text",
					onSelect:function(ele){
						var index = $(ele).attr("index");
						$(ele).addClass("selected").siblings().removeClass("selected");
						gradeid = gradeData[index].val;
						$(".gradeName").text(gradeData[index].text);
						$(".grade").removeClass("rotate");
						util.getClassList(gradeid);//获取班级列表
						$("#toggleGrade").hideSheetAction();
					},
					cancel:function(){
						$(".grade").removeClass("rotate");
						$("#toggleGrade").hideSheetAction();
					}
				});
			}else{
				$(".gradeName").text("暂时缺少相关数据");
			}
			$(".grade").click(function(){
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
	}

	util.initProject();
	util.initGrade();


	$("#selectClass").on("click",".sheetItem",function(){
		$(this).toggleClass("selected");
	});
	$("#selectClass .addClassBtn").on("click",function(){
		$.Confirm({
			title: '请输入班级名称',
			content: '<input class="classRoomIpt" type="text" placeHolder="班级名称"/>',
			success: function(ele) {
				var className = $(ele).find(".classRoomIpt").val();
				if(className.trim() == ""){
					$.toast({
						type:"tip",
						text:"请输入班级名称",
					});
					return true;
				}else{
					var sheetItem = $("<span></span>").addClass("sheetItem").text(className);
					sheetItem.insertBefore($("#selectClass").find(".addClassBtn"));
				}
			},
		});
	});
	$("#selectClass .cancel").click(function(){
		$(".classRoom").removeClass("rotate");
		$("#selectClass").hideSheetAction();
	});
	$("#selectClass .confirmBtn").click(function(){
		var selectedItems = $(".sheetItem.selected");
		var selectedClassNames = [];
		for(var i = 0; i < selectedItems.length; i++){
			selectedClassNames.push($(selectedItems[i]).text());
		}
		$(".className").text(selectedClassNames.join(","));
		$(".classRoom").removeClass("rotate");
		$("#selectClass").hideSheetAction();
	});
	$("#selectClass .mask").click(function(){
		$(".classRoom").removeClass("rotate");
		$("#selectClass").hideSheetAction();
	});

	//点击 提交
	$(".submitBtn").click(function() {
		var title = $("#examTitle").val();
		var classname = $(".className").text();
		if(gradeid == ""){
			$.toast({
				type:"tip",
				text:"请选择年级"
			});
			return;
		}
		if(projectid == ""){
			$.toast({
				type:"tip",
				text:"请选择科目"
			});
			return;
		}
		if(classname == ""){
			$.toast({
				type:"tip",
				text:"请选择班级"
			});
			return;
		}
		api.createSingle({
			data:{
				openid: openid,
				uuid:uuid,
				schoolid: schoolid,
				title: title,
				classname:classname,
				classifyid:projectid,
				level:gradeid,
			},
			success: function(res) {
				$.showTip("考试已创建成功 返回上一页", function() {
					location.href = "createExam.html?openid=" + openid + "&uuid=" + uuid + "&schoolid=" + schoolid;
				});
			}
		});
	})
})