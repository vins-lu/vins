$(document).ready(function() {
	var args = parseQueryArgs();
	var openid = args.openid;
	var	schoolid = args.schoolid;
	var classifyid = args.classifyid;
	var classid = "";
	var students = {};
	var examHistory = null;
	var paperFiles = [];
	var stid = "";
	var stName = "";
	if(!args.uploadid && !args.examineid){
		$.showTip({
			content: "页面数据错误,即将返回上一个页面",
			success: function(){
				window.history.back();
			}
		});
		return;
	}

	var stu_report , class_report;
	var api = {
		//获取报表
		getReport: function(params) {
			var ajaxUrl = baseUrl + 'stat.studentreport';
			query("post",ajaxUrl,params.data,params.success,params.fail);
		},
		//获取班级报表
		getClassReport: function(params) {
			var ajaxUrl = baseUrl + 'stat.fetchreport';
			query("post",ajaxUrl,params.data,params.success,params.fail);
		},
		//获取学生列表
		getstudents: function(params) {
			var ajaxUrl = baseUrl + 'classes.listnames';
			query("post",ajaxUrl,params.data,params.success,params.fail);
		},
		//获取学生的历次考试成绩
        getStudentHistory: function(params) {
            var ajaxUrl = baseUrl + 'stat.studenthistory';
            query({type:"post",loading:false},ajaxUrl,params.data,params.success,params.fail,params.complate);
        },
	}

	var util = {
		getstudents: function() {
			api.getstudents({
				data:{
					uuid: openid,
					classid: classid,
				},
				success: function(res) {
					var data = res.rows;
					if(data.length > 0){
						for(var i = 0; i < data.length; i++){
							students[data[i].studentid] = data[i];
							if(data[i].realname == stName){
								stid = data[i].studentid;
							}
						}

						util.getClassReport();//获取报表
					}
				}
			});
		},
	    getStudentHistory: function() {
	        api.getStudentHistory({
	            data:{
	                openid: openid,
	            },
	            success: function(res) {
	                examHistory = res.history;
	                if(examHistory && examHistory.length > 0){
	                	initHistoryCharts(examHistory);
	                }
	            }
	        });
	    },
	    getReport: function() {
	    	api.getReport({
	    		data:{
	    			openid: openid,
	    			// studentid: args.studentid,
	    			uploadid: args.uploadid,
	    			examineid: args.examineid,
	    		},
	    		success: function(res) {
	    			stName = res.realname;
	    			classid = res.classid;
	    			stu_report = res.report;
	    			$(".paperTitle").text(stu_report.title);
	    			$(".stuName").text(res.realname);
	    			$(".stuClass").text(res.classname);
	    			$(".classRankText").text(res.class_ranking);
	    			$(".gradeRankText").text(res.grade_ranking);
	    			initDom(stu_report);
	    			if(stu_report && stu_report.paper_files){
	    				paperFiles = stu_report.paper_files;
	    			}
	    			util.getstudents();
	    		}
	    	});
	    },
	    getClassReport: function (type) {
			api.getClassReport({
				data:{
					openid: openid,
					examineid: args.examineid,
				},
				success: function(res) {
					if((res.reports && res.reports.length <= 0) || (res.report && res.report.length <= 0)){
						$.showTip({
							content: "报表不存在!"
						});
						$(".reportPanel").emptyState({
							type: "nolist",
							content: "报表不存在",
							replace: true,
						});
						return;
					}
					class_report = res.report;
					var ranges = class_report.range_reference.ranges;
					var rangesCount = class_report.ranges.map(function(item){return item.length;});
					var scoreDistribution = $(".scoreDistribution .detail");

					$(".classDetail .joinNumText").text(class_report.total);
					$(".classDetail .avgScoreText").text(class_report.average);
					initBaseCharts(class_report);
					//分数段
					if(ranges.length > 0 && rangesCount){
						$(".scoreDistribution").removeClass("hidden");
						for(var i = 0; i< ranges.length; i++){
							var rangeItem = $("<div></div>").attr("class","rangeItem");
							var range_con = $("<div></div>").attr("class","range_con");
							var rangeText = $("<div></div>").attr("class","rangeText");
							rangeText.text(ranges[i].join("-") + "分");
							var myScore = $(".examReportInfo").find(".scoreText").text();
							myScore = parseInt(myScore);
							if(myScore >= ranges[i][0] && myScore <= ranges[i][1]){
								$("<div></div>").addClass("myScorePos").text("您在这个区间").appendTo(rangeItem);
								rangeItem.css("marginBottom","0.5rem");
							}
							var rangeValue = $("<div></div>").attr("class","rangeValue");
							rangeValue.text(rangesCount[i] + "人");
							range_con.append(rangeText).append(rangeValue);
							rangeItem.append(range_con);
							rangeItem.progress({
								value: parseInt(rangesCount[i] * 100 /class_report.total),
								height: "0.5em",//进度条的高度
								animate: true,//进度条动画
							});
							rangeItem.appendTo(scoreDistribution);
						}
					}
					//分数最高（最低）的三个
					var stu_ordered = class_report.scores_ordered;
					if(stu_ordered && stu_ordered.length > 0){
						$(".stuTop").removeClass("hidden");
						var stu_best = $(".stuTop .bestStu");
						var stu_lowest = $(".stuTop .lowestStu");
						
						
						stu_ordered.slice(0,3).map(function(item){
							var stuList = $("<div></div>").addClass("stuList");
							var stuName = $("<span></span>").addClass("stuName");
							var stuScore = $("<span></span>").addClass("stuScore");
							stuName.text(students[item.stid].realname);
							stuScore.text(item.score + "分");
							stuList.append(stuName).append(stuScore).appendTo(stu_best);
						});
						stu_ordered.slice(-4,-1).map(function(item){
							var stuList = $("<div></div>").addClass("stuList");
							var stuName = $("<span></span>").addClass("stuName");
							var stuScore = $("<span></span>").addClass("stuScore");
							stuName.text(students[item.stid].realname);
							stuScore.text(item.score + "分");
							stuList.append(stuName).append(stuScore).appendTo(stu_lowest);
						});
					}
					//错题分析
					errorAnalyze();
				}
			});
		},
	}

	util.getReport();
	util.getStudentHistory();

	function errorAnalyze(){
		var stu_data = analyzeReport(stu_report);
		var subject = stu_data.subject;
		var kd_data = stu_data.data;
		//错题把握
		var stu_losts = [];
		if(class_report.counters && class_report.counters.lose){
			var losts = class_report.counters.lose;
			for(var loseItem in losts){
				var loseItems = losts[loseItem];
				for(var st = 0; st < loseItems.length; st++){
					if(loseItems[st].stid == stid){
						loseItems[st]["errorstu_num"] = loseItems.length;
						stu_losts.push(loseItems[st]);
						break;
					}
				}
			}
		}

		var errornums = [];
		if(subject && !$.isEmptyObject(subject)){
			for(var item in subject){
				if(subject[item].detail){
					var itemDetail = subject[item].detail;
					var errornum = itemDetail.filter(function(item){
						return item.s < item.st;
					});
					errornum["type"] = item;
					errornums = errornums.concat(errornum);
				}
			}
		}
		stu_losts.map(function(item1){
			var errItem = errornums.filter(function(item2){
				return item1.no == item2.no;
			});
			item1["score"] = errItem[0];
			return item1;
		});
		stu_losts.sort(function(val1,val2){
			return val1.errorstu_num < val2.errorstu_num;
		})
		
		//错题分析
		var ai_analyse = $(".ai_analyse .detail");
		if(stu_losts && stu_losts.length > 0){
			var item_deserve = ai_analyse.find(".item_deserve");
			item_deserve.find(".big_ques").text(stu_losts[0].A);
			item_deserve.find(".small_ques").text(stu_losts[0].B);
			item_deserve.find(".persent").text(Math.round(stu_losts[0].errorstu_num * 100 / class_report.total) + "%");
			item_deserve.find(".extra_score").text(stu_losts[0].score.st);

			var max_losekd = 0;
			var max_losekdindex;
			for(var kd_index in kd_data){
				var lose_score = kd_data[kd_index].totalscore - kd_data[kd_index].getscore
				if(max_losekd < lose_score){
					max_losekd = lose_score;
					max_losekdindex = kd_index;
				}
			}
			var max_lose = kd_data[max_losekdindex];
			var kd_deserve = ai_analyse.find(".kd_deserve");
			kd_deserve.find(".item_detail").text(max_lose.title);
			kd_deserve.find(".rate").text(90 + "%");
			kd_deserve.find(".extra_score").text(max_losekd);
		}else if(stu_losts.length == 0){
			ai_analyse.text("满分耶，哎呦，不错呦！");
		}
	}
	
	function analyzeReport(report) {
		var data = {};//知识点的得分
		var subject = {};//不同类型题的得分
		var knowledges = report.knowledges;
		var majors = report.majors;
		if(knowledges && knowledges.length > 0){
			for(var i = 0; i < knowledges.length; i++){
				data[knowledges[i].id] = {
					kid: knowledges[i].id,
					title: knowledges[i].title,
					errornum: 0,
					totalnum: 0,
					getscore: 0,
					totalscore: 0,
					errorno: [],
				};
			}
		}
		if(majors && majors.length > 0){
			for(var j = 0; j < majors.length; j++){
				var detail = majors[j].detail;
				subject[j] = {
					type:majors[j].type,
					getscore: 0,
					totalscore: 0,
					detail:detail,
				};
				for(var m = 0; m < detail.length; m++){
					var littleSubject = detail[m];
					if(littleSubject.k){
						for(var n = 0; n < littleSubject.k.length; n++){
							var knowledgeid = littleSubject.k[n];
							if(data[knowledgeid]){
								data[knowledgeid].totalnum ++;
								data[knowledgeid].getscore += littleSubject.s;
								data[knowledgeid].totalscore += littleSubject.st;
								if(littleSubject.s < littleSubject.st){
									data[knowledgeid].errornum ++;
									data[knowledgeid].errorno.push(littleSubject.no);//错误题号
								}
							}
						}
					}

					//不同类型题目的得分情况
					subject[j].getscore += littleSubject.s;
					subject[j].totalscore += littleSubject.st;
				}
			}
		}
		return {
			data:data,
			subject:subject
		};
	}

	function initDom(report) {
		var reportData = analyzeReport(report);
		var subject = reportData.subject;
		var bp = $(".examInfo");
		bp.find(".scoreText").text(report.get_scores);
		$(".totalScoreText").text(report.total_scores);
		if(report.get_scores == report.total_scores){
			bp.find(".scoreText").parent().addClass("fullScore");
			bp.find(".score .mark").addClass("fullScore_bg").text("满分");
		}else if(parseInt(report.get_scores) > parseInt(report.total_scores) * 0.9){
			bp.find(".scoreText").parent().addClass("betterScore");
			bp.find(".score .mark").addClass("betterScore_bg").text("优秀");
		}else if(parseInt(report.get_scores) < parseInt(report.total_scores) * 0.6){
			bp.find(".scoreText").parent().addClass("badScore");
			bp.find(".score .mark").addClass("badScore_bg").text("不及格");
		}
		if(subject && !$.isEmptyObject(subject)){
			var errornums = [];
			for(var item in subject){
				if(subject[item].detail){
					var itemDetail = subject[item].detail;
					var errornum = itemDetail.filter(function(item){
						return item.s < item.st;
					});
					errornums = errornums.concat(errornum);
				}
			}
			$(".errorNumText").text(errornums.length);
		}else{
			$(".questionAnalysis").addClass("hidden");
		}
	}

	//初始化图表
	function initBaseCharts(report) {
		var passed = report.passed;
		var fullscores = report.fullscores;
		var scores_ordered = report.scores_ordered;
		var excellent = scores_ordered.filter(function(item){
			return item.score >= (fullscores * 0.9);
		});

		var passedDom = $(".scoreDistribution .chart_passed");
		var excellentDom = $(".scoreDistribution .chart_excellent");

        var chart_passed = echarts.init(passedDom[0]);
        var chart_excellent = echarts.init(excellentDom[0]);

        var dataStyle = {
            normal: {
                label: {show:false},
                labelLine: {show:false},
            	shadowColor: 'rgba(255, 255, 255, 0.9)',
				shadowBlur: 50,
            }
        };
        var placeHolderStyle = {
            normal : {
                color: 'rgba(0,0,0,0)',
                label: {show:false},
                labelLine: {show:false}
            },
            emphasis : {
                color: 'rgba(0,0,0,0)'
            }
        };
        var passed_option = {
        	color:["#fff"],
            title: {
                text: '及格率',
                subtext: Math.round(passed * 100 / report.total) + "%",
                x: 'center',
                y: '36%',
                itemGap: 5,
                textStyle : {
                    color : 'rgba(255,255,255,1)',
                    fontFamily : '微软雅黑',
                    fontSize : 16,
                    fontWeight : 'bolder'
                },
                subtextStyle : {
                    color : 'rgba(255,255,255,1)',
                    fontFamily : '微软雅黑',
                    fontSize : 12,
                }
            },
            series : [
                {
                    type:'pie',
                    clockWise:false,
                    radius: ['70%', '80%'],
                    startAngle: 240,
                    itemStyle : dataStyle,
                    data:[
                        {
                            value: passed,
                            name:'及格率'
                        },
                        {
                            value: report.total - passed,
                            name:'invisible',
                            itemStyle : placeHolderStyle
                        }
                    ]
                },
                
            ]
        };
                            
        var excellent_option = {
        	color:["#fff"],
            title: {
                text: '优秀率',
                subtext: Math.round(excellent.length * 100 / report.total) + "%",
                x: 'center',
                y: '36%',
                itemGap: 5,
                textStyle : {
                    color : 'rgba(255,255,255,1)',
                    fontFamily : '微软雅黑',
                    fontSize : 16,
                    fontWeight : 'bolder'
                },
                subtextStyle : {
                    color : 'rgba(255,255,255,1)',
                    fontFamily : '微软雅黑',
                    fontSize : 12,
                }
            },
            series : [
                {
                    type:'pie',
                    clockWise:false,
                    radius: ['70%', '80%'],
                    startAngle: 240,
                    itemStyle : dataStyle,
                    data:[
                        {
                            value:excellent.length,
                            name:'优秀率'
                        },
                        {
                            value: report.total - excellent.length,
                            name:'invisible',
                            itemStyle : placeHolderStyle
                        }
                    ]
                },
                
            ]
        };

        chart_passed.setOption(passed_option);
        chart_excellent.setOption(excellent_option);
	}

	//初始化图表
	function initHistoryCharts(examHistory) {
		var data = examHistory.filter(function(item){
            return item.classifyid == classifyid;
        });
        var joinStus = data.map(function(item){
        	return item.numstudents;
        });
        var examScores = data.map(function(item){
        	return item.report.total_scores;
        });
        var numstudents = Math.max.apply(null,joinStus);
        var maxScore = Math.max.apply(null,examScores);
        var exanHistoryDom = $(".chart_history .detail");

        if(data.length > 0){
        	$(".chart_history").removeClass("hidden");
	        var chart_history = echarts.init(exanHistoryDom[0]);
			var option = {
				grid:{
	        		left: '14%',
	        		right: '14%',

	        	},
	        	color: ["#faaa62","#1ab388"],
			    tooltip: {
			        trigger: 'item',
			        position: function (pos, params, dom, rect, size) {
		              	// 鼠标在左侧时 tooltip 显示到右侧，鼠标在右侧时 tooltip 显示到左侧。
		              	var obj = {top: "50%"};
		              	obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 5;
		              	return obj;
		          	},
		          	formatter: function(params) {
		          		if(params.seriesIndex == 0){
		          			return params.seriesName + "<br/>" + params.name + ": " + params.value + "分";
		          		}else if(params.seriesIndex == 1){
		          			return params.seriesName + "<br/>" + params.name + ": 第" + params.value + "名";
		          		}else{
		          			return params.seriesName + "<br/>" + params.name + params.value;
		          		}
		          	}
			    },
			    calculable : true,
			    legend: {
			        data:['分数','排名']
			    },
			    xAxis : {
			        type: 'category',
			        interval: 0,
			        boundaryGap: true,
	                axisLabel:{
	                	formatter:function(val){
	                		if(val.length > 0){
	        	        		var arr = val.split("");
	        	        		var splitLength = parseInt(arr.length / parseInt(data.length));
	        	        		for(var i = splitLength; i < arr.length; i = i + splitLength + 1){
	        	        			arr.splice(i+1,0,"\n");
	        	        		}
	        				    return arr.join("");
	        				}else{
	        					return val;
	        				}
	        			}
	                },
			        data: data.map(function(item){
		            	return item.title.slice(-10);
		            }),
			    },
			    yAxis : [
			    	{
				        type: 'value',
				        min: 0,
				        max: maxScore,
				        splitLine:{  
                            show:false  
                        },  
				        axisLabel: {
				            formatter: function(value){
	    		            	if(parseInt(value) == value){
	    		            		return value + "分";
	    		            	}else{
	    		            		return "";
	    		            	}
	    		            }
				        }
				    },
			        {
	    		        type: 'value',
	    		        min: 1,
	    		        max: numstudents,
	    		        inverse: true,
	    		        splitLine:{  
                            show:false  
                        },  
	    		        axisLabel: {
	    		            formatter: function(value){
	    		            	if(parseInt(value) == value){
	    		            		return value + "名";
	    		            	}else{
	    		            		return "";
	    		            	}
	    		            }
	    		        }
	    		    },
			    ],
			    series : [
			    	{
			    		name: "分数",
			            type:'line',
			            data:data.map(function(item){
			            	return item.report.get_scores;
			            }),
			            markPoint: {
			            	label: {
			            		normal: {
			            			show: true,
			            			formatter: "{c}分"
			            		}
			            	},
			                data: [
			                    {type: 'max', name: '历次考试最高分'},
			                    {type: 'min', name: '历次考试最低分'}
			                ]
			            },
			            smooth:false,
			            itemStyle:{
			                normal:{
			                    lineStyle:{
			                        width:1,
			                        type:'dotted'  //'dotted'虚线 'solid'实线
			                    }
			                }
			            },      
			            // markLine: {
			            //     data: [
			            //         {type: 'average', name: '平均分'}
			            //     ]
			            // }
			        },
			        {
			        	name: "排名",
			            type:'line',
			            yAxisIndex: 1,
			            data:data.map(function(item){
			            	return item.class_ranking;
			            }),
			            markPoint: {
			            	label: {
			            		normal: {
			            			show: true,
			            			formatter: "{c}名"
			            		}
			            	},
			                data: [
			                    {type: 'max', name: '历次考试最高排名'},
			                    {type: 'min', name: '历次考试最低排名'}
			                ]
			            },
			            smooth:false,
			            itemStyle:{
			                normal:{
			                    lineStyle:{
			                        width:1,
			                        type:'dotted'  //'dotted'虚线 'solid'实线
			                    }
			                }
			            },            
			        }
			    ]
			};
	                    
			chart_history.setOption(option);

        }else{
        	$(".chart_history").addClass("hidden");
        }
	}

	//预览试卷
	$(".previewPaperBtn").click(function(){
		if(paperFiles.length > 0){
			imgPreview(paperFiles[0],paperFiles);
		}else{
			$.showTip({
				content: "试卷获取失败，请稍后再试!"
			});
		}
	});
	//题型分析
	$(".sub_analyze").click(function(){
		window.location.href = "./reportsubject.html?openid=" + openid + "&schoolid=" + schoolid + "&uploadid=" + args.uploadid + "&schoolid=" + args.schoolid;
	});


	(function() {
	    function onBridgeReady() {
			window.IN_WEIXIN = true;
			wx.config({
			    debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
			    appId: window.WX_APPID,
			    timestamp: window.WX_TIMESTAMP,
			    nonceStr: window.WX_NONCESTR,
			    signature: window.WX_SIGNATURE,

			    jsApiList: ['checkJsApi',  
	                'chooseImage',  
	                'previewImage',  
	                'downloadImage',  
	                'getNetworkType',//网络状态接口  
	               ]
			});

			if (window.onWXReady) {
				window.onWXReady();
			}
		}
		if( document.addEventListener ){
			document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
		} else if (document.attachEvent){
			document.attachEvent('WeixinJSBridgeReady', onBridgeReady); 
			document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
		}
	})();

	function imgPreview(current,urls){
	    wx.previewImage({
	        current: current, // 当前显示图片的http链接
	        urls: urls // 需要预览的图片http链接列表
	    });
	}
})