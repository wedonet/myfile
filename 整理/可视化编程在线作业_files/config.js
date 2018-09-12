/// <reference path="../oes_components/echarts/echarts.all.js" />
require.config({
    baseUrl: '/Content/scripts/',
    waitSeconds: 600,
    urlArgs: 'ver=' + (new Date()).getTime(),
    //urlArgs:'',
    paths: {
        'jquery': '../oes_components/jquery/jquery',
        //jqueryui
        'jqueryui': '../oes_components/jquery-ui/ui/jquery-ui',
        //layer
        'layer': '../oes_components/layer/src/layer',
        //跑马灯插件
        'jqueryMarqueePlugin': '../oes_components/jquery-plugin-marquee/js/jquery-marquee-plugin',
        //handlebars
        'handlebars': '../oes_components/handlebars/handlebars',
        'jqueryPager': '../oes_components/jquery-pager-plugin/jquery.pager',
        //分页插件
        'pagination': '../oes_components/Mricode.Pagination/mricode.pagination',
        //局部加载插件
        'loading': '../oes_components/jquery-ms-loading/loading',
        //试卷渲染插件
        'paperJs': '../oes_components/jquery-ms-paper/exampaper',
        //ztree
        'ztree': '../oes_components/ztree/js/jquery.ztree.all-3.5',
        'jquerycookie': '../oes_components/jquery.cookie/jquery.cookie',
        //视频插件
        'videoJs': '../oes_components/video.js/dist/video-js/video.dev',
        //日期插件
        'datetimepicker': '../oes_components/smalot-bootstrap-datetimepicker/js/bootstrap-datetimepicker.min',
        'language': '../oes_components/smalot-bootstrap-datetimepicker/js/locales/bootstrap-datetimepicker.zh-CN',
        //日期插件datetimepicker4.7
        'bootstrapdatetimepicker': '../oes_components/eonasdan-bootstrap-datetimepicker/build/js/bootstrap-datetimepicker.min',
        //日期格式化
        'moment': '../oes_components/moment/moment',
        //日期汉字
        'datezhcn': '../oes_components/moment/locale/zh-cn',
        //bootstrap下拉框
        'bootstrapDropdown': '../oes_components/bootstrap/js/dropdown',
        'bootstrapModal': '../oes_components/bootstrap/js/modal',
        'bootstrapPopover': '../oes_components/bootstrap/js/popover',
        'bootstrapTooltip': '../oes_components/bootstrap/js/tooltip',
        'bootstrapTransition': '../oes_components/bootstrap/js/transition',
        //弹出层控件
        'bootbox': '../oes_components/bootbox/bootbox',
        //富文本控件
        'ueditorConfig': '../oes_components/ueditor/ueditor.config',
        // 富文本公式插件
        'addKityFormulaDialog': '../oes_components/ueditor/kityformula-plugin/addKityFormulaDialog',
        'getKfContent': '../oes_components/ueditor/kityformula-plugin/getKfContent',
        'defaultFilterFix': '../oes_components/ueditor/kityformula-plugin/defaultFilterFix',
        'zeroClipboard': '../oes_components/ueditor/third-party/zeroclipboard/ZeroClipboard',
        'formdesign': '../oes_components/ueditor/formdesign/leipi.formdesign.v4',
        'ueditor': '../oes_components/ueditor/ueditor.all',
        //上传插件
        'webuploader': '../oes_components/webuploader/webuploader.min',
        // 星星插件
        'raty': '../oes_components/jquery-raty/jquery.raty',
        //滚动条插件
        'slimScroll': '../oes_components/jquery-slimscroll/jquery.slimscroll',
        //另一个滚动条插件
        'niceScroll': '../oes_components/jquery.nicescroll/jquery.nicescroll',
        //分页插件
        'pager': '../oes_components/Mricode.Pagination/mricode.pagination',
        //jquery-browser插件
        'browser': '../oes_components/jquery.browser/jquery.browser',
        //iframe高度自适应插件
        'iframeautoheight': '../oes_components/jquery-iframe-auto-height/jquery-iframe-auto-height',
        //echart
        'echart': '../oes_components/echarts/dist/echarts',
        'echarts': '../oes_components/echarts/dist/echarts',//首页排名使用
        'liquidfill': '../oes_components/echarts/dist/echarts-liquidfill',//首页排名使用
        //圆圈进度
        'circle': '../oes_components/circle/circle-progress',
        //数字滚动
        'scrollJs': '../oes_components/scrollerjs/scroller',
        //增强下拉菜单
        'selectPicker': '../oes_components/bootstrapselect/dist/js/bootstrap-select',
        //滑动菜单插件
        'menuslide': '../oes_components/jquery-ms-menuslide/menuslide',
        //datatable 表格插件
        'datatable': '../oes_components/jquery-datatable/js/jquery.dataTables.min',
        //chart扩展插件
        'openchart': '../oes_components/jquery-ms-chart/openchart',
        //摄像插件支持IE9以上,需要https
        'webcam': '../oes_components/webcam/webcam.min',
        //videojs
        'video': '../oes_components/vjs-open-master/dist/video.min',
        'videoopen': '../oes_components/vjs-open-master/dist/videojs-open',
        'videoplugin': '../oes_components/vjs-open-master/src/plugin',
        //下拉搜索框
        'searchableSelect': '../oes_components/searchableSelect/jquery.searchableSelect',
        'jQueryRotate': '../oes_components/jQueryRotate',
        'lodash': '../oes_components/lodash/lodash'
    },
    map: {
        '*': {
            'css': '../oes_components/require-css/css'
        }
    },
    shim: {
        jqueryui: {
            deps: ['jquery']
        },
        jQueryRotate: {
            deps: ['jquery']
        },
        jqueryPager: {
            deps: ['jquery', 'css!../oes_components/jquery-pager-plugin/Pager.css']
        },
        pagination: {
            deps: ['jquery', 'css!../oes_components/Mricode.Pagination/mricode.pagination.css']
        },
        layer: {
            deps: ['jquery', 'css!../oes_components/layer/src/skin/default/layer.css']
        },
        loading: {
            deps: ['jquery', 'css!../oes_components/jquery-ms-loading/skin/loading.css']
        },
        paperJs: {
            deps: ['jquery', 'css!../oes_components/jquery-ms-paper/skin/paper.css']
        },
        ztree: {
            deps: ['jquery']
        },
        jquerycookie: {
            deps: ['jquery']
        },
        videoJs: {
            deps: ['css!../oes_components/video.js/dist/video-js/video-js.css'],
            init: function () {
                alert('video-init');
            }
        },
        bootstrapDropdown: {
            deps: ['jquery']
        },
        bootstrapModal: {
            deps: ['jquery', 'bootstrapTransition']
        },
        bootstrapPopover: {
            deps: ['jquery', 'bootstrapTooltip']
        },
        bootstrapTransition: {
            deps: ['jquery']
        },
        datetimepicker: {
            deps: ['jquery', 'css!../oes_components/smalot-bootstrap-datetimepicker/css/bootstrap-datetimepicker.css']
        },
        language: {
            deps: ['datetimepicker']
        },
        bootstrapdatetimepicker: {
            deps: ['jquery', 'moment', 'datezhcn', 'css!../oes_components/eonasdan-bootstrap-datetimepicker/build/css/bootstrap-datetimepicker.min']
        },
        ueditor: {
            deps: ['ueditorConfig', 'utils/clipboard']
        },
        addKityFormulaDialog: {
            deps: ['ueditor']
        },
        getKfContent: {
            deps: ['addKityFormulaDialog']
        },
        defaultFilterFix: {
            deps: ['getKfContent', 'formdesign']
        },
        formdesign: {
            deps: ['ueditor']
        },
        jqueryMarqueePlugin: {
            deps: ['jquery', 'css!../oes_components/jquery-plugin-marquee/css/main.css']
        },
        webuploader: {
            deps: ['css!../oes_components/webuploader/webuploader.css']
        },
        raty: {
            deps: ['jquery', 'css!../oes_components/jquery-raty/jquery.raty.css']
        },
        slimScroll: {
            deps: ['jquery']
        },
        niceScroll: {
            deps: ['jquery']
        },
        pager: {
            deps: ['jquery', 'css!../oes_components/Mricode.Pagination/mricode.pagination.css']
        },
        browser: {
            deps: ['jquery']
        },
        iframeautoheight: {
            deps: ['jquery', 'browser']
        },
        circle: {
            deps: ['jquery']
        },
        scrollJs: {
            deps: ['css!../oes_components/scrollerjs/scroller.css']
        },
        selectPicker: {
            deps: ['jquery', 'css!../oes_components/bootstrapselect/dist/css/bootstrap-select.min.css']
        },
        menuslide: {
            deps: ['jquery', 'css!../oes_components/jquery-ms-menuslide/skin/menuslide.css']
        },
        datatable: {
            deps: ['jquery', 'css!../oes_components/jquery-datatable/css/jquery.dataTables.min.css']
        },
        openchart: {
            deps: ['echart']
        },
        searchableSelect: {
            deps: ['jquery', 'css!../oes_components/searchableSelect/jquery.searchableSelect.css']
        },
        liquidfill: {
            deps: ['echarts']
        }
    }
});

