const { getCode, checkmobilecode} = require("../../utils/api.js");
const { checkMobile } = require("../../utils/util.js");
const { errMsg } = require("../../utils/static.js");
const app = getApp();
Page({
  data: {
    userNo:"",//用户账号
    inputSecurityCode:"",//用户输入的验证码
    nextState:false,//下一步的状态
    getCodeText:"发送",//验证码的获取状态，未获取时为发送，获取中为倒计时
    getCodeStatus:false,
    userType:"parents",
    childName: "",//孩子姓名
  },
  onLoad: function (options) {
    this.getlLocation();
  },

  onReady: function () {
  },
  onShow: function () {
  },
  onHide: function () {
    wx.hideLoading();
  },
  onUnload: function () {
    //初始化数据
    this.setData({
      data: {
        userNo: "",//用户账号
        inputSecurityCode: "",//用户输入的验证码
        nextState: false,//下一步的状态
        getCodeText: "发送",//验证码的获取状态，未获取时为发送，获取中为倒计时
        getCodeStatus: false,
        childName: "",//孩子姓名
        location: "",
      },
    })
  },
  getlLocation() {
    const self = this;
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success: function (res) {
        var latitude = res.latitude
        var longitude = res.longitude
        self.setData({
          location: "中国"
        });
      }
    })
  },
  setUser(e){
    const self = this;
    let userNo = e.detail.value;
    self.setData({
      userNo: userNo
    });
  },
  checkUser() {
    if (this.data.userNo == ""){
      return;
    }
    if (!checkMobile(this.data.userNo)) {
      wx.showModal({
        title: '提示',
        content: '请输入正确的手机号!',
      });
    }
  },
  setChildName(e){
    const self = this;
    let childName = e.detail.value;
    self.setData({
      childName: childName
    });
  },
  checkChildName(e){
    if (this.data.childName == "") {
      wx.showModal({
        title: '提示',
        content: '请输入孩子的姓名!',
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
    if (!checkMobile(self.data.userNo)){
      wx.showModal({
        title: '提示',
        content: '请输入正确的手机号',
      });
      return;
    }
    //设置获取验证码的状态
    self.setData({
      getCodeStatus: true,
    });
    //设置倒计时
    countdownTimer = setInterval(function(){
      self.setData({
        getCodeText: time + "s",
      });
      time --;
      if(time <=0){
        clearInterval(countdownTimer);
        self.setData({
          getCodeStatus: false,
          getCodeText:"重新获取",
        });
      }
    },1000);
    
    getCode({
      data: { 
        mobile: self.data.userNo,
        reason: "register"
      },
      success: function (res) {
        if(res.data.ok){
          //获取验证码成功
          wx.showToast({
            title: '验证码已发送!',
          });
        }else{
          if(res.data.lang){
            let errormsg = errMsg[res.data.lang];
            if (errormsg){
              wx.showToast({
                title: errMsg[res.data.lang],
              });
            }else {
              wx.showToast({
                title: '请稍后再试',
                images: "../images/icon/errorTip.png"
              });
            }
          } else {
            wx.showToast({
              title: '请求异常',
              images: "../images/icon/errorTip.png"
            });
          } 
          return ;
        }
      },
    });
  },
  //所有数据是否填写正确
  checkData() {
    let userNo = false;
    let code = false;
    const self = this;
    if (checkMobile(self.data.userNo)){
      userNo = true;
    }
    if (self.data.inputSecurityCode != "" && self.data.inputSecurityCode.length >= 4) {
      code = true;
    }
    if (userNo && code){
      self.setData({
        nextState: true,
      });
    }else{
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
        images: '../images/icon/tip.png'
      });
      return ;
    }
    wx.showLoading({
      title: '验证中...',
    });
    checkmobilecode({
      data:{
        mobile: self.data.userNo,
        code: self.data.inputSecurityCode,
        reason: "register",
      },
      success (res) {
        if(res.data.ok){
          wx.navigateTo({
            url: '../setPassword/setPassword?data=' + JSON.stringify(self.data),
          })
        }else{
          wx.showToast({
            title: '请输入正确的验证码!',
            images: '../images/icon/tip.png'
          });
          return;
        }
      }
    });
  }
})