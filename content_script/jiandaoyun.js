// 底部工具条
$('body').append(`
<div id="mask" style="display: none;position:fixed;bottom: 0;z-index:1000;height:100%;width:100%;
    line-height: 50%;text-align: center;background-color:rgba(0,0,0,0.55);">
    <span style="position: relative;top: 50%; color: #fff;font-size: 22px">正在扫描需要下载的数据...</span></div>
<div id="xzh-footbar-masker" style="position:fixed;right:0;bottom:0;left:0;z-index:998;height:64px;background-color:rgba(0,0,0,.75);"><div id="xzh-footbar-shower" style="background-color: rgba(0,0,0,.5);cursor: pointer;width: 16px;float:right;height: 60px;line-height: 60px;margin: 2px;color: #b6b6b6;"><svg viewBox="64 64 896 896" focusable="false" data-icon="left" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M724 218.3V141c0-6.7-7.7-10.4-12.9-6.3L260.3 486.8a31.86 31.86 0 000 50.3l450.8 352.1c5.3 4.1 12.9.4 12.9-6.3v-77.3c0-4.9-2.3-9.6-6.1-12.6l-360-281 360-281.1c3.8-3 6.1-7.7 6.1-12.6z"></path></svg></div></div>
<div id="xzh-footbar" style="z-index:999;position:fixed;right:20px;bottom:0;left:0;height:64px;overflow:hidden;outline:0;text-align:center;line-height:64px;">
    <div style="position:fixed;bottom: 0;z-index:998;height:50px;width:100%;
    line-height: 50px;text-align: center;"><button type="button" onclick="downLoadAll(false);" 
    class="get-info-button-style">下载全部数据</button></div>
</div>
`);
var footbar_width = $('#xzh-footbar-masker').width();
$('#xzh-footbar-shower').bind('click', function (e) {
  if ($('#xzh-footbar-masker').offset().left < 0) {
    $('#xzh-footbar').animate({ left: 0, right: 20 });
    $('#xzh-footbar-masker').animate({ left: 0, right: 0 });
    $(this)
      .find('svg path')
      .attr(
        'd',
        'M724 218.3V141c0-6.7-7.7-10.4-12.9-6.3L260.3 486.8a31.86 31.86 0 000 50.3l450.8 352.1c5.3 4.1 12.9.4 12.9-6.3v-77.3c0-4.9-2.3-9.6-6.1-12.6l-360-281 360-281.1c3.8-3 6.1-7.7 6.1-12.6z'
      );
  } else {
    $('#xzh-footbar').animate({ left: -footbar_width, right: footbar_width });
    $('#xzh-footbar-masker').animate({
      left: 20 - footbar_width,
      right: footbar_width - 20,
    });
    $(this)
      .find('svg path')
      .attr(
        'd',
        'M765.7 486.8L314.9 134.7A7.97 7.97 0 00302 141v77.3c0 4.9 2.3 9.6 6.1 12.6l360 281.1-360 281.1c-3.9 3-6.1 7.7-6.1 12.6V883c0 6.7 7.7 10.4 12.9 6.3l450.8-352.1a31.96 31.96 0 000-50.4z'
      );
  }
});
$('#xzh-footbar-shower').click();

let tableSorter = [
  '整体数据分析',
  '品类数据分析',
  '任务维度分析',
  // '人群纬度分析',
  '人群维度分析',
  '品牌数据分析-分人群',
  '品牌数据分析',
  '关键词数据分析',
  // '圈选行为分析',
  '圈选行为分析',
  '通道数据分析',
];

