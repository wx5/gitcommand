/**
* 弹窗组件 hx
* 
* 主要方法:
*     window[_ns_].alert(msg)
*     window[_ns_].success(msg) window[_ns_].error(msg)
*     window[_ns_].confirm(_title, callback)
*     window[_ns_].open(options)
*     window[_ns_].getForm(_title, _url)
*     window[_ns_].get(_url)
*     window[_ns_].loading() 加载提示...覆盖整个页面
*     window[_ns_].loadingLeave() 取消加载提示...
* 
* 依赖组件：jQuery.min.js
*          layui.layer.com/layer.js 
*          layui.layer.com/skin/default/layer.css
*/

// namespace
var _ns_='hx';

// init
window[_ns_]={};
window[_ns_].loadflag=0;
window[_ns_].defautWinArea=['960px', '680px'];
window[_ns_].dialog=layer; 
layer=null;

/**
 * commonAlert
 * 
 * @access private
 * @return [object Function]
*/
window[_ns_].commonAlert=function(msg, icon, callback){
    var icons={'normal':-1, 'success':1, 'error':2};
    return window[_ns_].dialog.alert(msg,{
        icon: icons[icon] || 0,
        title: '',
        anim: 5,
        zIndex: window[_ns_].dialog.zIndex,
        closeBtn: 2,
    },callback);
};

// 普通弹窗
window[_ns_].alert=function(msg) {
    return window[_ns_].commonAlert(msg, 'normal');
};
// 成功提示框
window[_ns_].success=function(msg) {
    return window[_ns_].commonAlert(msg, 'success');
};
// 错误提示框
window[_ns_].error=function(msg) {
    return window[_ns_].commonAlert(msg, 'error');
};
// 确认框 
window[_ns_].confirm=function(msg, callback){
    return window[_ns_].dialog.confirm(msg, {
            icon: 3, 
            anim: 5,
            title: '',
            zIndex: window[_ns_].dialog.zIndex,
            closeBtn: 2,            
            yes: function(index, dom) {
                window[_ns_].dialog.close(index);
                if(toString.call(callback) === '[object Function]') {
                    callback.call(null);
                }else{
                    window[_ns_].alert('您点击了确定按钮。此处可添加回调函数。');
                }
            },
    });
};

// 全屏的加载提示
window[_ns_].loading = function() {
    window[_ns_].loadingLeave();
    window[_ns_].loadingflag = window[_ns_].dialog.load(1, {zIndex: window[_ns_].dialog.zIndex});
};

// 解除全屏的加载提示
window[_ns_].loadingLeave = function() {
    return window[_ns_].dialog.close(window[_ns_].loadingflag);
};


// 当前页面直接打开链接 
window[_ns_].jump=function(_jurl) {
    return window.location.assign(_jurl);
};

// 解析json
window[_ns_].jsonParse=function(json) {
    if($.type(json) === 'string') {
        try{
            return JSON.parse(json);
        }catch(except){
            console.log(except);
            return {
                status: 'jsonError',
                msg: 'Whoop, JSON 解析出错.',
            };
        }
    }else{
        return json;
    }
};

// 成功返回处理
// 出错提示
// 成功提示

window[_ns_].ajaxSuccessHandler=function(json,status,xhr) {
    window[_ns_].loadingLeave();
    var response = window[_ns_].jsonParse(json);
    if(response) {
        switch(response.status) {
            case 'success':
                // 返回成功的提示信息 
                // 后台代码 json_encode(['success'=>true, 'msg'=>'操作成功！'])
                return window[_ns_].success(response.msg, function(index){
                    window[_ns_].dialog.closeAll();
                    if(response.reload) {
                        window.location.reload();
                    }
                });

            case 'error':
                // 返回错误的提示信息
                return window[_ns_].error(response.msg);

            case 'jsonError':
                // 当json解析出错
                return window[_ns_].open({
                    title: response.title,
                    html: xhr.responseText,
                });

            default:
                // 返回异常页面
                return window[_ns_].open({
                    title: 'unknow error', 
                    html: response, 
                });
        }
    }else{
        return window[_ns_].open({
            title: 'unknow error', 
            html: response,
        });
    }
};

window[_ns_].setDefaultCallback=function($, window) {
    return window[_ns_].setErrorHandler($, window);
};

