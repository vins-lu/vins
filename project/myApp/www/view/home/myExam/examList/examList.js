angular.module('app.examList', [])
  .controller('examListCtrl', ['$scope', '$rootScope', '$state', '$http', '$stateParams', function ($scope, $rootScope, $state, $http, $stateParams) {
    $rootScope.$on('$ionicView.beforeEnter', function (ele, data) {
      if (data.stateName == 'examList') {
        //获取班级
        console.log($stateParams);
        query('post', $rootScope.url + '/classes.list', {
          uuid: localData.get('uuid'), 
          uploadid: $stateParams.uploadid,
        }, function (jsonData) {
          $scope.classNameLists = jsonData.rows;
          console.log(jsonData);
        })
      }
    });

    $scope.ud = {
      	index:0,
      	goTo:function () {
       		$state.go('home.unfinishedExam',{},{reload: true});
      	},
      	infoBlur: function ($event, str) {
	        if ($scope.foundData[str]) {
	          angular.element($event.target).parent().find('i').removeClass('ud_empty')
	        } else {
	          angular.element($event.target).parent().find('i').addClass('ud_empty')
	        }
      	},
      	submitInfo:function () {
	        if (!$scope.foundData.date
	          || !$scope.foundData.title
	          || !$scope.foundData.level
	          || !$scope.foundData.classifyid
	          || !$scope.foundData.class) {
	          $rootScope.udr.udShow('请正确填写内容');
	          return;
	        }
	        //成功
	        var ajaxUrl = $rootScope.url + '/upload.createpackage';
	        $scope.foundData.classname = $('#sel>option[value=' + $scope.foundData.level + ']').text() + $scope.foundData.class;
	        $scope.foundData.classid = $('#grades>option[value=' + $scope.foundData.class + ']').attr('data-classid');
	        $scope.foundData.uuid = localData.get('uuid');
	        $scope.foundData.students = $scope.foundData.students - 0;
	        delete $scope.foundData.class;
	        
	        console.log($scope.foundData);
	        $http.post(ajaxUrl, $scope.foundData)
	          .then(function (res) {
	            console.log(res.data);
	            if (!res.data['ok']) {
	              $rootScope.udr.showAlert('请重试', '错误');
	              return;
	            }
	            $state.go('upload');
	          })
	          .catch(function (err) {
	            console.log(err);
	          })
      	},
    };

    $scope.chart = {
    	scoreChart:null,
      	passRateoption:{
      	    tooltip: {
      	        trigger: 'item',
      	    },
      	    legend: {
      	        orient: 'vertical',
      	        x: 'rihgt',
      	    },
      	    legendHoverLink:false,
      	    series: [
      	        {
      	            name:'及格率',
      	            type:'pie',
      	            radius: ['50%', '70%'],
      	            avoidLabelOverlap: false,
      	            label: {
      	                normal: {
      	                    show: false,
      	                    position: 'center'
      	                },
      	                emphasis: {
      	                    show: true,
      	                    textStyle: {
      	                        fontSize: '2rem',
      	                        fontWeight: 'bold',
      	                        color:'#333'
      	                    }
      	                }
      	            },
      	            labelLine: {
      	                normal: {
      	                    show: false
      	                }
      	            },
      	            data:[
      	                {value:23, name:'及格率46%',},
      	                {value:50, name:'不及格率54%'}
      	            ]
      	        }
      	    ],
      	    color:['#f7644e','#ccc']
      	},
     	scoreOption:{
	      	title: {
	      	    text: '分数分布 :人/分',
	      	    textAlign:'center'
	      	},
	      	tooltip: {},
	      	legend: {
	      	    data:['0-20','20-40','40-60','60-80'],
	      	    top:20
	      	},
	      	xAxis: {
	      	    data: []
	      	},
	      	yAxis: {
	      		type:'value',
	      		nameTextStyle:{
	      			color:'#f00',
	      			fontSize:20
	      		}
	      	},
	      	series: [{
	      	    type: 'bar',
	      	    data: [],
	      	    label: {
      	                normal: {
      	                    show: true,
      	                    position: 'top'
      	                }
      	            }
	      	}]
      	},
      	loadPassRate:function(ele,option){
	      	var myChart = echarts.init(ele);

	      	// 使用刚指定的配置项和数据显示图表。
	      	myChart.setOption(option);

	      	myChart.title = '环形图';
		   	// myChart.currentIndex = 0;
	      	//高亮当前图形
	      	myChart.dispatchAction({
	      	    type: 'highlight',
	      	    seriesIndex: 0,
	      	    dataIndex: 0
	      	});
      	},
      	fetchData: function (cb) {
	        // 通过 setTimeout 模拟异步加载
	        setTimeout(function () {
	            cb({
	                scoreStep: ["0-20","20-40","40-60","60-80","80-120","120-150"],
	                data: [5, 20, 36, 10, 10, 20]
	            });
	        }, 1000);
    	},
    	loadScore:function(data){
    		$scope.chart.scoreChart.setOption({
    		    xAxis: {
    		        data: data.scoreStep
    		    },
    		    series: [{
    		        data: data.data
    		    }]
    		});
    	}
    };

    $scope.score = {
    	highScoredProblem:[
    		{
    			belongto:'一',
    			detail:'2',
    			score:'20',
    			scored:'94%'
    		},
    		{
    			belongto:'一',
    			detail:'2',
    			score:'20',
    			scored:'94%'
    		},
    		{
    			belongto:'一',
    			detail:'2',
    			score:'20',
    			scored:'94%'
    		},
    		{
    			belongto:'一',
    			detail:'2',
    			score:'20',
    			scored:'94%'
    		},
    	],
    	lowScoredProblem:[
    		{
    			belongto:'一',
    			detail:'2',
    			score:'20',
    			scored:'94%'
    		},
    		{
    			belongto:'一',
    			detail:'2',
    			score:'20',
    			scored:'94%'
    		},
    		{
    			belongto:'一',
    			detail:'2',
    			score:'20',
    			scored:'94%'
    		},
    		{
    			belongto:'一',
    			detail:'2',
    			score:'20',
    			scored:'94%'
    		},
    	],
    	knowledgePoint:[
    		{
    			name:'幂的运算',
    			acount:'13%',
    			weight:'20%',
    			error:'50%'
    		},
    		{
    			name:'幂的运算',
    			acount:'13%',
    			weight:'20%',
    			error:'50%'
    		},
    		{
    			name:'幂的运算',
    			acount:'13%',
    			weight:'20%',
    			error:'50%'
    		},
    		{
    			name:'幂的运算',
    			acount:'13%',
    			weight:'20%',
    			error:'50%'
    		},
    	],
    	studentScore:[
    		{
    			studentNo:'-',
    			studentName:'vins',
    			studentScore:60,
    			order:1,
    			gradeOrder:1
    		},
    		{
    			studentNo:'-',
    			studentName:'vins',
    			studentScore:60,
    			order:1,
    			gradeOrder:1
    		},
    		{
    			studentNo:'-',
    			studentName:'vins',
    			studentScore:60,
    			order:1,
    			gradeOrder:1
    		},
    		{
    			studentNo:'-',
    			studentName:'vins',
    			studentScore:60,
    			order:1,
    			gradeOrder:1
    		}
    	]
    }

    $scope.chart.loadPassRate($("#passRate")[0],$scope.chart.passRateoption);
    $scope.chart.scoreChart = echarts.init($("#score")[0]);
    $scope.chart.scoreChart.setOption($scope.chart.scoreOption);
	 
    $scope.chart.fetchData($scope.chart.loadScore);

  }]);

