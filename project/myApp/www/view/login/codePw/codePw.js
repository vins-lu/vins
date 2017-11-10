angular.module('app.codePw', [])
    .controller('codePwCtrl', ['$scope', '$ionicHistory', '$http', '$rootScope', function ($scope, $ionicHistory, $http, $rootScope) {
        var timer;
        if ($rootScope.mobil) {
            var seconds = 60;
            timer = setInterval(function () {
                if (seconds > 0) {
                    seconds--;
                    seconds = seconds >= 10 ? seconds : '0' + seconds;
                    $('#getcodePwBtn').text('重新发送(' + (seconds) + ')');
                } else {
                    clearInterval(timer);
                    $('#getcodePwBtn').text('重新发送');
                }
            }, 1000);
        }
        $scope.code = {};
        $scope.ud = {
            goBack: function () {
                $ionicHistory.goBack();
                clearInterval(timer);
            },
            //清空
            inputEmpty: function () {
                $scope.code.num = '';
            },
            nextSend: function () {
                if ($('#getcodeBtn').text() == '重新发送') {
                    console.log('发送')
                } else {
                    $rootScope.udr.udShow('请稍后');
                }
            },
            nextTo:function () {
            // $http.get($rootScope.url+'/validcodes.mobilecode?mobile='+$scope.registerInfo.phone)
            //   .then(function (req) {
            //     console.log(req.data);
            //     if(req.data.ok){
              location.href = '#/resetPw';
              $scope.ud.inputEmpty();
              clearInterval(timer);
              $('#getcodePwBtn').text('重新发送');
            //     }else{
            //       $rootScope.udr.showAlert(req.data.msg);
            //     }
            //   }).catch(function (err) {
            //   $rootScope.udr.showAlert('网络错误,请重试！');
            // })
          }
        };

    }]);
