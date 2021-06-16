// ==UserScript==
// @name         FileBrowser 增加 批量复制下载地址和全选
// @namespace    https://github.com/jahem
// @version      0.1
// @description  FileBrowser 增加 批量复制下载地址和全选
// @author       jahem
// @match        http://*/*
// ==/UserScript==

/**
 * 复制内容到剪切板
 * @param {type} text 要复制的内容，
 * @param {type} callback 回调
 */
function copyText(text, callback){ 
    var tag = document.createElement('textarea');
    tag.setAttribute('id', 'cp_hgz_input');
    tag.value = text;
    document.getElementsByTagName('body')[0].appendChild(tag);
    document.getElementById('cp_hgz_input').select();
    document.execCommand('copy');
    document.getElementById('cp_hgz_input').remove();
    if(callback) {callback(text)}
}

(function() {
    //加载jq，比较方便
    var script=document.createElement("script"); 
    script.type="text/javascript"; 
    script.src="http://cdn.staticfile.org/jquery/2.0.0/jquery.min.js"; 
    document.getElementsByTagName('head')[0].appendChild(script); 

    //添加按钮
    var addButton = function() {
        var html = "";
        html += '<button aria-label="全选" title="全选" id="all-choice" class="action" style="">';
        html += '<i class="material-icons">done_all</i><span>全选</span>';
        html += '</button>';
        html += '<button aria-label="复制下载链接" title="复制下载链接" id="copy-link-button" class="action" style="">';
        html += '<i class="material-icons">attachment</i><span>复制下载链接</span>';
        html += '</button>';
        $("#dropdown").append(html);
    };
    //复制下载链接
    var copyLink = function(){
        var down_link = "";
        $("[aria-selected=true]").each(function(k,v){
            var file_name = $(this).attr("aria-label");
            var auth = window.localStorage.getItem("jwt");
            var href = window.location.href;
            var data_dir = $(this).attr("data-dir");
            var host = href.replace('files','api/raw');
            if(data_dir == true){
                down_link += host + file_name + "?algo=zip&auth=" + auth + "\n";
            }else{
                down_link += host + file_name + "?auth=" + auth + "\n";
            }
        });
        if(down_link == ""){
            alert("请选择下载文件后再复制");
        }else{
            copyText(down_link, function (){alert('复制成功')})
        }
    }
    //jq异步加载，0.5秒后执行
    window.setTimeout(function(){
        var name = $(".credits a").eq(0).text();
        if(name == "File Browser"){
            addButton();
        }
        $(document).on('click', '#copy-link-button', function()
        {
            copyLink();
        });
        $(document).on('click', '#all-choice', function()
        {
            if(!$(".list").hasClass("multiple")){
                $("[title='选择多个']").trigger("click");
                $("#multiple-selection").hide();
                $(".list .item").not(".header").each(function(k,v){
                    $(this).trigger("click");
                });
            }
            else{
                $("[title='清空']").trigger("click");
                $(".list .item").not(".header").each(function(k,v){
                    $(this).trigger("click");
                });
            }
        });
    },500);
})();

