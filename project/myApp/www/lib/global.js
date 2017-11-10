function PageLoader(){}
pageLoader = new PageLoader();
pageLoader.url = "http://api.lm.com/";
pageLoader.codeurl = "http://api.lm.com/validcodes.show?uuid=0A2v2wXkL1Uu1-B-uvCLsoooooPwe61L2wXvu&";


//数据获取
var query = function(the_type,the_url,the_param,succ_callback,err_callback,processData,contentType){
	var loaddiv;
	if(!the_url)  { return false;}
	if(!the_type) { the_type = 'post'; }

	the_type     = the_type.toLowerCase();

	var param = {
		type	: the_type,
		cache	: false,
		url		: the_url,
		data	: the_param,
		dataType: "json",
		beforeSend:null,
        complete:null,
		success	: function(response) {
					removePageLoader();
					if ($.isPlainObject(response)) {
						if (response.ok || response.rows != null) {
							succ_callback(response);
						} else if (!err_callback || !err_callback(response)) {
							if (response.lang){
								$.showTip(errMsg(response.lang),function(){
									if(response.errcode == 2){
										parent.location = "login.html";
									}
								});
							}
							else if (response.errcode){
								$.showTip("发生网络错误，错误码为: " + response.errcode + "，请联系客服以解决此问题");
							}
						}
					}
				},
		error   : function(XMLHttpRequest, textStatus, errorThrown){
		       	removePageLoader();
		        $.showTip("服务器连接错误");
		}
	};

	if(processData == false)
		param["processData"] = false;
	if(contentType == false)
		param["contentType"] = false;
	$.ajax(param);
};

function batchQuery(reqs, succ, err) {
	var one = reqs.shift();
	query(one.type || 'post', one.url, one.param, function(response) {
		if (one.success)
			one.success(response);
		if (reqs.length)
			batchQuery(reqs);
		else if (succ)
			succ(response);
	}, function(response) {
		if (one.error)
			one.error(response);
		if (err)
			return err(response);
	});
}

function JsonToString(o) {
    var arr = [];
    var fmt = function(s) {
        if (typeof s == 'object' && s != null) return JsonToStr(s);
        return /^(string|number)$/.test(typeof s) ? "'" + s + "'" : s;
    }
    for (var i in o)
         arr.push("'" + i + "':" + fmt(o[i]));
    return '{' + arr.join(',') + '}';
}

//字符串转HTML
function stringencode(str)
{
	return str.split('\r').join('').split('\n').join('\\n');
}

//HTML转字符串
function stringdecode(str,html){
	if(html) {
		return $('<p></p>').text(str.split('\\n').join('\n')).html().split('\n').join('<br/>');
	}
	return str.split('\\n').join('\n');
}

function htmltostring(html){
	var p = html.split("<br>").join("\n").split("<br/>").join("\n");
	return p;
}

//获取URL传入的参数
function parseQueryArgs() {
    if (window.QUERY_ARGS)
        return window.QUERY_ARGS;

    var loc = window.location.href;
    var pos = loc.indexOf('?');
    var r = {};

    if (pos >  0) {
        var args = loc.substr(pos + 1).split('&');
        for(var i = 0; i < args.length; ++ i) {
            pos = args[i].indexOf('=');
            if (pos >= 0)
                r[args[i].substr(0, pos)] = args[i].substr(pos + 1);
            else
                r[args[i]] = '';
        }
    }

    window.QUERY_ARGS = r;
    return r;
}

//判断当前年份 是否是闰年
function isLeapyear(year)
{
	var isleapyear;
	if((year%100 != 0 && year%4 == 0) || year%400 == 0){
		isleapyear = 1;
	}
	else isleapyear = 0;
	return isleapyear;
}

/*根据年份 和月份判断天数*/
function hasdate(year,month){
	var islep = isLeapyear(year);
	var d ;
	if(month == "1" || month == "3" || month == "5" || month == "7" || month == "8" || month == "10" || month == "12"){
		d = 31;
	}
	else if(month == "4" || month == "6" || month == "9" || month == "11"){
		d = 30;
	}
	else if(month == "2")
	{
		if(islep == "1") d = 29;
		else if(islep == "0") d = 28;
	}
	return d;
}

