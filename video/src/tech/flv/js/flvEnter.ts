/* eslint-disable */

import cpu from './flv2fmp4';
// var cpu=require('chimee-flv2fmp4')

const temp = new cpu();
console.log(temp);
(<any>window).flvParse = {
    mp4File: null,
    succ: null,
    // ftyp_moov:null,
    tracks: [],
    baseTime: 0,
    setFlv(uint8, baseTime) {
        if ((<any>window).flvParse.baseTime != baseTime) {
            (<any>window).flvParse.baseTime = baseTime;
            temp.seek(baseTime);
        }
        if ((<any>window).mp4Init) {
            temp.onInitSegment = (<any>window).mp4Init;
        }
        if ((<any>window).onMediaSegment) {
            temp.onMediaSegment = (<any>window).onMediaSegment;
        }
        if ((<any>window).seekCallBack) {
            // temp.seekCallBack = window.se
            temp.seekCallBack = (<any>window).seekCallBack;
        }
        if ((<any>window).onMediaInfo) {
            temp.onMediaInfo = (<any>window).onMediaInfo;
        }
        return temp.setflv(uint8.buffer, baseTime);

        // 用来获取moov

    },
    setLocFlv(uin8) {
        return temp.setflvloc(uin8);
    }
};