

import Play from "./play"
import Component from './component';
import * as Dom from "./utils/dom"
import * as Public from "./utils/public"
import options from "./model/option-model"
import languages from './languages'
import './index.less';
import videoForeign from './foreign';
import videoEmit from './videoEmit';

const normalizeId = (id: string) => id.indexOf('#') === 0 ? id.slice(1) : id;
var opt = new options();
Component.options_ = opt;
Component.videoForegin = new videoForeign();
Component.videoEmit = new videoEmit();
/**
 * 获取播放器
 * @param {String} id 播放器的id
 * @return {Element} 返回播放器
 */
(<any>vidoejs).getPlayer = (id: string) => {
    const play: any = Play.players;
    let tag;

    if (typeof id === "string") {
        const nid = normalizeId(id);
        const player = play[id];

        if (player) {
            return player
        }

        tag = document.getElementById(nid);

    } else {
        tag = id
    }

    if (Dom.isEl(tag)) {
        play[id] = tag;
        return tag;
    }

    Component.sendError({ message: `id为${id}的播放器不存在！` })
    return;
}

/**
 * 把video上面的属性粘贴过来
 * @param {HTMLVideoElement} el video的元素
 */
(<any>vidoejs).addoption = (el: HTMLVideoElement) => {
    Component.options_.loop = el&&el.loop?el.loop:Component.options_.loop;
    Component.options_.autoplay = el&&el.autoplay?el.autoplay: Component.options_.autoplay;
    Component.options_.preload = el&&el.preload?el.preload:Component.options_.preload;
    Component.options_.poster = el&&el.poster?el.poster:Component.options_.poster;
}
Component.videoForegin.operation.load = vidoejs

function vidoejs(id: string, option?: object, ready?: any) {
    let parentElement = document.getElementById(id).parentElement;
    parentElement.innerHTML = `
    <div class="main">
        <div class="live-player" id="live-player">               
            <video id="videojs" src="" controls >
            </video>
        </div>
    </div>
    `;
    let player = (<any>vidoejs).getPlayer(id);

    (<any>vidoejs).addoption(player);



    (<any>Component.options_) = Public.mergeOptions(opt, option);

    Component.languages = languages();

    const Componentplay = Component.getComponents("play");

    const tag = new Componentplay(player, option, ready);
}

export default vidoejs;


// 推流地址
// rtmp://p60ff766a.live.126.net/live/9d505d21ad7a47babdb8285f5d15547a?wsSecret=ae6b633d147ad14f09023b5e2ae12fde&wsTime=1547449734  
// 拉流地址(HTTP)
// http://flv60ff766a.live.126.net/live/9d505d21ad7a47babdb8285f5d15547a.flv?netease=flv60ff766a.live.126.net  
// 拉流地址(HLS)
// http://pullhls60ff766a.live.126.net/live/9d505d21ad7a47babdb8285f5d15547a/playlist.m3u8  
// 拉流地址(RTMP)
// rtmp://v60ff766a.live.126.net/live/9d505d21ad7a47babdb8285f5d15547a  



// 网页端口拉流地址
// 1、http://flv60ff766a.live.126.net/live/63666a6da1db4ba1b2e9e05c838f5cdc.flv?netease=flv60ff766a.live.126.net
// 2、rtmp://v60ff766a.live.126.net/live/63666a6da1db4ba1b2e9e05c838f5cdc
// 手机端拉流地址
// 1、http://pullhls60ff766a.live.126.net/live/63666a6da1db4ba1b2e9e05c838f5cdc/playlist.m3u8
