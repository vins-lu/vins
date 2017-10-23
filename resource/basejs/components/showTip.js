/*
	"name": "showTip",
	"version": "1.0.0",
	"description": "基于jquery版本的提示框，用于用户交互，提示用户一些信息,样式参见component.css的showTip部分",
	"author": "vins <luyuchen627@gmail.com>",
*/

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
	$.smartScroll(showTip,".showTipWrap");//防止body内容滚动
}