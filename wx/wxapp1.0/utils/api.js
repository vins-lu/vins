// const apiURL = 'http://api.lm.com';
const apiURL =  'http://api.laoshidongni.com';
const serverURL = 'https://laoshidongni.com';
const codeUrl = apiURL + '/validcodes.show';

const wxRequest = (url, params) => {
  wx.request({
    url,
    method: params.method || 'POST',
    data: params.data || {},
    header: {
      Accept: 'application/json',
      // 'Content-Type': 'application/json',
      "Content-Type": "application/x-www-form-urlencoded"
    },
    success(res) {
      wx.hideLoading();
      if (params.success) {
        params.success(res);
      }
    },
    fail(res) {
      wx.hideLoading();
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
      if (params.complete) {
        params.complete(res);
      }
    },
  });
};
//登录
const login = (params) => {
  wxRequest(`${apiURL}/users.managerlogin`, params);
};
//注册
const regist = (params) => {
  wxRequest(`${apiURL}/users.selfregist`, params);
};
//websocket向pc客户端发消息
const wswrite = (params) => {
  wxRequest(`${apiURL}/system.wswrite`, params);
}
//ajax向私有数据写入要回传到pc端的数据
const writePrivateData = (params) => {
  wxRequest(`${apiURL}/users.privatedata`, params);
}
//获取验证码
const getCode = (params) => {
  wxRequest(`${apiURL}/validcodes.mobilecode`, params);
}
//获取图片验证码
const getImgCode = () => {
  let date = new Date();
  return codeUrl +"?__t" + date.getTime();
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
  let action = params.action;
  let url = '';
  switch(action){
    case "uploadtopackage":
      url = 'upload.uploadfile';
      break;
    case "exam_upload_papers":
      url = "users.privatefile";
      break;
    case "exam_replace_papers":
      url = "examine.uploadpapers";
      break;
    default:
      break;
  }
  wx.uploadFile({
    url: `${apiURL}/${url}`,
    filePath: params.files,
    name: params.fileName,
    formData: params.formData,
    success(res) {
      if (params.success) {
        params.success(res);
      }
    },
    fail(res) {
      if (params.fail) {
        params.fail(res);
      }
    },
    complete(res) {
      if (params.complete) {
        params.complete(res);
      }
    },
  })
};
//获取已经完成的试卷的列表
const getUploadinfo = (params) => {
  wxRequest(`${apiURL}/upload.listfiles`, params);
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

module.exports = {
  login,//登录
  regist,//注册
  wswrite,//websocket回传信息
  uploadImg,//上传图片
  writePrivateData,//写私有数据
  getCode,//获取验证码
  getImgCode,//获取图片验证码
  checkmobilecode,//检验验证码是否正确
  getSchoolDetail,//获取学校详情
  registSchool,//注册学校
  getUserinfo,//获取用户详细信息
  getUploadinfo,//获取已经完成的试卷的列表
  getProject,//获取及初始化科目
  notesList,////获取消息列表
  resetPassword,//修改密码
  fetchReport,//获取某次试卷包的信息
};
