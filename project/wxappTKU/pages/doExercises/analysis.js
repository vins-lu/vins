// pages/doExercises/analysis.js
let self;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    index: 0,
    total: 5,
    problem: [0, 1, 2, 3, 4],
    analysis: [0, 1, 2, 3, 4],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    self = this;
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
  
  },
  pre() {
    //上一题
    self.setData({
      index: self.data.index - 1
    });
  },
  next() {
    //下一题
    self.setData({
      index: self.data.index + 1
    });
  },
  complate() {
    //完成练习
    wx.switchTab({
      url: '../exercise/exercise',
    });
  },
})