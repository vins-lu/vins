/*
	"name": "toast",
	"version": "1.0.0",
	"description": "基于jquery版本的toast,样式参见component.css的toast部分",
	"author": "vins <luyuchen627@gmail.com>",
*/

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