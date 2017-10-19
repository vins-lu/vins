//index.js
const { uploadImg, login } = require("../../utils/api.js");
const { errMsg, errorCode } = require("../../utils/static.js");
const app = getApp();
let self;
Page({
  data: {
    files: [],
    currentImg: 0,
  },
  onLoad: function (options) {
    self = this;
  },
  onShow: function() {
  },
  chooseImg() {
    wx.chooseImage({
      success: function(res) {
        self.setData({
          files: [...self.data.files, ...res.tempFilePaths]
        });
        self.upload();
      },
    })
  },
  upload() {
    //检测用户的网络状态
    wx.getNetworkType({
      success: function (res) {
        // 返回网络类型, 有效值：
        // wifi/2g/3g/4g/unknown(Android下不常见的网络类型)/none(无网络)
        var networkType = res.networkType;
        if (networkType != "wifi" && networkType != "4g") {
          if (networkType == "none") {
            wx.showModal({
              title: '网络提示',
              content: '目前您与这个世界已经脱轨！请检查网络后重试!',
              success(res) {
                if (res.confirm) {
                  return;
                }
              },
            })
            return;
          }
          wx.showModal({
            title: '网络提示',
            content: '目前您处于' + networkType + '状态，是否继续？',
            success(res) {
              if (res.confirm) {
                self.uploadImgOneByOne(self.data.currentImg);
              } else if (res.cancel) {
                return;
              }
            },
          })
        } else {
          wx.showLoading({
            title: '文件上传中...',
          });
          self.uploadImgOneByOne(self.data.currentImg);
        }
      }
    })
  },
  uploadImgOneByOne(index) {
    let formData = {
      uuid: app.globalData.uuid,
      filetype: "papers",
      filefrom: "wxapp",
    };
    if (self.data.fileid && self.data.fileid != "") {
      formData["fileid"] = self.data.fileid;
    }
    uploadImg({
      files: self.data.files[index],
      fileName: "file" + index,
      formData: formData,
      success(res) {
        var data = res;
        if (index < self.data.files.length - 1) {
          index++;
          self.setData({
            currentImg: index,
          });
          self.uploadImgOneByOne(index);
        } else {
          self.setData({
            files: [],
            currentImg: 0,
          });
          wx.hideLoading();
          wx.showModal({
            title: '提示',
            content: '文件上传成功，即将跳转到我的试卷页！',
            showCancel: false,
            success(res) {
              if (res) {
                wx.navigateTo({
                  url: '../examlist/examlist',
                })
              }
            }
          })
        }
      },
    })
  }
})
