/*
    "name": "parseJson",
    "version": "1.0.0",
    "description": "检测是否是json对象或者json数组",
    "author": "vins <luyuchen627@gmail.com>",
*/

//检查是否为json字符串
function parseJson(str) {
  if (typeof str == 'string') {
    try {
      if (str.search('/^\{/') > -1 || str.search('/^\[/') > -1) {
        var obj = JSON.parse(str);
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

export default {
  parseJson
}