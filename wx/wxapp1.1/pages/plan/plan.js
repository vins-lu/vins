// pages/plan/plan.js
let self;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentSub: 'math',
    showType: "day",
    diaryScrollL: 0,
    defMoverX: 50,
  },
  onLoad: function (options) {
    self = this;
  },
  onShow: function () {
    self.setData({
      diaryScrollL: 100
    });
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
  changeSub(e) {
    self.setData({
      currentSub: e.currentTarget.dataset.type
    });
  },
  changeShowType(e) {
    self.setData({
      showType: e.currentTarget.dataset.type
    });
  },
  scrollToLeft(e) {
    // console.log(e);
  },
  moveS(e) {
    console.log(1);
    if (e.touches.length == 1) {
      this.setData({
        //设置触摸起始点水平方向位置
        startX: e.touches[0].clientX
      });
    }
  },
  showPreMonth(e) {
    // console.log(2);
    // if (diaryScrollL < 50){
    //   if (e.touches.length == 1) {
    //     let moveX = e.touches[0].clientX;
    //     let disX = this.data.startX - moveX;
    //     var defMoverX = this.data.defMoverX;

    //     if (disX >= 0) {
    //     }else if (disX < 0) {
    //       if (Math.abs(disX) >= defMoverX) {
    //         console.log("左滑");
    //       }
    //     }
    //   }
    // }
    console.log("展示上一个月的数据");
  }
})