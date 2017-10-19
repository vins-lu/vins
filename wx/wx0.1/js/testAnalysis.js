var user, schoolid;
$(document).ready(function() {
	var openid = parseQueryArgs().openid,
		uuid = parseQueryArgs().uuid,
		schoolid = parseQueryArgs().schoolid,
		uploadid = parseQueryArgs().uploadid,
		classid = parseQueryArgs().classid;
	var searchkey = "";
	$("#circlechart").css("width", $(window).width() * (60 / 100));
	$("#circlechart").css("height", $(window).width() * (60 / 100));
	$("#graph>span").width($(window).width() * (60 / 100));
	var x = $(window).width() * (60 / 100) / 2;
	$("#graph>span").css("top", x - 22);

	var barColor = ['#E84E40', '#29B6F6', '#26C6DA', '#2BAF2B', '#FFA726', '#AB47BC', '#7E57C2', '#A5A5A5', '#FFBE00', '#4472C4'];
	$("#graph>ul>li>div").each(function(i, n) {
		$(n).css("background", barColor[i])
	})

	//初始化柱状图
	var peoplecentchart = echarts.init(document.getElementById('scoreMap'));
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
	var circlechart = echarts.init(document.getElementById('circlechart'));
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

	//获取学生列表
	var studentslist = null;
	var ajaxUrl1 = pageLoader.url + 'classes.listnames';
	var ajaxParam1 = {
		uuid: uuid,
		classid: classid,
		listtype: 'listall',
	}
	query('post', ajaxUrl1, ajaxParam1, function(jsonData) {
		studentslist = jsonData.rows;
	})

	//获取数据
	var ajaxUrl = pageLoader.url + 'stat.fetchreport';
	var ajaxParam = {
		uuid: uuid,
		uploadid: uploadid,
	}
	query('post', ajaxUrl, ajaxParam, function(jsonData) {
		if(jsonData) {
			var fullscores = jsonData.report.fullscores;	//总分
			//各分数段人数
			var nummberPeople = [jsonData.report.total, jsonData.report.passed, jsonData.report.excellent, jsonData.report.frontwards, jsonData.report.backwards, jsonData.report.fullscores, jsonData.report.average];
			$(".numberPeople").each(function(i, n) {
				$(n).html(nummberPeople[i])
			})
			//创建得分率最高10题的列表
			compar($("#high"), jsonData.report.tops.get);
			//创建得分率最低10题的列表
			compar($("#lowes"), jsonData.report.tops.lose);
			//创建知识点分析列表
			//将知识点id存入数组
			var analyTo = jsonData.report.knowledges_ordered.list;
			var knowledgeids = [];
			for(var i = 0, len = analyTo.length; i < len; i++) {
				knowledgeids.push(analyTo[i].knowledgeid);
			}

			var knowledgenames = null,	//知识点名字
				knowledgenum = 0,	//知识点出现次数
				knowledgescores = 0;
			var classurl = pageLoader.url + 'system.listknowledges';
			var classParam = {
				uuid: uuid,
				knowledgeids: knowledgeids.join(","),
			};
			query('post', classurl, classParam, function(jsonData) {
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
						"rate": removeDuplicatedItem(errornum).length / jsonData.report.total	//错误率
					})
				}
				compar($("#analy"), analy);
			});

			//柱状图数据
			var colOptionsDatas = [];
			var colOptionsRange = [];
			var ranges = jsonData.report.range_reference.ranges;
			var rangesOne = jsonData.report.ranges;
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
			$("#colP").append(colP);
			$("#colP>p").css("width", $(document).width() * (94 / 100) / colOptionsRange.length);
			//饼状图数据
			var per = (nummberPeople[1] / nummberPeople[0] * 100).toFixed(1);
			$("#graph>span").html(per + "%");
			pieOptions = {
				series: [{
					data: [{
							value: jsonData.report.passed,
							name: '及格人数'
						},
						{
							value: jsonData.report.total - jsonData.report.passed,
							name: '不及格人数'
						}
					]
				}]
			};
			circlechart.setOption(pieOptions);

			//创建学生列表
			var scores_ordered = jsonData.report.scores_ordered;
			var students_map = jsonData.report.students_map;
			scoList($("#listTwo>ul")[0], scores_ordered, students_map);
		} else {
			$.showTip("请求数据错误");
		}
	})
	//创建对比列表
	function compar(obj, arr) {
		var li = "";
		for(var i = 0; i < arr.length; i++) {
			li += "<li><span class='liFirst'>" + arr[i].A + "</span><span>" + arr[i].B + "</span><span>" + arr[i].num + "</span><span>" + parseInt(arr[i].rate*100)+"%" + "</span></li>"
		}
		$(obj).append(li);
	}
	//创建学生列表li 并显示
	function scoList(obj, scores_ordered, students_map) {
		console.log(students_map);
		var studentId = "";
		var imgSrc1 = "img/top.png";
		var imgSrc2 = "img/top.png";
		for(var j = 0; j < scores_ordered.length; j++) {
			studentId = scores_ordered[j].stid;
			for(var p = 0; p < studentslist.length; p++) {
				if(studentslist[p].studentid == studentId) {
					name = studentslist[p].realname;
				}
			}
			if(students_map[studentId].ranking_inc == 0) {
				imgSrc1 = "img/bottom.png";
			} else if(students_map[studentId].ranking_inc == 1) {
				imgSrc1 = "img/top.png";
			}else{
				imgSrc1 = "";
			}
			
			imgSrc2 = "";
			var sumrank = '暂无数据'; //年级排名
			//缺少年级排名数据

			var li = "<li><p>" + scores_ordered[j].stid + "</p><p class='name'>" + name + "</p><p>" + scores_ordered[j].score + "</p><p>" + scores_ordered[j].ranking + "<img src='" + imgSrc1 + "'/></p><p>" + sumrank + "<img src='" + imgSrc2 + "'/></p></li>"
			$(obj).append(li);
		}
	}
	//点击切换选项卡
	$("nav>ul").click(function(ev) {
		var target = ev.target;
		$("#listOne,#listTwo").css("display", "none");
		$("nav>ul>li").removeClass('liActive');
		if($(target).html() == "班级成绩") {
			$($("nav>ul>li")[0]).addClass('liActive');
			$("#listOne").css("display", "block");
		} else if($(target).html() == "学生成绩") {
			$($("nav>ul>li")[1]).addClass('liActive');
			$("#listTwo").css("display", "block");
		}
	})
	//返回
	$(".break").click(function() {
		location.href = "index.html?openid=" + openid + "&uuid=" + uuid;
	})
})