angular.module('app.login', [])
  .controller('loginCtrl', ['$scope', '$rootScope','$state','$http', function ($scope, $rootScope,$state,$http) {
    $scope.loginData = {};
    $scope.code = {
      state:false,
      codepath:'',
      codeurl:'http://api.lm.com/validcodes.show?',
      getCode:function(){
                var d = new Date();  
                var utc = Date.UTC(d.getFullYear(),d.getMonth(),d.getDate(),d.getHours(),d.getMinutes(),d.getSeconds(),d.getMilliseconds());
                var random = Math.random();
                var str = utc.toString() + random;
                $scope.code.codepath = $scope.code.codeurl+"__t"+str;
            }
    }
    if(localData.get("needCode")){
      $scope.code.state = true;
      $scope.code.getCode();
    }
    $scope.ud = {
      inputEmpty: function () {
        $scope.loginData.mobile = '';
      },
      doLogin: function () {
        if (!$scope.loginData.mobile) {
          $rootScope.udr.udShow('请输入账号');
          return;
        }
        if (!$scope.loginData.pass) {
          $rootScope.udr.udShow('请输入密码');
          return;
        }
        if (!testMobile($scope.loginData.mobile) || !testPassWordAorN($scope.loginData.pass)) {
          $rootScope.udr.udShow('请正确输入账号或密码');
          return;
        }
        var ajaxUrl = $rootScope.url + '/users.managerlogin';
        $http.post(ajaxUrl,$scope.loginData)
          .then(function (res) {
              if (res.data.ok) {
                $state.go('home.unfinishedExam',{},{reload:true});
                localData.set('uuid', res.data['uuid']);
                localData.set('userInfo', res.data['userinfo']);
                localData.set('username',$scope.loginData);
                localData.set('classes',res.data['classes']);
                localData.set('schools',res.data['schools']);
              } else {
                $rootScope.udr.udShow(errMsg(res.data['lang']));
                localData.set("needCode","true");
                $scope.code.state = true;
                $scope.code.codepath = res.data.codepath;
              }
          })
          .catch(function (err) {
            console.log(err);
          })
      },
      //显示密码
      showPass: function (str) {
        if ($(str).attr('class').indexOf('ion-ios-eye-outline') > -1) {
          $(str).attr('class', 'ion-eye').prev().attr('type', 'text');
        } else {
          $(str).attr('class', 'ion-ios-eye-outline').prev().attr('type', 'password');
        }
      }
    };
  }]);

