angular.module('app.router', [])
  .config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('home', {
        url: '/home',
        abstract: true,
        templateUrl: 'view/home/home.html',
        controller: 'homeCtrl'
      })
      .state('home.unfinishedExam', {
        cache: false,
        url: '/unfinishedExam',
        views: {
          'homeContent': {
            templateUrl: 'view/home/myExam/unfinishedExam.html'
          }
        },
        controller: 'homeCtrl'
      })
      .state('home.completeExam', {
        cache: false,
        url: '/completeExam',
        views: {
          'homeContent': {
            templateUrl: 'view/home/myExam/completeExam.html'
          }
        },
        controller: 'homeCtrl'
      })
      .state('unfinishedExam', {
        url: '/unfinishedExam/:uploadid',
        templateUrl: 'view/home/myExam/unfinishedExamDetail/unfinishedExamDetail.html',
        controller: 'unfinishedExamDetailCtrl',
        cache:false,
        reload:true,
      })
      .state('register', {
        url: '/register',
        templateUrl: 'view/register/register.html',
        controller: 'registerCtrl'
      })
      .state('licenseAndService', {
        url: '/licenseAndService',
        templateUrl: 'templates/licenseAndService.html',
        controller: 'registerCtrl'
      })
      .state('privacyPolicy', {
        url: '/privacyPolicy',
        templateUrl: 'templates/privacyPolicy.html',
        controller: 'registerCtrl'
      })
      .state('code', {
        url: '/code',
        templateUrl: 'view/register/code/code.html',
        controller: 'codeCtrl'
      })
      .state('setPw', {
        url: '/setPw',
        templateUrl: 'view/register/setPw/setPw.html',
        controller: 'setPwCtrl'
      })
      .state('perfectInfo', {
        url: '/perfectInfo',
        templateUrl: 'view/register/perfectInfo/perfectInfo.html',
        controller: 'perfectInfoCtrl'
      })
      .state('indagate', {
        url: '/indagate',
        templateUrl: 'view/home/indagate/indagate.html',
        controller: 'indagateCtrl'
      })
      .state('examList', {
        url: '/examList/:uploadid',
        templateUrl: 'view/home/myExam/examList/examList.html',
        controller: 'examListCtrl'
      })
      .state('login', {
        url: '/login',
        templateUrl: 'view/login/login.html',
        controller: 'loginCtrl'
      })
      .state('loginOther', {
        url: '/loginOther',
        templateUrl: 'view/login/loginOther.html',
        controller: 'loginCtrl'
      })
      .state('forgotPw', {
        url: '/forgotPw',
        templateUrl: 'view/login/forgotPw/forgotPw.html',
        controller: 'forgotPwCtrl'
      })
      .state('codePw', {
        url: '/codePw',
        templateUrl: 'view/login/codePw/codePw.html',
        controller: 'codePwCtrl'
      })
      .state('upload', {
        url: '/upload',
        templateUrl: 'view/upload/upload.html',
        controller: 'uploadCtrl'
      })
      .state('resetPw', {
        url: '/resetPw',
        templateUrl: 'view/login/resetPw/resetPw.html',
        controller: 'resetPwCtrl'
      })
      .state('set', {
      url: '/set',
      templateUrl: 'view/home/set/set.html',
      controller: 'setCtrl'
    });

    // if none of the above states are matched, use this as the fallback
    if (localData.get('userInfo')) {
      $urlRouterProvider.otherwise('/home/unfinishedExam');
    } else {
      $urlRouterProvider.otherwise('/register');
    }
  });
