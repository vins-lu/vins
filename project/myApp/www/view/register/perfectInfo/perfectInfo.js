angular.module('app.perfectInfo', [])
  .controller('perfectInfoCtrl', ['$scope', '$ionicPopup', '$state', '$rootScope', '$http', function ($scope, $ionicPopup, $state, $rootScope, $http) {
    $scope.submitInfo = {classifyid: '1', level: '1'};
    //数据
    $scope.sexData = ['男', '女'];
    $scope.ud = {
      //清空
      inputEmpty: function (str) {
        $scope.submitInfo[str] = '';
      },
      //保存用户信息
      saveRegisterInfo: function () {
        if (!$scope.submitInfo.name) {
          $rootScope.udr.udShow('请输入您的姓名');
          return;
        }
        if (!$scope.submitInfo.sex) {
          $rootScope.udr.udShow('请选择您的性别');
          return;
        }
        if (!$scope.submitInfo.schoolid) {
          $rootScope.udr.udShow('请输入您所在的学校');
          return;
        }
        if (!$scope.submitInfo.usertype) {
          $rootScope.udr.udShow('请选择您的类型');
          return;
        }
        $scope.submitInfo.mobile = $rootScope.phone;
        $scope.submitInfo.pass = $rootScope.pass;

        delete $scope.submitInfo.sex;

        var ajaxUrl = $rootScope.url + '/users.selfregist';
        //未完成
        $scope.submitInfo.schoolid = 3;
        if ($scope.submitInfo.usertype == 'teacher') {
          delete $scope.submitInfo.level;
          console.log($scope.submitInfo);
          query('post', ajaxUrl, $scope.submitInfo, function (jsonData) {
            if (jsonData.ok) {
              $http.post($rootScope.url + '/schools.getdetail',{schoolid:$scope.submitInfo.schoolid})
                .then(function(res){
                  console.log(res);
                })
                .catch(function (err) {
                  console.log(err);
                });
              var url = $rootScope.url + '/users.managerlogin';
              var obj = {
                mobile:$scope.submitInfo.mobile,
                pass: $scope.submitInfo.pass
              };
              $http.post(url, obj)
                .then(function (res) {
                  if (res.data.ok) {
                    $state.go('home.unfinishedExam');
                    localData.set('uuid', res.data['uuid']);
                    localData.set('userInfo', res.data['userinfo']);
                    localData.set('username', obj);
                    localData.set('classes',res.data['classes']);
                    localData.set('schools',res.data['schools']);
                  } else {
                    $rootScope.udr.udShow(errMsg(res.data['lang']));
                  }
                })
                .catch(function (err) {
                  console.log(err);
                })
            }
          });
        } else {
          delete $scope.submitInfo.classifyid;
          console.log($scope.submitInfo)
          query('post', ajaxUrl, $scope.submitInfo, function (jsonData) {
            if (jsonData.ok) {
              $http.post($rootScope.url + '/schools.getdetail',{schoolid:$scope.submitInfo.schoolid})
                .then(function(res){
                  console.log(res);
                })
                .catch(function (err) {
                  console.log(err);
                });
              var url = $rootScope.url + '/users.managerlogin';
              var obj = {
                mobile:$scope.submitInfo.mobile,
                pass: $scope.submitInfo.pass
              };
              $http.post(url, obj)
                .then(function (res) {
                  if (res.data.ok) {
                    $state.go('home.unfinishedExam');
                    localData.set('uuid', res.data['uuid']);
                    localData.set('userInfo', res.data['userinfo']);
                    localData.set('username', obj);
                  } else {
                    $rootScope.udr.udShow(errMsg(res.data['lang']));
                  }
                })
                .catch(function (err) {
                  console.log(err);
                })
            }
          });
        }
      }
    };


  }]);

