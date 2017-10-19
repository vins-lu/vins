const { saveFormIds } = require("../../utils/api.js");
const app = getApp();
let self;
Page({
  data: {
    avatarUrl: "../../images/icon/def_avatarUrl.png",
    nickName: "",
    level:"初一",
  },
  onLoad: function (options) {
    self = this;
    self.getUserInfor();
  },
  getUserInfor: function () {
    if (this.globalData) {
      self.setData({
        avatarUrl: app.globalData.wxUserInfo.avatarUrl,
        nickName: app.globalData.wxUserInfo.nickName,
      });
    }
    else{
      wx.getUserInfo({
        success: function (res) {
          var avatarUrl= res.userInfo.avatarUrl;
          var nickName= res.userInfo.nickName;
          self.setData({
            avatarUrl: avatarUrl ? avatarUrl : "../../images/icon/personal.png",
            nickName: nickName ? nickName : "暂无",
          });
        }
      });
    }
  },
  //跳转评测
  evaluate: function (e) {
    let formid = e.detail.formId || "";
    let sub = e.currentTarget.dataset.subject;
    saveFormIds({
      data: {
        appopenid: app.globalData.openid,
        formid: formid
      },
      complete () {
        wx.navigateTo({
          url: '../measurement/measure_index?subject=' + sub,
        });
      }
    });
  },
})