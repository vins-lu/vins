const { apiURL, errorCode, errMsg, serviceTel } = require("./static.js");
const { parseJson } = require("./util.js");
const app = getApp();
//数据请求
const wxRequest = (url, params) => {
  wx.request({
    url,
    method: params.method || 'POST',
    data: params.data || {},
    header: {
      Accept: 'application/json',
      "Content-Type": params.ContentType || "application/x-www-form-urlencoded"
    },
    success(res) {
      let data = typeof res.data == "string" ? parseJson(res.data) : res.data;
      if (data.ok || data.rows != null) {
        typeof params.success == "function" && params.success(data);
      } else {
        data.lang && wx.showModal({
          title: '错误',
          content: errMsg[data.lang],
        });
        data.errcode && wx.showModal({
          title: '错误',
          content: errorCode[data.errcode],
        });
        wx.showToast({
          title: '网络请求错误',
          image: '../../images/icon/errorTip.png',
          duration: 2000,
        });
      }
    },
    fail(res) {
      if (params.fail) {
        params.fail(res);
      }else{
        wx.showModal({
          title: '请求失败！',
          content: '请检查网络后，重新请求!',
        });
      }
    },
    complete(res) {
      wx.hideLoading();
      typeof params.complete == "function" && params.complete(res);
    },
  });
};
//登录
const login = (params) => {
  wxRequest(`${apiURL}/users.wxlogin`, params);
};
//初始化
const userInit = (params) => {
  wxRequest(`${apiURL}/users.wxinit`, params);
};
//注册
const regist = (params) => {
  wxRequest(`${apiURL}/users.selfregist`, params);
};
//获取验证码
const getCode = (params) => {
  wxRequest(`${apiURL}/validcodes.mobilecode`, params);
}
//获取图片验证码
const getImgCode = () => {
  let date = new Date();
  return apiURL + '/validcodes.show?__t' + date.getTime();
}
//检验验证码是否正确
const checkmobilecode = (params) => {
  wxRequest(`${apiURL}/validcodes.checkmobilecode`, params);
}
//获取学校详情
const getSchoolDetail = (params) => {
  wxRequest(`${apiURL}/schools.getdetail`, params);
}
//注册学校
const registSchool = (params) => {
  wxRequest(`${apiURL}/schools`, params);
}
//获取用户的详细信息
const getUserinfo = (params) => {
  wxRequest(`${apiURL}/users.getuserinfo`, params);
}
//上传图片
const uploadImg = (params) => {
  let url = 'users.privatefile';
  wx.uploadFile({
    url: `${apiURL}/${url}`,
    filePath: params.files,
    name: params.fileName,
    formData: params.formData,
    success(res) {
      let data = typeof res.data == "string" ? JSON.parse(res.data) : res.data;
      if (data.ok || data.rows != null){
        typeof params.success == "function" && params.success(data);
      }else{
        data.lang && wx.showModal({
          title: '错误',
          content: errMsg[data.lang],
        });
        data.errcode && wx.showModal({
          title: '错误',
          content: errorCode[data.errcode],
        });
        wx.showToast({
          title: '上传失败',
          image: '../../images/icon/errorTip.png'
        });
      }
    },
    fail(res) {
      wx.showToast({
        title: '上传失败',
        image: '../../images/icon/errorTip.png'
      });
      typeof params.fail == "function" && params.fail(res);
    },
    complete(res) {
      typeof params.complete == "function" && params.complete(res);
    },
  })
};
//上传文件结束
const uploadEnd = (params) => {
  wxRequest(`${apiURL}/client.enduploadpaper`, params);
}
const paperInfo = (params) => {
  wxRequest(`${apiURL}/client.paperinfo`, params);
}
//获取已经完成的试卷的列表
const getPaperlist = (params) => {
  wxRequest(`${apiURL}/client.paperlist`, params);
}
//获取及初始化科目
const getProject = (params) => {
  wxRequest(`${apiURL}/system.listclassifies`, params);
}
//获取消息列表
const notesList = (params) => {
  wxRequest(`${apiURL}/notes.list`, params);
}
//修改密码
const resetPassword = (params) => {
  wxRequest(`${apiURL}/users.setpassword`, params);
}
//获取某次试卷包的信息
const fetchReport = (params) => {
  wxRequest(`${apiURL}/stat.fetchreport`, params);
}
//向服务器发送推送码
const saveFormIds = (params) => {
  wxRequest(`${apiURL}/client.savewxappformid`, params);
}

module.exports = {
  login,//登录
  regist,//注册
  uploadImg,//上传图片
  uploadEnd,//上传文件结束
  paperInfo,//试卷详细信息
  getCode,//获取验证码
  getImgCode,//获取图片验证码
  checkmobilecode,//检验验证码是否正确
  getSchoolDetail,//获取学校详情
  registSchool,//注册学校
  getUserinfo,//获取用户详细信息
  getPaperlist,//获取已经完成的试卷的列表
  getProject,//获取及初始化科目
  notesList,////获取消息列表
  resetPassword,//修改密码
  fetchReport,//获取某次试卷包的信息
  saveFormIds,//向服务器发送推送码
  userInit,//用户初始化
};
