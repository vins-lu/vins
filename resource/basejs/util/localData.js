/*
	"name": "localData",
	"version": "1.0.0",
	"description": "基于js-localStorage的读写操作",
	"author": "vins <luyuchen627@gmail.com>",
*/

var localData = {
	set: function(key, value) {
		var v = null;
		if(typeof(value) == "object"){
			try{
				v = JSON.stringify(value);
			} catch(e) {
				console.log(v);
			}
		}else if(typeof value == 'string' || typeof value == 'number'){
			v = value;
		}else{
			console.log('error');
		}
		window.localStorage.setItem(key, v);
	},
	get: function(key) {
		var v = window.localStorage.getItem(key);
		if(typeof v == 'string') {
			try {
				return JSON.parse(v);
			} catch(e) {
				console.log(v);
			}
		}

	},
	remove: function(key) {
		localStorage.removeItem(key);
	}
}

var cookie = {
    get: function (key) {  //根据key值获取对应的cookie
        var data = document.cookie;  //获取cookie
        var startIndex = data.indexOf(key + '=');  //获取key第一次出现的位置 
        if (startIndex > -1) {  //如果有cookie
            startIndex = startIndex + key.length + 1;
            //结束位置等于从key开始的位置之后第一次;号所出现的位置
            var endIndex = data.indexOf(';',startIndex);
            //如果未找到结尾位置则结尾位置等于cookie长度，之后的内容全部获取
            endIndex = endIndex < 0 ? data.length : endIndex;
            return decodeURIComponent(data.substring(startIndex,endIndex));
        }else {
            return null;
        }
    },
    set: function (key,value,time) {
        if(!key || value == undefined) {
          throw new Error("parameters are not defined");
        }
        var time = time || 0;  //默认保存时间,以天为单位
        var cur = new Date();  //获取当前时间
        cur.setTime(cur.getTime() + (time * 24 * 3600 * 1000));  //设置指定时间
        var expires = time == 0 ? "" : cur.toGMTString();
        //创建cookie  并且设置生存周期为GMT时间
        document.cookie = [key, '=', encodeURIComponent(value), ';expires=', expires].join("");
    },
    del: function (key) {
        //获取cookie
        var data = this.get(key);
        //如果获取到cookie则重新设置cookie的生存周期为过去时间
        if (data !== null) {
            this.set(key,data,-1);
        }
    }
};