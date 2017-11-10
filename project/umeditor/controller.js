// session是Object，该Object必须包含的数据：{ url = 'http://打开richeditor时的基础域名不要加/', token = 'xxxxx', dataid = '开启编辑器时的dataid', name = '开启编辑器时的name' }
// callback则是一个回调事件，用于通知外部以下几种情况：connected=连接成功，closed=已断开，session-error=通过session这个object请求数据出错
function openUMEditorController(session, callback) {
    if (typeof window.UMEditorWrap == 'undefined')
        window.UMEditorWrap = {};

    var ws = null, svrhost = 'ws://localhost:16868/editor';
    var connected = false, connecting = true, iden = [session.token, session.dataid, session.name].join('');

    var obj = window.UMEditorWrap[iden];
    if (obj && obj.ws) {
        ws = obj.ws;
        return obj.ctl;

    } else if (!obj) {
        window.UMEditorWrap[iden] = {};
    }

    var openws = function(seid) {
        ws = new WebSocket(svrhost);

        ws.onopen = function(evt) {
            connected = true;
            connecting = false;
            ws.send(['login:', seid, '|', session.token].join(''));
        }
        ws.onmessage = function(evt) {
            var txt = evt.data;
            if (txt) {
                var cmdEnd = txt.indexOf(':');
    
                if (cmdEnd > 1) {
                    var cmd = txt.substr(0, cmdEnd);
                    var data = txt.substr(cmdEnd + 1);

                    if (cmd == 'login') {
                        window.UMEditorWrap[iden].ws = ws;
                        if (callback)
                            callback('connected');

                    } else if (cmd == 'saved') {
    					if (callback) callback(data);

                    } else {
                    }
                }
            }
        }
        ws.onclose = function(evt) {
            if (callback)
                callback('closed');

            connected = false;
            window.UMEditorWrap[iden] = null;

            window.setTimeout(function() {
                if (!connected && !connecting) {
                    ws = new WebSocket(svrhost);
                    connecting = true;
                }
            }, 1);
        }
        ws.onerror = function(evt) {
            if (connected) {
                if (callback)
                    callback('error');

                connected = connecting = false;
				window.UMEditorWrap[iden] = null;

                window.setTimeout(function() {
                    if (!connected && !connecting) {
                        ws = new WebSocket(svrhost);
                        connecting = true;
                    }
                }, 1);
            }
        }
    }

    if (session.richid) {
        openws(session.richid);

    } else {
    	$.get([session.url, '/richeditor.queryid?token=', session.token, '&dataid=', session.dataid, '&name=', session.name].join(''), {}, function(response) {
    		var id = response.trim();
    		if (/^[0-9$]+/.test(id)) {
    			openws(id);
    		} else if (callback) {
    			callback('session-error');
    		}
    	});
    }

    var ctl = {
        save: function(cb) {
    		if (connected) {
    			ws.send('broadcast:saveonce');
    			return true;
    		}
    		return false;
	   }
    };

	window.UMEditorWrap[iden].ctl = ctl;
	return ctl;
}