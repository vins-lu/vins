$(document).ready(function() {
    var args = parseQueryArgs();
    var openid = args.openid;
    var uuid = args.uuid;
    var schoolid = args.schoolid;
    var studentid = args.studentid;
    var examHistory = null;
    var project = [];
    
    $("#projectChars").css("width", $(window).width());
    $("#projectChars").css("height", $(window).width() * (60 / 100));
    var chart = echarts.init(document.getElementById('projectChars'));
    var option = {
        title: {
            text: '成绩图'
        },
        tooltip : {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                label: {
                    backgroundColor: '#6a7985'
                }
            }
        },
        legend: {
            data:['班级排名','分数']
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis : [
            {
                type : 'category',
                boundaryGap : false,
                data : [],
            }
        ],
        yAxis : [
            {
                type : 'value'
            }
        ],
        series : [
            {
                name:'班级排名',
                type:'line',
                stack: '成绩',
                label: {
                    normal: {
                        show: true,
                        position: 'top'
                    }
                },
                areaStyle: {normal: {}},
                data:[]
            },
            {
                name:'分数',
                type:'line',
                stack: '成绩',
                label: {
                    normal: {
                        show: true,
                        position: 'top'
                    }
                },
                areaStyle: {normal: {}},
                data:[]
            }
        ]
    };
    chart.setOption(option);


    var api = {
        //获取学生的历次考试成绩
        getStudentHistory: function(params) {
            var ajaxUrl = pageLoader.url + 'stat.studenthistory';
            query("post",ajaxUrl,params.data,params.success,params.fail);
        },
        //获取科目
        getProject: function(params) {
            var ajaxUrl = pageLoader.url + 'system.listclassifies';
            query("post",ajaxUrl,params.data,params.success,params.fail);
        },
    }
    var util = {
        //根据科目id返回科目名称
        getProjectName: function (projectid){
            if(!project || project.length <= 0){
                return "";
            }
            for(var i = 0; i < project.length; i++){
                if(project[i].id == projectid){
                    return project[i].name;
                }
            }
            return "";
        },
        getStudentHistory: function() {
            api.getStudentHistory({
                data:{
                    uuid: uuid,
                    studentid: studentid,
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
                var data = examHistory.map(function(item){
                    if(item.classifyid == classifyid){  
                        return item;
                    }
                });
                if(data.length <= 0 || data[0] == undefined){
                    $("#projectChars").emptyState({
                        type:"nolist",
                        content:"目前没有该科目的考试数据",
                        replace:true,
                    });
                    return;
                }else{
                    $(".emptyState").remove();
                    chart = echarts.init(document.getElementById('projectChars'));
                }
                var xAxisData = data.map(function(item){
                    return item.exam_date;
                });
                var seriesRank = data.map(function(item){
                    return item.class_ranking;
                });
                var seriesScore = data.map(function(item){
                    return item.report.get_scores;
                });
                var charsOption = {
                    xAxis : [
                        {
                            data : xAxisData,
                        }
                    ],
                    series : [
                        {
                            name:'班级排名',
                            type:'line',
                            label: {
                                normal: {
                                    show: true,
                                    position: 'top'
                                }
                            },
                            areaStyle: {normal: {}},
                            data:seriesRank,
                        },
                        {
                            name:'分数',
                            type:'line',
                            stack: '成绩',
                            areaStyle: {normal: {}},
                            data:seriesScore,
                        }
                    ]
                };
                chart.setOption(option);
                chart.setOption(charsOption);
                chart.on('click', function (params) {
                    var dataIndex = params.dataIndex;
                    var examineid = data[dataIndex].examineid;
                    var uploadid = data[dataIndex].uploadid;
                    var hrefArgs = ["openid=",openid,"&uuid=",uuid,"&schoolid=",schoolid,"&studentid=",studentid,"&examineid=",examineid,"&uploadid=",uploadid]
                    window.location.href = "report_student.html?" + hrefArgs.join("");
                });
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
                        $('<div class="more"><img src="./img/more.png" alt=""><span>更多</span></div> ').appendTo(prjectWrap);
                    }
                    var prjectList = $("<div></div>").attr("classifyid",project[j].id).addClass(project[j].eng);
                    var prjectImg = $("<img />").attr("src","./img/" + project[j].eng + ".png");
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
        var classifyid = _this.attr("classifyid");
        if(_this.hasClass("more")){
            _this.removeClass("more").addClass("packup");
            _this.find("img").attr("src","./img/packup.png");
            _this.find("span").text("收起");
            $(".projectSelect").addClass("showmore");
            return;
        }
        if(_this.hasClass("packup")){
            _this.removeClass("packup").addClass("more");
            _this.find("img").attr("src","./img/more.png");
            _this.find("span").text("更多");
            $(".projectSelect").removeClass("showmore");
            return;
        }
        _this.addClass("selected").siblings().removeClass("selected");
        util.analyzeExam(classifyid);
    })
});