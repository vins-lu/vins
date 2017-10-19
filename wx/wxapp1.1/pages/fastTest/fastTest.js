// pages/fastTest/fastTest.js
let self;
let timingTimer;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    startPageState: true,
    index: 0,
    total: 5,
    timingState: true,
    timing: {
      minute: 0,
      second: 0,
    },
    problem: [0, 1, 2, 3, 4],
    answers: [],
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
  beginTest() {
    self.setData({
      startPageState: false,
    });
    self.stratTiming();
  },
  stratTiming() {
    timingTimer = setInterval(function () {
      let minute = self.data.timing.minute;
      let second = self.data.timing.second;
      second++;
      if (second == 60) {
        minute++;
        second = 0;
      }
      self.setData({
        timing: {
          minute,
          second,
        }
      });
    }, 1000);
  },
  endTiming() {
    clearInterval(timingTimer);
  },
  next(e) {
    if (self.data.index < self.data.total - 1) {
      //下一题
      let answers = self.data.answers;
      answers.push(e.currentTarget.dataset.value);
      self.setData({
        answers,
        index: self.data.index + 1
      });
    } else {
      //已完成所有题
      self.endTiming();
      wx.showModal({
        title: '提示',
        content: '已完成所有的测试，即将跳转到分析页面',
        showCancel: false,
        success(res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '../testAnalysis/testAnalysis',
            });
          }
        }
      })
    }

    console.log(self.data.answers);
  },
})