// 错误处理函数
window[_ns_].setErrorHandler=function($, window) {
    // 处理ajax错误
    (function setupAjaxError() {
        return $.ajaxSetup({
            error: function(xhr, status, err) {
                window[_ns_].open({
                    title: err,
                    html: xhr.responseText,
                });
            }
        });
    })($);
    // 处理window页面错误 
    (function setupWindowError() {
        return window.onerror=function(msg,url,line) {
            var html=['<div style="padding: 25px;color:red;font-size:14px;">',
                    '错误信息：', msg, '!<br/>',
                    '出错页面：', url, '<br/>',
                    '出错的行：', line, 
                    '</div>'].join('');
            window[_ns_].open({
                title: window.location.host+'出错: ',
                html:  html, 
                area:  ['550px','250px'], 
            });
        }
    })(window);
};

/** 
* @param array area 宽高设定数组,像 ['960px','680px']
* @param shade 遮罩设置 无遮罩设为0或false，有遮罩设定透明度如 0.3
* @param shadeClose 是否允许点击遮罩区域关闭窗口 取值  true 或 false
    var option = {
        title: title,
        html: html,
        area: area,
        shade: shade,
        shadeClose: shadeClose,
        anim: 1 // 动画效果 0-6 取消是 -1
        loading: loading, // window[_ns_].loading() 传回的值
    };        
*/
window[_ns_].open = function(option) {
    if(typeof option != 'object') {
        window[_ns_].error('window[_ns_].open 参数错误：非对象字面量。<br/>正确形参：{title:"string", html:"html code.", ...}');
        console.log('window[_ns_].open参数非对象字面量', option);
        return false;
    }
    if(!option.title) {
        window[_ns_].error('window[_ns_].open 参数错误：无标题。');
        return false;
    }
    if(!option.html) {
        window[_ns_].error('window[_ns_].open 参数错误：无内容。');
        return false;
    }

    window[_ns_].loading();

    return window[_ns_].dialog.open({
        type: 1, // 0（信息框，默认）1（页面层）2（iframe层）3（加载层）4（tips层）
        title: option.title,
        closeBtn: 2,
        shade: option.shade || 0.3,   // 不显示遮罩  若显示使用透明度如 shade: 0.5,        
        // shadeClose: false, // 点击遮罩区域却不关闭窗口，必须点击x按钮。
        maxmin: false, //开启最大化最小化按钮
        zIndex: window[_ns_].dialog.zIndex, // 层叠顺序跟css z-index取值相同
        offset:'auto', // ['100px','500px'], 默认auto 是垂直水平居中
        area: option.area || window[_ns_].defautWinArea,  // 面积 默认auto 是自适应 但对iframe层无效 
        // time: 3000, //自动关闭的设置 以毫秒为单位 */
        fixed: true, //当鼠标滚动时，是否固定显示的设置
        resize: true, // 是否允许拉伸
        anim: option.anim || 5, // 动画 1 缩放 2 上划 3 右划放大 4 右翻而出 5 淡入淡出 6 左右抖动

        // 当type=1时，content内容是实际html内容,即content是html代码。
        // 当type=2时，content内容是url指向页面内容,即content是一个链接地址。此时不必有html参数是一个url
        content: option.html,
        success: function() {
            window[_ns_].loadingLeave();
        },
    });     
}

/**
  * Post formdata and Get prompts returned and Popup
  * 
  * ajax 提交动态表单数据
  * json 数据回传 提示信息
  * 信息弹窗
  * 
  * @param $ jqFormObj
  * @uses $.ajax()
  * 
*/
window[_ns_].postForm = function(jqFormObj) {
    window[_ns_].loading();
    $.ajax({
        url: jqFormObj.prop('action'), 
        type: 'post',
        dataType: 'json',
        data: jqFormObj.serialize(),
        success: window[_ns_].ajaxSuccessHandler
    });            
};

/**
 * Get formhtml and Popup
 * 
 * @uses $.get()
*/
window[_ns_].getForm = function(_title, _url) {
    window[_ns_].loading();
    return $.get(_url, function(_html){
        window[_ns_].loadingLeave();
        return window[_ns_].open({
            title: _title,
            html: _html,
        });
    });
};

