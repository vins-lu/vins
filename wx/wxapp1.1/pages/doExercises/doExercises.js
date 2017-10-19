// pages/doExercises/doExercises.js
let self;
let timingTimer;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    index: 0,
    total: 5,
    timingState: true,
    timing: {
      minute: 0,
      second: 0,
    },
    problem: [0,1,2,3,4],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    self = this;
    self.setData({
      index: parseInt(options.index)
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
    self.stratTiming();
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
  stratTiming() {
    timingTimer = setInterval(function(){
      let minute = self.data.timing.minute;
      let second = self.data.timing.second;
      second++;
      if (second == 60) {
        minute++;
        second = 0;
      }
      self.setData({
        timing:{
          minute,
          second,
        }
      });
    },1000);
  },
  endTiming() {
    clearInterval(timingTimer);
  },
  pre () {
    //上一题
    self.setData({
      index: self.data.index - 1
    });
  },
  next () {
    //下一题
    self.setData({
      index: self.data.index + 1
    });
  },
  complate () {
    //完成练习
    self.endTiming();
    wx.navigateTo({
      url: './analysis',
    });
  },
})