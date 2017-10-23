/*
	"name": "selectAction",
	"version": "1.0.0",
	"description": "基于jquery版本的下拉列表,样式参见component.css的selectAction部分",
	"author": "vins <luyuchen627@gmail.com>",
*/


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