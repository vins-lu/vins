angular.module('app.setPw', [])
  .controller('setPwCtrl', ['$scope', '$http', '$rootScope', function ($scope, $http, $rootScope) {
    $scope.passInfo = {};
    $scope.ud = {
      //清空
      inputEmpty: function (str) {
        $scope.passInfo[str] = '';
      },
      succ: function () {
        if (!$scope.passInfo.pass1) {
          $rootScope.udr.udShow('密码不能为空');
          return;
        }
        if ($scope.passInfo.pass1.length < 6) {
          $scope.udr.udShow('密码长度不能小于6位');
          return;
        }
        if (testPassWordAorN($scope.passInfo.pass1)) {
          if ($scope.passInfo.pass1 == $scope.passInfo.pass2) {
            $rootScope.pass = $scope.passInfo.pass1;
            location.href = '#/perfectInfo';
            $scope.ud.inputEmpty('pass1');
            $scope.ud.inputEmpty('pass2');
          } else {
            $rootScope.udr.udShow('两次密码输入不一致,请重新输入');
            $scope.ud.inputEmpty('pass2')
          }
        } else {
          $scope.udr.udShow('请输入有效字符');
          $scope.ud.inputEmpty('pass1');
          $scope.ud.inputEmpty('pass2');
        }
      }
    };
  }]);

