function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}
//检查手机号格式
function checkMobile(mobile) {
  let str = String(mobile);
  let reg = /^((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8}$/;
  return reg.test(str) ? true : false;
}
function testPsw(str) {
  var reg = /^([a-zA-Z0-9]){6,32}$/;
  if (reg.test(str)) {
    var reg2 = /[a-zA-Z]*[0-9]+/;
    if (reg2.test(str)) {
      var reg3 = /[0-9]*[a-zA-Z]+/;
      if (reg3.test(str)) {
        return true;
      } else
        return false;
    }
    return false;
  } else {
    return false;
  }
}
//获取地理位置
function getLocation(cb) {
  wx.getLocation({
    type: 'wgs84',
    success: function (res) {
      if (typeof cb == "function"){
        cb(res);
      }
    },
    fail: function () {
      wx.showToast({
        title: '获取地理位置失败!',
        image: '../images/icon/errorTip.png',
        duration: 1000
      })
    }
  });
}

module.exports = {
  formatTime,
  formatNumber,
  getLocation,
  checkMobile,//检查手机号
  testPsw,//检查密码安全级别
}
