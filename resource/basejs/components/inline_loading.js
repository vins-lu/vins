/*
	"name": "inline_loading",
	"version": "1.0.0",
	"description": "基于jquery版本的组件内加载，用于ajax请求时候，在按钮或者其他组件中显示加载状态,样式参见component.css的inline_loading部分",
	"author": "vins <luyuchen627@gmail.com>",
*/


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