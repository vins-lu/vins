(function($) {
	document.documentElement.style.fontSize = document.documentElement.clientWidth / 7.5 + 'px';
	$.smartScroll = function(container, selectorScrollable) {
		if (!selectorScrollable || container.data('isBindScroll')) {
			return;
		}
		var isSBBrowser;
		var data = {
			posY: 0,
			maxscroll: 0
		};
		container.on({
			touchstart: function (event) {
				var events = event.originalEvent.touches[0] || event.touches[0] || event;
				var elTarget = $(event.target);
				if (!elTarget.length) {
					return;	
				}
				var elScroll;
				if (elTarget.is(selectorScrollable)) {
					elScroll = elTarget;
				} else if ((elScroll = elTarget.parents(selectorScrollable)).length == 0) {
					elScroll = null;
				}
				if (!elScroll) {
					return;
				}
				data.elScroll = elScroll;
				data.posY = events.pageY;
				data.scrollY = elScroll.scrollTop();
				data.maxscroll = elScroll[0].scrollHeight - elScroll[0].clientHeight;
			},
			touchmove: function (event) {
				if (data.maxscroll <= 0 || isSBBrowser) {
					event.preventDefault();
				}
				var elScroll = data.elScroll;
				var scrollTop = elScroll.scrollTop();
				var events = event.originalEvent.touches[0] || event.touches[0] || event;
				var distanceY = events.pageY - data.posY;
				if (isSBBrowser) {
					elScroll.scrollTop(data.scrollY - distanceY);
					elScroll.trigger('scroll');
					return;
				}
				if (distanceY > 0 && scrollTop == 0) {
					event.preventDefault();
					return;
				}
				if (distanceY < 0 && (scrollTop + 1 >= data.maxscroll)) {
					event.preventDefault();
					return;
				}
			},
			touchend: function () {
				data.maxscroll = 0;
			}	
		});
		container.data('isBindScroll', true);
	};
	$.confirm = function(obj) {
		var opts = {
			id:"",//组件id
			oktext: "确定",//确定按钮文字
			showcancel: true,//是否显示取消按钮
			canceltext: "取消",//取消按钮文字
			masktype: "black",//遮罩类型：black:黑色，transparentMask:透明
			title: '',//标题名称
			content: null,//标题内容
			showbottom: true,//是否显示底部按钮
			mainbtn:true,//引导用户点击的按钮
			closeable: false,//是否可以关闭，以显示关闭按钮的方式关闭
			success:null,//确定回调
			cancel:null,//取消回调
		};

		if($.isPlainObject(obj)) {
			opts = $.extend(opts, obj);
		}
		
		var confirm = $("<div></div>").addClass("confirm").attr("id",opts.id);
		var mask = $("<div></div>");
		if(opts.masktype == "black"){
			mask.addClass("mask");
		}else if(opts.masktype == "transparent"){
			mask.addClass("transparentMask");
		}
		var confirmWrap = $("<div></div>").addClass("confirmWrap");
		var title = $("<div></div>").addClass("title").text(opts.title).appendTo(confirmWrap); //标题
		if(opts.closeable){
			var closeBtn = $("<div></div>").addClass("closeBtn");//关闭按钮
			closeBtn.click(function(){
				confirm.remove();
				$.removeNoscroll();
			});
			closeBtn.appendTo(confirmWrap);
		}
		var content = $("<div></div>").addClass("content").html(opts.content).appendTo(confirmWrap); //内容
		var bottomdiv = $("<div></div>").addClass("bottom");
		var okBtn = $("<div></div>").addClass("okBtn").text(opts.oktext);
		var cancelBtn = $("<div></div>").addClass("cancelBtn").text(opts.canceltext); //取消按钮
		if(opts.showbottom){
			if(opts.mainbtn){
				cancelBtn.addClass("mainbtn");
			}else{
				okBtn.addClass("mainbtn");
			}
			if(opts.showcancel){
				bottomdiv.append(cancelBtn);
			}
			bottomdiv.append(okBtn).appendTo(confirmWrap); //按钮区域
		}
		confirm.append(mask).append(confirmWrap);
		$("body").addClass("noscroll").append(confirm);
		$.smartScroll(confirm,".confirmWrap");
		okBtn.click(function(e) {
			var cbStatus = false;
			if(typeof opts.success == 'function'){
				cbStatus = opts.success(confirm);//回调返回为true，不关闭弹窗
			}
			if(!cbStatus){
				confirm.remove();
				$.removeNoscroll();
			}
		});

		cancelBtn.click(function(e) {
			var cbStatus = false;
			if(typeof opts.cancel == 'function'){
				cbStatus = opts.cancel(confirm);
			}
			if(!cbStatus){
				confirm.remove();
				$.removeNoscroll();
			}
		});
	}
	/*提示对话框*/
	$.showTip = function(obj) {
		var opts = {
			id:"",//组件id
			masktype:"black",//遮罩类型：black:黑色，transparentMask:透明
			title: '提示',
			content: '',
			oktext: "确定",
			success:null,
		};

		if($.isPlainObject(obj)) {
			opts = $.extend(opts, obj);
		}

		var showTip = $("<div></div>").addClass("showTip").attr("id",opts.id);
		var mask = $("<div></div>");
		if(opts.masktype == "black"){
			mask.addClass("mask");
		}else if(opts.masktype == "transparent"){
			mask.addClass("transparentMask");
		}
		var showTipWrap = $("<div></div>").addClass("showTipWrap");
		var title = $("<div></div>").addClass("title").html(opts.title).appendTo(showTipWrap);
		var content = $("<div></div>").addClass("content").html(opts.content).appendTo(showTipWrap);
		var confirmBtn = $("<div></div>").addClass("okBtn").html(opts.oktext).click(function() {
			var cbStatus = false;
			if(typeof opts.success == 'function'){
				cbStatus = opts.success(showTip);//回调返回为true，不关闭弹窗
			}
			if(!cbStatus){
				showTip.remove();
				$.removeNoscroll();
			}
		});
		confirmBtn.appendTo(showTipWrap);
		showTip.append(mask).append(showTipWrap);
		$("body").addClass("noscroll").append(showTip);
		$.smartScroll(showTip,".showTipWrap");
	}
	/*toast提示*/
	$.toast = function(obj) {
		var defaults = {
			type:"loading",//modal类型:loading(加载),success(成功),error(失败),tip(提示)
			text:"加载中...",//文本
			style:null,//样式
			cb:function(){},//回调函数,(非加载类型才可以调用)
		}
		if($.isPlainObject(obj)) {
			defaults = $.extend(defaults, obj);
		}else if(typeof obj == "string" && obj == "close"){
			$("toast").remove();
		}

		var toast = $("<div></div>").addClass("toast");
		var transparentMask = $("<div></div>").addClass("transparentMask");
		var toastWrap = $("<div></div>").addClass("toastWrap");
		var toastImg = $("<div></div>").addClass("toastImg");
		var toastLabel = $("<div></div>").addClass("toastLabel").html(defaults.text);
		var content = "";
		if(defaults.type == "loading"){
			content = '<svg viewBox="0 0 64 64"><g stroke-width="4" stroke-linecap="round"><line y1="12" y2="20" transform="translate(32,32) rotate(180)"><animate attributeName="stroke-opacity" dur="750ms" values="1;.85;.7;.65;.55;.45;.35;.25;.15;.1;0;1" repeatCount="indefinite"></animate></line><line y1="12" y2="20" transform="translate(32,32) rotate(210)"><animate attributeName="stroke-opacity" dur="750ms" values="0;1;.85;.7;.65;.55;.45;.35;.25;.15;.1;0" repeatCount="indefinite"></animate></line><line y1="12" y2="20" transform="translate(32,32) rotate(240)"><animate attributeName="stroke-opacity" dur="750ms" values=".1;0;1;.85;.7;.65;.55;.45;.35;.25;.15;.1" repeatCount="indefinite"></animate></line><line y1="12" y2="20" transform="translate(32,32) rotate(270)"><animate attributeName="stroke-opacity" dur="750ms" values=".15;.1;0;1;.85;.7;.65;.55;.45;.35;.25;.15" repeatCount="indefinite"></animate></line><line y1="12" y2="20" transform="translate(32,32) rotate(300)"><animate attributeName="stroke-opacity" dur="750ms" values=".25;.15;.1;0;1;.85;.7;.65;.55;.45;.35;.25" repeatCount="indefinite"></animate></line><line y1="12" y2="20" transform="translate(32,32) rotate(330)"><animate attributeName="stroke-opacity" dur="750ms" values=".35;.25;.15;.1;0;1;.85;.7;.65;.55;.45;.35" repeatCount="indefinite"></animate></line><line y1="12" y2="20" transform="translate(32,32) rotate(0)"><animate attributeName="stroke-opacity" dur="750ms" values=".45;.35;.25;.15;.1;0;1;.85;.7;.65;.55;.45" repeatCount="indefinite"></animate></line><line y1="12" y2="20" transform="translate(32,32) rotate(30)"><animate attributeName="stroke-opacity" dur="750ms" values=".55;.45;.35;.25;.15;.1;0;1;.85;.7;.65;.55" repeatCount="indefinite"></animate></line><line y1="12" y2="20" transform="translate(32,32) rotate(60)"><animate attributeName="stroke-opacity" dur="750ms" values=".65;.55;.45;.35;.25;.15;.1;0;1;.85;.7;.65" repeatCount="indefinite"></animate></line><line y1="12" y2="20" transform="translate(32,32) rotate(90)"><animate attributeName="stroke-opacity" dur="750ms" values=".7;.65;.55;.45;.35;.25;.15;.1;0;1;.85;.7" repeatCount="indefinite"></animate></line><line y1="12" y2="20" transform="translate(32,32) rotate(120)"><animate attributeName="stroke-opacity" dur="750ms" values=".85;.7;.65;.55;.45;.35;.25;.15;.1;0;1;.85" repeatCount="indefinite"></animate></line><line y1="12" y2="20" transform="translate(32,32) rotate(150)"><animate attributeName="stroke-opacity" dur="750ms" values="1;.85;.7;.65;.55;.45;.35;.25;.15;.1;0;1" repeatCount="indefinite"></animate></line></g></svg>'
		}else if(defaults.type == "success"){
			content = '<img src="./img/successTip.png"/>';
		}else if(defaults.type == "error"){
			content = '<img src="./img/errorTip.png"/>';
		}else if(defaults.type == "tip"){
			content = '<img src="./img/tip.png"/>';
		}
		toastImg.html(content);
		toastWrap.append(toastImg).append(toastLabel);
		toast.append(transparentMask).append(toastWrap);
		$("body").append(toast);
		if(defaults.type != "loading"){
			setTimeout(function(){
				toast.remove();
				if(defaults.cb && typeof defaults.cb == "function"){
					defaults.cb();
				}
			},1000);
		}
	}
	//空状态
	$.fn.emptyState = function(obj){
		var This = $(this);
		var defaults = {
			type:"nolist",//类型nolist,exception,developing,nointernet,nomessage,notfind,nopermission
			content:"这里没有任何数据",
			replace:false,//添加到元素里面，还是替换元素所有内容
			style:null,//空状态的样式
		};
		defaults = $.extend(defaults, obj);	
		var emptyState = $("<div></div>").addClass("emptyState");
		var img = $("<img />").attr("src","./img/" + defaults.type + ".png");
		var handle = $("<div></div>").addClass("handle").html(defaults.content);
		emptyState.append(img).append(handle);
		if(defaults.style !== null && typeof defaults.style == "object"){
			emptyState.css(defaults.style);
		}
		defaults.replace ? This.html(emptyState) : This.append(emptyState);
		return This;
	}
	//组件内加载
	$.fn.inline_loading = function(obj){
		var This = $(this);
		var defaults = {
			pos: "right",//位置left;right
			style: {},//样式
			replace: false,//是否替换组件内的内容
		};
		defaults = $.extend(defaults, obj);	
		var inline_loading = $("<div></div>").addClass("inline_loading");
		if(defaults.style !== null && typeof defaults.style == "object"){
			inline_loading.css(defaults.style);
		}
		if(defaults.replace){
			This.empty().append(inline_loading);
		}else{
			if(defaults.pos == "left"){
				This.prepend(inline_loading);
			}else if(defaults.pos == "right"){
				This.append(inline_loading);
			}
		}
		return This;
	}
	//删除组件内加载
	$.fn.close_inline_loading = function(){
		$(this).find(".inline_loading").remove();
	}
	//sheetAction
	$.sheetAction = function(obj){
		var defaults = {
			title:"",//标题
			data:[],//数据数组
			showField:"text",//如果数据是对象数据，选取一个字段作为显示文本
			selected:0,//默认选中
			onSelect: null,//选中回调函数
			cancelText:"取消",//取消文本
			cancel:null,//取消回调
			id:"",//生成的元素id
			mask:true,//mask遮罩是否可以单击
			masktype:"black",//遮罩类型：mask:黑色，transparentMask:透明
		};
		defaults = $.extend(defaults, obj);	

		var sheet = $("<div></div>").addClass("sheet hidden").attr("id",defaults.id);
		var mask = $("<div></div>");
		if(defaults.masktype == "black"){
			mask.addClass("mask");
		}else if(defaults.masktype == "transparent"){
			mask.addClass("transparentMask");
		}
		var sheetWrap = $("<div></div>").addClass("sheetWrap");
		var sheetTittle = $("<div></div>").addClass("sheetTittle");
		var sheetContent = $("<div></div>").addClass("sheetContent");
		var cancel = $("<div></div>").addClass("cancel btn");
		if(defaults.cancelText != ""){
			cancel.text(defaults.cancelText);
		}
		if(defaults.data.length > 0){
			if(defaults.title != ""){
				sheetTittle.text(defaults.title);
				sheetWrap.append(sheetTittle);
			}
			for(var i = 0; i < defaults.data.length; i++){
				var sheetAction = $("<span></span>").addClass("sheetAction").attr("index",i);
				if(i == parseInt(defaults.selected)){
					sheetAction.addClass("selected");
				}
				if(typeof defaults.data[i] == "string"){
					sheetAction.text(defaults.data[i]);
				}else if(typeof defaults.data[i] == "object"){
					if(defaults.data[i][defaults.showField]){
						sheetAction.text(defaults.data[i][defaults.showField]);
					}else{
						break;
					}
					for (var key in defaults.data[i]) {
					　　if(defaults.data[i].hasOwnProperty(key) && key != "text"){
							sheetAction.attr(defaults.data[i]);					
					　　}
					}
				}else{
					console.log("数据格式不正确！");
				}
				sheetContent.append(sheetAction);
			}

			sheetWrap.append(sheetContent).append(cancel);
			sheet.append(mask).append(sheetWrap);
			$("body").addClass("noscroll").append(sheet);
			$.smartScroll(sheet,".sheetWrap");
		}
		sheet.on("click",".sheetAction",function(e){
			var _this = this;
			if(typeof defaults.onSelect == "function"){
				defaults.onSelect(_this);
			}
		});
		cancel.on("click",function(e){
			if(typeof defaults.cancel == "function"){
				defaults.cancel();
			}else{
				$(sheet).hideSheetAction();
			}
		});
		if(defaults.mask){
			mask.click(function(){
				cancel.click();
			});
		}
		return sheet;
	}
	//显示sheetAction
	$.fn.showSheetAction = function(){
		$(this).removeClass("hidden");
		$(this).find(".sheetWrap").addClass("sheetWrap_toggle");
		$("body").addClass("noscroll");
		return this;
	}
	//隐藏sheetAction
	$.fn.hideSheetAction = function(){
		$(this).find(".sheetWrap").removeClass("sheetWrap_toggle");
		$(this).addClass("hidden");
		$.removeNoscroll();
		return this;
	}
	//删除sheetAction
	$.fn.removeSheetAction = function(){
		$(this).remove();
	}
	//关闭滚动
	$.removeNoscroll = function(){
		var maskLen = $(".mask").length;
		var len = maskLen;
		for(var i = 0; i < maskLen; i++){
			if($($(".mask")[i]).closest(".hidden").length > 0){
				len --;
			}
		}
		if(len <= 0){
			$("body").removeClass("noscroll");
		}
	}
	//select
	$.fn.selectAction = function(obj){
		var _this = $(this);
		_this.empty();
		var defaults = {
			id:"",//生成的元素id
			labelText: "",//下拉列表文字说明
			labelDefaultVal: "没有任何数据",//下拉列表默认选中文字
			data:[],//数据数组
			showField:"text",//如果数据是对象数据，选取一个字段作为显示文本
			selected:0,//默认选中
			onSelect: null,//选中回调函数
		};
		defaults = $.extend(defaults, obj);	

		var selectAction = $("<div></div>").addClass("selectAction").attr("id",defaults.id);
		var showOption = $("<div></div>").addClass("showOption right_arrow");
		var labelText = $("<span></span>").addClass("labelText").text(defaults.labelText);
		var selectedText = $("<span></span>").addClass("selectedText");
		showOption.append(labelText).append(selectedText);
		var selectWrap = $("<div></div>").addClass("selectWrap");
		var selectContent = $("<div></div>").addClass("selectContent");
		if(defaults.data.length > 0){
			for(var i = 0; i < defaults.data.length; i++){
				var select_option= $("<div></div>").addClass("select_option").attr("index",i);
				if(typeof defaults.data[i] == "string"){
					if(i == parseInt(defaults.selected)){
						select_option.addClass("selected");
						selectedText.text(defaults.data[i]);
					}
					select_option.text(defaults.data[i]);
				}else if(typeof defaults.data[i] == "object"){
					if(defaults.data[i][defaults.showField]){
						select_option.text(defaults.data[i][defaults.showField]);
						if(i == parseInt(defaults.selected)){
							select_option.addClass("selected");
							selectedText.text(defaults.data[i][defaults.showField]);
						}
					}else{
						break;
					}
					for (var key in defaults.data[i]) {
					　　if(defaults.data[i].hasOwnProperty(key) && key != "text"){
							select_option.attr(defaults.data[i]);					
					　　}
					}
				}else{
					console.log("数据格式不正确！");
				}
				selectContent.append(select_option);
			}

			selectWrap.append(selectContent);
			selectAction.append(showOption).append(selectWrap).appendTo(_this);
		}else{
			selectedText.text(defaults.labelDefaultVal);
			selectAction.append(showOption).appendTo(_this);
		}
		selectAction.on("click",".select_option",function(e){
			var _this = $(this);
			_this.addClass("selected").siblings().removeClass("selected");
			selectedText.text(_this.text());
			selectWrap.stop().slideUp();
			showOption.removeClass("rotate");
			if(typeof defaults.onSelect == "function"){
				defaults.onSelect(_this);
			}
		});
		selectAction.on("click",".showOption",function(e){
			var _this = $(this);
			if(defaults.data.length <= 0){
				$.showTip({
					content: "没有任何数据"
				});
				return;
			}
			_this.toggleClass("rotate");
			$(".selectWrap").stop().slideUp();
			selectWrap.stop().slideToggle();
		});
		return _this;
	}
	//progress
	$.fn.progress = function(obj){
		var This = $(this);
		var defaults = {
			bgcolor: "#EBEBEB",//背景颜色
			color: "",//进度条颜色
			maxvalue: 100,//最大值
			value: 50,//进度条的值
			width: "100%",//进度条的宽度
			height: "1em",//进度条的高度
			animate: false,//进度条动画
			labeltext: "",//显示文本
			labeltextStyle:{},//文本样式
			labeltextpos: "right",//显示位置：left,right
			showlabeltext: true,//是否显示labeltext
		};
		defaults = $.extend(defaults, obj);	

		var progress = $("<div></div>").addClass("progress").css({
			"backgroundColor": defaults.bgcolor,
			"width": defaults.width,
			"height": defaults.height,
			"lineHeight": defaults.height,
		});
		var progress_inner = $("<div></div>").addClass("progress_inner").css({
			"width": (defaults.value * 100 / defaults.maxvalue) + "%",
		});
		if(defaults.color != ""){
			progress_inner.css({
				"backgroundColor": defaults.color,
			});
		}
		if(defaults.animate){
			progress_inner.addClass("animated slideleft");
		}
		var labeltext = $("<div></div>").addClass("labeltext");
		if(defaults.showlabeltext){
			labeltext.text(defaults.labeltext).addClass("pos_" + defaults.labeltextpos).css(defaults.labeltextStyle);
			progress.append(labeltext);
		}
		progress.append(progress_inner).appendTo(This);
		return This;
	}
	//showMore
	$.fn.showMore = function(obj){
		var This = $(this);
		var defaults = {
			parentHeight: "",//父容器的高度
			labeltext: "展开更多",//显示文本
			labeltextStyle:{},//文本样式
		};
		defaults = $.extend(defaults, obj);	

		This.addClass("");
		if(defaults.parentHeight != ""){
			This.css("height",defaults.parentHeight);
		}

		var showMore = $("<div></div>").addClass("showMore").text(defaults.labeltext);
		if (defaults.labeltextStyle) {
			showMore.css(defaults.labeltextStyle);
		}

		showMore.appendTo(This);
		showMore.click(function(){
			This.css("height","auto");
		});
		return This;
	}
})(jQuery);