// registSuccess.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    action:"",//页面状态
    successText: "注册成功",//显示文本
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.action) {
      this.setData({
        action: options.action,
      });
      if (options.action == "resetpass") {
        this.setData({
          successText: "修改成功",
        });
      }
    }
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


})