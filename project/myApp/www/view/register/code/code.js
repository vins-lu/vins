angular.module('app.code', [])
    .controller('codeCtrl', ['$scope', '$ionicHistory', '$http', '$rootScope', function ($scope, $ionicHistory, $http, $rootScope) {
        var timer;
        if ($rootScope.phone) {
            var seconds = 60;
            timer = setInterval(function () {
                if (seconds > 0) {
                    seconds--;
                    seconds = seconds >= 10 ? seconds : '0' + seconds;
                    $('#getcodeBtn').text('重新发送(' + (seconds) + ')');
                } else {
                    clearInterval(timer);
                    $('#getcodeBtn').text('重新发送');
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
            next: function () {

                window.location.href = '#/setPw';
                $scope.ud.inputEmpty();
                clearInterval(timer);
                $('#getcodeBtn').text('重新发送');

            },
            nextSend: function () {
                if ($('#getcodeBtn').text() == '重新发送') {
                    console.log('发送')
                } else {
                    $rootScope.udr.udShow('请稍后');
                }
            }
        };

    }]);
