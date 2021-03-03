export function setTransformFn(dom:any,val:string){
    dom.style.transform = val;
    dom.style.MozTransform = val;
    dom.style.webkitTransform = val;
    dom.style.OTransform = val;
}
export function getTransformFn(dom:any){
    return window.getComputedStyle(dom,null).transform ||
            (<any>window.getComputedStyle(dom,null)).webkitTransform ||
            (<any>window.getComputedStyle(dom,null)).MozTransform ||
            (<any>window.getComputedStyle(dom,null)).OTransform;
}
export function setTransitionFn(dom:any,val?:number,type?:string){
    dom.style.transition = "all "+(val?val:0)+"ms "+(type?type:"ease")+" 0s";
    dom.style.MozTransition = "all "+(val?val:0)+"ms "+(type?type:"ease")+" 0s";
    dom.style.webkitTransition = "all "+(val?val:0)+"ms "+(type?type:"ease")+" 0s";
    dom.style.OTransition = "all "+(val?val:0)+"ms "+(type?type:"ease")+" 0s";
}