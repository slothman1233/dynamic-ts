import { stlSwiper } from "../src/index"
let prevDom = document.getElementById("left_btn");
let nextDom = document.getElementById("right_btn");
new stlSwiper(document.getElementById("page"),{
    //slidesPerView:3,
    autoHeight:true,
     //autoplay:{},
     thumbs:{
         list:["第一个","<a>第二个</a>","第三个","第四个","第五个","第六个","第七个"],
         //thumbsPerview:2
     },
    //loop:true,
    //scrollBar:{dragSize:"50%"},
    //pagination:{}
    navigation:{
        nextEl:nextDom,
        prevEl:prevDom,
        autoHide:true
    },
    sliderEnd:function(){
        // if(this.item ==0 ){
        //     prevDom.className += " hide_btn"
        // }else if(this.item == this.length-1){
        //     nextDom.className += " hide_btn"
        // }else{
        //     nextDom.className = nextDom.className.replace(" hide_btn","")
        //     prevDom.className = prevDom.className.replace(" hide_btn","")
        // }
        // console.log(this.item,this.length)
    }
});