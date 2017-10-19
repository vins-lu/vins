var baseUrl = "https://api.laoshidongni.com/"
function getApiBaseUrl() {
	var url = window.location.href;
	var pos = url.indexOf('?'), endpos;
	if (pos > 0)
		url = url.substr(0, pos - 1);

	pos = url.indexOf('://');
	endpos = url.indexOf('.', pos + 3);

	return [url.substr(0, pos + 3), 'sc-api', url.substr(endpos)].join('');
}

//数据获取
var query = function(the_type, the_url, the_param, succ_callback, err_callback, complete_callback, processData, contentType) {
	var loadType = false;//loading加载方式：true:全屏加载，false:局部加载
	var queryType = "post";//请求方式
	if(!the_url) {
		return false;
	}
	if(the_type && $.isPlainObject(the_type)) {
		loadType = the_type.loading ? the_type.loading : false;
		queryType = the_type.type;
	}

	queryType = queryType.toLowerCase();

	var param = {
		type: queryType,
		cache: false,
		url: the_url,
		data: the_param,
		dataType: "json",
		beforeSend: null,
		success: function(response) {
			if($.isPlainObject(response)) {
				if(response.ok || response.rows != null) {
					succ_callback(response);
				} else {
					if(!err_callback || !err_callback(response)) {
						if(response.lang) {
							$.showTip({
								title: "错误",
								content: errMsg(response.lang),
								success: function(){
									if(response.lang == "identity_error"){
										$("body").emptyState({
											type: "nopermission",
											content: errMsg(response.lang),
											replace: true,
											style: {
												position: "absolute",
												top: "38.2%",
												transform: "translate(0,-50%)"
											}
										});
									}
								}
							});
						}else if(response.errcode){
							$.showTip({
								title: "错误",
								content: "发生网络错误，错误信息为: " + errCode(response.errcode.toString()) + "，请拨打客服电话 400-640-8688 以解决此问题",
								success: function() {
									if(response.errcode == 2){
										(parent || top).location.reload();
									}
								}, 
							});
						}
					}
				}
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			$.showTip({
				title: "错误",
				content: "发生了不可描述的错误<br/>,请稍后再试!"
			});
			$("body").emptyState({
				type:"exception",
				content:"发生了不可描述的错误<br/>,请稍后再试!",
				replace:true,
				style:{
					position: "absolute",
					top: "38.2%",
					transform: "translate(0,-50%)"
				}
			});
		},
		complete: function() {
			closeToast();
			if(complete_callback && typeof complete_callback == "function"){
				complete_callback();
			}
		}
	};

	if(processData == false)
		param["processData"] = false;
	if(contentType == false)
		param["contentType"] = false;
	if(loadType){
		$.toast();
	}
	$.ajax(param);
};

//获取URL传入的参数
function parseQueryArgs() {
	if(window.QUERY_ARGS)
		return window.QUERY_ARGS;

	var loc = window.location.href;
	var pos = loc.indexOf('?');
	var r = {};

	if(pos > 0) {
		var args = loc.substr(pos + 1).split('&');
		for(var i = 0; i < args.length; ++i) {
			pos = args[i].indexOf('=');
			if(pos >= 0)
				r[args[i].substr(0, pos)] = args[i].substr(pos + 1);
			else
				r[args[i]] = '';
		}
	}

	window.QUERY_ARGS = r;
	return r;
}

function closeToast() {
	if($(".toast").length > 0){
		$(".toast").remove();
	}
}

//本地存储
var localData = {
	set: function(key, value) {
		var v = null;
		if($.isPlainObject(value) || typeof(value) == "object")
			v = JSON.stringify(value);
		else if(typeof value == 'string' || typeof value == 'number')
			v = value;
		else
			console.log('error');
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

//格式化日期格式为"2017-05-16 10:50:50"
var formatterDate = function(date) {
	var day = date.getDate() > 9 ? date.getDate() : "0" + date.getDate();
	var month = (date.getMonth() + 1) > 9 ? (date.getMonth() + 1) : "0" + (date.getMonth() + 1);
	var hor = date.getHours();
	var min = date.getMinutes();
	var sec = date.getSeconds();
	return date.getFullYear() + '-' + month + '-' + day + " " + hor + ":" + min + ":" + sec;
}

function testMobile(str) {
	str = $.trim(str);
	var reg = /^((13[0-9]{1})|(14[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8}$/;
	if(reg.test(str)) return true;
	else return false;
}

function testEmail(str) {
	str = $.trim(str);
	var reg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
	if(reg.test(str)) {
		return true;
	} else {
		return false;
	}
}

/*字母和数字的组合*/
function testPassWord(str) {
	str = $.trim(str);
	var reg = /^([a-zA-Z0-9]){6,32}$/;
	if(reg.test(str)) {
		var reg2 = /[a-zA-Z]*[0-9]+/;
		if(reg2.test(str)) {
			var reg3 = /[0-9]*[a-zA-Z]+/;
			if(reg3.test(str)) {
				return true;
			} else
				return false;
		}
		return false;
	} else {
		return false;
	}
}

function gradeList() {
	var grade = [
		/*{
					"val": "1",
					"text": "小一"
				},
				{
					"val": "3",
					"text": "小二"
				},
				{
					"val": "5",
					"text": "小三"
				},
				{
					"val": "7",
					"text": "小四"
				},
				{
					"val": "9",
					"text": "小五"
				},
				{
					"val": "11",
					"text": "小六"
				},*/
		{
			"val": "13",
			"text": "初一"
		},
		{
			"val": "15",
			"text": "初二"
		},
		{
			"val": "17",
			"text": "初三"
		},
		{
			"val": "19",
			"text": "高一"
		},
		{
			"val": "21",
			"text": "高二"
		},
		{
			"val": "23",
			"text": "高三"
		},
	];
	return grade;
}

function errMsg(MsgCode) {
	var errMsg = {
		"not_subscribed_first": "微信绑定前必须先通过正常方式关注了“老师懂你”服务号后，才能进行绑定",
		"no_student_info_wx_cannot_bind": "微信绑定前，请确认您的孩子在“老师懂你”中已经拥有了至少一次考试成绩",

		"account_readonly": "您的帐号为体验帐号，只能浏览和查看，不能进行修改、删除等操作",
		"teacher_need_auth_first": "学校设置了老师注册必须先认证，您的注册信息未被认证，无法完成注册",
		"teacher_auth_already_used": "您的注册信息已被其它用户认证过了，如果该用户不是您，请联系《老师懂你》客户解决",
		"teacher_authed_cannot_delete": "老师已经完成了注册，其认证数据不能再删除。请使用离职功能进行处理。",
		"email_exists": "Email地址已经被使用过了",
		"mobile_exists": "手机号已经被使用过了",

		"account_pass_failed": "帐号或密码不正确",
		"qrcode_outdated": "二维码已经过期",
		"uuid_not_exists": "用户唯一标识不存在",
		"low_permission_for_regist": "只能注册级别比您的级别低的用户",
		"user_exists": "用户已经存在，不能重复的注册",
		"data_repeat": "有重复的数据",
		"validcode_toomuch_requests": "验证码请求太频繁，请稍微休息一下再申请吧",
		"too_much_files_rejected": "上传的文件数量太多，服务器已拒绝继续接收",

		"mobile_vcode_freq": "验证码操作太频繁，请稍候再试",
		"not_exists_mobilecode": "手机验证码错误",
		"mobile_vcode_outdated": "验证码无效或已经过期",
		"mobile_vcode_err": "验证码不正确",

		"students_dropout_must_in_sameschool": "按批退学的学生必须位于同一个学校中",

		"not_student": "指定的用户不是一个学生帐户",
		"uuid_invalid": "UUID无效",
		"oldpass_error": "旧的密码不正确",
		"identity_error": "身份不匹配，拒绝访问",
		"user_exists_type_notequal": "注册的帐户已经存在且身份不一样",
		"classname_not_standard": "班级名称不标准，无法识别出年级",

		"user_status_forbid": "指定的用户已被禁止登陆，无法使用",
		"view_user_nopermission": "权限不够，无法获取指定用户的信息",
		"withuuid_nopermission": "权限不够，无法基于指定的用户查看或操作数据",

		"valid_code_notfound": "没有提供验证码",
		"valid_code_error": "验证码不正确",
		"valid_code_tryout": "验证码连续失败次数太多，请过15分钟再尝试登陆",

		"class_not_found": "班级数据不存在",
		"some_student_notexists": "给定的一组学生ID号中，部分学生未被找到",
		"some_class_notexists": "给定的一组班级ID号中，部分班级未被找到",
		"some_school_notexists": "给定的一组学校ID号中，部分学校未被找到",

		"school not exists": "学校不存在",
		"school_status_forbid": "学校已被关闭不可使用",
		"class_status_forbid": "班级已被关闭不可使用",
		"school_no_combo": "学校没有购买任何套餐，无法执行拥有套餐后才能执行的操作",
		"combo_students_exceed": "套餐中可拥有的学生数量已将近上限，无法再继续添加学生",
		"combo_schools_exceed": "套餐中可拥有的学校数量已将近上限，无法再继续添加学校",

		"combo_end_dated": "套餐的有效期已过",
		"combo_cannot_plus": "新增加的套餐是独立套餐，不能叠加使用",

		"school_user_notfound": "指定的校长/副校长用户帐户未找到",
		"teacher_user_notfound": "指定的老师/班主任用户帐户未找到",
		"class_not_end_cannot_same": "班级未结业，不能在同一个年级下创建两个同名的班级",
		"add_to_class_teachers_only": "只有老师可以与班级直接关联",
		"add_to_school_manager_teachers_only": "只有老师和校长可以与学校直接关联",
		"school_samename_class_exists": "同一个学校下同名的班级已经存在",

		"grade_with_level_in_school_notexists": "指定的年级在学校里并不存在",

		"relation_exists": "关联已经存在，无须重复设置",
		"user_already_dismission": "该用户已经被设置为离职，不能重复设置",
		"user_not_dismission": "该用户已经并未离职，无需进行恢复",

		"upload_reqchk_already": "试卷包已经在排队等待批阅或已经在批阅中了，无须重复的申请",
		"upload_package_repeat_checkresult": "试卷包不需要重复的通过检测",
		"upload_package_not_submited": "试卷包还未提交，无法进行检测",
		"upload_reqchk_end": "试卷包已经批阅完成",

		"source_paper_not_created": "必须等待试卷分解完成之后才能进行阅卷",
		"request_mancheck_already": "已经申请过人工阅卷了，无须重复的申请",
		"upload_owner_forbid": "您不在本试卷包所设置的允许操作的管理员范围内",
		"upload_owner_set_onlyself": "只有创建试卷包创建者本人才可以对试卷包的可操作人员范围进行设置",
		"upload_cannot_op_by_user": "试卷文件包已经提交，除非管理员打回或者代处理，否则不可以再对其进行修改或删除的操作",
		"upload_in_examine": "本试卷包位于一次统一的考试中，因此只能修改不能删除",
		"upload_package_no_errflag": "没有错误标记的试卷文件无法修改",
		"upload_package_have_errors": "试卷包中还有文件存在问题，请全部处理完之后再提交",
		"no_stdanswer_cannot_mancheck": "没有标准答案，无法申请阅卷",
		"no_answers_cannot_mancheck": "没有任何学生的答卷，无法申请阅卷",

		"import_classes_gradename_error": "班级的数据存在错误，有个年级的名字无法识别",
		"import_classes_mobile_error": "班级的数据存在错误，有个老师的手机号码格式不正确",

		"upload_package_locked": "试卷包已经被确认(锁定)，在解锁之前不可以再对其进行任何操作",
		"upload_package_blankpaper_checkfailed": "空白试卷未上传，或只上传了一页，请正反两页都上传",
		"upload_package_stdanswers_checkfailed": "标准答案纸未上传",
		"upload_package_studentpapers_checkfailed": "学生作答后的试卷上传的数量与填入的应考人数不一致",
		"upload_package_studentanswers_checkfailed": "答题纸上传的数量与填入的应考人数不一致",
		"upload_package_machinecards_checkfailed": "机读卡上传的数量与填入的应考人数不一致",
		"upload_package_usercards_checkfailed": "自制答题卡上传的数量与填入的应考人数不一致",
		"upload_package_nofiles": "未能找到 作答后的试卷/答题纸/机读卡 这3种学生答卷中的一种",
		"upload_package_norel_class": "试卷包没有与班级关联",
		"upload_package_peer_card_data_notfound": "试卷包所对应的答题卡的配置数据未找到",
		"upload_package_with_classstudents_zero": "不能为一个学生数为0人的班级创建试卷包",
		"upload_package_join_students_notcorrected": "应考人数不正确，不允许为0个人",
		"hadread_noneed_mancheck": "已阅试卷无需再申请自动阅卷",

		"note_had_viewed": "指定的记录已经有人接收了",
		"note_notin_recv_range": "您不在指定接收的通知所设定的接收人范围内，因此无权限接收",
		"note_not_yours": "不是您的通知无法接收也无法查看",
		"note_already_recved": "您已经接收过了，无须重复操作",

		"upload_package_zero_students": "试卷包中应考或实考学生人数为0，无法通过该包的检验",
		"upload_package_students_notpaired_names": "所给出的人名的数量和试卷包所设置的应考人数不相等",
		"upload_package_already_checking": "试卷包已经有人开始阅卷了，不能多人同时抢阅一个试卷包",
		"upload_package_back_need_dial": "试卷包已经申请了代阅，目前已经进入代阅状态，请打电话给客服进行人工取消",
		"upload_package_back_cannot": "试卷包已经进入了自动处理流程，不能直接退回，如果一定要取消，请电话给客服进行人工取消",

		"paper_cannot_remove_with_someassosications": "不能删除一张已经和至少一个试卷包发生了关联的试卷",
		"usercard_in_using": "答题卡已经被至少一个试卷包使用了，无法在试卷包未删除之前先删除答题卡",
		"usercard_not_yours": "只有答题卡的创建人才能删除这张答题卡",

		"part_of_results_not_get": "部分考生的成绩未得出，暂时不能进行统计",
		"examine_started_cannot_delete": "本次考试已经开始，无法再进行删除了",
		"blankpaper_using_cannot_edit": "试卷已经在使用中了，无法再进行修改",
		"student_haveno_sigimages_cannot_autocomp": "没有找到任何学生拥有已存在的签名，因此无法进行自动比对",

		"user_privfile_type_notmatch": "私有文件上传时所指定的用途与当前的实际用途不匹配",

		"class_none_stat_reports": "该班级在指定的学期内没有统计报告",
		"student_none_stat_reports": "该学生在指定的学期内没有统计报告",
		"student_with_name_notfound": "指定的班级和真实姓名的学生不存在",

		"checking_setresult_exceed_students": "所提交的学生成绩的数量已经达到了本次考试实考人数量，无法再提交新的学生成绩",
		"stat_combine_error": "错误的混合多种不同的考试进行统计",
	}
	return errMsg[MsgCode];
}

function errCode(code) {
	var errorCode = {
		"1":"未给出UUID",
		"2":"UUID已经无效",
		"3":"权限不够，无法以执行要求的操作",
		"4":"套餐中的数量已经用完了",
		"5":"用户的身份类型不对",
		"6":"数据库执行SQL时出错",
		"7":"发生数据逻辑性错误",
		"8":"验证码申请操作太频繁 ",
		"9":"请求外链URL返回失败",
		"10":"验证码不正确",
		"11":"withuuid不正确",
		"12":"对withuuid用户的权限不足，无法代为其操作或查看数据",
		"13":"用户权限太高，已经无法使用本接口",
		"14":"XLS服务器连接失败",
		"15":"Socket发送失败",
		"16":"Socket接收失败",
		"17":"磁盘IO出错（出打开应该存在的文件失败，或写入数据时失败）",
		"18":"服务器间通讯APIKey不正确",
		"19":"Json格式不正确",
		"20":"服务端向其它HTTP服务进行HTTP请求失败",
		"21":"工作人员操作出错",
		"22":"创建/删除目录时出错",
		"23":"没有找到指定手机号指定验证类型的验证码",
		"24":"验证码无效或已经过期",
		"25":"验证码不正确",
		"26":"使用用户私有文件时出错，上传的私有文件所指定的用途与实际用途不匹配",
		"27":"上传的文件数量太多，服务器拒绝继续接收",
		"28":"WebSocket出错",
		"29":"临时二维码已经过期",
		"30":"加载动态链接库时失败",
		"31":"动态链接库C函数调用返回值未达到预期",
		"32":"只读状态",
		"33":"老师的注册信息认证失败",
		"1001":"请求的某个参数的值不在允许的范围之内",
		"1002":"缺少某些必要的参数",
		"1003":"某个参数值的数据格式有错误",
		"1004":"某个ID号指定的记录或关联的记录不存在",
		"1005":"某个值的长度不符合要求",
		"1006":"缺少验证码",
		"1007":"上传的文件类型不合法，服务器拒绝",
		"1008":"需要上传文件，但是没有找到上传的文件",
		"1009":"上传的某个文件尺寸不合要求（太小或太大）",
		"1010":"没有找到上传的文件",
		"1011":"上传的文件数量不正确（没有，不够数量，或多了）",
		"1012":"上传的文件没有按要求给出带有顺序标识的变量名",
		"1013":"源和目标两个ID号相同",
		"1014":"某个值已经存在了/数据存在重复",
		"1100":"密码不正确",
		"1101":"密码错误次数太多，拒绝服务",
		"1102":"套餐的有效期已过，不可以再使用这个套餐",
		"1103":"指定的记录不是当前用户的记录，无权限进行操作",
		"1104":"数据关联已经存在，无需重复的设置关联",
		"1105":"数据关联不存在，无法进行取消关联操作",
		"1106":"使用ID号列表找出来的数据不完整，部分列表中的ID已经没有了对应的结果",
		"1107":"试卷已经存在了，不能重复产生",
		"1108":"用户已经存在",
		"1109":"同一个学校里的同名班已经存在",
		"1110":"按照ID批量查找出来的记录数量不够",
		"1111":"指定记录中与其它记录的关联不存在",
		"1120":"批量导入班级的数据存在错误",
		"1121":"批量导入老师的数据存在错误",
		"1125":"上传的试卷或答题卡的数量和应考人数不一致",
		"1126":"空白试卷未上传",
		"1127":"不是你的试卷包不能修改操作所属人",
		"1128":"还有部分学生的成绩没有得出，无法进行统计",
		"1129":"已经有某些班开始进行考试了，无法再删除",
		"1130":"试卷已经在使用中了，无法再进行修改",
		"1200":"不允许登陆",
		"1201":"学校已处于非正常状态，无法执行增删改类的操作",
		"1202":"学校没有购买任何套餐，无法执行拥有套餐后才能执行的操作",
		"1203":"班级已处于非正常状态，无法执行增删改类的操作",
		"1204":"用户已经处理被设置的状态，无需重复的设置",
		"1220":"用户的状态异常，在解除之前，不可以为其设置关联数据，如作为校长、班主任等",
		"1224":"试卷包不需要重复的通过检测",
		"1225":"试卷文件包状态不正确，无法申请阅卷",
		"1226":"用户没有任何关联的学校",
		"1227":"用户没有任何关联的班级",
		"1228":"班级并未结业，不能创建一个同名的新班",
		"1235":"试卷文件包已经被锁定，不可以对其进行操作",
		"1236":"试卷文件包已经提交，除非管理员打回，否则不可以再对其进行修改或删除的操作",
		"1237":"被修改的文件没有错误标记，无法进行修改",
		"1238":"试卷包中还有错误文件未处理，无法提交",
		"1239":"试卷包没有与班级关联，无法设置人名",
		"1240":"没有标准答案，无法申请阅卷",
		"1241":"没有找到任何有效的学生答卷，无法申请阅卷",
		"1242":"试卷创建时为已阅试卷，不能再申请自动阅了",
		"1243":"本试卷包已经开始阅卷了",
		"1270":"记录已经有人接收了",
		"1271":"你不在所设定的接收者范围之内或无权限查看",
		"1280":"已经被引用了的数据无法删除",
		"1281":"试卷包已经申请了代阅，目前已经进入代阅状态，请打电话给客服进行人工取消",
		"1282":"试卷包已经进入了自动处理流程，不能直接退回，如果一定要取消，请电话给客服进行人工取消",
		"1283":"试卷包并未阅卷完成，还不能进入统计分析阶段",
		"1290":"老师已完成认证，不能再删除其认证数据",
		"1300":"套餐所允许创建的学校数量，已经被用完了",
		"1301":"套餐所允许拥有的学生数量，已经被用完了",
		"1310":"套套只能做为主套餐，不能用于叠加",
	}
	return errorCode[code];
}

//获取年级名字
function getGradeName(levelid){
	var gradeName = "";
	var grades = gradeList();
	var val = parseInt(levelid);
	for(var i = 0; i < grades.length; i++){
		if(val == grades[i].val){
			gradeName = grades[i].text;
			break;
		}
	}
	return gradeName;
}
//获取不含年级的班级名字
function getClassNameNotGrade (str) {
	var regexp = /初一|初二|初三|高一|高二|高三/gi;
	var className = "";
	if(regexp.test(str)){
		className = str.replace(regexp,"");
	}else{
		className = str;
	}
	return className;
}

//不同科目对应不同的图片
function getProjectImg (projectName) {
	var imgName = "language";
	var _projectName = projectName.toString().toLowerCase();
	switch (_projectName){
		case "地理":
			imgName = "geography";
			break;
		case "历史":
			imgName = "history";
			break;
		case "数学":
			imgName = "math";
			break;
		case "语文":
			imgName = "language";
			break;
		case "政治":
			imgName = "political";
			break;
		default:
			break;
	}
	return imgName;
}
//获取题型对应的中文名称
function getSubjectName (subject) {
	var subjectName = "主观题";
	var _subject = subject.toString().toLowerCase();
	switch (_subject){
		case "filling" :
			subjectName = "填空题";
			break;
		case "question" :
			subjectName = "主观题";
			break;
		case "schoice" :
			subjectName = "选择题";
			break;
		default :
			break;
	}
	return subjectName;
}
// 微信浏览器
function is_weixin() { 
    var ua = window.navigator.userAgent.toLowerCase(); 
    if (ua.match(/MicroMessenger/i) == 'micromessenger') { 
        return true;
    } else { 
        $.showTip({
        	content: "请在微信中打开!",
        	success: function(){
	        	$("body").emptyState({
	        		type:"exception",
	        		content:"请在微信浏览器中打开!",
	        		replace:true,
	        		style:{
	        			position: "absolute",
	        			top: "38.2%",
	        			transform: "translate(0,-50%)"
	        		}
	        	});
        	},
        });
        return false;
    } 
}
