const serviceTel = "400-640-8688";
const gradeList = [
  // {
  //   "val": "1",
  //   "text": "小一"
  // },{
  //   "val": "3",
  //   "text": "小二"
  // },{
  //   "val": "5",
  //   "text": "小三"
  // },{
  //   "val": "7",
  //   "text": "小四"
  // },{
  //   "val": "9",
  //   "text": "小五"
  // },{
  //   "val": "11",
  //   "text": "小六"
  // },
  {
    "val": "13",
    "text": "初一"
  },{
    "val": "15",
    "text": "初二"
  },{
    "val": "17",
    "text": "初三"
  },{
    "val": "19",
    "text": "高一"
  },{
    "val": "21",
    "text": "高二"
  },{
    "val": "23",
    "text": "高三"
  },
];
const dutyList = {
  "teacher":"教师",
  "school":"校长",
  "superteacher": "副校长",
  "classmain":"班主任",
  "":"管理员",
  "agent": "代理",
  "region": "大区经理",
  "superschool": "大校长",
  "grademain": "年级组长",
  "offteacher": "内部教师",
  "service": "客服",
  "admin": "系统管理员",
  "super": "超管",
}
const errMsg = {
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
  "not_exists_mobilecode": "不存在的手机验证码",
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
const subjectList = {
  "1": {
    classifyid: 1,
    text: "语文",
    imgName: "Chinese", 
  },
  "2": {
    classifyid: 2,
    text: "数学",
    imgName: "math",
  },
  "3": {
    classifyid: 3,
    text: "数学（理）",
    imgName: "math",
  },
  "4": {
    classifyid: 4,
    text: "数学（文）",
    imgName: "math",
  },
  "5": {
    classifyid: 5,
    text: "政治",
    imgName: "political",
  },
  "6": {
    classifyid: 6,
    text: "历史",
    imgName: "history",
  },
  "7": {
    classifyid: 7,
    text: "地理",
    imgName: "geography",
  },
  "8": {
    classifyid: 8,
    text: "物理",
    imgName: "physics",
  },
  "9": {
    classifyid: 9,
    text: "化学",
    imgName: "chemistry",
  },
  "10": {
    classifyid: 10,
    text: "生物",
    imgName: "biology",
  },
  "11": {
    classifyid: 11,
    text: "英语",
    imgName: "engish",
  },
  "12": {
    classifyid: 12,
    text: "思想品德",
    imgName: "Chinese",
  },
  "13": {
    classifyid: 13,
    text: "理科综合",
    imgName: "mord",
  },
  "14": {
    classifyid: 14,
    text: "文科综合",
    imgName: "arts-integration",
  },
}
const uploadStatus = {
  "created": "等待上传完整试卷",
  "analyze": "分析中",
  "queuing": "排队中",
  "checking": "正在阅卷",
  "stating": "报表生成中",
  "end": "报表已生成",
}
const msgType = {
  "paperuseable": "答题纸生成完毕",
  "paperbacked": "试卷打回",
}

module.exports = {
  gradeList,//年级列表
  errMsg,//错误信息
  dutyList,//职务信息
  subjectList,//科目图片名字
  uploadStatus,//试卷包状态信息列表
  msgType,//消息类型
}