/*
	"name": "sheetAction",
	"version": "1.0.0",
	"description": "基于jquery版本的列表选择，仿照微信样式，能很好的使用在wx中,推荐移动端使用,样式参见component.css的sheetAction部分",
	"author": "vins <luyuchen627@gmail.com>",
*/


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