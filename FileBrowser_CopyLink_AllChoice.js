// ==UserScript==
// @name         FileBrowser 增加 批量复制下载地址和全选
// @namespace    https://github.com/jahem/FileBrowser_CopyLink_AllChoice.git
// @version      0.2
// @description  FileBrowser 增加 批量复制下载地址和全选
// @author       jahem
// @match        http://*/*
// @grant        none
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @include     *://*/*
// ==/UserScript==

(function () {
    'use strict';
  
    var log = console.log;
    /**
     * 复制内容到剪切板
     * @param {*} text 要复制的内容，
     * @param {*} callback 回调
     */
    var copyText = function (text, callback) {
      var tag = document.createElement('textarea');
      tag.setAttribute('id', 'cp_hgz_input');
      tag.value = text;
      document.getElementsByTagName('body')[0].appendChild(tag);
      document.getElementById('cp_hgz_input').select();
      document.execCommand('copy');
      document.getElementById('cp_hgz_input').remove();
      if (callback) {
        callback(text)
      }
    }
    /**
     * 浮窗提示
     * @param {*} text 
     */
    var float_alert = function (text) {
      var float_alert = $(top.document.body).find("#float_alert");
      if (float_alert.length > 0) {
        float_alert.remove();
      }
      var html = "";
      html += '<div id="float_alert" style="border-radius: 10px;position:fixed;bottom:0;right:0;background:#fff;border:1px solid #ccc;height:50px;line-height:50px;min-width:150px;text-align:center;width:auto;padding:0 20px;">';
      html += '<span style="font-weight:bold;">' + text + '</span>';
      html += '</div>';
      $(top.document.body).append(html);
      setTimeout(function () {
        float_alert.animate({
          height: 0
        });
      }, 1000);
      setTimeout(function () {
        float_alert.remove();
      }, 1500);
    }
    /**
     * 添加按钮
     */
    var addButton = function () {
      var html = "";
      html += '<button aria-label="全选" title="全选" id="all-choice" class="action" style="">';
      html += '<i class="material-icons">done_all</i><span>全选</span>';
      html += '</button>';
      html += '<button aria-label="复制下载链接" title="复制下载链接" id="copy-link-button" class="action" style="">';
      html += '<i class="material-icons">attachment</i><span>复制下载链接</span>';
      html += '</button>';
      $("#dropdown").append(html);
    }
    /**
     * 复制下载链接
     */
    var copyLink = function () {
      var down_link = "";
      $("[aria-selected=true]").each(function (k, v) {
        var file_name = $(this).attr("aria-label");
        var auth = window.localStorage.getItem("jwt");
        var href = window.location.href;
        var data_dir = $(this).attr("data-dir");
        var host = href.replace('files', 'api/raw');
        if (data_dir == true) {
          down_link += host + file_name + "?algo=zip&auth=" + auth + "\n";
        } else {
          down_link += host + file_name + "?auth=" + auth + "\n";
        }
      });
      if (down_link == "") {
        float_alert("请选择下载文件后再复制");
      } else {
        copyText(down_link, function () {
          float_alert('复制成功');
        })
      }
    }
  
    $(function () {
      log("FileBrowser 增加 批量复制下载地址和全选 -- start");
      var name = $(".credits a").eq(0).text();
      // 判断是否是File Browser
      if (name == "File Browser") {
        addButton();
      }
      // 添加复制下载链接按钮点击事件
      $(document).on('click', '#copy-link-button', function () {
        copyLink();
      });
      // 添加全选按钮点击事件
      $(document).on('click', '#all-choice', function () {
        if (!$(".list").hasClass("multiple")) {
          $("[title='选择多个']").trigger("click");
          $("#multiple-selection").hide();
          $(".list .item").not(".header").each(function (k, v) {
            $(this).trigger("click");
          });
        } else {
          $("[title='清空']").trigger("click");
          $(".list .item").not(".header").each(function (k, v) {
            $(this).trigger("click");
          });
        }
      });
      log("FileBrowser 增加 批量复制下载地址和全选 -- end");
    });
  })();