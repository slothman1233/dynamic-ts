# 通知弹窗

### 使用方法
```
npm install @stl/notice-remind

css:
    import "/node_modules/@stl/notice-remind/index.css"

ts:
    let stlNoticeRemind:any = new NoticeRemind({
        top:50
        right:20
    });
    let obj:any = {
        contentStr:"内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容",
        headStr:"标题标题标题标题标题标题标题标题标题标题",
        footStr:"",
    };
    stlNoticeRemind.addNewNotice(obj);
```

### 参数说明
```
{
   close?:boolean 是否显示关闭按钮  默认为false
  cancel?:boolean 是否显示不再显示弹窗按钮  默认为true
  autoClose?:boolean   是否自动关闭弹窗  默认为true
  closeTime?:number 自动关闭弹窗时间  默认3000
  number?:number//每次允许显示的最大数量 默认为1
  top?:number 距离页面顶部的距离 默认195
  right?:number 距离页面右边的距离 默认23
  left?:number 距离页面左边的距离 默认没有此属性，如果传入此参数则"right"参数将无效
  bottom?:number 距离页面底部的距离 默认没有此属性，如果传入此参数则"top"参数将无效
  showCallback?(obj)=>void 当前显示的通知回调，此方法接收一个参数 当前显示的此条通知内容
  cancelCallback?()=>void 点击不再显示弹窗按钮的回调
}
 
```

### 方法说明
```
addNewNotice
    调用方式：stlNoticeRemind.addNewNotice(obj);
    参数说明：{
        contentStr:string 内容部分显示的innerhtml
        headStr:string 头部显示的innerhtml
        footStr?:string 底部显示的innerhtml 没有可不传
        id?:string|number 此条消息的标识
    }或者[
        {
            contentStr:string 内容部分显示的innerhtml
            headStr:string 头部显示的innerhtml
            footStr?:string 底部显示的innerhtml 没有可不传
            id?:string|number 此条消息的标识
        },
        {
            contentStr:string 内容部分显示的innerhtml
            headStr:string 头部显示的innerhtml
            footStr?:string 底部显示的innerhtml 没有可不传
            id?:string|number 此条消息的标识
        }
    ]
```