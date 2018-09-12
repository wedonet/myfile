/**
  * jQuery paper plugin
  * Version 1.0
  * @requires jQuery v1.9.1 or later
  * Copyright (c) 2017-2019 Open
  * 支持单选、多选、判断、填空(主观填空，客观填空)、阅读理解、完形填空、问答题、简答题渲染
  * Data: 2017-7-7
*/

; (function ($, undefined) {
    $.fn.paper = function (options) {
        var defaults = {
            isCanLookAnswer: true,  //默认显示答案
            isTeacherReview: false, //老师预览试卷
            isStudentAnswer: false  //默认学生作答
        }
        var opts = $.extend({}, defaults, options);
        return this.each(function () {
            var $this = $(this);
            var _data = opts.data;
            var _isCanLookAnswer = opts.isCanLookAnswer;
            var _isShowScore = opts.isShowScore;
            var _isTeacherReview = opts.isTeacherReview;
            var _isStudentAnswer = opts.isStudentAnswer;
            var _paperTemp = '';
            for (m = 0; m < _data.length; m++) {
                _paperTemp += '<div class="question ' + bigQesClass(_data[m].topicType) + '">' +
                                    '<div class="question-type" id="' + bigQesType(_data[m].topicType) + '">' +
                                        '<span class="item-type radioques">' + _data[m].Title + '</span>' +
                                        '<span class="quesnum radionums">共' + _data[m].TopicsNum + '题，' + _data[m].TopicsScore + '分</span>' +
                                    '</div>' +

                               //'<div>' +
                               qesDetail(_data[m].topicType,_data[m].Topics, _isCanLookAnswer, _isShowScore, _isTeacherReview, _isStudentAnswer) +
                               '</div>'
                               //'</div>'
            }
            $this.append(_paperTemp);
        })
    }

    //大题类型
    function bigQesType(bigqestype) {
        var _type = '';
        if (bigqestype == 'S1') {
            _type = 'big-sigle-question';
        }
        else if (bigqestype == 'S2') {
            _type = 'big-multi-question';
        }
        else if (bigqestype == 'S3') {
            _type = 'big-judge-question';
        }
        else if (bigqestype == 'S4-1') {
            _type = 'big-blank-question';
        }
        else if (bigqestype == 'S4-2') {
            _type = 'big-objective-blank-question';
        }
        else if (bigqestype == 'S6') {
            _type = 'big-qa-question';
        }
        else if (bigqestype == 'S6-7') {
            _type = 'big-saq-question';
        }
        else if (bigqestype == 'S6-8') {
            _type = 'big-definitions-question';
        }
        else if (bigqestype == 'S6-9') {
            _type = 'big-other-question';
        }
        else if (bigqestype == 'S6-24') {
            _type = 'big-computations-question';
        }
        else if (bigqestype == 'S6-26') {
            _type = 'big-expound-question';
        }
        else if (bigqestype == 'S6-3') {
            _type = 'big-composition-question';
        }
        else if (bigqestype == 'S6-4') {
            _type = 'big-translate-question';
        }
        else if (bigqestype == 'S5') {
            _type = 'big-reading-question';
        }
        else if (bigqestype == 'S7') {
            _type = 'big-fill-question';
        }
        return _type;
    }

    //小题类型
    function getQesId(type, index) {
        var index = index + 1;
        var _qesId = '';
        if (type == 'S1') {
            _qesId = 'radio-question-' + index;
        }
        else if (type == 'S2') {
            _qesId = 'check-question-' + index;
        }
        else if (type == 'S3') {
            _qesId = 'judge-question-' + index;
        }
        else if (type == 'S4-1') {
            _qesId = 'blank-question-' + index;
        }
        else if (type == 'S6') {
            _qesId = 'qa-question-' + index;
        }
        else if (type == 'S6-26') {
            _qesId = 'expound-question-' + index;
        }
        else if (type == 'S6-3') {
            _qesId = 'big-composition-' + index;
        }
        else if (type == 'S6-4') {
            _qesId = 'big-translate-' + index;
        }
        else if (type == 'S5') {
            _qesId = 'big-reading-' + index;
        }
        else if (type == 'S7') {
            _qesId = 'big-fill-' + index;
        }
        return _qesId;
    }

    //小题模块
    function qesDetail(qestype, qes, iscanlookanswer, isShowScore, isTeacherReview, isStudentAnswer) {
        var _qesHtml = '';
        for (k = 0; k < qes.length; k++) {
            var _j = k + 1;
            var _I1 = qes[k].I1;
            var _I2 = qes[k].I2;
            var _I9 = qes[k].I9;
            var _I30 = qes[k].I30;
            var _qesResult = '';
            var _answerHtml = '';
            var _markHtml = '';
            //如果是老师预览试卷不显示学生作答信息
            if (!isTeacherReview) {
                _answerHtml = getQesResult(qes[k], iscanlookanswer, isShowScore);
            }
            //如果是学生作答不显示学生作答信息
            if (isStudentAnswer) {
                _answerHtml = '';
                // 阅读理解和完形填空的标记在子题上
                if (qestype != 5 && qestype != 7) {
                    _markHtml = '<span class="question-mark" data-name="qes-' + _I1 + '" index="' + i + '" data-value="0"></span>';
                }
            }
            _qesHtml += '<div class="question-cont" id="qes-' + _I1 + '">' +
                            '<div class="question-cont-left">' +
                                '<span class="question-num">' + _j + '</span>' +
                                '<span class="question-score">' + _I9 + '分</span>' +
                                 _markHtml +
                            '</div>' +
                            '<div class="question-cont-right">' +
                                '<div class="question-text" index=' + _j + ' identifier="qes-' + _I1 + '">' +
                                    '<div class="qes-title"></div>' +
                                        '<table class="blank-title">' +
                                            '<tr>' +
                                                '<td class="qestitle" style="width:96%">' +
                                                    blankReplaceFun(_I2) +
                                                '</td>' +
                                                '<td></td>' +
                                            '</tr>' +
                                        '</table>' +
                                    //'</div>' +
                                     getQesContent(qes[k], k, iscanlookanswer, isShowScore, isTeacherReview, isStudentAnswer) +
                                '</div>' +
                            '</div>' +
                        '</div>' +
                        _answerHtml;
        }
        return _qesHtml;
    }

    //替换##
    function blankReplaceFun(value) {
        var str = value;
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

    //解码
    function decode(text) {
        try {
            var _text = decodeURIComponent(text);
        } catch (ex) {
            try {
                var _text = decodeURIComponent(decodeURIComponent(escape(text)));
            } catch (e) {
                var _text = text;
            }
        }
        //转换图片路径
        if (_text.indexOf('http') != -1) {
            reg = new RegExp("\\+", "g");
            var _title = _text.replace(reg, "%2B"); //替换路径中'+'/'%2B'
        } else {
            var _title = _text;
        }
        return _title;
    }

    //绑定学生作答结果、正确答案
    function stuanswerandcorrect(questiontype, correctanswer, stuanswer, index) {
        var _class = '';
        if (questiontype == 2) {
            _class = 'multiselect';
        }
        var index = index.toString();
        if ($.inArray(index, stuanswer) > -1) {
            if ($.inArray(index, correctanswer) > -1) {
                return _class + ' right'
            }
            else {
                return _class + ' wrong'
            }
        }
        if ($.inArray(index, correctanswer) > -1) {
            if ($.inArray(index, stuanswer) > -1) {
                return _class + ' right'
            }
            else {
                return _class + ' right'
            }
        }
    }

    //绑定学生作答结果
    function stuanswer(questiontype, stuanswer, index) {
        var _class = '';
        if (questiontype == 2) {
            _class = 'multiselect ';
        }
        var index = index.toString();
        if ($.inArray(index, stuanswer) > -1) {
            return _class + 'blue'
        }
        else {
            return _class
        }
    }

    //获取不同试题
    function getQesContent(question, index, iscanlookanswer, isShowScore, isTeacherReview, isStudentAnswer) {
        var _I3 = question.I3;
        var _qesHtml = '';
        //单选、多选、判断
        if (_I3 == 1 || _I3 == 2 || _I3 == 3) {
            _qesHtml = sigleTemplate(question, isStudentAnswer);
        }
        //填空题
        if (_I3 == 4) {
            _qesHtml = blankTemplate(question, iscanlookanswer, isShowScore, isTeacherReview);
        }
        //完形填空、阅读理解
        if (_I3 == 5 || _I3 == 7) {
            _qesHtml = readingCompTemplate(question, index, iscanlookanswer, isShowScore, isTeacherReview, isStudentAnswer);
        }
        //问答题
        if (_I3 == 6) {
            _qesHtml = qaTemplate(question, index, iscanlookanswer, isShowScore, isTeacherReview);
        }
        return _qesHtml;
    }

    //单选、多选、判断题模板
    function sigleTemplate(question, isStudentAnswer) {
        var _I1 = question.I1; //试题ID
        var _I3 = question.I3; //试题类型
        var _I6 = question.I6;
        var _I7 = question.I7;
        var _I15 = question.I15;
        var _itemTem = '';
        for (i = 0; i < _I6.length; i++) {
            var _itemClass = '';
            if (isStudentAnswer) {
                _itemClass = stuanswer(_I3, _I15, i);
            }
            else {
                _itemClass = stuanswerandcorrect(_I3, _I7, _I15, i);
            }
            _itemTem += '<li class="' + _itemClass + '" itemindex="' + i + '" itemid="' + _I1 + '" data-value="' + isAnswer(_I15,i)+ '">' +
                            '<a href="javascript:void(0)"><i class="options">' + i + '</i><span class="qesitem">' + decode(_I6[i]) + '</span></a>' +
                        '</li>'
        }
        var _template = '<ul class="question-options" identifier="qes-' + _I1 + '">' + _itemTem + '</ul>';
        return _template;
    }

    //填空题模板
    function blankTemplate(question, iscanlookanswer, isShowScore, isTeacherReview) {
        var _I1 = question.I1;
        var _I2 = question.I2;
        var _I6 = question.I6;
        var _I9 = question.I9;
        var _I15 = question.I15;
        var _I30 = question.I30;
        var _FillScore = '';
        _I2 = decode(_I2);
        var _inputs = '';
        var _inputClass = '';
        if (_I30 === 'S4-1') {
            _FillScore = question.FillScore;
            _inputClass = ' teacher-score';
        }
        else if (_I30 === 'S4-2') {
            //_FillScore = question.I16;
            _FillScore = question.FillScore;
        }
        if (_I2.indexOf('##') != -1) {
            var strArray = _I2.split('##');
            var len = strArray.length;
            for (i = 0; i < len - 1; i++) {
                var _index = i + 1;
                var _txt = '';
                var _correct = '';
                var _correctHmtl = '';
                var _teacherHtml = '';
                //填空题赋值
                if (_I15[i] != undefined) {
                    _txt = _I15[i];
                }
                //正确答案
                if (_I6[i] != undefined) {
                    _correct = _I6[i];
                }
                var _readyOnly = '';// 老师只读属性
                var _readyOnly_answer = '';
                var _fillScore = ''; //得分
                // 主观填空题
                if (_I30 === 'S4-1') {
                    _fillScore = _FillScore == undefined ? '' : _FillScore[i];
                }
                else if (_I30 === 'S4-2') { // 客观填空题
                    _fillScore = _FillScore == undefined ? '' : _FillScore[i];
                    _readyOnly = 'readonly="readonly"';
                }
                _fillScore = _fillScore == null ? '' : _fillScore;
                if (iscanlookanswer) {
                    _correctHmtl = '<div class="green">&#12288;&nbsp;&nbsp;正确答案：' + _correct + '</div>';
                }
                if (isShowScore) {
                    _readyOnly_answer = 'readonly="readonly"';
                    // 主观填空题
                    if (_I30 === 'S4-1') {
                        _teacherHtml = '，老师批阅：<input qesindex="' +i + '" qestype="' +_I30 + '" qesscore="' +_I9 + '" ' +_readyOnly + ' type="text" value="' +_fillScore + '" class="blanktxt' +_inputClass + '" />  分';
                    }
                    else if (_I30 === 'S4-2') { // 客观填空题
                        _teacherHtml = '，得分：<span>' +_fillScore + '</span>  分';
                    }
                    
                }
                if (isTeacherReview) {
                    _inputs += '<div class="blankwrap" itemid="' + _I1 + '"><div class="item green">' + _index + '、' +
                    '正确答案：' + _correct + '</div>' +
                    '</div>'
                }
                else {
                    _inputs += '<div class="blankwrap" itemid="' + _I1 + '"><div class="item">' + _index + '、' +
                    '学生作答：<input type="text" class="blanktxt" ' + _readyOnly_answer + ' value="' + _txt + '"/>' +
                    _teacherHtml + '</div>' +
                    _correctHmtl +
                    '</div>'
                }
            }
        } else {
        }
        return _inputs;
    }

    //阅读理解、完形填空题模板
    function readingCompTemplate(question, index, iscanlookanswer, isShowScore, isTeacherReview, isStudentAnswer) {
        var _I30 = question.I30;
        var _itemTem = '<div class="hassubqes" identifier="' + getQesId(_I30, index) + '">' + readingSubTemplate(question, index, iscanlookanswer, isShowScore, isTeacherReview, isStudentAnswer) + '</div>';
        //_itemTem += readingSubTemplate(question, index);
        return _itemTem;
    }

    //问答题模板
    function qaTemplate(question, index, iscanlookanswer, isShowScore, isTeacherReview) {
        var _I1 = question.I1; //试题ID
        var _I3 = question.I3; //试题类型
        var _I6 = question.I6;
        var _I7 = question.I7;
        var _I15 = question.I15;
        var _itemTem = '';
        if (isTeacherReview) {
            _itemTem += '<li itemid="' + _I1 + '">' +
                        '<div class="qa-editor">正确答案：' + _I6 + '</div>' +
                    '</li>'
        }
        else {
            _itemTem += '<li itemid="' + _I1 + '">' +
                        '<div id="ue' + _I1 + '" class="qa-editor"></div>' +
                        '<div hidden>' + _I15 + '</div>' +
                    '</li>'
        }
        var _template = '<ul class="question-options">' + _itemTem + '</ul>';
        return _template;
    }

    //阅读理解子题模板
    function readingSubTemplate(question, index, iscanlookanswer, isShowScore, isTeacherReview, isStudentAnswer) {
        var _sub = question.Sub;
        var _index = index + 1;
        var _I1 = question.I1;
        var _I2 = question.I2;
        var _I3 = question.I3;
        var _I6 = question.I6;
        var _I7 = question.I7;
        var _I10 = question.I10;
        var _I15 = question.I15;
        var _I30 = question.I30;
        var _title = '';
        var _qesResult = '';
        var _itemTem = '';
        $.each(_sub, function (q) {
            var _subI1 = _sub[q].I1;
            var _subI2 = _sub[q].I2;
            var _subI7 = _sub[q].I7;
            var _subI10 = _sub[q].I10;
            var _subI15 = _sub[q].I15;
            var _subI16 = _sub[q].I16;
            var _q = q + 1;
            var _resultHtml = '';
            var _markHtml = '';
            if (!isTeacherReview) {
                _resultHtml = qesResultHtml(_subI7, _subI10, _subI15, _subI16, iscanlookanswer, isShowScore);
            }
            if (isStudentAnswer) {
                _resultHtml = '';
                _markHtml = '<span class="question-mark" data-name="qes-' + _subI1 + '" data-value="0"></span>';
            }
            if (_I30 == 'S5') {
                _title = '<div class="reading-list" id="qes-' + _subI1 + '">' +
                         _markHtml +
                         '<h3 class="question-text" index="' + _q + '">(' + _q + ')、' + blankReplaceFun(_subI2) + '</h3>';
            }
            else if (_I30 == 'S7') {
                _title = '<div class="reading-list noTitle" id="qes-' + _subI1 + '">' +
                         _markHtml +
                         '<h3 class="question-text" index="' + _q + '" identifier="' + getQesId(_I30, q) + '">(' + _q + ')、</h3>';
            }
            _itemTem += _title +
                            '<ul class="question-options" identifier="qes-' + _subI1 + '">' +
                            readingSubItems(_sub[q], _sub[q].I6, isStudentAnswer, _I1) +
                            '</ul>' +
                        '</div>' +
                        _resultHtml;
        })
        return _itemTem;
    }

    //阅读理解选项
    function readingSubItems(sub, items, isStudentAnswer,parentQesId) {
        var _items = '';
        var _I1 = sub.I1;
        var _I2 = sub.I2;
        var _I3 = sub.I3;
        var _I7 = sub.I7;
        var _I15 = sub.I15;
        $.each(items, function (n) {
            var _itemClass = '';
            if (isStudentAnswer) {
                _itemClass = stuanswer(_I3, _I15, n);
            }
            else {
                _itemClass = stuanswerandcorrect(_I3, _I7, _I15, n);
            }
            _items += '<li class="' + _itemClass + '" itemindex="' + n + '" itemid="' + parentQesId + '" subitemid="' + _I1 + '"  data-value="' + isAnswer(_I15, n) + '">' +
                                    '<a href="javascript:void(0)"><i class="options">' + n + '</i><span class="qesitem">' + decode(items[n]) + '</span></a>' +
                                '</li>';
        })
        return _items;
    }

    //单选、多选、判断、问答题作答结果
    function getQesResult(question, iscanlookanswer, isShowScore) {
        var _I1 = question.I1; //试题id
        var _I3 = question.I3; //试题类型
        var _I6 = question.I6;
        var _I7 = question.I7; //正确答案
        var _I9 = question.I9; //试题分数
        var _I10 = question.I10; //解析
        var _I15 = question.I15; //学生作答结果
        var _I16 = question.I16;
        var _resultHtml = '';
        //单选、多选、判断题
        if (_I3 == 1 || _I3 == 2 || _I3 == 3) {
            _resultHtml = qesResultHtml(_I7, _I10, _I15, _I16, iscanlookanswer, isShowScore);
        }
        //问答题
        if (_I3 == 6) {
            var _correctHtml = '', _analysisHtml = '', _scoreHtml = '';
            if (iscanlookanswer) {
                _correctHtml = '<tr>' +
                                        '<td class="result-right-green" valign="top">参考答案：</td>' +
                                        '<td class="result-right-green">' + decode(_I6) + '</td>' +
                                    '</tr>';
                _analysisHtml = '<div class="essay_question">' +
                                   '<div class="topic-analysis topic-analysis3"><span class="folding-analysissigle1 foldingbutton"><span class="fsize12">解析：</span><span>' + _I10 + '</span></span></div>' +
                                '</div>';
            }
            if (isShowScore) {
                _scoreHtml = '<table class="tbl-answer tbl-answer2" style="margin-top:10px;">' +
                                    '<tr>' +
                                        '<td style="width: 10%;">判分：</td>' +
                                        '<td><input class="teacher-score" qesscore="' + _I9 + '" id=score' + _I1 + ' value="' + _I16 + '" />  分</td>' +
                                    '</tr>' +
                             '</table>';
            }
            _resultHtml = '<div class="resutlt-answer">' +
                                '<div data-value="0" itemindex="{{@@index}}" style="background-color:#fdfdf3;padding-top:25px" class="essayQuestion_bgc wendapage">' +
                                    '<span class="leftfont">批阅详情:</span>' +
                                    '<table class="tbl-answer">' +
                                        '<tr>' +
                                            '<td class="result-right-green" style="width: 100px; display: block;" valign="top">学生作答：</td>' +
                                            '<td>' +
                                                '<div class="result-right-green">' + decode(_I15) + '</div>' +
                                            '</td>' +
                                        '</tr>' +
                                        _correctHtml +
                                    '</table>' +
                                    _analysisHtml +
                                    _scoreHtml +
                                '</div>' +
                          '</div>';
        }
        return _resultHtml;
    }

    //单选、多选、判断作答结果
    function qesResultHtml(I7, I10, I15, I16, iscanlookanswer, isShowScore) {
        var _correctHtml = '';
        var _analysisHtml = '';
        var _scoreHtml = '';
        if (iscanlookanswer) {
            _correctHtml = '<br />正确答案：' + showAnswer(I7);
            _analysisHtml = '<div class="topic-analysis"><span class="folding-analysissigle1 foldingbutton"><span class="fsize12">解析:</span><span>' + decode(I10) + '</span></span></div>';
        }
        if (isShowScore) {
            _scoreHtml = '<span>&#12288;&#12288;得分:' + I16 + '分</span>';
        }
        var _html = '<div title="' + compareArray('text', I7, I15) + '" class="resutlt-answer ' + compareArray('class', I7, I15) + '">' +
                            '<span title="' + compareArray('text', I7, I15) + '" class="' + compareArrayForClass(I7, I15) + '"></span>' +
                            '<p>' +
                                    _correctHtml +
                                    '<br />' +
                                    '<span>' +
                                    '学生答案：' +
                                     showAnswer(I15) +
                                    '</span>' +
                                    _scoreHtml +
                            '</p>' +
                            _analysisHtml +
                        '</div>';
        return _html;
    }

    //比较数组相等
    function compareArray(type, arr, arrt) {
        if (isArray(arr) && isArray(arrt)) {
            var _arr = arr.join(',');
            var _arrt = arrt == '无' ? arrt = [] : arrt.join(',');
            if (_arr == _arrt) {
                if (type == 'text') {
                    return '回答正确';
                }
                else {
                    return 'result-right';
                }
            }
            else {
                if (type == 'text') {
                    return '回答错误';
                }
                else {
                    return 'result-wrong';
                }
            }
        }
    }

    //比较数组相等
    function compareArrayForClass(arr, arrt) {
        if (isArray(arr) && isArray(arrt)) {
            var _arr = arr.join(',');
            var _arrt = arrt == '无' ? arrt = [] : arrt.join(',');
            if (_arr == _arrt) {
                return 'answer-right';
            }
            else {
                return 'answer-wrong';
            }
        }
    }

    //绑定正确答案和学生作答
    function showAnswer(answer) {
        if (typeof answer === 'undefined' || answer === '无') {
            _answer = [];
        }
        else {
            _answer = answer;
        }
        var _html = '';
        $.each(_answer, function (i) {
            _html += '<i class="options-more answeritem">' + tranLetter(_answer[i]) + '</i>'
        })
        return _html;
    }

    //数字转换成字母
    function tranLetter(value) {
        value = String(value);
        switch (value) {
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
    }

    //学生我的考试列表
    function removeHTMLTag(value) {
        value = decode(value);
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
    }

    //设置导航大题样式类
    function bigQesClass(qestype) {
        var _type = '';
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
        else if (qestype == 6) {
            _type = 'question-qa';
        }
        else if (qestype == 5) {
            _type = 'question-reading';
        }
        else if (qestype == 7) {
            _type = 'question-fill';
        }
        return _type;
    }

    //绑定结果
    function isAnswer(stuAnswer,index) {
        var _itmeindex = index.toString();
        if ($.inArray(_itmeindex, stuAnswer) > -1) {
            return '1'
        }
        else {
            return '0'
        }
    }

    //判断数组
    var isArray = function (value) {
        if (typeof Array.isArray === "function") {
            return Array.isArray(value);
        } else {
            return Object.prototype.toString.call(value) === "[object Array]";
        }
    }
    
})(jQuery);