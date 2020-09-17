# 右键操作插件

### 使用方法
```
npm install @stl/contextmenu

html:
    <div id="contextmenu"></div>

ts:
    import { contextmenu } from "@stl/contextmenu"
    let obj:any = {
    ele:document.getElementById("contextmenu"),
    callback:function(){
      console.log("右击了")
    },
    data:[
        {
            content:"<p>复制</p>",
            children:[],
            callback:function(ele:any){
              console.log("复制",ele)
            }
        },
        {
            content:"<p>粘贴</p>",
            children:[],
            callback:function(ele:any){
              console.log("粘贴",ele)
            }
        },
        {
            content:"单元格格式",
            callback:function(ele:any){
              console.log("单元格格式",ele)
            },
             children:[
              {
                content:"合并单元格",
                children:[],
                callback:function(ele:any){
                  console.log("合并单元格",ele)
                }
              },
              {
                content:"拆分单元格",
                children:[],
                callback:function(ele:any){
                  console.log("拆分单元格",ele)
                }
              }
            ],
        }
    ]
  }
  contextmenu(obj)
```

### 参数说明
```
 * @param { Element | NodeList | Array<Element> | string} ele 右键元素
 * @param {Function} callback 右键后的回调
 * @param {object} data 唤起的上下文菜单内容（备注1）[{contentDom:contentDom,children:[]}]
        * @param {Element} content 内容的元素
        * @param {object} children 子元素
        * @param {Function} callback(ele) 点击的回调 
                * @param {Element} ele 当前右键的元素
```

### 备注
```
1：唤起的上下文菜单结构
    <div id="contextmeun_parent" style="position: absolute; display: none; left: 53px; top: 62px;">
        <ul>
            <li><div class="content" data-id="6">data[0].content</div></li>
            <li><div class="content" data-id="7">data[1].content</div></li>
            <li><div class="content" data-id="8">data[2].content</div></li>
            ...
        </ul>
    </div>
```