angular.module('app.set',[])
  .controller('setCtrl',['$scope','$http','ModalService','$ionicLoading','$interval','$timeout','$state','$rootScope',function ($scope,$http,ModalService,$ionicLoading,$interval,$timeout,$state,$rootScope) {
    $rootScope.wifi = {checked:true};
      $scope.watchWifi = function () {
        console.log($rootScope.wifi.checked);
      };
    //ionicModel
    ModalService.initModal($scope, 'clearCache','down');
    ModalService.initModal($scope, 'news','left');
    ModalService.initModal($scope, 'feedback');

    $scope.ud={
      goHome:function () {
        $state.go('home.unfinishedExam')
      }
    };

    $scope.vo = {
      percent:0
    };
    $scope.vc = {
      percentTimer:function(){
        $scope.vo.percent = 0;
        var timer = $interval(function(){
          $scope.vo.percent += parseInt(Math.random()*3,10);
          if($scope.vo.percent>=100){
            $scope.vo.percent = 100;
            $interval.cancel(timer);
            $timeout(function(){
              $ionicLoading.hide();
            },3000);
          }
        },100);
      }
    };

console.log($scope);
  }]);
