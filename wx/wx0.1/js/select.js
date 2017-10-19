$(document).ready(function() {
	var args = parseQueryArgs();
	var searchkey = "";
	//变量
	var previewpitchon = null, //获取当前点击的图片的下标 方便在对应的缩略图中设置状态
		previewpitchon1 = null,
		activeindex = null, //对选中的图片排序  方便设置右上角的数字
		subjectlistindex = 0, //方便更改activeindex
		subjectlistindex1 = 0,
		identity = 0; //默认身份为家长或学生

	//查询用户信息当用户信息为学生或家长时跳转到subject页面
	var ajaxUrl = pageLoader.url + 'users.getuserinfo',
		ajaxParam = {
			uuid: args.uuid,
			who: args.uuid,
		}
	query('post', ajaxUrl, ajaxParam, function(jsonData) {
		console.log(jsonData.userinfo.identity);
		if(jsonData.userinfo.identity != "manager") {
			//身份为家长
			identity = 0;
		}else{
			//身份为老师或校长时
			identity = 1;
		}
	})

	//tab切换
	$(".pre").attr("type", "exam");

	function answers() {
		$(".pre").attr("type", "answer");
		$(".subject").css("display", "none");
		$(".answer").css("display", "block");
		$(".headerlist>li").removeClass("headerlistactive");
		$(".headerlist>li:last-child").addClass("headerlistactive");
	}

	function exams() {
		$(".pre").attr("type", "exam");
		$(".answer").css("display", "none");
		$(".subject").css("display", "block");
		$(".headerlist>li").removeClass("headerlistactive");
		$(".headerlist>li:first-child").addClass("headerlistactive");
	}
	$(".headerlist").click(function(e) {
		if(subjectlistindex1 != 0 || subjectlistindex != 0) {
			$(".pre").css("color", "#fff").attr("statu", "1");
		} else {
			$(".pre").css("color", "#999").attr("statu", "0");
		}
		var target = e.target;
		if($(target).html() == '试卷列表') {
			exams();
			var $images = $('.docs-pictures');
		} else if($(target).html() == '答案列表') {
			answers();
			var $images = $('.docs-pictures1');
		}
	})

	//获取文件列表
	var ajaxUrl = pageLoader.url + 'users.listprivatefiles',
		ajaxParam = {
			uuid: args.uuid,
			filetype: "papers,answers",
			method: "list",
		}
	query('post', ajaxUrl, ajaxParam, function(jsonData) {
		//将试卷数据填入页面
		var li1 = "",
			li2 = "";
		for(let i = 0, len = jsonData.rows.length; i < len; i++) {
			console.log(jsonData.rows[i].filetype);
			if(jsonData.rows[i].filetype == "papers") {
				li1 += "<li class='lt'><img src='" + jsonData.rows[i].url + "' data-original='" + jsonData.rows[i].url + "'/><p class='subjectlist' fileid=" + jsonData.rows[i].fileid + "></p></li>";
			} else {
				li2 += "<li class='lt'><img src='" + jsonData.rows[i].url + "' data-original='" + jsonData.rows[i].url + "'/><p class='subjectlist1' fileid=" + jsonData.rows[i].fileid + "></p></li>";
			}
		}
		$(".subject").html(li1);

		//点击选中
		$(".subjectlist").click(function() {
			pitchon(this,"exam");
			return false;
		})

		$(".answer").html(li2)
		$(".subjectlist1").click(function() {
			pitchon(this,"answer");
			return false;
		})

		//图片查看插件
		var $images = $('.docs-pictures');
		var $toggles = $('.docs-toggles');
		var $buttons = $('.docs-buttons');
		var handler = function(e) {
			console.log(e.type);
		};
		var options = {
			// inline: true,
			url: 'data-original',
			build: handler,
			built: handler,
			show: handler,
			shown: handler,
			hide: handler,
			hidden: handler
		};

		function toggleButtons(mode) {
			if(/modal|inline|none/.test(mode)) {
				$buttons.
				find('button[data-enable]').
				prop('disabled', true).
				filter('[data-enable*="' + mode + '"]').
				prop('disabled', false);
			}
		}

		$images.on({
			'build.viewer': handler,
			'built.viewer': handler,
			'show.viewer': handler,
			'shown.viewer': handler,
			'hide.viewer': handler,
			'hidden.viewer': handler
		}).viewer(options);

		toggleButtons(options.inline ? 'inline' : 'modal');

		$toggles.on('change', 'input', function() {
			var $input = $(this);
			var name = $input.attr('name');

			options[name] = name === 'inline' ? $input.data('value') : $input.prop('checked');
			$images.viewer('destroy').viewer(options);
			toggleButtons(name);
		});

		$buttons.on('click', 'button', function() {
			var data = $(this).data();
			var args = data.arguments || [];

			if(data.method) {
				if(data.target) {
					$images.viewer(data.method, $(data.target).val());
				} else {
					$images.viewer(data.method, args[0], args[1]);
				}

				switch(data.method) {
					case 'scaleX':
					case 'scaleY':
						args[0] = -args[0];
						break;

					case 'destroy':
						toggleButtons('none');
						break;
				}
			}
		});
	})

	//设置选中
	function pitchon(obj,type) {
		var clickthis = $(obj);
		var listindex = "";
		//设置图片activeindex
		if(clickthis.html() == "") {
			(type=="exam") && (subjectlistindex++ ,listindex=subjectlistindex);
			(type=="answer") && (subjectlistindex1++ ,listindex=subjectlistindex1);
			clickthis.html(listindex).addClass("subjectactive").parent().attr("activeindex", listindex);
		} else {
			var clickthisindex = clickthis.parent().attr("activeindex");
			clickthis.parent().attr("activeindex", "");
			(type=="exam") && (subjectlistindex--,subli=$(".subject>li"));
			(type=="answer") && (subjectlistindex1--,subli=$(".answer>li"));
			subli.each(function(i, n) {
				if($(n).attr("activeindex") > clickthisindex) {
					activeindex = ($(n).attr("activeindex")) - 1;
					$(n).attr("activeindex", activeindex).children("p").html(activeindex);
				}
			})
			clickthis.removeClass("subjectactive").html("");
		}
		//设置预览字体样式
		if(subjectlistindex != 0 || subjectlistindex1 != 0) {
			$(".pre").css("color", "#fff").attr("statu", "1");
		} else {
			$(".pre").css("color", "#999").attr("statu", "0");
		}
		//设置按钮中数字
		$(".num").html(subjectlistindex1 + subjectlistindex);
	} 
	//答案
	/*function pitchon1(obj) {
		var clickthis = $(obj);
		//设置图片activeindex
		if(clickthis.html() == "") {
			subjectlistindex1++;
			clickthis.html(subjectlistindex1).addClass("subjectactive").parent().attr("activeindex", subjectlistindex1);
		} else {
			var clickthisindex = clickthis.parent().attr("activeindex");
			console.log(clickthisindex);
			clickthis.parent().attr("activeindex", "");
			subjectlistindex1--;
			$(".answer>li").each(function(i, n) {
				if($(n).attr("activeindex") > clickthisindex) {
					activeindex = ($(n).attr("activeindex")) - 1;
					$(n).attr("activeindex", activeindex).children("p").html(activeindex);
				}
			})
			clickthis.removeClass("subjectactive").html("");
		}
		//设置预览字体样式
		if(subjectlistindex1 != 0 || subjectlistindex != 0) {
			$(".pre").css("color", "#fff").attr("statu", "1");
		} else {
			$(".pre").css("color", "#999").attr("statu", "0");
		}
		//设置按钮中数字
		$(".num").html(subjectlistindex1 + subjectlistindex);
	}*/

	//查看预览
	$(".pre").click(function() {
		if($(".pre").attr("statu")) {
			if($(".pre").html() == "预览") {
				$(".activesubject").css("display", "block");
				$(".pre").html("关闭");
				var prefile = "";
				for(let i = 0, len = $(".subjectlist1").length; i < len; i++) {
					if($($(".subjectlist1")[i]).html() != "") {
						prefile += "<li class='lt'><img src='" + $('.subjectlist1').prev('img').attr('src') + "'/></li>";
					}
				}
				for(let i = 0, len = $(".subjectlist").length; i < len; i++) {
					if($($(".subjectlist")[i]).html() != "") {
						prefile += "<li class='lt'><img src='" + $('.subjectlist').prev('img').attr('src') + "'/></li>";
					}
				}
				$(".activesubject").html(prefile);
				//插件
				var $images = $('.docs-pictures2');
				var $toggles = $('.docs-toggles');
				var $buttons = $('.docs-buttons');
				var handler = function(e) {
					console.log(e.type);
				};
				var options = {
					// inline: true,
					url: 'data-original',
					build: handler,
					built: handler,
					show: handler,
					shown: handler,
					hide: handler,
					hidden: handler
				};

				function toggleButtons(mode) {
					if(/modal|inline|none/.test(mode)) {
						$buttons.
						find('button[data-enable]').
						prop('disabled', true).
						filter('[data-enable*="' + mode + '"]').
						prop('disabled', false);
					}
				}

				$images.on({
					'build.viewer': handler,
					'built.viewer': handler,
					'show.viewer': handler,
					'shown.viewer': handler,
					'hide.viewer': handler,
					'hidden.viewer': handler
				}).viewer(options);

				toggleButtons(options.inline ? 'inline' : 'modal');

				$toggles.on('change', 'input', function() {
					var $input = $(this);
					var name = $input.attr('name');

					options[name] = name === 'inline' ? $input.data('value') : $input.prop('checked');
					$images.viewer('destroy').viewer(options);
					toggleButtons(name);
				});

				$buttons.on('click', 'button', function() {
					var data = $(this).data();
					var args = data.arguments || [];

					if(data.method) {
						if(data.target) {
							$images.viewer(data.method, $(data.target).val());
						} else {
							$images.viewer(data.method, args[0], args[1]);
						}

						switch(data.method) {
							case 'scaleX':
							case 'scaleY':
								args[0] = -args[0];
								break;

							case 'destroy':
								toggleButtons('none');
								break;
						}
					}
				});
			} else {
				$(".activesubject").css("display", "none");
				$(".pre").html("预览");
			}
		}
	})

	//提交
	function sub() {
		var examfile = [];
		for(let i = 0, len = $(".subjectlist1").length; i < len; i++) {
			if($($(".subjectlist1")[i]).html() != "") {
				//将fileid存入
				examfile.push($($(".subjectlist1")[i]).attr("fileid"));
			}
		}
		for(let i = 0, len = $(".subjectlist").length; i < len; i++) {
			if($($(".subjectlist")[i]).html() != "") {
				//将fileid存入
				examfile.push($($(".subjectlist")[i]).attr("fileid"));
			}
		}
		if(identity){
			location.href = "selecttest.html?exam=" + examfile+"&uuid="+args.uuid;
		}else{
			location.href = "subject.html?exam=" + examfile+"&uuid="+args.uuid;
		}
	}

	//点击完成
	$("footer button").click(function() {
		sub();
	})
})