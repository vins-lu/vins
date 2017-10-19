// complateInfo.js
const { getSchoolDetail, regist, getCode, registSchool} = require("../../utils/api.js");
const { gradeList, errMsg } = require("../../utils/static.js");
const app = getApp();
Page({
  data: {
    userNo: "",//用户账号
    psw: "",//用户密码
    userName: "",//用户姓名
    school: "",//用户学校
    schoolid: null,//用户学校id
    schoolInfo: {},//学校信息
    duty: { name: "", detail:"请选择您的职务"},//职务
    dutyList: [{ name: "teacher", detail: "老师", }, { name: "classmain", detail: "班主任", }, { name: "superteacher", detail: "年级主任", }],//职务列表
    classid:"",//班级
    gradeid: { name: "", detail: "请选择您所在的年级"},//年级
    complateState: false,//完成的状态
    userType: "school",
    fromuuid:"",//代理id
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const self = this;
    let data = JSON.parse(options.data);
    console.log(data);
    this.setData({
      userNo: data.userNo,
      psw: data.psw,
      userType: data.userType,
    });
    if (data.fromuuid) {
      this.setData({
        fromuuid: data.fromuuid,
      });
    }
    if (data.schoolid){
      this.setData({
        schoolid: data.schoolid,
        userType: "teacher",
      });
      getSchoolDetail({
        data: {
          uuid: app.globalData.uuid,
          schoolid: data.schoolid,
        },
        success(res) {
          if(res.data.ok){
            self.setData({
              schoolInfo: res.data.detail,
            });
          }else{
            self.setData({
              schoolInfo: {
                fullname: "获取中...",
              },
            });
            wx.showToast({
              title: '获取学校信息错误!',
            });
          }
        }
      });
    }
  },

  onReady: function () {
  },

  onShow: function () {
  },
  onHide: function () {
    wx.hideLoading();
  },
  onUnload: function () {
  },
  checkUserName(e) {
    const self = this;
    let userName = e.detail.value;
    self.setData({
      userName: userName
    });
    this.checkData();
  },
  checkSchool(e) {
    const self = this;
    let school = e.detail.value;
    self.setData({
      school: school
    });
    this.checkData();
  },
  //所有数据是否填写正确
  checkData() {
    let userName = false;
    let school = false;
    let duty = false;
    let gradeid = false;
    const self = this;
    if (self.data.userName != "") {
      userName = true;
    }
    if (self.data.school != "") {
      school = true;
    }
    if (self.data.gradeid != "") {
      gradeid = true;
    }
    if (self.data.duty.name != "") {
      duty = true;
    }
    //设置完成状态
    
    if (self.data.schoolid != "" && self.data.usertype != "school"){
      if (self.data.duty.name == "superteacher"){//年级主任
        console.log("年级主任");
        if (userName && gradeid) {
          self.setData({
            complateState: true,
          });
          return;
        }
      }else{
        if (userName) {
          self.setData({
            complateState: true,
          });
          return;
        }
      }
    } else if (self.data.usertype == "school"){
      if (userName && school) {
        self.setData({
          complateState: true,
        });
        return;
      } else {
        self.setData({
          complateState: false,
        });
        return;
      }
    }
    self.setData({
      complateState: false,
    });
    console.log(self.data.complateState);
  },
  //设置职务
  setDuty(e) {
    const self = this;
    wx.showActionSheet({
      itemList: self.data.dutyList.map((item) => item.detail),
      success: function (res) {
        if (typeof res.tapIndex != "undefined"){
          self.setData({
            duty: {
              name: self.data.dutyList[res.tapIndex].name,
              detail: self.data.dutyList[res.tapIndex].detail,
            },
          });
        }
      },
      fail: function (res) {
        console.log(res.errMsg);
      },
      complete: function (res) {
        self.checkData();
      }
    })
  },
  //选择年级
  selectGrade(e) {
    const self = this;
    wx.showActionSheet({
      itemList: gradeList.map((item) => item.text),
      success: function (res) {
        if (typeof res.tapIndex != "undefined") {
          self.setData({
            gradeid: {
              name: gradeList[res.tapIndex].val,
              detail: gradeList[res.tapIndex].text,
            },
          });
        }
      },
      fail: function (res) {
        console.log(res.errMsg)
      },
      complete: function (res) {
        self.checkData();
      }
    })
  },
  //选择班级
  // selectClass(e) {
  //   wx.showActionSheet({
  //     itemList: ['A', 'B', 'C'],
  //     success: function (res) {
  //       console.log(res.tapIndex)
  //     },
  //     fail: function (res) {
  //       console.log(res.errMsg)
  //     }
  //   })
  // },
  //设置年级
  // setGrade(e) {
  //   const self = this;
  //   let gradeid = e.detail.value;
  //   self.setData({
  //     gradeid: gradeid,
  //   });
  //   self.checkData();
  // },
  //设置班级
  // setClass(e) {
  //   const self = this;
  //   let classid = e.detail.value;
  //   self.setData({
  //     classid: classid,
  //   });
  //   self.checkData();
  // },
  //注册
  complate(e) {
    const self = this;
    let usertype = self.data.userType == "school" ? "school" : self.data.duty.name;
    let data = {
      usertype: usertype,//super|admin | service | region | agent | school | superschool | teacher | superteacher | classmain
      mobile: self.data.userNo,
      name: self.data.userName,
      pass: self.data.psw,
      // needchangepass:1，如果本值存在且不为空，那么表示用户第一次登陆时必须要修改这个密码
    };
    if(self.data.schoolid){
      data["schoolid"] = self.data.schoolid;
    }
    if (usertype != "school" && self.data.duty.name == "") {
      wx.showToast({
        title: '请选择职务',
      });
      return;
    }
    if (usertype == "school"){
      // data["schoolid"] = self.data.school;
      if (self.data.school == "") {
        wx.showToast({
          title: '请输入学校名称',
        });
        return;
      }
    }
    if (usertype == "superteacher") {
      data["gradeid"] = self.data.gradeid.name;
      if (self.data.gradeid.name == "") {
        wx.showToast({
          title: '请选择年级',
        });
        return;
      }
    }
    if (usertype == "school"){
      wx.showLoading({
        title: '注册中...',
      });
      registSchool({
        data:{
          uuid: self.data.fromuuid,
          fullname: self.data.userName,
          manager: self.data.userNo,
          managername: self.data.userName,
          pass: self.data.psw,
          needchangepass: '0',
        },
        success (res) {
          if(res.data.ok){
            wx.redirectTo({
              url: '../registSuccess/registSuccess',
            })
          } else {
            let errContent = '注册失败';
            if (res.data.lang && errMsg[res.data.lang]){
              errContent = errMsg[res.data.lang];
            }
            wx.showModal({
              title: '提示',
              content: errContent,
              showCancel: false,
              success: function (res) {
                if (res) {
                  wx.redirectTo({
                    url: '../regist/regist',
                  })
                }
              }
            })
          }
        }
      });
    }else{
      wx.showLoading({
        title: '注册中...',
      });
      regist({
        data: data,
        success(res) {
          if(res.data.ok){
            wx.redirectTo({
              url: '../registSuccess/registSuccess',
            })
          } else {
            let errContent = '注册失败';
            if (res.data.lang && errMsg[res.data.lang]) {
              errContent = errMsg[res.data.lang];
            }
            wx.showModal({
              title: '提示',
              content: errContent,
              showCancel: false,
              success: function (res) {
                if (res) {
                  wx.redirectTo({
                    url: '../regist/regist',
                  })
                }
              }
            })
          }
        }
      });
    }
  }
})