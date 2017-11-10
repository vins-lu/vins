
angular.module('app', ['ionic', 'app.home','app.login','app.forgotPw','app.codePw','app.resetPw','app.indagate','app.router','app.service','app.upload','app.picasaTool','app.register','app.code','app.setPw','app.perfectInfo','app.unfinishedExamDetail','app.set','app.examList'])
  .config(['$ionicConfigProvider',function($ionicConfigProvider){
    $ionicConfigProvider.navBar.alignTitle('center');
    $ionicConfigProvider.views.swipeBackEnabled(false);
    $ionicConfigProvider.views.maxCache(5);
    $ionicConfigProvider.views.forwardCache(false);
    $ionicConfigProvider.platform.android.form.checkbox('circle');
    $ionicConfigProvider.platform.ios.form.checkbox('circle');
    $ionicConfigProvider.spinner.icon('bubbles');
  }])
.run(['$rootScope','$ionicPlatform','$ionicHistory','$ionicPopup','$ionicLoading',function($rootScope,$ionicPlatform,$ionicHistory,$ionicPopup,$ionicLoading) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });

  //物理返回按钮控制&双击退出应用
  $ionicPlatform.registerBackButtonAction(function (e) {
      //判断处于哪个页面时双击退出
      if ($location.path() == '/home/unfinishedExam' || $location.path() == '/home/completeExam' || $location.path() == '/register'|| $location.path() == '/login') {
          if ($rootScope.backButtonPressedOnceToExit) {
              ionic.Platform.exitApp();
          } else {
              $rootScope.backButtonPressedOnceToExit = true;
              $cordovaToast.showShortBottom('再按一次退出系统');
              setTimeout(function () {
                  $rootScope.backButtonPressedOnceToExit = false;
              }, 2000);
          }
      }else if ($ionicHistory.backView()) {
          if ($cordovaKeyboard.isVisible()) {
              $cordovaKeyboard.close();
          } else {
              $ionicHistory.goBack();
          }
      }
      else {
          $rootScope.backButtonPressedOnceToExit = true;
          $cordovaToast.showShortBottom('再按一次退出系统');
          setTimeout(function () {
              $rootScope.backButtonPressedOnceToExit = false;
          }, 2000);
      }
      e.preventDefault();
      return false;
  }, 101);

  $rootScope.url = 'http://api.lm.com';
  $rootScope.currentCity = "北京";
  $rootScope.refresh = false;
  $rootScope.mallIndexfirstEnter = true;
  $rootScope.udr = {
    //返回
    goBack: function () {
      $ionicHistory.goBack()
    },
    //show
    udShow:function (content) {
      $ionicLoading.show({
        template:content,
        duration:1500,
        showBackdrop:false
      })
    },
    udDefaultShow:function () {
        $ionicLoading.show({
          noBackdrop: true,
          template: '<p class="item-myicon"><ion-spinner icon="circles" class="spinner-balanced"></ion-spinner><span>加载中···</span></p>'
        });
    },
    udHide:function () {
        $ionicLoading.hide();
    },
    //alert
    showAlert: function (content,title,fn) {
      title = title || '提示';
      var showAlert =$ionicPopup.alert({
        title:'<b>'+title+'</b>' ,
        template: '<div style="text-align: center;">'+content+'</div>',
        okText: '确定',
        okType: 'button-dark'
      });
      if(fn){
        showAlert.then(function () {
          fn();
        })
      }
    },
    showConfirm:function (content,title,fn) {
      title = title || '退出登录';
      $ionicPopup.confirm({
        title: title,
        template: '<div style="text-align: center;">'+content+'</div>',
        okText: '确定',
        okType: 'button-positive',
        cancelText:'取消'
      }).then(function(res) {
          if(fn){
            fn(res);
          }
      });
    }
  };

  $rootScope.getAddr = function() {  
    if (navigator.geolocation) {  
      navigator.geolocation.getCurrentPosition(  
      //获取位置信息成功  
      function(position) {  
        $rootScope.latitude = position.coords.latitude;  
        $rootScope.longitude = position.coords.longitude;  
        console.log(position);
        var myGeo = new BMap.Geocoder();  
        //根据坐标得到地址描述      
        $rootScope.getGeo();  
      },  
      //获取位置信息失败  
      function(error) {  
        switch (error.code) {  
          case error.PERMISSION_DENIED:  
            $rootScope.udr.showAlert("请打开设备定位功能！");  
          break;  
          case error.POSITION_UNAVAILABLE:  
            $rootScope.udr.showAlert("定位信息不可用！");  
          break;  
          case error.TIMEOUT:  
            $rootScope.udr.showAlert("定位请求超时！");  
          break;  
          case error.UNKNOWN_ERROR:  
            $rootScope.udr.showAlert("未知错误！");  
          break;  
        }  
      },  
      {  
        // 指示浏览器获取高精度的位置，默认为false  
        enableHighAccuracy: true,  
        // 指定获取地理位置的超时时间，默认不限时，单位为毫秒  
        timeout: 5000,  
        // 最长有效期，在重复获取地理位置时，此参数指定多久再次获取位置。  
        maximumAge: 30000  
      });  
    } else {  
      $rootScope.udr.showAlert("您的设备不支持GPS定位！");  
    }  
  };  
     
  $rootScope.getAddr();  
     
  $rootScope.getGeo = function() {  
    var myGeo = new BMap.Geocoder();  
    // 根据坐标得到地址描述      
    myGeo.getLocation(new BMap.Point($rootScope.longitude, $rootScope.latitude), function(result) {  
      if (result) {  
        console.log(JSON.stringify(result));  
        $rootScope.geoaddress = {  
        'fulladdress': result.addressComponents.city + result.addressComponents.district + result.addressComponents.street,  
        'city': result.addressComponents.city,  
        'area': result.addressComponents.district,  
        'street': result.addressComponents.street,  
        };  
        console.log(JSON.stringify($rootScope.geoaddress));  
      }else {  
        $rootScope.udr.showAlert("定位失败,地址解析失败");  
      }  
    });  
  };  

  $rootScope.initPhotoSwipeFromDOM = function(gallerySelector) {
        var parseThumbnailElements = function(el) {
            var thumbElements = el.childNodes,
                    numNodes = thumbElements.length,
                    items = [],
                    figureEl,
                    linkEl,
                    size,
                    item;

            for (var i = 0; i < numNodes; i++) {
                figureEl = thumbElements[i]; // <figure> element
                if (figureEl.nodeType !== 1) {
                    continue;
                }
                linkEl = figureEl.children[0]; // <a> element
                size = linkEl.getAttribute('data-size').split('x');
                item = {
                    src: linkEl.getAttribute('href'),
                    w: parseInt(size[0], 10),
                    h: parseInt(size[1], 10)
                };
                if (figureEl.children.length > 1) {
                    // <figcaption> content
                    item.title = figureEl.children[1].innerHTML;
                }
                if (linkEl.children.length > 0) {
                    // <img> thumbnail element, retrieving thumbnail url
                    item.msrc = linkEl.children[0].getAttribute('src');
                }
                item.el = figureEl; // save link to element for getThumbBoundsFn
                items.push(item);
            }

            return items;
        };

        // find nearest parent element
        var closest = function closest(el, fn) {
            return el && (fn(el) ? el : closest(el.parentNode, fn));
        };

        // triggers when user clicks on thumbnail
        var onThumbnailsClick = function(e) {
            e = e || window.event;
            //e.preventDefault ? e.preventDefault() : e.returnValue = false;

            var eTarget = e.target || e.srcElement;
            console.log(eTarget);
            // find root element of slide
            var clickedListItem = closest(eTarget, function(el) {
                return (el.tagName && el.tagName.toUpperCase() === 'LI');
            });
            if(eTarget.tagName && eTarget.tagName.toUpperCase() === 'INPUT'){
              return;
            }
            if(eTarget.tagName && eTarget.tagName.toUpperCase() === 'SVG'){
              return;
            }
            if(eTarget.tagName && eTarget.tagName.toUpperCase() === 'I'){
              return;
            }
            if($(eTarget).closest("svg").length > 0){
              return;
            }

            if (!clickedListItem) {
                return;
            }

            // find index of clicked item by looping through all child nodes
            // alternatively, you may define index via data- attribute
            var clickedGallery = clickedListItem.parentNode,
                    childNodes = clickedListItem.parentNode.childNodes,
                    numChildNodes = childNodes.length,
                    nodeIndex = 0,
                    index;

            for (var i = 0; i < numChildNodes; i++) {
                if (childNodes[i].nodeType !== 1) {
                    continue;
                }

                if (childNodes[i] === clickedListItem) {
                    index = nodeIndex;
                    break;
                }
                nodeIndex++;
            }



            if (index >= 0) {
                // open PhotoSwipe if valid index found
                openPhotoSwipe(index, clickedGallery);
            }
            return false;
        };

        // parse picture index and gallery index from URL (#&pid=1&gid=2)
        var photoswipeParseHash = function() {
            var hash = window.location.hash.substring(1),
                    params = {};

            if (hash.length < 5) {
                return params;
            }

            var vars = hash.split('&');
            for (var i = 0; i < vars.length; i++) {
                if (!vars[i]) {
                    continue;
                }
                var pair = vars[i].split('=');
                if (pair.length < 2) {
                    continue;
                }
                params[pair[0]] = pair[1];
            }

            if (params.gid) {
                params.gid = parseInt(params.gid, 10);
            }

            return params;
        };

        var openPhotoSwipe = function(index, galleryElement, disableAnimation, fromURL) {
            var pswpElement = document.querySelectorAll('.pswp')[0],
                    gallery,
                    options,
                    items;

            items = parseThumbnailElements(galleryElement);

            // define options (if needed)
            options = {
                // define gallery index (for URL)
                galleryUID: galleryElement.getAttribute('data-pswp-uid'),
                getThumbBoundsFn: function(index) {
                    // See Options -> getThumbBoundsFn section of documentation for more info
                    var thumbnail = items[index].el.getElementsByTagName('img')[0], // find thumbnail
                            pageYScroll = window.pageYOffset || document.documentElement.scrollTop,
                            rect = thumbnail.getBoundingClientRect();

                    return {x: rect.left, y: rect.top + pageYScroll, w: rect.width};
                }

            };

            // PhotoSwipe opened from URL
            if (fromURL) {
                if (options.galleryPIDs) {
                    // parse real index when custom PIDs are used 
                    // http://photoswipe.com/documentation/faq.html#custom-pid-in-url
                    for (var j = 0; j < items.length; j++) {
                        if (items[j].pid == index) {
                            options.index = j;
                            break;
                        }
                    }
                } else {
                    // in URL indexes start from 1
                    options.index = parseInt(index, 10) - 1;
                }
            } else {
                options.index = parseInt(index, 10);
            }

            // exit if index not found
            if (isNaN(options.index)) {
                return;
            }

            if (disableAnimation) {
                options.showAnimationDuration = 0;
            }

            // Pass data to PhotoSwipe and initialize it
            gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options);
            gallery.init();
        };

        // loop through all gallery elements and bind events
        var galleryElements = document.querySelectorAll(gallerySelector);

        for (var i = 0, l = galleryElements.length; i < l; i++) {
            galleryElements[i].setAttribute('data-pswp-uid', i + 1);
            galleryElements[i].onclick = onThumbnailsClick;
        }

        // Parse URL and open gallery if it contains #&pid=3&gid=1
        var hashData = photoswipeParseHash();
        if (hashData.pid && hashData.gid) {
            openPhotoSwipe(hashData.pid, galleryElements[ hashData.gid - 1 ], true, true);
        }
    };
}]);


