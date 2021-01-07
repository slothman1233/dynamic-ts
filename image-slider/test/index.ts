import { imageSlider } from "./../src/index"

let imgSlider = new imageSlider({
    sliderWindowId:"slider_parent",
    // distance:540,
    // intervals:1500,

    distance:500,
    item:false,
    auto:false,
    time:500,
    hover:false,
    switchType:"out",
    switchCallback:function(type:any,distance:any,clickDom:HTMLElement,showDom:HTMLElement){
      showDom.style.display = "block"; 
      if(type==="1"){
        if(distance<=-2160)clickDom.style.display = "none";
       }else{
        if(distance>=0)clickDom.style.display = "none";
       }
    }
  })
  // let scrollSlider = new imageSlider({
  //   sliderWindowId:"scroll_parent",
  //   sliderDomId:"scroll_dom",
  //   sliderListName:"li",
  //   step:4,
  // })
  // let scrollSliders = new imageSlider({
  //   sliderWindowId:"scroll_parents",
  //   step:3,
  //   intervals:1000,
  //   item:false,
  //   switch:false,
  //   direction:"top"
  // })

  // let imgSliders = new imageSlider({
  //   sliderWindowId:"slider_parents",
  //   intervals:1500,
  //   time:1000,
  //   hover:false,
  //   switchType:"hover",
  //   direction:"bottom",
  //   sliderDomId:"slider_doms",
  //   sliderListName:".slider_list",
    
  // })

  // let imgSlidera = new imageSlider({
  //   sliderWindowId:"slider_parenta",
  //   auto:false,
  // })

