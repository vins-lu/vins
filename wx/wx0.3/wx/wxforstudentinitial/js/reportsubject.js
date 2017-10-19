$(document).ready(function() {
	var args = parseQueryArgs();
	var openid = args.openid;
	var	schoolid = args.schoolid;
	var classifyid = args.classifyid;
	var students = null;
	var examHistory = null;
	var paperFiles = [];
	if(!args.uploadid && !args.examineid){
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
		//获取知识点
		getKnowledges: function(params) {
			var ajaxUrl = baseUrl + 'system.listknowledges';
			query("post",ajaxUrl,params.data,params.success,params.fail);
		},
		//获取知识点详情
		refid: function(params) {
			var ajaxUrl = baseUrl + 'papers.refdata';
			query("post",ajaxUrl,params.data,params.success,params.fail);
		},
	}

	var util = {
	    getReport: function() {
	    	api.getReport({
	    		data:{
	    			openid: openid,
	    			// studentid: args.studentid,
	    			uploadid: args.uploadid,
	    			examineid: args.examineid,
	    		},
	    		success: function(res) {
	    			$(".paperTitle").text(res.report.title);
	    			$(".stuName").text(res.realname);
	    			$(".stuClass").text(res.classname);
	    			$(".classRankText").text(res.class_ranking);
	    			$(".gradeRankText").text(res.grade_ranking);
	    			initDom(res.report);
	    			if(res.report && res.report.paper_files){
	    				paperFiles = res.report.paper_files;
	    			}
	    			var knowledgeids = res.report.knowledges.map(function(item){
	    				return item.id;
	    			});
	    			// api.getKnowledges({
	    			// 	data:{
	    			// 		openid: openid,
	    			// 		knowledgeids: knowledgeids.join(","),
	    			// 	},
	    			// 	success: function(jsonData) {
	    			// 		var knowledges = jsonData.rows;
	    			// 	}
	    			// });
	    		}
	    	});
	    },
	    getkdDetail: function(refid) {
	    	api.refid({
	    		data: {
	    			openid: openid,
	    			refid: refid,
	    			action: 'get',
	    		},
	    		success: function(res) {
	    			console.log(res);
	    			if(res.ok && res.analysis){
	    				var analyse_sub = $(".analyse .analyse_sub");
	    				analyse_sub.removeClass("hidden");
	    				$("body").addClass("noscroll");
	    				analyse_sub.find(".sub_text").html(res.analysis);
	    			}
	    		}
	    	});
	    }
	}

	util.getReport();
	
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
		if(report.get_scores == report.total_scores){
			$(".lostQuestion").addClass("hidden");
			$(".lostKnowledge").addClass("hidden");
		}else{
			initCharts(reportData);
		}
			initsubCharts(reportData);
		var data = reportData.data;
		var subject = reportData.subject;
		var bp = $(".examInfo");
		var sp_con = $(".questionAnalysis .detail");
		var kd_con = $(".knowledgeAnalysis .detail");
		kd_con.empty();
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
			var qu_con = $(".questionAnalysis .qu_con");
			var errornums = [];
			for(var item in subject){
				//小题详情
				if(subject[item]){
					var itemDetail = subject[item].detail;
					var errornum = itemDetail.filter(function(item){
						return item.s < item.st;
					});
					errornums = errornums.concat(errornum);
					for(var i = 0;i < itemDetail.length; i++){
						var qu_list = createItemDetail(itemDetail[i],report.total);
						qu_con.append(qu_list);
					}
				}
			}
			$(".errorNumText").text(errornums.length);
		}else{
			$(".questionAnalysis").addClass("hidden");
		}
		if(data && !$.isEmptyObject(data)){
			var kd_list = $(".model").find(".kd_list");
			for( var key in data){
				var newkdlist = kd_list.clone(true);
				newkdlist.find(".kd_list").attr("id",key);
				newkdlist.find(".kd_name").text(data[key].title);
				var errornumText = "相关题号：";
				if(data[key].errorno.length > 0){
					errornumText += data[key].errorno.join("题，");
				
					newkdlist.find(".kd_num").text(errornumText + "题");
					newkdlist.find(".kd_comment .extraScore").text(data[key].totalscore - data[key].getscore);

					kd_con.append(newkdlist);
				}else{
					continue;
				}
			}
		}else{
			$(".knowledgeAnalysis").addClass("hidden");
		}
	}

	//初始化图表
	function initCharts(reportData) {
		var knowledges = reportData.data;
		var subject = reportData.subject;
		console.log(knowledges);
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
        	title: {
        		text: "失分最多的题目",
        		right: 20,
        		textStyle: {
        			color: '#333333',
        			fontSize: 12,
        		}
        	},
            // tooltip : {
            //     trigger: 'item',
            //     formatter: "{a} <br/>{b} : -{c}分  ({d}%)",
            // },
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
            tooltip : {
                trigger: 'item',
                formatter: "{a} <br/>{b} : -{c}分  ({d}%)"
            },
            legend: {
                orient: 'vertical',
                left: 'left',
                data: lostKnowledgeSet.slice(0,4).map(function(item,index){
	            	if(index == 3){
	                	return "总分";
	            	}else{
	                	return item.title.substring(0,10) + "\n" + item.title.substring(10) + " -" + item.lose + "分";;
	                }
	            }),
	            selectedMode:false,
            },
            series : [
                {
                    name: '失分最多的知识点',
                    type: 'pie',
                    radius : '55%',
                    center: ['50%', '60%'],
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
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        };

        chart_lostQuestion.setOption(lostQuestion_option);
        chart_lostKnowledge.setOption(lostKnowledge_option);
	}

	//初始化图表
	function initsubCharts(reportData) {
		var subject = reportData.subject;
		var stu_score = [];
		var total_score = [];
		var subject_type = [];
		for(var k in subject){
			subject_type.push(getSubjectName(subject[k].type));
			stu_score.push(subject[k].getscore);
			total_score.push(subject[k].totalscore);
		}
        var subjectAnalysis = $(".subjectAnalysis .detail");
        var chart_subject = echarts.init(subjectAnalysis[0]);
        var colorList = [
          '#ff7f50','#87cefa','#da70d6','#32cd32','#6495ed',
          '#ff69b4','#ba55d3','#cd5c5c','#ffa500','#40e0d0'
        ];

        var option = {
            tooltip : {
		        trigger: 'axis',
		        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
		            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
		        }
		    },
		    color: ['#faaa62','#00aa7b'],
		    legend: {
		        data:['学生得分','题型总分']
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
		            data : subject_type,
		        }
		    ],
		    yAxis : [
		        {
		            type : 'value'
		        }
		    ],
		    series : [
		        {
		            name: '学生得分',
		            label: {
		            	normal: {
		            		show: true,
		            		position: 'top',
		            		formatter: "{c}分"
		            	}
		            },
		            type: 'bar',
		            data: stu_score,
		        },
		        {
		            name: '题型总分',
		            label: {
		            	normal: {
		            		show: true,
		            		position: 'top',
		            		formatter: "{c}分"
		            	}
		            },
		            type: 'bar',
		            data: total_score,
		        },
            ]
        };

        chart_subject.setOption(option);
	}

	function createItemDetail(obj,k_data){
		//展示小题的得分情况
		var qu_list = $("<li></li>").addClass("qu_list");
		var qu_num1 = $("<span></span>").addClass("qu_num1").text("大题题号");
		var qu_num2 = $("<span></span>").addClass("qu_num2").text("小题题号");
		var qu_ts = $("<span></span>").addClass("qu_ts").text("总分");
		var qu_state = $("<span></span>").addClass("qu_state");
		var qu_detail = $("<span></span>").addClass("qu_detail");
		if(typeof obj == "object"){
			qu_list.addClass("qu_list");
			var qu_num1_text = obj.no != undefined ? obj.no : "--";
			qu_num1.text(qu_num1_text);
			var qu_num2_text = obj.no != undefined ? obj.no : "--";
			qu_num2.text(qu_num2_text);
			var qu_ts_text = obj.st != undefined ? obj.st : "--";
			qu_ts.text(qu_ts_text);
			if(obj.s != undefined){
				if(obj.s == 0){
					qu_state.addClass("wrong");
				}else if(obj.s < obj.st){
					qu_state.addClass("halfRight");
				}else if(obj.s == obj.st){
					qu_state.addClass("fullRight");
				}
			}
		}else{
			qu_list.addClass("qu_title greenFont");
		}
		// qu_detail.append("<button class='showDetailBtn'>查看</button>");
		qu_detail.append($("<button>查看</button>").addClass("showDetailBtn").attr("refid",obj.refid));
		// qu_list.append(qu_num1)
		qu_list.append(qu_num2).append(qu_ts).append(qu_state).append(qu_detail);
		return qu_list;
	}

	$(".questionAnalysis").on("click",".showDetailBtn",function(){
		var refid = $(this).attr("refid");
		util.getkdDetail(refid);
	});
	$(".knowledgeAnalysis").on("click",".showDetailBtn",function(){
		$(".analyse .analyse_kd").removeClass("hidden");
	});
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
	$.smartScroll($(".analyse"),".analyse_wrap");


	(function() {
	    function onBridgeReady() {
			window.IN_WEIXIN = true;
			wx.config({
			    debug: false,
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

	$(".analyse").on("click",".mask",function(){
		$(this).parent().addClass("hidden");
		$.removeNoscroll();
	});
	//展示全部题目信息
	$(".questionAnalysis").on("click",".showMore",function(){
		$(this).parent().find(".qu_con").addClass("showAll");
		$(this).attr("class","packup").text("收起");
	});
	//收起全部题目信息
	$(".questionAnalysis").on("click",".packup",function(){
		$(this).parent().find(".qu_con").removeClass("showAll");
		$(this).attr("class","showMore").text("展开全部");
	});
})