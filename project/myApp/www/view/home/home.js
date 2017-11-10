angular.module('app.home', [])
  .controller('homeCtrl', ['$scope', '$rootScope', 'ModalService', '$ionicPopup', '$http', '$ionicSideMenuDelegate', '$ionicSlideBoxDelegate', function ($scope, $rootScope, ModalService, $ionicPopup, $http, $ionicSideMenuDelegate, $ionicSlideBoxDelegate) {
    if(!localData.get('uuid')){
      location.href = "./login";
    }

    $scope.userInfo = localData.get('userInfo');
    $scope.loginData = localData.get('username');
    $scope.schools = localData.get('schools');

    window.onpopstate = function(){
      if(location.hash == "#/home/unfinishedExam"){
        $scope.ud.index =0;
      }else if(location.hash == "#/home/completeExam"){
        $scope.ud.index =1;
      }
    }
    $rootScope.$on('$ionicView.loaded', function (element, data) {
      if (data.stateName == 'home.unfinishedExam') {
        $scope.doRefreshUnfinished();
      }
    });

    //更改姓名
    $scope.otherName = {};
    //更改密码
    $scope.updatePw = {};

    $scope.ud = {
      inputEmpty: function (str) {
        $scope.updatePw[str] = '';
      },
      //index
      index: 0,
      //当前用户身份信息
      account:$scope.schools[0],
      //退出登录
      logOut: function () {
        $rootScope.udr.showConfirm('您是否确认退出登录', '', function (res) {
          if(res){
            localData.remove('userInfo');
            $ionicSideMenuDelegate.toggleLeft();
            location.href = '#/loginOther';
          }
        })
      },
      logOutModel: function () {
        $rootScope.udr.showConfirm('您是否确认退出登录', '', function (res) {
          if(res){
            localData.remove('uuid');
            localData.remove('userInfo');
            localData.remove('username');
            localData.remove('classes');
            localData.remove('schools');
            $scope.close('account');
            $ionicSideMenuDelegate.toggleLeft();
            location.href = '#/loginOther';
          }
        });
      },
      //保存姓名
      saveName: function () {
        if (!$scope.otherName.name) {
          $rootScope.udr.udShow('请您输入要修改名字');
          return;
        }
          var ajaxUrl = $rootScope.url + '/users.setuser';
          var ajaxParam = {
            uuid: localData.get('uuid'),
            name: $scope.otherName.name
          };
          query('post', ajaxUrl, ajaxParam, function (jsonData) {
            if (!jsonData.ok) {
              $rootScope.udr.udShow(errMsg(jsonData['lang']));
              return;
            }
            var ajax = $rootScope.url + '/users.managerlogin';
            query('post', ajax, $scope.loginData, function (jsonData) {
              console.log(jsonData);
              if (!jsonData.ok) {
                $rootScope.udr.udShow(errMsg(jsonData['lang']));
                return;
              }
              $rootScope.udr.showAlert('修改成功', '', function () {
                $scope.userInfo = jsonData['userinfo'];
                $scope.close('editName');
                $scope.close('account');
              })
            })
          });

      },
      //修改密码
      confirm: function () {
        if (!$scope.updatePw.newpass || !$scope.updatePw.oldpass) {
          $rootScope.udr.udShow('请输入新的密码');
          return;
        }
        if ($scope.updatePw.newpass != $scope.updatePw.newpass2) {
          $rootScope.udr.udShow('两次密码输入的不一致');
          return;
        }
        delete $scope.updatePw.newpass2;
        var ajaxUrl = $rootScope.url + '/users.setpassword';
        $scope.updatePw.uuid = localData.get('uuid');
        // query('post',ajaxUrl,$scope.updatePw,function (jsonData) {
        //   if(jsonData.ok){
        //     $rootScope.udr.showAlert('修改成功','',function () {
        //       $ionicSideMenuDelegate.toggleLeft();
        //       $scope.close('changepw');
        //       $scope.close('account');
        //     });
        //   }else{
        //     $rootScope.udr.udShow(errMsg(jsonData['lang']));
        //   }
        // });
        $http.post(ajaxUrl, $scope.updatePw)
          .then(function (res) {
            if (res.data.ok) {
              $rootScope.udr.showAlert('修改成功', '', function () {
                $ionicSideMenuDelegate.toggleLeft();
                $scope.close('changepw');
                $scope.close('account');
                $scope.updatePw = {};
              });
            } else {
              $rootScope.udr.udShow(errMsg(res.data['lang']));
            }
          })
          .catch(function (err) {
            console.log(err);
          })
      },
      goTo: function () {
        $ionicSideMenuDelegate.toggleRight();
        $scope.close('allHelp');
      },
      //根据试卷包的状态做出不同的处理
      goToExamAnalyze:function(status,uploadid){
        if(status == "end"){
          window.location = "#/examList/" + uploadid;
        }else{
          $rootScope.udr.showAlert('正在努力分析中，请稍后再试...','提示');
        }
      },
      //切换身份
      toggleAccount:function(schoolid){
        for(var i=0;i<$scope.schools.length;i++){
          if($scope.schools[i].schoolid == schoolid){
            $scope.ud.account = $scope.schools[i];
            console.log($scope.ud.account);
            $scope.close('toggleAccount');
            $scope.doRefreshUnfinished();
          }
        }
      },
    };
    $rootScope.classifyArr = ['','语文', '数学', '数学(理)', '数学(文)', '政治', '历史', '地理', '物理', '化学', '生物'];
    $rootScope.uploadStatus = {
      created:"等待上传完整试卷",
      analyze:"分析中",
      queuing:"排队中",
      checking:"正在阅卷",
      stating:"报表生成中",
      end:"报表已生成",
    };

    $rootScope.uploaderror = {
      none:"待上传",
      invalid:"试卷包错误",
      fileserr:"部分文件存在问题",
      notunify:"文件数量不统一",
    };

    $rootScope.uploadExamerror = {
      invalid: "不合法的文件",
      incomplete: "不完整的文件",
      breezing: "不够清晰的文件",
    };

    //右侧菜单侧滑栏
    $scope.rightMenuState = false;
    $scope.changeRightMenu = function(){
      $scope.rightMenuState = ! $scope.rightMenuState ;
    };

    $scope.info = {
      personnalSchool:null,
      currentCity:null,
      allCity:null,
      citySchool:null,
      getPersonnalSchool:function(){
        //获取个人学校信息
        query('post', $rootScope.url + '/schools.list', {
          uuid: localData.get('uuid')
        }, function (jsonData) {
            $scope.schoolInfo = jsonData.rows;
          });
      },
      getCity:function(){
        query('post', $rootScope.url + '/system.listareas', {}, function (jsonData) {
          $scope.info.allCity = jsonData.rows;
          $scope.info.getCurrentCity("北京");
          $scope.info.getCitySchool($scope.info.currentCity);
        });
      },
      getCurrentCity:function(name){
        $scope.info.currentCity = $scope.info.allCity.find(function(city){
          return city.name == "北京";
        });
      },
      getCitySchool:function(city){
          var schools = [];
          query('post', $rootScope.url + '/system.listschools', {
            areaid: city.areaid,
          }, function (jsonData) {
            if(jsonData.rows.length > 0){
              for(var i = 0;i < jsonData.rows.length;i ++){
                schools.push(jsonData.rows[i]);
              }
            }else{
              $scope.info.citySchool = [121,123,1431];
            }
          });
      },
    };

    $scope.info.getCity();

    
    //下拉刷新
    $scope.doRefreshUnfinished = function () {
      var ajaxUrl = $rootScope.url + '/upload.listfiles';
      var ajaxParam = {
        uuid: localData.get('uuid'),
        schoolid: $scope.ud.account.schoolid,
      };
      $http.post(ajaxUrl, ajaxParam)
        .then(function (res) {
          $scope.alterInfo(res.data);
        })
        .finally(function () {
          $scope.$broadcast('scroll.refreshComplete');
        });
    };

    $scope.alterInfo = function(jsonData) {
      if(jsonData.schools){
        $rootScope.schoolInfo = jsonData.schools;
      }
      if(!jsonData.total && $rootScope.mallIndexfirstEnter){
        $rootScope.udr.showAlert('您还没有考试信息，请先创建一个考试','提示');
        return;
      }
      var arr = jsonData.classes || [];
      for (var i = 0; i < arr.length; i++) {
        jsonData.rows[i]['classname'] = arr[i].classname;
      }

      $scope.rows = jsonData.rows;
      $rootScope.mallIndexfirstEnter = false;
      console.log($rootScope.mallIndexfirstEnter);
    };
    // $scope.doRefreshUnfinished();
    //弹出窗初始化
    ModalService.initModal($scope, 'account');
    ModalService.initModal($scope, 'editName', 'left');
    ModalService.initModal($scope, 'changepw', 'left');
    ModalService.initModal($scope, 'createNewAccount', 'left');
    ModalService.initModal($scope, 'toggleAccount', 'left');
    /*ModalService.initModal($scope, 'help', 'left');*/
    ModalService.initModal($scope, 'allHelp', 'left');
    $scope.getPage = function (index) {
      $scope.page = index + 1;
    };
    //滑块
    $scope.goToHelpPage = function (str, index, toggle) {
      toggle = toggle || 'show';
      $scope[toggle](str);
      $ionicSlideBoxDelegate.slide(index, 10);
      $scope.page = index + 1;
      $scope.slidesCount = '9';
    };
    $scope.changeHelpPage = function (index){
      $scope.rightMenuState = ! $scope.rightMenuState ;
      $scope.page = index + 1;
      $ionicSlideBoxDelegate.slide(index, 10);
    };
    $scope.slideHasChanged = function(index) {
      $scope.page = $ionicSlideBoxDelegate.currentIndex() + 1;
    };
  }])
  .filter('change', function () {
    return function (value) {
      return userTypeView(value);
    }
  });

