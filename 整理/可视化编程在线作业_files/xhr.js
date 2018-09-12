/**
 * 通讯模块
 * @param  {Object} $) {                                   var defaults [description]
 * @return {[type]}    [description]
 */
define(['jquery'], function($) {
    var Ajax = function(options) {
        //默认参数
        var defaults = {
            type: 'GET',
            dataType: 'json',
            jsonp: 'callback',
            async: true,
            cache: true,
            ifModified: true,
            // xhrFields: {
            //     withCredentials: true
            // },
            // crossDomain: true,
            title: 'defaultTitle',
            //timeout: 60000,
            error: function() {},
            success: function() {}
        };
        //与传入参数合并
        var settings = $.extend({}, defaults, options);
        //判断是否是jsonp
        if (settings.dataType == "jsonp") {
            if (settings.url.indexOf('?') >= 0)
                settings.url = settings.url + "&callback=?";
            else
                settings.url = settings.url + "?callback=?";
        }
        //开始执行ajax
        $.ajax({
            type: settings.type,
            dataType: settings.dataType,
            async: settings.async,
            // jsonp: settings.jsonp,
            cache: settings.cache,
            ifModified: settings.ifModified,
            // xhrFields: settings.xhrFields,
            // crossDomain: settings.crossDomain,
            url: settings.url,
            data: settings.data,
            //timeout: settings.timeout,
            error: function(XMLHttpRequest, textStatus, errorThrown) { //失败
                if (typeof settings.error === "function") settings.error();
            },
            success: function (data) { //成功
                if (typeof settings.success === "function") {
                    if (data == '{}') {
                        data = null;
                    }
                    if (typeof data === "object" && JSON.stringify(data) == '{"Error":"对不起您没有数据访问权限！"}') {
                        $.cookie('openSpace', '', { expires: -1,path: '/' });
                        $.cookie('openUserToken', '', { expires: -1,path: '/' });
                        $.cookie('openUserInfo', '', { expires: -1,path: '/' });
                        top.location.href = '/Account/User/Login';
                    }
                    settings.success(data);
                }
            }
        });
    }
    return {
        callAjax: Ajax
    }
});