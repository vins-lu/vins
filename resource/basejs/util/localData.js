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