window[_ns_].getObjectURL = function(file) {
    var url = null ;
    if (window.createObjectURL!=undefined) { // basic
        url = window.createObjectURL(file) ;
    } else if (window.URL!=undefined) { // mozilla(firefox)
        url = window.URL.createObjectURL(file) ;
    } else if (window.webkitURL!=undefined) { // webkit or chrome
        url = window.webkitURL.createObjectURL(file) ;
    }
    return url ;
};

window[_ns_].showBigPic = function(width,height,src) {
    var width=width+'px';
    var height=height+'px';
    var html_content = '<img src="' + src + '" style="width:'+width+';height:'+height+';" />';
    layer.open({
        type: 1,
        title: false,
        skin: 'layui-layer-rim', //加上边框
        area: [width, height], //宽高
        content: html_content
    });
};

window[_ns_].myReject = function(title, callback) {
    var title = title || '输入拒绝原因，并确认';
    layer.prompt({title: title, formType: 2}, function(text, index){
        layer.close(index);
        callback(text);
    });
}

/**
 * @uses $.get()
*/
window[_ns_].delete = function(_url) {
    window[_ns_].loading();
    return $.get(_url, window[_ns_].ajaxSuccessHandler);
};

/**
 * @todo image clip
 * @todo 
*/
window[_ns_].imgclip = function() {
    // ...
}

/**
 * @todo upload
 * @todo 
*/
window[_ns_].upload = function() {
    // ...
}

/**
 * @todo lazyload
 * @todo 
*/
window[_ns_].lazyload = function() {
    // ...
}


window[_ns_].listenOsforgeModal = function(area) {
    var errors=[];
    if(!$.fn.validationEngine) {
        errors.push('请先加载validationEngine插件。');
    }
    if(!$.fn.ajaxSubmit) {
        errors.push('请先加载jquery.form.js插件。');
    }
    if(!layer){
        errors.push('请先加载layer插件。');
    }
    if(errors.length > 0) {
        alert(errors.join('\n'));
        return false;
    }
    // @@'data-href'
    $('body').on('click','.osforge-modal [data-href]',function(){
        var _url_=$(this).attr('data-href');
        if($(this).attr('single') == 'single') {
            layer.closeAll();
        }else{
            _ns_.loading=layer.load(1);
        }           
        // response.title
        // response.html
        $.get(_url_,function(response,status,xhr){
            layer.close(_ns_.loading);
            
            response=jsonParse(response);
            if(!response.jsonError) {
                pop(response.title,response.html);
            }else{
                pop('json error',xhr.responseText);
            }
        });
        return false;
    });
    // @@form
    $('body').on('click','.osforge-modal .osforge-button-submit',function(){
        var _form=$(this).closest('form');
        var _pass=_form.validationEngine('validate');
        if(_pass) {
            asyncSubmit(_form,function(){
                layer.closeAll();
            });
            return false;
        }else{
            return false;
        }
    });          
    // @@'data-tag'
    $('body').on('click','.osforge-modal [data-tag]',function(){
        var _tag_=$(this).attr('data-tag');
        var title=$(this).attr('data-title');
        var html=$(_tag_);
        // data-tag
        // data-title
        pop(title,html);
        return false;
    });
}




/**
  *  @todo 客户端代码
  *  @todo 待移出
  *   
  *  @depends <form type="post" action="has an acton">
  *  @depends {{ csrf_field() }}
  *  @depends <button type="button" class="hxDialogSubmit">提交</button> 
  *  @uses $('.hxDialogSubmit').closest('form)
  *
  *  @depends validationEngine.js
  *  
  *  注册动态表单提交按钮的点击事件
  *  注册提交动态表单事件
  *  jquery.validationEngine 前端表单验证          
*/
window[_ns_].listenDialogFormSubmit = function() {
    // 动态插入的表单提交按钮必须有这个类的名称
    $('body').on('click', '.hxDialogSubmit', function(){
        var _self = $(this);
        var _form = _self.closest('form');
        // 字段验证处理
        var valid=_form.validationEngine('validate');
        if(valid){
            return window[_ns_].postForm(_form);
        }else{
            //return window[_ns_].error('验证不通过！');
            return false;
        }
    });

    return false;
}

/**
 * @todo 客户端代码
 * @todo 待移出
*/
window[_ns_].setDefaultCallback(jQuery, window);
window[_ns_].listenDialogFormSubmit();
