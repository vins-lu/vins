angular.module('app.service',[])
  .factory('ModalService', ['$ionicModal','$rootScope',function ($ionicModal,$rootScope) {
    var initModal = function ($scope,viewStr,str) {
      str = str || 'up';
      var modal = $ionicModal.fromTemplateUrl('templates/'+viewStr+'.html',{
        scope:$scope,
        animation: 'slide-in-'+str
      }).then(function (modal) {
        $scope[viewStr] = modal;
        return modal
      });
      $scope.show = function (args,pages) {
        $scope[args].show();
        if(pages || pages==0){
          $rootScope.pages = pages;
        }
      };
      $scope.close = function (args) {
        $scope[args].hide();
      };
      $scope.$on('$destroy', function () {
        $scope[viewStr].remove();
      });
      return modal;
    };
    return {
      initModal : initModal
    }
  }]);

