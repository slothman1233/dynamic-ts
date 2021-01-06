# 简易swiper组件（h5 lable切换，轮播图）

### 使用方法
```
npm install @stl/stl-swiper

css:
    import "/node_modules/@stl/stl-swiper/index.css"

html:
 <div class="page" id="page">   
        <div class="stl-switch-thumbs"></div>//导航栏需添加"stl-switch-thumbs"类名   
        <div class="page_content stl-switch-wrapper">//此元素需添加"stl-switch-wrapper"类名    
            <div class="page_item page_one stl-switch-slider">1</div>//此元素需添加"stl-switch-slider"类名   
            <div class="page_item page_two stl-switch-slider">2</div>   
            <div class="page_item page_three stl-switch-slider">3</div>     
            <div class="page_item page_four stl-switch-slider">4</div>   
            <div class="page_item page_five stl-switch-slider">5</div>   
            <div class="page_item page_six stl-switch-slider">6</div>   
            <div class="page_item page_serven stl-switch-slider">7</div>       
        </div>
    </div>
ts:
    new stlSwiper(document.getElementById("page"),{
    //slidesPerView:3,
    //autoHeight:true,
     //autoplay:{},
     thumbs:{
         list:["第一个","<a>第二个</a>","第三个","第四个","第五个","第六个","第七个"],
         thumbsPerview:2
     },
     loop:true,
    scrollBar:{dragSize:"50%"},
    pagination:{}
});
```

### 参数说明
```
interface scrollBar{
    el?:HTMLElement
    dragSize?:string
}
interface autoplay{
    delay?:number
    
}
interface thumbs{
    list:Array<string>
    thumbsPerview?:number
}
interface pagination{
    ele?:HTMLElement|Element
}

interface navigation{
    
}

interface parameter{
    loop?:boolean 是否循环切换 默认为false
    slidesPerView?:number|string 设置slider容器能够同时显示的slides数量 默认为1(此参数与loop,autoplay,pagination,thumbs参数会有冲突)
    autoHeight?:boolean 设置slider容器高度是否自适应slider的高度 默认为false
    speed?:number 切换动画的时长 默认300 单位ms

    autoplay?:{ //是否自动切换 如果不需要传delay参数则此参数传"{}"则会自动切换
        delay?:number//间隔时间 默认3000 单位ms
    }  
    scrollBar?:{//是否有滚动条 如果不需要传el和dragSize参数则此参数传"{}"则会添加滚动条
        el?:HTMLElement//滚动条父元素，如果不传则会自动生成滚动条父元素
        dragSize?:string//滚动条指示的尺寸 默认为对应slider数量的百分比 如slider为2个时 宽度为50%
    }
    thumbs?:thumbs{//缩略图或标题栏 
        list:Array<string> 每个slider对应的缩略图或标题，数量必须与slider数量对应
        thumbsPerview?:number 设置slider容器能够同时显示thumbs的数量
        clickCallback?:()=>viod 点击缩略图的回调
    }
    pagination?:{//分页器（小圆点）如果不需要传ele参数则此参数传"{}"则会添加分页器
        ele?:HTMLElement|Element//分页器父元素 不传则默认生成父元素
    }
    
    sliderStart?:()=>void 切换开始的回调
    sliderEnd?:()=>void 每次切换结束的回调 方法中this.item表示当前显示slider的下标
}
```

### 文件介绍
```
├── config  配置文件
│    ├── karma 单元测试生成报告的文件
│    └── build 配置需要生成的文件
├── src  开发文件夹
├── test    单元测试文件夹
│    └── hello.component.test   karam-test -> hello.component ts文件的单元测试
│── dist  生产文件夹
├── karma.conf.js   单元测试的配置文件
└── rollup.config.js   rollup的配置文件
```