//计算时间间隔
function GetDateDiff(startDate,endDate)
{
	/*var startDate = new Date("1111/1/1 17:00:00");
	var endDate = new Date("1115/3/2 18:59:00");*/
	//var gap = Math.abs(d1-d2)/1000/60/60;
	var date3=endDate.getTime()-startDate.getTime()
	var gap = Math.abs(date3)/1000/60/60;
	if(gap < 1){
		gap = parseInt(gap * 60);
		return gap+"分钟前";
	}
	else if(gap <= 24)
		return parseInt(gap)+"小时前";
	else{
		var y = endDate.getFullYear() - startDate.getFullYear();
		var m = endDate.getMonth() - startDate.getMonth();
		var d = endDate.getDate() - startDate.getDate();
		if(y > 0) return y+"年前";
		else if(m > 0) return m+"月前";
		else if(d > 0) return d+"天前";
	}

}

//数组
Array.prototype.indexOf = function(val) {
	for (var i = 0; i < this.length; i++) {
		if (this[i] == val) return i;

	}
	return -1;
};
Array.prototype.remove = function(val) {
	var index = this.indexOf(val);
	if (index > -1) {
		this.splice(index, 1);
	}
};
//数组去重
Array.prototype.unique = function(){
	this.sort();
	var re=[this[0]];
	for(var i = 1; i < this.length; i++){
		if( this[i] !== re[re.length-1]){
			re.push(this[i]);
		}
	}
	return re;
}
//判断数组中是否存在某个元素
Array.prototype.in_array = function(e){
    for(i=0;i<this.length;i++){
        if(this[i] == e)
              return true;
    }
    return false;
}

var  searchkey = {
	setKey :function(key){
		var keys = window.localStorage.getItem("search");
		var keyArray = new Array();
		if(keys)
		{
			keyArray = keys.split(',');
		}
		key = key.toString();
		if(!keyArray.in_array(key))
			keyArray.push(key);
		localData.set("search",keyArray.join(','));
	},
	keysList :function(){
		var keys = window.localStorage.getItem("search");
		var keyArray = new Array();
		if(keys)
		{
			keyArray = keys.split(',');
		}

		return keyArray;
	},
	removekey:function(key){
		var keys = window.localStorage.getItem("search");
		var keyArray = new Array();
		if(keys)
		{
			keyArray = keys.split(',');
		}
		keyArray.remove(key);
		localData.set("search",keyArray.join(','));
	},
	cleankeys:function(){
		localData.set("search","");
	}
}

