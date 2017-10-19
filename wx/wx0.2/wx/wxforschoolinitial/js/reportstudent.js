$(document).ready(function() {
	var args = parseQueryArgs();
	var openid = args.openid;
	var uuid = args.uuid;
	var	schoolid = args.schoolid;
	var classifyid = args.classifyid;
	var students = null;
	var examHistory = null;
	var paperFiles = [];
	if(!args.uploadid || args.uploadid == "" || !args.examineid || args.examineid == "" || !args.studentid || args.studentid == ""){
		$.showTip({
			content: "页面数据错误,即将返回上一个页面",
			success: function(){
				window.history.back();
			}
		});
		return;
	}


	var api = {
		//获取报表
		getReport: function(params) {
			var ajaxUrl = baseUrl + 'stat.studentreport';
			query("post",ajaxUrl,params.data,params.success,params.fail);
		},
		//获取学生的历次考试成绩
        getStudentHistory: function(params) {
            var ajaxUrl = baseUrl + 'stat.studenthistory';
            query({type:"post",loading:false},ajaxUrl,params.data,params.success,params.fail,params.complate);
        },
	}
	var util = {
	    getStudentHistory: function() {
	        api.getStudentHistory({
	            data:{
	                uuid: uuid,
	    			studentid: args.studentid,
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
	    			uuid: uuid,
	    			studentid: args.studentid,
	    			uploadid: args.uploadid,
	    			examineid: args.examineid,
	    		},
	    		success: function(res) {
	    			$(".paperTitle").text(res.report.title);
	    			$(".classRankText").text(res.class_ranking);
	    			$(".gradeRankText").text(res.grade_ranking);
	    			initDom(res.report);
	    			if(res.report && res.report.paper_files){
	    				paperFiles = res.report.paper_files;
	    			}
	    		}
	    	});
	    }
	}

	util.getReport();
	util.getStudentHistory();

	function analyzeReport(report) {
		var data = {};//知识点的得分
		var subject = {};//不同类型题的得分
		var knowledges = report.knowledges;
		var majors = report.majors;
		if(knowledges && knowledges.length > 0){
			for(var i = 0; i < knowledges.length; i++){
				data[knowledges[i].id] = {
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
		console.log(report);
		if(report.get_scores == report.total_scores){
			$(".lostQuestion").addClass("hidden");
			$(".lostKnowledge").addClass("hidden");
		}else{
			initCharts(reportData);
		}
		var data = reportData.data;
		var subject = reportData.subject;
		var bp = $(".examInfo");
		var sp_con = $(".questionAnalysis .detail");
		var kp_ul = $(".knowledgeAnalysis .kp_con");
		kp_ul.empty();
		bp.find(".scoreText").text(report.get_scores);
		if(subject && !$.isEmptyObject(subject)){
			for(var item in subject){
				var sp_item = $("<div></div>").addClass("sp_item");
				var sp_sdetail = $("<div></div>").addClass("sp_sdetail itemType");
				var typeText = $("<span></span>").addClass("typeText").text(getSubjectName(subject[item].type));
				var score_info = $("<span></span>").addClass("score_info");
				var score_info_top = $("<span></span>").addClass("score_info_top");
				var totalScore = $("<span></span>").addClass("totalScore").text("共" + subject[item].totalscore + "分");
				var scorePercent = Math.round(subject[item].getscore * 100 / subject[item].totalscore);
				// var getScore = $("<span></span>").addClass("getScore").text("得分率" + scorePercent + "%");
				var getScore = $("<span></span>").addClass("getScore").text("得分率" + scorePercent + "%");
				var score_info_bottom = $("<span></span>").addClass("score_info_bottom");
				score_info_bottom.progress({
					value: scorePercent,
					height: "0.5em",
				});

				var showDetail = $("<div></div>").addClass("showDetail greenFont").text("查看详情>>");
				score_info_top.append(totalScore).append(getScore).append(showDetail);
				score_info.append(score_info_top).append(score_info_bottom);
				sp_sdetail.append(typeText).append(score_info);
				//小题详情
				var sp_detail = $("<div></div>").addClass("sp_detail");
				if(subject[item].detail){
					var itemDetail = subject[item].detail;
					var labelTitle = createItemDetail();
					sp_detail.append(labelTitle);
					for(var i = 0;i < itemDetail.length; i++){
						var sp_list = createItemDetail(itemDetail[i],data);
						sp_detail.append(sp_list);
					}
				}
				sp_item.append(sp_sdetail).append(sp_detail);
				sp_con.append(sp_item);
			}
		}else{
			$(".questionAnalysis").addClass("hidden");
		}
		//知识点
		if(data && !$.isEmptyObject(data)){
			for( var key in data){
				var newkd = $("<li></li>").addClass("kp_list").attr("id",key);
				var kdName = $("<span></span>").addClass("kdName").text(data[key].title);
				// var errorNum = $("<span></span>").addClass("errorNum").text(data[key].errornum + "/" + data[key].totalnum);
				var errorNum = $("<span></span>").addClass("errorNum");
				errorNum.progress({
					value: Math.round(data[key].errornum *100 / data[key].totalnum),
					labeltext: Math.round(data[key].errornum *100 / data[key].totalnum) + "%",
					labeltextStyle: {
						fontSize: "0.8em",
					}
				});
				var errorNos = $("<span></span>").addClass("errorNos");
				if(data[key].errorno.length > 0){
					errorNos.text(data[key].errorno.join(","));
				}else{
					errorNos.text("--");
				}
				var lost_score = parseInt(data[key].totalscore - data[key].getscore);
				var missScore = $("<span></span>").addClass("missScore").text(lost_score);
				var lost_percent = ((lost_score / parseInt(data[key].totalscore)) * 100) .toFixed(2);
				//var missPercent = $("<span></span>").addClass("missPercent").text(lost_percent + "%");
				newkd.append(kdName).append(errorNum).append(errorNos).append(missScore);
				kp_ul.append(newkd);
			}
		}else{
			$(".knowledgeAnalysis").addClass("hidden");
		}
	}

	//初始化图表
	function initCharts(reportData) {
		var knowledges = reportData.data;
		var subject = reportData.subject;
		var totalscore = 0;
		var loseQustionSet = [];
		var lostKnowledgeSet = [];
		var loseQustionTop3_score = null;
		var lostKnowledgeTop3_score = null;
		//每道题的失分
		for(var ques in subject){
			var loseSubjectType = subject[ques].detail.map(function(item){
				return {
					no: item.no,
					lose: item.st - item.s,
					type: subject[ques].type,
				}
			});
			totalscore += subject[ques].totalscore;
			loseQustionSet = loseQustionSet.concat(loseSubjectType);
		}
		loseQustionSet.sort(function(val1,val2){
			return val2.lose - val1.lose;
		});
		//每个知识点的失分
		for(var kd in knowledges){
			var loseKnowledgesType = {
				title: knowledges[kd].title,
				lose: knowledges[kd].totalscore - knowledges[kd].getscore,
			}
			lostKnowledgeSet = lostKnowledgeSet.concat(loseKnowledgesType);
		}
		lostKnowledgeSet.sort(function(val1,val2){
			return val2.lose - val1.lose;
		});
		//失分最多的前三道题的总失分
		loseQustionTop3_score = loseQustionSet.slice(0,3).reduce(function(val1,val2){
			return {
				lose: parseInt(val1.lose) + parseInt(val2.lose)
			}
		});
		//失分最多的前三个知识点的总失分
		lostKnowledgeTop3_score = lostKnowledgeSet.slice(0,3).reduce(function(val1,val2){
			return {
				lose: parseInt(val1.lose) + parseInt(val2.lose)
			}
		});

		var lostQuestionDom = $(".lostQuestion .detail");
		var lostKnowledgeDom = $(".lostKnowledge .detail");

        var chart_lostQuestion = echarts.init(lostQuestionDom[0]);
        var chart_lostKnowledge = echarts.init(lostKnowledgeDom[0]);

        var lostQuestion_option = {
            legend: {
                orient: 'vertical',
                right: '20',
                top: '20%',
                data: loseQustionSet.slice(0,4).map(function(item,index){
	            	if(index == 3){
	                	return "总分 " + totalscore + "分";
	            	}else{
	                	return "第" + item.no + "题(" + getSubjectName(item.type) + ")  -" + item.lose + "分";
	                }
	            }),
	            selectedMode:false,
            },
            series : [
                {
                    name: '失分最多的题',
                    type: 'pie',
                    radius : '80%',
                    center: ['20%', '50%'],
                    silent: true,
                    data: loseQustionSet.slice(0,4).map(function(item,index){
                    	if(index == 3){
                    		return {
	                    		value: totalscore - loseQustionTop3_score.lose, 
	                    		name: "总分 " + totalscore + "分",
	                    		tooltip : {
	                    		    formatter: "总分 : " + totalscore + "分",
	                    		},
	                    	}
                    	}else{
	                    	return {
	                    		value: item.lose, 
	                    		name: "第" + item.no + "题(" + getSubjectName(item.type) + ")  -" + item.lose + "分"
	                    	}
	                    }
                    }),
                    itemStyle: {
	            		normal:{ 
	            	        label:{ 
	            	        	show: false, 
	            	        	formatter: '{b} : {c} ({d}%)' 
	            	      	}, 
	            	      	labelLine :{show:false}  
	            		},
                        emphasis: {
                            show: false
                        }
                    }
                }
            ],
        };

        var lostKnowledge_option = {
            legend: {
                orient: 'vertical',
                right: '20',
                top: '20%',
                data: lostKnowledgeSet.slice(0,4).map(function(item,index){
	            	if(index == 3){
	                	return "总分 " + totalscore + "分";
	            	}else{
	                	return item.title.substring(0,10) + "\n" + item.title.substring(10) + " -" + item.lose + "分";
	                }
	            }),
	            selectedMode:false,
            },
            series : [
                {
                    name: '失分最多的知识点',
                    type: 'pie',
                    radius : '80%',
                    center: ['20%', '50%'],
                    data: lostKnowledgeSet.slice(0,4).map(function(item,index){
                    	if(index == 3){
                    		return {
	                    		value: totalscore - lostKnowledgeTop3_score.lose, 
	                    		name: "总分",
	                    		tooltip : {
	                    		    formatter: "总分 : " + totalscore + "分",
	                    		},
	                    	}
                    	}else{
	                    	return {
	                    		value: item.lose, 
	                    		name: item.title.substring(0,10) + "\n" + item.title.substring(10) + " -" + item.lose + "分",
	                    	}
	                    }
                    }),
                    itemStyle: {
	            		normal:{ 
	            	        label:{ 
	            	        	show: false, 
	            	        	formatter: '{b} : {c} ({d}%)' 
	            	      	}, 
	            	      	labelLine :{show:false}  
	            		},
                        emphasis: {
                            show: false
                        }
                    }
                }
            ]
        };

        chart_lostQuestion.setOption(lostQuestion_option);
        chart_lostKnowledge.setOption(lostKnowledge_option);
	}

	//初始化图表——历史考试对比
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
	        		right: '14%'
	        	},
	        	color: ["#faaa62","#1ab388"],
			    tooltip: {
			        trigger: 'item',
			        position: function (pos, params, dom, rect, size) {
		              	// 鼠标在左侧时 tooltip 显示到右侧，鼠标在右侧时 tooltip 显示到左侧。
		              	var obj = {top: "50%"};
		              	obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 5;
		              	return obj;
		          	}
			    },
			    calculable : true,
			    legend: {
			        data:['分数','排名']
			    },
			    xAxis : {
			        type: 'category',
			        interval: 0,
			        boundaryGap: false,
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
			                    {type: 'max', name: '最大值'},
			                    {type: 'min', name: '最小值'}
			                ]
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
			                    {type: 'max', name: '最大值'},
			                    {type: 'min', name: '最小值'}
			                ]
			            },
			        }
			    ]
			};
	                    
			chart_history.setOption(option);

        }else{
        	$(".chart_history").addClass("hidden");
        }
	}

	function createItemDetail(obj,k_data){
		//展示小题的得分情况
		var sp_title = $("<div></div>");
		var sp_no = $("<span></span>").addClass("sp_no").text("题号");
		var sp_ts = $("<span></span>").addClass("sp_ts").text("总分");
		var sp_score = $("<span></span>").addClass("sp_score").text("得分");
		var sp_kg = $("<span></span>").addClass("sp_kg").text("知识点");
		if(typeof obj == "object"){
			sp_title.addClass("sp_list");
			var sp_no_text = obj.no != undefined ? obj.no : "--";
			sp_no.text(sp_no_text);
			var sp_ts_text = obj.st != undefined ? obj.st : "--";
			sp_ts.text(sp_ts_text);
			var sp_score_text = obj.s != undefined ? obj.s : "--";
			sp_score.text(sp_score_text);
			if(!isNaN(sp_score_text) || !isNaN(sp_ts_text)){
				if(sp_score_text < sp_ts_text){
					if(parseInt(sp_score_text) == 0){
						sp_title.addClass("wrong");
					}else{
						sp_title.addClass("halfWrong");
					}
				}else{
					sp_title.addClass("right");
				}
			}
			var sp_kg_text = "";
			if(k_data && obj.k){
				for (var i = 0; i < obj.k.length; i++){
					var k_id = obj.k[i];
					if(k_data[k_id] && k_data[k_id].title){
						sp_kg_text += k_data[k_id].title;
					}else if(i == obj.k.length - 1){
						sp_kg_text = "--";
					}
				}
			}else{
				sp_kg_text = "--";
			}
			sp_kg.text(sp_kg_text);
		}else{
			sp_title.addClass("sp_title greenFont");
		}
		sp_title.append(sp_no).append(sp_ts).append(sp_score).append(sp_kg);
		return sp_title;
	}

	$(".questionAnalysis").on("click",".showDetail",function(){
		var perentNode = $(this).closest(".sp_item");
		perentNode.find(".sp_detail").stop().slideToggle();
		perentNode.siblings(".sp_item").find(".sp_detail").stop().slideUp();
	});
	$(".knowledgeAnalysis .kp_con").on("click",".errorNos",function(){
		var This = $(this);
		$.showTip({
			title: '错误题号',
			content: This.text(),
		});
	});
	// $(".backBtn").click(function(){
	// 	window.history.back();
	// });
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