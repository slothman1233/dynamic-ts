import "./index.less"
import { mergeOptions } from "@stl/tool-ts/src/common/compatible/mergeOptions";
import { on } from "@stl/tool-ts/src/common/event/on"
import { each } from "@stl/tool-ts/src/common/obj/each"
import { getDataType } from "@stl/tool-ts/src/common/obj/getDataType"
interface parameter {
  close?:boolean//是否有关闭按钮
  cancel?:boolean//是否有不再显示弹窗按钮
  cancelCloseAll?:boolean//点击不再显示弹窗按钮是否关闭所有当前已显示的弹窗
  autoClose?:boolean//是否自动关闭
  closeTime?:number//自动关闭时间
  number?:number//每次允许显示的最大数量
  top?:number//距离顶部的距离
  right?:number//距离右边的距离
  left?:number//距离左边的距离
  bottom?:number//距离底部的距离
  showCallback?:(obj:htmlStr)=>void
  cancelCallback?:()=>void
}
interface htmlStr {
  contentStr:string//内容部分的模板字符串
  headStr?:string//头部的模板字符串
  footStr?:string//底部的模板字符串
  id?:string|number
}

export class NoticeRemind {
  noticeDom:any = {}
  noticeTimeout:any = {}
  noticeParent:HTMLElement;
  option:parameter;
  index:number = 0;
  showIndex:number = 0;
  cancelKey:boolean = true;
  noticeList:Array<any> = [];
  initOption:parameter = {close:false,cancel:true,autoClose:true,closeTime:3000,number:1,top:195,right:23,cancelCloseAll:true}
  constructor(option:parameter){
    this.option = mergeOptions({},this.initOption,option);
    this.getParent();
    this.addEvent();
  }
  private getParent(){//获取父级元素
    this.noticeParent = document.createElement("div");
    this.noticeParent.id = "notice_remind_parent";
    if(this.option.bottom)this.noticeParent.style.bottom = this.option.bottom+"px";else this.noticeParent.style.top = this.option.top+"px";
    if(this.option.left)this.noticeParent.style.left = this.option.left+"px";else this.noticeParent.style.right = this.option.right+"px";
    document.body.appendChild(this.noticeParent);
  }
  private addEvent(){//事件绑定
    let that = this;
    if(this.option.cancel){
      on({
        agent:that.noticeParent,
        events:"click",
        ele:".notice_cancel",
        fn:function(){
          if(that.option.cancelCloseAll)that.closeAll.call(that);
          if(that.option.cancelCallback){
            that.option.cancelCallback();
          }else{
            that.cancelKey = false;
          }
        }
      })
    }
    if(this.option.close){
      on({
        agent:that.noticeParent,
        events:"click",
        ele:".notice_close_box",
        fn:function(e:any){
          let item:string = e.getAttribute("type");
          that.closeOnce.call(that,item);
        }
      })
    }
  }
  private closeAll(){
    if(this.option.autoClose){
      each(this.noticeTimeout,function(value:any){
        clearTimeout(value);
      })
    }
    this.noticeParent.innerHTML = "";
    this.noticeTimeout = {};
    this.noticeDom = {};
    this.showIndex =0;
  }
  private closeOnce(index:number|string){
    this.noticeParent.removeChild(this.noticeDom[index]);
    delete this.noticeDom[index];
    try{clearTimeout(this.noticeTimeout[index])}catch(e){};
    delete this.noticeTimeout[index];
    this.showIndex--;
    this.addNextNotice.call(this);
  }
  private getNoticeDom(str:string){
    let dom :HTMLElement = document.createElement("div");
    dom.className = "notice_remind notice_remind"+this.index;
    dom.innerHTML = str;
    this.noticeDom[this.index] = dom;
    this.noticeParent.appendChild(this.noticeDom[this.index]);
    this.autoCloseFn(this.index);
    this.index++;
    this.showIndex++;
    if(this.showIndex<this.option.number){
      this.addNextNotice();
    }
  }
  private getNewNotice(obj:htmlStr){//生成模板字符串
    let closeStr:string = this.option.close?`<i class="notice_close_box" type="${this.index}">×</i>`:"";
    let cancelStr:string = this.option.cancel?`<div class="notice_cancel_box"><i class="notice_cancel"></i><span>不再弹出</span></div>`:"";
    let str:string = `${closeStr}${cancelStr}
      <div class="notice_head_box ${this.option.cancel?'notice_head_cancel':''}">${obj.headStr?obj.headStr:""}</div>
      <div class="notice_content_box">${obj.contentStr}</div>
      <div class="notice_bottom_box">${obj.footStr?obj.footStr:""}</div>`
    this.getNoticeDom(str);
    this.option.showCallback&&this.option.showCallback(obj);
  }
  private autoCloseFn(index:number){//自动关闭的方法
    if(!this.option.autoClose)return;
    let that = this;
    this.noticeTimeout[index] = setTimeout(function(){
      that.closeOnce.call(that,index);
    },this.option.closeTime)
  }
  private addNextNotice(){
    if(this.noticeList.length>0){
      let obj:htmlStr = this.noticeList.shift();
      this.getNewNotice(obj);
    }
  }
  addNewNotice(obj:htmlStr|Array<htmlStr>){//添加新的通知弹窗
    if(!this.cancelKey)return;
    if(getDataType(obj) === "[object Object]"){
      this.addNoice((<htmlStr>obj))
    }else if(getDataType(obj) === "[object Array]"){
      for(let i=0;i<(<Array<htmlStr>>obj).length;i++){
        let item:htmlStr = (<Array<htmlStr>>obj)[i];
        this.addNoice((<htmlStr>item))
      }
    }
  }
  private addNoice(obj:htmlStr){
    if(this.showIndex<this.option.number){
      this.getNewNotice(obj);
    }else{
      this.noticeList.push(obj);
    }
  }
}

