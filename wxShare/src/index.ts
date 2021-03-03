import { mergeOptions } from "@stl/tool-ts/src/common/compatible/mergeOptions"
import { http } from "@stl/httprequest/src/index"
declare let wx:any
interface parameter{
  ajaxUrl:string//获取微信分享配置的请求地址
  title?:string//分享标题
  desc?:string//分享描述
  imgUrl?:string//分享图
  link?:string//分享地址
  data?:any//获取微信分享配置的请求参数
  friendFn?:()=>void//分享给好友成功后的回调
  cancelFriendFn?:()=>void//取消分享给好友的回调
  circleFn?:()=>void//分享到朋友圈成功后的回调
  cancelCircleFn:()=>void//取消分享到朋友圈的回调
  ajaxErrorFn?:(err:any)=>void//请求错误的回调
  shareErrorFn?:(err:any)=>void//分享错误的回调
}

export class WXShare{
  parameter:parameter
  defaule:any = {
    title:"",
    desc:"",
    imgUrl:"",
    link:window.location.href,
  }
  constructor(obj:parameter){
    this.parameter = mergeOptions(this.defaule,obj)
    this.ajaxFn()
  }
  ajaxFn(){
    let that =this;
    http.post({
      type:"POST",
      url:that.parameter.ajaxUrl,
      data:that.parameter.data||{pageurl:that.parameter.link},
      dataType:"json",
      async:false
    },function(data:any){
      if(data&&data.code=="0"){
        if(data.bodyMessage&&data.bodyMessage!=""){
          that.renderBeshare(data)
        }
      }
    },function(err:any){
      that.parameter.ajaxErrorFn(err)
    });
  }
  renderBeshare(data:any){
    let that = this,shareData = JSON.parse(data.bodyMessage);
    wx.config({
      debug: false,////生产环境需要关闭debug模式
      appId: "wxacfa8b445fe9a37e",//appId通过微信服务号后台查看
      timestamp: shareData.timestamp,//生成签名的时间戳
      nonceStr: shareData.nonceStr,//生成签名的随机字符串
      signature: shareData.signature,//签名
      jsApiList: [//需要调用的JS接口列表
          'checkJsApi',//判断当前客户端版本是否支持指定JS接口
          'updateAppMessageShareData',//分享给好友
          'updateTimelineShareData'//分享到朋友圈
      ]
    });
    wx.ready(function () {
      //分享朋友圈
      wx.updateTimelineShareData({
          title: that.parameter.title,
          link: that.parameter.link,// 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
          //imgUrl: protocol + '//' + host + '/Images/activity/xingpng.jpg',// 自定义图标
          imgUrl: that.parameter.imgUrl,
          trigger: function (res:any) {

          },
          success: function (res:any) {
              that.parameter.circleFn();
          },
          cancel: function (res:any) {
              that.parameter.cancelCircleFn();
          }
      });
      //分享给好友
      wx.updateAppMessageShareData({
          title: that.parameter.title,
          desc: that.parameter.desc,
          link: that.parameter.link,
          imgUrl: that.parameter.imgUrl, // 自定义图标
          //imgUrl: "https://imgs.wbp5.com/api/secrecymaster/html_up/2019/2/20190216153702992.jpg",
          //type: 'link', // 分享类型,music、video或link，不填默认为link
          //dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
          success: function (res:any) {
              that.parameter.friendFn();
          },
          cancel: function (res:any) {
              // 用户取消分享后执行的回调函数
              that.parameter.cancelFriendFn();
          }
      });
    });
    wx.error(function (res:any) {
        //console.error(res.errMsg);
        that.parameter.shareErrorFn(res);
    });
  }
}