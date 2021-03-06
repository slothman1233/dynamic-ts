import "./index.less"
import { mergeOptions } from "@stl/tool-ts/src/common/compatible/mergeOptions";
import { addEvent } from "@stl/tool-ts/src/common/compatible/addEvent";
import { removeEvent } from "@stl/tool-ts/src/common/compatible/removeEvent";
import { removeClass } from "@stl/tool-ts/src/common/dom/removeClass";
import { addClass } from "@stl/tool-ts/src/common/dom/addClass";
import { show } from "@stl/tool-ts/src/common/dom/show";
import { hide } from "@stl/tool-ts/src/common/dom/hide";
interface option {
  sliderWindowId:string//轮播框元素id
  sliderDomId?:string//需要轮播的元素id 如果不传则默认找轮播框元素的第一个子元素
  sliderListName?:string//轮播元素列表 "li"、".list" 如果不传则默认找需要轮播元素的所有子元素
  direction?:string//移动方向。"left"：默认值  向左，"right":向右，"top":向上，"bottom":向下
  intervals?:number//间隔时间 不传则为无缝滚动

  step?:number//每次移动的步长 决定移动的速度(无缝滚动时有用) 默认为5

  distance?:string|number//轮播一张图片运动的距离（intervals不为0时有用）"auto":默认值 每次移动距离为轮播框父元素的宽度，当传入数字时移动距离为传入的数字      
  time?:number//轮播单张图片需要的时间 （轮播时有用） 默认500ms
  item?:boolean//是否显示下标 （轮播时有用）  默认为true
  switch?:boolean//是都显示左右切换按钮 （轮播时有用） 默认为true
  auto?:boolean//是否自动移动 （轮播时有用）  默认为true
  hover?:boolean//hover时是否停止运动 （auto值为true时有用）默认为true
  switchType?:string//左右切换按钮显示方式  "auto" ：一直显示（默认值），"hover":鼠标移入时显示
  switchCallback?:(type:any,distance:any,clickDom:HTMLElement,showDom:HTMLElement)=>void//点击切换后的回调
  initCallback?:()=>void//初始化完成后的回调
}
export class imageSlider {
  private option:option
  private sliderLength:number//轮播列表的长度
  private totalDistance:number//运动的总距离
  private sportTimeout:any = null//运动的延时器
  private intervalTimeout:any = null//间隔的延时器
  private propertyName:string//运动时改变的属性名
  private step:number//每次运动的距离
  private sportSetTimeoutFn:()=>void//每次运动执行的方法
  private startSportFn:()=>void//开始运动的方法
  private timer:number = 30//运动每一帧的时长
  private nowClass:string = "now_slier_item"
  private parentSize:number//父窗口的尺寸
  private directionType:number//运动方向
  private oneDistance:number//切换一张图片移动的距离
  private isChangeSport:boolean = false//是否正在进行切换
  //实时改变的属性
  private changeType:number|string = undefined//切换的type
  private index:number = 0//当前显示的图片下标
  private translateVal:number = 0//当前运动值
  private nowDistance:number = 0//当前已运动的距离
  private distance:number|string//当前这次需要运动的总距离
  private mouseKey:boolean = false//鼠标是否在轮播区
  //添加多种运动效果时需要的属性
  private distanceNumber:number//轮播一张图片需要的帧数
  private nowDistanceNumber:number = 0//当前已执行的帧数
  //需要使用的dom
  $parent:HTMLElement
  $sliderDom:any
  $sliderList:any
  $itemList:any
  $prevDom:any
  $nextDom:any
  constructor(option:option){
    this.initOption(option);
    this.getDom();
    this.getExerciseValue();
    this.addDom();
    if(this.option.switchType === "out"){
      addClass(this.$prevDom,"slider_btn_hide")
      this.totalDistance<=0&&addClass(this.$nextDom,"slider_btn_hide")
    }else{
      this.cloneFn(0);      
    }
    this.option.auto&&this.startSportFn();
    this.addEventFn();
    option.initCallback&&option.initCallback.call(this);
  }
  private initOption(option:option){//初始化参数
    let optionObj:any = {distance:"auto",step:2,time:300,auto:true,item:true,switch:true,direction:"left",hover:true,switchType:"auto"};
    this.option = mergeOptions({},optionObj,option);
    if(!this.option.auto)this.option.intervals = 1500,this.option.hover = false;//当设置为不自动轮播时则为间隔轮播且hover时不会停止运动
    if(!this.option.intervals)this.option.item = false,this.option.switch = false;//当为无缝滚动是不会显示左右切换和下标按钮
  }
  private getDom(){//获取dom
    this.$parent = document.getElementById(this.option.sliderWindowId);
    this.$sliderDom = this.option.sliderDomId?document.getElementById(this.option.sliderDomId):this.$parent.firstElementChild;
    this.$sliderList = this.getSliderList();
  }
  private getSliderList(){//获取滚动列表元素
    if(!this.option.sliderListName)return this.$sliderDom.children;
    let type:string = this.option.sliderListName.substring(0,1);//判断传入的是className还是tagName
    if(type === ".")return this.$sliderDom.getElementsByClassName(this.option.sliderListName.slice(1))
    return this.$sliderDom.getElementsByTagName(this.option.sliderListName)
  }
  private getExerciseValue(){//获取轮播需要的值和初始运动的值
    this.sliderLength = this.$sliderList.length;//轮播列表的长度
    switch(this.option.direction){
      case "left":case "right":
        this.totalDistance = this.$sliderDom.scrollWidth;//轮播的总距离
        this.propertyName = "translateX";//改变的属性名
        this.parentSize = (<any>this.$parent).clientWidth;//父窗口的尺寸
        break;
      case "top":case "bottom":
        this.totalDistance = this.$sliderDom.scrollHeight;
        this.propertyName = "translateY";  
        this.parentSize = (<any>this.$parent).clientHeight;
        break;
    }
    switch(this.option.direction){
      case "left":case "top":
        this.index = 0;//初始化当前显示的下标值
        this.directionType=-1;//运动方向的变量
        this.step=-this.option.step;//根据方向设置步长
        break;
      case "right":case "bottom":
        this.index = this.sliderLength-1;
        this.directionType=1;
        this.step=this.option.step;
        break;
    }
    if(this.option.intervals){
      this.distanceNumber = Math.ceil(this.option.time/this.timer);//间隔轮播时每次切换执行的帧数
      this.sportSetTimeoutFn = this.intervalSportFn;//根据轮播类型声明不同的运动方法
      this.startSportFn = this.intervalsFn//初始执行的运动方法
    }else{
      this.sportSetTimeoutFn = this.ordinarySportFn;//根据轮播类型声明不同的运动方法
      this.startSportFn = this.sportFn;
    }
    this.distance = this.oneDistance = this.getDistance();//计算当前这次轮播要运动的总距离
  }
  getDistance(end?:number|string){//计算当前需要运动的总距离
    //往左或往上运动时distance为负数，反之为整数
    let len:number = end===undefined?this.directionType:typeof end === "string"?-JSON.parse(end):this.index-end;//获取当前这次运动要切换的图片张数以计算总距离
    if(this.option.distance === "auto")return this.parentSize*len;
    return (<number>this.option.distance)*len;
  }
  private addDom(){//添加切换元素
    let itemString:string = "",listStr="",
        leftRight:string = this.option.switch?`<div class="slider_left_btn ${this.option.switchType==="hover"?"slider_btn_hide":""}"></div>
                                              <div class="slider_right_btn ${this.option.switchType==="hover"?"slider_btn_hide":""}"></div>`:"";//左右切换按钮
    if(this.option.item){//下标元素
      for(let i=0;i<this.sliderLength;i++){
        listStr +=`<li class="slider_item_btn ${i===this.index?this.nowClass:""}" index="${i}"></li>`;
      };
      itemString = `<ul class="slider_item_list">${listStr}</ul>`;
    };
    if(leftRight!==""||itemString!==""){
      let sliderDom:HTMLElement = document.createElement("div");
      sliderDom.className = "slider_switch_box";
      sliderDom.innerHTML = leftRight+itemString;
      this.$parent.appendChild(sliderDom);
      this.getBtn();
    };
  }
  private getBtn(){//获取切换按钮
    this.$itemList = this.$parent.getElementsByClassName("slider_item_btn");
    if(this.option.switch){
      this.$prevDom = this.$parent.getElementsByClassName("slider_left_btn")[0];
      this.$nextDom = this.$parent.getElementsByClassName("slider_right_btn")[0];
    };
  }
  private cloneFn(index:number){//复制列表中第一个元素插入到列表最后
    let dom:HTMLElement =  this.$sliderList[index].cloneNode(true);
    this.$sliderDom.appendChild(dom);
    //if(index)return this.$sliderDom.insertBefore(dom,this.$sliderDom.firstChild);
  }
  private sportFn(index?:number|string){//每一帧运动的延时器
    let that:any = this;
    that.cleatTimeoutFn("sport");
    that.sportTimeout = setTimeout(function(){
      that.sportSetTimeoutFn.call(that,index);
    },that.timer);
  }
  private intervalsFn(){//间隔的延时器
    let that:any = this;
    that.cleatTimeoutFn("interval");
    that.intervalTimeout = setTimeout(function(){
      that.sportFn.call(that);
    },that.option.intervals)
  }
  private calculateDistance(){//每帧运动的距离计算
    return (<number>this.distance)/this.distanceNumber;
  }
  private intervalSportFn(index?:number|string){//间隔轮播每一帧执行的方法
    this.translateVal += this.calculateDistance();//往上和往左运动时 this.translateVal值越来越小
    if(Math.abs(this.translateVal-this.nowDistance)>=Math.abs((<number>this.distance))){//判断是否到达了当前运动的距离
      this.translateVal = this.nowDistance += (<number>this.distance);//将轮播元素的位置设置为要移动到的位置
      this.updateIndex(index);
      if(this.index===0){//下标为0时将 如果是向左或向上轮播则将轮播元素的位置设置到初始位置，如果是向右或向下则设置到复制出来的元素的位置
        this.translateVal = this.nowDistance = this.directionType<0?0:-this.oneDistance;
      }  
      if(this.isChangeSport&&this.option.switchCallback){
        let clickDom:HTMLElement = index === "1"?this.$nextDom:this.$prevDom;
        let showDom:HTMLElement = index === "1"?this.$prevDom:this.$nextDom;
        this.option.switchCallback.call(this,index,this.nowDistance,clickDom,showDom)
      }
      this.isChangeSport =false;  
      if(this.changeType!==undefined){//如果有切换操作则执行切换操作
        this.clickInitFn();
        this.changeFn();
      }else{
        this.distance =this.getDistance();
        this.option.auto?this.afterSportFn.call(this,"all",this.intervalsFn):this.afterSportFn.call(this,"all");
      };
    }else{
      this.sportFn(index);
    }
    this.$sliderDom.style.transform = `${this.propertyName}(${this.translateVal}px)`;
  }
  private ordinarySportFn(){//无缝滚动每一帧执行的方法
    this.translateVal += this.step;
    //往左或往上移动时 translateX(-totalDistance)则置为0, 往右或往下移动时 translateX(this.totalDistance-this.oneDistance)则置为-oneDistance
    let totalVal:number = this.directionType<0?this.totalDistance:this.totalDistance-this.oneDistance;
    let value:number = this.directionType<0?0:-this.oneDistance
    if(Math.abs(this.translateVal)>=totalVal)this.translateVal=value;
    this.$sliderDom.style.transform = `${this.propertyName}(${this.translateVal}px)`;
    this.afterSportFn.call(this,"sport",this.sportFn);//继续执行下一帧运动
  }
  updateIndex(index?:string|number){//更新当前显示图片的下标
    let oldIndex:number = this.index;
    if(index===undefined){//正常轮播的情况
      this.index = this.option.direction === "left"||this.option.direction === "top"?this.index >= (this.sliderLength-1)?0:this.index+1:this.index<=0?(this.sliderLength-1):this.index-1;
    }else if(typeof index === "number"){//点击下标的情况
      this.index = index;
    }else{//左右切换的情况
      this.index = index === "-1"?this.index === 0?(this.sliderLength-1):this.index-1:this.index === (this.sliderLength-1)?0:this.index+1;
    }
    if(this.option.item){//更新下标的样式
      removeClass(this.$itemList[oldIndex],this.nowClass);
      addClass(this.$itemList[this.index],this.nowClass);
    }
  }
  afterSportFn(type:string,fn:()=>void){//根据不同的状态做不同处理
    if(this.mouseKey)return this.cleatTimeoutFn(type);//鼠标移入则停止轮播
    fn?fn.call(this):this.cleatTimeoutFn("all");
  }
  private cleatTimeoutFn(key:string){//关闭延时器的方法
    if((key === "all"||key === "sport")&&this.sportTimeout)
      clearTimeout(this.sportTimeout)
      this.sportTimeout = null;
    if((key === "all"||key === "interval")&&this.intervalTimeout){
      clearTimeout(this.intervalTimeout)
      this.intervalTimeout = null;
    }
  }
  private changeFn(){//切换图片执行的操作
    this.distance = this.getDistance(this.changeType);//获取要轮播的距离
    this.cleatTimeoutFn("interval");//关闭间隔延时器
    this.isChangeSport = true;
    this.sportFn(this.changeType);//开启轮播运动的延时器
    this.changeType = undefined;
  }
  private clickInitFn(){
    let that:any = this;
    if(that.changeType==="-1"&&that.index===0&&that.directionType<0){//如果向左向上轮播index=0时 切换到上一张即最后一张图片 则要先将轮播图位置移到最后
      that.translateVal = that.nowDistance = -that.totalDistance;
      that.$sliderDom.style.transform = `${that.propertyName}(${that.translateVal}px)`;
    };
    //如果向右向下轮播index=0时，切换到下一张即第二张图片或者点击下标   则要先将轮播图位置移到最前
    if((that.changeType==="1"||typeof that.changeType === "number")&&that.index===0&&that.directionType>0){
      that.translateVal = that.nowDistance = that.totalDistance-that.oneDistance;
      that.$sliderDom.style.transform = `${that.propertyName}(${that.translateVal}px)`;
    }
  }
  private addEventFn(){//事件绑定
    let that:any=this;
      addEvent(that.$parent,"mouseover",function(){
        if(that.option.hover){
          that.mouseKey = true;
          that.cleatTimeoutFn.call(that,"interval");
        }
        if(that.option.switchType === "hover"){
          removeClass(that.$prevDom,"slider_btn_hide")
          removeClass(that.$nextDom,"slider_btn_hide");
        }
      });
      addEvent(that.$parent,"mouseout",function(){
        if(that.option.hover){
          that.mouseKey = false;
          that.startSportFn.call(that);
        }
        if(that.option.switchType === "hover"){
          addClass(that.$prevDom,"slider_btn_hide")
          addClass(that.$nextDom,"slider_btn_hide");
        }
      })
    if(that.option.switch){
      addEvent(that.$prevDom,"click",function(){
        if(that.isChangeSport)return;//如果正在执行切换操作则return
        that.changeType = "-1";
        if(!that.sportTimeout)that.clickInitFn(),that.changeFn();
      })
      addEvent(that.$nextDom,"click",function(){
        if(that.isChangeSport)return;
        that.changeType = "1";
        if(!that.sportTimeout)that.clickInitFn(),that.changeFn();  
      })
    }
    if(that.option.item){
      for(let i=0;i<that.sliderLength;i++){
        addEvent(that.$itemList[i],"click",function(){
          if(that.isChangeSport)return;
          that.changeType = JSON.parse(this.getAttribute("index"));
          if(!that.sportTimeout)that.clickInitFn(),that.changeFn();
        })
      }
    }
  }
}



