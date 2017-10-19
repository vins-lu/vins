//login.js
const { login, getImgCode } = require("../../utils/api.js");
const { errMsg } = require("../../utils/static.js");
const { checkMobile } = require("../../utils/util.js");
const app = getApp();
Page({
  data: {
    userNo: "",//用户账号
    pass: "",//密码
    errcount: 0,//出错次数
    code:"",//验证码
    codeImg:"",//验证码图片
  },
  onLoad: function (options) {
  },
  userLogin() {
    const self = this;
    if (!checkMobile(self.data.userNo)){
      wx.showToast({
        title: '请输入正确的手机号!',
      });
      self.setData({
        userNo: "",
      });
      return ;
    }
    if (self.data.pass.length < 3){
      wx.showToast({
        title: '请输入正确的密码!',
      });
      self.setData({
        pass: "",
      });
      return;
    }
    if (self.data.errcount >= 1 && self.data.code == ""){
      wx.showToast({
        title: '请输入验证码!',
      });
      self.setData({
        code: "",
      });
      return;
    }
    wx.showLoading({
      title: '登录中',
    });
    let data = { mobile: self.data.userNo, pass: self.data.pass };
    if (self.data.errcount >= 1){
      data["code"] = self.data.code;
    }
    login({
      data: data,
      success: function (res) {
        if (res.data.errcode == 1006 || res.data.errcode == 1100 || res.data.errcode == 1004) {
          //是否需要输入验证码
          let codeUrl = getImgCode();
          self.setData({
            errcount: self.data.errcount + 1, 
            codeImg: codeUrl,
          });
        }
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
      },
      error: function (err) {
        console.log(err);
      }
    })
  },
  codeLogin() {
    //短信验证码登录
    wx.navigateTo({
      url: '../otherLogin/otherLogin?action=login',
    })
  },
  forgetPsw() {
    //找回密码
    wx.navigateTo({
      url: '../otherLogin/otherLogin?action=resetpass',
    })
  },
  regist () {
    wx.navigateTo({
      url: '../regist/regist',
    })
  },
  checkUser(e) {
    const self = this;
    const userNo = e.detail.value;
    self.setData({
      userNo: userNo
    });
  },
  checkPass(e) {
    const self = this;
    var pass = e.detail.value;
    self.setData({
      pass: pass
    });
  },
  checkcode(e) {
    const self = this;
    var code = e.detail.value;
    self.setData({
      code: code
    });
  },
  refreshCode() {
    let codeUrl = getImgCode();
    this.setData({
      codeImg: codeUrl,
    })
  }
})
