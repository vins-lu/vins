
function typeis (obj, type){
    if (!type) {
        throw new Error("Miss required parameter -- type");
    }
    if (type != "RegExp" && type != "HTMLDocument"){
        type = type.toString().toLowerCase();
        type = type.substr(0,1).toUpperCase() + type.substring(1);
    }
    // var types = ["Array", "Boolean", "Date", "Number", "Object", "RegExp", "String", "Window", "HTMLDocument"];
    return Object.prototype.toString.call(obj) === "[object " + type + "]";
}
if (!Object.prototype.isEmpty) {
    Object.defineProperty(Object.prototype, "isEmpty", {
        value: function() {
            "use strict";
            for (var k in this) {
                return false;
            }
            return true;
        },
        enumerable: false,
        configurable: true,
        writable: true,
    }); 
}
function typeJudge (payload, typelimit, strict) {//payload待检验参数,typelimit类型限制,strict严格模式
    var userStrict = true || strict;
    var errs = {
        '001': '自定义数据格式限制不正确',
        '002': '字段的限制格式错误',
        '003': '%all字段的限制格式错误',

        '101': '字段没有限制',
        '102': '字段格式错误',
        '103': '为必填项',
        '104': '不符合自定义的数据类型',
        '105': '不是一个数字类型',
        '106': '不是一个字符串类型',
        '107': '不是一个布尔类型',
        '108': '不是一个枚举(字符串)类型',
        '109': '不是一个对象类型',
        '110': '不是一个数组类型',
        '111': '不能为空数组',
        '112': '不能为空对象',
        '113': '不是一个数字或者字符串类型',
        '114': '不在规定的范围内',
        '115': '字段位数不满足规定',
    }
    var types = {
        '^\\*': function (key, val) {//必填项
            if (!val || val == "") {
                var errKey = key || 'parameter';
                return {ok: false, errMsg: errKey + errs['103']};
            } else {
                return {ok: true};
            }
        },
        '%all': function (key, val, pattern) {//应用于所有字段
            var errKey = key || 'parameter';
            if (typeis(pattern, 'function')) {
                return pattern(key, val) ? {ok: true} : {ok: false, errMsg: errKey + errs['104']};
            } else if (typeis(pattern, 'RegExp')) {
                return pattern.test(val) ? {ok: true} : {ok: false, errMsg: errKey + errs['104']};
            } else {
                throw new Error(errs["001"]);
            }
        },
        '%n': function (key, val) {//数字
            var errKey = key || 'parameter';
            return typeis(val, 'number') ? {ok: true} : {ok: false, errMsg: errKey + errs['105']};
        },
        '%s': function (key, val) {//字符串
            var errKey = key || 'parameter';
            return typeis(val, 'string') ? {ok: true} : {ok: false, errMsg: errKey + errs['106']};
        },
        '%b': function (key, val) {//布尔值
            var errKey = key || 'parameter';
            return typeis(val, 'boolean') ? {ok: true} : {ok: false, errMsg: errKey + errs['107']};
        },
        '%e': function (key, val) {//枚举(只针对字符串枚举)
            var errKey = key || 'parameter';
            return typeis(val, 'string') ? {ok: true} : {ok: false, errMsg: errKey + errs['108']};
        },
        '%o': function (key, val) {//对象
            var errKey = key || 'parameter';
            return typeis(val, 'object') ? {ok: true} : {ok: false, errMsg: errKey + errs['109']};
        },
        '%a': function (key, val) {//数组
            var errKey = key || 'parameter';
            return typeis(val, 'array') ? {ok: true} : {ok: false, errMsg: errKey + errs['110']};
        },
        '%v': function (key, val, pattern) {//自定义
            var errKey = key || 'parameter';
            if (typeis(pattern, 'function')) {
                return pattern(key, val) ? {ok: true} : {ok: false, errMsg: errKey + errs['104']};
            } else if (typeis(pattern, 'RegExp')) {
                return pattern.test(val) ? {ok: true} : {ok: false, errMsg: errKey + errs['104']};
            } else {
                throw new Error(errs["001"]);
            }
        },
        '\\(nem\\)': function (key, val) {//数据或者对象不能为空notEmpty
            var errKey = key || 'parameter';
            if (typeis(val, 'array')) {
                return val.length > 0 ? {ok: true} : {ok: false, errMsg: errKey + errs['111']};
            } else if (typeis(val, 'object')) {
                return val.isEmpty() ? {ok: false, errMsg: errKey + errs['112']} : {ok: true};
            }
        },
        
        '\\(\\d+\\)': function (key, val, digit) {//位数
            var errKey = key || 'parameter';
            if (userStrict && (!typeis(val, 'number') && !typeis(val, 'string'))) {
                return {ok: false, errMsg: errKey + errs['113']};
            }
            var v = val && val.toString().length;
            var d = digit && parseInt(digit.slice(1, -1)) || 0;
            return v == d ? {ok: true} : {ok: false, errMsg: errKey + errs['115']};
        },
        '\\(\\d+,\\d+\\)': function (key, val, range) {//范围
            var errKey = key || 'parameter';
            if (userStrict && !typeis(val, 'number')) {
                return {ok: false, errMsg: errKey + errs['105']};
            }
            var r = range && range.split(",");
            var v = val >>> 0;
            var min = r[0].slice(1) >>> 0;
            var max = r[1].slice(0,-1) >>> 0;
            return (v > min && v < max) ? {ok: true} : {ok: false, errMsg: errKey + errs['114']};
        },
        '\\[.+\\]': function (key, val, enumRange) {//枚举范围
            var errKey = key || 'parameter';
            if (userStrict && !typeis(val, 'string')) {
                return {ok: false, errMsg: errKey + errs['108']};
            }
            var isExist = false;
            var enums = enumRange && enumRange.slice(1, -1).split(",");
            for (var i = 0, l = enums.length; i < l; i++) {
                if (val === enums[i].replace(/[\"\']/g,"")) {
                    isExist = true;
                    break;
                }
            }
            return isExist ? {ok: true} : {ok: false, errMsg: errKey + errs['114']};
        },
        '\\{\\d+,\\d+\\}': function (key, val, range) {//位数
            var errKey = key || 'parameter';
            if (userStrict && (!typeis(val, 'number') && !typeis(val, 'string'))) {
                return {ok: false, errMsg: errKey + errs['113']};
            }
            var r = range && range.slice(1, -1).split(",");
            var v = val && val.toString().length;
            var min = r[0] >>> 0;
            var max = r[1] >>> 0;
            return (v >= min && v <= max) ? {ok: true} : {ok: false, errMsg: errKey + errs['115']};
        },
    }

    if (typeis(payload, "object")) {
        if (typeis(typelimit, "object")) {
            if (typelimit["%all"]) {
                var superLimit = typelimit["%all"];
                var limit = superLimit.limit || superLimit;
                var errMsg = superLimit.errMsg;
                var pattern = superLimit.pattern || superLimit;

                if (typeis(superLimit, 'object') || typeis(superLimit, 'string')) {
                    for (var p in payload) {
                        for (var k in types) {
                            if (new RegExp("(" + k + ")").test(limit)) {
                                var res;
                                if (k == "%v" && typeis(superLimit, 'object')) {
                                    res = types[k](p, payload[p], pattern);
                                } else {
                                    res = types[k](p, payload[p], RegExp.$1);
                                }
                                if (!res.ok) {
                                    return errMsg || res.errMsg || errs["102"];
                                }
                            }
                        }
                    }
                } else if (typeis(superLimit, 'RegExp')) {
                    for (var p in payload) {
                        var res = types["%all"](p, payload[p], superLimit);
                        if (!res.ok) {
                            return errMsg || res.errMsg || errs["102"];
                        }
                    }
                } else {
                    throw new Error(errs["003"]);
                }
            } else{
                for (var p in payload) {
                    if (typelimit[p]){
                        if (typeis(typelimit[p], 'object') || typeis(typelimit[p], 'string')) {
                            var limit = typelimit[p].limit || typelimit[p];//字段限制
                            var errMsg = typelimit[p].errMsg;//自定义错误信息
                            var pattern = typelimit[p].pattern || typelimit[p];//自定义匹配方式

                            for (var k in types) {
                                if (new RegExp("(" + k + ")").test(limit)) {
                                    var res;
                                    if (k == "%v" && typeis(typelimit[p], 'object')) {
                                        res = types[k](p, payload[p], pattern);
                                    } else {
                                        res = types[k](p, payload[p], RegExp.$1);
                                    }
                                    if (!res.ok) {
                                        return errMsg || res.errMsg || errs["102"];
                                    }
                                }
                            }
                        } else if (typeis(typelimit[p], 'RegExp')) {
                            var res = types["%all"](p, payload[p], typelimit[p]);
                            if (!res.ok) {
                                return errMsg || res.errMsg || errs["102"];
                            }
                        } else {
                            throw new Error(p + "errs[002]");
                        }
                    } else {
                        console.log(p + errs["101"]);
                    }
                }
            }
        } else if (typeis(typelimit, "string")) {
            for (var p in payload) {
                for (var k in types) {
                    if (new RegExp("(" + k + ")").test(typelimit)) {
                        var res = types[k](p, payload[p], RegExp.$1);
                        if (!res.ok) {
                            return errMsg || res.errMsg || p + errs["102"];
                        }
                    }
                }
            }
        } else if (typeis(typelimit, "RegExp")) {
            for (var p in payload) {
                var res = types["%all"](p, payload[p], typelimit);
                if (!res.ok) {
                    return errMsg || res.errMsg || errs["102"];
                }
            }
        } else {
            console.log(payload + errs["101"]);
        }
    } else {
        if (typelimit){
            if (typeis(typelimit, 'object') || typeis(typelimit, 'string')) {
                var limit = typelimit.limit || typelimit;
                var errMsg = typelimit.errMsg;
                var pattern = typelimit.pattern || typelimit;
                for (var k in types) {
                    if (new RegExp("(" + k + ")").test(limit)) {
                        var res;
                        if (k == "%v" && typeis(typelimit, 'object')) {
                            res = types[k](null, payload, pattern);
                        } else {
                            res = types[k](null, payload, RegExp.$1);
                        }
                        if (!res.ok) {
                            return errMsg || res.errMsg || errs["102"];
                        }
                    }
                }
            } else if (typeis(typelimit, 'RegExp')) {
                var res = types["%all"](null, payload, typelimit);
                if (!res.ok) {
                    return errMsg || res.errMsg || payload + errs["102"];
                }
            } else {
                throw new Error(payload + "errs[002]");
            }
        } else {
            console.log(payload + errs["101"]);
        }
    }
    return {ok: true};
}

/*
 * 文档说明:
 *      以" * "开头的匹配为必填项
 *      以" % "开头的为类型匹配,其中
 *          "%n": 匹配number(数字)类型;
 *          "%s": 匹配string(字符串)类型;
 *          "%b": 匹配boolean(布尔)类型;
 *          "%e": 匹配emty(枚举)类型;
 *          "%o": 匹配object(对象)类型;
 *          "%a": 匹配array(数组)类型;
 *      " %all "字段为全局匹配,其中可以分为三种方式
 *          字符串，正则表达式，对象；
 *          对象类型参照typelimit参数的对象类型介绍
 *      " %v "字段为自定义匹配，只限参数为对象类型的格式使用
 *          自定义类型可用字段 {
 *                              limit: "%v",  //声明为自定义类型，如果不是"%v"，则会覆盖pattern的设置
 *                              errMsg: "",   //自定义错误提示
 *                              pattern: "",  //类型为正则表达式，函数（返回Boolean类型）
 *                           }
 *      " (nem) "字段为不能为空的限制
 *      " (n) "字段为位数的限制，类型必须是字符串或者数字，n为限制的位数，精准判断
 *      " {n1,n2} "字段为位数的限制，类型必须是字符串或者数字，n1为最小位数,n2为最大的位数，精准判断
 *      " (n1,n2) "字段为数字的范围限制，n1 必须小于n2,中间不能有空格
 *      " [a,b,c,d] "字段为枚举类型的限制，类型是字符串，枚举值中间不能有空格，
 *      
 *      typelimit参数:
 *          object: typelimit参数中如果包含"%all"字段则为全局匹配，会忽略其他字段
 *                  如果要检测的是对象，
 *                      typelimit参数中的键与要检测的键一致，
 *                      多一个不影响，少一个会忽略该键的检测
 *                  如果要检测为普通值：
 *                      typelimit参数可以为字符串，正则，和对象
 *                          对象的格式为 {
 *                              limit: "",  //声明为自定义类型，如果是"%v"，则为自定义匹配
 *                              errMsg: "",   //自定义错误提示
 *                              pattern: "",  //类型为，正则表达式，函数（返回Boolean类型）
 *                           }
 *      strict参数：
 *          严格模式，默认打开，严格匹配类型(建议不要关闭)
*/
