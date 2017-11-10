// pages/examlist/examlist.js
const { getPaperlist } = require("../../utils/api.js");
const { errMsg, errorCode, uploadStatus } = require("../../utils/static.js");
const app = getApp();
let self;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    editState: false,
    currentSub: 'math',
    exams: [],
    selectedTotal: 0,
    uploadStatus: uploadStatus,
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
        self.setData({
          exams: res.rows,
        });
      }
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
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  },
  changeSub(e) {
    let sub = e.currentTarget.dataset.sub;
    self.setData({
      currentSub: sub
    });
  },
  edit() {
    self.setData({
      editState: true,
    });
  },
  showDetail(e) {
    if (self.data.editState){
      let index = e.currentTarget.dataset.index;
      let exams = self.data.exams;
      let selectedexams;
      exams[index]['selected'] = exams[index]['selected'] ? !exams[index]['selected'] : true;
      selectedexams = exams.filter((item) => { return item.selected === true;});
      self.setData({
        exams,
        selectedTotal: selectedexams.length
      });
    } else {
      let status = e.currentTarget.dataset.status;
      let backreason = e.currentTarget.dataset.backreason;
      let paperid = e.currentTarget.dataset.paperid;
      if (backreason != "none"){
        wx.navigateTo({
          url: '../errorFiles/errorFiles?paperid=' + paperid,
        });
      } else {
        wx.showModal({
          title: '提示',
          content: '试卷正在' + uploadStatus[status],
        });
      }
    }
  },
  selectComplate() {
    wx.showActionSheet({
      itemList: ["删除"],
      success: function (res) {
        if (res.tapIndex == 0){
          if (self.data.selectedTotal == 0){
            wx.showToast({
              title: '请选择一个文件',
              image: '../../images/icon/tip.png'
            })
          }else{
            console.log("执行删除操作");
            self.setData({
              editState: false
            });
          }
        }
      },
      fail: function (res) {
        self.setData({
          editState: false
        });
      }
    })
  },
  selectCancel() {
    self.setData({
      editState: false,
    });
  }
})