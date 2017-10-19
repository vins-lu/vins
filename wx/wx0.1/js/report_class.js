$(document).ready(function() {
    var args = parseQueryArgs();
    var openid = args.openid;
    var uuid = args.uuid;
    var schoolid = args.schoolid;
    var studentid = args.studentid;
    var examHistory = null;
    var project = [];
    var classes = localData.get("classes");
    var classmainInfo = [];
    var classifyid = "";
    var classid = "";


    if(classes){
        for(var cm = 0; cm < classes.length ; cm ++){
            // if(typeof classes[cm].is_classmain != undefined && classes[cm].is_classmain == true){
            //     classmainInfo.push(classes[cm]);
            // }
            classmainInfo.push(classes[cm]);
        }
        if(classmainInfo.length > 0){
            classid = classmainInfo[0].classid;
            $(".selectedClass").text(classmainInfo[0].fullname);
            if($("#toggleClassMain").length > 0){
                $("#toggleClassMain").removeSheetAction();
            }
            $.sheetAction({
                id:"toggleClassMain",
                title:"选择班级",
                data:classmainInfo,
                showField:"fullname",
                onSelect:function(ele){
                    var index = $(ele).attr("index");
                    classid = classmainInfo[index].classid;
                    $(".selectedClass").text(classmainInfo[index].fullname);
                    $(ele).addClass("selected").siblings().removeClass("selected");
                    $(".selectedClass").removeClass("rotate");
                    $("#toggleClassMain").hideSheetAction();
                },
                cancel:function(){
                    $(".selectedClass").removeClass("rotate");
                    $("#toggleClassMain").hideSheetAction();
                }
            });
            $(".selectedClass").click(function(){
                if($("#toggleClassMain").length > 0){
                    $(this).addClass("rotate");
                    $("#toggleClassMain").showSheetAction();
                }else{
                    $.toast({
                        type:"tip",
                        text:"没有相关数据"
                    });
                }
            });
        }else{
            $.showTip("您不是班主任",function(){
                window.history.back();
            });
            return;
        }
    }else{
        window.history.back();
        return;
    }
    
    var api = {
        //获取班级的历次考试成绩
        getClassHistory: function(params) {
            var ajaxUrl = pageLoader.url + 'stat.classhistory';
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
        getClassHistory: function() {
            api.getClassHistory({
                data:{
                    uuid: uuid,
                    classid: classid,
                    classifyid: classifyid,
                },
                success: function(res){
                    var data = [];
                    if(res.ok){
                        data = res.rows;
                    }
                    var optionData = {
                        title: util.getProjectName(classifyid) + "历次考试平均分曲线图",
                        subtext:"",
                        dimensions: data.map(function(item){return item.title;}),
                        xData: data.map(function(item){return item.date;}),
                        data: data.map(function(item){return item.avg;}),
                        totalscores : data.map(function(item){return item.totalscores;}),
                    }
                    // if(optionData.xData.length < 4){                      
                    //     for(var i=0;i<4;i++){
                    //         if(!optionData.xData[i]){
                    //             optionData.xData[i] = "";
                    //         }
                    //     }
                    // }
                    util.initChart(optionData);
                },
                fail: function(res){
                    $("#lineChart").emptyState({
                        type:"nolist",
                        content:"目前没有一次考试数据",
                        replace:true,
                    });
                    return;
                }
            });
        },
        //初始化折现图及表格
        initChart: function(optionData) {
            $("#lineChart").css("width", $(window).width());
            $("#lineChart").css("height", $(window).width() * (60 / 100));
            var lineChart = $("#lineChart")[0];
            myChart = echarts.init(lineChart);
            var option = {
                textStyle: {
                    color: '#000',
                },
                title: {
                    text: (optionData.title != undefined) ? optionData.title : "历次考试平均分分布",
                    subtext: (optionData.subtext != undefined) ? optionData.subtext : '',
                    padding: 10,
                    x: 'center',
                    y: 'top',
                    textStyle: {
                        fontSize: 22,
                    },
                    subtextStyle: {
                        color: '#000',
                        fontSize: 18,
                    },
                },
                grid: {
                    left: '5%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                tooltip:{
                    trigger: 'item',
                },
                xAxis: {
                    type: 'category',
                    //nameLocation:'start',
                    boundaryGap: true,
                    data: optionData.xData 
                },
                yAxis: {
                    type: 'value',
                    min:0,
                    max : optionData.totalscores[0],//试卷总分
                },
                series: [{
                    type: 'line',
                    symbol: "circle",
                    symbolSize: 24,
                    label: {
                        normal: {
                            show: true,
                            formatter: `{c}`,
                            offset: [0, 24],
                            textStyle: {
                                color: "#ffffff",
                                fontSize: 12,
                            }
                        }
                    },
                    itemStyle: {
                        normal: {
                            color: '#7CC4A2',
                        }
                    },
                    lineStyle: {
                        normal: {
                            color: '#7CC4A2',
                            width: 4,
                        }
                    },
                    tooltip:{
                        formatter: function (params) {
                            return optionData.dimensions[params.dataIndex]+"<br/>平均分："+optionData.data[params.dataIndex];
                        },
                    },
                    dimensions: optionData.dimensions,
                    data: optionData.data,
                }],
            }
            myChart.setOption(option, true);
        }
    }

    api.getProject({
        data:{},
        success: function(res) {
            if(res.rows && res.rows.length > 0){
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

                $(".projectSelect").find("div:first-child").trigger("touchend");//默认选中第一个
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
        util.getClassHistory();//获取历史考试成绩
    })
});