const { login } = require("./utils/api.js");
//app.js
App({
  getPage: function (pageName) {
    var pages = getCurrentPages()
    return pages.find(function (page) {
      return page.__route__ == pageName
    })
  },
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var that = this;
    this.getWXUserInfo();
    // wx.getLocation({
    //   type: 'wgs84',
    //   success: function (res) {
    //     console.log(res);
    //   }
    // });
  },
  getWXUserInfo:function(cb){
    var that = this
    if(this.globalData.wxUserInfo){
      typeof cb == "function" && cb(this.globalData.wxUserInfo)
    }else{
      //调用登录接口
      wx.login({
        success: function (res) {
          that.globalData.appcode = res.code;
          wx.getUserInfo({
            success: function (res) {
              that.globalData.wxUserInfo = res.userInfo;
              typeof cb == "function" && cb(that.globalData.wxUserInfo);
            }
          });
          login({
            data: {
              appcode: res.code
            },
            success: function(res) {
              that.globalData.openid = res.openid;
              that.globalData.isexist = typeof res.notexist == undefined ? true : false;

              if (res.notexist) {
                wx.redirectTo({
                  url: '../welcome/welcome',
                });
              }
            }
          });
        }
      })
    }
  },
  globalData:{
    openid: "",
    gloabalFomIds: [],
    isexist: false,//用户是否存在
    wxUserInfo:null,//用户微信信息
    userInfo:null,//用户信息
  },
})