(function($){
	$.Confirm = function(content, callback){
		var opts = {
			confirmcss : "confirm",
			titlecss:"title secondfont blod textcenter blackfont",
			contentcss : "content fifthfont blackfont",
			bottomcss : "bottom  thirdfont",
			okcss : "okcss textcenter",
			oktext : "确定",
			cancelcss : "cancelcss textcenter grayfont1",
			canceltext : "取消",
			title: '',
			content:'',
		};

		if (typeof content == 'string') {			
			opts.title = content;
		} else if ($.isPlainObject(content)) {
			opts = $.extend(opts,content);
		}

		var confirm = $(document.createElement("div")).addClass(opts.confirmcss);
		var title = $(document.createElement("div")).addClass(opts.titlecss).html(opts.title).appendTo(confirm);//标题 
		var content = $(document.createElement("div")).addClass(opts.contentcss).html(opts.content).appendTo(confirm);//内容 
		var okdiv = $(document.createElement("div")).addClass(opts.okcss).html(opts.oktext);
		var canceldiv = $(document.createElement("div")).addClass(opts.cancelcss).html(opts.canceltext);//取消按钮
		var bottomdiv = $(document.createElement("div")).addClass(opts.bottomcss).append(canceldiv).append(okdiv).appendTo(confirm);//按钮区域
		var modaldiv = $(document.createElement("div")).addClass("modalConver").append(confirm).appendTo($("body")).show(0);//modaldiv
		var bd = $("body").addClass("modal-open");

		okdiv.click(function(e){
    		modaldiv.remove();
    		bd.removeClass("modal-open");
    		if (typeof callback == 'function')
    			callback(true);
		});

		canceldiv.click(function(e) {
    		modaldiv.remove();
    		bd.removeClass("modal-open");
    		if (typeof callback == 'function')
    			callback(false);
		});
	}

	/*提示*/
	$.showTip = function(content,callback)
	{
		var opts = {
			showTipcss : "showTipcss centerframe fifthfont textcenter blackfont",
		};

		if (typeof content == 'string') {			
			opts.content = content;
		} else if ($.isPlainObject(content)) {
			opts = $.extend(opts,content);
		}

		var showTip = $(document.createElement("div")).addClass(opts.showTipcss);
		var content = $(document.createElement("div")).addClass("content").html(opts.content).appendTo(showTip);
		var btn = $(document.createElement("div")).addClass("btn").html("确定").appendTo(showTip).click(function(){
			$($(this).parent()).remove();
			$($(".modalConver")[0]).remove();
			if(typeof(callback) == 'function') callback();

		});
		var modaldiv = $(document.createElement("div")).addClass("modalConver").append(showTip).appendTo($("body")).show(0,function(){
		$(showTip).show();
			/*$(showTip).show(500).delay(opts.showtime).hide(500,function(){
				$($(this).parent()).remove();
				if(typeof(callback) == 'function') callback();
			});*/
		});
	}

	//进度条
	$.fn.Progress = function(opts){
		var defaults = null, m;
		var methods = {};

		function progressOnAnimation(running, i) {
			running.css("width",i/2+"%");
		}

		methods.draw = function() {
			var i = 0;
			var running = $(document.createElement("div")).addClass(defaults.runnercss).appendTo(this);
			var t = setInterval(function(){
				if(i == defaults.number * 2){
	                clearInterval(t);
	            }else{
	                i = i + 1;
	            }
	            progressOnAnimation(running, i);
			},10);
		};

		if (typeof opts == 'string') {
			var m = methods[opts];
		 	if (m) {
		 		var args = Array.prototype.slice.call(arguments, 1);
		 		for(var i = 0; i < this.length; ++ i) {
		 			var $t = $(this[i]);
		 			defaults = $t.data('defaults');
		 			m.apply(this[i], args);
		 			$t.data('defaults', defaults);
		 		}
		 	}

		} else {
			defaults = $.extend({
				runnercss : "running" ,
				number : 100 ,
			}, opts || {});

			this.data('defaults', defaults);
		}

		return this;
	}


})(jQuery);

