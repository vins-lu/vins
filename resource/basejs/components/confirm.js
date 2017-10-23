/*
	"name": "confirm",
	"version": "1.0.0",
	"description": "基于jquery版本的对话框，用于和用户交互的对话框，内容可以自己定义,样式参见component.css的confirm部分",
	"author": "vins <luyuchen627@gmail.com>",
*/

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
	$.smartScroll(confirm,".confirmWrap");//防止body内容滚动
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