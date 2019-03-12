// 导入工具包
// import * as util from 'util.js';

function filtInput(event) {
    let phone = $('#phone')[0],
        name = $('#name')[0],
        password = $('#password')[0],
        email = $('#email')[0],
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

            case phone: {
                target.value = limitLength(target, 11);
                if (!RegExpCheckInput(target, new RegExp('^(13[0-9]|15[0-9]|188|187|189)\\d{8}$'), '请输入正确的手机号码')) {
                    return;
                }
                break;
            }

            case name: {
                target.value = limitLength(target, 10);
                if (!lengthCheckInput(target, 2, '名字长度不能低于2位')) {
                    return;
                }
                break;
            }

            case password: {
                target.value = limitLength(target, 18);
                if (!lengthCheckInput(target, 6, '密码长度不能低于6位')) {
                    return;
                }
                break;
            }

        }
}
EventUtil.addHandler($('.input-container')[0], 'input', filtInput);

function checkInput() {
    let email = $('#email')[0],
        phone = $('#phone')[0],
        name = $('#name')[0],
        password = $('#password')[0];
    if (!RegExpCheckInput(email, new RegExp(/^([a-zA-Z0-9._-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/), '请输入正确的邮箱地址')) {
        email.focus();
        return false;
    }
    if (!RegExpCheckInput(phone, new RegExp('^(13[0-9]|15[0-9]|188|187|189)\\d{8}$'), '请输入正确的手机号码')) {
        phone.focus();
        return false;
    }
    if (!lengthCheckInput(name, 2, '名字长度不能低于2位')) {
        name.focus();
        return false;
    }
    if (!lengthCheckInput(password, 6, '密码长度不能低于6位')) {
        password.focus();
        return false;
    }
    return true;
}


function checkEmail() {
    let email = $('#email')[0],
        name = $('#name')[0],
        password = $('#password')[0],
        jsonObj = null;
    if (email.value.length == 0) {
        return;
    }
    jsonObj = {
        email: email.value,
        name: name.value,
        password: password.value,
        mode: 2,
        phone: phone.value
    };
    const PostReq = new PostRequest('signs', jsonObj);
    PostReq.sendRequest( (res) => {
        if (res == 0) {
            showTips(email, '该账户已经被注册了');
        }
        if (res == 1) {
            hiddenTips(email);
        }
    }, () => {

    })
}
EventUtil.addHandler($('#email')[0], 'blur', checkEmail);


/**
 * @description 注册提交函数
 */
function registSubmit() {
    let phone = $('#phone')[0],
        name = $('#name')[0],
        password = $('#password')[0],
        email = $('#email')[0],
        jsonObj = null,
        postReq = null;
    if (!checkInput()) {
        // 当表单不符合要求的时候
        return;
    }
    jsonObj = {
        phone : phone.value, //手机号码
        name : name.value, //用户的名字
        password : password.value,//密码
        email : email.value, //邮箱
        mode: 1
    }
    postReq = new PostRequest('signs', jsonObj);
    postReq.sendRequest((res) => {
        if (res == 1) {
            showMessage('注册成功')
        } else if (res == 0) {
            showMessage('注册失败');
            showTips(email, '该账号已经被注册了');
        }
    }, () => {
        showMessage('请求失败')
    })
}
// 添加事件
EventUtil.addHandler($('#submit-button')[0], 'click', registSubmit);
EventUtil.addHandler($('.layer-button')[0], 'click', hiddenMessage);


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