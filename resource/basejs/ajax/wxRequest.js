/*
	"name": "wxRequest",
	"version": "1.0.0",
	"description": "基于微信小程序版本的ajax请求封装,对象参数版本",
	"author": "vins <luyuchen627@gmail.com>",
*/

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