# 轮播图（无缝滚动）插件

### 使用方法
```
npm install @stl/image-slider

css:@import "/node_modules/@stl/image-slider/dist/index.css"  //默认样式   如果需要自定义样式可以不引用

html:
    //overflow：hidden和position:relative为必须设置的样式
     <div id="slider_parent" class="slider_parent" style="overflow: hidden;position: relative;">
        <ul class="slider_box" id="slider_dom">
            <li class="slider_list"><p>1</p><img src="https://img.wbp5.com/upload/images/0.jpg"/></li>
            <li class="slider_list"><p>2</p><img src="https://img.wbp5.com/upload/images/1.jpg"/></li>
            <li class="slider_list"><p>3</p><img src="https://img.wbp5.com/upload/images/2.jpg"/></li>
            <li class="slider_list"><p>4</p><img src="https://img.wbp5.com/upload/images/3.jpg"/></li>        
        </ul>
    </div>


ts:
    import { imageSlider } from "@stl/image-slider"
    let imgSliders = new imageSlider({
        sliderWindowId:"slider_parents",
        intervals:1500,
        time:500,
        hover:false,
        switchType:"hover",
        sliderDomId:"slider_doms",
        sliderListName:".slider_list",
    })
```

### 参数说明
**通用参数**

|  参数名         |  类型     |  默认值    |  description               |
| :----------:  | :-------: |  :--------: |  :-----------------------:  |
| sliderWindowId  | string |  "" |  轮播框外部包裹元素id  |
| sliderDomId  | string |  "" |  需要轮播的列表元素id 如果不传则默认找sliderWindowId元素的第一个子元素  |
| sliderListName  | string |  "" |  轮播列表的tagName（"li"）或className（".list"，不传则默认找sliderDomId的所有子元素  |
| direction  | string |  "left" |  轮播方向，"left":向左，"right":向右，"top":向上，"bottom":向下  |
| intervals  | number |  0 |  间隔时间，不传则为无缝滚动  |

**无缝滚动参数（intervals为0）**

|  参数名         |  类型     |  默认值    |  description               |
| :----------:  | :-------: |  :--------: |  :-----------------------:  |
|  step         |  number     |  2    |  每次移动的步长 决定移动的速度    |

**轮播参数（intervals不为0）**

|  参数名         |  类型     |  默认值    |  description               |
| :----------:  | :-------: |  :--------: |  :-----------------------:  |
|  distance  |  number     |  "auto"    |  轮播一次运动的距离，"auto":轮播框父元素的宽度，当传入数字时移动距离为传入的数字 |
|  time         |  number     |  300    |  轮播一次需要的时间（单位：ms）  |
|  item         |  boolean     |  true    |  是否显示下标小圆点    |
|  switch         |  boolean     |  true    |  是否显示左右切换按钮    |
|  auto         |  boolean     |  true    |  是否自动轮播    |
|  hover         |  boolean     |  true    |  hover时是否停止运动    |
|  switchType         |  string     |  "auto"    |  左右切换按钮显示方式,"auto":一直显示；"hover":鼠标移入时显示,"out":到达最后一张或第一张隐藏对应切换按钮    |
|  switchCallback  |  function     |  null    |  点击切换后的回调 此方法将接收四个参数 type:切换方向,"1"表示切换下一张、"-1"表示切换上一张,distance:已移动的总距离,clickDom:点击切换的元素,showDom:另一个切换元素 |
|  initCallback  |  function     |  null    |  初始化完成的回调，方法中获取左右切换按钮：this.$prevDom,this.$nextDom|


### 备注说明
```
当需要向右或向下轮播时需要使用样式将列表中最后一个元素显示在轮播框中
例：
 <div id="slider_parent" class="slider_parent" style="overflow: hidden;position: relative;">
    <ul class="slider_box" id="slider_dom" style="position:relative;left:-900px">//通过设置left值将最后一个元素显示
        <li class="slider_list" style="width:300px"><p>1</p><img src="0.jpg"/></li>
        <li class="slider_list" style="width:300px"><p>2</p><img src="1.jpg"/></li>
        <li class="slider_list" style="width:300px"><p>3</p><img src="2.jpg"/></li>
        <li class="slider_list" style="width:300px"><p>4</p><img src="3.jpg"/></li>      
    </ul>
</div>
```