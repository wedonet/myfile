
(function(window,document,undefined){
	
    // upLogger对象是采集脚本对外提供的操作对象
    if (window.upLogger){//如果不为空，直接返回，避免重复安装
        return;
    }    
    var	 bts = 'b_t_s_' + LogChannelID;
    var	 up_beacon_id = 'up_beacon_id_' + LogChannelID;
    var	 up_beacon_vist_count = 'up_beacon_vist_count_'+ LogChannelID;
    var	 up_first_date = 'up_first_date';
    var	 up_page_stime = 'up_page_stime_' + LogChannelID;
    var	 up_beacon_user_id = 'up_beacon_user_id_' + LogChannelID;
    var	 up_beacon_uni_id = 'up_beacon_uni_id_' + LogChannelID;
    var  mousePosx;   //鼠标位置x
    var  mousePosy;   //鼠标位置y
    
    var Keyword = null;
    var upBeaconUtil ={                   //日志记录工具类
        jsName:'datacollect.js',          //程序名称
        defaultVer:2015021001,            //版本日期
                                          //Cookie命名使用Channel变量
                                          //增加获取设备操作系统方法
        
        getVersion:function(){            //获取版本号
            var e = this.jsName;
            var a = new RegExp(e + "(\\?(.*))?$");
            var d = document.getElementsByTagName("script");
            for (var i = 0;i < d.length;i++){
                var b = d[i];
                if (b.src && b.src.match(a)){
                    var z = b.src.match(a)[2];
                    if (z && (/^[a-zA-Z0-9]+$/).test(z)){
                         return z;
                    }
                }
            }
            return this.defaultVer;
        },
        setCookie:function(sName,sValue,oExpires,sPath,sDomain,bSecure){//设置cookie信息
            var currDate = new Date(),
                sExpires = typeof oExpires == 'undefined'?'':';expires=' + new Date(currDate.getTime() + (oExpires * 24 * 60 * 60* 1000)).toUTCString();
                sDomain = upBeaconUtil.getHost();
            document.cookie = sName + '=' + sValue + sExpires + ((sPath == null)?'':(' ;path=' + sPath)) + ((sDomain == null)?'':(' ;domain=' + sDomain)) + ((bSecure == true)?' ; secure':'');
        },
        getCookie:function(sName){//获取cookie信息
            var regRes = document.cookie.match(new RegExp("(^| )" + sName + "=([^;]*)(;|$)"));
            return (regRes != null)?unescape(regRes[2]):'-';
        },
        
        getHost:function() {  //获取顶级域名
        	  var Strurl = window.location.href;        
            var host = "null";                     
            var regex = /.*\:\/\/([^\/|:]*).*/;
            var re_n = /^[0-9]+.?[0-9]*$/;            
            var match = Strurl.match(regex);
        if(typeof match != "undefined" && null != match) {                
            host = match[1];         
        }            
        if (typeof host != "undefined" && null != host) {                
           var j;
           var ahost='';
           var strAry = host.split(".");
		   var flag = true;
		   var s_n = 0;
		   for (var i=0 ; i< strAry.length ; i++)
		   {
			   if(re_n.test(strAry[i])){
				   s_n = s_n + 1;
			   }
		   }
		   if(s_n == strAry.length)
		   {
			   flag = false;
		   }
           for (var i=1 ; i< strAry.length ; i++)
           {    
           	    j = strAry.length-i;
				if(flag){
					ahost="." + strAry[j]+ahost;
				}           	    
           }
        }            
           return ahost;        
        },  
        mousePosition:function(ev){
          if(ev.pageX || ev.pageY){
            return {x:ev.pageX, y:ev.pageY};
          }
          return {
           x:ev.clientX + document.body.scrollLeft - document.body.clientLeft,
           y:ev.clientY + document.body.scrollTop  - document.body.clientTop
          };
        },
        mouseDown:function (ev){
            ev = ev || window.event;
            var mousePos = upBeaconUtil.mousePosition(ev);
            mousePosx = mousePos.x;
            mousePosy = mousePos.y;
            beaconMethod.clickLog('type=heatmap&clickTarget=1');
        },
        uuid:function () {
            var s = [];
            var hexDigits = "0123456789abcdef";
            for (var i = 0; i < 36; i++) {
                  s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
            }
            s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
            s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
            s[8] = s[13] = s[18] = s[23] = "-";
 
            var uuid = s.join("");
            return uuid;
        },      
        getFirstDate:function(){  //获得当前日期
            var today = new Date();
            var year = today.getFullYear();
            var month = today.getMonth()+1;
            var day = today.getDate();
            return year + '-' + ((month < 10)?('0' + month):month) + '-' + ((day < 10)?('0' + day):day);
        },
        getRand:function(){// 生产页面的唯一标示
            var currDate = new Date();
            var randId = currDate.getTime() + '-';    
            for (var i = 0;i < 32;i++)
            {
                randId += Math.floor(Math.random() * 10);    
            }
            return randId;
        },
        parseError:function(obj){
            var retVal = '';
            for (var key in obj){
                retVal += key + '=' + obj[key] + ';';    
            }
            return retVal;
        },        
        getParam:function(obj,flag){// 参数转化方法
            var retVal = null;
            if (obj){
                if (upBeaconUtil.isString(obj) || upBeaconUtil.isNumber(obj)){
                    retVal = obj;    
                }else{
                    if (upBeaconUtil.isObject(obj)){
                        var tmpStr = '';
                        for (var key in obj){
                            if (obj[key] != null && obj[key] != undefined){
                                var tmpObj = obj[key];
                                if (upBeaconUtil.isArray(tmpObj)){
                                    tmpObj = tmpObj.join(',');    
                                }else{
                                    if (upBeaconUtil.isDate(tmpObj)){
                                        tmpObj = tmpObj.getTime();    
                                    }
                                }
                                tmpStr += key + '=' + tmpObj + '&';
                            }
                        }
                        tmpStr = tmpStr.substring(0,tmpStr.length - 1);
                        retVal = tmpStr;
                    }else{
                        if (upBeaconUtil.isArray(obj)){
                            if (upBeaconUtil.length & upBeaconUtil.length > 0){
                                retVal = obj.join(',');
                            }
                        }else{
                            retVal = obj.toString();    
                        }
                    }
                }
            }
            
            if (!retVal){
                retVal = '-';    
            }
            
            if (flag){
                retVal = encodeURIComponent(retVal);
                retVal = this.base64encode(retVal);
            }
            return retVal;
        },
        base64encode: function(G) {//base64加密
            var A = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
            var C, E, z;
            var F, D, B;
            z = G.length;
            E = 0;
            C = "";
            while (E < z) {
                F = G.charCodeAt(E++) & 255;
                if (E == z) {
                    C += A.charAt(F >> 2);
                    C += A.charAt((F & 3) << 4);
                    C += "==";
                    break
                }
                D = G.charCodeAt(E++);
                if (E == z) {
                    C += A.charAt(F >> 2);
                    C += A.charAt(((F & 3) << 4) | ((D & 240) >> 4));
                    C += A.charAt((D & 15) << 2);
                    C += "=";
                    break
                }
                B = G.charCodeAt(E++);
                C += A.charAt(F >> 2);
                C += A.charAt(((F & 3) << 4) | ((D & 240) >> 4));
                C += A.charAt(((D & 15) << 2) | ((B & 192) >> 6));
                C += A.charAt(B & 63)
            }
            return C
        },
        
        getOs:function() {    //获得浏览器信息
           var agent = navigator.userAgent.toLowerCase() ;
           var regStr_ie = /msie [\d.]+;/gi;
           var regStr_ff = /firefox\/[\d.]+/gi;
           var regStr_chrome = /chrome\/[\d.]+/gi;
           var regStr_saf = /safari\/[\d.]+/gi;
           var regStr_360 = /360se\/[\d.]+/gi;
           //IE
           if(agent.indexOf("msie") > 0){
              return agent.match(regStr_ie) ;
           }
           //firefox
           if(agent.indexOf("firefox") > 0){
              return agent.match(regStr_ff) ;
           }
           //Chrome
           if(agent.indexOf("chrome") > 0){
              return agent.match(regStr_chrome) ;
           }
           //Safari
           if(agent.indexOf("safari") > 0 && agent.indexOf("chrome") < 0){
              return agent.match(regStr_saf) ;
           }
        },
        
        //JS判断访问设备操作系统(userAgent)
        getDetectOS:function(){
        	
	        var sUserAgent = navigator.userAgent;
	 
	        var isWin = (navigator.platform === "Win32") || (navigator.platform === "Windows");
	        var isMac = (navigator.platform === "Mac68K") || (navigator.platform === "MacPPC") || (navigator.platform === "Macintosh") || (navigator.platform === "MacIntel");
	        var bIsIpad = sUserAgent.match(/ipad/i) === "ipad";
	        var bIsIphoneOs = (String(navigator.platform).indexOf("iPhone") > -1);
	        var isUnix = (navigator.platform === "X11") && !isWin && !isMac;
	        var isLinux = (String(navigator.platform).indexOf("Linux") > -1);
	        var bIsAndroid = (String(navigator.userAgent).indexOf("Android") > -1);
	        var bIsCE = sUserAgent.match(/windows ce/i) === "windows ce";
	        var bIsWM = sUserAgent.match(/windows mobile/i) === "windows mobile";
	        if (isMac)
	            return "Mac";
	        if (isUnix)
	            return "Unix";
	        if (isLinux) {
	            if (bIsAndroid)
	                return "Android";
	            else
	                return "Linux";
	        }
	        if(bIsCE || bIsWM){
	            return 'wm';
	        }
	        if(bIsIphoneOs || bIsIpad){
	            return 'iPhone os';
	        }
	         
	        if (isWin) {
	            var isWin2K = sUserAgent.indexOf("Windows NT 5.0") > -1 || sUserAgent.indexOf("Windows 2000") > -1;
	            if (isWin2K)
	                return "Win2000";
	            var isWinXP = sUserAgent.indexOf("Windows NT 5.1") > -1 ||
	                    sUserAgent.indexOf("Windows XP") > -1;
	            if (isWinXP)
	                return "WinXP";
	            var isWin2003 = sUserAgent.indexOf("Windows NT 5.2") > -1 || sUserAgent.indexOf("Windows 2003") > -1;
	            if (isWin2003)
	                return "Win2003";
	            var isWinVista = sUserAgent.indexOf("Windows NT 6.0") > -1 || sUserAgent.indexOf("Windows Vista") > -1;
	            if (isWinVista)
	                return "WinVista";
	            var isWin7 = sUserAgent.indexOf("Windows NT 6.1") > -1 || sUserAgent.indexOf("Windows 7") > -1;
	            if (isWin7)
	                return "Win7";
	            var isWin8 = sUserAgent.indexOf("Windows NT 6.2") > -1 || sUserAgent.indexOf("Windows 8") > -1;
	            if (isWin8)
	                return "Win8";
				
				return "Win other"
	          }
	          return "other";
	      },

        getDomain:function(){ //获取网站的域名
            return document.URL.substring(document.URL.indexOf("://") + 3,document.URL.lastIndexOf("\/"));
        },
        isString:function(obj){// 判断是不是String类型
            return (obj != null) && (obj != undefined) && (typeof obj == 'string') && (obj.constructor == String);    
        },
        isNumber:function(obj){// 判断是否是数组
            return (typeof obj == 'number') && (obj.constructor == Number);    
        },
        isDate:function(obj){// 判断是否是日期
            return obj && (typeof obj == 'object') && (obj.constructor == Date);
        },
        isArray:function(obj){//判断是否是数组
            return obj && (typeof obj == 'object') && (obj.constructor == Array);    
        },
        isObject:function(obj){//判断是否是对象
            return obj && (typeof obj == 'object') && (obj.constructor == Object)    
        },
        trim:function(str){// 去除左右两边空格
            return str.replace(/(^\s*)|(\s*$)/, "");;
        }
    },
    
    
    
    //计算页面停留时间
    sUpPageStartTime = upBeaconUtil.trim(upBeaconUtil.getCookie(up_page_stime));  //获取页面开始时间
    if (sUpPageStartTime == undefined || sUpPageStartTime == null || sUpPageStartTime == '' || sUpPageStartTime == '-'){
            StayTime = 0;
    }
    else{
    	      StayTime = new Date().getTime() - sUpPageStartTime;  	
    }      
    
    upBeaconUtil.setCookie(up_page_stime,new Date().getTime());
    
    beacon_vist_num = isNaN(beacon_vist_num = +upBeaconUtil.getCookie(up_beacon_vist_count)) ? 1:beacon_vist_num + 1;// 从cookie里获取访问次数
    upBeaconUtil.setCookie(up_beacon_vist_count,beacon_vist_num);//记录新的访问次数   
    
    btsVal = upBeaconUtil.trim(upBeaconUtil.getCookie(bts));  //记录客户端第一次访问，生成uuid
    if (btsVal == undefined || btsVal == null || btsVal == '' || btsVal == '-'){
            upBeaconUtil.setCookie(bts,upBeaconUtil.uuid(),2000,'/');
            btsVal = upBeaconUtil.uuid();
    }      
    
    sUpFirstDate = upBeaconUtil.trim(upBeaconUtil.getCookie(up_first_date));  //记录第一次访问时间
    if (sUpFirstDate == undefined || sUpFirstDate == null || sUpFirstDate == '' || sUpFirstDate == '-'){
            upBeaconUtil.setCookie(up_first_date,upBeaconUtil.getFirstDate(),2000,'/');
            sUpFirstDate = upBeaconUtil.getFirstDate();
    }      
        
    var setUpBeaconId = function(){              //生成CookieID
        var sUpBeaconId = upBeaconUtil.trim(upBeaconUtil.getCookie(up_beacon_id));
        if (sUpBeaconId == undefined || sUpBeaconId == null || sUpBeaconId == '' || sUpBeaconId == '-'){
            upBeaconUtil.setCookie(up_beacon_id,(upBeaconUtil.getCookie(bts) + '-' + (new Date()).getTime()));
        }        
    }(),
    

    
    beaconMethod = {
        uvId:'up_beacon_id',// 
        memId:'up_dw_track'    ,
        beaconUrl:'pv.open.com.cn/info.php',  //记录访问日志的url
        errorUrl:'pv.open.com.cn/error.php',  //记录错误日志的url
        clickUrl:'pv.open.com.cn/click.php',  //记录click日志的url 
        
        pageId:typeof _beacon_pageid != 'undefined'?_beacon_pageid:(_beacon_pageid = upBeaconUtil.getRand()),//生产pageId(页面唯一标示)
        protocol:function(){//请求的协议例如http://
            var reqHeader = location.protocol;
            if ('file:' === reqHeader){
                reqHeader = 'http:';    
            }
            return reqHeader + '//';
        },
        tracking:function(){// 记录访问日志的方法（对外）
            this.beaconLog();
        },
        getRefer:function(){// 获取上游页面信息和搜索引擎关键字
            var reqRefer = document.referrer;
            reqRefer == location.href && (reqRefer = '');
            var kw=reqRefer.split(".")[1];
            var grep=null;
            var str=null;
            Keyword='-';
            try{
                reqRefer = '' == reqRefer ? opener.location:reqRefer;
                reqRefer = '' == reqRefer ? '-':reqRefer;
            }catch(e){
                reqRefer = '-';
            }
            
            if(reqRefer != '-'){
            	switch(kw){
               case "baidu":
                  grep=/wd\=.*\&/i;
                  str=reqRefer.match(grep)
                  Keyword=str.toString().split("=")[1].split("&")[0];
                  Keyword=decodeURIComponent(Keyword);
                  break;
               case "google":
                  grep=/&q\=.*\&/i;
                  str=reqRefer.match(grep)
                  Keyword=str.toString().split("&")[1].split("=")[0];
                  Keyword=decodeURIComponent(Keyword);
               case "bing":
                  grep=/q\=.*\&/i;
                  str=reqRefer.match(grep)
                  Keyword=str.toString().split("=")[1].split("&")[0];
                  Keyword=decodeURIComponent(Keyword);
               case "sogou":
                  grep=/query\=.*\&/i;
                  str=reqRefer.match(grep)
                  Keyword=str.toString().split("=")[1].split("&")[0];
                  Keyword=decodeURIComponent(Keyword);
               case "so":
                  grep=/&q\=.*\&/i;
                  str=reqRefer.match(grep)
                  Keyword=str.toString().split("=")[1].split("&")[0];
                  Keyword=decodeURIComponent(Keyword);
               case "p":
                  grep=/&q\=.*\&/i;
                  str=reqRefer.match(grep)
                  Keyword=str.toString().split("=")[1].split("&")[0];
                  Keyword=decodeURIComponent(Keyword);
               break;
              }
            }
              
            return encodeURIComponent(reqRefer);
        },
                
        Setuserid:function(userid){// 在Cookie中设置用户ID
        	var sUpBeaconUserid = upBeaconUtil.trim(upBeaconUtil.getCookie(up_beacon_user_id));
          if (sUpBeaconUserid == undefined || sUpBeaconUserid == null || sUpBeaconUserid == '' || sUpBeaconUserid == '-' || upBeaconUtil != userid){
          		upBeaconUtil.setCookie(up_beacon_user_id,userid,2000,'/');//记录用户ID
          }        
        },
        
        SetUniversityid:function(uid){// 在Cookie中设置大学ID
        	var sUpBeaconUniid = upBeaconUtil.trim(upBeaconUtil.getCookie(up_beacon_uni_id));
          if (sUpBeaconUniid == undefined || sUpBeaconUniid == null || sUpBeaconUniid == '' || sUpBeaconUniid == '-' || upBeaconUtil != uid){
          		upBeaconUtil.setCookie(up_beacon_uni_id,uid,2000,'/');//记录用户ID
          }        
        },
        
        SetUserName:function(userName){// 在Cookie中设置用户名
        	return userName;
        },
        
        beaconLog:function(){// 记录访问日志方法
            try{
                var httpHeadInd = document.URL.indexOf('://'),
                    httpUrlContent = upBeaconUtil.getParam(encodeURIComponent(document.URL.substring(httpHeadInd + 2))),
                    hisPageUrl = upBeaconUtil.getParam(this.getRefer()),
                    ptId = upBeaconUtil.getCookie(this.memId),
                    cId = upBeaconUtil.getCookie(this.uvId),
                    btsVal = upBeaconUtil.getCookie(bts),
                    userid = upBeaconUtil.getCookie(up_beacon_user_id),
                    uniid = upBeaconUtil.getCookie(up_beacon_uni_id),
                    visitid = upBeaconUtil.getCookie(up_beacon_id),
                    firstdate = sUpFirstDate,
                    osType = upBeaconUtil.getOs(),
                    detectOS = upBeaconUtil.getDetectOS(),
                    kw = Keyword,
                    ChannelID = LogChannelID,
                    beanconMObj = {};
                if (ptId != '-'){
                    beanconMObj.memId = ptId;    
                }
                    logPageId = this.pageId,
                    logTitle = document.title;
                if (logTitle.length > 25){
                    logTitle = logTitle.substring(0,25);
                }
                logTitle = encodeURIComponent(logTitle);
                var logCharset = (navigator.userAgent.indexOf('MSIE') != -1) ? document.charset : document.characterSet,
                    logQuery = upBeaconUtil.getParam({
                        pageId:logPageId,
                        title:logTitle,
                        charset:logCharset,
                        sr:(window.screen.width + '*' + window.screen.height)
                    });
                var sparam = {
                	  logChannel:ChannelID.toLowerCase(),
                	  logVisitId:visitid,
                	  logBtsVal:btsVal,
                	  logUserid:userid,
                	  logOsType:osType,
                	  logdetectOS:detectOS,
                    logUrl:httpUrlContent.toLowerCase(),
                    logHisRefer:hisPageUrl.toLowerCase(),
                    logkw:kw,
                    logQuery:logQuery,
                    logFirstdate:firstdate,
                    loguni:uniid
                };
                this.sendRequest(this.beaconUrl,sparam);
            }catch(ex){
                this.sendError(ex);    
            }
        },
        
        clickLog:function(sparam){// 记录点击日志
            try{
            var httpHeadInd = document.URL.indexOf('://');
            	  httpUrlContent = upBeaconUtil.getParam(encodeURIComponent(document.URL.substring(httpHeadInd + 2)));
            	  btsVal = upBeaconUtil.getCookie(bts);
                visitid = upBeaconUtil.getCookie(up_beacon_id);
            	  userid = upBeaconUtil.getCookie(up_beacon_user_id);
            	  ChannelID =  upBeaconUtil.getDomain();
            var	logcharset = (navigator.userAgent.indexOf('MSIE') != -1) ? document.charset : document.characterSet;
                // 获得pageId
                var clickPageId = this.pageId;
                if (!clickPageId){// 当pageId值为空，重新计算pageId
                    this.pageId = upBeaconUtil.getRand();
                    clickPageId    = this.pageId;
                }
                var clickAuthId = this.authId;//authId是针对某个网站的唯一标示
                if (!clickAuthId){
                    clickAuthId = '-';    
                }
                if (upBeaconUtil.isObject(sparam)){// 当传入参数是javascript对象
                	  sparam.logVisitId = visitid;
                	  sparam.logBtsVal = btsVal;
                	  sparam.logUserid = userid;
                	  sparam.logcharset = logcharset;
                	  sparam.logUrl = httpUrlContent;
                    sparam.pageId = clickPageId;
                    sparam.authId = clickAuthId;    
                }else{
                    if (upBeaconUtil.isString(sparam) && sparam.indexOf('=') > 0){// 当传入参数是字符串
                        sparam += '&logVisitId=' + visitid + '&logBtsVal=' + btsVal +'&logUserid=' + userid + '&pageId=' + clickPageId + '&logUrl=' + httpUrlContent +
                        "&logcharset="+logcharset+"&logChannel="+LogChannelID+"&logmx="+mousePosx+"&logmy="+mousePosy;
                    }else{
                        if (upBeaconUtil.isArray(sparam)){// 当传入参数是数组
                            sparam.push("pageId=" + clickPageId);
                            sparam.push("authId=" + clickAuthId);
                            sparam = sparam.join('&');//数组转化为字符串
                        }else{// 其他数据类型
                            sparam = {
                            	logVisitId:visitid,
                	            logBtsVal:btsVal,
                            	logUserid:userid,
                            	logcharset:logcharset,
                            	logUrl:httpUrlContent,
                            	pageId:clickPageId,
                            	logChannel:LogChannelID,
                            	mx:mousePosx,
                            	my:mousePosy
                            	};    
                        }
                    }
                }
                this.sendRequest(this.clickUrl, sparam);// 发送点击日志
            }catch(ex){
                this.sendError(ex);        
            }
        },
        
        sendRequest:function(url,params){// 日志发送方法
            var urlParam = '',currDate = new Date();
            try{
                if (params){
                    urlParam = upBeaconUtil.getParam(params,false);
                    urlParam = (urlParam == '')?urlParam:(urlParam + '&');
                }
                var tmpUrlParam = 'ver=' + upBeaconUtil.getVersion() + '&time=' + currDate.getTime();
                url = this.protocol() + url + '?' + urlParam + tmpUrlParam;
                
                var logImage = new Image();
                    logImage.onload = function(){
                    logImage = null;    
                }
                logImage.src = url;
            }catch(e){
                this.sendError(e);
            }
        },
        
        sendError:function(ex){// 发送错误日志
            var errURIParams = upBeaconUtil.parseError(ex),
                errURL = this.errorUrl + '?type=send&exception=' + encodeURIComponent(errURIParams.toString()),
                errImage = new Image();
            errImage.onload = function(){
                errImage = null;    
            };
            errImage.src = this.protocol() + errURL;
        }
    };
    beaconMethod.tracking();
    window.upLogger = beaconMethod;//构建window的upLogger对象
    document.onmousedown = upBeaconUtil.mouseDown;
})(window,document);


// 记录用户ID
function SetUserIDLogerr(userId){
    if (window.upLogger){
        upLogger.Setuserid(encodeURI(userId));  
    }
}
// 记录用户名 暂时不用
function SetUserNameLogerr(userName){
    if (window.upLogger){
        upLogger.SetUserName(userName);  
    }
}
// 用户行为统计代码
function recordStaticLogerr(authId,type,msg){
    if (window.upLogger){
        upLogger.authId = authId;
        upLogger.clickLog('type=' + type + '&clickTarget=' + msg);    
    }
}
// 记录click日志的方法
function clickBtn(clog_msg,clog_type){
    var clog_authId    = 'pv'
    recordStaticLogerr(clog_authId,clog_type,clog_msg);    
}

// 高校编号
function SetUniversityIDLogerr(uid){
    if (window.upLogger){
        upLogger.SetUniversityid(uid);  
    }
}

