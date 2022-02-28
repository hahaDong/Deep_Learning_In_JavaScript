var hahaOCR = hahaOCR || {};

hahaOCR.prototype={
    init:function(){
        $("#optionPage").click(function() {
            window.close();
        });
        //给所有图片,带有clicker的全部加上鼠标滑动事件和点击事件
        $('body').on('.clicker', function() {
            var img_url = $(this).parent().nextAll().find('#res_img').data('url');

            if (img_url != '' && img_url != undefined && $(this).attr('data-url') != 1) {
                $(this).prop('src', img_url);
                $(this).attr('data-url', 1);
            }
        }).on("click", '.clicker', function() {
            $('#input').trigger('click');
        });

        //exit with ESC press
        $(document).keydown(function(event) {
            if (event.keyCode == 27) {
                window.close();
            }
        });
        //此处是手动选择文件
        $('#input').change(function() {
            var filesToUpload = document.getElementById('input').files;
            var img_file = [];
            for (var i = 0; i < filesToUpload.length; i++) {
                var file = filesToUpload[i];
                if (/image\/\w+/.test(file.type) && file != "undefined") {
                    img_file.push(file);
                }
            }
            var reader = new FileReader();
            var AllowImgFileSize = 2100000; //上传图片最大值(单位字节)（ 2 M = 2097152 B ）超过2M上传失败
            var imgUrlBase64;
            if (img_file) {
                //将文件以Data URL形式读入页面
                imgUrlBase64 = reader.readAsDataURL(file);
                reader.onload = function (e) {
                    if (AllowImgFileSize != 0 && AllowImgFileSize < reader.result.length) {
                        alert( '上传失败，请上传不大于2M的图片！');
                        return;
                    }else{
                        $.ajax({
                            type: 'post',
                            url: 'http://route.showapi.com/1274-2',
                            dataType: 'json',
                            data: {
                                "showapi_appid": '454633', //这里需要改成自己的appid
                                "showapi_sign": '9100c8dfb9444c0bae8726c1e53764c0',  //这里需要改成自己的应用的密钥secret
                                "base64":reader.result,
                            },
                            success: function(result) {
                                var res = result.showapi_res_body.texts[0];
                                console.log(res)
                                $("#exampleFormControlTextarea1").val(res)
                            }
                        });
                    }
                }
            }
            hahaOCR.prototype.getImageFile(img_file, filesToUpload.length);
        });
    },
    //上传完成或者出错时的处理
    uploadFinishEvent: function() {
        $('#uploadPlaceHolder').prop('src', '1x1.png');
        $('.clicker').css('border', 'none').css('background-color', 'transparent').css('box-shadow','none');
    },

    getImageFile: function(img_file, flag) {
        if (img_file.length > 0 && ($('.clicker:first').attr('src') != 'placeholder.png' || $('.clicker:last').attr('src') != 'placeholder2.png')) {
            hahaOCR.prototype.clearData();
        }
        for (var i = 0; i < img_file.length; i++) {
            var file = img_file[i];
            hahaOCR.prototype.previewAndUpload(file, i);
        }
    },
    //预览和上传
    previewAndUpload: function(file, i) {
        hahaOCR.prototype.uploadFinishEvent();
        $(".loader-wrap").show();
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function(e) {
            if (hahaOCR.prototype.is_batch != 1) {
                $('.single-model img').prop('src', '1x1.png');
                $('.single-model img').css('background-image', 'url(' + this.result + ')');
                $('.single-model img').css('background-position', 'center');
                $('.file-info').css('display', 'inline-block');
                if (file.name.length > 30) {
                    $("#fileName").text(file.name.substring(0, 8) + "..." + file.name.substring(file.name.length - 8, file.name.length));
                } else {
                    $("#fileName").text(file.name);
                }
                $("#fileSize").text((e.total / 1024).toFixed(2) + " kb");
            } else {
                $('#pic' + i).prop('src', '1x1.png');
                $('#pic' + i).css('background-image', 'url(' + this.result + ')');
                $('#pic' + i).css('background-position', 'center');
            }
        };
        reader.onloadend = function(e) {
            $(".loader-wrap").fadeOut("fast");
        };
    },
    clearData: function() {
        $('.clicker').removeAttr('style');
    }
};

$(function() {
    my = hahaOCR.prototype;
    my.init();
});
