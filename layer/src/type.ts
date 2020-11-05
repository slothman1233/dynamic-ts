export interface msgOption{
    icon?:number,
    iconColor?:string,
    time?:number,
}

export interface alertParameter{
    content:string,
    icon?:number,
    iconColor?:string,
    title?:string,
    autoClose?:boolean,
    time?:number,
    // bg?:boolean,
    btnStr?:string,
    btnCallback?:(ev:any)=>void,
    showCallback?:()=>void,
    endCallback?:()=>void,
}

export interface modalParameter{
    title:string,
    content:string,
    hasClose?:boolean,
    bg?:boolean,
    determineBtn?:boolean,
    determineText?:string,
    determineFn?:()=>void,
    cancelBtn?:boolean,
    cancelText?:string,
    cancelFn?:()=>void,
    showCallback?:()=>void,
    endCallback?:()=>void,
}
export interface openParameter extends modalParameter{
    type?:1|2,
    icon?:number,
    iconColor?:string,
}