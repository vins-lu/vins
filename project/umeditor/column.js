(function(){
    UM.registerUI('column', function( name ){
        var me = this,
        $button = $.eduibutton({
            'icon': 'column',
            'title': me.options.lang === "zh-cn" ? "分栏" : "column",
            'click': function(){
                me.execCommand( name );
            }
        });
        me.addListener( "selectionchange", function () {
            var state = this.queryCommandState( name );
            $button.edui().disabled( state == -1 ).active( state == 1 );
        });
        return $button;
    });
    UM.plugins['column'] = function () {
        UM.commands[ 'column' ] = {
            execCommand: function (cmdName) {
                var str = '<div style="overflow:hidden;"><div style="float:left;width:13%;white-space:normal;height:auto;">在这里输入文字或上传图片</div><div style="display:inline-block;overflow:hidden;">文字信息</div></div>'
                um.execCommand('insertHtml', str);
            },
            queryCommandState: function (cmdName) {
                return 0;
            },
            notNeedUndo: 1
        };
    };
    UM.registerUI('list', function( name ){
        var me = this,
        $button = $.eduibutton({
            'icon': 'list',
            'title': me.options.lang === "zh-cn" ? "对接大学" : "list",
            'click': function(){
                me.execCommand( name );
            }
        });
        me.addListener( "selectionchange", function () {
            var state = this.queryCommandState( name );
            $button.edui().disabled( state == -1 ).active( state == 1 );
        });
        return $button;
    });
    UM.plugins['list'] = function () {
        UM.commands[ 'list' ] = {
            execCommand: function (cmdName) {
                doBlur();
                $("#dockSchoolInput").show();
                $($("#dockSchoolInput").find("input")[0]).focus();
            },
            queryCommandState: function (cmdName) {
                return 0;
            },
            notNeedUndo: 1
        };
    };
    //按钮的操作
    window.insertList = function() {
        var dockSchool = $("#dockSchool").clone(true);
        if($("#city").val().trim().length <= 0){
            alert("请输入所在城市!");
            return;
        }
        dockSchool.find(".dockSchoolArea").html($("#city").val());
        var universityList = $("#universityList").val().split("，");
        if(universityList.length <= 0){
            alert("请输入对接大学!");
            return;
        }
        var universitySpan = $(dockSchool.find(".dockSchoolList").find("span")[0]);
        for(var i=0;i<universityList.length;i++){
            universitySpan.clone(true).html(universityList[i]).appendTo(dockSchool.find(".dockSchoolList"));
        }
        dockSchool.removeClass("hide");
        var listHtml = dockSchool[0].innerHTML;
        um.execCommand('insertHtml', listHtml);
        $("#dockSchoolInput").hide();
        $("#dockSchoolInput").find("input").val("");
    }
    window.doBlur = function(){
        um.blur()
    }
})();
$(document).ready(function(){
    (function(){

        $("<style></style>").html('.hide{display: none;}'+
        '.dockSchool{margin-bottom: 6vw;}'+
        '.dockSchool .dockSchoolArea{border-bottom: 1px solid #dcdcdc;padding-bottom: 1vw;}'+
        '.dockSchool .dockSchoolList{display: flex;flex-flow: row wrap;}'+
        '.dockSchool .dockSchoolList span{margin-top: 2vw;margin-right: 3vw;}').appendTo($("head"));

        $('<div id="dockSchoolInput" style="display:none;background:rgba(0,0,0,0.2);position:fixed;top:15%;left:20%;padding:20px;">'+
        '<p>请输入所在城市：</p>'+
        '<p><input type="text" id="city"></p>'+
        '<p>请输入对接大学：(以，隔开)</p>'+
        '<p><input type="text" id="universityList"></p>'+
        '<div style="overflow:hidden;">'+
        '<button id="submit" style="float:left;">完成</button>'+
        '<button id="cancel" style="float:right;margin-right:20px;">取消</button>'+
        '</div>'+
        '</div>').appendTo($(".edui-dialog-container"));

        $('<div id="dockSchool" class="hide">'+
        '<div class="dockSchool">'+
          '<div class="dockSchoolArea themefont"></div>'+
         '<div class="dockSchoolList"><span class="themefont" ></span></div>'+
        '</div>'+
        '</div>').appendTo($("body"));

        
        $("#submit").click(function(){
            insertList();
        });
        $("#cancel").click(function(){
            $("#dockSchoolInput").hide();
            $("#dockSchoolInput").find("input").val("");
        })

    })();
})