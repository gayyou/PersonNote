/**
 * 这是一个兼容性的监听事件。只需要直接用这个对象的方法就行。惰性加载函数，所以控制台输出只能是当前浏览器支持的监听事件
 * @event
 * @function EventUtil.addHandler 全局的添加事件的方法。
 * @function EventUtil.removeHandler 全局的删除事件的方法。
 * @param {Object} element 添加事件的对象
 * @param {String} type 事件类型
 * @param {Function} handler 事件监听函数
 */
const EventUtil = {
    
    addHandler: (function () {
        if (window.addEventListener) {
            return function () {
                arguments[0].addEventListener(arguments[1], arguments[2], false);
            };
        } else if (window.attachEvent) {
            return function () {
                arguments[0].attachEvent("on" + arguments[1], arguments[2]);
            };
        } else {
            return function () {
                arguments[0]["on" + arguments[1]] = arguments[2];
            };
        }
    })(),

    removeHandler: (function() {
        if (window.addEventListener) {
            return function () {
                arguments[0].removeEventListener(arguments[1], arguments[2]);
            };
        } else if (window.attachEvent) {
            return function () {
                arguments[0].detachEvent("on" + arguments[1], arguments[2]);
            };
        } else {
            return function () {
                arguments[0]["on" + arguments[1]] = null;
            };
        }
    })()
};

/**
 * @description 限制输入框的最大输入字数
 * @param {inputDom} inputDom 输入框节点
 * @param {Number} length 限制的长度
 */
function limitLength(inputDom, length) {
    return (inputDom.value.length > length ? inputDom.value.slice(0, length) : inputDom.value);
}

/***
 * 规范化时间
 */
function formatTime(time) {
    return time < 10? '0' + time : time.toString();
}

/**
 * 得到当前时间
 * 格式是 xxxx-xx-xx xx:xx:xx
 */
function getNowTime() {
    let time = new Date(),
        year,
        month,
        day,
        hour,
        minute,
        second;

    year = formatTime(time.getFullYear());
    month = formatTime(time.getMonth() + 1);
    day = formatTime(time.getDate());
    hour = formatTime(time.getHours());
    minute = formatTime(time.getMinutes());
    second = formatTime(time.getSeconds());
    return (year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second);
}

/**
 * 请求的父类
 */
class Request {
    constructor(urls = '', jsonObj = {}) {
        // url 是发送地址的末端部分
        // jsonObj 是发送的数据json对象
        if (new.target === 'Request') {
            throw(new Error('父类不能构造对象'));
            return;
        }
        this.baseUrl = 'http://localhost:8080/user/';
        this.url = this.baseUrl + urls;
        this.jsonObj = jsonObj;
        this.contentType = 'application/json';
    }

    set setData(jsonObj = {}) {
        this.jsonObj = jsonObj;
    }

    set setUrl(url = '') {
        this.url = this.baseUrl + url;
    }
}

class PostRequest extends Request {
    constructor(url, jsonObj) {
        super(url, jsonObj);
    }
    sendRequest(success, error) {
        // console.log(this.url)
        $.ajax({
            url: this.url,
            type: 'post',
            data: JSON.stringify(this.jsonObj),
            dataType: 'json',
            contentType: 'application/json',
        //     crossDomain: true,
        // 　　xhrFields: {
        // 　　 withCredentials: true
        // 　　},
            processData: false,
            success: success,
            error: error
        });
    }
}

class GetRequest extends Request {
    constructor() {
        super();
    }

    sendRequest(success, error) {
        
    }
}

/**
 * 
 * @param {String} str 
 * @param {} pattern 
 */
function filtString(str, pattern) {
    let str = '',
        i,
        len = str.length;
    for (i = 0; i < len; i++) {
        // if ()
    }
}

/**
 * @description 显示付出框并提示出现的情况
 * @param {String} content 提示用语
 */
function showMessage(content) {
    let layerSpan = $('#layer-context')[0],
        $layer = $('#layer');
    if ($layer.hasClass('normal')) {
        $layer.removeClass('normal');
        $layer.addClass('active');
    }
    layerSpan.innerText = content;
}

function hiddenMessage() {
    let $layer = $('#layer');
    if ($layer.hasClass('active')) {
        $layer.removeClass('active');
        $layer.addClass('normal');
    }
}

/**
 * @description 对输入框进行正则表达式的检测
 * @param {Dom} inputDom 
 * @param {Object} RegObj 
 * @param {String} text 
 */
function RegExpCheckInput(inputDom, RegObj, text) {
    let value = inputDom.value;
    if (!RegObj.test(value)) {
        showTips(inputDom, text);
        if (value.length == 0) {
            hiddenTips(inputDom);
        }
        return false;
    }
    hiddenTips(inputDom);
    return true;
}

/**
 * @description 对输入框输入的最小字数进行限制的函数
 * @param {Dom} inputDom 
 * @param {Number} length 
 * @param {String} text 
 */
function lengthCheckInput(inputDom, length, text) {
    let value = inputDom.value;
    if (value.length < length) {
        showTips(inputDom, text);
        if (value.length == 0) {
            hiddenTips(inputDom);
        }
        return false;
    }
    hiddenTips(inputDom);
    return true;
}
/**
 * @description 输入框提示
 * @param {String} text 提示的内容
 */
function showTips(inputDom ,text) {
    let $target = $($(inputDom).parent()[0].getElementsByClassName('tips')[0]);
    $target[0].innerText = text;
    if (!$target.hasClass('tip-active')) {
        $target.addClass('tip-active');
    }
}

/**
 * @description 隐藏提示框
 */
function hiddenTips(inputDom) {
    let $target = $($(inputDom).parent()[0].getElementsByClassName('tips')[0]);
    if ($target.hasClass('tip-active')) {
        $target.removeClass('tip-active');
    }
}

/**
 * @description 输入框底下的线的变化动画 
 * @param {Dom} lineDom 线的dom对象
 * @param {Number} mode 1.代表正在聚焦时候， 2.代表失去聚焦
 */
function lineAnimate(lineDom, mode) {
    let $target = $(lineDom);
    if (!$target.hasClass('bottom-line-active') && mode == 1) {
        $target.addClass('bottom-line-active');
    }
    if ($target.hasClass('bottom-line-active') && mode == 2) {
        $target.removeClass('bottom-line-active');
    }
}

/**
 * @description 对输入框内部左侧的label进行动画效果的控制
 * @param {Dom} label label的dom对象
 * @param {Number} mode 1.代表正在聚焦 2.代表失去聚焦
 */
function labelAnimate(label, mode) {
    let $target = $(label);
    if (!$target.hasClass('label-active') && mode == 1) {
        $target.addClass('label-active');
    }
    if ($target.hasClass('label-active') && mode == 2 && $target.parent()[0].getElementsByClassName('inputArea')[0].value.length == 0) {
        $target.removeClass('label-active');
    }
}

/**
 * @description 对输入框聚焦事件进行监听
 * @param {Object} event 事件监听对象
 */
function inputAnimateControl(event) {
    let $target = $(event.target);
    if ($target.hasClass('inputArea') && event.type == 'focus') {
        lineAnimate($target.parent()[0].getElementsByClassName('bottom-line')[0], 1);
        labelAnimate($target.parent()[0].getElementsByClassName('input-label')[0], 1);
    }
    if ($target.hasClass('inputArea') && event.type == 'blur') {
        lineAnimate($target.parent()[0].getElementsByClassName('bottom-line')[0], 2);
        labelAnimate($target.parent()[0].getElementsByClassName('input-label')[0], 2);
    }
}

