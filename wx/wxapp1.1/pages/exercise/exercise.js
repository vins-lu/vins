// pages/exercise/exercise.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    state: "exercise",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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
  startExercise (e) {
    wx.showModal({
      title: '开始练习',
      content: '请准备一张纸和一支笔，安静的坐下后，开始练习。可能会占用大约15分钟的时间。\n 做完题后，查看解析。',
      cancelText: '退出',
      confirmText: '开始练习',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定');
          wx.navigateTo({
            url: '../doExercises/doExercises?index=0',
          });
        } else if (res.cancel) {
        }
      }
    });
  },
  startTest (e) {
    wx.navigateTo({
      url: '../doTests/doTests',
    });
  }
})