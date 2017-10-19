$(document).ready(function() {
	//获取openid
	var args = parseQueryArgs();
	var openid = args.openid;
	var schoolid = args.schoolid;//学校id
	var uuid = args.uuid;
	var p_areaid = "";//省份id,
	var c_areaid = "";//城市id
	var bind_type = "bindmgr";//绑定类型；selectbindstu绑定学生
	var nextBtnStatus = false;

	var api = {
		//获取城市列表
		getCitys: function(params) {
			var ajaxUrl = baseUrl + "system.listareas";
			query("post",ajaxUrl,params.data,params.success,params.fail);
		},
		//获取学校列表
		getSchools: function(params) {
			var ajaxUrl = baseUrl + "system.listschools";
			query("post",ajaxUrl,params.data,params.success,params.fail);
		},
		//获取学校的详细信息
		getSchoolDetail: function(params) {
			var ajaxUrl = baseUrl + "schools.getdetail";
			query("post",ajaxUrl,params.data,params.success,params.fail);
		},
	}
	var util = {
		//获取省份（直辖市）
		getProvince: function() {
			api.getCitys({
				data:{
					"level": 1,
				},
				success: function (res) {
					if(res.ok){
						nextBtnStatus = true;
					}else{
						nextBtnStatus = false;
					}
					var data = res.rows;
					if($("#toggleProvince").length > 0){
						$("#toggleProvince").removeSheetAction();
					}
					if(data.length > 0){
						p_areaid = data[0].areaid;
						$(".provinceSelect").text(data[0].fullname);
						util.getCity();//获取选中省份的城市列表
						$.sheetAction({
							id:"toggleProvince",
							title:"选择省份（直辖市）",
							data:data,
							showField:"fullname",
							onSelect:function(ele){
								var index = $(ele).attr("index");
								p_areaid = data[index].areaid;
								$(".provinceSelect").text(data[index].fullname);
								$(ele).addClass("selected").siblings().removeClass("selected");
								util.getCity();//获取选中省份的城市列表
								$(".provinceSelect").removeClass("rotate");
								$("#toggleProvince").hideSheetAction();
							},
							cancel:function(){
								$(".provinceSelect").removeClass("rotate");
								$("#toggleProvince").hideSheetAction();
							}
						});
					}
					$(".provinceSelect").click(function(){
						if($("#toggleProvince").length > 0){
							$(this).addClass("rotate");
							$("#toggleProvince").showSheetAction();
						}else{
							$.toast({
								type:"tip",
								text:"没有相关数据"
							});
						}
					});
				}
			});
		},
		//获取城市
		getCity: function() {
			api.getCitys({
				data:{
					"areaid": p_areaid,
				},
				success: function (res) {
					if(res.ok){
						nextBtnStatus = true;
					}else{
						nextBtnStatus = false;
					}
					var data = res.rows;
					if($("#toggleCity").length > 0){
						$("#toggleCity").removeSheetAction();
					}
					if(data.length > 0){
						c_areaid = data[0].areaid;
						$(".citySelect").text(data[0].name);
						util.getSchools();//获取选中城市的学校列表
						$.sheetAction({
							id:"toggleCity",
							title:"选择城市",
							data:data,
							showField:"name",
							onSelect:function(ele){
								var index = $(ele).attr("index");
								c_areaid = data[index].areaid;
								$(".citySelect").text(data[index].name);
								$(ele).addClass("selected").siblings().removeClass("selected");
								util.getSchools();//获取选中城市的学校列表
								$(".citySelect").removeClass("rotate");
								$("#toggleCity").hideSheetAction();
							},
							cancel:function(){
								$(".citySelect").removeClass("rotate");
								$("#toggleCity").hideSheetAction();
							}
						});
					}else{
						$(".citySelect").text("没有任何数据!");
						nextBtnStatus = false;
					}
					$(".citySelect").click(function(){
						if($("#toggleCity").length > 0){
							$(this).addClass("rotate");
							$("#toggleCity").showSheetAction();
						}else{
							$.toast({
								type:"tip",
								text:"没有相关数据"
							});
						}
					});
				}
			});
		},
		//获取学校列表
		getSchools: function() {
			api.getSchools({
				data:{
					areaid:c_areaid,
					method:"listall"
				},
				success: function(res) {
					if(res.ok){
						nextBtnStatus = true;
					}else{
						nextBtnStatus = false;
					}
					var data = res.rows;
					if($("#toggleSchool").length > 0){
						$("#toggleSchool").removeSheetAction();
					}
					if(data.length > 0){
						schoolid = data[0].schoolid;
						$(".schoolSclect").text(data[0].fullname);
						$.sheetAction({
							id:"toggleSchool",
							title:"选择学校",
							data:data,
							showField:"fullname",
							onSelect:function(ele){
								var index = $(ele).attr("index");
								schoolid = data[index].schoolid;
								$(".schoolSclect").text(data[index].fullname);
								$(ele).addClass("selected").siblings().removeClass("selected");
								$(".schoolSclect").removeClass("rotate");
								$("#toggleSchool").hideSheetAction();
							},
							cancel:function(){
								$(".schoolSclect").removeClass("rotate");
								$("#toggleSchool").hideSheetAction();
							}
						});
					}else{
						$(".schoolSclect").text("没有任何数据!");
						schoolid = 0;
						nextBtnStatus = false;
					}
					$(".schoolSclect").click(function(){
						if($("#toggleSchool").length > 0){
							$(this).addClass("rotate");
							$("#toggleSchool").showSheetAction();
						}else{
							$.toast({
								type:"tip",
								text:"没有相关数据"
							});
						}
					});
				}
			});
		},
		//跳转到绑定页面
		gotoBind: function(page) {
			window.location.href = page + ".html?openid=" + openid + "&uuid=" + uuid + "&schoolid=" + schoolid;
		}
	}
	if(!schoolid || parseInt(schoolid) == 0){
		$(".selectArea").removeClass("hidden");
		$(".defaultSchool").addClass("hidden");
		util.getProvince();
	}else{
		//已有学校信息
		$(".selectArea").addClass("hidden");
		$(".defaultSchool").removeClass("hidden");
		bind_type = "bindmgr";//绑定类型为教师
		api.getSchoolDetail({
			data:{
				uuid:uuid,
				schoolid:schoolid,
			},
			success: function(res) {
				if(res.ok){
					nextBtnStatus = true;
					var detail = res.detail;
					if(detail.fullname != ""){
						$(".schoolName").text(detail.fullname);
					}else{
						$(".schoolName").text("名字正在获取中...");
					}
					if(detail.register_area && detail.register_area != null && detail.register_area != ""){
						$(".schoolArea").text(detail.register_area);
					}else{
						$(".schoolArea").text("目标学校所在的地区正在锁定中...");
					}
				}else{
					nextBtnStatus = false;
				}
			}
		});
	}

	$(".nextBtn").click(function(){
		if(!schoolid || parseInt(schoolid) == 0){
			$.showTip("请选择一个学校");
			return;
		}
		if(nextBtnStatus){
			util.gotoBind(bind_type);
		}else{
			$.showTip("请检查您选中的数据");
			return;
		}
	});
});