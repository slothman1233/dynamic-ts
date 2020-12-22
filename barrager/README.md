# 弹幕插件

### 使用方法
```
npm install @stl/contextmenu

html:
    <div id="barrager"></div>

less: 

    需要在less文件里面引用
      @import (less) "*/node_modules/@stl/barrager/src/index.less"
    弹幕的样式文件

ts:
    import barrager from "@stl/barrager"


    let item = {
            img: 'http://120.24.164.80:8080/static/18deed59/images/32x32/blue.png',
            content: '弹幕文字信息', //文字
            href: 'http://www.yaseng.org', 链接
            close: true, //显示关闭按钮
            closeImg: 'http://120.24.164.80:8080/static/18deed59/images/32x32/blue.png',
            speed: 6, //延迟,单位秒,默认6
            bottom: 70, 距离底部高度,单位px,默认随机
            color: 'red',// 颜色,默认白色
            backgroundColor:"#fff",
            beforeCallback?: function(dom){}
        }
    //初始化
    const br = new barrager({parentId: 'barrager', barrageHeight: 200,barragerHeight:44})
    //添加弹幕
    br.addBarrage(item)

    //添加在队列的最前面
    br.addBeforeBarrage(item)

    //清空弹幕
    br.removeAll()

```

### 参数说明
```
  //初始化参数
  parentId: string,  //容器id
  barrageHeight?: number  // 弹幕高度限制 
  childHeight?:number //弹幕子元素的高度  默认为44

  //弹幕参数
  img?: string, //图片 
  content: string, //弹幕内容
  close?: boolean, //显示关闭按钮 
  closeImg?: string, //关闭按钮图片地址
  speed?: number,//延迟,单位秒,默认6 
  color?: string,//颜色,默认白色 
  href?: string,//链接地址
  backgroundColor?: string, //背景颜色
  barragerSpace?: number //弹幕间的间距 //默认50
  beforeCallback?: (dom: HTMLElement) => void //当前弹幕出来前的回调  当前的dom弹幕元素


```
