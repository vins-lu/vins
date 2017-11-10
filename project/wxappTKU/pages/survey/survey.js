const { userInit } = require("../../utils/api.js");
const { dealFormIds } = require("../../utils/util.js");
const app = getApp();
// pages/survey/survey.js
let self;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentGrade: 8,//默认年级（初一）
    nickname: "",
    loading: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    self = this;
  },
  changeGrade(e) {
    self.setData({
      currentGrade: e.currentTarget.dataset.grade
    });
  },
  setNickname(e) {
    self.setData({
      nickname: e.detail.value
    });
  },
  formSubmit(e) {
    let formId = e.detail.formId;
    console.log(formId);
    // dealFormIds(formId); //处理保存推送码
    if (self.data.nickname == ""){
      wx.showToast({
        title: '请输入昵称',
        image: '../../images/icon/tip.png'
      });
      return;
    }
    self.setData({
      loading: true,
    });

    try {
      var sysInfo = wx.getSystemInfoSync();
    } catch (e) {
      console.log("获取设备信息失败!");
    }
    userInit({
      data: {
        appopenid: app.globalData.openid,
        gradeid: self.data.currentGrade,
        nickname: self.data.nickname,
        brand: sysInfo.brand,
        model: sysInfo.model,
      },
      success (res) {
        self.setData({
          loading: true,
        });
        app.globalData.isexist = true;
        wx.redirectTo({
          url: './result',
        })
      }
    });
  }
})