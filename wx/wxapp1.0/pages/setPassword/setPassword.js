// setPassword.js
const { resetPassword} = require("../../utils/api.js");
const { testPsw} = require("../../utils/util.js");
const { errMsg } = require("../../utils/static.js");
Page({
  data: {
    userNo: "",//用户账号
    psw: "",//用户密码
    code: "",//用户输入的验证码
    secondPsw: "",//第二次输入的密码
    userType: "school",
    schoolid: "",
    fromuuid: "",
    nextState: false,//下一步的状态
    action: "",//进入页面的行为
  },
  onLoad: function (options) {
    console.log(options);
    let data;
    if (options.data){
      data = JSON.parse(options.data);
      if (data.userNo){
        this.setData({
          userNo: data.userNo,
          userType: data.userType,
          code: data.inputSecurityCode,
        });
      }else{
        wx.navigateBack({});
        return;
      }
      if (data.fromuuid) {
        this.setData({
          fromuuid: data.fromuuid,
        });
      }
      if (data.schoolid) {
        this.setData({
          schoolid: data.schoolid,
          userType: "teacher",
        });
      }
      if (data.action != "") {
        this.setData({
          action: data.action,
        });
      }
    }
  },
  onHide: function () {
    wx.hideLoading();
  },
  setPassword(e) {
    const self = this;
    let psw = e.detail.value;
    if (!testPsw(psw)){
      wx.showToast({
        title: '密码安全级别太低，请重新输入！',
      });
      return ;
    }
    self.setData({
      psw: psw
    });
    self.checkData();
  },
  checkpassword(e) {
    const self = this;
    let secondPsw = e.detail.value;
    self.setData({
      secondPsw: secondPsw
    });
    self.checkData();
  },
  //所有数据是否填写正确
  checkData() {
    let fpsw = false;
    let spsw = false;
    const self = this;
    if (self.data.psw != "") {
      fpsw = true;
    }
    if (self.data.secondPsw != "") {
      spsw = true;
    }
    if (fpsw && spsw) {
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
    if (self.data.psw != self.data.secondPsw){
      wx.showModal({
        title: '提示',
        content: '两次密码输入必须一致！',
        showCancel:false,
      })
      return;
    }
    if (self.data.action == "resetpass"){
      //重设密码
      wx.showLoading({
        title: '重设密码中...',
      });
      resetPassword({
        data: {
          code: self.data.code,
          newpass: self.data.psw,
          mobile: self.data.userNo,
        },
        success (res) {
          if(res.data.ok){
            wx.redirectTo({
              url: '../registSuccess/registSuccess?action=resetPassword',
            });
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
                  content: "请求异常，请稍后再试!",
                  showCancel: false,
                  success: function (res) {
                  }
                });
              }
            } else {
              wx.showModal({
                title: '提示',
                content: "请求异常，请稍后再试!",
                showCancel: false,
                success: function (res) {
                }
              });
            }
          }
        },
      });
    }else{
      wx.navigateTo({
        url: '../complateInfo/complateInfo?data=' + JSON.stringify(self.data),
      })
    }
  }
})