angular.module('app.indagate', [])
  .controller('indagateCtrl', ['$scope', '$rootScope', '$state', '$http', function ($scope, $rootScope, $state, $http) {
    $rootScope.$on('$ionicView.beforeEnter', function (ele, data) {
      if (data.stateName == 'indagate') {
        //获取班级
        query('post', $rootScope.url + '/classes.list', {
          uuid: localData.get('uuid'), schoolid: 3, relation:'school',
            status:'ok',
        }, function (jsonData) {
          $scope.classNameLists = jsonData.rows;
        });
        //获取答题卡列表
        query('post', $rootScope.url + '/usercards.list', {
          uuid: localData.get('uuid'), schoolid: 3, relation:'school',
        }, function (jsonData) {
          $scope.usercardsLists = jsonData.rows;
        })
      }
    });

    $scope.ud = {
      getTime: function () {
        var date = new Date();
        var month = (date.getMonth() + 1) > 10 ? (date.getMonth() + 1) : '0' + (date.getMonth() + 1);
        var day = date.getDate() > 10 ? date.getDate() : '0' + date.getDate();
        return date.getFullYear() + '-' + month + '-' + day;
      },
      setTime: function (str) {
        var date = new Date(str);
        var month = (date.getMonth() + 1) > 10 ? (date.getMonth() + 1) : '0' + (date.getMonth() + 1);
        var day = date.getDate() > 10 ? date.getDate() : '0' + date.getDate();
        return date.getFullYear() + '-' + month + '-' + day;
      },
      goHome: function () {
        $state.go('home.unfinishedExam');
      },
      infoBlur: function ($event, str) {
        if ($scope.foundData[str]) {
          angular.element($event.target).parent().find('i').removeClass('ud_empty')
        } else {
          angular.element($event.target).parent().find('i').addClass('ud_empty')
        }
      },
      submitInfo: function () {
        if (!$scope.foundData.date
          || !$scope.foundData.title
          || !$scope.foundData.level
          || !$scope.foundData.classifyid
          || !$scope.foundData.class
          || !$scope.foundData.cardid) {
          $rootScope.udr.udShow('请正确填写内容');
          return;
        }
        //成功
        var ajaxUrl = $rootScope.url + '/upload.createpackage';
        $scope.foundData.classname = $('#sel>option[value=' + $scope.foundData.level + ']').text() + $scope.foundData.class;
        $scope.foundData.classid = $('#grades>option[value=' + $scope.foundData.class + ']').attr('data-classid');
        $scope.foundData.uuid = localData.get('uuid');
        $scope.foundData.students = $scope.foundData.students - 0;
        // $scope.foundData.cardid = $scope.foundData.cardid;
        delete $scope.foundData.class;
        
        console.log($scope.foundData);
        $http.post(ajaxUrl, $scope.foundData)
          .then(function (res) {
            console.log(res.data);
            $rootScope.currentUploadid = res.data.uploadid;
            if (!res.data['ok']) {
              $rootScope.udr.showAlert('请重试', '错误');
              return;
            }
            // $state.go('upload');
            $state.go("unfinishedExam",{"uploadid":res.data.uploadid});
          })
          .catch(function (err) {
            console.log(err);
          })
      }
    };
    //创建考试项目数据
    $scope.foundData = {
      schoolid: localData.get("schools")[0].schoolid,
      schoolname: localData.get("schools")[0].fullname,
      students: 50,
      date: $scope.ud.getTime(),
      level: '1',
      classifyid: '1',
      platform:'app'
    };
    //日期
    var calendar = new datePicker();
    calendar.init({
      'trigger': '#date',
      'type': 'date',
      'minDate': $scope.ud.getTime(),
      'maxDate': $scope.ud.setTime(new Date().setFullYear(new Date().getFullYear() + 1)),
      'onSubmit': function () {
        var theSelectData = calendar.value;
      },
      'onClose': function () {
      }
    });


  }]);

