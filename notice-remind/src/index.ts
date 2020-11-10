import "./index.less"
import { mergeOptions } from "@stl/tool-ts/src/common/compatible/mergeOptions";
import { on } from "@stl/tool-ts/src/common/event/on"
import { each } from "@stl/tool-ts/src/common/obj/each"
interface parameter {
  // contentStr:string
  // headStr?:string
  // footStr?:string
  close?:boolean
  cancel?:boolean
  autoClose?:boolean
  closeTime?:number
  only?:boolean
  top?:number
  right?:number
}
interface htmlStr {
  contentStr:string
  headStr?:string
  footStr?:string
}

export class NoticeRemind {
  noticeDom:any = {}
  noticeTimeout:any = {}
  noticeParent:HTMLElement;
  option:parameter;
  index:number = 0;
  cancelKey:boolean = true;
  noticeList:Array<any> = [];
  initOption:parameter = {close:false,cancel:true,autoClose:true,closeTime:3000,only:true,top:195,right:23,}
  constructor(option:parameter){
    this.option = mergeOptions({},this.initOption,option);
    this.getParent();
    this.addEvent();
  }
  private getParent(){
    this.noticeParent = document.createElement("div");
    this.noticeParent.id = "notice_remind_parent";
    this.noticeParent.style.top = this.option.top+"px";
    this.noticeParent.style.right = this.option.right+"px";
    document.body.appendChild(this.noticeParent);
  }
  private addEvent(){
    let that = this;
    if(this.option.cancel){
      on({
        agent:that.noticeParent,
        events:"click",
        ele:".notice_cancel",
        fn:function(){
          that.closeAll.call(that);
          that.cancelKey = false;
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
  }
  private getNoticeDom(str:string){
    let dom :HTMLElement = document.createElement("div");
    dom.className = "notice_remind notice_remind"+this.index;
   
    dom.innerHTML = str;
    this.noticeDom[this.index] = dom;
    this.noticeParent.appendChild(this.noticeDom[this.index]);
    this.autoCloseFn(this.index);
    this.index++;
  }
  private getNewNotice(obj:htmlStr){
    let closeStr:string = this.option.close?`<i type="${this.index}">×</i>`:"";
    let cancelStr:string = this.option.cancel?`<div class="notice_cancel_box"><i class="notice_cancel"></i><span>不再弹窗</span></div>`:"";
    let str:string = `${closeStr}${cancelStr}
      <div class="notice_head_box ${this.option.cancel?'notice_head_cancel':''}">${obj.headStr?obj.headStr:""}</div>
      <div class="notice_content_box">${obj.contentStr}</div>
      <div class="notice_bottom_box">${obj.footStr?obj.footStr:""}</div>`
    this.getNoticeDom(str);
  }
  private autoCloseFn(index:number){
    if(!this.option.autoClose)return;
    let that = this;
    this.noticeTimeout[index] = setTimeout(function(){
      that.noticeParent.removeChild(that.noticeDom[index]);
      delete that.noticeDom[index];
      delete that.noticeTimeout[index];
      that.addNextNotice.call(that);
    },this.option.closeTime)
  }
  private addNextNotice(){
    if(this.option.only&&this.noticeList.length>0){
      let obj:htmlStr = this.noticeList.shift();
      this.getNewNotice(obj);
    }
  }
  addNewNotice(obj:htmlStr){
    if(!this.cancelKey)return;
    if(this.option.only){
      if(JSON.stringify(this.noticeTimeout)!=="{}"){
        this.noticeList.push(obj);
      }else{
        this.getNewNotice(obj);
      }
    }
  }
}

