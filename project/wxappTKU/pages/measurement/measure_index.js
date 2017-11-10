const { saveFormIds } = require("../../utils/api.js");
const app = getApp();
let self;
Page({
  data: {
    subject:'mathematics',
    subjectText:'数学',
  },
  onLoad: function (options) {
    self = this;
    self.setData({
      subject: options.subject,
    }); 
    self.changesubject();
  },
  //页面事件
  phototap(e) {
    let formid = e.detail.formId || "";
    saveFormIds({
      data: {
        appopenid: app.globalData.openid,
        formid: formid
      },
      complete() {
        wx.navigateTo({
          url: '../uploadFiles/uploadFiles',
        });
      }
    });
  },
  pentap(e) {
    let formid = e.detail.formId || "";
    saveFormIds({
      data: {
        appopenid: app.globalData.openid,
        formid: formid
      },
      complete() {
        wx.navigateTo({
          url: '../doTests/doTests',
        });
      }
    });
  },
  changesubject() {
    var s = "";
    if (self.data.subject == "mathematics") {
      s = "数学";
    } else if (self.data.subject == "physice") {
      s = "物理";
    } else if (self.data.subject == "chemistry") {
      s = "化学";
    }
    self.setData({
      subjectText: s,
    });
  },
  close() {
    wx.switchTab({
      url: '../evaluation/evaluation',
    })
  },
})