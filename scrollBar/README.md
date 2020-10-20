# 滚动条插件


### HTML结构说明
```
<div style="position:relative;">
    <div id="box" style="overflow:hidden;height:200px;">
        1111111111<br>
        2222222222<br>
        3333333333<br>
        ......
    </div>
</div>
```

### 调用方式
```
npm install @stl/scroll-bar

css:  @import "/node_modules/@stl/scroll-bar/dist/index.css";
js：  import { scrollBar } from "@stl/scroll-bar"

let scrollBar = new scrollBar({id:"box"});
```

### 参数说明
|  name         |  type     |  default    |  description                                                                                   |
| :----------:  | :-------: |  :--------: |  :------------------------------------------------------------------------------------------:  |
|  id           |  string   |     \       |  需要滚动的元素的id**(必填)**                                                                    |
|  direction    |  string   |    "y"      |  滚动条滚动方向 默认为竖向滚动条  可选值："y"(竖向滚动条)，"x"(横向滚动条)，"xy"(横向竖向都添加)      |
|  size         |  number   |     5       |  滚动条的尺寸(竖向滚动条为设置宽度值，横向滚动条为设置高度值)                                       |
|  smallSize    |  number   |     20      |  滚动条的最小高度/宽度(竖向滚动条为设置高度值，横向滚动条为设置宽度值),避免因内容过多导致滚动条太小    |
|  wheelDis     |  number   |     40      |  每次滚动鼠标滚轮滚动的距离                                                                      |
|  autoRefresh  |  boolean  |     true    |  是否自动监听滚动元素内容变化刷新滚动条高度                                                        |
|  className    |  string   |     ""      |  滚动条需要添加的类名(添加自定义样式时使用)                                                        |
|  xMousewheel  |  boolean  |     true    |  横向滚动条是否允许滚动鼠标滚轮滚动  只有在direction值为"x"时此参数才有效                            |

### 暴露方法
```
方法名：      refresh
描述：        刷新滚动条的方法
调用方式：    scrollBar.refresh();
```



