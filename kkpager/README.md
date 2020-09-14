# ts框架

### 使用方法
```
npm install @stl/kkpager

css:import "@stl/kkpager/dist/index.css"  //默认分页器样式   如果需要自定义样式可以不引用

ts:
import { kkpager } from "@stl/kkpager"
let kkpage = kkpager({
    pagerid:"kkpage",
    total:20,
    pno:1,
    isShowTotalPage:true,
    isShowCurrPage:true,
    isShowTotalRecords:true,
    isGoPage:true,
    mode:"click",
})
```

### 参数说明
```
|  参数名         |  类型     |  默认值    |  description               |
| :----------:  | :-------: |  :--------: |  :-----------------------:  |
|  pagerid          |  string  |    "kkpage"     |    分页容器id               |
|  total         |  number   |    1       |  总页数     |
|  pno     |  number   |     1  |  当前页码     |
|  totalRecords        |  number  |    0     |   总数据条数    |
|  mode    |  string   |     "link"    |     分页类型：link（链接类型），click（点击类型）  |
|  gopageButtonId  |  string   |     "kkpager_btn_go"      |  页码跳转确定按钮元素id       |
|  gopageTextboxId    |  string   |     "kkpager_btn_go_input"   | 页码跳转输入框元素id     |
|  isShowFirstPageBtn  |  boolean  |  true    | 是否显示首页按钮   |
|  isShowLastPageBtn  |  boolean  |  true    |   是否显示尾页按钮   |
|  isShowPrePageBtn  |  boolean  |  true    |  是否显示上一页按钮   |
|  isShowNextPageBtn  |  boolean  |  true    |  是否显示下一页按钮   |
|  isShowTotalPage  |  boolean  |  false    |  是否显示总页数   |
|  isShowCurrPage  |  boolean  |  false    |  是否显示当前页   |
|  isShowTotalRecords  |  boolean  |  false    |  是否显示总记录数   |
|  isGoPage  |  boolean  |  false    |  是否显示页码跳转输入框   |
|  isWrapedPageBtns  |  boolean  |  true    |  是否用span包裹住页码按钮   |
|  isWrapedInfoTextAndGoPageBtn  |  boolean  |  true    |  是否用span包裹住分页信息和跳转按钮|
| isEllipsisLink | boolean  |  true  | 是否省略号可点击 |
|  isShowLastPage  |  boolean  |  true    |  是否显示最后一页页码   |
|  hrefFormer  |  string  |  ""    |  链接前部   |
|  hrefLatter  |  string  |  ""    |  链接尾部   |
|  getLink  |  function  |      |  链接算法（mode:link有效） function (n) {}   n 当前的页码  |
|  click  |  function  |      |  点击执行（mode:click有效） function (n, config) {} //n  当前页面   config:{total: 10, pagerid: "kkpager"} 总页数 当前容器id   |
|  lang  |  object  |  null    |  分页框文字配置 (详细配置见下)  |
```

### lang参数可配置项
```
{
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
}
```