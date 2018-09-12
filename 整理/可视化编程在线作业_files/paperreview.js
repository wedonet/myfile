/**
 * 学生查看模块
 */
define(['common', 'jquery', 'utils/xhr', 'utils/formatter', 'handlebars', 'modules/work_module', 'paperJs', 'layer'], function (common, $, xhr, formatter, Handlebars, workmodule) {
    //#region 资源定义
    var WebApi_Work = '/StudentCenter/OnlineJob'; //作业接口地址
    var answerid = common.func.GetQueryString("answerid"); //答案Id
    var homeworkId = common.func.GetQueryString("homeworkId"); //试卷Id
    var courseId = common.func.GetQueryString("CourseID"); //课程Id
    //#endregion
    var jobID = "";
    var jobid = "";
    var allquesnum = 9;//总题目数量
    var studentScore = 0;
    var markArr = [];//题目标记集合
    var checkStepGather = []; //存放每个多选题的答案
    var num = [];//多选题选项标记选择数量集合
    var ueArray = []; //富文本集合
    var newPaper = [];//新的大题对象
    var topicType = "";//题目类型
    var showanalysiscount = ""; //作答几次后显示解析
    var limitTimes; //允许提交次数
    var restTimes; //剩余次数
    var answerTimes; //已经作答次数
    var beginTime;//作业开始时间
    var endTime;// 作业结束时间
    var systemTime; //现在时间
    var temPaper = {};
    var temTopic = [];
    var temTotalScore = 0;
    var questionNum = 0;
    var haveAnswerNum = 0;
    var resultList = [];
    var answerSheets = {};
    var resultJson = {};
    var isCanLookAnswer = ''; //是否可以查看答案
    var isShowScore = ''; //是否可以查看得分
    var overplus = ''; //剩余次数
    var isOverTime = '';//现在时间是否超过最后答题日期


    //正式卷
    var paper;
    var resultID;
    //遍历多选题
    var len = $('.question-check .question-cont').length;
    for (var k = 0; k < len; k++) { num[k] = 0; }

    //获取试卷
    function GetStudentJob() {
        workmodule.reviewOnlineWork(homeworkId, function (data) {
            if (data.status == 0) {
                var data = data.data;
                var _sheets = [];
                var _data = data.homework;
                var _testPaper = data.TestPaperContentJson;
                var _stuHomework = data.stuHomework;
                isCanLookAnswer = data.IsCanLookAnswer; //是否显示答案
                isShowScore = data.IsShowScore; //是否显示得分
                overplus = 0;
                var _myDate = new Date();
                isOverTime = 1;  //当前时间大于最后截止时间为1
                var _itemBankID = "";
                if (_testPaper) {
                    var _paper = _testPaper;
                    resultJson = data.ResultJson.Items;
                    var _questions = _paper.Items;
                    var _AnswerSheet = data.AnswerSheet.Items;
                    studentScore = data.ObjectiveScore + data.SubjectiveScore;
                    $(".worktitle").text(data.ExerciseName);//作业名称
                    $(".jobscore").text(_paper.Model.P5); //作业总分
                    $(".student-score").text(studentScore);
                    _itemBankID = data.ItemBankID;
                    $.each(_questions, function (i) {
                        var _I1 = _questions[i].I1;
                        var _I6 = _questions[i].I6;
                        _questions[i].I2 = common.utils.replacePre(common.utils.decode(_questions[i].I2));
                        _questions[i].I10 = common.utils.replacePre(common.utils.decode(_questions[i].I10));
                        $.each(_I6, function (i) {
                            _I6[i] = common.utils.replacePre(common.utils.decode(_I6[i]));
                        });
                        $.each(_AnswerSheet, function (j) {
                            if (_questions[i].I1 == _AnswerSheet[j].I1) {
                                if (_questions[i]['Sub'] != null && _questions[i]['Sub'] != undefined) {
                                    $.each(_questions[i]['Sub'], function (k) {
                                        if (_AnswerSheet[j]['Sub'] != null && _AnswerSheet[j]['Sub'] != undefined) {
                                            $.each(_AnswerSheet[j]['Sub'], function (d) {
                                                if (_questions[i]['Sub'][k].I1 == _AnswerSheet[j]['Sub'][d].I1) {
                                                    _questions[i]['Sub'][k].I15 = _AnswerSheet[j]['Sub'][d].I15;
                                                }
                                            })
                                        } else {
                                            //_AnswerSheet[j]['sub'] = [];
                                        }
                                    })
                                }
                                if (_AnswerSheet[j].I15 != undefined && _AnswerSheet[j].I15 != '' && _AnswerSheet[j].I15 != null) {
                                    _questions[i].I15 = formatter.trans.tranNum(_AnswerSheet[j].I15);
                                }
                                else {
                                    _questions[i].I15 = [];
                                }
                            }


                        })
                        $.each(resultJson, function (n) {
                            var _resultJson = resultJson[n];
                            if (_I1 == _resultJson.I1) {
                                var _resultItemSub = resultJson[n].Sub;
                                //_questions[i].I16 = _resultJson.I16;
                                if (_questions[i].I30 == 'S4-1' || _questions[i].I30 == 'S4-2') {
                                    _questions[i].FillScore = _resultJson.FillScore == null ? '' : _resultJson.FillScore;
                                }
                                if (_resultItemSub) {
                                    $.each(_resultItemSub, function (o) {
                                        $.each(_questions[i].Sub, function (q) {
                                            if (_resultItemSub[o].I1 == _questions[i].Sub[q].I1) {
                                                _questions[i].Sub[q].I16 = _resultItemSub[o].I16;
                                            }
                                        })
                                    })
                                }
                                else {
                                    _questions[i].I16 = _resultJson.I16;
                                }
                            }
                        });
                    })
                    answerSheets = {
                        TestPaperID: _itemBankID,
                        ResultList: _sheets
                    }
                    resultID = data.ResultID;
                    showanalysiscount = 0; ////作答几次后显示解析
                    limitTimes = 0; //总答题次数
                    restTimes = 0; //剩余答题次数
                    answerTimes = 0; //已经答题次数
                    beginTime = data.BeginDate;
                    endTime = data.EndDate;
                    systemTime = data.SystemTime;
                    paper = _paper;
                    questionNum = _paper.Items.length;
                    getNewPaper(paper);
                    //初始化作业插件
                    $(".topicwrap").paper({
                        data: newPaper,
                        isCanLookAnswer: isCanLookAnswer == 0 ? false : true,   //是否可以查看答案
                        isShowScore: isShowScore == 0 ? false : true   //是否可以查看得分
                    });
                    $('.topicwrap input').attr('readonly', 'readonly').addClass('readonly');

                    //绑定试题导航
                    var template_guid = Handlebars.compile($("#Tmplguide").html());
                    var renderHTML_guid = template_guid(newPaper);
                    $(".answerguide").html(renderHTML_guid);

                    getDataOpation();
                }
            }
            else {
                common.modal.alert(data.message, function () {
                    window.close();
                });
            }
        });
    }
    GetStudentJob();


    //组合新试卷
    function getNewPaper(paperObj) {
        if (paperObj.Sections.length > 0) {
            for (i = 0; i < paperObj.Sections.length; i++) {
                getTopic(paperObj, paperObj.Sections[i].ItemID);
                temPaper = {
                    "Title": paperObj.Sections[i].Title,
                    'isCanLookAnswer': isCanLookAnswer,
                    "TopicsNum": paperObj.Sections[i].ItemID.length,
                    "LimitTimes": limitTimes, //总答题次数
                    "EndTime": endTime,
                    "SystemTime": systemTime,
                    "TopicsScore": temTotalScore,
                    "Topics": temTopic,
                    "topicType": topicType,
                    "overplus": overplus,  //剩余答题次数 如果是0 可以显示解析和答案
                    "isOverTime": isOverTime, //当前日期是否超过最后答题日期 如果是则是1 可以显示解析和答案
                    'isShowAnalysis': answerTimes == showanalysiscount ? 1 : 0 //是否显示解析 1是显示 0不显示 
                }
                newPaper.push(temPaper);
            }

        }
        ////console.log(newPaper);
    }

    //获取试题 
    function getTopic(paper, itemID) {
        temTopic = [];
        temTotalScore = 0;
        topicType = "";
        if (paper.Items.length > 0) {

            for (j = 0; j < paper.Items.length; j++) {
                for (k = 0; k < itemID.length; k++) {
                    if (paper.Items[j].I1 == itemID[k]) {
                        topicType = paper.Items[j].I3;
                        temTopic.push(paper.Items[j]);
                        temTotalScore += paper.Items[j].I9;
                    }
                }
            }
        }
    }

    //绑定数据后操作
    function getDataOpation() {
        $(".answeritem").each(function () {
            var _optionNum = $(this).text();
            $(this).text(formatter.trans.tranLetter(_optionNum));
        })

        $(".question-options .options").each(function () {
            var _optionNum = $(this).text();
            $(this).text(formatter.trans.tranLetter(_optionNum));
        })
        $(".question-options .options-more").each(function () {
            var _optionNum = $(this).text();
            $(this).text(formatter.trans.tranLetter(_optionNum));
        })

        //大题加序号
        $(".question-type .item-type").each(function (i) {
            var _typename = $(this).text();
            switch (i) {
                case 0: $(this).text("一、" + _typename); break;
                case 1: $(this).text("二、" + _typename); break;
                case 2: $(this).text("三、" + _typename); break;
                case 3: $(this).text("四、" + _typename); break;
                case 4: $(this).text("五、" + _typename); break;
                case 5: $(this).text("六、" + _typename); break;
                case 6: $(this).text("七、" + _typename); break;
                case 7: $(this).text("八、" + _typename); break;
                case 8: $(this).text("九、" + _typename); break;
                case 9: $(this).text("十、" + _typename); break;
                case 10: $(this).text("十一、" + _typename); break;
                case 11: $(this).text("十二、" + _typename); break;
                case 12: $(this).text("十三、" + _typename); break;
                case 13: $(this).text("十四、" + _typename); break;
                case 14: $(this).text("十五、" + _typename); break;
                case 15: $(this).text("十六、" + _typename); break;
            }
        })
    }


    //打开解析
    $('body').on('click', '.foldingbutton', function () {
        var $this = $(this);
        floding($this);
        event.stopImmediatePropagation();
    })

    function floding($this) {
        if ($this.hasClass("open")) {
            $this.removeClass("open");
            $this.parent().parent().find(".topic-analysis-con").stop(true, true).slideUp();
        }
        else {
            $this.addClass("open");
            $this.parent().parent().find(".topic-analysis-con").stop(true, true).slideDown();
        }
    }

    //关闭按钮
    $("#closework").click(function () {
        window.close();
    });

    //锚点跳转
    $('.resultshow').delegate('a', 'click', function () {
        var name = $(this).attr('name');
        document.getElementById(name).scrollIntoView()
    });
    //智能定位
    $(document).scroll(function () {
        var nScrollTop = $(this).scrollTop();
        if (nScrollTop > 180) {
            $('.content-style').css({ 'top': nScrollTop - 260 });
        } else {
            $('.content-style').css({ 'top': 0 });
        }
    });
    common.win.prohibitContextMenu(); //禁用鼠标右边  
    common.win.prohibitCtrlC(); //禁用ctrl+c功能
    common.win.prohibitSelect(); //禁用选中
});