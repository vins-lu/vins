$(document).ready(function() {

	var args = parseQueryArgs();
	var openid = args.openid;
	var uuid = args.uuid;
	var	schoolid = args.schoolid;
	var classifyid = args.classifyid;
	var examineid = args.examineid;

	var project = [];

	if(!uuid || uuid == "" || !examineid || examineid == ""){
		$.showTip({
			content: "页面数据错误,即将返回上一个页面",
			success: function(){
				window.history.back();
			}
		});
		return;
	}


	var api = {
		//获取科目
		getProject: function(params) {
			var ajaxUrl = baseUrl + 'system.listclassifies';
			query({type:"post",loading:true},ajaxUrl,params.data,params.success,params.fail);
		},
		//获取报表
		getReport: function(params) {
			var ajaxUrl = baseUrl + 'stat.fetchreport';
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
					util.getReport();
				}
			});
		},
		getReport: function(classid) {
			api.getReport({
				data: {
					uuid: uuid,
					examineid: examineid,
					childforexamine: 1
				},
				success: function(res) {
					console.log(res);
					if(res.report){
						var report = res.report;
						var classInfo = res.classes[0];

						$(".projectText").text(util.getProjectName(res.classifyid));
						$(".gradeName").text(getGradeName(classInfo.levelid));
						$("#papertitle").text(report.title);
							/*获取模板*/
						var item = $($($("#itemtemplate").children()[0]).clone());
						var label_text = getGradeName(classInfo.levelid) + classInfo.classname + "（及格率" + Math.round(report.passed * 100 / report.total) + "%）"
						item.find(".label_text").text(label_text);
						item.find(".studentnum").text(report.total);//参考人数
						item.find(".unpassnum").text(report.total - report.passed);//不及格人数
						item.find(".average").text(report.average);//平均分
						item.find(".topfont").text(report.scores_ordered[0].score);//最高分
						item.find(".lowfont").text(report.scores_ordered[report.scores_ordered.length - 1].score);//最低分
						item.find(".topname").text(report.scores_ordered[0].name);//最高分人名
						item.find(".lowname").text(report.scores_ordered[report.scores_ordered.length - 1].name);//最低分人名
						// charts.push(item.find(".grap")[0]);

						$("#classlist").append(item);
						util.initChart(item.find(".grap")[0],report);
					}else if(res.reports){
						for(var i = 0; i < res.reports.length; i++){
							var report = res.reports[i];
							var classInfo = res.classes[i];

							$(".projectText").text(util.getProjectName(res.classifyid));
							$(".gradeName").text(getGradeName(classInfo.levelid));
							$("#papertitle").text(report.title);
								/*获取模板*/
							var item = $($($("#itemtemplate").children()[0]).clone());
							var label_text = getGradeName(classInfo.levelid) + classInfo.classname + "（及格率" + Math.round(report.passed * 100 / report.total) + "%）"
							item.find(".label_text").text(label_text);
							item.find(".studentnum").text(report.total);//参考人数
							item.find(".unpassnum").text(report.total - report.passed);//不及格人数
							item.find(".average").text(report.average);//平均分
							item.find(".topfont").text(report.scores_ordered[0].score);//最高分
							item.find(".lowfont").text(report.scores_ordered[report.scores_ordered.length - 1].score);//最低分
							item.find(".topname").text(report.scores_ordered[0].name);//最高分人名
							item.find(".lowname").text(report.scores_ordered[report.scores_ordered.length - 1].name);//最低分人名
							// charts.push(item.find(".grap")[0]);

							$("#classlist").append(item);
							util.initChart(item.find(".grap")[0],report);
						}
					}
				}
			});
		},
		initChart: function(dom,report){
			var myChart = echarts.init(dom);
			//图
			var option = {
			    tooltip: {
			        trigger: 'item',
			        formatter: '分数段{b}: {c}人'
			    },
			    calculable: true,
			    grid: {
			        borderWidth: 0,
			        left:20,
			        top:20,
			        right:20,
			        bottom:20,
			    },
			    xAxis: [
			        {
			            type: 'category',
			            data: report.range_reference.ranges.map(function(item){
			            	return item.join("-");
			            }),
			            axisTick: {
			                alignWithLabel: true,
			                interval: 0
			            },
			            axisLabel: {
	                        show: true,
	                        interval: 0,
	                        textStyle: {
	                            fontSize: 12,
	                            color:'#666666',
	                        }
	                    }

			        }
			    ],
			    yAxis: [
			        {
			            type: 'value',
			            show: false
			        }
			    ],
			    series: [
			        {
			            type: 'bar',
			            itemStyle: {
			                normal: {
			                    color: function(params) {
			                        // build a color map as your need.
			                        var colorList = [
			                        	"#01bf86","#fd5668","#41adf5","#faaa63","#4fd2c4","#bf89e7","#68c538","#5a68ed"
			                        ];
			                        return colorList[params.dataIndex]
			                    },
			                    label: {
			                        show: true,
			                        position: 'top',
			                        formatter: '{c}人'
			                    }
			                }
			            },
			            data: report.ranges.map(function(item){
			            	return item.length;
			            }),
			        }
			    ]
			};
			// 使用刚指定的配置项和数据显示图表
	        myChart.setOption(option);	
		}
	}
	util.initProject(); 
});