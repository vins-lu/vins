/*
	"name": "showMore",
	"version": "1.0.0",
	"description": "基于jquery版本的展开更多，用于多列表的内容过多的隐藏与展示,样式参见component.css的showMore部分",
	"author": "vins <luyuchen627@gmail.com>",
*/

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