define(['jquery', 'bootbox', 'handlebars', 'bootstrapDropdown', 'bootstrapModal', 'layer'], function ($, bootbox, Handlebars) {
    //window操作
    var _window = {} || _window;

    //公共对象
    var _common = _common || {};

    //ajax对象
    var _ajax = _ajax || {};

    //layer模态框
    var _dialogBox = _dialogBox || {};

    //禁用右键
    _window.prohibitContextMenu = function () {
        document.oncontextmenu = function () {
            return false;
        }
    }
    //禁用ctrl+c功能
    _window.prohibitCtrlC = function () {
        document.onkeydown = function () {
            if (event.ctrlKey && window.event.keyCode == 67) {
                return false;
            }
        }
    }

    //禁用选中
    _window.prohibitSelect = function () {
        $(document).on('selectstart', function () {
            return false;
        })
    }

    //ajax封装
    _ajax.call = function (options) {
        //默认参数
        var defaults = {
            type: 'get',
            dataType: 'json',
            // jsonp: 'callback',
            async: true,
            cache: false,
            jsonData: '',
            // xhrFields: {
            //     withCredentials: true
            // },
            // crossDomain: true,
            title: 'defaultTitle',
            timeout: 20000,
            error: function () { },
            success: function () { }
        };

        ////传入参数
        //var options = {
        //    url: url,
        //    type: type,
        //    data: data,
        //    //async: async,
        //    error: errorCallback,
        //    success: successCallback
        //};
        //与传入参数合并
        var settings = $.extend({}, defaults, options);
        //判断是否是jsonp
        if (settings.dataType.toLowerCase() == "jsonp") {
            if (settings.url.indexOf('?') >= 0)
                settings.url = settings.url + "&callback=?";
            else
                settings.url = settings.url + "?callback=?";
        }
        if (settings.url.indexOf('?') >= 0)
            settings.url = settings.url + "&bust=" + (new Date()).getTime();
        else
            settings.url = settings.url + "?bust=" + (new Date()).getTime();

        //var request = $.ajax(options);
        var jsonData = settings.jsonData;
        if (jsonData != undefined && jsonData != '') {
            if (typeof settings.success === "function") {
                settings.success(jsonData);
            }
            return;
        }

        //开始执行ajax
        $.ajax({
            type: settings.type,
            dataType: settings.dataType,
            async: settings.async,
            // jsonp: settings.jsonp,
            cache: settings.cache,
            // xhrFields: settings.xhrFields,
            // crossDomain: settings.crossDomain,
            url: settings.url,
            data: settings.data,
            timeout: 60000,

            success: function (resp) { //成功
                if (typeof settings.success === "function") {
                    settings.success(resp);
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) { //失败
                // bootbox.alert('error:'+textStatus+errorThrown);
                if (typeof settings.error === "function") settings.error(XMLHttpRequest, textStatus, errorThrown);
            }
        });
    };

    //工具
    var _utils = _utils || {};

    //数组
    var _array = _array || {};

    //深度克隆
    _common.cloneObj = function(obj){
        var str, newobj = obj.constructor === Array ? [] : {};
        if(typeof obj !== 'object'){
            return;
        } else if(window.JSON){
            str = JSON.stringify(obj), //序列化对象
            newobj = JSON.parse(str); //还原
        } else {
            for(var i in obj){
                newobj[i] = typeof obj[i] === 'object' ? 
                cloneObj(obj[i]) : obj[i]; 
            }
        }
        return newobj;
    };

    //数字转字母
    _common.convertNum = function (num) {
        var _newNum = parseInt(num) + 1;
        return String.fromCodePoint(_newNum + 64);
    }

    // 对话框初始化
    _common.talkInit = function () {
        var zhiManager = (getzhiSDKInstance());
        console.log(zhiManager)
        zhiManager.set("color", 'aabbcc');  //取值为0-9a-f共六位16进制字符[主题色]    | 默认取后台设置的颜色
        zhiManager.set("powered", 'false'); //true[显示悬浮聊天窗体下方公司标识信息]   false[不显示]   | 默认显示
        zhiManager.set('customBtn', 'true'); //true[自定义按钮]  false[使用系统默认咨询按钮]     | 默认为系统咨询按钮
        zhiManager.set('manual', 'true');   //true[手动初始化]   false[自动初始化]  | 默认调用后自动初始化
        zhiManager.set('manTrace', true);   //true[开启用户访问轨迹收集]  false[不开启]  |默认不开启用户访问轨迹收集
        zhiManager.set('isInviteFlag', 'true'); //true[开启主动邀请功能]  false[不开启] |默认不开启
        zhiManager.set('location', 1); //1[系统默认按钮靠右显示]  3[系统默认按钮靠左显示]
        zhiManager.set('horizontal', 5000); //水平边距 px
        zhiManager.set('vertical', 50); //垂直边距  px
        zhiManager.set('tipTitle', '客服邀请您进入会话'); //主动邀请文案
        zhiManager.set('submitBtnTitle', '接受邀请'); //主动邀请功能接受按钮文案
        zhiManager.set('invite', 1); // 是否开启自动邀请  1 开启 0 关闭  | 默认关闭
        zhiManager.set('firstTimeout', 1); // 第一次加载延迟邀请时间   时间为秒
        zhiManager.set('overTimeout', 10); //拒绝后再次邀请时间       时间为秒
        zhiManager.set('inviteCount', 1); //一天之内共邀请多少次
        zhiManager.set('lan', 'cn'); //支持语言   cn 中文  en 英文   默认为 中文
        zhiManager.set('telShowFlag', 'true');   //true[显示手机号输入框]  false[不显示] |  默认显示
        zhiManager.set('telFlag', 'false');  //true[手机号为必填项]  false[为选填项]  | 默认必填
        zhiManager.set('satDegree_A', true); //true[开启主动评价功能] false[不开启] | 默认开启
        zhiManager.set('msgflag', false); //false[开启窗体和结束会话后的留言功能] true[不开启] | 默认开启
        zhiManager.set('isMessageFlag', true); //true[开启输入框留言功能] false[不开启] | 默认开启
        zhiManager.set('isFeedBackFlag', true); //true[开启输入框满意度评价功能] false[不开启] | 默认开启
        zhiManager.set('artificial', true);  //true[默认隐藏转人工 遇未知问题时显示转人工]   false[直接显示转人工]  | 默认不隐藏转人工
        zhiManager.set('groupId', 'xxxxxxxxxxxxxx');   //指定技能组
        //对接用户身份、预留字段、自定义字段（新版，推荐）
        zhiManager.set("customerFields", { "weibo": "weicat", "sex": "女", "birthday": "2017-05-17", "cardType": "身份证", "cardNo": "13010319xxxx56xxxx", "address": "北京", "position": "tl", "remark": "good", "customField1": "12", "customField2": "text" });
        zhiManager.set('size', { //悬浮窗宽度与高度
            // 最小宽度360像素，最大宽度640像素，默认360像素
            'width': 460,
            // 最小高度430像素，最大高度720像素，默认540像素 
            'height': 680
        });
        zhiManager.set('preVisitArgs', {
            'preAbstract': '来源页的摘要  可不传',
            'preVisitUrl': '来源页的url   可不传',
            'preVisitTitle': '来源页的标题    可不传',
            'preThumbnail': '来源页的缩略图  可不传',
            'preTags': '来源页的标签    可不传'
        });
        zhiManager.set('curVisitArgs', {
            'curAbstract': '当前页的摘要  可不传',
            'curVisitUrl': '当前页的url   可不传',
            'curVisitTitle': '当前页的标题    可不传',
            'curThumbnail': '当前页的缩略图  可不传',
            'curTags': '当前页的标签    可不传'
        });
        //通过参数设置H5聊天页面显示商品信息内容
        zhiManager.set("title_info", "智齿_商品详情页_小智智能");  //必传 需编码
        zhiManager.set("url_info", "http://www.sobot.com/order/zc.html"); //必传 需编码
        zhiManager.set("abstract_info", "更精确的理解，更精确地回答，在闲聊寒暄中，拉近与客户的距离，导入知识库，意想不到的方便快捷，最简单的知识添加，事半功倍。"); //需编码
        zhiManager.set("label_info", "2000"); //需编码
        zhiManager.set("thumbnail_info", "http://test.sobot.com/console/images/logo_new.png"); //需编码
        //自定义按钮后可设置该值改变悬浮窗的水平位置
        zhiManager.set("customMargin", 200);
        //手动初始化时 通过 load 方法调用 js 组件
        zhiManager.on("load", function (ret) {
            zhiManager.initBtnDOM();
        });
        //自定义按钮时 通过该方法获取客服发送的未读内容 & 消息数
        zhiManager.on("receivemessage", function (ret) {
            /**
             * 返回格式：[{content:'您好',msgId:'615b0a3801804f14be1d456e11b329af',customName:'智齿科技'}]
             */
            console.log(ret);
        });
        //自定义按钮时 通过该方法获取客服发送的离线消息数
        zhiManager.on("unread.count", function (data) {
            console.log(data);
        });
        //window.open(res.data.url)
    }

    //获取URL参数
    _common.getUrlParams = function (url) {
        var reg_url = /^[^\?]+\?([\w\W]+)$/,
            reg_para = /([^&=]+)=([\w\W]*?)(&|$|#)/g,
            arr_url = reg_url.exec(url),
            ret = {};
        if (arr_url && arr_url[1]) {
            var str_para = arr_url[1], result;
            while ((result = reg_para.exec(str_para)) != null) {
                ret[result[1]] = result[2];
            }
        }
        return ret;
    }
    //地址栏根据参数名获取值（转成小写）
    _common.GetQueryString = function (name) {
        var reg = new RegExp("(^|&)" + name.toLowerCase() + "=([^&]*)(&|$)");
        var r = (window.location.search.substr(1)).toLowerCase().match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    }
    //地址栏根据参数名获取值（原始）
    _common.GetQueryStringAncestral = function (name) {
        var reg = new RegExp("(^|&)" + name.toLowerCase() + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    }
    _common.getUrlParam = function (name) {
        var url = decodeURI(location.search); //?id="123456"&Name="bicycle";
        var object = {};
        if (url.indexOf("?") != -1)//url中存在问号，也就说有参数。  
        {
            var str = url.substr(1);  //得到?后面的字符串
            var strs = str.split("&");  //将得到的参数分隔成数组[id="123456",Name="bicycle"];
            for (var i = 0; i < strs.length; i++) {
                object[strs[i].split("=")[0]] = strs[i].split("=")[1]
            }
        }
        return object[name];
    }
    _common.reinitIframe = function (iframeId, minHeight) {
        var browserVersion = window.navigator.userAgent.toUpperCase();
        var isOpera = browserVersion.indexOf("OPERA") > -1 ? true : false;
        var isFireFox = browserVersion.indexOf("FIREFOX") > -1 ? true : false;
        var isChrome = browserVersion.indexOf("CHROME") > -1 ? true : false;
        var isSafari = browserVersion.indexOf("SAFARI") > -1 ? true : false;
        var isIE = (!!window.ActiveXObject || "ActiveXObject" in window);
        var isIE9More = (! -[1, ] == false);
        try {
            var iframe = document.getElementById(iframeId);
            var bHeight = 0;
            if (isChrome == false && isSafari == false)
                bHeight = iframe.contentWindow.document.body.scrollHeight;

            var dHeight = 0;
            if (isFireFox == true)
                dHeight = iframe.contentWindow.document.documentElement.offsetHeight + 2;
            else if (isIE == false && isOpera == false)
                dHeight = iframe.contentWindow.document.body.clientHeight + 50;
            else if (isIE == true && isIE9More) {//ie9+
                var heightDeviation = bHeight - eval("window.IE9MoreRealHeight" + iframeId);
                if (heightDeviation == 0) {
                    bHeight += 3;
                } else if (heightDeviation != 3) {
                    eval("window.IE9MoreRealHeight" + iframeId + "=" + bHeight);
                    bHeight += 3;
                }
            }
            else//ie[6-8]、OPERA
                bHeight += 3;

            var height = Math.max(bHeight, dHeight);
            if (height < minHeight) height = minHeight;
            iframe.style.height = height + "px";
        } catch (ex) { }
    }
    //iframe自适应子页面高度
    _common.iframeAutoHeight = function (iframeId, minHeight) {
        eval("window.IE9MoreRealHeight" + iframeId + "=0");
        setInterval(function () {
            _common.reinitIframe(iframeId, minHeight)
        }, 100);
    }

    //检测IE6、IE7、IE8、IE9浏览器
    _common.checkIE9 = function () {
        if (navigator.appName == "Microsoft Internet Explorer") {
            var ieVer = navigator.appVersion.split(";")[1].replace(/[ ]/g, "");
            if (ieVer == "MSIE6.0" || ieVer == "MSIE7.0" || ieVer == "MSIE8.0" || ieVer == "MSIE9.0") {
                return true;
            }
        }
        else {
            return false;
        }
    }
    //检测IE6、IE7、IE8
    _common.checkIE8 = function () {
        if (navigator.appName == "Microsoft Internet Explorer") {
            var ieVer = navigator.appVersion.split(";")[1].replace(/[ ]/g, "");
            if (ieVer == "MSIE6.0" || ieVer == "MSIE7.0" || ieVer == "MSIE8.0") {
                return true;
            }
        }
        else {
            return false;
        }
    }

    //检测IE6、IE7浏览器
    _common.checkIE6 = function () {
        if (navigator.appName == "Microsoft Internet Explorer") {
            var ieVer = navigator.appVersion.split(";")[1].replace(/[ ]/g, "");
            if (ieVer == "MSIE6.0" || ieVer == "MSIE7.0") {
                return true;
            }
        }
        else {
            return false;
        }
    }

    _common.deSerializeToSpan = function (dom, data) {
        if (!data || !dom)
            return;
        $(dom).find("[data-name]:not('.NonSerialized,:radio')").each(function () {
            var item = data[$(this).attr("data-name")];
            $(this).text(item == null ? "" : item);
        });
    }

    //对象转成url参数
    _common.parseParam = function (param, key) {
        var paramStr = "";
        if (param instanceof String || param instanceof Number || param instanceof Boolean) {
            paramStr += "&" + key + "=" + encodeURIComponent(param);
        } else {
            try {
                $.each(param, function (i) {
                    var k = key == null ? i : key + (param instanceof Array ? "[" + i + "]" : "." + i);
                    paramStr += '&' + _common.parseParam(this, k);
                });
            }
            catch (e) {

            }
        }
        return paramStr.substr(1);
    }
    
    //整页加载
    _dialogBox.loading = function (modal) {
        var loadingObj
        if (typeof modal === 'undefined') {
            loadingObj = layer.load(0, { shade: [0.5, '#000'] }); //0代表加载的风格，支持0-2
        }
        else {
            loadingObj = layer.load(modal.type, { shade: [modal.shade, '#000'] }); //0代表加载的风格，支持0-2
        }
        return loadingObj;
    }
    _dialogBox.closeLoading = function (loadingobj) {
        layer.close(loadingobj);
    }

    //iframe整页加载
    _dialogBox.iframeLoading = function (modal) {
        var loadingObj
        if (modal) {
            loadingObj = top.layer.load(modal.type, { shade: [modal.shade, '#000'] }); //0代表加载的风格，支持0-2
        }
        else {
            loadingObj = top.layer.load(0, { shade: [0.5, '#000'] }); //0代表加载的风格，支持0-2
        }
        return loadingObj;
    }
    _dialogBox.iframeCloseLoading = function (loadingobj) {
        top.layer.close(loadingobj);
    }

    _dialogBox.iframeCloseAll = function (loadingobj) {
        top.layer.closeAll();
    }

    //提示框
    _dialogBox.msg = function (msg, time, fun) {
        if (typeof time === 'undefined') { time = 1500 }
        layer.msg(msg, { time: time }, fun);
    }

    //提示框
    _dialogBox.iframeMsg = function (msg, time, fun) {
        if (typeof time === 'undefined') { time = 1500 }
        top.layer.msg(msg, { time: time, shadeClose: true }, fun);
    }

    //弹出框-加载页面
    _dialogBox.open = function (modal) {
        layer.open({
            type: modal.type, //1:直接显示content的内容，2:显示content的网址内容
            title: modal.title,
            zIndex: modal.zIndex,
            scrollbar: modal.scrollbar,
            maxWidth: modal.maxWidth,
            maxHeight: modal.maxHeight,
            shadeClose: modal.shadeClose,
            shade: modal.shade,
            btn: modal.btn,
            area: modal.area,
            content: modal.content, //url或者html
            success: modal.success,
            cancel: modal.cancel,
            closeBtn: modal.closeBtn
        });
    }

    _dialogBox.closeAll = function () {
        layer.closeAll();
    }

    //弹出大图-加载页面
    _dialogBox.openImg = function (modal) {
        layer.open({
            type: modal.type,
            title: modal.title,
            closeBtn: modal.closeBtn,
            area: modal.area,
            skin: modal.skin, //没有背景色
            shadeClose: modal.shadeClose,
            content: modal.content //url或者html
        });
    }
    //确认框(2个按钮)
    _dialogBox.confirmation = function (modal) {
        layer.open({
            type: modal.type,
            shade: modal.shade,
            title: modal.title,
            area: modal.area,
            content: modal.content,
            btn: modal.btn,
            yes: modal.yes,
            btn2: modal.btn2
        });
    }
    
    //iframe弹出框-加载页面
    _dialogBox.iframeOpen = function (modal) {
        var _addWorkDialog = top.layer.open({
            type: modal.type, //1:直接显示content的内容，2:显示content的网址内容
            title: modal.title,
            shadeClose: modal.shadeClose,
            shade: modal.shade,
            area: modal.area,
            maxmin: modal.maxmin,
            content: modal.content, //url或者html
            success: modal.success,
            cancel: modal.cancel
        });
        //top.layer.full(_addWorkDialog);
    }

    //iframe弹出框-询问框
    _dialogBox.iframeConfirmationBox = function (modal) {
        top.layer.open({
            type: 1, //1:直接显示content的内容，2:显示content的网址内容
            title: modal.title,
            shade: 0.5,
            btn: ['确定', '取消'],
            area: modal.area,
            content: modal.content, //url或者html
            yes: modal.success,
            cancel: modal.cancel
        });
        //top.layer.full(_addWorkDialog);
    }
    //iframe弹出框-询问框
    _dialogBox.iframeConfirmationBoxOne = function (modal) {
        top.layer.open({
            type: 1, //1:直接显示content的内容，2:显示content的网址内容
            title: modal.title,
            shade: 0.5,
            btn: ['关闭'],
            area: modal.area,
            content: modal.content, //url或者html
            cancel: modal.cancel
        });
        //top.layer.full(_addWorkDialog);
    }
    
    //页面统计开始
    //common.call('/StudentCenter/Share/LoadPage', '', 'get', function (data) {
    //    //console.log(data);
    //}, errorlog, '');

    function errorlog() {

    }
    
    /**
 * 解码
 * @param {[type]} name [description]
 */
    //生成GUID
    _utils.creatGuid = function () {
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
    }

    //替换<pre></pre>
    _utils.replacePre = function (str) {
        return str.replace('&lt;pre&gt;', '').replace('&lt;/pre&gt;', '');
    }

    _utils.decode = function (name) {
        try {
            var _name = decodeURIComponent(name);
            //return decodeURIComponent(name);
        } catch (ex) {
            try {
                var _name = decodeURIComponent(decodeURIComponent(escape(name)));
                //return decodeURIComponent(decodeURIComponent(escape(name)));
            } catch (e) {
                var _name = name;
                //return name;
            }
        }
        //转换图片路径
        if (_name.indexOf('http') != -1) {
            reg = new RegExp("\\+", "g");
            var _title = _name.replace(reg, "%2B"); //替换路径中'+'/'%2B'
        } else {
            var _title = _name;
        }

        return _title;
    }

    _utils.spaceReplace = function (value) {
        return spaceReplaceFun(value);
    }

    function spaceReplaceFun(value) {
        var str = _utils.decode(value);
        var _title = '';
        if (str.indexOf('##') != -1) {
            var strArray = str.split('##');
            var len = strArray.length;
            $.each(strArray, function (i) {
                str = str.replace('##', '<input type="text" value="' + (i + 1) + '" disabled="" style="font-size: 14px;text-align: center; width: 50px; margin: 0 10px; background: transparent; padding: 0 10px; border: 0; border-bottom: 1px solid #000;">');
            })
            _title = str;
        } else {
            _title = str;
        }
        return _title;
    }

    //填空题展示
    function blankTxt(value, itemid, _answer) {
        var str = _utils.decode(value);

        var _inputs = '';
        if (str.indexOf('##') != -1) {
            var strArray = str.split('##');
            var len = strArray.length;
            for (i = 0; i < len - 1; i++) {
                var _index = i + 1;
                var _txt = "";
                //填空题赋值
                if (_answer[i] != undefined) {
                    _txt = _answer[i];
                }
                _inputs += '<div class="blankwrap" itemid="' + itemid + '"><div class="item">' + _index + '、' + '<input type="text" class="blanktxt" value="' + _txt + '"></div></div>';
            }
        } else {
        }
        return _inputs;
    }

    //填空题阅卷
    function blankMark(value, itemid, _answer, score, qestype, FillScore) {
        var str = _utils.decode(value);

        var _inputs = '';
        if (str.indexOf('##') != -1) {
            var strArray = str.split('##');
            var len = strArray.length;
            for (i = 0; i < len - 1; i++) {
                var _index = i + 1;
                var _txt = "";
                //填空题赋值
                if (_answer[i] != undefined) {
                    _txt = _answer[i];
                }
                var _fillScore = FillScore == undefined ? '' : FillScore[i];
                _fillScore = _fillScore == null ? '' : _fillScore;
                _inputs += '<div class="blankwrap" itemid="' + itemid + '"><div class="item">' + _index + '、' +
                    '学生作答：<input type="text" class="blanktxt" value="' + _txt + '">，老师批阅：<input qesindex="' + i + '" qestype="' + qestype + '" qesscore="' + score + '" type="text" value="' + _fillScore + '" class="blanktxt teacher-score">  分</div></div>'
            }
        } else {
        }
        return _inputs;
    }
    
    //日期比较 格式必须为：2016-8-10
    _utils.dateCompare = function (date1, date2) {
        date1 = date1.replace(/\-/gi, "/");
        date2 = date2.replace(/\-/gi, "/");
        var time1 = new Date(date1).getTime();
        var time2 = new Date(date2).getTime();
        if (time1 > time2) {
            return 1;
        } else if (time1 == time2) {
            return 2;
        } else {
            return 3;
        }
    }

    _array.isArray = function (value) {
        return value && typeof value === 'object' &&
            Array == value.constructor;
    }

    /****************** handlebars操作 ******************/
    //加1
    Handlebars.registerHelper("addNum", function (value) {
        return parseInt(value) + 1;
    });

    //判断相等
    Handlebars.registerHelper("Equal", function (v1, v2, options) {
        if (_array.isArray(v1) && _array.isArray(v2)) {
            if (v1.join(',') == v2.join(',')) {
                //满足添加继续执行
                return options.fn(this);
            } else {
                //不满足条件执行{{else}}部分
                return options.inverse(this);
            }
        }
        else {
            if (v1 == v2) {
                //满足添加继续执行
                return options.fn(this);
            } else {
                //不满足条件执行{{else}}部分
                return options.inverse(this);
            }
        }
    });

    //条件语句Helper
    Handlebars.registerHelper("exist", function (value, options) {
        if (value === 1) {
            return options.fn(this);
        }
    })
    
    Handlebars.registerHelper("addProp", function (value) {
        if (value === 0) {
            return "";
        } else {
            return " btnDisabled";
        }
    })

    Handlebars.registerHelper("qesTitle", function (value) {
        if (value === 0) {
            return "";
        } else {
            return "该试题已被试卷使用不能删除";
        }
    })

    //选择框可用判断
    Handlebars.registerHelper("checkboxProp", function (value) {
        if (value === 0) {
            return "";
        } else {
            return "disabled";
        }
    })
    //切换题干
    Handlebars.registerHelper("swapQuestionMain", function (value) {
        if (value) {
            return decodeURIComponent(value);
        } else {
            return "";
        }
    })

    //切换难度
    Handlebars.registerHelper("swapDifficult", function (value) {
        if (value >= 0 && value <= 0.3) {
            return "难";
        }
        if (value >= 0.4 && value <= 0.6) {
            return "中";
        }
        if (value >= 0.7 && value <= 1) {
            return "易";
        }
    });
    //转换分类
    Handlebars.registerHelper("swapClassify", function (value) {
        if (value) {
            switch (value) {
                case 1: return "记忆"; break;
                case 2: return "能力"; break;
                case 3: return "应用"; break;
            }
        } else {
            return;
        }

    });
    Handlebars.registerHelper("transTimeFormat", function (value) {
        if (value) {
            return value.split(".")[0].split("T").join(" ");
        } else {
            return;
        }

    });

    //解码
    Handlebars.registerHelper("decodeURI", function (value) {
        try {
            return decodeURI(value);
        } catch (e) {
            return value;
        }

    })

    Handlebars.registerHelper("fileTypeUrl", function (value) {
        value = String(value);
        var url = value
        try {
            url = value.split('?')[0].toLowerCase();
            var filetype = url.substring(url.lastIndexOf('.'));
            if (filetype == ".jpg" || filetype == ".gif" || filetype == ".png") {
                return value;
            } else {
                return "http://file.open.com.cn/lms/office/" + filetype.replace(".", "") + ".png";
            }
        } catch (e) { }
    })

    //数字转换成字母handlebar
    Handlebars.registerHelper("tranLetter", function (value) {
        var _newIndex = parseInt(value) + 1;
        return String.fromCodePoint(_newIndex + 64);
    })

    //绑定学生作答结果、正确答案
    Handlebars.registerHelper("itemClass", function (correctanswer, stuanswer, itmeindex) {
        var _itmeindex = itmeindex.toString();
        if ($.inArray(_itmeindex, stuanswer) > -1) {
            if ($.inArray(_itmeindex, correctanswer) > -1) {
                return 'right'
            }
            else {
                return 'wrong'
            }
        }
        if ($.inArray(_itmeindex, correctanswer) > -1) {
            if ($.inArray(_itmeindex, stuanswer) > -1) {
                return 'right'
            }
            else {
                return 'right'
            }
        }
    });
    //编辑界面选项正确结果显示
    Handlebars.registerHelper("correctClass", function (questionType, answer, options) {
        var _class = '';
        //if (questionType == 2) {
        //    _class = 'checked';
        //}
        for (i = 0; i < answer.length; i++) {
            if (answer[i] == options.data.index) {
                _class += 'checked';
            }
        }
        return _class;
    });
    //绑定结果样式类
    Handlebars.registerHelper("answerClass", function (questionType, answer, itmeindex) {
        var _class = '';
        if (questionType == 2) {
            _class = 'multiselect';
        }
        for (i = 0; i < answer.length; i++) {
            if (answer[i] == itmeindex) {
                _class += ' blue';
            }
        }
        return _class;
    });

    //绑定结果
    Handlebars.registerHelper("isAnswer", function (stuAnswer, itemindex) {
        var _itmeindex = itemindex.toString();
        if ($.inArray(_itmeindex, stuAnswer) > -1) {
            return '1'
        }
        else {
            return '0'
        }

    });
    
    //绑定学生作答结果、正确答案
    Handlebars.registerHelper("stuanswerandcorrect", function (questiontype, correctanswer, stuanswer, itmeindex) {
        var _class = '';
        if (questiontype == 2) {
            _class = 'multiselect';
        }
        var _itmeindex = itmeindex.toString();
        if ($.inArray(_itmeindex, stuanswer) > -1) {
            if ($.inArray(_itmeindex, correctanswer) > -1) {
                return _class + ' right'
            }
            else {
                return _class + ' wrong'
            }
        }
        if ($.inArray(_itmeindex, correctanswer) > -1) {
            if ($.inArray(_itmeindex, stuanswer) > -1) {
                return _class + ' right'
            }
            else {
                return _class + ' right'
            }
        }
    });

    //绑定学生作答结果、正确答案
    Handlebars.registerHelper("returnCheck", function (correctanswer, stuanswer, itmeindex) {
        var _itmeindex = itmeindex.toString();
        if ($.inArray(_itmeindex, stuanswer) > -1) {
            if ($.inArray(_itmeindex, correctanswer) > -1) {
                return 'checked="checked"'
            }
            else {
                return ''
            }
        }
        if ($.inArray(_itmeindex, correctanswer) > -1) {
            if ($.inArray(_itmeindex, stuanswer) > -1) {
                return 'checked="checked"'
            }
            else {
                return 'checked="checked"'
            }
        }
    });
    //多个逻辑判断如：{{#expression a '==' b '&&' c '>' 0}}
    Handlebars.registerHelper('expression', function () {
        var exps = [];
        try {
            //最后一个参数作为展示内容，也就是平时的options。不作为逻辑表达式部分
            var arg_len = arguments.length;
            var len = arg_len - 1;
            for (var j = 0; j < len; j++) {
                exps.push(arguments[j]);
            }
            var result = eval(exps.join(' '));
            if (result) {
                return arguments[len].fn(this);
            } else {
                return arguments[len].inverse(this);
            }
        } catch (e) {
            throw new Error('Handlerbars Helper "expression" can not deal with wrong expression:' + exps.join(' ') + ".");
        }
    });

    //设置导航id
    Handlebars.registerHelper("setguid", function (qestype, options) {
        var _type = '';
        var title = '';
        for (var h = 1; h <= arguments.length - 1; h++) {
            if (typeof arguments[h] === "string") {
                title = arguments[h];
            } else {
                options = arguments[h];
            }
        }
        var _index = options.data.index + 1;
        if (qestype == 1) {
            _type = 'radio-question-' + _index;
        }
        else if (qestype == 2) {
            _type = 'check-question-' + _index;
        }
        else if (qestype == 3) {
            _type = 'judge-question-' + _index;
        }
        else if (qestype == 4) {
            _type = 'blank-question-' + _index;
        }
        else if (qestype == 6 && title == "问答题") {
            _type = 'qa-question-' + _index;
        }
        else if (qestype == 6 && title == "论述题") {
            _type = 'expound-question-' + _index;
        }
        else if (qestype == 6 && title == "作文题") {
            _type = 'big-composition-' + _index;
        }
        else if (qestype == 6 && title == "翻译题") {
            _type = 'big-translate-' + _index;
        }
        else if (qestype == 5) {
            _type = 'big-reading-' + _index;
        }
        else if (qestype == 7) {
            _type = 'big-fill-' + _index;
        }
        return _type;
    });
    
    //设置大题导航
    Handlebars.registerHelper("setguidbig", function (qestype, options) {
        var _type = '';
        var _index = options.data.index + 1;
        var title = options.data.root[_index - 1].Title;//获取答题名称
        if (qestype == 'S1') {
            _type = 'big-sigle-question';
        }
        else if (qestype == 'S2') {
            _type = 'big-multi-question';
        }
        else if (qestype == 'S3') {
            _type = 'big-judge-question';
        }
        else if (qestype == 'S4-1') {
            _type = 'big-blank-question';
        }
        else if (qestype == 'S4-2') {
            _type = 'big-objective-blank-question';
        }
        else if (qestype == 'S6') {
            _type = 'big-qa-question';
        }
        else if (qestype == 'S6-7') {
            _type = 'big-saq-question';
        }
        else if (qestype == 'S6-8') {
            _type = 'big-definitions-question';
        }
        else if (qestype == 'S6-9') {
            _type = 'big-other-question';
        }
        else if (qestype == 'S6-24') {
            _type = 'big-computations-question';
        }
        else if (qestype == 'S6-26') {
            _type = 'big-expound-question';
        }
        else if (qestype == 'S6-3') {
            _type = 'big-composition-question';
        }
        else if (qestype == 'S6-4') {
            _type = 'big-translate-question';
        }
        else if (qestype == 'S5') {
            _type = 'big-reading-question';
        }
        else if (qestype == 'S7') {
            _type = 'big-fill-question';
        }
        return _type;
    });

    //显示试题列表答案
    Handlebars.registerHelper("isCorrect", function (correct) {
        if (correct >= 0 || correct <= 25) {
            return "right";
        }
    });

    //handlarbar debug
    Handlebars.registerHelper("debug", function (optionalValue) {
        //console.log("Current Context");
        //console.log("====================");
        //console.log(this);
        if (optionalValue) {
            //console.log("Value");
            //console.log("====================");
            //console.log(optionalValue);
        }
    });

    //设置导航大题样式类
    Handlebars.registerHelper("setqestype", function (qestype, options) {
        var _type = '';
        var _index = options.data.index + 1;
        var title = options.data.root[_index - 1].Title;//获取答题名称
        if (qestype == 1) {
            _type = 'question-radio';
        }
        else if (qestype == 2) {
            _type = 'question-check';
        }
        else if (qestype == 3) {
            _type = 'question-judge';
        }
        else if (qestype == 4) {
            _type = 'question-blank';
        }
        else if (qestype == 6 && title == "问答题") {
            _type = 'question-qa';
        }
        else if (qestype == 6 && title == "论述题") {
            _type = 'question-expound';
        }
        else if (qestype == 6 && title == "作文题") {
            _type = 'question-composition';
        }
        else if (qestype == 6 && title == "翻译题") {
            _type = 'question-translate';
        }
        else if (qestype == 5) {
            _type = 'question-reading';
        }
        else if (qestype == 7) {
            _type = 'question-fill';
        }
        return _type;
    });
    //设置按钮是否能够考试
    Handlebars.registerHelper("compareCanAnswer", function (value, value1) {
        if (parseInt(value1) >= parseInt(value)) {
            return 'disabled'
        }
    })

    //填空题##替换
    Handlebars.registerHelper("spaceReplace", function (value) {
        return spaceReplaceFun(value);
    });

    //填空题##替换
    Handlebars.registerHelper("blankTxt", function (value, itemid, _answer) {
        return blankTxt(value, itemid, _answer);
    });

    //填空题##替换
    Handlebars.registerHelper("blankMark", function (value, itemid, _answer, qscore, qestype, FillScore) {
        return blankMark(value, itemid, _answer, qscore, qestype, FillScore);
    });

    //子题导航样式
    Handlebars.registerHelper("smallNavClass", function (obj, title) {
        if (obj == null || obj.length == 0) {
            $('.done').removeClass('done');
            return 'height:0';
        }
        var num = Number(100 / obj.length);
        var index = 0;
        $.each(obj, function (i) {
            if (_array.isArray(obj[i].I15)) {
                if (obj[i].I15.length == 0) {
                    index++;
                }
            }
        })
        var height = 'height:' + (num * index) + '%;';
        if ((num * index) == 100) {
            height = 'height: 30px;';
        }
        return height;
    })

    //学生我的考试列表
    Handlebars.registerHelper("removeHTMLTag", function (value) {
        value = _utils.decode(value);
        function delHtmlTag(str) {
            var title = str.replace(/<[^>]+>/g, "");//去掉所有的html标记
            if (title.length > 300) {
                title = title.substring(0, 300);
            }
            return title;
        }
        if (value.substring(0, 2) === "<p>") {
            return delHtmlTag(value);
        } else {
            return value;
        }

    })
    //学生我的考试列表
    Handlebars.registerHelper("swapExamPaperStates", function (value) {
        if (value == 2) {
            return "已提交";
        }
        if (value == 3) {
            return "批阅中";
        }
        if (value == 4) {
            return "已批阅";
        }
        if (value = 5) {
            return "开始答题";
        }
    })
    //转换分数
    Handlebars.registerHelper("InputScore", function (value) {
        if (value) {
            return value;
        } else {
            return "0";
        }
    })
    //面部识别照片审核状态
    Handlebars.registerHelper("FaceStatus", function (value) {
        if (value == -1) {
            return "审核不通过";
        }
        if (value == 0) {
            return "审核中";
        }
        if (value == 1) {
            return "系统审核通过";
        }
        if (value = 2) {
            return "人工审核通过";
        }
    })
    
    //加载评价
    _common.IsShowFunctionAssess = function (subjectId) {
        var ajaxAssess = {
            type: 'get',
            url: "/StudentCenter/Assess/IsShowFunctionAssess",
            data: { 'subjectId': subjectId },
            success: function (data) {
                if (data.status == 0) {
                    if (data.data.isShowAssess) {
                        $('.right-button').css('display', 'block');
                        var assessHtml = '<div class="right-button">' +
                                            '<img class="right-speak" src="/Content/images/v2/fiveStar/speakright.png" />' +
                                            '<img class="right-close" src="/Content/images/v2/fiveStar/closeright.png" />' +
                                            '<img class="right-font" src="/Content/images/v2/fiveStar/fontrightall.png" />' +
                                        '</div>';
                        $('body').append(assessHtml);
                        $('.right-button').show();

                        // 评价小喇叭
                        $('body').on('mouseover', '.right-close', function (event) {
                            $('.right-font').css('display', 'block');
                            $(this).css('cursor', 'pointer');
                            event.stopPropagation();
                        });
                        $('body').on('mouseout', '.right-close', function (event) {
                            $('.right-font').css('display', 'none');
                            $(this).css('cursor', 'pointer');
                            event.stopPropagation();
                        });
                        $('.right-button').click(function () {
                            layer.open({
                                area: ['60%', '80%'],
                                content: '/StudentCenter/Assess/SubjectAssess?subjectId=' + subjectId,
                                btn: [],
                                title: '评价',
                                type: 2,
                                maxmin: true
                            });
                        });
                        $('.right-speak').click(function (event) {
                            $('.right-button').css('display', 'none');
                            event.stopPropagation();
                        })
                    }
                }
            }
        };
        _ajax.call(ajaxAssess);
    }

    return {
        win: _window,
        func: _common,
        modal: bootbox,
        ajax: _ajax,
        dialogBox: _dialogBox,
        array: _array,
        utils: _utils
    }

})