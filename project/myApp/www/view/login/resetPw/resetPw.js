angular.module('app.resetPw', [])
  .controller('resetPwCtrl', ['$scope', '$rootScope', '$http', function ($scope, $rootScope, $http) {
    $scope.passInfo = {};
    $scope.ud = {
      inputEmpty: function (str) {
        $scope.passInfo[str] = '';
      },
      resetPw: function () {
        if ($scope.passInfo.pass1 && $scope.passInfo.pass2) {
          if($scope.passInfo.pass1.length<6){
            $scope.udr.udShow('密码长度不能小于6位')
          }else{
            var patt = new RegExp('^[0-9A-Za-z]{6,20}$');
            if(patt.test($scope.passInfo.pass1)){
              if ($scope.passInfo.pass1 == $scope.passInfo.pass2) {

                // $http.post($rootScope.url+'/users.setpassword')
                //   .then(function (res) {
                //
                //   })
                //   .catch(function () {
                //
                //   });


                    //请求
                    $rootScope.udr.showAlert('重置密码成功', '', function () {
                      location.href = '#/home/myExam'
                    });
              } else {
                $rootScope.udr.udShow('两次密码输入不一致,请重新输入');
                $scope.ud.inputEmpty('pass2')
              }
            }else{
              $scope.udr.udShow('请输入有效字符');
              $scope.ud.inputEmpty('pass1');
              $scope.ud.inputEmpty('pass2');
            }
          }
        } else {
          $rootScope.udr.udShow('密码不能为空!');
        }
      }
    }
  }]);
