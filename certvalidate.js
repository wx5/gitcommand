<script src="js/jquery.form.min.js" type="text/javascript"></script>
<script>
(function setError(window){
    return window.onerror=function(err,line,file) {
        return error([err,line,file].join('<br/>'));
    };
})(window);
function asyncSubmit($form, successJumpUrl) {
    if($.fn.ajaxSubmit) {
        $form.ajaxSubmit({
            url: $form.prop('action'),
            type: $form.prop('method') || 'post',
            dataType: 'json',
            data: $form.serialize(),
            success: function(json,status,xhr) {
                if($.type(json)=='string') {
                    try{
                        json=JSON.parse(json);
                    }catch(e){
                        document.write(xhr.responseText);
                    }
                }
                if(json.status){
                    success(json.msg);
                    window.setTimeout(function(){
                        window.location.assign(successJumpUrl);
                    }, 3000);
                }else{
                    error(json.msg);
                }
            }
        });
    }else{
        var alert = myAlert || window.alert;
        alert('请先加载 jquery.form 插件.官方网址 http://malsup.com/jquery/form/ ');
    }
}
</script>

<script>
function trim(msg) {
    return $.trim(msg);
}
function checkPhone(num) {
    var regex=/^(0|86|17951)?(13[0-9]|15[012356789]|17[013678]|18[0-9]|14[57])[0-9]{8}$/;
    if(regex.test(num)) {
        return [true];
    }else{
        return [false, '手机号码格式错误!'];
    }
} 
function checkCard(code) {
    var city={11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙江 ",31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",42:"湖北 ",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏 ",61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外 "};
    var tip = "";
    var pass= true;
    
    if(!code || !/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[12])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test(code)){
        tip = "身份证号格式错误!";
        pass = false;
    }
    else if(!city[code.substr(0,2)]){
        tip = "身份证号地址编码错误!";
        pass = false;
    }
    else{
        //18位身份证需要验证最后一位校验位
        if(code.length == 18){
            code = code.split('');
            //∑(ai×Wi)(mod 11)
            //加权因子
            var factor = [ 7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2 ];
            //校验位
            var parity = [ 1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2 ];
            var sum = 0;
            var ai = 0;
            var wi = 0;
            for (var i = 0; i < 17; i++)
            {
                ai = code[i];
                wi = factor[i];
                sum += ai * wi;
            }
            var last = parity[sum % 11];
            if(parity[sum % 11] != code[17]){
                tip = "身份证号码校验位错误!";
                pass =false;
            }
        }
    }
    if(pass) {
        return [true];
    }else{
        return [false,tip];   
    }
}
function getBirthdayFrom(cardid) {
    var birth=cardid.slice(6, 14);
    birthday=birth.slice(0,4)+'-'+birth.slice(4,6)+'-'+birth.slice(6); 
    return birthday;   
}
function getAgeFrom(birthday) {
    var minutes = 1000 * 60;
    var hours = minutes * 60;
    var days = hours * 24;
    var years = days * 365;
    var ageMseconds = Date.now() - Date.parse(birthday);
    return ageMseconds/years;
}
function checkAge(code) {
    var ret=checkCard(code);
    if(ret[0]) {
        var birthday=getBirthdayFrom(code);
        var age=getAgeFrom(birthday);
        if(age < 18 || age > 65) {
            return [false, '身份证年龄太小或太大!']
        }else{
            return [true];
        }
    }else{
        return [true];
    }
}
function checkCardPic() {
    var pass=true;
    $('.cardpic').each(function(){
        if(!trim($(this).prop('src'))) {
            pass = false
        }
    });
    if(pass) {
        return [true];
    }else{
        return [false,'请选择身份证照片!'];
    }
}
function checkDate() {
    var pass=true,tip='';
    if(!trim($('#d1').val())) {
        tip = '请选择身份证办证日期!';
        pass = false;
    }
    else if(!trim($('#d2').val())) {
        tip = '请选择身份证有效期截止日期!';
        pass = false;
    }
    if(pass) {
        return [true];
    }else{
        return [false,tip];
    }
}
function tips() {
    var tips=[];
    var cardid=trim($("#card_id").val());
    var phone=trim($("#leader_phone").val());
    var actions=[
        checkCardPic(),
        checkCard(cardid),
        checkAge(cardid),
        checkDate(),
        checkPhone(phone),
    ];
    actions.forEach(function(ret){
        if(!ret[0]) {
            tips.push('<p style="color:red;">'+ret[1]+"<p>");
        }
    });
    
    return tips;
}

// window.createObjectUrl
// window.URL.createObjectUrl
// window.webkitURL.createObjectUrl
function getObjectURL(file) { 
    var url = null ;
    if (window.createObjectURL!=undefined) { // basic
        url = window.createObjectURL(file) ;
    } else if (window.URL!=undefined) { // mozilla(firefox)
        url = window.URL.createObjectURL(file) ;
    } else if (window.webkitURL!=undefined) { // webkit or chrome
        url = window.webkitURL.createObjectURL(file) ;
    }
    return url ;
}

function reverseCount(start, tag, jump) {
    $(tag).html(start);
    if(--start < 0) {
        location.assign(jump);
    } 
    window.setTimeout(function(){
        return reverseCount(start, tag, jump);
    },  1000);
}
    
$(".upload").on("change",function(){
    var objUrl = getObjectURL(this.files[0]) ; //获取图片的路径，该路径不是图片在本地的路径
    if (objUrl) {
        $(this).prev().prop("src", objUrl) ; //将图片路径存入src中，显示出图片
    }
});

$("#submit").on("click",function(){
    var errors=tips();
    if(errors.length>0) {
        error(errors.join(''));
        return false;
    }else{
        //$(this).colsest('form').submit();
    }
})

$("#d2").prop("min",$("#d1").val()); // 截止日期的最小值
$("#d1").on("change",function(){
    $("#d2").prop("min",$("#d1").val());
});

</script>