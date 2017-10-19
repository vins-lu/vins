$(document).ready(function() {
	var args = parseQueryArgs();
	var searchkey = "";
		var examfile = parseQueryArgs().exam,
			answer = parseQueryArgs().answer;
		
		console.log(user)
		//获取班级
		var ajaxUrl = pageLoader.url + 'classes.list',
			ajaxParam = {
				uuid: args.uuid,
				schoolid:user.schools[0].schoolid,
			}
		query('post', ajaxUrl, ajaxParam, function(jsonData) {
			console.log(jsonData);
		})
		//列表考试
		var ajaxUrl = pageLoader.url + 'examine.list',
			ajaxParam = {
				uuid: args.uuid,
				listtype:"mycreated",
				method:"list",
			}
		query('post', ajaxUrl, ajaxParam, function(jsonData) {
			console.log(jsonData);
			var li = "";
			for(let i=0,len=jsonData.rows.length;i<len;i++){
				//设置时间格式
				var time = jsonData.rows[i].create_time.split(" ")[1].split(":").splice(0,2);
				time1 = time[0]>12 ? "下午"+(time[0]-12) : "上午"+time[0];
				time = time1+":"+time[1];
				li += '<li><img src="img/ico.png" class="examimg left"/><p class="examname left">高三一年级期末考试</p><p class="examclass left">高三一班</p><p class="examdate left">'+time+'</p><p class="examselect right"statu="0" fileid="'+jsonData.rows[i].examineid+'"><img src="img/true.png"/></p></li>';
			}
			$("ul").html(li)
			$(".examselect").click(function(){
				if($(this).attr("statu")==0){
					$(this).attr("statu","1").children("img").attr("src","img/true1.png");
				}else{
					$(this).attr("statu","0").children("img").attr("src","img/true.png");
				}
			})
		})
		
		$("footer>button").click(function(){
			var exam = [];
			for(let i=0,len=$(".examselect").length;i<len;i++){
				if($($(".examselect")[i]).attr("statu") == 1){
					exam.push($($(".examselect")[i]).attr("fileid"))
				}
			}
			var ajaxUrl = pageLoader.url + 'examine.uploadpapers',
				ajaxParam = {
					uuid: args.uuid,
					privatefileid: examfile,
					examineid:exam.join(","),
				}
			query('post', ajaxUrl, ajaxParam, function(jsonData) {
				if(jsonData.errcode == 1130){
					$.showTip("试卷已在使用中无法进行修改");
				}
			})
		})
})