$(document).ready(function() {
	var args = parseQueryArgs();
	var openid = args.openid;
	var	uuid = args.uuid;
	var	schoolid = args.schoolid;
	var	uploadid = "";
	var	classid = "";
	var searchkey = "";
	var groupid = "";
	$("#circlechart").css("width", $(window).width() * (60 / 100));
	$("#circlechart").css("height", $(window).width() * (60 / 100));
	$("#compare_chart").css("width", $(window).width());
	$("#compare_chart").css("height", $(window).width());
	$("#score_section").css("width", $(window).width());
	$("#score_section").css("height", $(window).width());
	$("#graph>span").width($(window).width() * (60 / 100));
	var x = $(window).width() * (60 / 100) / 2;
	$("#graph>span").css("top", x - 22);

	var barColor = ['#E84E40', '#29B6F6', '#26C6DA', '#2BAF2B', '#FFA726', '#AB47BC', '#7E57C2', '#A5A5A5', '#FFBE00', '#4472C4'];
	$("#graph>ul>li>div").each(function(i, n) {
		$(n).css("background", barColor[i])
	})


	var classes = null;
	var schools = null;
	var currentExam = null;
	var currentUpload = null;
	var classList = {};
	var peoplecentchart = null;
	var circlechart = null;
	var compare_chart = null;
	var score_section = null;
	var api = {
		//获取所有考试试卷包
		getUpload: function(params) {
			var ajaxUrl = pageLoader.url + 'upload.listfiles';
			query("post",ajaxUrl,params.data,params.success,params.fail);
		},
		//获取报表
		getReport: function(params) {
			var ajaxUrl = pageLoader.url + 'stat.fetchreport';
			query("post",ajaxUrl,params.data,params.success,params.fail);
		},
		//获取知识点
		getKnowledges: function(params) {
			var ajaxUrl = pageLoader.url + 'system.listknowledges';
			query("post",ajaxUrl,params.data,params.success,params.fail);
		},
		//获取学生列表
		getstudents: function(params) {
			var ajaxUrl = pageLoader.url + 'classes.listnames';
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
		getStateName: function (state){
			var stateName = "";
			var _state = state.toString().toLowerCase();
			switch (_state){
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
		},
		getReport: function (type) {
			if(!type || type == "exam"){
				if(currentExam == null){
					return;
				}
				api.getReport({
					data:{
						uuid: uuid,
						classid:classid,
						uploadid: currentExam.uploadid,
					},
					success: function(res) {
						if((res.reports && res.reports.length <= 0) || (res.report && res.report.length <= 0)){
							$.toast({
								type:"tip",
								text:"报表不存在"
							});
							return;
						}
						util.analyzeReport(res);
					}
				});
			}else if(type == "upload"){
				if(currentUpload == null){
					return;
				}
				api.getReport({
					data:{
						uuid: uuid,
						childforexamine: 1,
						examineid:currentUpload.groupid,
					},
					success: function(res) {
						if((res.reports && res.reports.length <= 0) || (res.report && res.report.length <= 0)){
							$.toast({
								type:"tip",
								text:"报表不存在"
							});
							return;
						}
						util.classCompare(res);
					}
				});
			}
		},
		analyzeReport: function(jsonData) {
			if(jsonData) {
				var report = jsonData.report;
				var fullscores = report.fullscores;	//总分
				//各分数段人数
				var nummberPeople = [report.total, report.passed, report.excellent, report.frontwards, report.backwards, report.fullscores, report.average];
				$(".numberPeople").each(function(i, n) {
					$(n).html(nummberPeople[i])
				});
				//柱状图数据
				util.chart_report(report);
				//创建得分率最高10题的列表
				util.compar($("#high"), report.tops.get);
				//创建得分率最低10题的列表
				util.compar($("#lowes"), report.tops.lose);
				//创建知识点分析列表
				util.kd_report(report);
			} else {
				$.showTip("请求数据错误");
			}
		},
		//创建对比列表
		compar: function (obj, arr) {
			var li = "";
			var rate = "";
			for(var i = 0; i < arr.length; i++) {
				if(isNaN(arr[i].rate)){
					rate = "--";
				}else{
					rate = parseInt(arr[i].rate * 100) + "%";
				}
				li += "<li class='dataItem'><span class='liFirst'>" + NumberToChinese(arr[i].A) + "</span><span>" + (arr[i].B ? arr[i].B : arr[i].no) + "</span><span>" + arr[i].num + "</span><span>" + rate + "</span></li>"
			}
			$(obj).find(".dataItem").remove();
			$(obj).append(li);
		},
		//创建知识点分析列表
		kd_report: function(report){
			//将知识点id存入数组
			var analyTo = report.knowledges_ordered.list;
			var knowledgeids = [];
			var fullscores = report.fullscores;	//总分
			for(var i = 0, len = analyTo.length; i < len; i++) {
				knowledgeids.push(analyTo[i].knowledgeid);
			}

			var knowledgenames = null;	//知识点名字
			var knowledgenum = 0;	//知识点出现次数
			var knowledgescores = 0;
			var classurl = pageLoader.url + 'system.listknowledges';
			var classParam = {
				uuid: uuid,
				knowledgeids: knowledgeids.join(","),
			};
			api.getKnowledges({
				data:{
					uuid: uuid,
					knowledgeids: knowledgeids.join(","),
				},
				success: function(jsonData) {
					knowledgenames = jsonData;
					var knowledgename = null;
					var analy = [];
					for(var p = 0; p < analyTo.length; p++) {
						//获取所有知识点出现次数
						knowledgenum += analyTo[p].questions.length;
					}
					for(var p = 0; p < analyTo.length; p++) {
						//查找知识点name
						for(var i = 0, len = knowledgenames.rows.length; i < len; i++) {
							if(knowledgenames.rows[i].id == analyTo[p].knowledgeid) {
								knowledgename = knowledgenames.rows[i].title;
							}
						}
						//计算知识点出现次数占比	知识点次数	/ 所有知识点出现次数
						var time = parseInt(analyTo[p].questions.length/knowledgenum*100)+"%";
						
						//计算知识点分数占比	知识点所占分数 / 总分数
						var scoresoc = 0;
						for(var i=0,len=analyTo[p].questions.length;i<len;i++){
							scoresoc += analyTo[p].questions[i].scores;
						}
						scoresoc = parseInt(scoresoc / fullscores * 100) + "%";
						
						//计算错误率	知识点错误人数	/	总人数
							//将本知识点错误学生id存到数组 然后去重 计算人数
						var errornum = [];
						for(var i=0,len=analyTo[p].questions.length;i<len;i++){
							if(analyTo[p].questions[i].loses != undefined){
								for(var j=0,len1=analyTo[p].questions[i].loses.length;j<len1;j++){
									errornum.push(analyTo[p].questions[i].loses[j]);															
								}
							}
						}
						
						analy.push({
							"A": knowledgename, //知识点名称
							"B": time,	//出现次数占比
							"num": scoresoc,	//分数占比
							"rate": removeDuplicatedItem(errornum).length / errornum.length	//错误率
						})
					}
					util.compar($("#analy"), analy);
				}
			});
		},
		//柱状图数据列表
		chart_report: function(report){
			//各分数段人数
			var nummberPeople = [report.total, report.passed, report.excellent, report.frontwards, report.backwards, report.fullscores, report.average];
			//柱状图数据
			var colOptionsDatas = [];
			var colOptionsRange = [];
			var ranges = report.range_reference.ranges;
			var rangesOne = report.ranges;
			for(var i = 0; i < ranges.length; i++) {
				var colOptionsData = {
					value: rangesOne[i].length,
					itemStyle: {
						normal: {
							color: barColor[i]
						}
					}
				}
				colOptionsDatas.push(colOptionsData);
			}
			for(var o = 0; o < ranges.length; o++) {
				colOptionsRange.push(ranges[o][0] + '-' + ranges[o][1])
			}
			colOptions = {
				xAxis: {
					data: colOptionsRange
				},
				series: [{
					data: colOptionsDatas
				}]
			}
			peoplecentchart.setOption(colOptions);
			//填图表下面的提示
			var colP = '';
			$.each(colOptionsRange, function(i, n) {
				colP += '<p><span style="background: ' + barColor[i] + ';"></span>' + n + '</p>';
			})
			$("#colP").empty().append(colP);
			$("#colP>p").css("width", $(document).width() * (94 / 100) / colOptionsRange.length);
			//饼状图数据
			var per = (nummberPeople[1] / nummberPeople[0] * 100).toFixed(1);
			$("#graph>span").html(per + "%");
			pieOptions = {
				series: [{
					data: [{
							value: report.passed,
							// name: '及格人数'
						},
						{
							value: report.total - report.passed,
							// name: '不及格人数'
						}
					]
				}]
			};
			circlechart.setOption(pieOptions);
		},
		//学生列表
		student_report: function(report){
			api.getstudents({
				data:{
					uuid:uuid,
					classid:classid,
				},
				success: function(res) {
					var students = res.rows;
					if(students.length <= 0){
						return;
					}
				}
			});
		},
		//初始化柱状图
		init_chart: function(){
			//初始化柱状图
			peoplecentchart = echarts.init(document.getElementById('scoreMap'));
			var peoplecentchartoption = {
				xAxis: {
					data: []
				},
				yAxis: {},
				series: [{
					name: '分数',
					type: 'bar',
					//需要各阶段的人数
					data: []
				}]
			};
			peoplecentchart.setOption(peoplecentchartoption);

			//初始化饼状图
			circlechart = echarts.init(document.getElementById('circlechart'));
			var circlechartoption = {
				series: [{
					type: 'pie',
					radius: ['50%', '70%'],
					avoidLabelOverlap: false,
					label: {
						normal: {
							show: false,
							position: 'center'
						},
						emphasis: {
							show: true,
							textStyle: {
								fontSize: '30',
								fontWeight: 'bold'
							}
						}
					},
					labelLine: {
						normal: {
							show: false
						}
					},
					data: []
				}]
			};
			circlechart.setOption(circlechartoption);
		},
		//初始化折线对比图
		init_compare_chart: function(){
			compare_chart = echarts.init(document.getElementById('compare_chart'));
			var option = {
			    title: {
			        text: '成绩对比图'
			    },
			    tooltip : {
			        trigger: 'axis',
			        axisPointer: {
			            type: 'cross',
			            label: {
			                backgroundColor: '#6a7985'
			            }
			        }
			    },
			    legend: {
			        data:['平均分','及格率%'],
			        right:0,
			    },
			    grid: {
			        left: '3%',
			        right: '4%',
			        bottom: '3%',
			        containLabel: true
			    },
			    xAxis : [
			        {
			            type : 'category',
			            boundaryGap : false,
			            data : [],
			        }
			    ],
			    yAxis : [
			        {
			            type : 'value'
			        }
			    ],
			    series : [
			        {
			            name:'平均分',
			            type:'line',
			            stack: '成绩',
			            label: {
			                normal: {
			                    show: true,
			                    position: 'top'
			                }
			            },
			            areaStyle: {normal: {}},
			            data:[]
			        },
			        {
			            name:'及格率%',
			            type:'line',
			            stack: '成绩',
			            label: {
			                normal: {
			                    show: true,
			                    position: 'top'
			                }
			            },
			            areaStyle: {normal: {}},
			            data:[]
			        }
			    ]
			};
			compare_chart.setOption(option);
		},
		//班级考试对比
		classCompare: function(res){
			console.log(res);
			var classes = res.classes;
			var reports = res.reports;

			if(reports === null || reports == undefined || reports.length <= 0){
			    $(".notCompare").removeClass("hidden").emptyState({
			        type:"exception",
			        content:"至少两个班级同时参加同一个考试<br/>才能比较哦",
			        replace:true,
			    });
			    $(".compareArea").addClass("hidden");
			    return;
			}else{
				$(".notCompare").addClass("hidden");
				$(".compareArea").removeClass("hidden");
			    var xAxisData = classes.map(function(item){
			        return item.classname;
			    });
			    var series_avg = reports.map(function(item){
			        return item.average;
			    });
			    var series_pass = reports.map(function(item){
			        return ((item.passed / item.total) * 100).toFixed(2);
			    });
			    var charsOption = {
			        xAxis : [
			            {
			                data : xAxisData,
			            }
			        ],
			        series : [
			            {
				            name: '平均分',
				            type:'line',
				            stack: '成绩',
				            label: {
				                normal: {
				                    show: true,
				                    position: 'top'
				                }
				            },
				            areaStyle: {normal: {}},
				            data: series_avg,
				        },
				        {
				            name: '及格率%',
				            type: 'line',
				            stack: '成绩',
				            label: {
				                normal: {
				                    show: true,
				                    position: 'top'
				                }
				            },
				            areaStyle: {normal: {}},
				            data: series_pass,
				        }
			        ]
			    };
			    compare_chart.setOption(charsOption);
			    //分数段对比图
			    score_section = echarts.init(document.getElementById('score_section'));
			    var ranges = reports[0].range_reference.ranges;
			    var ranges_classData = [];
			    for(var i = 0; i < reports.length; i ++){
			    	ranges_classData.push({
			    		name: classes[i].classname,
			    		type:'line',
			    		stack: '成绩',
			    		label: {
			    		    normal: {
			    		        show: true,
			    		        position: 'top'
			    		    }
			    		},
			    		areaStyle: {normal: {}},
			    		data:reports[i].ranges.map(function(item){return item.length;})
			    	})
			    }
			    var score_option = {
			        title: {
			            text: '分数段人数对比图'
			        },
			        tooltip : {
			            trigger: 'axis',
			            axisPointer: {
			                type: 'cross',
			                label: {
			                    backgroundColor: '#6a7985'
			                }
			            }
			        },
			        legend: {
			            data:xAxisData,
			            right:0,
			        },
			        grid: {
			            left: '3%',
			            right: '6%',
			            bottom: '3%',
			            containLabel: true
			        },
			        xAxis : [
			            {
			                type : 'category',
			                boundaryGap : false,
			                data : ranges.map(function(item){return item.join("-");}),
			            }
			        ],
			        yAxis : [
			            {
			                type : 'value'
			            }
			        ],
			        series : ranges_classData,
			    };
			    score_section.setOption(score_option);
			}
		}
	}

	//初始化柱状图
	util.init_chart();
	util.init_compare_chart();
	//获取所有考试试卷包
	api.getUpload({
		data:{
			uuid:uuid,
			schoolid:schoolid,
			begintime:"current",
		},
		success: function(res) {
			if(res.rows){
				if(res.rows.length > 0){
					var data = res.rows;
					var uploadpackages = [];
					var uploadpackageIds = {};
					var selectedUploadName = "";
					var selectedExamName = "";
					classes = res.classes;
					schools = res.schools;
					if(classes.length > 0){
						for(var i = 0; i < classes.length; i++){
							classList[classes[i].classid] = getGradeName(classes[i].levelid) + getClassNameNotGrade(classes[i].classname);
						}
					}
					if(data.length > 0){
						//过滤掉脏数据
						data = data.filter(function(item){
							if(item.join_students && parseInt(item.join_students) != 0){
								if(!uploadpackageIds[item.groupid]){
									uploadpackageIds[item.groupid] = true;
									uploadpackages.push({
										groupid: item.groupid,
										classid: item.classid,
										title: item.title,
										exam_date: item.exam_date,
										status: item.status,
									});
								}
								return item;
							}
						});
					}
					currentExam = data[0];//默认展示第一个考试报表
					currentUpload = uploadpackages[0];//默认展示第一个考试包报表
					//显示当前考试的名字和班级
					if(currentExam.title == ""){
						selectedExamName = "试卷名字正在获取中";
					}else{
						selectedExamName = currentExam.create_time.slice(0,10) + currentExam.title + classList[currentExam.classid];
					}
					$(".selectedExamName").text(selectedExamName);
					classid = currentExam.classid;
					util.getReport();//获取报表
					
					if(data.length > 1){
						var examList = [];
						for(var i = 0; i < data.length; i++){
							examList.push(data[i].create_time.slice(0,10) + data[i].title + "  " + classList[data[i].classid]);
						}
						$(".selectedExamName").addClass("right_arrow");
						if($("#toggleExam").length > 0){
							$("#toggleExam").removeSheetAction();
						}
						$.sheetAction({
							id:"toggleExam",
							title:"选择考试",
							data:examList,
							onSelect:function(ele){
								var index = $(ele).attr("index");
								currentExam = data[index];
								//状态处理
								if(currentExam.status == "end"){
									classid = data[index].classid;
									$(ele).addClass("selected").siblings().removeClass("selected");
									$(".selectedExamName").removeClass("rotate");
									$(".selectedExamName").text($(ele).text());
									util.getReport();//获取报表
									$("#toggleExam").hideSheetAction();
								}else{
									$.showTip("该报表的状态为：" + returnPapersStatus(currentExam.status) + "，请稍后再试!",function(){
										return;
									});
								}
							},
							cancel:function(){
								$(".selectedExamName").removeClass("rotate");
								$("#toggleExam").hideSheetAction();
							}
						});
					}else{
						$(".selectedExamName").removeClass("right_arrow");
					}
					//选择一个班级的考试
					$(".selectedExamName").click(function(){
						if($("#toggleExam").length > 0){
							$(this).addClass("rotate");
							$("#toggleExam").showSheetAction();
						}
					});

					//考试包数据分析
					//显示当前考试包的名字和年级
					if(currentUpload.title == ""){
						selectedUploadName = "试卷名字正在获取中";
					}else{
						selectedUploadName = currentUpload.exam_date.slice(0,10) + currentUpload.title + classList[currentUpload.classid].slice(0,2);
					}
					$(".selectedUploadName").text(selectedUploadName);
					groupid = currentUpload.groupid;
					util.getReport("upload");//获取考试包报表
					
					if(uploadpackages.length > 1){
						var uploadList = [];
						for(var i = 0; i < uploadpackages.length; i++){
							uploadList.push(uploadpackages[i].exam_date.slice(0,10) + uploadpackages[i].title + "  " + classList[uploadpackages[i].classid].slice(0,2));
						}
						$(".selectedUploadName").addClass("right_arrow");
						if($("#toggleUpload").length > 0){
							$("#toggleUpload").removeSheetAction();
						}
						$.sheetAction({
							id:"toggleUpload",
							title:"选择考试",
							data:uploadList,
							onSelect:function(ele){
								var index = $(ele).attr("index");
								currentUpload = uploadpackages[index];
								//状态处理
								if(currentUpload.status == "end"){
									groupid = uploadpackages[index].groupid;
									$(ele).addClass("selected").siblings().removeClass("selected");
									$(".selectedUploadName").removeClass("rotate");
									$(".selectedUploadName").text($(ele).text());
									util.getReport("upload");//获取考试包报表
									$("#toggleUpload").hideSheetAction();
								}else{
									$.showTip("该报表的状态为：" + returnPapersStatus(currentUpload.status) + "，请稍后再试!",function(){
										return;
									});
								}
							},
							cancel:function(){
								$(".selectedUploadName").removeClass("rotate");
								$("#toggleUpload").hideSheetAction();
							}
						});
					}else{
						$(".selectedUploadName").removeClass("right_arrow");
					}
					//选择一个考试包
					$(".selectedUploadName").click(function(){
						if($("#toggleUpload").length > 0){
							$(this).addClass("rotate");
							$("#toggleUpload").showSheetAction();
						}
					});
					
				}else{
					$.toast({
						type:"tip",
						text:"数据为空"
					});
				}
			}else{
				$.toast({
					type:"error",
					text:"数据异常"
				});
			}
		}
	});

	$(".examSingle").click(function(){
		$(this).addClass("selected").siblings().removeClass("selected");
		$(".examSingle_con").removeClass("hidden").siblings().addClass("hidden");
	});
	$(".examCompare").click(function(){
		$(this).addClass("selected").siblings().removeClass("selected");
		$(".examCompare_con").removeClass("hidden").siblings().addClass("hidden");
	});
})