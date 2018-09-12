define(['jquery', 'common', 'utils/xhr'], function ($, common, xhr) {

    var WebApi_Job = '/TeacherCenter/OnlineJob'; //作业接口地址
    var WebApi_Job_Student = '/StudentCenter/OnlineJob'; //作业接口地址

    //获取抽题方式
    var getPaperBuildModeList = function (callback) {
        var ajax = {
            type: 'POST',
            url: WebApi_Job + '/GetPaperBuildModeList',
            success: function (data) {
                callback(data);
            }
        }
        xhr.callAjax(ajax);
    }

    //获取作业
    var getOnlineWork = function (courseexerciseId, callback) {
        var ajax = {
            type: 'POST',
            url: WebApi_Job + '/GetDefaultShowValue',
            data: {
                exerciseId: courseexerciseId
            },
            success: function (data) {
                callback(data);
            }
        }
        xhr.callAjax(ajax);
    }

    //做作业
    var doOnlineWork = function (type, workinfo, callback) {
        var _url = '';
        if (type == 'submit') {
            _url = WebApi_Job_Student + "/SubmitHomework";
        }
        else if (type == 'save') {
            _url = WebApi_Job_Student + "/SaveHomework";
        }
        $.ajax({
            url: _url,
            type: "post",
            data: {
                answerSheet: workinfo.answerSheet,
                homeworkID: workinfo.homeworkID
            },
            dataType: "json",
            success: function (data) {
                callback(data);
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
            }
        })
    }

    //批阅作业
    var markOnlineWork = function (workinfo, callback) {
        $.ajax({
            url: WebApi_Job + '/MarkExercise',
            type: "post",
            data: {
                homeworkId: workinfo.homeworkId,
                resultJson: workinfo.resultJson,
                state: workinfo.state,
                subjectiveScore: workinfo.subjectiveScore
            },
            dataType: "json",
            success: function (data) {
                callback(data);
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
            }
        })
    }

    //查看批阅
    var reviewOnlineWorkTeacher = function (workId, callback) {
        var ajax = {
            type: 'POST',
            url: WebApi_Job + '/HomeworkReview',
            data: {
                homeworkId: workId
            },
            success: function (data) {
                callback(data);
                //if (data) {

                //}
                //else {
                //    common.modal.alert('系统出错，请联系管理员！');
                //}
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
            }
        }
        xhr.callAjax(ajax);
    }

    //学生查看作业
    var reviewOnlineWork = function (workId, callback) {
        var ajax = {
            type: 'POST',
            url: WebApi_Job_Student + '/HomeworkReview',
            data: {
                homeworkId: workId
            },
            success: function (data) {
                callback(data);
                //if (data) {
                    
                //}
                //else {
                //    common.modal.alert('系统出错，请联系管理员！');
                //}
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
            }
        }
        xhr.callAjax(ajax);
    }

    return {
        getPaperBuildModeList: getPaperBuildModeList,
        getOnlineWork: getOnlineWork,
        doOnlineWork: doOnlineWork,
        markOnlineWork: markOnlineWork,
        reviewOnlineWork: reviewOnlineWork,
        reviewWorkTeacher: reviewOnlineWorkTeacher
    };
});