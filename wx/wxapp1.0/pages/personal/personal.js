// personal.js
const { getUserinfo, getSchoolDetail } = require("../../utils/api.js");
const { errMsg, dutyList } = require("../../utils/static.js");
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLogin: false,//是否登录
    userIcon: "",//用户头像
    userinfo: {},//用户信息
    schools:[],//学校列表
    schoolinfo:[],//学校信息
    currentSchool:{},//当前学校
    duty: dutyList,//职务信息
    themeIndex:0,//当前主题下标
    themes: ['主题一', '主题二', '主题三', '主题四', '主题五', '主题六', '主题七', '主题八'],//主题
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const self = this;
    //调用应用实例的方法获取全局数据
    app.getWXUserInfo(function(userInfo){
      //更新数据
      self.setData({
        userIcon: userInfo.avatarUrl,
      })
    });
    if (app.globalData.uuid == "") {
      this.setData({
        isLogin: false,
      });
    } else {
      this.setData({
        isLogin: true,
        userinfo: app.globalData.userInfo,
        schools: app.globalData.schools,
      });
      console.log(app.globalData.userInfo);
    }
    if (self.data.schools.length > 0) {
      for (var i = 0; i < self.data.schools.length; i++) {
        getSchoolDetail({
          data: {
            uuid: app.globalData.uuid,
            schoolid: self.data.schools[i].schoolid
          },
          success(res) {
            if (res.data.ok) {
              console.log(res);
              self.setData({
                schoolinfo: [...self.data.schoolinfo, res.data.detail],
              });
              self.setData({
                currentSchool: {
                  schoolid: self.data.schoolinfo[0].schoolid,
                  schoolname: self.data.schoolinfo[0].fullname,
                },
              });
            }
          }
        });
      }
    }
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
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    this.setData({
      schoolinfo: [],
    });
  },
  //退出登录
  exit () {
    wx.showModal({
      title: '退出登录',
      content: '您是否确认退出登录？',
      success(res) {
        if (res.confirm){
          app.globalData.uuid = "";
          app.globalData.userInfo = null;
          app.globalData.schools = [];
          wx.redirectTo({
            url: '../login/login',
          });
        } else if (res.cancel) {
          return ;
        }
      }
    })
  },
  //获取用户信息
  getUser () {
    const self = this;
    getUserinfo({
      data: {
        uuid: app.globalData.uuid,
        who: app.globalData.uuid,
      },
      success (res) {
        console.log(res);
        if(res.data.ok){
          this.setData({
            userinfo: res.data.userinfo
          });
        }else{
          wx.showModal({
            title: '登陆失败',
            content: '登录异常，请重新登录!',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                wx.redirectTo({
                  url: '../login/login',
                });
              } 
            }
          })
        }
      }
    });
  },
  //切换学校
  toggleSchool () {
    const self = this;
    wx.showActionSheet({
      itemList: this.data.schoolinfo.map(item => item.fullname),
      success: function (res) {
        console.log(res.tapIndex);
        self.setData({
          currentSchool: {
            schoolid: self.data.schoolinfo[res.tapIndex].schoolid,
            schoolname: self.data.schoolinfo[res.tapIndex].fullname,
          }
        });
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    })
  },
  //选择主题
  selectTheme (e) {
    this.setData({
      themeIndex: e.detail.value
    })
    app.globalData.themeName = this.data.themeIndex;
  }
})