function downLoadAll(isReload) {
  // const tips = isReload
  //   ? '数据扫描不全，重新扫描...'
  //   : '正在扫描需要下载的数据...';
  $('#mask').show();

  // $('#mask span').html(tips);
  // 滚动区域长度
  var totalHeight = $('.fx-dash-layout').height();
  // 屏幕长度
  var clientHeight = document.body.clientHeight;
  var scollHeight = 50;
  // 需要滚动的次数
  let numbers = Number((totalHeight / clientHeight).toFixed(0));
  const isZero = totalHeight % clientHeight;
  numbers = isZero === 0 ? numbers : numbers + 1;
  // 进行下拉滚动加载数据
  new Promise((reslove, reject) => {
    for (let i = 0; i < numbers; i++) {
      (function (i) {
        setTimeout(() => {
          const heigth = i * clientHeight;
          $('.fx-dash-layout-container').scrollTop(heigth);
          if (i + 1 === numbers) {
            reslove(true);
          }
        }, i * 5000);
      })(i);
    }
  }).then((res) => {
    if (res) {
      // 处理数据
      setTimeout(() => {
        const tables = $('.table-wrapper');
        console.log('tables', tables.length);
        // if (tables.length !== 11) {
        //   downLoadAll(true);
        // } else {
        $('#mask').hide();
        const headers = $('.fx-dash-rich-text');
        const totalView = $('.fx-metric-view-2');
        // 表头个数等于headers个数
        const tableLength = [1, 1, 2, 4, 2, 1];
        let sliceNumber = 0;
        let newArr = [];
        let parents = [];
        tableSorter.forEach((item) => {
          for (let i = 0; i <= tables.length; i++) {
            const parent = $(tables[i]).parents('.fx-dash-container');
            const headerTitle = $(parent).find('.header-title').text();
            if (item == headerTitle) {
              if ($(parent).find('.x-pagination')) {
                const totalPageText = $(parent)
                  .find('.x-pagination .total-page')
                  .text()
                  .replace(/[\/]/g, '')
                  .trim();
                const totalPage = totalPageText && Number(totalPageText);
                console.log('totalPage', totalPage);
                let appendHtml = '';
                if (totalPage !== 1) {
                  const numbers = totalPage - 1;
                  for (let k = 0; k < numbers; k++) {
                    $(parent).find('.page-turn-next').click();
                    const tableCurrentContent =
                      $(parent).find('table tbody')[0];
                    appendHtml += tableCurrentContent.innerHTML;
                  }
                  $('.page-turn-first').click();
                  $(parent).find('table tbody').append(appendHtml);
                }
                $(parent).find('.x-pagination').remove();
                parents.push(...parent);
              }
            }
          }
        });

        // console.log('parents', parents);
        for (let i = 0; i < headers.length; i++) {
          let realTableLength = tableLength[i];
          const realTable = parents.slice(
            sliceNumber,
            realTableLength + sliceNumber
          );
          sliceNumber += realTableLength;
          if (i == 0) {
            newArr.push(headers[i], ...totalView, ...realTable);
          } else {
            newArr.push(headers[i], ...realTable);
          }
        }
        // console.log('newArr', newArr);
        var htmls = '';
        for (var i = 0; i <= newArr.length - 1; i++) {
          htmls += newArr[i] && newArr[i].outerHTML;
        }
        var tableName = '客户复盘数据';
        var exportFileContent =
          '<html xmlns:x="urn:schemas-microsoft-com:office:excel"><head><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>' +
          tableName +
          '</x:Name><x:WorksheetOptions><x:Print><x:ValidPrinterInfo /></x:Print></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml></head>' +
          htmls +
          '</html>';
        var blob = new Blob([exportFileContent], {
          type: 'text/plain;charset=utf-8',
        });
        blob = new Blob([String.fromCharCode(0xfeff), blob], {
          type: blob.type,
        });
        var link = window.URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.download = tableName + '.xls';
        a.href = link;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.location.reload();

        // 图导出部分 暂时注释掉
        // var chartArr = $('.fx-dash-chart');
        // let chartFlag = 0;
        // if (chartArr && chartArr.length > 0) {
        //   chartArr.each(async function (index, element) {
        //     await domtoimage.toPng(chartArr[index]).then((dataUrl) => {
        //       const title = $(this)
        //         .parents('.fx-dash-container')
        //         .find('.header-title')
        //         .text();
        //       htmls += `<div class="fx-dash-container dash-widget has-hover"
        //           data-source="_widget_1660386101934#62dfd52b2910e50007659a41@62d0c5e8fb06c500077ab520"
        //           style="background: rgb(0, 0, 255); top: 1737px; left: 20px; width: 526.667px; height: 320px;">
        //           <div class="container-header" style="color: rgb(31, 45, 61);">
        //               <div class="header-title">${title}</div>
        //           </div>
        //           <div class="container-content">
        //               <div class="fx-dash-chart"
        //               vancharts_index_="vancharts_index_1"
        //                   style="overflow: hidden;
        //                   width: 526.667px;
        //                   height: 320px;
        //                   user-select: none;
        //                   touch-action: manipulation;
        //                    -webkit-user-drag: none;
        //                    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);">
        //                   <img style=" width: 526.667px; height: 320px;" src="${dataUrl}" />
        //               </div>
        //           </div>
        //       </div>`;
        //       chartFlag += 1;
        //     });

        //     if (chartFlag == chartArr.length) {
        //       var tableName = '客户复盘数据';
        //       var exportFileContent =
        //         '<html xmlns:x="urn:schemas-microsoft-com:office:excel"><head><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>' +
        //         tableName +
        //         '</x:Name><x:WorksheetOptions><x:Print><x:ValidPrinterInfo /></x:Print></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml></head>' +
        //         htmls +
        //         '</html>';
        //       var blob = new Blob([exportFileContent], {
        //         type: 'text/plain;charset=utf-8',
        //       });
        //       blob = new Blob([String.fromCharCode(0xfeff), blob], {
        //         type: blob.type,
        //       });
        //       var link = window.URL.createObjectURL(blob);
        //       var a = document.createElement('a');
        //       a.download = tableName + '.xls';
        //       a.href = link;
        //       document.body.appendChild(a);
        //       a.click();
        //       document.body.removeChild(a);
        //     }
        //   });
        // }
        // }
      }, 5000);
    }
  });
}
