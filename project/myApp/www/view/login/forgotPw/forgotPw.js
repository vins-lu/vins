
angular.module('app.forgotPw',[])
  .controller('forgotPwCtrl',['$scope','$rootScope','$http',function ($scope,$rootScope,$http) {
    $scope.userInfo = {};
    $scope.ud = {
      inputEmpty:function () {
        $scope.userInfo.phone ='';
      },
      next:function () {
        var user = new RegExp('^1[0-9]{10}$');
        if($scope.userInfo.phone&&user.test($scope.userInfo.phone)){
          // $http.get($rootScope.url+'/validcodes.mobilecode?mobile='+$scope.registerInfo.phone)
          //   .then(function (req) {
          //     console.log(req.data);
          //     if(req.data.ok){
          $rootScope.mobil =  $scope.userInfo.phone;
          localStorage.getItem('username',$scope.userInfo.phone);
          location.href = '#/codePw'
          //     }else{
          //       $rootScope.udr.showAlert(req.data.msg);
          //     }
          //   }).catch(function (err) {
          //   $rootScope.udr.showAlert('网络错误,请重试！');
          // })
        }else{
          $rootScope.udr.udShow('请正确输入手机号')
        }
      }
    }
  }]);
