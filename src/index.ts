


import * as test from "./common/test"
class fxClass {
    constructor() {
        [
            (<any>test)
        ].forEach(k => {
            for (let i in k) {
                (<any>fxClass).prototype[i] = (<any>k[i]);
            }

        })
    }
}


export default new fxClass();
