var CreateWsmanComm=function(e,t,n,r,o){var u={};function c(e){e="00000000"+e.toString(16);return e.substring(e.length-8)}function a(){for(i in u.socketState=2,u.pendingAjaxCall)u.sendRequest(u.pendingAjaxCall[i][0],u.pendingAjaxCall[i][3],u.pendingAjaxCall[i][4])}function s(e){for(u.socketAccumulator+=(e=new Uint8Array(e.data),String.fromCharCode.apply(null,e));;){if(0==u.socketParseState){var t,n=u.socketAccumulator.indexOf("\r\n\r\n");if(n<0)return;if(u.socketHeader=u.socketAccumulator.substring(0,n).split("\r\n"),null==u.amtVersion)for(var r in u.socketHeader)0==u.socketHeader[r].indexOf("Server: Intel(R) Active Management Technology ")&&(u.amtVersion=u.socketHeader[r].substring(46));for(r in u.socketAccumulator=u.socketAccumulator.substring(n+4),u.socketParseState=1,u.socketData="",u.socketXHeader={Directive:u.socketHeader[0].split(" ")},u.socketHeader)0!=r&&(t=u.socketHeader[r].indexOf(":"),u.socketXHeader[u.socketHeader[r].substring(0,t).toLowerCase()]=u.socketHeader[r].substring(t+2))}if(1==u.socketParseState){n=-1;if(null==u.socketXHeader.connection||"close"!=u.socketXHeader.connection.toLowerCase()||null!=u.socketXHeader["transfer-encoding"]&&"chunked"==u.socketXHeader["transfer-encoding"].toLowerCase())if(null!=u.socketXHeader["content-length"]){if(n=parseInt(u.socketXHeader["content-length"]),u.socketAccumulator.length<n)return;var o=u.socketAccumulator.substring(0,n);u.socketAccumulator=u.socketAccumulator.substring(n),u.socketData=o,n=0}else{var a=u.socketAccumulator.indexOf("\r\n");if(a<0)return;if(n=parseInt(u.socketAccumulator.substring(0,a),16),isNaN(n))return void(u.websocket&&u.websocket.close());if(u.socketAccumulator.length<a+2+n+2)return;o=u.socketAccumulator.substring(a+2,a+2+n);u.socketAccumulator=u.socketAccumulator.substring(a+2+n+2),u.socketData+=o}else n=0;if(0==n){a=l=i=c=s=a=void 0;var a=u.socketXHeader,s=u.socketData,c=parseInt(a.Directive[1]);if(401==(c=isNaN(c)?602:c)&&++u.authcounter<3){if(u.challengeParams=u.parseDigest(a["www-authenticate"]),null!=u.challengeParams.qop){var l,i=u.challengeParams.qop.split(",");for(l in i)i[l]=i[l].trim();0<=i.indexOf("auth-int")?u.challengeParams.qop="auth-int":u.challengeParams.qop="auth"}}else{a=u.pendingAjaxCall.shift();u.authcounter=0,u.ActiveAjaxCount--,u.gotNextMessages(s,"success",{status:c},a),u.PerformNextAjax()}u.socketParseState=0,u.socketHeader=null}}}}function l(e){var t,n;u.socketState=0,null!=u.socket&&(u.socket.close(),u.socket=null),0<u.pendingAjaxCall.length&&(n=(t=u.pendingAjaxCall.shift())[5],u.PerformAjaxExNodeJS2(t[0],t[1],t[2],t[3],t[4],--n))}return u.PendingAjax=[],u.ActiveAjaxCount=0,u.MaxActiveAjaxCount=1,u.FailAllError=0,u.challengeParams=null,u.noncecounter=1,u.authcounter=0,u.socket=null,u.socketState=0,u.host=e,u.port=t,u.user=n,u.pass=r,u.tls=o,u.tlsv1only=1,u.cnonce=Math.random().toString(36).substring(7),u.PerformAjax=function(e,t,n,r,o,a){u.ActiveAjaxCount<u.MaxActiveAjaxCount&&0==u.PendingAjax.length?u.PerformAjaxEx(e,t,n,o,a):1==r?u.PendingAjax.unshift([e,t,n,o,a]):u.PendingAjax.push([e,t,n,o,a])},u.PerformNextAjax=function(){var e;u.ActiveAjaxCount>=u.MaxActiveAjaxCount||0==u.PendingAjax.length||(e=u.PendingAjax.shift(),u.PerformAjaxEx(e[0],e[1],e[2],e[3],e[4]),u.PerformNextAjax())},u.PerformAjaxEx=function(e,t,n,r,o){if(0==u.FailAllError)return e=e||"",u.ActiveAjaxCount++,u.PerformAjaxExNodeJS(e,t,n,r,o);u.gotNextMessagesError({status:u.FailAllError},"error",null,[e,t,n,r,o])},u.pendingAjaxCall=[],u.PerformAjaxExNodeJS=function(e,t,n,r,o){u.PerformAjaxExNodeJS2(e,t,n,r,o,3)},u.PerformAjaxExNodeJS2=function(e,t,n,r,o,a){if(a<=0||0!=u.FailAllError)return u.ActiveAjaxCount--,999!=u.FailAllError&&u.gotNextMessages(null,"error",{status:0==u.FailAllError?408:u.FailAllError},[e,t,n,r,o]),void u.PerformNextAjax();u.pendingAjaxCall.push([e,t,n,r,o,a]),0==u.socketState?u.xxConnectHttpSocket():2==u.socketState&&u.sendRequest(e,r,o)},u.sendRequest=function(e,t,n){var r=(n=n||"POST")+" "+(t=t||"/wsman")+" HTTP/1.1\r\n",o=(null!=u.challengeParams&&(n=hex_md5(hex_md5(u.user+":"+u.challengeParams.realm+":"+u.pass)+":"+u.challengeParams.nonce+":"+c(u.noncecounter)+":"+u.cnonce+":"+u.challengeParams.qop+":"+hex_md5(n+":"+t+("auth-int"==u.challengeParams.qop?":"+hex_md5(e):""))),r+="Authorization: "+u.renderDigest({username:u.user,realm:u.challengeParams.realm,nonce:u.challengeParams.nonce,uri:t,qop:u.challengeParams.qop,response:n,nc:c(u.noncecounter++),cnonce:u.cnonce})+"\r\n"),r+="Host: "+u.host+":"+u.port+"\r\nTransfer-Encoding: chunked\r\n\r\n"+e.length.toString(16).toUpperCase()+"\r\n"+e+"\r\n0\r\n\r\n");if(2==u.socketState&&null!=u.socket&&u.socket.readyState==WebSocket.OPEN){for(var a=new Uint8Array(o.length),s=0;s<o.length;++s)a[s]=o.charCodeAt(s);try{u.socket.send(a.buffer)}catch(e){}}},u.parseDigest=function(e){return e.substring(7).split(",").reduce(function(e,t){return e.ic?e.st[e.st.length-1]+=","+t:e.st.push(t),t.split('"').length%2==0&&(e.ic=!e.ic),e},{st:[],ic:!1}).st.reduce(function(e,t){t=t.trim().split("=");return e[t[0]]=t[1].replace(new RegExp('"',"g"),""),e},{})},u.renderDigest=function(n){var e=[];for(i in n)e.push(i);return"Digest "+e.reduce(function(e,t){return e+","+("nc"==t||"qop"==t?t+"="+n[t]:t+'="'+n[t]+'"')},"").substring(1)},u.xxConnectHttpSocket=function(){u.socketParseState=0,u.socketAccumulator="",u.socketHeader=null,u.socketData="",u.socketState=1,u.socket=new WebSocket(window.location.protocol.replace("http","ws")+"//"+window.location.host+window.location.pathname.substring(0,window.location.pathname.lastIndexOf("/"))+"/webrelay.ashx?p=1&host="+u.host+"&port="+u.port+"&tls="+u.tls+"&tlsv1only="+u.tlsv1only+("*"==n?"&serverauth=1":"")+(void 0===r?"&serverauth=1&user="+n:"")),u.socket.binaryType="arraybuffer",u.socket.onopen=a,u.socket.onmessage=s,u.socket.onclose=l},u.gotNextMessages=function(e,t,n,r){999!=u.FailAllError&&(0!=u.FailAllError?r[1](null,u.FailAllError,r[2]):200!=n.status?r[1](null,n.status,r[2]):r[1](e,200,r[2]))},u.gotNextMessagesError=function(e,t,n,r){999!=u.FailAllError&&(0!=u.FailAllError?r[1](null,u.FailAllError,r[2]):r[1](u,null,{Header:{HttpError:e.status}},e.status,r[2]))},u.CancelAllQueries=function(e){for(;0<u.PendingAjax.length;){var t=u.PendingAjax.shift();t[1](null,e,t[2])}null!=u.websocket&&(u.websocket.close(),u.websocket=null,u.socketState=0)},u}