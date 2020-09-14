(function (factory) {
  typeof define === 'function' && define.amd ? define(factory) :
  factory();
}((function () { 'use strict';

  function styleInject(css, ref) {
    if ( ref === void 0 ) ref = {};
    var insertAt = ref.insertAt;

    if (!css || typeof document === 'undefined') { return; }

    var head = document.head || document.getElementsByTagName('head')[0];
    var style = document.createElement('style');
    style.type = 'text/css';

    if (insertAt === 'top') {
      if (head.firstChild) {
        head.insertBefore(style, head.firstChild);
      } else {
        head.appendChild(style);
      }
    } else {
      head.appendChild(style);
    }

    if (style.styleSheet) {
      style.styleSheet.cssText = css;
    } else {
      style.appendChild(document.createTextNode(css));
    }
  }

  var css_248z = ".kkpager_parent_box{height:30px;line-height:30px;border:1px solid #ddd;border-radius:3px!important;padding:0 10px;background:#fff;color:#636363}.kkpager_parent_box,.kkpager_parent_box .pageBtnWrap{display:inline-block}.kkpager_parent_box .pageBtnWrap a{float:left;padding:0 5px;margin:0 5px;line-height:30px;cursor:pointer;text-decoration:none;color:#909090}.kkpager_parent_box .pageBtnWrap a:hover{color:#00b5e9}.kkpager_parent_box .pageBtnWrap .curr{float:left;padding:0 10px;height:38px;line-height:38px;margin:-8px 5px 0;background:#00b5e9;color:#fff;-moz-border-top-left-radius:3px;border-top-left-radius:3px;-moz-border-top-right-radius:3px;border-top-right-radius:3px}.kkpager_parent_box .pageBtnWrap .disabled{display:none}.kkpager_parent_box .infoTextAndGoPageBtnWrap{display:inline-block;vertical-align:top}.kkpager_parent_box .infoTextAndGoPageBtnWrap .totalText{float:left;font-size:12px}.kkpager_parent_box .infoTextAndGoPageBtnWrap .totalText .currPageNum{color:#ff5252}.kkpager_parent_box .infoTextAndGoPageBtnWrap .goPageBox{float:left;font-size:12px;padding-right:40px;position:relative}.kkpager_parent_box .infoTextAndGoPageBtnWrap .goPageBox .kkpager_btn_go{position:absolute;right:0;top:0;border:none;background:none;color:#00b5e9;cursor:pointer;width:40px;height:30px;line-height:30px;outline:none}.kkpager_parent_box .infoTextAndGoPageBtnWrap .goPageBox .kkpager_btn_go:focus{border:none}.kkpager_parent_box .infoTextAndGoPageBtnWrap .goPageBox .kkpager_btn_go_input{display:inline-block;width:40px;border:1px solid #ccc;text-align:center;color:#909090;border-radius:3px!important;outline:none}.kkpager_parent_box .infoTextAndGoPageBtnWrap .goPageBox .kkpager_btn_go_input:focus{border:1px solid #00b5e9}";
  styleInject(css_248z);

  var win;
  if (typeof window !== "undefined") {
      win = window;
  }
  else if (typeof global !== "undefined") {
      win = global;
  }
  else if (typeof self !== "undefined") {
      win = self;
  }
  else {
      win = {};
  }
  var window$1 = win;

  ///<reference path="../indexModel.d.ts" />
  /**
   * 获取或判断任意数据类类型的通用方法
   * @param {any} any 任意数据
   * @example
   * var aa=null;
   * getDataType(aa);
   * var abc;
   * getDataType(abc); //[object Undefined] 说明此变量已经声明，但尚未被初始化
   * var fn=function(){}
   * getDataType(fn); //[object Function]
   * getDataType(new Object()); //[object Object]
   * getDataType("Hello");//[object String]
   * getDataType(234);//[object Number]
   * getDataType(true));//[object Boolean]
   * getDataType(new Date()); //[object Date]
   * getDataType(new Date().getTime()); //[object Number]
   * getDataType(document.getElementById("demopic")); //[object HTMLDivElement]
   * getDataType(document.querySelector('div'));//[object HTMLDivElement]
   * var nodelist=NodeListToArray(document.getElementsByTagName("*"));
   * getDataType(nodelist); //[object Array]
   * getDataType(document.getElementsByTagName("*")); //[object NodeList)]
   * getDataType(document.querySelectorAll('div')); //[object NodeList)]
   * //nodelist[10].tagName);
   * getDataType(/[a-z]/); //[object RegExp]
   */
  function getDataType(any) {
      /* (1) Object.prototype.toString.call 方法判断类型：
      优点：通用，返回"[object String]" 具体object的类型
      缺点：不能返回继承的类型
      
      (2)typeof x
      缺点：对object类型不能细分；
      优点：对空null的判断 'undefined'的应用;
      返回类型有：'undefined' “string” 'number' 'boolean' 'function' 'object'
      
      (3) instanceof 能返回具体的类型，只适用于用new关键字创建的对象进行判断
      */
      // var baseType=["string","number","boolean"];//基本类型
      // var refType=["object", "Function","Array","Date"];//引用类型
      try {
          var dtype = Object.prototype.toString.call(any);
          if (dtype == "[object Object]") //IE，某个dom元素对象
           {
              try {
                  if (any.constructor) {
                      var constructorStr = any.constructor.toString(); //obj.constructor可以返回继承的类型
                      if (constructorStr.indexOf("Array") != -1) {
                          dtype = "[object Array]";
                      }
                      else if (constructorStr.indexOf("HTMLCollection") != -1) { /* IE */
                          dtype = "[object NodeList]";
                      }
                      else if ((constructorStr.indexOf("function") != -1) && (constructorStr.indexOf("Object()") != -1)) {
                          dtype = "[object Object]";
                      }
                      else
                          dtype = constructorStr;
                  }
              }
              catch (e) {
                  return "[object Null]";
              }
          }
          else {
              if (dtype == "[object HTMLCollection]") { /* FF */
                  dtype = "[object NodeList]";
              }
          }
          return dtype;
      }
      catch (e) {
          return "variable is not defined.";
      }
  }

  var cn = {
      index: {
          error: "已经存在改方法名称"
      },
      httprequest: {
          timeOut: "请求超时",
          noAuthority: "没有权限",
          parameterError: '参数有误'
      },
      dom: {
          throwWhitespace: "类具有非法空格字符",
          notElement: "不是元素"
      },
      select: {
          prompt: "请选择"
      },
      proportion: {
          noImg: "imageUrl参数不正确",
          noParentEle: "容器元素不正确"
      }
  };

  /**
   * 删除元素的类
   * @param {Element} ele 元素
   * @param {string} className 类名
   * @return {Element}
   */
  function removeClass(ele, className) {
      var type = getDataType(ele);
      if (!/\[object HTML.*Element\]/.test(type)) {
          throw new Error("" + cn.dom.notElement);
      }
      var classAry = ele.className.split(" ");
      if (classAry.indexOf(className) >= 0)
          classAry.splice(classAry.indexOf(className), 1);
      ele.className = classAry.join(" ");
      return ele;
  }

  /**
   * 分页控件 需要引用默认样式： 样式1： https://gajsapi.fx110.com/script/public/kkpager/kkpager_blue.min.css  或者  https://gajsapi.fx110.com/script/public/kkpager/kkpager.min.css
   * @param {kkpagerNewsModel} fx.kkpager({data:data})
          * @param {string | number} total 总页数
          * @param {string |number} pno: 当前页码
          *  @param {string |number} totalRecords: 总数据条数
          * @param {string | number} pagerid 分页容器id
          * @param {string} mode 分页类型：link（链接类型），click（点击类型）
          * @param {string} gopageButtonId 页码跳转确定按钮元素id
          * @param {string} gopageTextboxId 页码跳转输入框元素id
          * @param {boolean} isShowFirstPageBtn 是否显示第一页按钮
          * @param {boolean} isShowLastPageBtn 是否显示最后一页按钮
          * @param {boolean} isShowPrePageBtn 是否显示上一页按钮
          * @param {boolean} isShowNextPageBtn 是否显示下一页按钮
          * @param {boolean} isShowTotalPage 是否显示总页数
          * @param {boolean} isShowCurrPage 是否显示当前页
          * @param {boolean} isShowTotalRecords 是否显示总记录数
          * @param {boolean} isWrapedPageBtns 是否用span包裹住页码按钮
          * @param {boolean} isWrapedInfoTextAndGoPageBtn 是否用span包裹住分页信息和跳转按钮
          * @param {boolean} isGoPage 是否显示页码跳转输入框
          * @param {boolean} lang 分页框文字配置
          * @param {string} hrefFormer 链接前部（mode:link有效）
          * @param {string} hrefLatter 链接尾部（mode:link有效）
          * @param {Function} getLink 链接算法（mode:link有效） function (n) {}   n 当前的页码
          * @param {Function} click 点击执行（mode:click有效） function (n, config) {} //n  当前页面   config:{total: 10, pagerid: "kkpager"} 总页数 当前容器id
          * @param {Function} getHref 链接算法（mode:link有效） function (n) {}   n 当前的页码
    * example
    `  fx.kkpager({
              pagerid: "kkpager",
              total: 10,
              pno: 4,
              isShowTotalPage: false,
              isShowCurrPage: false,
              isGoPage: false,
              mode: 'click',
              click: function (n, config) {}
          },
              true);

          fx.kkpager({
              pagerid: "kkpager1",
              total: 10,
              pno: 4,
              isShowTotalPage:true,
              isShowCurrPage: true,
              isGoPage: true,
              mode: 'link',
              hrefFormer: '链接前部',
              hrefLatter: '链接尾部',
              getLink: function (n) {
                  if (n == 1) {
                      return this.hrefFormer + this.hrefLatter;
                  }
                  return this.hrefFormer + '_' + n + this.hrefLatter;
              }
          },
              true);
   */
  var kkpagerNews = {
      pagerid: 'kkpager',
      mode: 'link',
      pno: 1,
      total: 1,
      totalRecords: 0,
      isShowFirstPageBtn: true,
      isShowLastPageBtn: true,
      isShowPrePageBtn: true,
      isShowNextPageBtn: true,
      isShowTotalPage: false,
      isShowCurrPage: false,
      isShowTotalRecords: false,
      isGoPage: false,
      isWrapedPageBtns: true,
      isWrapedInfoTextAndGoPageBtn: true,
      isEllipsisLink: true,
      isShowLastPage: true,
      hrefFormer: '',
      hrefLatter: '',
      gopageWrapId: 'kkpager_gopage_wrap',
      gopageButtonId: 'kkpager_btn_go',
      gopageTextboxId: 'kkpager_btn_go_input',
      lang: {
          firstPageText: '<<',
          firstPageTipText: '首页',
          lastPageText: '>>',
          lastPageTipText: '尾页',
          prePageText: '<',
          prePageTipText: '上一页',
          nextPageText: '>',
          nextPageTipText: '下一页',
          totalPageBeforeText: '共',
          totalPageAfterText: '页',
          currPageBeforeText: '当前第',
          currPageAfterText: '页',
          totalInfoSplitStr: '/',
          totalRecordsBeforeText: '共',
          totalRecordsAfterText: '条数据',
          gopageBeforeText: '&nbsp;转到',
          gopageButtonOkText: '确定',
          gopageAfterText: '页',
          buttonTipBeforeText: '第',
          buttonTipAfterText: '页'
      },
      //链接算法（当处于link模式）,参数n为页码
      getLink: function (n) {
          //这里的算法适用于比如：
          //hrefFormer=http://www.xx.com/news/20131212
          //hrefLatter=.html
          //那么首页（第1页）就是http://www.xx.com/news/20131212.html
          //第2页就是http://www.xx.com/news/20131212_2.html
          //第n页就是http://www.xx.com/news/20131212_n.html
          if (n == 1) {
              return this.hrefFormer + this.hrefLatter;
          }
          return this.hrefFormer + '_' + n + this.hrefLatter;
      },
      //页码单击事件处理函数（当处于mode模式）,参数n为页码
      click: function (n) {
          //这里自己实现
          //这里可以用this或者kkpagerNews访问kkpagerNews对象
          return false;
      },
      //获取href的值（当处于mode模式）,参数n为页码
      getHref: function (n) {
          //默认返回'#'
          return '#';
      },
      //跳转框得到输入焦点时
      focus_gopage: function () {
          //var btnGo = document.getElementById(this.gopageButtonId);
          document.getElementById(this.gopageTextboxId).setAttribute('hideFocus', "true");
          // $('#' + this.gopageTextboxId).attr('hideFocus', true);
          // show(btnGo);
          // btnGo.style.left = "10px";
          // addClass(document.getElementById(this.gopageTextboxId), "focus");
      },
      //跳转框失去输入焦点时
      blur_gopage: function () {
          var _this = this;
          setTimeout(function () {
              // var btnGo = document.getElementById(_this.gopageButtonId)
              // hide(btnGo);
              removeClass(document.getElementById(_this.gopageTextboxId), "focus");
          }, 400);
      },
      //跳转输入框按键操作
      keypress_gopage: function () {
          var event = arguments[0] || window$1.event;
          var code = event.keyCode || event.charCode;
          //delete key
          if (code == 8)
              return true;
          //enter key
          if (code == 13) {
              kkpagerNews.gopage();
              return false;
          }
          //copy and paste
          if (event.ctrlKey && (code == 99 || code == 118))
              return true;
          //only number key
          if (code < 48 || code > 57)
              return false;
          return true;
      },
      //跳转框页面跳转
      gopage: function () {
          var str_page = document.getElementById(this.gopageTextboxId).value;
          if (isNaN(parseFloat(str_page))) {
              document.getElementById(this.gopageTextboxId).value = this.next;
              //$('#' + this.gopageTextboxId).val(this.next);
              return;
          }
          var n = parseInt(str_page);
          if (n < 1)
              n = 1;
          if (n > this.total)
              n = this.total;
          if (this.mode == 'click') {
              this._clickHandler(n, { total: this.total, pagerid: this.pagerid });
          }
          else {
              window$1.location = this.getLink(n);
          }
      },
      //不刷新页面直接手动调用选中某一页码
      selectPage: function (n, config) {
          this._config['pno'] = n;
          this._config['total'] = config.total;
          this._config['pagerid'] = config.pagerid;
          this.generPageHtml(this._config, true);
      },
      //生成控件代码
      generPageHtml: function (config) {
          //, enforceInit
          // if (enforceInit || !this.inited) {
          //     this.init(config);
          // }
          this.init(config);
          var str_first = '', str_prv = '', str_next = '', str_last = '';
          if (this.isShowFirstPageBtn) {
              if (this.hasPrv) {
                  str_first = '<a ' + this._getHandlerStr(1) + ' title="'
                      + (this.lang.firstPageTipText || this.lang.firstPageText) + '">' + this.lang.firstPageText + '</a>';
              }
              else {
                  str_first = '<span class="disabled">' + this.lang.firstPageText + '</span>';
              }
          }
          if (this.isShowPrePageBtn) {
              if (this.hasPrv) {
                  str_prv = '<a ' + this._getHandlerStr(this.prv) + ' title="'
                      + (this.lang.prePageTipText || this.lang.prePageText) + '">' + this.lang.prePageText + '</a>';
              }
              else {
                  str_prv = '<span class="disabled">' + this.lang.prePageText + '</span>';
              }
          }
          if (this.isShowNextPageBtn) {
              if (this.hasNext) {
                  str_next = '<a ' + this._getHandlerStr(this.next) + ' title="'
                      + (this.lang.nextPageTipText || this.lang.nextPageText) + '">' + this.lang.nextPageText + '</a>';
              }
              else {
                  str_next = '<span class="disabled">' + this.lang.nextPageText + '</span>';
              }
          }
          if (this.isShowLastPageBtn) {
              if (this.hasNext) {
                  str_last = '<a ' + this._getHandlerStr(this.total) + ' title="'
                      + (this.lang.lastPageTipText || this.lang.lastPageText) + '">' + this.lang.lastPageText + '</a>';
              }
              else {
                  str_last = '<span class="disabled">' + this.lang.lastPageText + '</span>';
              }
          }
          var str = '';
          if (this.isEllipsisLink) {
              var dot = '<a ' + this._getHandlerStr(this.prvMax) + ' title="...">...</a>';
              var dot2 = '<a ' + this._getHandlerStr(this.nextMax) + ' title="...">...</a>';
          }
          else {
              var dot = '<span class="spanDot">...</span>';
          }
          var total_info = '<span class="totalText">';
          var total_info_splitstr = '<span class="totalInfoSplitStr">' + this.lang.totalInfoSplitStr + '</span>';
          if (this.isShowCurrPage) {
              total_info += this.lang.currPageBeforeText + '<span class="currPageNum">' + this.pno + '</span>' + this.lang.currPageAfterText;
              if (this.isShowTotalPage) {
                  total_info += total_info_splitstr;
                  total_info += this.lang.totalPageBeforeText + '<span class="totalPageNum">' + this.total + '</span>' + this.lang.totalPageAfterText;
              }
              else if (this.isShowTotalRecords) {
                  total_info += total_info_splitstr;
                  total_info += this.lang.totalRecordsBeforeText + '<span class="totalRecordNum">' + this.totalRecords + '</span>' + this.lang.totalRecordsAfterText;
              }
          }
          else if (this.isShowTotalPage) {
              total_info += this.lang.totalPageBeforeText + '<span class="totalPageNum">' + this.total + '</span>' + this.lang.totalPageAfterText;
              if (this.isShowTotalRecords) {
                  total_info += total_info_splitstr;
                  total_info += this.lang.totalRecordsBeforeText + '<span class="totalRecordNum">' + this.totalRecords + '</span>' + this.lang.totalRecordsAfterText;
              }
          }
          else if (this.isShowTotalRecords) {
              total_info += this.lang.totalRecordsBeforeText + '<span class="totalRecordNum">' + this.totalRecords + '</span>' + this.lang.totalRecordsAfterText;
          }
          total_info += '</span>';
          var gopage_info = '';
          if (this.isGoPage) {
              gopage_info = '<span class="goPageBox">' + this.lang.gopageBeforeText + '<span id="' + this.gopageWrapId + '">' +
                  '<input type="button" class="kkpager_btn_go" id="' + this.gopageButtonId + '" onclick="kkpages_' + this.pagerid + '.gopage()" value="'
                  + this.lang.gopageButtonOkText + '" />' +
                  '<input type="text" class="kkpager_btn_go_input" id="' + this.gopageTextboxId + '" onfocus="kkpages_' + this.pagerid + '.focus_gopage()"  onkeypress="return kkpages_' + this.pagerid + '.keypress_gopage(event);"   onblur="kkpages_' + this.pagerid + '.blur_gopage()" value="' + this.next + '" /></span>' + this.lang.gopageAfterText + '</span>';
          }
          //分页处理
          if (this.total <= 8) {
              for (var i = 1; i <= this.total; i++) {
                  if (this.pno == i) {
                      str += '<span class="curr">' + i + '</span>';
                  }
                  else {
                      str += '<a ' + this._getHandlerStr(i) + ' title="'
                          + this.lang.buttonTipBeforeText + i + this.lang.buttonTipAfterText + '">' + i + '</a>';
                  }
              }
          }
          else {
              if (this.pno <= 5) {
                  for (var i = 1; i <= 7; i++) {
                      if (this.pno == i) {
                          str += '<span class="curr">' + i + '</span>';
                      }
                      else {
                          str += '<a ' + this._getHandlerStr(i) + ' title="' +
                              this.lang.buttonTipBeforeText + i + this.lang.buttonTipAfterText + '">' + i + '</a>';
                      }
                  }
                  str += dot2;
                  if (this.isShowLastPage) {
                      str += '<a ' + this._getHandlerStr(this.total) + ' title="'
                          + this.lang.buttonTipBeforeText + this.total + this.lang.buttonTipAfterText + '">' + this.total + '</a>';
                  }
              }
              else {
                  str += '<a ' + this._getHandlerStr(1) + ' title="'
                      + this.lang.buttonTipBeforeText + '1' + this.lang.buttonTipAfterText + '">1</a>';
                  str += '<a ' + this._getHandlerStr(2) + ' title="'
                      + this.lang.buttonTipBeforeText + '2' + this.lang.buttonTipAfterText + '">2</a>';
                  str += dot;
                  var begin = this.pno - 2;
                  var end = this.pno + 2;
                  if (end > this.total) {
                      end = this.total;
                      begin = end - 4;
                      if (this.pno - begin < 2) {
                          begin = begin - 1;
                      }
                  }
                  else if (end + 1 == this.total) {
                      end = this.total;
                  }
                  for (var i = begin; i <= end; i++) {
                      if (this.pno == i) {
                          str += '<span class="curr">' + i + '</span>';
                      }
                      else {
                          str += '<a ' + this._getHandlerStr(i) + ' title="'
                              + this.lang.buttonTipBeforeText + i + this.lang.buttonTipAfterText + '">' + i + '</a>';
                      }
                  }
                  if (end != this.total) {
                      if (this.isEllipsisLink) {
                          str += dot2;
                      }
                      else {
                          str += dot;
                      }
                      if (this.isShowLastPage) {
                          str += '<a ' + this._getHandlerStr(this.total) + ' title="'
                              + this.lang.buttonTipBeforeText + this.total + this.lang.buttonTipAfterText + '">' + this.total + '</a>';
                      }
                  }
              }
          }
          var pagerHtml = '<div class="kkpager_parent_box">';
          if (this.isWrapedPageBtns) {
              pagerHtml += '<span class="pageBtnWrap">' + str_first + str_prv + str + str_next + str_last + '</span>';
          }
          else {
              pagerHtml += str_first + str_prv + str + str_next + str_last;
          }
          if (this.isWrapedInfoTextAndGoPageBtn) {
              pagerHtml += '<span class="infoTextAndGoPageBtnWrap">' + total_info + gopage_info + '</span>';
          }
          else {
              pagerHtml += total_info + gopage_info;
          }
          pagerHtml += '</div><div style="clear:both;"></div>';
          //$("#" + this.pagerid).html(pagerHtml);
          document.getElementById(this.pagerid).innerHTML = pagerHtml;
      },
      //分页按钮控件初始化
      init: function (config) {
          this.pno = isNaN(config.pno) ? 1 : parseInt(config.pno);
          this.total = isNaN(config.total) ? 1 : parseInt(config.total);
          this.totalRecords = isNaN(config.totalRecords) ? 0 : parseInt(config.totalRecords);
          if (config.pagerid) {
              this.pagerid = config.pagerid;
          }
          if (config.mode) {
              this.mode = config.mode;
          }
          if (config.gopageWrapId) {
              this.gopageWrapId = config.gopageWrapId;
          }
          if (config.gopageButtonId) {
              this.gopageButtonId = config.gopageButtonId;
          }
          if (config.gopageTextboxId) {
              this.gopageTextboxId = config.gopageTextboxId;
          }
          if (config.isShowFirstPageBtn != undefined) {
              this.isShowFirstPageBtn = config.isShowFirstPageBtn;
          }
          if (config.isShowLastPageBtn != undefined) {
              this.isShowLastPageBtn = config.isShowLastPageBtn;
          }
          if (config.isShowPrePageBtn != undefined) {
              this.isShowPrePageBtn = config.isShowPrePageBtn;
          }
          if (config.isShowNextPageBtn != undefined) {
              this.isShowNextPageBtn = config.isShowNextPageBtn;
          }
          if (config.isShowTotalPage != undefined) {
              this.isShowTotalPage = config.isShowTotalPage;
          }
          if (config.isShowCurrPage != undefined) {
              this.isShowCurrPage = config.isShowCurrPage;
          }
          if (config.isShowTotalRecords != undefined) {
              this.isShowTotalRecords = config.isShowTotalRecords;
          }
          if (config.isWrapedPageBtns) {
              this.isWrapedPageBtns = config.isWrapedPageBtns;
          }
          if (config.isWrapedInfoTextAndGoPageBtn) {
              this.isWrapedInfoTextAndGoPageBtn = config.isWrapedInfoTextAndGoPageBtn;
          }
          if (config.isGoPage != undefined) {
              this.isGoPage = config.isGoPage;
          }
          if (config.lang) {
              for (var key in config.lang) {
                  this.lang[key] = config.lang[key];
              }
          }
          this.hrefFormer = config.hrefFormer || '';
          this.hrefLatter = config.hrefLatter || '';
          if (config.getLink && typeof (config.getLink) == 'function') {
              this.getLink = config.getLink;
          }
          if (config.click && typeof (config.click) == 'function') {
              this.click = config.click;
          }
          if (config.getHref && typeof (config.getHref) == 'function') {
              this.getHref = config.getHref;
          }
          if (!this._config) {
              this._config = config;
          }
          //validate
          if (this.pno < 1)
              this.pno = 1;
          this.total = (this.total <= 1) ? 1 : this.total;
          if (this.pno > this.total)
              this.pno = this.total;
          this.prv = (this.pno <= 2) ? 1 : (this.pno - 1);
          this.prvMax = (this.pno <= 6) ? 1 : (this.pno - 5);
          this.next = (this.pno >= this.total - 1) ? this.total : (this.pno + 1);
          this.nextMax = (this.pno >= this.total - 5) ? this.total : (this.pno + 5);
          this.hasPrv = (this.pno > 1);
          this.hasNext = (this.pno < this.total);
          this.inited = true;
      },
      _getHandlerStr: function (n) {
          if (this.mode == 'click') {
              return 'href="' + this.getHref(n) + '" onclick="return kkpages_' + this.pagerid + '._clickHandler(' + n + ',{total:' + this.total + ',pagerid:\'' + this.pagerid + '\'})"';
          }
          //link模式，也是默认的
          return 'href="' + this.getLink(n) + '"';
      },
      _clickHandler: function (n, config) {
          var res = false;
          if (this.click && typeof this.click == 'function') {
              res = this.click.call(this, n, config);
              this.selectPage(n, config);
              return false;
          }
          return res;
      },
      //复制一个新的kkpager 当做每个单独的kkpager用
      //相当于new的意思
      deepCopy: function () {
          return this._deepCopy(this);
      },
      _deepCopy: function (kkpager) {
          var result = {};
          for (var key in kkpager) {
              result[key] = typeof kkpager[key] === 'object' ? this._deepCopy(kkpager[key]) : kkpager[key];
          }
          return result;
      },
      initialize: function (data) {
          window$1["kkpages_" + data.pagerid] = this.deepCopy();
          window$1["kkpages_" + data.pagerid].generPageHtml.call(window$1["kkpages_" + data.pagerid], data);
      }
  };
  var kkpager = kkpagerNews.initialize.bind(kkpagerNews);
  var kkpage = kkpager({
      pagerid: "kkpage",
      total: 20,
      totalRecords: 200,
      pno: 1,
      isShowTotalPage: true,
      isShowCurrPage: true,
      isShowTotalRecords: true,
      isGoPage: true,
      mode: "click",
  });

  var kkpage$1 = kkpager({
      pagerid: "kkpage",
      total: 2,
      totalRecords: 200,
      pno: 1,
      // isShowTotalPage:true,
      // isShowCurrPage:true,
      // isShowTotalRecords:true,
      // isGoPage:true,
      mode: "click",
  });

})));
//# sourceMappingURL=index.js.map
