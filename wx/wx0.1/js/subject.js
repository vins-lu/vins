$(document).ready(function() {
	//获取科目
	var ajaxUrl = pageLoader.url + 'system.listclassifies',
		ajaxParam = {

		},
		op = "";
	query('post', ajaxUrl, ajaxParam, function(jsonData) {
		console.log(jsonData);
		for(let i = 0, len = jsonData.rows.length; i < len; i++) {
			op += "<option value='" + jsonData.rows[0].id + "'>" + jsonData.rows[i].name + "</option>";
		}
		$("select").html(op);
	})

	//参数
	var args = parseQueryArgs();
	//发送
	$("button").click(function() {
		var ajaxUrl = pageLoader.url + 'upload.createpackage',
			ajaxParam = {
				uuid: args.uuid,
				privatefileid: args.exam,
				platform: "wx",
				classifyid: $("select").val(),
			}
		query('post', ajaxUrl, ajaxParam, function(jsonData) {
			console.log(jsonData)
		})
	})
})