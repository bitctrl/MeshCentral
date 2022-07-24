Uint8Array.prototype.slice||Object.defineProperty(Uint8Array.prototype,"slice",{value:function(e,t){return new Uint8Array(Array.prototype.slice.call(this,e,t))}});var CreateAgentRemoteDesktop=function(e,t){var p={},S=("string"==typeof(p.CanvasId=e)&&(p.CanvasId=Q(e)),p.Canvas=p.CanvasId.getContext("2d"),p.scrolldiv=t,p.State=0,p.PendingOperations=[],p.tilesReceived=0,p.TilesDrawn=0,p.KillDraw=0,p.ipad=!1,p.tabletKeyboardVisible=!1,p.LastX=0,p.LastY=0,p.touchenabled=0,p.submenuoffset=0,p.touchtimer=null,p.TouchArray={},p.connectmode=0,p.connectioncount=0,p.rotation=0,p.protocol=2,p.debugmode=0,p.firstUpKeys=[],p.stopInput=!1,p.localKeyMap=!0,p.remoteKeyMap=!1,p.pressedKeys=[],p.sessionid=0,p.username,p.oldie=!1,p.ImageType=1,p.CompressionLevel=50,p.ScalingLevel=1024,p.FrameRateTimer=100,p.SwapMouse=!1,p.UseExtendedKeyFlag=!0,p.FirstDraw=!1,p.onRemoteInputLockChanged=null,p.RemoteInputLock=null,p.onKeyboardStateChanged=null,p.KeyboardState=0,p.ScreenWidth=960,p.ScreenHeight=701,p.width=960,p.height=960,p.displays=null,p.selectedDisplay=null,p.onScreenSizeChange=null,p.onMessage=null,p.onConnectCountChanged=null,p.onDebugMessage=null,p.onTouchEnabledChanged=null,p.onDisplayinfo=null,!(p.accumulator=null)),v="default",C=(p.mouseCursorActive=function(e){S!=e&&(S=e,p.CanvasId.style.cursor=1==e?v:"default")},["default","progress","crosshair","pointer","help","text","no-drop","move","nesw-resize","ns-resize","nwse-resize","w-resize","alias","wait","none","not-allowed","col-resize","row-resize","copy","zoom-in","zoom-out"]),a=(p.Start=function(){p.State=0,p.accumulator=null},p.Stop=function(){p.setRotation(0),p.UnGrabKeyInput(),p.UnGrabMouseInput(),p.touchenabled=0,null!=p.onScreenSizeChange&&p.onScreenSizeChange(p,p.ScreenWidth,p.ScreenHeight,p.CanvasId),p.Canvas.clearRect(0,0,p.CanvasId.width,p.CanvasId.height)},p.xxStateChange=function(e){p.State!=e&&(p.State=e,p.CanvasId.style.cursor="default",0===e&&p.Stop())},p.send=function(e){2<p.debugmode&&console.log("KSend("+e.length+"): "+rstr2hex(e)),null!=p.parent&&p.parent.send(e)},p.ProcessPictureMsg=function(e,t,n){for(var o=new Image,a=(o.xcount=p.tilesReceived++,p.tilesReceived),r=e.slice(4),s=0,i=[];5e4<r.byteLength-s;)i.push(String.fromCharCode.apply(null,r.slice(s,s+5e4))),s+=5e4;0<s?i.push(String.fromCharCode.apply(null,r.slice(s))):i.push(String.fromCharCode.apply(null,r)),o.src="data:image/jpeg;base64,"+btoa(i.join("")),o.onload=function(){if(null!=p.Canvas&&p.KillDraw<a&&0!=p.State)for(p.PendingOperations.push([a,2,o,t,n]);p.DoPendingOperations(););else p.PendingOperations.push([a,0])},o.error=function(){console.log("DecodeTileError")}},p.DoPendingOperations=function(){if(0!=p.PendingOperations.length){for(var e=0;e<p.PendingOperations.length;e++){var t=p.PendingOperations[e];if(t[0]==p.TilesDrawn+1)return null!=p.onPreDrawImage&&p.onPreDrawImage(),1==t[1]?p.ProcessCopyRectMsg(t[2]):2==t[1]&&(p.Canvas.drawImage(t[2],p.rotX(t[3],t[4]),p.rotY(t[3],t[4])),delete t[2]),p.PendingOperations.splice(e,1),delete t,p.TilesDrawn++,p.TilesDrawn==p.tilesReceived&&p.KillDraw<p.TilesDrawn&&(p.KillDraw=p.TilesDrawn=p.tilesReceived=0),!0}p.oldie&&0<p.PendingOperations.length&&p.TilesDrawn++}return!1},p.ProcessCopyRectMsg=function(e){var t=((255&e.charCodeAt(0))<<8)+(255&e.charCodeAt(1)),n=((255&e.charCodeAt(2))<<8)+(255&e.charCodeAt(3)),o=((255&e.charCodeAt(4))<<8)+(255&e.charCodeAt(5)),a=((255&e.charCodeAt(6))<<8)+(255&e.charCodeAt(7)),r=((255&e.charCodeAt(8))<<8)+(255&e.charCodeAt(9)),e=((255&e.charCodeAt(10))<<8)+(255&e.charCodeAt(11));p.Canvas.drawImage(Canvas.canvas,t,n,r,e,o,a,r,e)},p.SendUnPause=function(){1<p.debugmode&&console.log("SendUnPause"),p.send(String.fromCharCode(0,8,0,5,0))},p.SendPause=function(){1<p.debugmode&&console.log("SendPause"),p.send(String.fromCharCode(0,8,0,5,1))},p.SendCompressionLevel=function(e,t,n,o){p.ImageType=e,t&&(p.CompressionLevel=t),n&&(p.ScalingLevel=n),o&&(p.FrameRateTimer=o),p.send(String.fromCharCode(0,5,0,10,e,p.CompressionLevel)+p.shortToStr(p.ScalingLevel)+p.shortToStr(p.FrameRateTimer))},p.SendRefresh=function(){p.send(String.fromCharCode(0,6,0,4))},p.ProcessScreenMsg=function(e,t){if(0<p.debugmode&&console.log("ScreenSize: "+e+" x "+t),p.ScreenWidth!=e||p.ScreenHeight!=t){for(p.Canvas.setTransform(1,0,0,1,0,0),p.rotation=0,p.FirstDraw=!0,p.ScreenWidth=p.width=e,p.ScreenHeight=p.height=t,p.KillDraw=p.tilesReceived;0<p.PendingOperations.length;)p.PendingOperations.shift();p.SendCompressionLevel(p.ImageType),p.SendUnPause(),p.SendRemoteInputLock(2),null!=p.onScreenSizeChange&&p.onScreenSizeChange(p,p.ScreenWidth,p.ScreenHeight,p.CanvasId)}},p.ProcessBinaryCommand=function(e,t,n){var o,a;switch(3!=e&&4!=e&&7!=e||(o=(n[4]<<8)+n[5],a=(n[6]<<8)+n[7]),2<p.debugmode&&console.log("CMD",e,t,o,a),null!=p.recordedData&&(65e3<t?p.recordedData.push(f(2,1,p.shortToStr(27)+p.shortToStr(8)+p.intToStr(t)+p.shortToStr(e)+p.shortToStr(0)+p.shortToStr(0)+p.shortToStr(0)+String.fromCharCode.apply(null,n))):p.recordedData.push(f(2,1,String.fromCharCode.apply(null,n)))),e){case 3:p.FirstDraw&&p.onResize(),p.ProcessPictureMsg(n.slice(4),o,a);break;case 7:p.ProcessScreenMsg(o,a),p.SendKeyMsgKC(p.KeyAction.UP,16),p.SendKeyMsgKC(p.KeyAction.UP,17),p.SendKeyMsgKC(p.KeyAction.UP,18),p.SendKeyMsgKC(p.KeyAction.UP,91),p.SendKeyMsgKC(p.KeyAction.UP,92),p.SendKeyMsgKC(p.KeyAction.UP,16),p.send(String.fromCharCode(0,14,0,4));break;case 11:var r=0,s={},i=(n[4]<<8)+n[5];if(0<i)for(var r=(n[6+2*i]<<8)+n[7+2*i],c=0;c<i;c++){var u=(n[6+2*c]<<8)+n[7+2*c];s[u]=65535==u?"All Displays":"Display "+u}p.displays=s,p.selectedDisplay=r,null!=p.onDisplayinfo&&p.onDisplayinfo(p,s,r);break;case 12:break;case 14:p.touchenabled=1,p.TouchArray={},null!=p.onTouchEnabledChanged&&p.onTouchEnabledChanged(p.touchenabled);break;case 15:p.TouchArray={};break;case 17:var d=String.fromCharCode.apply(null,n.slice(4));console.log("Got KVM Message: "+d),null!=p.onMessage&&p.onMessage(d,p);break;case 18:if(5!=t||p.KeyboardState==n[4])break;p.KeyboardState=n[4],p.onKeyboardStateChanged&&p.onKeyboardStateChanged(p,p.KeyboardState),console.log("MNG_KVM_KEYSTATE:"+(1&p.KeyboardState?" NumLock":"")+(2&p.KeyboardState?" ScrollLock":"")+(4&p.KeyboardState?" CapsLock":""));break;case 65:"."!=(d=String.fromCharCode.apply(null,n.slice(4)))[0]?(console.log(d),p.parent&&p.parent.setConsoleMessage&&p.parent.setConsoleMessage(d)):console.log("KVM: "+d.substring(1));break;case 82:if(t<4||(t-4)%10!=0)break;for(var l=(t-4)/10,h={},g=4,c=0;c<l;c++)h[(n[g+0]<<8)+n[g+1]]={x:(n[g+2]<<8)+n[g+3],y:(n[g+4]<<8)+n[g+5],w:(n[g+6]<<8)+n[g+7],h:(n[g+8]<<8)+n[g+9]},g+=10;break;case 87:if(5!=t)break;null!=p.RemoteInputLock&&p.RemoteInputLock===(0!=n[4])||(p.RemoteInputLock=0!=n[4],p.onRemoteInputLockChanged&&p.onRemoteInputLockChanged(p,p.RemoteInputLock));break;case 88:if(5!=t||p.stopInput)break;r=n[4];v=C[r=C.length<r?0:r],S&&(p.CanvasId.style.cursor=v);break;default:console.log("Unknown command",e,t)}},p.MouseButton={NONE:0,LEFT:2,RIGHT:8,MIDDLE:32},p.KeyAction={NONE:0,DOWN:1,UP:2,SCROLL:3,EXUP:4,EXDOWN:5,DBLCLICK:6},p.InputType={KEY:1,MOUSE:2,CTRLALTDEL:10,TOUCH:15,KEYUNICODE:85},p.Alternate=0,{Pause:19,CapsLock:20,Space:32,Quote:222,Minus:189,NumpadMultiply:106,NumpadAdd:107,PrintScreen:44,Comma:188,NumpadSubtract:109,NumpadDecimal:110,Period:190,Slash:191,NumpadDivide:111,Semicolon:186,Equal:187,OSLeft:91,BracketLeft:219,OSRight:91,Backslash:220,BracketRight:221,ContextMenu:93,Backquote:192,NumLock:144,ScrollLock:145,Backspace:8,Tab:9,Enter:13,NumpadEnter:13,Escape:27,Delete:46,Home:36,PageUp:33,PageDown:34,ArrowLeft:37,ArrowUp:38,ArrowRight:39,ArrowDown:40,End:35,Insert:45,F1:112,F2:113,F3:114,F4:115,F5:116,F6:117,F7:118,F8:119,F9:120,F10:121,F11:122,F12:123,ShiftLeft:16,ShiftRight:16,ControlLeft:17,ControlRight:17,AltLeft:18,AltRight:18,MetaLeft:91,MetaRight:92,VolumeMute:181});var r=["ShiftRight","AltRight","ControlRight","Home","End","Insert","Delete","PageUp","PageDown","NumpadDivide","NumpadEnter","NumLock","Pause"];function f(e,t,n){var o=Date.now();return"number"==typeof n?(p.recordedSize+=n,p.shortToStr(e)+p.shortToStr(t)+p.intToStr(n)+p.intToStr(o>>32)+p.intToStr(32&o)):(p.recordedSize+=n.length,p.shortToStr(e)+p.shortToStr(t)+p.intToStr(n.length)+p.intToStr(o>>32)+p.intToStr(32&o)+n)}return p.SendKeyMsg=function(e,t){var n,o;null!=e&&(t=t||window.event,n=!1,0==(n=(p.UseExtendedKeyFlag||1==urlargs.extkeys)&&"string"==typeof t.code&&(t.code.startsWith("Arrow")||0<=r.indexOf(t.code))?!0:n)&&t.code&&0==t.code.startsWith("NumPad")&&0==p.localKeyMap?null!=(o=(o=t).code.startsWith("Key")&&4==o.code.length?o.code.charCodeAt(3):o.code.startsWith("Digit")&&6==o.code.length?o.code.charCodeAt(5):o.code.startsWith("Numpad")&&7==o.code.length?o.code.charCodeAt(6)+48:a[o.code])&&p.SendKeyMsgKC(e,o,n):(59==(o=t.keyCode)?o=186:173==o?o=189:61==o&&(o=187),p.SendKeyMsgKC(e,o,n)))},p.SendRemoteInputLock=function(e){p.send(String.fromCharCode(0,87,0,5,e))},p.SendMessage=function(e){3==p.State&&p.send(String.fromCharCode(0,17)+p.shortToStr(4+e.length)+e)},p.SendKeyMsgKC=function(e,t,n){if(3==p.State)if("object"==typeof e)for(var o in e)p.SendKeyMsgKC(e[o][0],e[o][1],e[o][2]);else{1==e?-1==p.pressedKeys.indexOf(t)&&p.pressedKeys.unshift(t):2==e&&-1!=(o=p.pressedKeys.indexOf(t))&&p.pressedKeys.splice(o,1),0<p.debugmode&&console.log("Sending Key "+t+", action "+e);var a=e-1;n&&(a=1==a?3:4),p.send(String.fromCharCode(0,p.InputType.KEY,0,6,a,t))}},p.SendStringUnicode=function(e){if(3==p.State)for(var t=0;t<e.length;t++)p.send(String.fromCharCode(0,p.InputType.KEYUNICODE,0,7,0)+ShortToStr(e.charCodeAt(t))),p.send(String.fromCharCode(0,p.InputType.KEYUNICODE,0,7,1)+ShortToStr(e.charCodeAt(t)))},p.SendKeyUnicode=function(e,t){3==p.State&&(0<p.debugmode&&console.log("Sending UnicodeKey "+t),p.send(String.fromCharCode(0,p.InputType.KEYUNICODE,0,7,e-1)+ShortToStr(t)))},p.sendcad=function(){p.SendCtrlAltDelMsg()},p.SendCtrlAltDelMsg=function(){3==p.State&&p.send(String.fromCharCode(0,p.InputType.CTRLALTDEL,0,4))},p.SendEscKey=function(){3==p.State&&p.send(String.fromCharCode(0,p.InputType.KEY,0,6,0,27,0,p.InputType.KEY,0,6,1,27))},p.SendStartMsg=function(){p.SendKeyMsgKC(p.KeyAction.EXDOWN,91),p.SendKeyMsgKC(p.KeyAction.EXUP,91)},p.SendCharmsMsg=function(){p.SendKeyMsgKC(p.KeyAction.EXDOWN,91),p.SendKeyMsgKC(p.KeyAction.DOWN,67),p.SendKeyMsgKC(p.KeyAction.UP,67),p.SendKeyMsgKC(p.KeyAction.EXUP,91)},p.SendTouchMsg1=function(e,t,n,o){3==p.State&&p.send(String.fromCharCode(0,p.InputType.TOUCH)+p.shortToStr(14)+String.fromCharCode(1,e)+p.intToStr(t)+p.shortToStr(n)+p.shortToStr(o))},p.SendTouchMsg2=function(e,t){var n,o,a="";for(o in p.TouchArray)o==e?n=t:1==p.TouchArray[o].f?(n=65542,p.TouchArray[o].f=3,0):2==p.TouchArray[o].f?(n=262144,0):n=131078,a+=String.fromCharCode(o)+p.intToStr(n)+p.shortToStr(p.TouchArray[o].x)+p.shortToStr(p.TouchArray[o].y),2==p.TouchArray[o].f&&delete p.TouchArray[o];3==p.State&&p.send(String.fromCharCode(0,p.InputType.TOUCH)+p.shortToStr(5+a.length)+String.fromCharCode(2)+a),0==Object.keys(p.TouchArray).length&&null!=p.touchtimer&&(clearInterval(p.touchtimer),p.touchtimer=null)},p.SendMouseMsg=function(e,t){var n,o,a,r,s,i;3==p.State&&null!=e&&null!=p.Canvas&&(t=t||window.event,a=p.Canvas.canvas.height/p.CanvasId.clientHeight,n=p.Canvas.canvas.width/p.CanvasId.clientWidth,o=p.GetPositionOfControl(p.Canvas.canvas),n=(t.pageX-o[0])*n,o=(t.pageY-o[1])*a,t.addx&&(n+=t.addx),t.addy&&(o+=t.addy),0<=n&&n<=p.Canvas.canvas.width&&0<=o&&o<=p.Canvas.canvas.height&&(r=a=0,e==p.KeyAction.UP||e==p.KeyAction.DOWN?t.which?a=1==t.which?p.MouseButton.LEFT:2==t.which?p.MouseButton.MIDDLE:p.MouseButton.RIGHT:t.button&&(a=0==t.button?p.MouseButton.LEFT:1==t.button?p.MouseButton.MIDDLE:p.MouseButton.RIGHT):e==p.KeyAction.SCROLL&&(t.detail?r=120*t.detail*-1:t.wheelDelta&&(r=3*t.wheelDelta)),!0===p.SwapMouse&&(a==p.MouseButton.LEFT?a=p.MouseButton.RIGHT:a==p.MouseButton.RIGHT&&(a=p.MouseButton.LEFT)),p.ReverseMouseWheel&&(r*=-1),t="",t=e==p.KeyAction.DBLCLICK?String.fromCharCode(0,p.InputType.MOUSE,0,10,0,136,n/256&255,255&n,o/256&255,255&o):e==p.KeyAction.SCROLL?(i=r<(i=s=0)?(s=255-(Math.abs(r)>>8),255-(255&Math.abs(r))):(s=r>>8,255&r),String.fromCharCode(0,p.InputType.MOUSE,0,12,0,0,n/256&255,255&n,o/256&255,255&o,s,i)):String.fromCharCode(0,p.InputType.MOUSE,0,10,0,e==p.KeyAction.DOWN?a:2*a&255,n/256&255,255&n,o/256&255,255&o),p.Action==p.KeyAction.NONE?0==p.Alternate||p.ipad?(p.send(t),p.Alternate=1):p.Alternate=0:p.send(t)))},p.GetDisplayNumbers=function(){p.send(String.fromCharCode(0,11,0,4))},p.SetDisplay=function(e){p.send(String.fromCharCode(0,12,0,6,e>>8,255&e))},p.intToStr=function(e){return String.fromCharCode(e>>24&255,e>>16&255,e>>8&255,255&e)},p.shortToStr=function(e){return String.fromCharCode(e>>8&255,255&e)},p.onResize=function(){0==p.ScreenWidth||0==p.ScreenHeight||p.Canvas.canvas.width==p.ScreenWidth&&p.Canvas.canvas.height==p.ScreenHeight||(p.FirstDraw&&(p.Canvas.canvas.width=p.ScreenWidth,p.Canvas.canvas.height=p.ScreenHeight,p.Canvas.fillRect(0,0,p.ScreenWidth,p.ScreenHeight),null!=p.onScreenSizeChange&&p.onScreenSizeChange(p,p.ScreenWidth,p.ScreenHeight,p.CanvasId)),p.FirstDraw=!1,1<p.debugmode&&console.log("onResize: "+p.ScreenWidth+" x "+p.ScreenHeight))},p.xxMouseInputGrab=!1,p.xxKeyInputGrab=!1,p.xxMouseMove=function(e){return 3==p.State&&p.SendMouseMsg(p.KeyAction.NONE,e),e.preventDefault&&e.preventDefault(),e.stopPropagation&&e.stopPropagation(),!1},p.xxMouseUp=function(e){return 3==p.State&&p.SendMouseMsg(p.KeyAction.UP,e),e.preventDefault&&e.preventDefault(),e.stopPropagation&&e.stopPropagation(),!1},p.xxMouseDown=function(e){return 3==p.State&&p.SendMouseMsg(p.KeyAction.DOWN,e),e.preventDefault&&e.preventDefault(),e.stopPropagation&&e.stopPropagation(),!1},p.xxMouseDblClick=function(e){return 3==p.State&&p.SendMouseMsg(p.KeyAction.DBLCLICK,e),e.preventDefault&&e.preventDefault(),e.stopPropagation&&e.stopPropagation(),!1},p.xxDOMMouseScroll=function(e){return 3!=p.State||(p.SendMouseMsg(p.KeyAction.SCROLL,e),!1)},p.xxMouseWheel=function(e){return 3!=p.State||(p.SendMouseMsg(p.KeyAction.SCROLL,e),!1)},p.xxKeyUp=function(e){return"Dead"!=e.key&&3==p.State&&("string"==typeof e.key&&1==e.key.length&&1!=e.ctrlKey&&1!=e.altKey&&0==p.remoteKeyMap?p.SendKeyUnicode(p.KeyAction.UP,e.key.charCodeAt(0)):p.SendKeyMsg(p.KeyAction.UP,e)),e.preventDefault&&e.preventDefault(),e.stopPropagation&&e.stopPropagation(),!1},p.xxKeyDown=function(e){if("Dead"!=e.key&&3==p.State&&("string"!=typeof e.key||1!=e.key.length||1==e.ctrlKey||1==e.altKey||0!=p.remoteKeyMap))return p.SendKeyMsg(p.KeyAction.DOWN,e),e.preventDefault&&e.preventDefault(),e.stopPropagation&&e.stopPropagation(),!1},p.xxKeyPress=function(e){return"Dead"!=e.key&&3==p.State&&"string"==typeof e.key&&1==e.key.length&&1!=e.ctrlKey&&1!=e.altKey&&0==p.remoteKeyMap&&p.SendKeyUnicode(p.KeyAction.DOWN,e.key.charCodeAt(0)),e.preventDefault&&e.preventDefault(),e.stopPropagation&&e.stopPropagation(),!1},p.handleKeys=function(e){return 1!=p.stopInput&&3==desktop.State&&p.xxKeyPress(e)},p.handleKeyUp=function(e){return 1!=p.stopInput&&3==desktop.State&&(p.firstUpKeys.length<5&&(p.firstUpKeys.push(e.keyCode),5!=p.firstUpKeys.length||"16,17,91,91,16"!=(t=p.firstUpKeys.join(","))&&"16,17,18,91,92"!=t||(p.stopInput=!0)),p.xxKeyUp(e));var t},p.handleKeyDown=function(e){return 1!=p.stopInput&&3==desktop.State&&p.xxKeyDown(e)},p.handleReleaseKeys=function(){var e,t=JSON.parse(JSON.stringify(p.pressedKeys));for(e in t)p.SendKeyMsgKC(p.KeyAction.UP,t[e])},p.mousedblclick=function(e){return 1!=p.stopInput&&p.xxMouseDblClick(e)},p.mousedown=function(e){return 1!=p.stopInput&&p.xxMouseDown(e)},p.mouseup=function(e){return 1!=p.stopInput&&p.xxMouseUp(e)},p.mousemove=function(e){return 1!=p.stopInput&&p.xxMouseMove(e)},p.mousewheel=function(e){return 1!=p.stopInput&&p.xxMouseWheel(e)},p.xxMsTouchEvent=function(e){var t,n,o,a;if(4!=e.originalEvent.pointerType)return e.preventDefault&&e.preventDefault(),e.stopPropagation&&e.stopPropagation(),"MSPointerDown"==e.type||"MSPointerMove"==e.type||"MSPointerUp"==e.type?(t=0,n=e.originalEvent.pointerId%256,o=e.offsetX*(Canvas.canvas.width/p.CanvasId.clientWidth),a=e.offsetY*(Canvas.canvas.height/p.CanvasId.clientHeight),"MSPointerDown"==e.type?t=65542:"MSPointerMove"==e.type?t=131078:"MSPointerUp"==e.type&&(t=262144),p.TouchArray[n]||(p.TouchArray[n]={x:o,y:a}),p.SendTouchMsg2(n,t),"MSPointerUp"==e.type&&delete p.TouchArray[n]):alert(e.type),!0},p.xxTouchStart=function(e){if(3==p.State)if(e.preventDefault&&e.preventDefault(),0==p.touchenabled||1==p.touchenabled){var t;1<e.originalEvent.touches.length||(t=e.originalEvent.touches[0],e.which=1,p.LastX=e.pageX=t.pageX,p.LastY=e.pageY=t.pageY,p.SendMouseMsg(KeyAction.DOWN,e))}else{var n,o,a=p.GetPositionOfControl(Canvas.canvas);for(n in e.originalEvent.changedTouches)e.originalEvent.changedTouches[n].identifier&&(o=e.originalEvent.changedTouches[n].identifier%256,p.TouchArray[o]||(p.TouchArray[o]={x:(e.originalEvent.touches[n].pageX-a[0])*(Canvas.canvas.width/p.CanvasId.clientWidth),y:(e.originalEvent.touches[n].pageY-a[1])*(Canvas.canvas.height/p.CanvasId.clientHeight),f:1}));0<Object.keys(p.TouchArray).length&&null==touchtimer&&(p.touchtimer=setInterval(function(){p.SendTouchMsg2(256,0)},50))}},p.xxTouchMove=function(e){if(3==p.State)if(e.preventDefault&&e.preventDefault(),0==p.touchenabled||1==p.touchenabled){var t;1<e.originalEvent.touches.length||(t=e.originalEvent.touches[0],e.which=1,p.LastX=e.pageX=t.pageX,p.LastY=e.pageY=t.pageY,p.SendMouseMsg(p.KeyAction.NONE,e))}else{var n,o,a=p.GetPositionOfControl(Canvas.canvas);for(n in e.originalEvent.changedTouches)e.originalEvent.changedTouches[n].identifier&&(o=e.originalEvent.changedTouches[n].identifier%256,p.TouchArray[o]&&(p.TouchArray[o].x=(e.originalEvent.touches[n].pageX-a[0])*(p.Canvas.canvas.width/p.CanvasId.clientWidth),p.TouchArray[o].y=(e.originalEvent.touches[n].pageY-a[1])*(p.Canvas.canvas.height/p.CanvasId.clientHeight)))}},p.xxTouchEnd=function(e){if(3==p.State)if(e.preventDefault&&e.preventDefault(),0==p.touchenabled||1==p.touchenabled)1<e.originalEvent.touches.length||(e.which=1,e.pageX=LastX,e.pageY=LastY,p.SendMouseMsg(KeyAction.UP,e));else for(var t in e.originalEvent.changedTouches)e.originalEvent.changedTouches[t].identifier&&(t=e.originalEvent.changedTouches[t].identifier%256,p.TouchArray[t]&&(p.TouchArray[t].f=2))},p.GrabMouseInput=function(){var e;1!=p.xxMouseInputGrab&&((e=p.CanvasId).onmousemove=p.xxMouseMove,e.onmouseup=p.xxMouseUp,e.onmousedown=p.xxMouseDown,e.touchstart=p.xxTouchStart,e.touchmove=p.xxTouchMove,e.touchend=p.xxTouchEnd,e.MSPointerDown=p.xxMsTouchEvent,e.MSPointerMove=p.xxMsTouchEvent,e.MSPointerUp=p.xxMsTouchEvent,navigator.userAgent.match(/mozilla/i)?e.DOMMouseScroll=p.xxDOMMouseScroll:e.onmousewheel=p.xxMouseWheel,p.xxMouseInputGrab=!0)},p.UnGrabMouseInput=function(){var e;0!=p.xxMouseInputGrab&&((e=p.CanvasId).onmousemove=null,e.onmouseup=null,e.onmousedown=null,e.touchstart=null,e.touchmove=null,e.touchend=null,e.MSPointerDown=null,e.MSPointerMove=null,e.MSPointerUp=null,navigator.userAgent.match(/mozilla/i)?e.DOMMouseScroll=null:e.onmousewheel=null,p.xxMouseInputGrab=!1)},p.GrabKeyInput=function(){1!=p.xxKeyInputGrab&&(document.onkeyup=p.xxKeyUp,document.onkeydown=p.xxKeyDown,document.onkeypress=p.xxKeyPress,c,p.xxKeyInputGrab=!0)},p.UnGrabKeyInput=function(){0!=p.xxKeyInputGrab&&(document.onkeyup=null,document.onkeydown=null,document.onkeypress=null,p.xxKeyInputGrab=!1)},p.GetPositionOfControl=function(e){var t=Array(2);for(t[0]=t[1]=0;e;)t[0]+=e.offsetLeft,t[1]+=e.offsetTop,e=e.offsetParent;return t},p.crotX=function(e,t){return 0==p.rotation?e:1==p.rotation?t:2==p.rotation?p.Canvas.canvas.width-e:3==p.rotation?p.Canvas.canvas.height-t:void 0},p.crotY=function(e,t){return 0==p.rotation?t:1==p.rotation?p.Canvas.canvas.width-e:2==p.rotation?p.Canvas.canvas.height-t:3==p.rotation?e:void 0},p.rotX=function(e,t){return 0==p.rotation||1==p.rotation?e:2==p.rotation?e-p.Canvas.canvas.width:3==p.rotation?e-p.Canvas.canvas.height:void 0},p.rotY=function(e,t){return 0==p.rotation||3==p.rotation?t:1==p.rotation?t-p.Canvas.canvas.width:2==p.rotation?t-p.Canvas.canvas.height:void 0},p.tcanvas=null,p.setRotation=function(e){for(;e<0;)e+=4;var t,n,o,a=e%4;return a!=p.rotation&&(t=p.Canvas.canvas.width,n=p.Canvas.canvas.height,1!=p.rotation&&3!=p.rotation||(t=p.Canvas.canvas.height,n=p.Canvas.canvas.width),null==p.tcanvas&&(p.tcanvas=document.createElement("canvas")),(o=p.tcanvas.getContext("2d")).setTransform(1,0,0,1,0,0),o.canvas.width=t,o.canvas.height=n,o.rotate(-90*p.rotation*Math.PI/180),0==p.rotation&&o.drawImage(p.Canvas.canvas,0,0),1==p.rotation&&o.drawImage(p.Canvas.canvas,-p.Canvas.canvas.width,0),2==p.rotation&&o.drawImage(p.Canvas.canvas,-p.Canvas.canvas.width,-p.Canvas.canvas.height),3==p.rotation&&o.drawImage(p.Canvas.canvas,0,-p.Canvas.canvas.height),0!=p.rotation&&2!=p.rotation||(p.Canvas.canvas.height=t,p.Canvas.canvas.width=n),1!=p.rotation&&3!=p.rotation||(p.Canvas.canvas.height=n,p.Canvas.canvas.width=t),p.Canvas.setTransform(1,0,0,1,0,0),p.Canvas.rotate(90*a*Math.PI/180),p.rotation=a,p.Canvas.drawImage(p.tcanvas,p.rotX(0,0),p.rotY(0,0)),p.ScreenWidth=p.Canvas.canvas.width,p.ScreenHeight=p.Canvas.canvas.height,null!=p.onScreenSizeChange&&(console.log("s4",p.ScreenWidth,p.ScreenHeight),p.onScreenSizeChange(p,p.ScreenWidth,p.ScreenHeight,p.CanvasId))),!0},p.StartRecording=function(){null==p.recordedData&&p.CanvasId.toBlob(function(e){var s=new FileReader;s.readAsArrayBuffer(e),s.onload=function(e){for(var t="",n=new Uint8Array(s.result),o=n.byteLength,a=0;a<o;a++)t+=String.fromCharCode(n[a]);p.recordedData=[],p.recordedStart=Date.now(),p.recordedSize=0,p.recordedData.push(f(1,0,JSON.stringify({magic:"MeshCentralRelaySession",ver:1,time:(new Date).toLocaleString(),protocol:2}))),p.recordedData.push(f(2,1,p.shortToStr(7)+p.shortToStr(8)+p.shortToStr(p.ScreenWidth)+p.shortToStr(p.ScreenHeight)));var r=8+t.length;65e3<r?p.recordedData.push(f(2,1,p.shortToStr(27)+p.shortToStr(8)+p.intToStr(r)+p.shortToStr(3)+p.shortToStr(0)+p.shortToStr(0)+p.shortToStr(0)+t)):p.recordedData.push(f(2,1,p.shortToStr(3)+p.shortToStr(r)+p.shortToStr(0)+p.shortToStr(0)+t))}})},p.StopRecording=function(){var e;if(null!=p.recordedData)return e=p.recordedData,e.push(f(3,0,"MeshCentralMCREC")),delete p.recordedData,delete p.recordedStart,delete p.recordedSize,e},p.MuchTheSame=function(e,t){return Math.abs(e-t)<4},p.Debug=function(e){console.log(e)},p.getIEVersion=function(){var e,t=-1;return"Microsoft Internet Explorer"==navigator.appName&&(e=navigator.userAgent,null!=new RegExp("MSIE ([0-9]{1,}[.0-9]{0,})").exec(e)&&(t=parseFloat(RegExp.$1))),t},p.haltEvent=function(e){return e.preventDefault&&e.preventDefault(),e.stopPropagation&&e.stopPropagation(),!1},p}