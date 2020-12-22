import { stlSwiper } from "../src/index"
new stlSwiper(document.getElementById("page"),{
    //slidesPerView:3,
    //autoHeight:true,
     //autoplay:{},
     thumbs:{
         list:["第一个","<a>第二个</a>","第三个","第四个","第五个","第六个","第七个"],
         thumbsPerview:2
     },
     loop:true,
    scrollBar:{dragSize:"50%"},
    pagination:{}
});