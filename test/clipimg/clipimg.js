var body = document.querySelector("body");

clipImg({
	src: 'http://img5.imgtn.bdimg.com/it/u=3237976533,2233383012&fm=27&gp=0.jpg',
	pos: [200,130,50,60,200,260]
},body);


function clipImg(obj,wrap){
	/*var obj = {
		src: 'http://img5.imgtn.bdimg.com/it/u=3237976533,2233383012&fm=27&gp=0.jpg',//原始图片的路径
		pos: ['x','y','w','h','sw','sh'],//要裁剪区域的位置，x,y代表位置，w,h代表宽高，sw,sh要显示的宽高，默认和裁剪的宽高一致
	}*/
	if(obj.src){
		var canvas = document.createElement("canvas");
		if(obj.pos && obj.pos instanceof Array){
			var x = obj.pos[0] || 0;
			var y = obj.pos[1] || 0;
			var w = obj.pos[2] || 0;
			var h = obj.pos[3] || 0;
			var sw = obj.pos[4] || w;
			var sh = obj.pos[5] || h;
		}
		var img = new Image();
		img.src = obj.src;
		img.onload = function(){
			canvas.width = sw;
			canvas.height = sh;
			var ctx = canvas.getContext("2d");
			ctx.drawImage(img,x,y,w,h,0,0,sw,sh);
			wrap.appendChild(canvas);
		}
	}else{
		throw "图片不存在";
	}
}