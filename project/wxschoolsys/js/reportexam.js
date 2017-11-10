$(document).ready(function() {
	var args = parseQueryArgs();
	var openid = args.openid;
	var	uuid = args.uuid;
	var	classid = args.classid;
	var uploadid = args.uploadid;
	var students = [];
	var knowledgenames = [];
	if(!args.uuid && !args.openid && !args.classid){
		$.showTip({
			title: "错误",
			content: "页面数据错误，将返回上一个页面",
			success: function(){
				window.history.back();
			}
		});
		return;
	}

	var api = {
		//获取报表
		getReport: function(params) {
			var ajaxUrl = baseUrl + 'stat.fetchreport';
			query("post",ajaxUrl,params.data,params.success,params.fail);
		},
		//获取知识点
		getKnowledges: function(params) {
			var ajaxUrl = baseUrl + 'system.listknowledges';
			query("post",ajaxUrl,params.data,params.success,params.fail);
		},
		//获取学生列表
		getstudents: function(params) {
			var ajaxUrl = baseUrl + 'classes.listnames';
			query("post",ajaxUrl,params.data,params.success,params.fail);
		},
	}
	var util = {
		getstudents: function() {
			api.getstudents({
				data:{
					uuid: uuid,
					classid: classid,
				},
				success: function(res) {
					util.getReport();//获取报表
					students = res.rows;
					if(students.length <= 0){
						return;
					}
				}
			});
		},
		getReport: function (type) {
			if(!type || type == "exam"){
				api.getReport({
					data:{
						uuid: uuid,
						classid: classid,
						uploadid: uploadid,
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
						var classInfo = res.classes[0];
						var className = getGradeName(classInfo.levelid) + classInfo.classname;
						$(".className").text(className);
						util.initDom(res.report);
					}
				});
			}
		},
		initDom: function(report) {
			var reportData = analyzeReport(report);
			var subject = reportData.subject;
			var students = reportData.students;

			var bp = $(".examReportInfo");

			var ranges = report.range_reference.ranges;
			var rangesCount = report.ranges.map(function(item){return item.length;});
			var scoreDistribution = $(".scoreDistribution .detail");

			var studentRank = $(".studentRank .stuRank_con");

			var sp_con = $(".questionAnalysis .detail");

			//基本试卷信息
			bp.find(".avarageText").text(report.average);
			bp.find(".joinNumText").text(report.total);
			bp.find(".passRateText").text(parseInt(report.passed * 100 / report.total));

			//分数段
			if(ranges.length > 0 && rangesCount){
				$(".scoreDistribution").removeClass("hidden");
				for(var i = 0; i< ranges.length; i++){
					var rangeItem = $("<div></div>").attr("class","rangeItem");
					var range_con = $("<div></div>").attr("class","range_con");
					var rangeText = $("<div></div>").attr("class","rangeText");
					rangeText.text(ranges[i].join("-") + "分");
					var rangeValue = $("<div></div>").attr("class","rangeValue");
					rangeValue.text(rangesCount[i] + "人");
					range_con.append(rangeText).append(rangeValue);
					rangeItem.append(range_con);
					rangeItem.progress({
						value: parseInt(rangesCount[i] * 100 /report.total),
						height: "0.5em",//进度条的高度
						animate: true,//进度条动画
					});
					rangeItem.appendTo(scoreDistribution);
				}
			}
			//题型分析
			if(subject){
				$(".questionAnalysis").removeClass("hidden");
				for(var item in subject){
					var sp_item = $("<div></div>").addClass("sp_item");
					var sp_sdetail = $("<div></div>").addClass("sp_sdetail itemType");
					var typeText = $("<span></span>").addClass("typeText").text(getSubjectName(item));
					var ts = subject[item].reduce(function(item1,item2){return {score: parseInt(item1.score) + parseInt(item2.score)}});
					if(isNaN(ts.score)){
						ts.score = "--";
					}
					var stu_ts = subject[item].map(function(item){
						if(item.gets){
							var obj = item.gets.reduce(function(val1,vla2){
								return {
									s: val1.s + vla2.s
								};
							});
							return obj.s;
						}else{
							return 0;
						}
					});
					stu_ts = stu_ts.reduce(function(val1,vla2){return val1 + vla2;});
					var totalScore = $("<span></span>").addClass("totalScore").text("共" + ts.score + "分");
					var scorePercent = parseInt(stu_ts * 100 / (ts.score * report.total));
					var getScore = $("<span></span>").addClass("getScore").text("得分率" + scorePercent + "%");
					var showDetail = $("<div></div>").addClass("showDetail greenFont").text("查看详情>>");
					sp_sdetail.append(typeText).append(totalScore).append(getScore).append(showDetail);
					//小题详情
					var sp_detail = $("<div></div>").addClass("sp_detail");
					if(subject[item].length > 0){
						var itemDetail = subject[item];
						var labelTitle = createItemDetail();
						sp_detail.append(labelTitle);
						for(var i = 0;i < itemDetail.length; i++){
							var sp_list = createItemDetail(itemDetail[i],report.total);
							sp_detail.append(sp_list);
						}
					}
					sp_item.append(sp_sdetail).append(sp_detail);
					sp_con.append(sp_item);
				}
			}
			//学生排名
			if(students && students.length > 0){
				$(".studentRank").removeClass("hidden");
				for(var m = 0; m < students.length; m++){
					var stuRank_list = $("<li></li>").addClass("stuRank_list");
					var stu_name = $("<span></span>").addClass("text_overflow stu_name").text(students[m].studentname != "" ? students[m].studentname : "名字获取中");
					var stu_score = $("<span></span>").addClass("stu_score").text(students[m].score);
					var stu_rank = $("<span></span>").addClass("stu_rank").text(students[m].ranking);
					stuRank_list.append(stu_name).append(stu_score).append(stu_rank);
					stuRank_list.appendTo(studentRank);
				}
			}
		}
	}

	function createItemDetail(obj,total){
		//展示小题的得分情况
		var sp_title = $("<div></div>");
		var sp_no = $("<span></span>").addClass("sp_no").text("题号");
		var sp_ts = $("<span></span>").addClass("sp_ts").text("总分");
		var sp_gets = $("<span></span>").addClass("sp_gets").text("正确人数");
		var sp_loses = $("<span></span>").addClass("sp_loses").text("错误人数");
		if(typeof obj == "object"){
			sp_title.addClass("sp_list");
			var sp_no_text = obj.no != undefined ? obj.no : "--";
			sp_no.text(sp_no_text);
			var sp_ts_text = obj.score != undefined ? obj.score : "--";
			sp_ts.text(sp_ts_text);
			var sp_gets_text = obj.gets != undefined ? obj.gets.length : parseInt(total - obj.loses.length);
			sp_gets.text(sp_gets_text);
			var sp_loses_text = obj.loses != undefined ? obj.loses.length : parseInt(total - obj.gets.length);
			sp_loses.text(sp_loses_text);
		}else{
			sp_title.addClass("sp_title greenFont");
		}
		sp_title.append(sp_no).append(sp_ts).append(sp_gets).append(sp_loses);
		return sp_title;
	}
	function analyzeReport(report) {
		var subject = {};//不同类型题的得分
		var papers = report.knowledges_ordered.papers;
		var counters = report.counters;
		var stuRank = report.scores_ordered;

		//题型分析
		if(papers && papers.length > 0 && counters){
			for(var i = 0; i< papers.length; i++){
				var quests = papers[i].quests;
				if(quests && quests.length > 0){
					for(var j = 0; j < quests.length; j++){
						var type = quests[j].type;
						var gets = counters.get;
						var loses = counters.lose;
						//做对的人
						for(var a in gets){
							gets[a].map(function(item){
								if(item.no == quests[j].no){
									if(quests[j].gets){
										quests[j].gets.push(item);
									}else{
										quests[j].gets = [];
										quests[j].gets.push(item);
									}
								}
							});
						}
						//做错的人
						for(var b in loses){
							loses[b].map(function(item){
								if(item.no == quests[j].no){
									if(quests[j].loses){
										quests[j].loses.push(item);
									}else{
										quests[j].loses = [];
										quests[j].loses.push(item);
									}
								}
							});
						}
						if(subject[type]){
							subject[type].push(quests[j]);
						}else{
							subject[type] = [];
							subject[type].push(quests[j]);
						}
					}
				}
			}
		}
		//知识点分析
		kd_report(report);
		//学生排名
		if(stuRank){
			for(var m = 0; m < stuRank.length; m++){
				stuRank[m].studentname = "";
				for(var n = 0; n < students.length; n++){
					if(stuRank[m].stid == students[n].studentid){
						stuRank[m].studentname = students[n].realname;
					}
				}
			}
		}
		return {
			subject: subject,
			students: stuRank,
		};
	}
	util.getstudents();
	function kd_report(report) {
		var kp_ul = $(".knowledgeAnalysis").find(".kp_con");
		kp_ul.empty();

		//将知识点id存入数组
		var analyTo = report.knowledges_ordered.list;
		var knowledgeids = [];
		var fullscores = report.fullscores;	//总分
		if(analyTo && analyTo.length > 0){
			for(var i = 0, len = analyTo.length; i < len; i++) {
				knowledgeids.push(analyTo[i].knowledgeid);
			}

			var knowledgenames = null;	//知识点名字
			var knowledgenum = 0;	//知识点出现次数
			var knowledgescores = 0;
			var analy = [];

			api.getKnowledges({
				data:{
					uuid: uuid,
					knowledgeids: knowledgeids.join(","),
				},
				success: function(jsonData) {
					knowledgenames = jsonData;
					var knowledgename = null;
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
						scoresoc = Math.round(scoresoc / fullscores * 100) + "%";
						
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
							"kdName": knowledgename, //知识点名称
							"appearNum": time,	//出现次数占比
							"scoresoc": scoresoc,	//分数占比
							"errorNum": errornum.length	//错误人次
						});
					}

					if(analy.length > 0){
						$(".knowledgeAnalysis").removeClass("hidden");
						for( var key = 0; key < analy.length; key++){
							var newkd = $("<li></li>").addClass("kp_list").attr("id",key);
							var kdName = $("<span></span>").addClass("kdName").text(analy[key].kdName);
							var appearNum = $("<span></span>").addClass("appearNum").text(analy[key].appearNum);
							var scoresoc = $("<span></span>").addClass("scoresoc").text(analy[key].scoresoc);
							var errorNum = $("<span></span>").addClass("errorNum").text(analy[key].errorNum);
							newkd.append(kdName).append(appearNum).append(scoresoc).append(errorNum);
							kp_ul.append(newkd);
						}
					}
				}
			});
		}
	};
	$(".questionAnalysis").on("click",".showDetail",function(){
		var perentNode = $(this).closest(".sp_item");
		perentNode.find(".sp_detail").stop().slideToggle();
		perentNode.siblings(".sp_item").find(".sp_detail").stop().slideUp();
	});
	$(".backExamList").on("click",function(){
		window.history.go(-1);
	});
	$(".backSubjectList").on("click",function(){
		window.history.go(-2);
	});
	$(".backIndex").on("click",function(){
		window.history.go(-3);
	});
})