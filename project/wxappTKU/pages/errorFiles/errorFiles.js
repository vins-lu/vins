// pages/errorFiles/errorFiles.js
const { uploadImg, uploadEnd, paperInfo } = require("../../utils/api.js");
const { errMsg, errorCode } = require("../../utils/static.js");
const app = getApp();
let self;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    paperid: "",
    fileid: "",
    errorImg: [],
    file: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    self = this;
    self.setData({
      paperid: options.paperid,
    });
    paperInfo({
      data: {
        appopenid: app.globalData.openid,
        paperid: self.data.paperid
      },
      success(res) {
        let data = res.data;
        let err_file = [];
        let files = typeof data.files_info == "string" ? JSON.parse(data.files_info) : data.files_info;
        if (data.back_fileid) {
          err_file.push(files[data.back_fileid - 1]);
          self.setData({
            errorImg: err_file,
            fileid: data.back_fileid,
          });
        }
      }
    });
  },
  reUpload() {
    wx.showActionSheet({
      itemList: ['重新上传'],
      success: function (res) {
        if (res.tapIndex == 0){
          console.log('重新上传');
          wx.chooseImage({
            count: 1,
            success: function (res) {
              self.setData({
                file: res.tempFilePaths
              });
              wx.showLoading({
                title: '文件上传中...',
              });
              self.replaceImg();
            },
          })
        }
      },
    })
  },
  replaceImg() {
    let formData = {
      appopenid: app.globalData.openid,
      filetype: "papers",
      filefrom: "wxapp",
    };
    uploadImg({
      files: self.data.file[0],
      fileName: "file0",
      formData: formData,
      success(res) {
        console.log(res);
        uploadEnd({
          data: {
            appopenid: app.globalData.openid,
            fileid: self.data.fileid,
            privatefileid: res.files[0].fileid,
            paperid: self.data.paperid,
            hadread: true,
          },
          success(res) {
            wx.hideLoading();
            wx.showModal({
              title: '提示',
              content: '文件替换成功！',
              showCancel: false,
              success(res) {
                if (res) {
                  wx.redirectTo({
                    url: '../examlist/examlist',
                  })
                }
              }
            });
          }
        });
      }
    })
  }
})