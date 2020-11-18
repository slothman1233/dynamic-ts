import * as Public from "./utils/public"
import Component from './component';
import './initialization.ts'

class Play extends Component {
   /**
    *  缓存播放器列表
    */
   static players: object = {};
   videoToolBarDom: any;
   static liveStreamOption: object;
   constructor(player: any, option?: any, ready?: any) {
      super(player, option, ready);
      (<any>this.options_) = Public.mergeOptions(Component.options_, this.options_);
      this.el_ = this.create();
      Component.options_.play = this.el_;
      if (Component.options_.autoplay) {
         Component.options_.play.muted = true;
      }
      const videoToolBar = Component.getComponents("videoToolBar");
      this.videoToolBarDom = new videoToolBar(null, option, ready);
      this.videoToolBarDom.show();
      const errorBar = Component.getComponents("errorBar");
      Component.options_.errorDom = new errorBar(null, option, ready);
      const loadWaiting = Component.getComponents("loadWaitingBar");
      Component.options_.loadWaitingDom = new loadWaiting(null, option, ready);
      const centerControl = Component.getComponents('centerControl');
      Component.options_.centerControlDom = new centerControl(null, option, ready);
      const liveStreamOption = Component.getComponents('livStream');
      Play.liveStreamOption = new liveStreamOption(player, { teachOrder: Component.options_.teachOrder, streamLink: Component.options_.streamLink }, ready);
      this.videoListen();
   }

   /**
   * 监听video
   */
   videoListen() {
      let index = 0;
      let fist = true;
      let timeOur = setTimeout(() => {
         if (Component.videoForegin.hooks.completecreateVideo) {
            Component.videoForegin.hooks.completecreateVideo(this.el_)
         }
         clearTimeout(timeOur);
      }, 1000)
      Component.options_.play.addEventListener("play", function (e: any) {
         Component.options_.loadWaitingDom.hide(Component.options_.loadWaitingDom.dom);
         if (Component.videoForegin.hooks.videoPlay) {
            Component.videoForegin.hooks.videoPlay();
         }
      });
      Component.options_.play.addEventListener("waiting", function (e: any) {
         Component.options_.loadWaitingDom.show(Component.options_.loadWaitingDom.dom);
         if (Component.videoForegin.hooks.videoWaiting) {
            Component.videoForegin.hooks.videoWaiting();
         }
      });
      Component.options_.play.addEventListener("pause", function (e: any) {
         if (Component.videoForegin.hooks.videoPause) {
            Component.videoForegin.hooks.videoPause();
         }
      });
      Component.options_.play.addEventListener("canplay", function (e: any) {
         //其他移动端浏览器只能让用户自己触发
         document.addEventListener("touchstart", () => {
            if (!Component.options_.play.paused) {
               Component.options_.play.play();
               document.removeEventListener("touchstart", function () { });
            }

         })
         // 兼容微信(微信可以自动播放)
         document.addEventListener("WeixinJSBridgeReady", function () {
            Component.options_.play.play();
         }, false);
         if (Component.videoForegin.hooks.videoCanplay) {
            Component.videoForegin.hooks.videoCanplay();
         }
      });
      Component.options_.play.addEventListener("seeked", function (e: any) {
         if (Component.videoForegin.hooks.videoSeeked) {
            Component.videoForegin.hooks.videoSeeked();
         }
      });
      Component.options_.play.addEventListener("seeking", function (e: any) {
         if (Component.videoForegin.hooks.videoSeeking) {
            Component.videoForegin.hooks.videoSeeking();
         }
      });
      Component.options_.play.addEventListener("loadstart", function (e: any) {
        // Component.options_.loadWaitingDom.show(Component.options_.loadWaitingDom.dom);
         if (Component.videoForegin.hooks.videoLoadstart) {
            Component.videoForegin.hooks.videoLoadstart();
         }
      });
      Component.options_.play.addEventListener("timeupdate", function (e: any) {
         index++;
         if (index >= 10 || fist) {
            Component.options_.loadWaitingDom.hide(Component.options_.loadWaitingDom.dom);
            Component.options_.errorDom.hide(Component.options_.errorDom.dom);
            index = 0;
            fist = false;
         }
         if (Component.videoEmit.timeupdate) {
            Component.videoEmit.timeupdate();
         }
         if (Component.videoForegin.hooks.videoTimeupdate) {
            Component.videoForegin.hooks.videoTimeupdate();
         }
      });
      Component.options_.play.addEventListener("canplaythrough", function (e: any) {
         if (Component.videoForegin.hooks.videoCanplaythrough) {
            Component.videoForegin.hooks.videoCanplaythrough()
         }
         Component.options_.loadWaitingDom.hide(Component.options_.loadWaitingDom.dom);
         Component.options_.errorDom.hide(Component.options_.errorDom.dom);
         if (!Component.ischangeSource) {
         }
      });
      Component.options_.play.addEventListener("loadeddata", function (e: any) {
         if (Component.videoEmit.loadeddata) {
            Component.videoEmit.loadeddata();
         }
         if (Component.videoForegin.hooks.videoLoadeddata) {
            Component.videoForegin.hooks.videoLoadeddata();
         }
      });
      Component.options_.play.addEventListener("loadedmetadata", function (e: any) {
         if (Component.videoForegin.hooks.videoLoadedmetadata) {
            Component.videoForegin.hooks.videoLoadedmetadata()
         }
      });
      Component.options_.play.addEventListener("progress", function (e: any) {
         if (Component.videoEmit.progress) {
            Component.videoEmit.progress()
         }
         if (Component.videoForegin.hooks.videoProgress) {
            Component.videoForegin.hooks.videoProgress();
         }
      });
      Component.options_.play.addEventListener('stalled', function (e: any) {
         if (Component.videoEmit.stalled) {
            Component.videoEmit.stalled()
         }
         if (Component.videoForegin.hooks.videoStalled) {
            Component.videoForegin.hooks.videoStalled();
         }
      });
   }

   /**
    * 创建播放器
    */
   create(): Element {
      let that = this;
      this.el_ = super.createEl("video",
         {
            id: `videojs_${Component.guid_}`,
         },
         getOptions.call(that)
      )
      this.play_.insertAdjacentElement("beforeBegin", this.el_);

      //this.play_.remove();
      try{
        this.play_.remove();
    }catch(e){
        this.play_.parentNode.removeChild(this.play_)
    }
      this.play_ = this.el_;

      return this.el_;

      function getOptions() {
         let item: any;
         item = {
            preload: this.options_.preload,
            poster: this.options_.poster,
            width: this.options_.width,
            height: this.options_.height,
            src: "",
            'x5-video-player-type': "h5"
         }
         if(this.options_.loop){
           item.loop = this.options_.loop
         }
         if (this.options_.autoplay) {
            item.autoplay = this.options_.autoplay;
         }
         return item;
      }
   }

   /** 
    * 直播流处理
    */
   liveStream() {

   }
}





Play.prototype.options_ = Component.components_;

Component.setComponents("Play", Play);

export default Play


