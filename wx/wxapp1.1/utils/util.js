const app = getApp();
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
function getProjectImg(projectName) {
  var imgName = "math";
  var _projectName = projectName.toString().toLowerCase();
  switch (_projectName) {
    case "语文":
      imgName = "chinese";
      break;
    case "数学":
      imgName = "math";
      break;
    case "英语":
      imgName = "english";
      break;
    case "物理":
      imgName = "physic";
      break;
    case "化学":
      imgName = "chemistry";
      break;
    case "生物":
      imgName = "biology";
      break;
    case "地理":
      imgName = "geography";
      break;
    case "历史":
      imgName = "history";
      break;
    case "政治":
      imgName = "political";
      break;
    default:
      break;
  }
  return imgName; 
}
//检查是否为json字符串
function parseJson(str) {
  if (typeof str == 'string') {
    try {
      var obj = JSON.parse(str);
      if (str.search('/^\{/') > -1 || str.search('/^\[/') > -1) {
        return obj;
      } else {
        return false;
      }

    } catch (e) {
      console.log(e);
      return false;
    }
  }
  return false;
}

module.exports = {
  formatTime,
  formatNumber,
  checkMobile,//检查手机号
  testPsw,//检查密码安全级别
  parseJson,//检查是否为json字符串
}
