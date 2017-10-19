$(document).ready(function() {
    var args = parseQueryArgs();
    var openid = args.openid;
    var schoolid = args.schoolid;
    var studentid = args.studentid;
    var examHistory = null;
    var project = [];
    var classifyid = null;

    var api = {
        //获取学生的历次考试成绩
        getStudentHistory: function(params) {
            var ajaxUrl = baseUrl + 'stat.studenthistory';
            query({type:"post",loading:false},ajaxUrl,params.data,params.success,params.fail,params.complate);
        },
        //获取科目
        getProject: function(params) {
            var ajaxUrl = baseUrl + 'system.listclassifies';
            query("post",ajaxUrl,params.data,params.success,params.fail,params.complate);
        },
    }
    var util = {
        getStudentHistory: function() {
            api.getStudentHistory({
                data:{
                    openid: openid,
                },
                success: function(res) {
                    examHistory = res.history;
                    $(".projectSelect").find("div:first-child").trigger("touchend");//默认选中第一个
                }
            });
        },
        analyzeExam: function(classifyid) {
            if(examHistory.length <= 0 || examHistory === null){
                $("#chars").emptyState({
                    type:"nolist",
                    content:"目前没有一次考试数据",
                    replace:true,
                });
                return;
            }else{
                var data = examHistory.filter(function(item){
                    return item.classifyid == classifyid;
                });
                if(data.length <= 0 || data[0] == undefined){
                    $(".exams").emptyState({
                        type:"nolist",
                        content:"目前没有该科目的考试数据",
                        replace:true,
                    });
                    return;
                }else{
                    util.initExam(data);
                }
            }
        },
        initExam: function(data){
            var examCon = $(".exams");
            examCon.empty();
            var currentProject = $(".projectSelect .selected").find("span");
            if(data.length > 0){
                for (var i = 0; i < data.length; i++){
                    var examlist = $("<div></div>").addClass("examlist").attr("uploadid",data[i].uploadid).attr("examineid",data[i].examineid);
                    var examTitle = $("<div></div>").addClass("examTitle").text(data[i].title);
                    var examBase = $("<div></div>").addClass("examBase");
                    var project = $("<div></div>").addClass("project").text(currentProject.text());
                    var examTime = $("<div></div>").addClass("examTime").text(data[i].create_time.slice(0,10));
                    examBase.append(project).append(examTime);
                    examlist.append(examTitle).append(examBase).appendTo(examCon);
                }
            }
        }
    }

    api.getProject({
        data:{},
        success: function(res) {
            if(res.rows && res.rows.length > 0){
                util.getStudentHistory();//获取历史考试成绩
                var data = res.rows;
                for(var i = 0;i < data.length; i++){
                    if(data[i].normal == "1"){
                        project.push(data[i]);
                    }
                }
                var prjectWrap = $(".projectSelect");
                for(var j = 0; j < project.length; j++){
                    if(project[j].name == "思想品德"){
                        continue;
                    }
                    //展示七个，第八个为展开
                    if(j == 7){
                        $('<div class="more"><img src="./wxforstudentinitial/img/more.png" alt=""><span>更多</span></div> ').appendTo(prjectWrap);
                    }
                    var prjectList = $("<div></div>").attr("classifyid",project[j].id).addClass(project[j].eng);
                    var prjectImg = $("<img />").attr("src","./wxforstudentinitial/img/" + project[j].eng + ".png");
                    var prjectText = $("<span></span>").text(project[j].name);
                    prjectList.append(prjectImg).append(prjectText);
                    prjectList.appendTo(prjectWrap);
                }
            }else{
                $("body").emptyState({
                    type:"nopermission",
                    content:"数据出错",
                    replace:true,
                    style:{
                        position: "absolute",
                        top: "38.2%",
                        transform: "translate(0,-50%)"
                    }
                });
            }
        }
    });

    $(".projectSelect").on("touchend","div",function(){
        var _this = $(this);
        classifyid = _this.attr("classifyid");
        if(_this.hasClass("more")){
            _this.removeClass("more").addClass("packup");
            _this.find("img").attr("src","./wxforstudentinitial/img/packup.png");
            _this.find("span").text("收起");
            $(".projectSelect").addClass("showmore");
            return;
        }
        if(_this.hasClass("packup")){
            _this.removeClass("packup").addClass("more");
            _this.find("img").attr("src","./wxforstudentinitial/img/more.png");
            _this.find("span").text("更多");
            $(".projectSelect").removeClass("showmore");
            return;
        }
        _this.addClass("selected").siblings().removeClass("selected");
        util.analyzeExam(classifyid);
    });

    $(".exams").on("click",".examlist",function(){
        var uploadid = $(this).attr("uploadid");
        var examineid = $(this).attr("examineid");
        var hrefArgs = ["openid=",openid,"&schoolid=",schoolid,"&uploadid=",uploadid,"&examineid=",examineid,"&classifyid=",classifyid];
        window.location.href = "./wxforstudentinitial/reportexam.html?" + hrefArgs.join("");
    });
});