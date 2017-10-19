//app.js
App({
  getRoomPage: function () {
    return this.getPage("pages/msg/msg")//聊天界面
  },
  getPage: function (pageName) {
    var pages = getCurrentPages()
    return pages.find(function (page) {
      return page.__route__ == pageName
    })
  },
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var that = this;
    // var logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)
    this.getWXUserInfo();
  },
  getWXUserInfo:function(cb){
    var that = this
    if(this.globalData.wxUserInfo){
      typeof cb == "function" && cb(this.globalData.wxUserInfo)
    }else{
      //调用登录接口
      wx.login({
        success: function (res) {
          wx.getUserInfo({
            success: function (res) {
              that.globalData.wxUserInfo = res.userInfo
              typeof cb == "function" && cb(that.globalData.wxUserInfo)
            }
          })
        }
      })
    }
  },
  globalData:{
    wxUserInfo:null,//用户微信信息
    userInfo:null,//用户信息
    uuid:"",//用户uuid
    schools:[],//用户学校
    imuser:{},//环信账户
    themeName: "bg0",//主题
  },
})