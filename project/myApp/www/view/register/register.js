angular.module('app.register', [])
  .controller('registerCtrl', ['$scope', '$rootScope','$state', function ($scope, $rootScope,$state) {
    $scope.registerInfo = {};
    $scope.ud = {
      //清空
      inputEmpty: function () {
        $scope.registerInfo.mobile = '';
      },
      getCode: function () {
        if (!$scope.registerInfo.mobile) {
          $rootScope.udr.udShow('手机号不能为空');
          return;
        }
        if (!testMobile($scope.registerInfo.mobile)) {
          $rootScope.udr.udShow('请正确填写手机号');
          return;
        }
        var ajaxUrl = $rootScope.url + '/users.isregistered';
        query('post', ajaxUrl, $scope.registerInfo, function (jsonData) {
          if (!jsonData.exists) {
            window.location.href = '#/code';
            $rootScope.phone = $scope.registerInfo.mobile;
            $scope.registerInfo.mobile = '';
          } else {
            $rootScope.udr.udShow('手机号已注册,请登录');
          }
        })

      },
      back: function () {
        $state.go('register');
      }
    }
  }]);
