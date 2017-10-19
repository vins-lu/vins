$(document).ready(function(){
	var util = {
		selectImg: function(sourceBool){
			var sourceType = sourceBool ? ['camera'] : ['album'];
			chooseImg({
				sourceType: sourceType, // 可以指定来源是相册还是相机，默认二者都有'album', 'camera'
				success: function (res) {
				    // var localIds = res.localIds; 
				    console.log(res);
				}
			});
		}
	}
	$(".uploadarea img").on("click",function(){
		util.selectImg(true);
	});
	$.sheetAction({
		id:"takephoto",//生成的元素id
		data:[{
			text: "拍照上传",
			type: "camera"
		},
		{
			text: "本地上传",
			type: "album"
		},
		{
			text: "网络试卷",
			type: "cloud"
		}],//数据数组
		selected:0,//默认选中
		onSelect: function(ele){
			if($(ele).attr("type") == "camera"){
				util.selectImg(true);
			}else if($(ele).attr("type") == "album"){
				util.selectImg(false);
			}else if($(ele).attr("type") == "cloud"){
				window.location.href = "./selectcloudexam.html";
			}
		},//选中回调函数
	});
	$(".selectImg").on("click",function(){
		$("#takephoto").showSheetAction();
	});
});