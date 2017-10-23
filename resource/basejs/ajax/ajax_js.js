/*
    "name": "query",
    "version": "2.0.0",
    "description": "基于原生javascript的ajax请求封装,对象参数版本",
    "author": "vins <luyuchen627@gmail.com>",
*/
function query(opt) {
    if(!opt){
        return false;
    }
    opt.method = opt.method.toUpperCase() || 'POST';
    opt.url = opt.url || '';
    if(!opt.url || opt.url == "") {
        return false;
    }
    opt.async = opt.async || true;
    opt.contentType = opt.contentType || 'application/x-www-form-urlencoded;charset=utf-8';//上传文件需要改变contentType
    opt.data = opt.data || null;
    opt.success = opt.success || function () {};
    opt.error = opt.error || function () {};
    var xmlHttp = null;
    //创建xmlHttp对象
    if (XMLHttpRequest) {
        xmlHttp = new XMLHttpRequest();
    }
    else {
        xmlHttp = new ActiveXObject('Microsoft.XMLHTTP');
    }
    //格式化请求参数
    var params = [];
    for (var key in opt.data){
        params.push(key + '=' + opt.data[key]);
    }
    var postData = params.join('&');
    if (opt.method.toUpperCase() === 'POST') {
        xmlHttp.open(opt.method, opt.url, opt.async);
        xmlHttp.setRequestHeader('Content-Type', opt.contentType);
        xmlHttp.send(postData);
    }
    else if (opt.method.toUpperCase() === 'GET') {
        xmlHttp.open(opt.method, opt.url + '?' + postData, opt.async);
        xmlHttp.send(null);
    } 
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
            typeof(opt.success) === "function" ? opt.success(xmlHttp.responseText) : throw new Error("success is not a function");
        }else{
            typeof(opt.error) === "function" ? opt.error(xmlHttp.responseText) : throw new Error("error is not a function");
        }
        if(opt.complate){
            typeof(opt.complate) === "function" ? opt.complate() : throw new Error("complate is not a function");
        }
    };
}