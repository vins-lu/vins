$(function() {
	$.Confirm = function(content, opt, callback) {
		$.shade(true);
		var opts = {
			confirmcss: "confirm",
			titlecss: "title secondfont blod textcenter blackfont",
			contentcss: "content fifthfont blackfont",
			bottomcss: "bottom  thirdfont",
			okcss: "okcss textcenter",
			oktext: "确定",
			cancelcss: "cancelcss textcenter grayfont1",
			canceltext: "取消",
			title: '',
			content: '',
		};
		if(opt) {
			opts.oktext = opt.oktext;
			opts.canceltext = opt.canceltext;
		}

		if(typeof content == 'string') {
			opts.title = content;
		} else if($.isPlainObject(content)) {
			opts = $.extend(opts, content);
		}

		var confirm = $(document.createElement("div")).addClass(opts.confirmcss);
		var title = $(document.createElement("div")).addClass(opts.titlecss).html(opts.title).appendTo(confirm); //标题
		var content = $(document.createElement("div")).addClass(opts.contentcss).html(opts.content).appendTo(confirm); //内容
		var okdiv = $(document.createElement("div")).addClass(opts.okcss).html(opts.oktext);
		var canceldiv = $(document.createElement("div")).addClass(opts.cancelcss).html(opts.canceltext); //取消按钮
		var bottomdiv = $(document.createElement("div")).addClass(opts.bottomcss).append(canceldiv).append(okdiv).appendTo(confirm); //按钮区域
		var modaldiv = $(document.createElement("div")).addClass("modalConver").append(confirm).appendTo($("body")).show(0); //modaldiv
		var bd = $("body").addClass("modal-open");

		okdiv.click(function(e) {
			$.shade(false);
			modaldiv.remove();
			bd.removeClass("modal-open");
			if(typeof callback == 'function')
				callback(true);
		});

		canceldiv.click(function(e) {
			$.shade(false);
			modaldiv.remove();
			bd.removeClass("modal-open");
			if(typeof callback == 'function')
				callback(false);
		});
	}

	/*遮罩层*/
	var shade = $(document.createElement("div")).width($(window).width()).height($(window).height()).addClass("shade").appendTo($("body"));
	$.shade = function(bool) {
		if(bool) {
			shade.fadeIn();
		} else {
			shade.fadeOut();
		}
	}
	/*提示*/
	$.showTip = function(content, callback) {
		$.shade(true);
		var opts = {
			showTipcss: "showTipcss centerframe fifthfont textcenter blackfont",
		};

		if(typeof content == 'string') {
			opts.content = content;
		} else if($.isPlainObject(content)) {
			opts = $.extend(opts, content);
		}

		var showTip = $(document.createElement("div")).addClass(opts.showTipcss);
		var content = $(document.createElement("div")).addClass("content").html(opts.content).appendTo(showTip);
		var btn = $(document.createElement("div")).addClass("btn").html("确定").appendTo(showTip).click(function() {
			$($(this).parent()).remove();
			$.shade(false);
			$($(".modalConver")[0]).remove();
			if(window.btnClick) btnClick();
			if(typeof(callback) == 'function') callback();
		});
		var modaldiv = $(document.createElement("div")).addClass("modalConver").append(showTip).appendTo($("body")).show(0, function() {
			$(showTip).show();
		});
	}
	/*弹出窗口*/
	var popup = $(document.createElement("div")).addClass("pop").appendTo("body");
	$.pop = function(bool, content) {
		popup.html(content);
		if(bool) {
			$.shade(true);
			popup.css("display", "block");
		} else {
			$.shade(false);
			popup.css("display", "none");
		}
	}
	/*加载中*/
	var loading = $(document.createElement("img")).addClass("loading").attr("src", "img/loading.gif").appendTo("body");
	$.loading = function(bool) {
		if(bool) {
			$.shade(true);
			loading.fadeIn();
		} else {
			$.shade(false);
			loading.fadeOut();
		}
	}

	//链接打印机扫描上传文件
	function scanPC(type, id) {
		var uuid = window.UUID;
		if(typeof LSDN == "undefined") {
			$.Confirm("扫描仪连接错误 是否重新链接", {
				oktext: "重新连接",
				canceltext: "取消"
			}, function(bool) {
				if(bool)
					scanPC(type, id)
			});
			return;
		}
		if(type == "upload") {
			//向可参与的考试上传空白试卷
			LSDN.uploadpapers(uuid, parseInt(id), 0, "");
		} else if(type == "answer") {
			//向未提交的试卷包上传答题纸
			LSDN.uploadpapers(uuid, parseInt(id), 0, "");
		}
		top.onScannerResponse = function(status, response) {
			$.pop(true, "正在上传 请稍后！")
			if(status == "ok") {
				$.pop(false);
				$.showTip("上传成功", function() {
					resetPage();
				})
			} else if(status == "cancel") {
				$.pop(false);
				$.showTip("已取消上传", function() {
					resetPage();
				})
			} else if(status == "false") {
				$.pop(false);
				$.Confirm("上传失败 是否重新上传", null, function(bool) {
					if(bool)
						scanPC(fileid, type);
				})
			}
		}
	}

	//设置body高度
	$("body").height($(window).height());

	function parseGets(params) {
		var pos = params.indexOf('?'),
			r = {
				list: [],
				map: {}
			};
		if(pos > 0)
			params = params.substr(pos + 1).split('&');
		else
			params = params.split('&');

		for(var i = 0; i < params.length; ++i) {
			var kv = params[i].split('=');
			r.map[kv[0]] = decodeURIComponent(kv[1]);
			r.list.push(params[i]);
		}
		return r;
	}

	function connectToWebSockets() {
		if(!window.WSURL) {
			query('get', pageLoader.url + 'system.wsinfo', {}, function(response) {
				if(response && response.url) {
					window.WSURL = response.url;
					connectToWebSockets();
				}
			});

			return;
		}

		if(window.WSFAILED < 3) {
			var ws = new WebSocket(window.WSURL);
			onWebScokets(ws);

		} else if(!window.TIMED_POLL) {
			window.TIMED_POLL = window.setInterval(function() {
				query('get', [pageLoader.url, 'users.privatedata?action=readout&key=', window.GETS.map.deviceid].join(''), {}, function(response) {
					if(response && response.data) {
						if(window.TIMED_POLL) {
							window.clearInterval(window.TIMED_POLL);
							delete window.TIMED_POLL;
						}

						var func = window.ONREADOUT;
						delete window.TIMED_POLL;

						if(func)
							func(response.data);
					}
				});
			}, 1000);
		}
	}

	function onWebScokets(ws) {
		ws.onopen = function() {
			window.WSFAILED = 0;
			if(window.TIMED_POLL) {
				window.clearInterval(window.TIMED_POLL);
				delete window.TIMED_POLL;
			}

			ws.send('setuuid:' + window.GETS.map.deviceid);
		};

		ws.onmessage = function(evt) {
			var data = evt.data.indexOf(':');
			if(data < 1)
				return;

			var cmd = evt.data.substr(0, data);
			data = evt.data.substr(data + 1);

			if(cmd == 'scannerstarted') {
				var func = window.ONREADOUT;
				if(func)
					func(data);
			}
		};

		ws.onerror = function(e) {
			window.WSFAILED++;
			connectToWebSockets();
		};

		ws.onclose = function(e) {
			window.WSFAILED++;
			connectToWebSockets();
		};
	}

	// 请求接口产生公众号二维码
	function showQRCode() {
		query('get', [pageLoader.url, 'validcodes.genwxqrcode?schoolid=', window.GETS.map.schoolid, '&deviceid=', window.GETS.map.deviceid].join(''), {}, function(response) {
			if(response && response.ok) {
				// 显示出二维码供扫码
				$(document.createElement('img')).attr('src', response.url).attr('id', 'WXQRCodeImg').appendTo($(".blueDiv"));

				if(!window.QRCODE_TIMEROUT)
					connectToWebSockets();

				window.QRCODE_TIMEROUT = window.setTimeout(function() {
					// 二维码过期了，重新请求
					showQRCode();
				}, Math.max(7200, response.expire) * 1000);
			}
		});
	}

	// 重置本页
	function resetPage() {
		window.location.reload();
	}
	
	//参与考试 创建试卷包
	function createPaperBag(){
		
	}

	// 往考试里上传空白试卷
	function uploadBlankPaperToExamine(examineid) {
		scanPC("upload", examineid)
	}

	// 往未提交的试卷包里上传答卷
	function uploadPapersToPackage(uploadid) {
		scanPC("upload", uploadid)
	}

	// 读取本用户可以参与的考试以及所有未提交的试卷包
	function readExamines() {
		if(window.QRCODE_TIMEROUT) {
			window.clearTimeout(window.QRCODE_TIMEROUT);
			delete window.QRCODE_TIMEROUT;
		}

		// 删除二维码位图
		$("#content").css("display", "none");

		// 显示Loading界面
		$.loading(true);

		// 获取可以参与的考试
		query('get', [pageLoader.url, 'examine.list?listtype=joinable&orderby=createtime&method=listall&uuid=', window.UUID, '&schoolid=', window.SCHOOLID].join(''), {}, function(response) {
			if(response && response.rows) {
				var examines = response.rows;
				console.log(examines); 
				var li = '<p>考试列表</p><li><p class="lt">名称</p><p class="lt">班级</p><p class="lt">创建人</p><p class="lt">创建时间</p><p class="lt">状态</p><p class="lt">操作</p></li>';
				for(let i = 0; i < response.rows.length; i++) {
					if(examines[i].status == "waitupload") {
						li += '<li class="attendClick" examineid="' + examines[i].examineid + '" classifyid="' + examines[i].classifyid + '" status="' + examines[i].status + '"><p class="lt">' + examines[i].title + '</p><p class="lt">...</p><p class="lt">' + examines[i].realname + '</p><p class="lt">' + examines[i].create_time.split(" ")[0] + '</p><p class="lt">创建成功</p><p class="lt"><button class="attend">上传试卷</button></p></li>';
					} else {
						li += '<li class="attendClick" examineid="' + examines[i].examineid + '" classifyid="' + examines[i].classifyid + '" status="' + examines[i].status + '"><p class="lt">' + examines[i].title + '</p><p class="lt">...</p><p class="lt">' + examines[i].realname + '</p><p class="lt">' + examines[i].create_time.split(" ")[0] + '</p><p class="lt">创建成功</p><p class="lt"><button class="attend">查看</button></p></li>';
					}
				}
				// 获取未提交的试卷包
				query('get', [pageLoader.url, 'upload.listfiles?method=listall&orderby=createtime&begintime=current&locked=0&status=created&uuid=', window.UUID, '&schoolid=', window.SCHOOLID].join(''), {}, function(response) {
					if(response && response.rows) {
						$.loading(false);
						var uploads = response.rows;
						(!uploads.length && !examines.length) && ($.showTip('由于没有考试需要您上传试卷，因此您无需使用本设备', resetPage));
						/*if(uploads.length == 0) {
							// 没有未提交的试卷包时
							if(examines.length == 0) {
								$.showTip('由于没有考试需要您上传试卷，因此您无需使用本设备', resetPage);
								return;

							} else if(examines.length == 1) {
								// 只有一条考试记录可以参加，就不需要用户确认了，直接开始
								uploadBlankPaperToExamine(examines[0].examineid);
								return;
							}

						} else if(uploads.length == 1 && examines.length == 0) {
							// 有未提交的试卷包，但没有未参加的考试，也不需要用户确认，直接开始上传
							uploadPapersToPackage(uploads[0].uploadid);
							return;
						}*/
						for(let i = 0; i < response.rows.length; i++) {
							li += '<li class="uploadClick" uploadid="' + uploads[i].examineid + '"><p class="lt">' + uploads[i].title + '</p><p class="lt"></p><p class="lt">' + uploads[i].realname + '</p><p class="lt">' + uploads[i].create_time.split(" ")[0] + '</p><p class="lt"></p><p class="lt"><button class="uploading">上传试卷</button></p></li>';
						}

						// 列表分两段，分别列出可以参与的考试和未提交的试卷包供用户自己选择
						$("#list1").html(li)
						$("#select").css("display", "block");
						//展开考试参与的班级
						$("#list1 .attendClick").click(function() {
							if($(this).attr("status") == "waitupload") {
								var examineid = $(this).attr("examineid");
								var examTitie = $(this).children("p:first-child").html();
								$.Confirm('是否为"'+examTitie+'"上传空白试卷', {
									oktext: "上传试卷",
									canceltext: "取消"
								}, function(bool) {
									if(bool){
										uploadBlankPaperToExamine(examineid);
									}
								});
							} else {
								$("#list2").css("right", 0);
								$("#list2").html("");
								console.log($(this).attr("examineid"));

								var ajaxUrl = pageLoader.url + 'examine.list',
									ajaxParam = {
										schoolid: window.SCHOOLID,
										listtype: "examines",
										examineid: $(this).attr("examineid"),
										classifyid: $(this).attr("classifyid"),
										uuid: window.UUID,
										method: "listall",
									}
								query('post', ajaxUrl, ajaxParam, function(jsonData) {
									var li1 = '<p class="getback">返回列表</p><li class="attendClick"><p class="lt">名称</p><p class="lt">班级</p><p class="lt">操作</p></li>';
									console.log(jsonData);
									for(var p = 0; p < jsonData.rows.length; p++) {
										console.log(jsonData.rows[p].examineid);
										li1 += '<li class="attendClick" examineid="' + jsonData.rows[p].examineid + '"><p class="lt">' + jsonData.rows[p].title + '</p><p class="lt">' + jsonData.rows[p].classname + '</p><p class="lt"><button class="attend">参与考试</button></p></li>';
									}
									$("#list2").append(li1);
									//点击参与考试
									$("#list2 .attendClick").click(function() {
										
									});

									//点击返回列表
									$(".getback").click(function() {
										$("#list2").css("right", -$(window).width());
									})
								})
							}
						})

						//点击上传答题纸
						$(".uploadClick").click(function() {
							var uploadid = $(this).attr("uploadid");
							$.Confirm("请上传答卷", {
								oktext: "上传答卷",
								canceltext: "取消"
							}, function(bool) {
								if(bool)
									uploadPapersToPackage(uploadid);
							});
						});
					}
				});
			}
		});
	}
	
	
	// 解URL参数
	window.WSFAILED = 0;
	window.GETS = parseGets(window.location.href);
	//模拟 window.GETS.map.deviceid
	window.GETS.map.deviceid = "ffb8a314be49eddf";
	window.GETS.map.schoolid = 2;

	if(!window.GETS.map.schoolid || !window.GETS.map.deviceid /* || typeof LSDN == 'undefined'*/ ) {
		$.showTip('无效的打开方式');
		return;
	}

	window.ONREADOUT = function(data) {
		console.log(data);
		var params = parseGets(data);
		window.UUID = params.map.uuid;
		window.SCHOOLID = params.map.schoolid;
		//获取个人信息
		var ajaxUrl = pageLoader.url + 'users.getuserinfo';
		var ajaxParam = {
			uuid: window.UUID,
			who: window.UUID,
		};
		query('post', ajaxUrl, ajaxParam, function(jsonData) {
			console.log(jsonData)
			$(".schoolc").html(jsonData.userinfo.schools[0].fullname);
			if(jsonData.userinfo.identity == "manager") {
				$(".identityc").html("老师")
			}
		})

		readExamines();
	}

	// 显示出二维码
	showQRCode();

	pageLoader.autoReloadPage = true;

	//设置选择试卷页高度
	$("#select").height($(window).height());
	//设置列表容器的宽度
	$("#list1,#list2").width($(window).width());
	//设置覆盖页位置
	$("#list2").css("right", -$(window).width());
	$("#list2").css("minHeight", $(window).height() - 80);

	//点击退出
	$(".quit").click(function() {
		$.Confirm("是否确认退出", null, function(bool) {
			if(bool) {
				resetPage();
			}
		})
	})
});