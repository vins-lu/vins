const app = getApp();
const { uploadImg} = require("../../utils/api.js");
const { errMsg } = require("../../utils/static.js");
// pages/upload/uploadImg.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    files:[],
    action:"",
    currentImg:0,
    returnFiles:[],
    editState:false,
    uploadid:'',
    "type":"",
    fileid:"",
    platform:"wxapp",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.uuid){ 
      app.globalData.uuid = options.uuid;
      this.setData({
        action:options.action,
      });
      if (options.fileid){
        this.setData({
          fileid: options.fileid,
        })
      }
      if (options.type) {
        this.setData({
          "type": options.type,
        })
      }
      if (options.uploadid) {
        this.setData({
          uploadid: options.uploadid,
        })
      }
      if (options.examineid) {
        this.setData({
          examineid: options.examineid,
        })
      }
    }else{
      // app.globalData.uuid = "rkGCGYQO0sTaRL-BQC5Qfjooooo9gLl0TQGL6QO";
      // this.setData({
      //   action: "exam_upload_papers",
      // });
    }

    app.globalData.uuid = "rkGCGYQO0sTaRL-BQC5Qfjooooo9gLl0TQGL6QO";
    this.setData({
      action: "exam_upload_papers",
    });

  },
//studentpapers,stdanswer
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    console.log("ready");
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // //清除页面缓存
    // this.setData({
    //   files: [],
    //   currentImg: 0,
    //   returnFiles: [],
    //   editState: false,
    // });
    if (wx.onNetworkStatusChange){
      wx.onNetworkStatusChange((res) => {
        if (!res.isConnected){
          wx.showToast({
            title: '没有网络链接',
          });
        }else{
          wx.showToast({
            title: '已切换到' + res.networkType + '网络',
          });
        }
      });
    }else{
      wx.showModal({
        title: '系统版本提示',
        content: '您当前的版本不支持网络状态的查询，如需更好的体验，请升级到最新的版本',
        mask:false,
        success (res){
          if(res.confirm){
            
          }
        }
      })
    }
    //如果没有选择任何图片，调出选择图片界面
    if(this.data.files.length <=0){
      this.chooseImage();
    }
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
    //清除页面缓存
    this.setData({
      files: [],
      action: "",
      currentImg: 0,
      returnFiles: [],
      editState: false,
      uploadid: '',
      "type": "",
      fileid: "",
      platform: "wxapp",
    });
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  // onPullDownRefresh: function () {
  //   wx.stopPullDownRefresh();
  // },


  /**
   * 用户点击右上角分享
   */
  // onShareappMessage: function () {
    // return;
  // },
  chooseImage() {
    const self = this;
    let count = this.data.fileid == "" ? 9 : 1;//如果有fileid，则表示替换文件
    console.log(count);
    wx.chooseImage({
      count: count, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        self.setData({
          files: [...self.data.files,...res.tempFilePaths]
        });
      }
    })
  },
  previewImage(e) {
    const self = this;
    const index = e.currentTarget.dataset.index;
    console.log(index);
    wx.previewImage({
      current: self.data.files[index],
      urls: self.data.files,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  addImg() {
    this.chooseImage();
  },
  upload() {
    const self = this;
    var filetype = "papers";

    if (self.data.action == "exam_upload_papers") {
      filetype = "papers";
    } else if (self.data.action == "package_upload_ucards") {
      filetype = "papers";
    }

    //检测用户的网络状态
    wx.getNetworkType({
      success: function (res) {
        // 返回网络类型, 有效值：
        // wifi/2g/3g/4g/unknown(Android下不常见的网络类型)/none(无网络)
        var networkType = res.networkType;
        if (networkType != "wifi"){
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
            success (res){
              if (res.confirm) {
                self.uploadImgOneByOne(self.data.currentImg);
              } else if (res.cancel) {
                return;
              }
            },
          })
        } else{
          self.uploadImgOneByOne(self.data.currentImg);
        }
      }
    })
  },
  wswriteMsg() {
    const self = this;
    wx.hideLoading();
    wswrite({
      data: {
         touuid: app.globalData.uuid,
         cmd: "returnFiles",
         data: JSON.stringify(self.data.returnFiles),
       },
       success(res) {
         if(res.data.ok){
          // self.setData({
          //   returnFiles: [],
          //   editState: false,
          // });
         }else{
           if (res.data.lang) {
             let errormsg = errMsg[res.data.lang];
             if (errormsg) {
               wx.showToast({
                 title: errMsg[res.data.lang],
               });
             } else {
               wx.showModal({
                 title: '提示',
                 content: '回传失败,是否继续尝试？',
                 cancelText: "重新上传",
                 confirmText: "继续尝试",
                 success: function (res) {
                   if (res.confirm) {
                     self.wswriteMsg();
                   } else if (res.cancel) {
                     self.setData({
                       files: [],
                       currentImg: 0,
                       returnFiles: [],
                       editState: false,
                     });
                   }
                 }
               });
             }
           } else {
             wx.showModal({
               title: '提示',
               content: '回传失败,是否继续尝试？',
               cancelText: "重新上传",
               confirmText: "继续尝试",
               success: function (res) {
                 if (res.confirm) {
                   self.wswriteMsg();
                 } else if (res.cancel) {
                   self.setData({
                     files: [],
                     currentImg: 0,
                     returnFiles: [],
                     editState: false,
                   });
                 }
               }
             });
           }
         }
       },
    });
  },
  uploadImgOneByOne(index) {
    const self = this;
    let formData = {};
    switch(self.data.action){
      case "uploadtopackage":
          formData = {
            uuid: app.globalData.uuid,
            uploadid: self.data.uploadid,
            "type": self.data.type,
            platform: self.data.platform,
            returnfull:1,
          };
          if (self.data.fileid && self.data.fileid != "") {
            formData["fileid"] = self.data.fileid;
          }
        break;
      case "exam_upload_papers":
        formData = {
          filetype: "papers",
          filefrom: "wxapp",
          uuid: app.globalData.uuid,
        };
        if (self.data.fileid && self.data.fileid != "") {
          formData["fileid"] = self.data.fileid;
        }
        break;
      case "exam_replace_papers":
        formData = {
          uuid: app.globalData.uuid,
          examineid: self.data.examineid,
          fileid: self.data.fileid,
          filefrom: "wxapp",
        };
        break;
      default:
        break;
    }
    wx.showLoading({
      title: '已上传0张',
      mask: true,
    });
    uploadImg({
      files: self.data.files[index],
      fileName: "file" + index,
      action: self.data.action,
      formData: formData,
      success(res) {
        console.log(res);
        var data = JSON.parse(res.data);
        console.log(data);
        if (data.ok) {
          wx.hideLoading();
          wx.showLoading({
            title: '已上传' + (index + 1) + "张",
            mask: true,
          });
          if (formData.returnfull && formData.returnfull == 1){
            self.setData({
              returnFiles: [...data.files],
              currentImg: index + 1,
            });
          }else{
            self.setData({
              returnFiles: [...self.data.returnFiles, ...data.files],
              currentImg: index + 1,
            });
          }
          console.log(index);
          if(index < self.data.files.length - 1){
            index ++;
            self.setData({
              currentImg:index,
            });
            self.uploadImgOneByOne(index);
          }else{
            self.setData({
              files:[],
              currentImg:0,
            });
            wx.hideLoading();
            wx.showModal({
              title: '提示',
              content: '文件上传成功',
              showCancel:false,
              success(res) {
                if(res){
                  self.wswriteMsg();
                  self.writePrivate();
                }
              }
            })
          }
        } else {
          if (data.lang) {
            let errormsg = errMsg[res.data.lang];
            if (errormsg) {
              wx.showToast({
                title: errMsg[res.data.lang],
              });
            } else {
              wx.showToast({
                title: '上传失败',
              });
            }
          }
        }
      },
      fail(res) {
        console.log(res);
        wx.showModal({
          title: '错误',
          content: '请检查网络后，重新测试!',
        })
      },
    })
  },
  deleteCurrentImg(e) {
    var index = e.currentTarget.dataset.index;
    this.data.files.splice(index, 1);
    this.setData({
      files:this.data.files,
    });
  },
  changeEditState() {
    this.setData({
      editState:true,
    });
  },
  writePrivate() {
    const self = this;
    writePrivateData({
      data: {
        uuid: app.globalData.uuid,
        action: 'set',
        name: 'upload_blank_papers',
        outtime: 3000,
        data: JSON.stringify(self.data.returnFiles),
      },
      success(res) {
        console.log(res);
        if(res.data.ok){
          self.setData({
            returnFiles: [],
            editState: false,
          });
          wx.redirectTo({
            url: '../index/index',
          });
        }else{
          if (res.data.lang) {
            let errormsg = errMsg[res.data.lang];
            if (errormsg) {
              wx.showToast({
                title: errMsg[res.data.lang],
              });
            } else {
              wx.showToast({
                title: '写入私有文件库失败',
              });
            }
          } else {
            wx.showModal({
              title: '提示',
              content: '写入私有文件库失败,是否继续尝试？',
              cancelText: "重新上传",
              confirmText: "继续尝试",
              success: function (res) {
                if (res.confirm) {
                  self.writePrivate();
                } else if (res.cancel) {
                  self.setData({
                    files: [],
                    currentImg: 0,
                    returnFiles: [],
                    editState: false,
                  });
                }
              }
            });
          }
        }
      },
      fail(res) {
        wx.showModal({
          title: '提示',
          content: '写入私有文件库失败,是否继续尝试？',
          cancelText:"重新上传",
          confirmText:"继续尝试",
          success: function (res) {
            if (res.confirm) {
              self.writePrivate();
            } else if (res.cancel) {
              self.setData({
                files: [],
                currentImg: 0, 
                returnFiles: [],
                editState: false,
              });
            }
          }
        });
      }
    });
  }
})