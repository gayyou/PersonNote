// 导入工具包
// import * as util from 'util.js';

/**
 * @param {Object} event 事件对象
 */
function filtInput(event) {
    let email = $('#email')[0],
        password = $('#password')[0],
        target = event.target;
    switch(target) {
        case email: {
            target.value = limitLength(target, 36);
            if (!RegExpCheckInput(target, new RegExp(/^([a-zA-Z0-9._-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/), '请输入正确的邮箱地址')) {
                target.focus();
                return;
            }
            break;
        }
        case password: {
            target.value = limitLength(target, 18);
            if (!lengthCheckInput(target, 6, '密码不能低于6位')) {
                return;
            }
            break;
        }
    }
}
EventUtil.addHandler($('.input-container')[0], 'input', filtInput);

function checkInput() {
    let email = $('#email')[0],
        password = $('#password')[0];
    if (!RegExpCheckInput(email, new RegExp(/^([a-zA-Z0-9._-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/), '请输入正确的邮箱地址')) {
        email.focus();
        return false;
    }
    if (!lengthCheckInput(password, 6, '密码不能低于6位')) {
        password.focus();
        return false;
    }
    return true;
}

/**
 * 登陆提交函数
 */
function loginSubmit() {
    let email = $('#email')[0],
        password = $('#password')[0],
        jsonObj = null,
        postReq = null;
    if (!checkInput()) {
        return;
    }
    jsonObj = {
        email : email.value,
        password : password.value
    }
    postReq = new PostRequest('login', jsonObj);
    postReq.sendRequest( (res) => {
        if (res == 1) {
            window.location.href = 'mainPage.html';
        } else if (res == 0) {
            showMessage('登陆失败，请检查账号密码')
        }
    }, (error) => {
        showMessage('请求失败')
    })
}


/**
 * 添加事件监听
 */
(() => {
    let inputArr = $('.inputArea');
    for (let i = 0; i < inputArr.length; i++) {
        ((i) => {
            inputArr[i].onfocus = inputAnimateControl;
            inputArr[i].onblur = inputAnimateControl;
        })(i);
    }
})();

EventUtil.addHandler($('#submit-button')[0], 'click', loginSubmit);
EventUtil.addHandler($('.layer-button')[0], 'click', hiddenMessage);
EventUtil.addHandler($('#password')[0], 'keydown', (event) => {
    if (event.keyCode == 13) {
        loginSubmit();
    }
});