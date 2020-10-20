# 元素拖拽插件

### 使用方法
```
npm install @stl/dragsort

html:
    <div id="list"></div>   

ts:
    import { dragsort } from "@stl/dragsort"
    let data:any = {
        dragParent:document.getElementById("list"),
        dragLevel:0,
        dragEnd:function(thatdragEle:any,thatReplaceEle:any,thatPosition:any){
            console.log(thatdragEle,thatReplaceEle,thatPosition)
        },
        placeHolderTemplate:"<div>12121212121212121</div>",
        Maxlevel:1,
        bodyMessage:[{
            id:"1",
            isDrag:true,
            headEle:"head1",
            contentEle:"content1",
            children:[]
        },
        {
            id:"2",
            isDrag:true,
            headEle:"head2",
            contentEle:"content2",
            children:[]        
        },
        {
            id:"3",
            isDrag:true,
            headEle:"head3",
            contentEle:"content3",
            children:[
                {
                    id:"4",
                    isDrag:true,
                    headEle:"children3head",
                    contentEle:"childern3content",
                    children:[]
                }
            ]          
        }]
    }
    dragsort(data)
```

### 参数说明
```
  * @param {object} data 
         * @param {Element | string} dragParent 父级的元素获取元素的id class。
         * @param {string|number} dragLevel 触发拖动的部分 1:containe本身,2:head部分,3:content部分,4:使用dragEle为拖拽的元素
         * @param {string} dragEle  当dragLevel为4时的拖拽元素的 id class
         * @param {function} dragEnd(thatdragEle,thatReplaceEle,thatPosition) 拖动结束后将被调用的回调函数
                        thatdragEle // 当前拖拽的元素
                        thatReplaceEle //替换的元素
                        thatPosition = [-1, -1] //位置 [0]1是父级 2是子级   [1]1上面 2是下面
         * @param {string} placeHolderTemplate 拖动列表的填充部分。
         * @param {string | number} Maxlevel 允许最大拖动的层级
         * @param {object} bodyMessage [{headEle:headEle,contentEle:contentEle,isDrag:true,id:id,children:[{headEle:headEle,contentEle:contentEle,isDrag:true,children[]}]}]
              * @param {string} id 标识
              * @param {Element} headEle 标题部分内容的元素
              * @param {Element} contentEle 主体部分内容的元素
              * @param {boolean} isDrag 是否允许拖拽 默认为true
              * @param {Array<object>} children 当前条目的子级 [{headEle:headEle,contentEle:contentEle,isDrag:true,id:id,children:[{headEle:headEle,contentEle:contentEle,isDrag:true,children[]}]}]
```