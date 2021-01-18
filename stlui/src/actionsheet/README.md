# h5模式操作表
  组件参考mui框架实现 各功能实例可参照 [mui官网](https://dev.dcloud.net.cn/mui/)    

### 使用方法

```
npm install @stl/stlui

css: @import "/node_modules/@stl/stlui/dist/index.css" //样式文件

html: 
    <div id="open" style="width:80%;height:40px;margin:50px auto;border:1px solid #000;text-align:center;line-height:40px;">打开actionsheet</div>
    <div id="actionsheet" class="stl-popover stlui-action stl-popover-action stl-popover-bottom">
      <ul class="stl-table-view">
          <li class="stl-table-view-cell">拍照</li>
          <li class="stl-table-view-cell">录音</li>
      </ul>
      <ul class="stl-table-view">
          <li class="stl-table-view-cell">取消</li>
      </ul>
    </div>
        
ts: import { actionsheet } from "@stl/stlui/src/actionsheet/sctionsheet"

    let box = document.getElementById("open");
    box.addEventListener("click",function(){
        actionsheet.showPopover(document.getElementById("actionsheet"))
    })

```

### 方法说明

1.showPopover：显示操作表 
  使用方法：actionsheet.showPopover(box);

2.closePopover:关闭操作表
  使用方法：actionsheet.closePopover(box);