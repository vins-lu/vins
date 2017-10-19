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
	                	initCharts(examHistory);
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
	    			$(".paperTitle").text(res.papertitle);
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
				var totalScore = $("<span></span>").addClass("totalScore").text("共" + subject[item].totalscore + "分");
				var scorePercent = parseInt(subject[item].getscore * 100 / subject[item].totalscore);
				var getScore = $("<span></span>").addClass("getScore").text("得分率" + scorePercent + "%");
				var showDetail = $("<div></div>").addClass("showDetail greenFont").text("查看详情>>");
				sp_sdetail.append(typeText).append(totalScore).append(getScore).append(showDetail);
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
		if(data && !$.isEmptyObject(data)){
			for( var key in data){
				var newkd = $("<li></li>").addClass("kp_list").attr("id",key);
				var kdName = $("<span></span>").addClass("kdName").text(data[key].title);
				var errorNum = $("<span></span>").addClass("errorNum").text(data[key].errornum + "/" + data[key].totalnum);
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
	function initCharts(examHistory) {
		var data = examHistory.filter(function(item){
            return item.classifyid == classifyid;
        });
        var joinStus = data.map(function(item){
        	return item.numstudents;
        });
        var numstudents = Math.max(joinStus);
        var classRankDom = $(".chart_classRank .detail");
        var scoreDom = $(".chart_score .detail");

        if(data.length <= 0){
        	classRankDom.emptyState({
        		type: "exception",
        		content: "数据错误"
        	});
        	scoreDom.emptyState({
        		type: "exception",
        		content: "数据错误"
        	});
        	return;
        }

        var chart_classRank = echarts.init(classRankDom[0]);
        //var chart_score = echarts.init(scoreDom[0]);
        var classRank_option = {
        	grid:{
        		/*left: '2%',
        		right: '2%',
        		bottom:'2%',*/
        		containLabel: true,
        	},
        	legend: {
		        data:['分数','排名']
		    },
		    tooltip: {
		        trigger: 'axis',
    	        position: function (pos, params, dom, rect, size) {
                  	// 鼠标在左侧时 tooltip 显示到右侧，鼠标在右侧时 tooltip 显示到左侧。
                  	var obj = {top: "50%"};
                  	obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 5;
                  	return obj;
              	}
		    },
		    xAxis:  {
		        type: 'category',
		        boundaryGap: false,

		        data:['第一次单元测验','第二次单元测验','第三次单元测验'],
		        /*axisLabel:{
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
		            	return item.title;
		        }),*/
		    },
		    yAxis: [{
		        type: 'value',
		        splitLine:{  
                    show:false  
                },  
		        min:0,
		        max:150,
		        axisLabel: {
		            formatter: '{value} 分'
		        }
		    },{
		    	
		        type: 'value',
		        splitLine:{  
                    show:false  
                },  
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
		    }],
		    series: [
		    	{
		    		name:'分数',
		            type:'line',
		            data:[80,75,105],
		            yAxisIndex: 0,
		            /*data:data.map(function(item){
		            	return item.report.get_scores;
		            }),*/
		            itemStyle: {
		            	normal: {
		                    color: "#E87C25",
		                    label: {
		                        show: true,
		                        position: 'top',
		                        formatter: '{c}分'
		                    }
		                }
		            },

		            /*markPoint: {
		                data: [
		                    {type: 'max', name: '最高分'},
		                    {type: 'min', name: '最低分'}
		                ]
		            },*/
		            markLine: {
		                data: [
		                    {type: 'average', name: '平均分'}
		                ]
		            }
		        },
		        {
		        	name:'排名',
		            type:'line',
		            yAxisIndex: 1,
		            itemStyle: {
		            	normal: {
		                    color: "#27727B",
		                    label: {
		                        show: true,
		                        position: 'bottom',
		                        formatter: '第{c}名'
		                    }
		                }
		            },
		            
		            /*data:data.map(function(item){
		            	return item.class_ranking;
		            }),*/
		            data:[3,5,4],
		            /*markPoint: {
		                data: [
		                    {type: 'max', name: '最高排名'},
		                    {type: 'min', name: '最低排名'}
		                ]
		            }*/
		        },

		    ]
		};
        /*var score_option = {
        	grid:{
        		left: '14%',
        		right: '10%'
        	},
		    tooltip: {
		        trigger: 'axis',
		        position: function (pos, params, dom, rect, size) {
	              	// 鼠标在左侧时 tooltip 显示到右侧，鼠标在右侧时 tooltip 显示到左侧。
	              	var obj = {top: "50%"};
	              	obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 5;
	              	return obj;
	          	}
		    },
		    xAxis:  {
		        type: 'category',
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
		            	return item.title;
		            }),
		    },
		    yAxis: {
		        type: 'value',
		        axisLabel: {
		            formatter: '{value} 分'
		        }
		    },
		    series: [
		        {
		            type:'bar',
		            data:data.map(function(item){
		            	return item.report.get_scores;
		            }),
		            markPoint: {
		                data: [
		                    {type: 'max', name: '最大值'},
		                    {type: 'min', name: '最小值'}
		                ]
		            },
		            markLine: {
		                data: [
		                    {type: 'average', name: '平均分'}
		                ]
		            }
		        }
		    ]
		};*/
		chart_classRank.setOption(classRank_option);
		//chart_score.setOption(score_option);
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