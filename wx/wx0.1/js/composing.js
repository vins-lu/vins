(function($) {
	document.documentElement.style.fontSize = document.documentElement.clientWidth / 7.5 + 'px';
	$.Confirm = function(obj) {
		// $.shade(true);
		var opts = {
			confirmcss: "confirm",
			titlecss: "title",
			contentcss: "content",
			bottomcss: "bottom",
			okcss: "okcss",
			oktext: "确定",
			showcancel: true,
			cancelcss: "cancelcss",
			canceltext: "取消",
			title: '',
			content: '',
			success:null,
			cancel:null,
		};

		if($.isPlainObject(obj)) {
			opts = $.extend(opts, obj);
		}
		
		var confirm = $("<div></div>").addClass(opts.confirmcss);
		var mask = $("<div></div>").addClass("mask");
		var title = $("<div></div>").addClass(opts.titlecss).text(opts.title).appendTo(confirm); //标题
		var content = $("<div></div>").addClass(opts.contentcss).html(opts.content).appendTo(confirm); //内容
		var okdiv = $("<div></div>").addClass(opts.okcss).text(opts.oktext);
		var canceldiv = $("<div></div>").addClass(opts.cancelcss).text(opts.canceltext); //取消按钮
		var bottomdiv = $("<div></div>").addClass(opts.bottomcss);
		if(opts.showcancel){
			bottomdiv.append(canceldiv);
		}
		bottomdiv.append(okdiv).appendTo(confirm); //按钮区域
		var modaldiv = $("<div></div>").addClass("modalConver").append(mask).append(confirm).appendTo($("body")).show(0); //modaldiv
		var bd = $("body").addClass("modal_open");

		okdiv.click(function(e) {
			var cbStatus = false;
			if(typeof opts.success == 'function'){
				cbStatus = opts.success(confirm);//回调返回为true，不关闭弹窗
			}
			if(!cbStatus){
				modaldiv.remove();
				$.removeModal_open();
			}
		});

		canceldiv.click(function(e) {
			var cbStatus = false;
			if(typeof opts.cancel == 'function'){
				cbStatus = opts.cancel(confirm);
			}
			if(!cbStatus){
				modaldiv.remove();
				$.removeModal_open();
			}
		});
	}
	
	/*遮罩层*/
	var oDiv = null;
	$.shade = function(bool){
		if(bool){
			oDiv = $("<div></div>").addClass("mask").appendTo($("body")).show(0);
		}else{
			if(oDiv != null){
				oDiv.remove();
			}
		}
	}
	/*提示对话框*/
	$.showTip = function(content, callback) {
		// $.shade(true);
		var opts = {
			showTipcss: "showTipcss centerframe fifthfont textcenter blackfont",
		};

		if(typeof content == 'string') {
			opts.content = content;
		} else if($.isPlainObject(content)) {
			opts = $.extend(opts, content);
		}

		var showTip = $("<div></div>").addClass(opts.showTipcss);
		var mask = $("<div></div>").addClass("mask");
		var title = $("<div></div>").addClass("title").html("提示").appendTo(showTip);
		var content = $("<div></div>").addClass("content").html(opts.content).appendTo(showTip);
		var btn = $("<div></div>").addClass("btn").html("确定").appendTo(showTip).click(function() {
			// $.shade(false);
			$($(this).parent()).remove();
			$($(".modalConver")[0]).remove();
			if(window.btnClick) btnClick();
			$.removeModal_open();
			if(typeof(callback) == 'function'){
				callback();
			}
		});
		$("body").addClass("modal_open");
		var modaldiv = $("<div></div>").addClass("modalConver").append(mask).append(showTip).appendTo($("body")).show(0, function() {
			$(showTip).show();
			/*$(showTip).show(500).delay(opts.showtime).hide(500,function(){
				$($(this).parent()).remove();
				if(typeof(callback) == 'function') callback();
			});*/
		});
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
		var toastLabel = $("<div></div>").addClass("toastLabel").text(defaults.text);
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
		toastWrap.html(content);
		toast.append(transparentMask).append(toastWrap).append(toastLabel);
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
		};
		defaults = $.extend(defaults, obj);	

		var sheet = $("<div></div>").addClass("sheet hidden").attr("id",defaults.id);
		var mask = $("<div></div>").addClass("mask");
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
			$("body").append(sheet);
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
		var _this = $(this);
		$(this).removeClass("hidden");
		$("body").addClass("modal_open");
		setTimeout(function(){
			_this.find(".sheetWrap").addClass("sheetWrap_toggle");
		},0);
		return this;
	}
	//隐藏sheetAction
	$.fn.hideSheetAction = function(){
		var _this = $(this);
		_this.find(".sheetWrap").removeClass("sheetWrap_toggle");
		setTimeout(function(){
			_this.addClass("hidden");
			$.removeModal_open();
		},200);
		return this;
	}
	//删除sheetAction
	$.fn.removeSheetAction = function(){
		$(this).remove();
	}
	//移除modal_open状态
	$.removeModal_open = function(){
		var maskLen = $(".mask").length;
		var len = maskLen;
		for(var i = 0; i < maskLen; i++){
			if($($(".mask")[i]).closest(".hidden").length > 0){
				len --;
			}
		}
		if(len <= 0){
			$("body").removeClass("modal_open");
		}
	}
	//progress
	$.fn.progress = function(obj){
		var This = $(this);
		var defaults = {
			bgcolor: "#EBEBEB",//背景颜色
			color: "#09BB07",//进度条颜色
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
		});
		var progress_inner = $("<div></div>").addClass("progress_inner").css({
			"width": (defaults.value * 100 / defaults.maxvalue) + "%",
			"backgroundColor": defaults.color,
		});
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
})(jQuery);