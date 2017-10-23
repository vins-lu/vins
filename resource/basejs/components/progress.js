/*
	"name": "progress",
	"version": "1.0.0",
	"description": "基于jquery版本的进度条,推荐移动端使用,样式参见component.css的progress部分",
	"author": "vins <luyuchen627@gmail.com>",
*/

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