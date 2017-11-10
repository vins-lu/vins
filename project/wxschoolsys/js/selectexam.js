$(document).ready(function() {
    var args = parseQueryArgs();
    var openid = args.openid;
    var uuid = args.uuid;
    var schoolid = args.schoolid;
    var examHistory = null;
    var project = [];
    var classifyid = args.projectid;
    var classid = args.classid;
    
    var api = {
        //获取班级的历次考试成绩
        getClassHistory: function(params) {
            var ajaxUrl = baseUrl + 'upload.listfiles';
            query({type:"post",loading:true},ajaxUrl,params.data,params.success,params.fail);
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
                    schoolid: schoolid,
                    begintime:'current',
                },
                success: function(res){
                    var data = [];
                    var exam_con = $(".exam_con");
                    if(res.rows && res.rows.length > 0){
                        data = res.rows;
                        exam_con.empty();
                        if(data.length > 0){
                        	for(var i = 0; i < data.length; i++){
                        		var examlist = $('<div></div>').addClass("examlist").attr("uploadid",data[i].uploadid).text(data[i].create_time.slice(0,10) + data[i].title);
                        		exam_con.append(examlist);
                        	}
                        }
                    }else{
                        exam_con.emptyState({
                            type:"nolist",
                            content:"这里没有已参加的考试",
                        });
                    }
                }
            });
        },
    }
    util.getClassHistory();

    $(".exam_con").on("click",".examlist",function(){
		var uploadid = $(this).attr("uploadid");
		var hrefArgs = ["openid=",openid,"&uuid=",uuid,"&schoolid=",schoolid,"&classid=",classid,"&classifyid=",classifyid,"&uploadid=",uploadid];
		window.location.href = "reportexam.html?" + hrefArgs.join("");
	});
    $(".backBtn").click(function(){
		window.history.back();
	});
});