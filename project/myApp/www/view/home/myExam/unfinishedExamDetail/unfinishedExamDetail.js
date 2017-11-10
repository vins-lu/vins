angular.module('app.unfinishedExamDetail', [])
  .controller('unfinishedExamDetailCtrl', ['$scope','$rootScope','$ionicActionSheet', 'ModalService', '$state', '$stateParams', '$http', '$ionicPopup', function ($scope, $rootScope,$ionicActionSheet, ModalService, $state, $stateParams, $http, $ionicPopup) {

    ModalService.initModal($scope, 'photo', 'down');
    ModalService.initModal($scope, 'picasaTool', 'down');
    window.onpopstate = function(){
      console.log(location,history.state);
      if(window.location.hash.indexOf("#/unfinishedExam") != -1){
        if(history.state == null){
          $scope.close('picasaTool');
          $scope.close('photo');
        }else{
          // $scope.close('picasaTool');
          // $scope.close('photo');
          // history.back();
        }
        $scope.ud.getuploaddetail();
      }
    }
    var This = $scope;
    $("body").on("click",".imgStateIcon.reuploadIcon",function(){
      $rootScope.udr.showConfirm('这张图片是不合法的', '是否重新上传', function (res) {
        //重新上传错误图片
        if(res){
          This.show("photo");
          window.history.replaceState({"page":"photo"},"");
          $scope.reuploadState = true;
          console.log(1);
        }
      });
    });

    $scope.curretEditor = 'blankpaper';
    $scope.imgSelectedCount = 0;
    $scope.reuploadState = false;//有错误图片，需要创重新上传
    $scope.tool = {isShow:true,title:'相册管理',rightText:'选择',show:function(){console.log(1);}};
    $scope.file = {
      files:[],
    }
    $scope.img = {
      blankpaper:[],
      studentpapers:[],
      machinecard:[],
      usercard:[],
      stdanswer:[],
    }
    $scope.newImg = {
      blankpaper:[],
      studentpapers:[],
      machinecard:[],
      usercard:[],
      stdanswer:[],
    }

    $scope.imgState = {
      blankpaper:[],
      blankpaperCount:0,
      studentpapers:[],
      studentpapersCount:0,
      machinecard:[],
      machinecardCount:0,
      usercard:[],
      usercardCount:0,
      stdanswer:[],
      stdanswerCount:0
    }
    $scope.reuploadImg = {}

    $scope.uploadLimit = {
      blankpaperMaxLength:6,//空白试卷最多不超过6页，最少1页
      blankpaperMinLength:1,
      stdanswerMaxLength:4,//标准答案最多不能超过4页!,最少1页
      stdanswerMinLength:1,

      //附加说明
      //学生答卷数量应是学生数量的1倍、2倍、4倍或者6倍
      //机读卡数量应与学生数量一致
      //答题纸数量应是学生数量的整倍数
    }

    // $scope.$watch('imgState[curretEditor]',function(newValue,oldValue){
    //   var count = newValue.filter(function(img){
    //     return img.checked === true;
    //   })
    //   $scope.imgState[$scope.curretEditor+"Count"] = count.length;
    // },true);
    //LODING...
    // $rootScope.udr.udDefaultShow();
    // var ajaxUrl = $rootScope.url + '/upload.uploaddetail';
    // $stateParams.uuid = localData.get('uuid');
    // query('post', ajaxUrl, $stateParams, function (jsonData) {
    //   if (!jsonData.ok) {
    //     $rootScope.udr.showAlert('请重试', '错误');
    //     return;
    //   }
    //   console.log(jsonData);
    //   $scope.uploadDataDetail = jsonData.detail;
    //   $scope.uploadDataDetail.classifyid = String($scope.uploadDataDetail.classifyid);
    //   $scope.uploadDataDetail.grade_levelid = String($scope.uploadDataDetail.grade_levelid);
    //   $scope.img['blankpaper'] = JSON.parse(jsonData.detail.blank_paper)?JSON.parse(jsonData.detail.blank_paper):[];
    //   $scope.imgState['blankpaper'] = $scope.ud.stateRelate($scope.imgState['blankpaper'],$scope.img['blankpaper']);
    //   $scope.img['studentpapers'] = JSON.parse(jsonData.detail.student_papers)?JSON.parse(jsonData.detail.student_papers):[];
    //   $scope.imgState['studentpapers'] = $scope.ud.stateRelate($scope.imgState['studentpapers'],$scope.img['studentpapers']);
    //   $scope.img['machinecard'] = JSON.parse(jsonData.detail.machine_card)?JSON.parse(jsonData.detail.machine_card):[];
    //   $scope.imgState['machinecard'] = $scope.ud.stateRelate($scope.imgState['machinecard'],$scope.img['machinecard']);
    //   $scope.img['usercard'] = JSON.parse(jsonData.detail.user_card)?JSON.parse(jsonData.detail.user_card):[];
    //   $scope.imgState['usercard'] = $scope.ud.stateRelate($scope.imgState['usercard'],$scope.img['usercard']);
    //   $scope.img['stdanswer'] = JSON.parse(jsonData.detail.standard_answer)?JSON.parse(jsonData.detail.standard_answer):[];
    //   $scope.imgState['stdanswer'] = $scope.ud.stateRelate($scope.imgState['stdanswer'],$scope.img['stdanswer']);

    //   $rootScope.udr.udHide();
    // });

    $scope.show = function (args) {
      $scope[args].show();
    };
    $scope.close = function (args) {
      $scope[args].hide();
    };

    $scope.ud = {
      getuploaddetail:function(){
        var ajaxUrl = $rootScope.url + '/upload.uploaddetail';
        $stateParams.uuid = localData.get('uuid');
        query('post', ajaxUrl, $stateParams, function (jsonData) {
          if (!jsonData.ok) {
            $rootScope.udr.showAlert('请重试', '错误');
            return;
          }
          console.log(jsonData);
          $scope.uploadDataDetail = jsonData.detail;
          $scope.uploadDataDetail.classifyid = String($scope.uploadDataDetail.classifyid);
          $scope.uploadDataDetail.grade_levelid = String($scope.uploadDataDetail.grade_levelid);
          $scope.img['blankpaper'] = JSON.parse(jsonData.detail.blank_paper)?JSON.parse(jsonData.detail.blank_paper):[];
          $scope.imgState['blankpaper'] = $scope.ud.stateRelate($scope.imgState['blankpaper'],$scope.img['blankpaper']);
          $scope.img['studentpapers'] = JSON.parse(jsonData.detail.student_papers)?JSON.parse(jsonData.detail.student_papers):[];
          $scope.imgState['studentpapers'] = $scope.ud.stateRelate($scope.imgState['studentpapers'],$scope.img['studentpapers']);
          $scope.img['machinecard'] = JSON.parse(jsonData.detail.machine_card)?JSON.parse(jsonData.detail.machine_card):[];
          $scope.imgState['machinecard'] = $scope.ud.stateRelate($scope.imgState['machinecard'],$scope.img['machinecard']);
          $scope.img['usercard'] = JSON.parse(jsonData.detail.user_card)?JSON.parse(jsonData.detail.user_card):[];
          $scope.imgState['usercard'] = $scope.ud.stateRelate($scope.imgState['usercard'],$scope.img['usercard']);
          $scope.img['stdanswer'] = JSON.parse(jsonData.detail.standard_answer)?JSON.parse(jsonData.detail.standard_answer):[];
          $scope.imgState['stdanswer'] = $scope.ud.stateRelate($scope.imgState['stdanswer'],$scope.img['stdanswer']);
          $scope.newImg = {
            blankpaper:[],
            studentpapers:[],
            machinecard:[],
            usercard:[],
            stdanswer:[],
          }
          $rootScope.udr.udHide();
        });
      },
      upload: function (reupload) {
        $rootScope.udr.showConfirm('您确认是否上传?<br>上传后无法修改项目', '确认上传', function (res) {
          //上传
          if(res){
            var formData = new FormData();
            if(reupload === true){
              var files = $scope.reuploadImg;
              formData.append("fileid",1);
            }else{
              files = $scope.newImg[$scope.curretEditor];
            }
            formData.append("file",files);
            formData.append("uuid",localData.get('uuid'));
            formData.append("uploadid",$stateParams.uploadid);
            formData.append("type",$scope.curretEditor);
            formData.append("platform",'client');
            if(files.length > 0){
              for(var i=0 ;i<files.length;i++){
                formData.append("file"+ i,files[i]);
              }
            }
            var ajaxUrl = $rootScope.url + '/upload.uploadfile';
            $.ajax({
                url: ajaxUrl,
                type: 'POST',
                cache: false,
                data: formData,
                processData: false,
                contentType: false
            }).done(function(res) {
              console.log(res);
              if(res.ok){
                $scope.img[$scope.curretEditor] = [];
                var _this = $scope;
                $rootScope.udr.showConfirm('文件上传成功，是否继续上传', '继续上传', function (res) {
                  _this.close('picasaTool');
                  $scope.ud.getuploaddetail();
                  //$state.reload();
                  if(res){
                    _this.show('photo');
                    window.history.replaceState({"page":"photo"},"");
                  }else{
                    history.back();
                  }
                });
              }
              // $scope.ud.goTo();
            }).fail(function(res) {
              $rootScope.udr.showConfirm('文件上传失败，请重新上传', '失败');
            });
            // $http.post(ajaxUrl,formData).then(function(jsonData){
            //   console.log(jsonData);
            // });
          }
        })
      },
      reupload: function(index) {
        $rootScope.udr.showConfirm('问价错误', '重新上传', function (res) {
          if(res){
            console.log(1);
            return;
          }
        })
      },
      checkUpload:function(){
        var state = true;
        if($scope.img["usercard"].length % $scope.uploadDataDetail.exam_students != 0){
          state = false;
          $rootScope.udr.showConfirm('您上传的试卷数量与应考人数不符，请检查后重现上传！', '提示');
        }
        if($scope.img["blankpaper"].length < $scope.uploadLimit.blankpaperMinLength){
          state = false;
          $rootScope.udr.showConfirm('空白试卷不应为空，请检查后重现上传！', '提示');
        }else if($scope.img["blankpaper"].length > $scope.uploadLimit.blankpaperMaxLength){
          state = false;
          $rootScope.udr.showConfirm('空白试卷不应超过'+ $scope.uploadLimit.blankpaperMaxLength +'页，请检查后重现上传！', '提示');
        }
        if($scope.hadread){
          if($scope.img["stdanswer"].length < $scope.uploadLimit.stdanswerMinLength){
            state = false;
            $rootScope.udr.showConfirm('标准答案不应为空，请检查后重现上传！', '提示');
          }else if($scope.img["stdanswer"].length > $scope.uploadLimit.stdanswerMaxLength){
            state = false;
            $rootScope.udr.showConfirm('标准答案不应超过'+ $scope.uploadLimit.stdanswerMaxLength +'页，请检查后重现上传！', '提示');
          }
        }
        return state;
      },
      complete: function() {
        var _this = $scope;
        if(!$scope.ud.checkUpload()){
          return;
        }
        $rootScope.udr.showConfirm('您确认是否上传?<br>上传后无法修改项目', '确认上传', function (res) {
          //全部提交
          if(res){
              var alreadymark = _this.hadread ? 1 : 0;
              var ajaxUrl  = $rootScope.url + '/upload.setupload';
              var ajaxParam = {
                  uuid:localData.get('uuid'),
                  uploadid:$stateParams.uploadid,
                  hadread :alreadymark
              };
              query('post',ajaxUrl,ajaxParam,function(jsonData){
                if(jsonData.ok){
                  var ajaxUrl  = $rootScope.url + '/upload.requestcheck';
                  var ajaxParam = {
                      uuid:localData.get('uuid'),
                      uploadid:$stateParams.uploadid,
                  };
                  query('post',ajaxUrl,ajaxParam,function(jsonData){
                    console.log(_this.hadread);
                    if(parseInt(_this.hadread) == 0){
                      $rootScope.udr.showConfirm('您上传的试卷为未阅试卷，是否申请使用系统自动阅卷功能?', '自动阅卷',function(res){
                        if(res){
                          var ajaxUrl  = $rootScope.url + '/upload.requestcheck';
                          var ajaxParam = {
                              uuid:localData.get('uuid'),
                              uploadid:$stateParams.uploadid,
                              mancheck:1,
                          };
                          query('post',ajaxUrl,ajaxParam,function(jsonData){
                            $rootScope.udr.showAlert("您已成功申请使用系统自动阅卷功能，请待心等待结果！",function(){
                              _this.ud.goTo();
                            })
                            // $.showTip("您已成功申请使用系统自动阅卷功能，请待心等待结果！",function(){
                            //   // isContinue();
                            //   _this.ud.goTo();
                            // });
                          });
                        }else{
                          $scope.ud.goTo();
                        }
                      });
                    }
                    else{
                      // isContinue();
                      $scope.ud.goTo();
                    }
                  });
                }
              });
          }
        });
      },
      stateRelate:function(newarr,oldarr){
        newarr = [];
        if(!oldarr.length){
          return [];
        }
        for(var i=0;i<oldarr.length;i++){
          var checkable = oldarr[i].status ? true : false;
          newarr.push({
            index:i,
            checkable:false,
            checked:false,
            status:oldarr[i].status,
            uploadState:false,
            url:oldarr[i].url,
            error:oldarr[i].error ? oldarr[i].error : false,
          });
        }
        return newarr;
      },
      vinsout:0,
      getErrorImgCount:function (type){
        //返回指定类型文件的错误图片数量
        if(type == undefined){
          type = $scope.curretEditor;
        }
        var waitCheckFile = $scope.imgState[type];
        console.log(waitCheckFile);
        $scope.ud.vinsout ++;
        console.log($scope.ud.vinsout);
        var errCount = 0;
        if(waitCheckFile && waitCheckFile.length > 0){
          for(var i=0;i<waitCheckFile.length;i++){
            if(waitCheckFile[i].error){
              errCount ++;
            }
          }
        }
        return errCount;
      },
      complatePhoto:function(){
        //图片已经拍好
        $scope.show('picasaTool');
        $scope.close('photo');
        window.history.replaceState({"page":"picasaTool"},"");
        if($scope.reuploadState){
          $scope.ud.upload(true);
        }else{
          //LODING...
          $rootScope.udr.udDefaultShow();
          $scope.ud.readAsDataURL($scope.file.files);
          $scope.file.files = [];
        }
        //$scope.ud.checkFile($scope.file.files);
        $rootScope.initPhotoSwipeFromDOM('.photoList');
      },
      managePhoto:function(type){
        if(type == undefined){
          type = $scope.curretEditor;
        }
        $scope['picasaTool'].show();
        $scope.curretEditor = type;
        window.history.pushState({"page":"picasaTool"},"");
        $rootScope.initPhotoSwipeFromDOM('.photoList');
      },
      showPhoto:function(type){
        if(type == undefined){
          type = $scope.curretEditor;
        }
        //打开拍照页
        $scope.show('photo');
        $scope.curretEditor = type;
        // console.log($location);
        // $location.hash("page");
        window.history.pushState({"page":"photo"},"");
      },
      closePhoto:function(){
        $scope.close('photo');
        history.back();
      },
      closePicasatool:function(){
        This.close('picasaTool');
        history.back();
      },
      goTo: function () {
        $state.go('home.unfinishedExam', {}, {reload: true});
      },
      checkFile:function(selectedfile){
        //检查图片,符合的放进本地变量中，待编辑状态
        if(!/\/(jpg|jpeg|png)$/gi.test(selectedfile.type)){
          $rootScope.udr.showAlert("图片类型必须是jpeg,jpg,png中的一种!");
          return false;
        }else{
          if(!$scope.reuploadState){
            $scope.file.files.push(selectedfile);
          }else{
            // $scope.reuploadImg.push(selectedfile);
          }
          
          // $scope.img[$scope.curretEditor].push(selectedfile);
          // $scope.img[$scope.curretEditor].push({img:1,checked:true});
        }
      },
      select:function () {
        if($scope.tool.rightText == '选择'){
          // for(var i=0;i<$scope.imgData.length;i++){
          //   $scope.imgData[i].checked = true;
          // }
          $scope.tool = {isShow:false,title:'选择项目',rightText:'取消'};
          $('#foot').slideDown();
        }else{
          $scope.tool = {isShow:true,title:'相册管理',rightText:'选择'};
          $('#foot').slideUp();
        }
      },
      selectImg:function($event){
        //选择图片,然后检查图片类型
        $event.target.onchange = function(){
          var fileList = this.files;
          for(var i =0;i<fileList.length;i++){
            //$scope.ud.readAsDataURL(fileList[i]);
            $scope.ud.checkFile(fileList[i]);
          }
        };
      },
      del:function () {
        $scope.tool.title = '删除'+$scope.imgState[$scope.curretEditor+"Count"]+'张照片';
        var hideSheet = $ionicActionSheet.show({
          destructiveText: '删除'+$scope.imgState[$scope.curretEditor+"Count"]+'张照片',
          cancelText: '取消',
          cancel: function() {
            $('#foot').slideToggle();
            $scope.tool = {isShow:true,title:'相册管理',rightText:'选择'};
          },
          destructiveButtonClicked:function () {
            var curretImgList = $scope.imgState[$scope.curretEditor];
            var newImgList = $scope.newImg[$scope.curretEditor];
            var originalLength = $scope.img[$scope.curretEditor].length;
            var selectIndex = [];
            for(var i=0;i<curretImgList.length;i++){
              if(curretImgList[i].checked){
                selectIndex.push(i);
                // originalImg.splice(originalImg[index],1);
                // curretImgList.splice(i,1);
              }
            }
            selectIndex.sort(function(a,b){return b-a;});
            for(var i=0;i<selectIndex.length;i++){
              newImgList.splice(selectIndex[i] - originalLength ,1);
              curretImgList.splice(selectIndex[i] ,1);
            }
            // $scope.imgState[$scope.curretEditor] = $scope.ud.stateRelate(curretImgList,originalImg);
            hideSheet();
          }
        });
      },
      readAsDataURL:function(files){ 
        var originalLength = $scope.img[$scope.curretEditor].length;
        for(var i=0;i<files.length;i++){
          $scope.newImg[$scope.curretEditor].push(files[i]);
          (function(file,index){
            var reader = new FileReader();  
            //将文件以Data URL形式读入页面  
            reader.readAsDataURL(file);  
            reader.onload=function(e){  
              $scope.imgState[$scope.curretEditor].push({index:parseInt(index + originalLength),checkable:true,checked:true,status:"waitUpload",uploadState:true,url:e.target.result});
              console.log(originalLength,$scope.imgState[$scope.curretEditor].length)
              if(originalLength + files.length == $scope.imgState[$scope.curretEditor].length){
                $rootScope.udr.udHide();
              }
            }  
          })(files[i],i);
        }
      }
    };

    // LODING...
    $rootScope.udr.udDefaultShow();
    $scope.ud.getuploaddetail();

  }]);





