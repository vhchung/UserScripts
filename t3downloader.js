// ==UserScript==
// @id           chung.k54thb@gmail.com
// @name         TruyenTranhTuan downloader
// @namespace    http://kiemtruyen.net/
// @description  Tải truyện từ truyentranhtuan.com. Mỗi chương được lưu vào một thư mục riêng.
// @version      1.1.10
// @icon         https://apprecs.com/ios-meta/app-icons/256/951622767.jpg
// @author       chungvh
// @license      MIT
// @icon         https://apprecs.com/ios-meta/app-icons/256/951622767.jpg
// @match        http://truyentranhtuan.com/*/
// @require      https://code.jquery.com/jquery-2.2.4.min.js
// @require      https://greasyfork.org/scripts/18532-filesaver/code/FileSaver.js?version=128198
// @noframes
// @connect      truyentranhtuan.com
// @supportURL   https://github.com/vhchung/Userscript/issues
// @run-at       document-idle
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(function ($, window, document, undefined) {

    'use strict';

    function downloadFail(url) {

        console.log('%cError: ' + url, 'color:red;');
        $download.text('Resume...').css('background', 'red');
        disableClick = false;

    }

    function downloadComplete() {

        var skipSize = skip.length,
            blob,
            fileName = path.slice(1, -1) + '_' + begin + '-' + end + '.htm';

        txt = '<html><head><meta http-equiv="Content-Type" content="text/html; charset=utf-8"></head><body><h1><font color="red">' + $('h1').text() + '</font></h1><h3><font color="blue">' + $('#poster p:eq(3)').text() + '</font></h3><h3><font color="green">' + $('#poster p:eq(4)').text() + '</font></h3><h3><font color="gray">Tổng số chương: ' + (end - begin - skipSize + 1) + '</font></h3><br><br>' + credits + '<br><br><br>' + txt + '</body></html>';

        blob = new Blob([txt], {
            type: 'text/html'
        });

        $download.attr({
            href: window.URL.createObjectURL(blob),
            download: fileName
        }).text('Download Finished!').css('background', 'green').off('click');

        if (skipSize) {
            console.log('%cLinks skipped: ' + skip.join(','), 'color:orange;');
        }

        console.log('%cDownload Finished!', 'color:blue;');

        saveAs(blob, fileName);

    }

    function getChapter() {

        if (count > max) {

            if (complete) {
                downloadComplete();
            } else {

                enablePrompt = true;
                disableClick = false;
                $download.text('Nothing!').css('background', 'red');
                console.log('%cNothing!', 'color:red;');

            }

            $(window).off('beforeunload');

        } else {

            url = path + 'chuong-' + count;

            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                onload: function (response) {

                    var $data = $(response.responseText),
                        title = $data.find('h2.text-muted').html(),
                        $chapter = $data.find('.chapter');

                    if ($chapter.length) {

                        $download.text(count + '/' + max).css('background', 'orange');

                        if (response.finalUrl.slice(-8) === '/chuong/') {

                            $download.css('background', 'black');
                            console.log('%cSkip: ' + url, 'color:orange;');
                            skip.push(count);
                            ++count;
                            getChapter();
                            return;

                        }

                        console.log('%cComplete: ' + url, 'color:green;');
                        ++count;
                        ++complete;

                    } else {
                        downloadFail(url);
                    }

                    $chapter.find('font, p:last').remove();
                    txt += '<h2 class="title">' + title + '</h2>' + $chapter.html();

                    getChapter();

                },
                onerror: function (err) {

                    downloadFail(url);
                    console.error(err);

                }
            });

        }

    }

    // replace div#rating by Download button
    var $download = $('#rating'),
        count = 1,
        max = parseInt($('#manga-chapter').find('.chapter-name').eq(0).find('a').attr('href').match(/chuong-(\d+)/)[1], 10),
        begin,
        end,
        skip = [],
        txt = '',
        enablePrompt = true,
        disableClick = false,
        complete = 0,
        path = location.pathname,
        url,
        credits = '<p>Truyện được tải từ: TruyenTranhTuan - http://truyentranhtuan.com</p><p>Userscript được viết bởi: chugnvh - http://kiemtruyen.net</p>';

    window.URL = window.URL || window.webkitURL;

    $download.text('Download').css('background', 'orange').on('click', function (e) {

        e.preventDefault();

        if (disableClick) {
            return;
        }

        if (enablePrompt) {

            begin = prompt('Chọn Chương bắt đầu tải', count);
            end = prompt('Chọn Chương kết thúc tải', max);

            if (begin !== null && /^\d+$/.test(begin)) {
                begin = parseInt(begin, 10);
                count = begin;
            } else {
                begin = count;
            }

            if (end !== null && /^\d+$/.test(end)) {
                end = parseInt(end, 10);
                if (end > count) {
                    max = end;
                } else {
                    max = count;
                    end = count;
                }
            } else {
                end = max;
            }

            $(window).on('beforeunload', function () {
                return 'Truyện đang được tải xuống...';
            });

            enablePrompt = false;

        }

        getChapter();

        disableClick = true;

    });

})(jQuery, window, document);
