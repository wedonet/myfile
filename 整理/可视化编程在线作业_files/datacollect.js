
(function(window,document,undefined){
	
    // upLogger�����ǲɼ��ű������ṩ�Ĳ�������
    if (window.upLogger){//�����Ϊ�գ�ֱ�ӷ��أ������ظ���װ
        return;
    }    
    var	 bts = 'b_t_s_' + LogChannelID;
    var	 up_beacon_id = 'up_beacon_id_' + LogChannelID;
    var	 up_beacon_vist_count = 'up_beacon_vist_count_'+ LogChannelID;
    var	 up_first_date = 'up_first_date';
    var	 up_page_stime = 'up_page_stime_' + LogChannelID;
    var	 up_beacon_user_id = 'up_beacon_user_id_' + LogChannelID;
    var	 up_beacon_uni_id = 'up_beacon_uni_id_' + LogChannelID;
    var  mousePosx;   //���λ��x
    var  mousePosy;   //���λ��y
    
    var Keyword = null;
    var upBeaconUtil ={                   //��־��¼������
        jsName:'datacollect.js',          //��������
        defaultVer:2015021001,            //�汾����
                                          //Cookie����ʹ��Channel����
                                          //���ӻ�ȡ�豸����ϵͳ����
        
        getVersion:function(){            //��ȡ�汾��
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
        setCookie:function(sName,sValue,oExpires,sPath,sDomain,bSecure){//����cookie��Ϣ
            var currDate = new Date(),
                sExpires = typeof oExpires == 'undefined'?'':';expires=' + new Date(currDate.getTime() + (oExpires * 24 * 60 * 60* 1000)).toUTCString();
                sDomain = upBeaconUtil.getHost();
            document.cookie = sName + '=' + sValue + sExpires + ((sPath == null)?'':(' ;path=' + sPath)) + ((sDomain == null)?'':(' ;domain=' + sDomain)) + ((bSecure == true)?' ; secure':'');
        },
        getCookie:function(sName){//��ȡcookie��Ϣ
            var regRes = document.cookie.match(new RegExp("(^| )" + sName + "=([^;]*)(;|$)"));
            return (regRes != null)?unescape(regRes[2]):'-';
        },
        
        getHost:function() {  //��ȡ��������
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
        getFirstDate:function(){  //��õ�ǰ����
            var today = new Date();
            var year = today.getFullYear();
            var month = today.getMonth()+1;
            var day = today.getDate();
            return year + '-' + ((month < 10)?('0' + month):month) + '-' + ((day < 10)?('0' + day):day);
        },
        getRand:function(){// ����ҳ���Ψһ��ʾ
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
        getParam:function(obj,flag){// ����ת������
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
        base64encode: function(G) {//base64����
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
        
        getOs:function() {    //����������Ϣ
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
        
        //JS�жϷ����豸����ϵͳ(userAgent)
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

        getDomain:function(){ //��ȡ��վ������
            return document.URL.substring(document.URL.indexOf("://") + 3,document.URL.lastIndexOf("\/"));
        },
        isString:function(obj){// �ж��ǲ���String����
            return (obj != null) && (obj != undefined) && (typeof obj == 'string') && (obj.constructor == String);    
        },
        isNumber:function(obj){// �ж��Ƿ�������
            return (typeof obj == 'number') && (obj.constructor == Number);    
        },
        isDate:function(obj){// �ж��Ƿ�������
            return obj && (typeof obj == 'object') && (obj.constructor == Date);
        },
        isArray:function(obj){//�ж��Ƿ�������
            return obj && (typeof obj == 'object') && (obj.constructor == Array);    
        },
        isObject:function(obj){//�ж��Ƿ��Ƕ���
            return obj && (typeof obj == 'object') && (obj.constructor == Object)    
        },
        trim:function(str){// ȥ���������߿ո�
            return str.replace(/(^\s*)|(\s*$)/, "");;
        }
    },
    
    
    
    //����ҳ��ͣ��ʱ��
    sUpPageStartTime = upBeaconUtil.trim(upBeaconUtil.getCookie(up_page_stime));  //��ȡҳ�濪ʼʱ��
    if (sUpPageStartTime == undefined || sUpPageStartTime == null || sUpPageStartTime == '' || sUpPageStartTime == '-'){
            StayTime = 0;
    }
    else{
    	      StayTime = new Date().getTime() - sUpPageStartTime;  	
    }      
    
    upBeaconUtil.setCookie(up_page_stime,new Date().getTime());
    
    beacon_vist_num = isNaN(beacon_vist_num = +upBeaconUtil.getCookie(up_beacon_vist_count)) ? 1:beacon_vist_num + 1;// ��cookie���ȡ���ʴ���
    upBeaconUtil.setCookie(up_beacon_vist_count,beacon_vist_num);//��¼�µķ��ʴ���   
    
    btsVal = upBeaconUtil.trim(upBeaconUtil.getCookie(bts));  //��¼�ͻ��˵�һ�η��ʣ�����uuid
    if (btsVal == undefined || btsVal == null || btsVal == '' || btsVal == '-'){
            upBeaconUtil.setCookie(bts,upBeaconUtil.uuid(),2000,'/');
            btsVal = upBeaconUtil.uuid();
    }      
    
    sUpFirstDate = upBeaconUtil.trim(upBeaconUtil.getCookie(up_first_date));  //��¼��һ�η���ʱ��
    if (sUpFirstDate == undefined || sUpFirstDate == null || sUpFirstDate == '' || sUpFirstDate == '-'){
            upBeaconUtil.setCookie(up_first_date,upBeaconUtil.getFirstDate(),2000,'/');
            sUpFirstDate = upBeaconUtil.getFirstDate();
    }      
        
    var setUpBeaconId = function(){              //����CookieID
        var sUpBeaconId = upBeaconUtil.trim(upBeaconUtil.getCookie(up_beacon_id));
        if (sUpBeaconId == undefined || sUpBeaconId == null || sUpBeaconId == '' || sUpBeaconId == '-'){
            upBeaconUtil.setCookie(up_beacon_id,(upBeaconUtil.getCookie(bts) + '-' + (new Date()).getTime()));
        }        
    }(),
    

    
    beaconMethod = {
        uvId:'up_beacon_id',// 
        memId:'up_dw_track'    ,
        beaconUrl:'pv.open.com.cn/info.php',  //��¼������־��url
        errorUrl:'pv.open.com.cn/error.php',  //��¼������־��url
        clickUrl:'pv.open.com.cn/click.php',  //��¼click��־��url 
        
        pageId:typeof _beacon_pageid != 'undefined'?_beacon_pageid:(_beacon_pageid = upBeaconUtil.getRand()),//����pageId(ҳ��Ψһ��ʾ)
        protocol:function(){//�����Э������http://
            var reqHeader = location.protocol;
            if ('file:' === reqHeader){
                reqHeader = 'http:';    
            }
            return reqHeader + '//';
        },
        tracking:function(){// ��¼������־�ķ��������⣩
            this.beaconLog();
        },
        getRefer:function(){// ��ȡ����ҳ����Ϣ����������ؼ���
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
                
        Setuserid:function(userid){// ��Cookie�������û�ID
        	var sUpBeaconUserid = upBeaconUtil.trim(upBeaconUtil.getCookie(up_beacon_user_id));
          if (sUpBeaconUserid == undefined || sUpBeaconUserid == null || sUpBeaconUserid == '' || sUpBeaconUserid == '-' || upBeaconUtil != userid){
          		upBeaconUtil.setCookie(up_beacon_user_id,userid,2000,'/');//��¼�û�ID
          }        
        },
        
        SetUniversityid:function(uid){// ��Cookie�����ô�ѧID
        	var sUpBeaconUniid = upBeaconUtil.trim(upBeaconUtil.getCookie(up_beacon_uni_id));
          if (sUpBeaconUniid == undefined || sUpBeaconUniid == null || sUpBeaconUniid == '' || sUpBeaconUniid == '-' || upBeaconUtil != uid){
          		upBeaconUtil.setCookie(up_beacon_uni_id,uid,2000,'/');//��¼�û�ID
          }        
        },
        
        SetUserName:function(userName){// ��Cookie�������û���
        	return userName;
        },
        
        beaconLog:function(){// ��¼������־����
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
        
        clickLog:function(sparam){// ��¼�����־
            try{
            var httpHeadInd = document.URL.indexOf('://');
            	  httpUrlContent = upBeaconUtil.getParam(encodeURIComponent(document.URL.substring(httpHeadInd + 2)));
            	  btsVal = upBeaconUtil.getCookie(bts);
                visitid = upBeaconUtil.getCookie(up_beacon_id);
            	  userid = upBeaconUtil.getCookie(up_beacon_user_id);
            	  ChannelID =  upBeaconUtil.getDomain();
            var	logcharset = (navigator.userAgent.indexOf('MSIE') != -1) ? document.charset : document.characterSet;
                // ���pageId
                var clickPageId = this.pageId;
                if (!clickPageId){// ��pageIdֵΪ�գ����¼���pageId
                    this.pageId = upBeaconUtil.getRand();
                    clickPageId    = this.pageId;
                }
                var clickAuthId = this.authId;//authId�����ĳ����վ��Ψһ��ʾ
                if (!clickAuthId){
                    clickAuthId = '-';    
                }
                if (upBeaconUtil.isObject(sparam)){// �����������javascript����
                	  sparam.logVisitId = visitid;
                	  sparam.logBtsVal = btsVal;
                	  sparam.logUserid = userid;
                	  sparam.logcharset = logcharset;
                	  sparam.logUrl = httpUrlContent;
                    sparam.pageId = clickPageId;
                    sparam.authId = clickAuthId;    
                }else{
                    if (upBeaconUtil.isString(sparam) && sparam.indexOf('=') > 0){// ������������ַ���
                        sparam += '&logVisitId=' + visitid + '&logBtsVal=' + btsVal +'&logUserid=' + userid + '&pageId=' + clickPageId + '&logUrl=' + httpUrlContent +
                        "&logcharset="+logcharset+"&logChannel="+LogChannelID+"&logmx="+mousePosx+"&logmy="+mousePosy;
                    }else{
                        if (upBeaconUtil.isArray(sparam)){// ���������������
                            sparam.push("pageId=" + clickPageId);
                            sparam.push("authId=" + clickAuthId);
                            sparam = sparam.join('&');//����ת��Ϊ�ַ���
                        }else{// ������������
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
                this.sendRequest(this.clickUrl, sparam);// ���͵����־
            }catch(ex){
                this.sendError(ex);        
            }
        },
        
        sendRequest:function(url,params){// ��־���ͷ���
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
        
        sendError:function(ex){// ���ʹ�����־
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
    window.upLogger = beaconMethod;//����window��upLogger����
    document.onmousedown = upBeaconUtil.mouseDown;
})(window,document);


// ��¼�û�ID
function SetUserIDLogerr(userId){
    if (window.upLogger){
        upLogger.Setuserid(encodeURI(userId));  
    }
}
// ��¼�û��� ��ʱ����
function SetUserNameLogerr(userName){
    if (window.upLogger){
        upLogger.SetUserName(userName);  
    }
}
// �û���Ϊͳ�ƴ���
function recordStaticLogerr(authId,type,msg){
    if (window.upLogger){
        upLogger.authId = authId;
        upLogger.clickLog('type=' + type + '&clickTarget=' + msg);    
    }
}
// ��¼click��־�ķ���
function clickBtn(clog_msg,clog_type){
    var clog_authId    = 'pv'
    recordStaticLogerr(clog_authId,clog_type,clog_msg);    
}

// ��У���
function SetUniversityIDLogerr(uid){
    if (window.upLogger){
        upLogger.SetUniversityid(uid);  
    }
}

