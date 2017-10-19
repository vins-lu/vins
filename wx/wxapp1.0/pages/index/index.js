//index.js
const { login, getUploadinfo, getProject } = require("../../utils/api.js");
const { uploadStatus, gradeList, errMsg, subjectList } = require("../../utils/static.js");
const app = getApp();
Page({
  data: {
    userNo: "",
    pass: "",
    uploadList:"",//试卷包列表
    project:[],//科目信息
    uploadStatus: uploadStatus,//试卷包状态
    subjectList: subjectList,//科目图片名字
    theme:app.globalData.themeName,//主题
  },
  onLoad: function (options) {
    if(app.globalData.uuid == ""){
      wx.redirectTo({
        url: '../login/login',
      });
      return;
    }
    // //调用应用实例的方法获取全局数据
    // app.getUserInfo(function(userInfo){
    //   //更新数据
    //   self.setData({
    //     userInfo:userInfo
    //   })
    // });

    if (app.globalData.uuid == "") {
      wx.redirectTo({
        url: '../login/login',
      });
      return;
    }
    //得到试卷包列表
    wx.showLoading({
      title: '数据获取中...',
    });
    this.getUploadList();
  },
  onShow: function() {
  },
  onPullDownRefresh: function() {
    this.getUploadList();
  },
  getUploadList () {
    const self = this;
    getUploadinfo({
      data: {
        uuid: app.globalData.uuid,
        schoolid: app.globalData.schools[0].schoolid,
        begintime: 'current',
        cluster: 'checked',
      },
      success(res) {
        wx.stopPullDownRefresh();
        if (res.data) {
          self.setData({
            uploadList: res.data,
          });
        } else {
          if (res.data.lang) {
            let errormsg = errMsg[res.data.lang];
            if (errormsg) {
              wx.showModal({
                title: '提示',
                content: errMsg[res.data.lang],
                showCancel: false,
                success: function (res) {
                  self.setData({
                    pass: "",
                  });
                }
              });
            } else {
              wx.showModal({
                title: '提示',
                content: "获取数据异常，请稍后重新获取!",
                showCancel: false,
                success: function (res) {
                }
              });
            }
          } else {
            wx.showModal({
              title: '提示',
              content: "获取数据异常，请稍后重新获取!",
              showCancel: false,
              success: function (res) {
              }
            });
          }
        }
      }
    });
  },
  showReport (e) {
    let uploadid = e.target.dataset.uploadid;
    wx.navigateTo({
      url: '../examReport/examReport?uploadid=' + uploadid,
    });
  }
})
