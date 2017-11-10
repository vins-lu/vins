
angular.module('app.upload',[])
  .controller('uploadCtrl',['$scope','$rootScope','$ionicActionSheet','ModalService','$state','$http',function ($scope,$rootScope,$ionicActionSheet,ModalService,$state,$http) {
    ModalService.initModal($scope, 'photo','down');
    ModalService.initModal($scope, 'picasaTool','down');

    $scope.file = {
      files:[],
    }

    $scope.tool = {isShow:true,title:'相册管理',rightText:'选择',show:function(){console.log(1);}};

    $scope.curretEditor = 'blankpaper';
    $scope.imgSelectedCount = 0;

    $scope.img = {
      blankpaper:[],
      studentpapers:[],
      machinecard:[],
      studentanswers:[],
      standardanswer:[]
    }
    $scope.newImg = {
      blankpaper:[],
      studentpapers:[],
      machinecard:[],
      studentanswers:[],
      standardanswer:[],
    }
    $scope.imgState = {
      blankpaper:[],
      blankpaperCount:0,
      studentpapers:[],
      studentpapersCount:0,
      machinecard:[],
      machinecardCount:0,
      studentanswers:[],
      studentanswersCount:0,
      standardanswer:[],
      standardanswerCount:0
    }

    // $scope.uploadState = {
    //   blankpaper:true,
    //   studentpapers:true,
    //   machinecard:true,
    //   studentanswers:true,
    //   standardanswer:true,
    // }

    // $scope.$watch('img[curretEditor]',function(newValue,oldValue){
    //   if(newValue.length > 0){
    //     $scope.uploadState[$scope.curretEditor] = false;
    //   }else if(newValue.length == 0){
    //     $scope.uploadState[$scope.curretEditor] = true;
    //   }
      
    // },true);

    $scope.$watch('imgState[curretEditor]',function(newValue,oldValue){
      var count = newValue.filter(function(img){
        return img.checked === true;
      })
      $scope.imgState[$scope.curretEditor+"Count"] = count.length;
    },true);

    $scope.show = function (args) {
      $scope[args].show();
    };
    $scope.close = function (args) {
      $scope[args].hide();
    };

    $scope.ud = {
      upload: function () {
        $rootScope.udr.showConfirm('您确认是否上传?<br>上传后无法修改项目', '确认上传', function (res) {
          //上传
          //LODING...
          $rootScope.udr.udDefaultShow();
          if(res){
            var files = $scope.img[$scope.curretEditor];
            var formData = new FormData();
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
                //LODINGHide...
                $rootScope.udr.udHide();
                $scope.img[$scope.curretEditor] = [];
                var _this = $scope;
                $rootScope.udr.showConfirm('文件上传成功，是否继续上传', '', function (res) {
                  _this.close('picasaTool');
                  if(res){
                    _this.show('photo');
                  }
                });
              }
              $scope.ud.goTo();
            }).fail(function(res) {
              $rootScope.udr.showConfirm('文件上传失败，请重新上传', '');
            });
            // $http.post(ajaxUrl,formData).then(function(jsonData){
            //   console.log(jsonData);
            // });
          }
        })
      },
      goTo:function () {
        $state.go('home.unfinishedExam',{},{reload: true});
      },
      // stateRelate:function(newarr,oldarr){
      //   newarr = [];
      //   if(!oldarr.length){
      //     return ;
      //   }
      //   for(var i=0;i<oldarr.length;i++){
      //     var checkable = oldarr[i].status ? true : false;
      //     newarr.push({
      //       index:i,
      //       checkable:checkable,
      //       checked:true,
      //       status:oldarr[i].status,
      //       uploadState:false,
      //       url:oldarr[i].url
      //     });
      //   }
      //   return newarr;
      // },
      complatePhoto:function(){
        //图片已经拍好
        $scope.show('picasaTool');
        $scope.close('photo');
        // $scope.img[$scope.curretEditor].push($scope.file.files);
        $scope.ud.readAsDataURL($scope.file.files);
        $scope.file.files = [];
        $rootScope.initPhotoSwipeFromDOM('.photoList');
      },
      managePhoto:function(type){
        $scope.show('picasaTool');
        $scope.curretEditor = type;
        $rootScope.initPhotoSwipeFromDOM('.photoList');
      },
      showPhoto:function(type){
        $scope.show('photo');
        $scope.curretEditor = type;
      },
      closePhoto:function(){
        $scope.close('photo');
        history.back();
      },
      checkFile:function(selectedfile){
        //检查图片,符合的放进本地变量中，待编辑状态
        console.log(/\/(jpg|jpeg|png)$/gi.test(selectedfile.type));
        if(!/\/(jpg|jpeg|png)$/gi.test(selectedfile.type)){
          $rootScope.udr.showAlert("图片类型必须是jpeg,jpg,png中的一种!");
          return false;
        }else{
          $scope.file.files.push(selectedfile);
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
          console.log(fileList);
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
            var originalImg = $scope.img[$scope.curretEditor];
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
              originalImg.splice(selectIndex[i],1);
              curretImgList.splice(selectIndex[i],1);
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
              $scope.imgState[$scope.curretEditor].push({index:parseInt(index + originalLength),checkable:true,checked:true,status:true,uploadState:true,url:e.target.result});
              console.log(originalLength,$scope.imgState[$scope.curretEditor].length)
              if(originalLength + files.length == $scope.imgState[$scope.curretEditor].length){
                $rootScope.udr.udHide();
              }
            }  
          })(files[i],i);
        }
      },
    }

    $.Uploading = function(){
        var defaults = null, callback;
        var methods = {};
        //var callbackArray = [];
        defaults = $.extend({
          maxlength : 5,
          uuid : null,
          uploadid : 0,
          files : null,
          fileid:null,
          type : "",
          start : 0,
          returnfull:1,
        }, arguments[0] || {});

        if(typeof arguments[1] == "function")
          callback = arguments[1];

        function uploading() {
          onLoad(defaults.start);
        };

        function onLoad(start){
          var returnArray = new Array();
          var reallength = defaults.files.length > defaults.maxlength ? defaults.maxlength : defaults.files.length;//每个包要上传的文件数量
          var formData = new FormData();
          formData.append("uuid",defaults.uuid);
            formData.append("uploadid",defaults.uploadid);
            formData.append("type",defaults.type);
            formData.append("platform",pageLoader.platform);
            if(defaults.fileid)
              formData.append("fileid",defaults.fileid);
            //判断是否为最后一次请求，如果请求，则返回所有
            if((start + reallength) >= defaults.files.length && defaults.returnfull == 1)
              formData.append("returnfull",1);
            else
              formData.append("returnfull",0);

          for(var i = start ; i < start + reallength ; i++){
            formData.append("file"+i,defaults.files[i]);
          }
          var ajaxUrl  = pageLoader.url+'upload.uploadfile';
            query('post',ajaxUrl,formData,function(jsonData){
              var s = ((start+reallength) > defaults.files.length ? defaults.files.length : (start+reallength));
              setProgress(parseInt(s/defaults.files.length * 100));
              for(var i = 0 ; i < jsonData.files.length; i++)
              {
                returnArray.push(jsonData.files[i]);
              }
              if(s < defaults.files.length) {
                onLoad(s);
              }
              else{
                //上传完毕
                if(callback && defaults.returnfull == 1)
                callback(jsonData.files);
              else if(callback && defaults.returnfull == 0)
                callback(returnArray);
              }
            },null,false,false);
        }

        uploading();  

      }

  }]);
