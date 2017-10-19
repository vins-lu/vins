// otherLogin.js
const { getCode, checkmobilecode, login} = require("../../utils/api.js");
const { checkMobile } = require("../../utils/util.js");
const { errMsg } = require("../../utils/static.js");
const app = getApp();
Page({
  data: {
    userNo: "",//用户账号
    inputSecurityCode: "",//用户输入的验证码
    nextState: false,//下一步的状态
    getCodeText: "发送",//验证码的获取状态，未获取时为发送，获取中为倒计时
    getCodeStatus: false,
    action:"",
  },
  onLoad: function (options) {
    if (options.action){
      this.setData({
        action: options.action,
      });
    }else{
      wx.navigateBack({});
    }
  },

  onReady: function () {
  },

  onShow: function () {
  },

  onHide: function () {
  },
  onUnload: function () {
  },
  setUser(e) {
    const self = this;
    let userNo = e.detail.value;
    self.setData({
      userNo: userNo
    });
    this.checkData();
  },
  checkUser(e) {
    if (!checkMobile(this.data.userNo)) {
      wx.showToast({
        title: '请输入正确的手机号!',
      });
    }
  },
  checkSecurityCode(e) {
    const self = this;
    let inputSecurityCode = e.detail.value;
    self.setData({
      inputSecurityCode: inputSecurityCode
    });
    this.checkData();
  },

  //获取验证码
  getSecurityCode(e) {
    const self = this;
    let time = 60;
    let countdownTimer = null;
    if (!checkMobile(self.data.userNo)) {
      wx.showToast({
        title: '请输入正确的手机号',
      });
      return;
    }
    //设置获取验证码的状态
    self.setData({
      getCodeStatus: true,
    });
    //设置倒计时
    countdownTimer = setInterval(function () {
      self.setData({
        getCodeText: time + "s",
      });
      time--;
      if (time <= 0) {
        clearInterval(countdownTimer);
        self.setData({
          getCodeStatus: false,
          getCodeText: "重新获取",
        });
      }
    }, 1000);

    getCode({
      data: {
        mobile: self.data.userNo,
        reason: self.data.action,
      },
      success: function (res) {
        if (res.data.ok) {
          //获取验证码成功
          wx.showToast({
            title: '验证码已发送到您的手机!',
          });
        } else {
          if (res.data.lang) {
            let errormsg = errMsg[res.data.lang];
            if (errormsg) {
              wx.showToast({
                title: errMsg[res.data.lang],
              });
            } else {
              wx.showToast({
                title: '请稍后再试',
              });
            }
          }else{
            wx.showToast({
              title: '请求异常，请稍后再试！',
            });
          }
          return;
        }
      },
    });
  },
  //所有数据是否填写正确
  checkData() {
    let userNo = false;
    let code = false;
    const self = this;
    if (checkMobile(self.data.userNo)) {
      userNo = true;
    }
    if (self.data.inputSecurityCode != "" && self.data.inputSecurityCode.length >= 4) {
      code = true;
    }
    if (userNo && code) {
      self.setData({
        nextState: true,
      });
    } else {
      self.setData({
        nextState: false,
      });
    }
  },
  //下一步
  nextStep(e) {
    const self = this;
    if (!checkMobile(self.data.userNo)) {
      wx.showToast({
        title: '请输入正确的手机号!',
      });
      return;
    }
    
    if (self.data.action == "login"){
      wx.showLoading({
        title: '登陆中...',
      });
      login({
        data: {
          mobile: self.data.userNo,
          vcode: self.data.inputSecurityCode,
        },
        success(res) {
          if (res.data.ok) {
            app.globalData.uuid = res.data.uuid;
            app.globalData.userInfo = res.data.userinfo;
            app.globalData.schools = res.data.schools;
            wx.showModal({
              title: '提示',
              content: '登录成功',
              showCancel: false,
              success: function (res) {
                wx.switchTab({
                  url: '../index/index',
                });
              }
            })
          } else {
            if (res.data.lang) {
              let errormsg = errMsg[res.data.lang];
              if (errormsg) {
                wx.showModal({
                  title: '提示',
                  content: errMsg[res.data.lang],
                  showCancel: false,
                  success: function (res) {
                    self.setData({
                      pass: "",
                    });
                  }
                });
              } else {
                wx.showModal({
                  title: '提示',
                  content: "登陆失败，请检查账号和密码后重新登录!",
                  showCancel: false,
                  success: function (res) {
                  }
                });
              }
            } else {
              wx.showModal({
                title: '提示',
                content: "登陆失败，请检查账号和密码后重新登录!",
                showCancel: false,
                success: function (res) {
                }
              });
            }
          }
        }
      });
    } else if (self.data.action == "resetpass"){
      // checkmobilecode({
      //   data: {
      //     mobile: self.data.userNo,
      //     code: self.data.inputSecurityCode,
      //     reason: "resetpass",
      //   },
      //   success(res) {
      //     console.log(res);
      //     if (res.data.ok) {
      //       wx.navigateTo({
      //         url: '../setPassword/setPassword?action=resetPassword',
      //       })
      //     } else {
      //       wx.showToast({
      //         title: '请输入正确的验证码!',
      //       });
      //       return;
      //     }
      //   }
      // });
      wx.navigateTo({
        url: '../setPassword/setPassword?data=' + JSON.stringify(self.data),
      })
    }
  }

})