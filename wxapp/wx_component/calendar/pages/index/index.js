//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
  },
  //事件处理函数
  onLoad: function () {
  },
  onselect(e) {
    let { year, month, day, week} = e.detail;
    let showContent = `${year}-${month}-${day}`;
    if (week) {
      showContent += ` | 第${week}周`
    }
    wx.showModal({
      title: '选择的时间',
      content: showContent,
    })
  }
})