function testMobile(str){
	str = $.trim(str);
	var reg = /^((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8}$/;
	if(reg.test(str)) return true;
	else return false;
}

function testEmail(str){
	str = $.trim(str);
	var reg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
	if(reg.test(str)){
		return true;
	}else{
		return false;
	}
}

/*字母和数字的组合*/
function testPassWord(str){
	str = $.trim(str);
    var reg = /^([a-zA-Z0-9]){6,32}$/;
    if(reg.test(str)){
        var reg2 = /[a-zA-Z]*[0-9]+/;
        if(reg2.test(str)){
            var reg3 = /[0-9]*[a-zA-Z]+/;
            if(reg3.test(str)){
                return true;
            }
            else
                return false;
        }
        return false;
    }else{
        return false;
    }
}

/*不包含除字母数字之外的字符*/
function testPassWordAorN(str){
	var reg = /^([a-zA-Z0-9]){6,32}$/;
	str = $.trim(str);
	if(reg.test(str)){
		return true;
	}else{
		return false;
	}
}

function showPageLoader(){
	var img = $(document.createElement("div")).addClass("loadingimg").addClass("centerframe");
	var modal = $(document.createElement("div")).addClass("modalConver").append(img);
	$("body").addClass("modal-open").append(modal);
}

function removePageLoader(){
	$($("body > .modalConver")[0]).remove();
	if($("body > .modalConver").length == 0)
		$("body").removeClass("modal-open");
}

//本地存储
var localData = {
	set:function(key,value){
		var v = null;
		if ($.isPlainObject(value) || typeof(value) == "object")
			v = JSON.stringify(value);
		else if (typeof value == 'string')
			v = value;
		else
			alert('error');
		window.localStorage.setItem(key,v);
	},
	get:function(key){
		var v = window.localStorage.getItem(key);
		if (typeof v == 'string') {
			try {
				return JSON.parse(v);
			} catch(e) {
				return v;
			}
		}

	},
	remove:function(key){
		localStorage.removeItem(key);
	}
};

//验证用户是否登录
function islogin(){
	var user = localData.get("user");
	if(user == undefined) return null;
	else{
		if(user.uuid == undefined || user.uuid == "") {
			return null;
		}
		else{
			return user;
		}
	}
}



function errMsg(MsgCode){
	var errMsg = "";
	switch(MsgCode)
	{
		case "account_pass_failed":
			errMsg = "帐号或密码不正确";
			break;
		case "uuid_invalid":
			errMsg = "登陆信息无效，请重新登陆";
			break;
		case "oldpass_error":
			errMsg = "旧密码错误，请返回上一页重新登陆";
			break;
		case "user_status_forbid":
			errMsg = "已被禁止登陆";
			break;
		case "valid_code_notfound":
			errMsg = "没有提供验证码";
			break;
		case "valid_code_error":
			errMsg = "验证码不正确";
			break;
		case "valid_code_tryout":
			errMsg = "验证码连续失败次数太多，请过15分钟再尝试登陆";
			break;
		case "class_not_found":
			errMsg = "班级数据不存在";
			break;
		case "some_student_notexists":
			errMsg = "给定的一组学生ID号中，部分学生未被找到";
			break;
		case "some_class_notexists":
			errMsg = "给定的一组班级ID号中，部分班级未被找到";
			break;
		case "some_school_notexists":
			errMsg = "给定的一组学校ID号中，部分学校未被找到";
			break;
		case "school_status_forbid":
			errMsg = "学校已被关闭不可使用";
			break;
		case "combo_students_exceed":
			errMsg = "套餐中可拥有的学生数量已将近上限，无法再继续添加学生";
			break;
		case "class_status_forbid":
			errMsg = "班级已被关闭不可使用";
			break;
		case "combo_schools_exceed":
			errMsg = "套餐中可拥有的学校数量已将近上限，无法再继续添加学校";
			break;
		case "combo_end_dated":
			errMsg = "套餐的有效期已过";
			break;
		case "combo_cannot_plus":
			errMsg = "新增加的套餐是独立套餐，不能叠加使用";
			break;
		case "school_user_notfound":
			errMsg = "指定的校长/副校长用户帐户未找到";
			break;
		case "teacher_user_notfound":
			errMsg = "指定的老师/班主任用户帐户未找到";
			break;
		case "relation_exists":
			errMsg = "关联已经存在，无须重复设置";
			break;
		case "user_exists":
			errMsg = "用户已存在，请不要重复注册";
			break;
		case "not found uploaded file":
			errMsg = "您没有上传任何文件";
			break;
	}
	return errMsg;

}

/*通过数据库的标识，返回学校所属种类*/
function getNature(sign)
{
	if(sign == "public")
		return "公立学校";
	else if(sign == "private")
		return "私立学校";
	else if(sign == "org")
		return "培训机构";
	else if(sign == "class")
		return "小型辅导班";
}

/*显示身份*/
function getUserType(sign){
	var array = new Array();
	array["agent"] = "代理";
	array["school"] = "校长";
	array["superschool"] = "大校长";
	array["teacher"] = "老师";
	array["superteacher"] = "副校长";
	array["classmain"] = "班主任";
	array["region"] = "大区经理";
	array["service"] = "客服";
	array["admin"] = "系统管理员";
	array["super"] = "超管";
	return array[sign];
}

/*返回年级名称*/
function returnLevelName(levelid){
	var array = new Array();
	array[1] = "小一";
	array[2] = "小一";
	array[3] = "小二";
	array[4] = "小二";
	array[5] = "小三";
	array[6] = "小三";
	array[7] = "小四";
	array[8] = "小四";
	array[9] = "小五";
	array[10] = "小五";
	array[11] = "小六";
	array[12] = "小六";
	array[13] = "初一";
	array[14] = "初一";
	array[15] = "初二";
	array[16] = "初二";
	array[17] = "初三";
	array[18] = "初三";
	array[19] = "高一";
	array[20] = "高一";
	array[21] = "高二";
	array[22] = "高二";
	array[23] = "高三";
	array[24] = "高三";
	return array[levelid];
}

function returnPapersStatus(statusid){
	var array = new Array();
	array["created"] = "等待上传完整试卷";
	array["analyze"] = "分析中";
	array["queuing"] = "排队中";
	array["checking"] = "正在阅卷";
	array["stating"] = "报表生成中";
	array["end"] = "报表已生成";
	return array[statusid];
}


