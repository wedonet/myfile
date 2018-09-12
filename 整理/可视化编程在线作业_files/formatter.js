/**
 * 格式化模块
 * @param  {[type]} ){} [description]
 * @return {[type]}       [description]
 */
define(function() {

    //#region 资源定义
    //格式化
    var fmt = fmt || {};
    //翻译
    var trans = trans || {};
    //#endregion 资源定义


    // #region 方法

    // 对Date的扩展，将 Date 转化为指定格式的String
    // 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
    // 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
    // 例子：
    // (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
    // (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
    Date.prototype.format = function(mask) { //author: meizz
        var d = this;
        var zeroize = function(value, length) {
            if (!length) length = 2;
            value = String(value);
            for (var i = 0, zeros = ''; i < (length - value.length); i++) {
                zeros += '0';
            }
            return zeros + value;
        };

        return mask.replace(/"[^"]*"|'[^']*'|\b(?:d{1,4}|m{1,4}|yy(?:yy)?|([hHMstT])\1?|[lLZ])\b/g, function($0) {
            switch ($0) {
                case 'd':
                    return d.getDate();
                case 'dd':
                    return zeroize(d.getDate());
                case 'ddd':
                    return ['Sun', 'Mon', 'Tue', 'Wed', 'Thr', 'Fri', 'Sat'][d.getDay()];
                case 'dddd':
                    return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][d.getDay()];
                case 'M':
                    return d.getMonth() + 1;
                case 'MM':
                    return zeroize(d.getMonth() + 1);
                case 'MMM':
                    return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][d.getMonth()];
                case 'MMMM':
                    return ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][d.getMonth()];
                case 'yy':
                    return String(d.getFullYear()).substr(2);
                case 'yyyy':
                    return d.getFullYear();
                case 'h':
                    return d.getHours() % 12 || 12;
                case 'hh':
                    return zeroize(d.getHours() % 12 || 12);
                case 'H':
                    return d.getHours();
                case 'HH':
                    return zeroize(d.getHours());
                case 'm':
                    return d.getMinutes();
                case 'mm':
                    return zeroize(d.getMinutes());
                case 's':
                    return d.getSeconds();
                case 'ss':
                    return zeroize(d.getSeconds());
                case 'l':
                    return zeroize(d.getMilliseconds(), 3);
                case 'L':
                    var m = d.getMilliseconds();
                    if (m > 99) m = Math.round(m / 10);
                    return zeroize(m);
                case 'tt':
                    return d.getHours() < 12 ? 'am' : 'pm';
                case 'TT':
                    return d.getHours() < 12 ? 'AM' : 'PM';
                case 'Z':
                    return d.toUTCString().match(/[A-Z]+$/);
                    // Return quoted strings with the surrounding quotes removed
                default:
                    return $0.substr(1, $0.length - 2);
            }
        });

    };

    /**
     * 日期格式化
     * @param  {[type]} value [description]
     * @param  {[type]} data  [description]
     * @return {[type]}       [description]
     */
    fmt.dateformat = function (value, data) {
        if (value != undefined) {
            value = value.replace(/-/g, "/");
            if (value)
                return (new Date(value)).format("yyyy-MM-dd");
        } else {
            return '';
        }
    };

    /**
     * 日期时间格式化
     * @param  {[type]} value [description]
     * @param  {[type]} data  [description]
     * @return {[type]}       [description]
     */
    fmt.datetimeformat = function(value, data) {
        if (value != undefined) {
            value = value.replace(/-/g, "/");
            if (value)
                return (new Date(value)).format("yyyy-MM-dd HH:mm:ss");
        } else {
            return '';
        }
    };

    /**
     * 中文日期格式化
     * @param  {[type]} value [description]
     * @param  {[type]} data  [description]
     * @return {[type]}       [description]
     */
    fmt.dateformatChinese = function(value, data) {
        if (value != undefined) {
            if (value.toString().indexOf("T") < 0) { //如果数据库中是date类型，则浏览器中会多加个'T',如果包含T就不进行转换
                value = value.replace(/-/g, "/");
            }
            if (value)
                return (new Date(value)).format("yyyy年MM月dd日");
        } else {
            return '';
        }
    };


    /**
     * 发布状态
     * @param {[type]} n [description]
     */
    trans.publishstatus = function (n) {
        switch (n) {
            case 1:
                return "已发布";
            case 2:
                return "已发布";
            case 3:
                return "已发布";
            case 0:
                return "未发布";
        }
    };

    /**
     * 发布状态样式
     * @param {[type]} n [description]
     */
    trans.publishstatusclass = function (n) {
        switch (n) {
            case 1:
                return "required";
            case 2:
                return "required";
            case 3:
                return "required";
            case 0:
                return "elective";
        }
    };

    /**
     * 教学类型
     * @param {[type]} n [description]
     */
    trans.teachType = function(n) {
        switch (n) {
            case 1:
                return "网络课程";
            case 2:
                return "面授课程";
            case 3:
                return "混合课程";
            default:
                return "网络课程";
        }
    };

    /**
     * 课程属性
     * @param  {[type]} n [description]
     * @return {[type]}   [description]
     */
    trans.courseNature = function(n){
        switch (n) {
            case 1:
                return "必修";
            case 2:
                return "选修";
            case 3:
                return "实践";
            default:
                return "必修";
        }
    };
    /**
     * 课程在修状态
     * @param  {[type]} n [description]
     * @return {[type]}   [description]
     */
    trans.stateType = function (studycount, studystate) {
        if (studycount == 0 || studycount == null) {
            return "未学习";
        }
        else {
            if (studystate == "1") {
                return "已学习";
            }
            if (studystate == "2") {
                return "修完已通过";
            }
            if (studystate == "3") {
                return "修完未通过";
            }
        }
    };

    /**
    * 课程在修状态_重写
    * @param  {[type]} n [description]
    * @return {[type]}   [description]
    */
    trans.stateTypeReview = function (studycount, studystate) {
        if (studystate == "1") {  // 课程状态 1、在修 2、修完通过 3、修完未通过
            if (studycount == 0 || studycount == null) {
                return "未学习";
            }
            else {
                return "已学习";
            }
        }
        if (studystate == "2") {
            return "修完已通过";
        }
        if (studystate == "3") {
            return "修完未通过";
        }
    };

    /**
     * 课程在修状态样式
     * @param  {[type]} n [description]
     * @return {[type]}   [description]
     */
    trans.stateTypeClass = function (studycount, studystate) {
        if (studycount == 0 || studycount == null) {
            return "col-xs-6 text-right studystate";
        }
        else {
            if (studystate == "1") {
                return "col-xs-6 text-right studystate studystate-h";
            }
            if (studystate == "2") {
                return "col-xs-6 text-right studystate studystate-h";
            }
            if (studystate == "3") {
                return "col-xs-6 text-right studystate";
            }
        }
    };


    /**
     * 教学计划中的课程在修状态
     * @param  {[type]} n [description]
     * @return {[type]}   [description]
     */
    trans.stateTypeTeachPlan = function (teachtype, studycount, coursestatus) {
        if (coursestatus == 0) {
            return "未选课";
        }
        else {
            if (coursestatus == "1") {  // 课程状态 1、在修 2、修完通过 3、修完未通过
                if (teachtype == 1 || teachtype == 3) { //授课方式 1、网络 2、面授 3、混合
                    if (studycount == 0 || studycount == null) {
                        return "未学习";
                    }
                    else {
                            return "已学习";
                    }
                }
                else if (teachtype == 2) {
                    return "已学习";
                }
            }
            if (coursestatus == "2") {
                return "修完已通过";
            }
            if (coursestatus == "3") {
                return "修完未通过";
            }
        }
    };
    /**
     * 教学计划课程在修状态样式
     * @param  {[type]} n [description]
     * @return {[type]}   [description]
     */
    trans.stateTypeTeachPlanClass = function (teachtype, studycount, coursestatus) {
        if (coursestatus == 0) {
            return "gray";
        }
        else {
            if (coursestatus == "1") { // 课程状态 1、在修 2、修完通过 3、修完未通过
                if (teachtype == 1 || teachtype == 3) { //授课方式 1、网络 2、面授 3、混合
                    if (studycount == 0 || studycount == null) {
                        return "gray";
                    }
                    else {
                            return "green";
                    }
                }
                else if (teachtype == 2) {
                        return "green";
                }
            }
            if (coursestatus == "2") {
                return "green";
            }
            if (coursestatus == "3") {
                return "gray";
            }
        }
    };
    /**
     * 课程分数
     * @param  {[type]} n [description]
     * @return {[type]}   [description]
     */
    trans.finalGrade = function (n) {
        switch (n) {
            case "":
                return "已学习";
        }
    };

    /**
     * 学位课
     * @param  {[type]} n [description]
     * @return {[type]}   [description]
     */
    trans.degreeCourse = function (n) {
        switch (n) {
            case 1:
                return "学位课程";
            case 2:
                return "";
        }
    };


    /**
     * 论文课
     * @param  {[type]} n [description]
     * @return {[type]}   [description]
     */
    trans.thesis = function (n) {
        switch (n) {
            case 1:
                return "毕业论文课";
            case 2:
                return "";
        }
    };


    /**
      * 将int类型状态改为string
      * @param  {[type]} n [description]
      * @return {[type]}   [description]
      */
    trans.getStatueByInt = function (n) {
        switch (n) {
            case 1:
                return "启用";
            case 2:
                return "停用";
        }
    }


    /**
      * 将string类型状态改为int
      * @param  {[type]} n [description]
      * @return {[type]}   [description]
      */
    trans.getStatueByString = function (n) {
        switch (n) {
            case "启用":
                return 1;
            case "停用":
                return 2;
        }
    }

    /**
      * 将string类型状态改为int
      *修改状态时使用
      * @param  {[type]} n [description]
      * @return {[type]}   [description]
      */
    trans.getStatueByString2 = function (n) {
        switch (n) {
            case "停用":
                return 1;
            case "启用":
                return 2;
        }
    }

    /**
      * 性别
      * @param  {[type]} n [description]
      * @return {[type]}   [description]
      */
    trans.getSex = function (n) {
        switch (n) {
            case 1:
                return "男";
            case 2:
                return "女";
        }
    }

    /**
      * 教师状态
      * @param  {[type]} n [description]
      * @return {[type]}   [description]
      */
    trans.getStatus = function (n) {
        switch (n) {
            case "-1":
                return "删除";
            case "1":
                return "启用";
            case "2":
                return "停用";
        } 
    }

    /**
    * 教师类型
    * @param  {[type]} n [description]
    * @return {[type]}   [description]
    */
    trans.getTeacherType = function (n) {
        switch (n) {
            case "1":
                return "主讲教师";
            case "2":
                return "辅导教师";
        }
    }

    /**
      * 学生成绩
      * @param  {[type]} n [description]
      * @return {[type]}   [description]
      */
    trans.getResult = function (n) {
        if (n == ""||n==null) {
            return 0+"分";
        } else {
            if (n == -1) {
                return "";
            } else {
                return n + "分";
            }
        }
    }

    /**
    * 学生状态
    * @param  {[type]} n [description]
    * @return {[type]}   [description]
    */
    trans.getStudentStatus = function (n) {
        switch (n) {
            case 1:
                return "在修";
            case 2:
                return "修完已通过";
            case 3:
                return "修完未通过";
            case 10:
                return "未学习";
            case 11:
                return "已学习";
        }
    }


    /**
    * 作业状态
    * @param  {[type]} n [description]
    * @return {[type]}   [description]
    */
    trans.getWorkStatus = function (n) {
        switch (n) {
            case 1:
                return "未提交";
            case 2:
                return "未批阅";
            case 3:
                return "已批阅";
            case 4:
                return "批阅中";
        }
    }
    trans.getNewWorkStatus = function (n) {
        switch (n) {
            case 1:
                return "未提交";
            case 2:
                return "待批阅";
            case 3:
                return "批阅中";
            case 4:
                return "已批阅";
        }
    }


    /**
    * 空值返回
    * @param  {[type]} n [description]
    * @return {[type]}   [description]
    */
    trans.getValue = function (n) {
        if (n == null) {
            return "无";
        }
        else {
            return n;
        }
    }

    /**
    * 空值返回
    * @param  {[type]} n [description]
    * @return {[type]}   [description]
    */
    trans.getScore = function (n) {
        if (n == null) {
            return "0";
        }
        else {
            return n;
        }
    }

    /**
 * 空值返回
 * @param  {[type]} n [description]
 * @return {[type]}   [description]
 */
    trans.getValueNull = function (n) {
        if (n == null) {
            return "";
        }
        else {
            return n;
        }
    }


    /**
     * 数字转字母
     * @param {[type]} n [description]
     */
    trans.tranLetter = function (n) {
        switch (n) {
            case "0": return "A"; break;
            case "1": return "B"; break;
            case "2": return "C"; break;
            case "3": return "D"; break;
            case "4": return "E"; break;
            case "5": return "F"; break;
            case "6": return "G"; break;
            case "7": return "H"; break;
            case "8": return "I"; break;
            case "9": return "J"; break;
            case "10": return "K"; break;
        }
    };

    /**
    * 字母转数字
    * @param {[type]} n [description]
    */
    trans.tranNum = function (letter) {
        if (typeof letter === 'string') {
            if (letter == "A" || letter == "B" || letter == "C" || letter == "D" || letter == "E" || letter == "F" || letter == "G" || letter == "H" || letter == "I" || letter == "J" || letter == "K") {
                switch (letter) {
                    case "A": return "0"; break;
                    case "B": return "1"; break;
                    case "C": return "2"; break;
                    case "D": return "3"; break;
                    case "E": return "4"; break;
                    case "F": return "5"; break;
                    case "G": return "6"; break;
                    case "H": return "7"; break;
                    case "I": return "8"; break;
                    case "J": return "9"; break;
                    case "K": return "10"; break;
                }
            }
            else {
                return letter;
            }
        }
        else {
            return letter;
        }
    };

    /**
   * 小数判断
   * @param  {[type]} n [description]
   * @return {[type]}   [description]
   */
    trans.judgetDecimal = function (n) {
        var index = n.indexOf('.');//小数点所在位置
        var decimal = n.slice(index + 1);//小数点后的数字
        if (decimal > 0) {
            return n;
        } else if (decimal == 0 && index > 0) {
            var num = n.replace(n.slice(index), '');
            return num;
        } else {
            return n;
        }
    }

    /**
   * json字符串转换成json
   * @param  {[type]} n [description]
   * @return {[type]}   [description]
   */
    trans.stringToJson = function (n) {
        if (typeof (n) !== 'object') {
            for (i = 0; i < 3; i++) {
                if (typeof (n) !== 'object') {
                    if (n.charAt(i) == '"') {
                        n = JSON.parse(n);
                    }
                }
            }
        }
        return n;
    }

    // #endregion 方法

    return {
        fmt: fmt,
        trans: trans
    }

});