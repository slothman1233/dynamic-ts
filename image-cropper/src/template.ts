export const IMG_CROPPER_INPUT_TEMPLATE = 
`<div class="cropper-input-box">
    <input type="file" class="cropper-input" />
</div>`;
 export function IMG_CROPPER_BOX_TEMPLATE(type:number){
    return `<div class="cropper-container">
                <div class="cropper-wrap-box">
                    <div class="cropper-canvas"></div>
                </div>
                <div class="cropper-drag-box"></div>
                <div class="cropper-crop-box">
                    <span class="cropper-view-box"></span>
                    <span class="cropper-dashed dashed-h"></span>
                    <span class="cropper-dashed dashed-v"></span>
                    <span class="cropper-center"></span>
                    <span class="cropper-face"></span>
                    <span class="cropper-line line-e${type===1?"":" cropper-auto"}" data-action="e"></span>
                    <span class="cropper-line line-n${type===1?"":" cropper-auto"}" data-action="n"></span>
                    <span class="cropper-line line-w${type===1?"":" cropper-auto"}" data-action="w"></span>
                    <span class="cropper-line line-s${type===1?"":" cropper-auto"}" data-action="s"></span>
                    ${type===1?`<span class="cropper-point point-e" data-action="e"></span>
                                <span class="cropper-point point-n" data-action="n"></span>
                                <span class="cropper-point point-w" data-action="w"></span>
                                <span class="cropper-point point-s" data-action="s"></span>
                                <span class="cropper-point point-ne" data-action="ne"></span>
                                <span class="cropper-point point-nw" data-action="nw"></span>
                                <span class="cropper-point point-sw" data-action="sw"></span>
                                <span class="cropper-point point-se" data-action="se"></span>`
                            :""}
                </div>
            </div>`
 };
//样式表
export const IMG_CROPPER_STYLE_STRING = `.cropper-input-box{width:108px;height:86px;position:relative;left:50%;top:50%;transform:translate(-50%,-50%);
                                    background:url(https://imgs.wbp5.com/api/secrecymaster/html_up/2018/12/20181222150023236.png) no-repeat;background-size:100% 100%;}
                                .cropper-input-box .cropper-input{width:108px;height:86px;position:absolute;top:0;left:0;display:block;opacity:0;}
                                .cropper-container {font-size: 0;line-height: 0;position: relative;-webkit-user-select: none;-moz-user-select: none;
                                    -ms-user-select: none;user-select: none;direction: ltr;-ms-touch-action: none;touch-action: none;display:none;}
                                .cropper-container img {display: block;min-width: 0 !important;max-width: none !important;min-height: 0 !important;
                                    max-height: none !important;width: 100%;height: auto;image-orientation: 0deg}
                                .cropper-wrap-box,.cropper-canvas,.cropper-drag-box,.cropper-crop-box,.cropper-modal {
                                    position: absolute;top: 0;right: 0;bottom: 0;left: 0;}
                                .cropper-wrap-box {overflow: hidden;}
                                .cropper-drag-box {opacity: 0;background-color: #fff;}
                                .cropper-modal {opacity: .5;background-color: #000;} 
                                .cropper-view-box {display: block;overflow: hidden;width: 100%;height: 100%;outline: 1px solid #39f;outline-color: rgba(51, 153, 255, 0.75);} 
                                .cropper-dashed {position: absolute;display: block;opacity: .5;border: 0 dashed #eee}
                                .cropper-dashed.dashed-h {top: 33.33333%;left: 0;width: 100%;height: 33.33333%;border-top-width: 1px;border-bottom-width: 1px}
                                .cropper-dashed.dashed-v {top: 0;left: 33.33333%;width: 33.33333%;height: 100%;border-right-width: 1px;border-left-width: 1px}
                                .cropper-center {position: absolute;top: 50%;left: 50%;display: block;width: 0;height: 0;opacity: .75} 
                                .cropper-center:before,.cropper-center:after {position: absolute;display: block;content: ' ';background-color: #eee}
                                .cropper-center:before {top: 0;left: -3px;width: 7px;height: 1px}
                                .cropper-center:after {top: -3px;left: 0;width: 1px;height: 7px}  
                                .cropper-face,.cropper-line,.cropper-point {
                                    position: absolute;display: block;width: 100%;height: 100%;opacity: .1;}
                                .cropper-face {top: 0;left: 0;background-color: #fff;}
                                .cropper-line {background-color: #39f}
                                .cropper-line.line-e {top: 0;right: -3px;width: 5px;cursor: e-resize}
                                .cropper-line.line-n {top: -3px;left: 0;height: 5px;cursor: n-resize}
                                .cropper-line.line-w {top: 0;left: -3px;width: 5px;cursor: w-resize}
                                .cropper-line.line-s {bottom: -3px;left: 0;height: 5px;cursor: s-resize}
                                .cropper-point {width: 5px;height: 5px;opacity: .75;background-color: #39f}
                                .cropper-point.point-e {top: 50%;right: -3px;margin-top: -3px;cursor: e-resize}
                                .cropper-point.point-n {top: -3px;left: 50%;margin-left: -3px;cursor: n-resize} 
                                .cropper-point.point-w {top: 50%;left: -3px;margin-top: -3px;cursor: w-resize}
                                .cropper-point.point-s {bottom: -3px;left: 50%;margin-left: -3px;cursor: s-resize}
                                .cropper-point.point-ne {top: -3px;right: -3px;cursor: ne-resize}
                                .cropper-point.point-nw {top: -3px;left: -3px;cursor: nw-resize}
                                .cropper-point.point-sw {bottom: -3px;left: -3px;cursor: sw-resize}
                                .cropper-point.point-se {right: -3px;bottom: -3px;width: 20px;height: 20px;cursor: se-resize;opacity: 1}  
                                @media (min-width: 768px) {
                                    .cropper-point.point-se {width: 15px;height: 15px}
                                }  
                                @media (min-width: 992px) { 
                                    .cropper-point.point-se {width: 10px;height: 10px}
                                }
                                @media (min-width: 1200px) {
                                    .cropper-point.point-se {width: 5px;height: 5px;opacity: .75}
                                }
                                .cropper-point.point-se:before {
                                    position: absolute;right: -50%;bottom: -50%;display: block;width: 200%;height: 200%;content: ' ';opacity: 0;background-color: #39f
                                }  
                                .cropper-invisible {opacity: 0;} 
                                .cropper-bg {
                                    background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAAA3NCSVQICAjb4U/gAAAABlBMVEXMzMz////TjRV2AAAACXBIWXMAAArrAAAK6wGCiw1aAAAAHHRFWHRTb2Z0d2FyZQBBZG9iZSBGaXJld29ya3MgQ1M26LyyjAAAABFJREFUCJlj+M/AgBVhF/0PAH6/D/HkDxOGAAAAAElFTkSuQmCC');
                                }
                                .cropper-hide {position: absolute;display: block;width: 0;height: 0;}
                                .cropper-hidden {display: none !important;}
                                .cropper-move {cursor: move;}
                                .cropper-auto{cursor:auto !import;}
                                .cropper-crop {cursor: crosshair; }
                                .cropper-disabled .cropper-drag-box,.cropper-disabled .cropper-face,.cropper-disabled .cropper-line,.cropper-disabled .cropper-point {cursor: not-allowed;} `;
