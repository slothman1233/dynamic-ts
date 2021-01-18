import { actionsheet } from "./actionsheet/actionsheet";
import { canvasWrap } from "./canvasWrap/canvasWrap";
import "./index.less"
export default class fxClass {
    constructor() {
        [
            (<any>actionsheet),
            (<any>canvasWrap),

        ].forEach(k => {
            for (let i in k) {
                if ((<any>fxClass).prototype[i]) { new Error(``); }
                (<any>fxClass).prototype[i] = (<any>k[i]);
            }

        })
    }
}
export {
  actionsheet,
  canvasWrap,
};