# layer组件

### 使用方法
```
npm install @stl/layer

css:@import "/node_modules/@stl/layer/dist/index.css"  //样式文件

ts:
    import { layer } from "@stl/layer"

    layer.msg("msg...",{icon:11})

    layer.alert({
        content:"这是一个自定义alert",
        icon:11,
        title:"这是一个标题",
        autoClose:true,
    })

    layer.open({
        title:"这是一个标题",
        content:"这是一段内容这是一段内容这是一段内容这是一段内容这是一段内容这是一段内容这是一段内容",
        icon:11,
        determineBtn:true,
        type:2,
        cancelBtn:true,
        determineFn:()=>{console.log("点击了确定")},
        cancelFn:()=>{console.log("点击了取消")}
    })

    layer.modal({
        title:"这是一个标题",
        content:"这是一段内容这是一段内容这是一段内容这是一段内容这是一段内容这是一段内容这是一段内容",
        determineFn:()=>{console.log("点击了确定")},
        cancelFn:()=>{console.log("点击了取消")}
    })
```

### 方法说明
```
1.layer.msg(content,obj,end)    
    方法说明：message全局提示    
    参数：   
        content:string 提示的内容（必传），   
        obj:{} 包含两个属性
            icon:number 图标类型（非必传）   
            iconColor:string 自定义图标颜色（非必传）  
            time:number 显示时长 单位为毫秒（非必传）   
        end:function 关闭后的回调（非必传）   

2.layer.alert(obj)
    方法说明：alert全局提示    
    参数：   
        obj:{} 包含9个属性     
            content:string 显示的内容（必传）     
            title:string 显示的标题（非必传）   
            icon:number 图标类型（非必传）   
            iconColor:string 自定义图标颜色（非必传） 
            autoClose:boolean 是否自动关闭 默认为false（非必传）     
            time:number 自动关闭的时长 autoClose为true时有用 默认为3000（非必传）   
            btnStr:string 自定义按钮 如"<div>查看详情</div>"（非必传）   
            btnCallback:function 自定义按钮点击事件 btnstr不为空是有用（非必传）   
            showCallback：function alert框显示后的回调（非必传）   
            endCallback：function alert框关闭后的回调（非必传）   

3.layer.open(obj)   
    方法说明：通知提示框    
    参数：   
        obj:{} 包含14个属性     
            content:string 显示的内容（必传）     
            title:string 显示的标题（必传）   
            icon:number 图标类型（非必传）
            iconColor:string 自定义图标颜色（非必传）
            type:1|2 提示框风格 1为正常大小，2为modal框大小 默认为1（非必传） 
            hasClose:boolean 是否有关闭按钮 默认为true（非必传）   
            bg:boolean 是否有背景遮罩 默认为true（非必传）   
            determineBtn:boolean 是否有确定按钮 默认为false（非必传）  
            determineText:string 确定按钮文案 默认为“确定”（非必传） 
            determineFn:()=>void 确定按钮点击的方法（非必传）
            cancelBtn:boolean 是否有取消按钮 默认为false（非必传）  
            cancelText:string 取消按钮文案 默认为“取消”（非必传） 
            cancelFn:()=>void 取消按钮点击的方法（非必传）
            showCallback：function alert框显示后的回调（非必传）   
            endCallback：function alert框关闭后的回调（非必传）  

3.layer.modal(obj)   
    方法说明：通知提示框    
    参数：   
        obj:{} 包含12个属性     
            content:string 显示的内容（必传）     
            title:string 显示的标题（必传）   
            hasClose:boolean 是否有关闭按钮 默认为true（非必传）   
            bg:boolean 是否有背景遮罩 默认为true（非必传）   
            determineBtn:boolean 是否有确定按钮 默认为false（非必传）  
            determineText:string 确定按钮文案 默认为“确定”（非必传） 
            determineFn:()=>void 确定按钮点击的方法（非必传）
            cancelBtn:boolean 是否有取消按钮 默认为false（非必传）  
            cancelText:string 取消按钮文案 默认为“取消”（非必传） 
            cancelFn:()=>void 取消按钮点击的方法（非必传）
            showCallback：function alert框显示后的回调（非必传）   
            endCallback：function alert框关闭后的回调（非必传）  
```
### 图标说明
```
icon参数的值可传值：
11:"&#xA001;",12:"&#xA002;",//1开头为‘✔’的图标
21:"&#xA003;",22:"&#xA004;",//2开头为‘×’的图标
31:"&#xA006;",32:"&#xA007;",//3开头为‘i’的图标
41:"&#xA008;",42:"&#xA009;",//4开头为‘！’的图标

对应的图标样式： https://js.wbp5.com/iconfont/build/layer/index.html

```