// pages/personal/personal.js
const { getPaperlist } = require("../../utils/api.js");
const { errMsg, errorCode } = require("../../utils/static.js");
const app = getApp();
let self;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl: "../../images/icon/def_avatarUrl.png",
    nickName: "vins",
    examNums: 0,
    errorExamNums: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    self = this;
    getPaperlist({
      data: {
        appopenid: app.globalData.openid,
        method: 'listall',
        orderby: 'createtime',
        orderasc: 1,
      },
      success(res) {
        let errorExam = res.rows.filter((item) => { return item.back_reason != 'none';});
        self.setData({
          examNums: res.rows.length,
          errorExamNums: errorExam.length
        });
      }
    });
    self.setData({
      avatarUrl: app.globalData.wxUserInfo.avatarUrl,
      nickName: app.globalData.wxUserInfo.nickName,
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})