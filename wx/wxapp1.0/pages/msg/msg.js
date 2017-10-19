// msg.js
const { notesList } = require("../../utils/api.js");
const { errMsg, msgType} = require("../../utils/static.js");
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    msgList:[],//消息列表
    msgType: msgType,//消息类型
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getNodeList();
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
    this.getNodeList();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },
  getNodeList () {
    const self = this;
    notesList({
      data: {
        uuid: app.globalData.uuid,
        recvtype: 'forme',
      },
      success(res) {
        wx.stopPullDownRefresh();
        if (res.data && res.data.rows) {
          self.setData({
            msgList: res.data.rows,
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
                }
              });
            }
          } else {
            wx.showModal({
              title: '提示',
              content: "获取消息列表失败!",
              showCancel: false,
              success: function (res) {
              }
            });
          }
        }
      }
    });
  }
})