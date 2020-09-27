 import { contextmenu } from "../src/index"
let obj:any = {
    ele:document.getElementById("contextmenu"),
    callback:function(){
      console.log("右击了")
    },
    data:[
          {
            content:"<p>复制</p>",
            children:[],
            callback:function(ele:any){
              console.log("复制",ele)
            }
          },
          {
            content:"<p>粘贴</p>",
            children:[],
            callback:function(ele:any){
              console.log("粘贴",ele)
            }
          },
          {
            content:"<p>删除</p>",
            children:[],
            callback:function(ele:any){
              console.log("删除",ele)
            },
          },
          {
            content:"单元格格式",
            children:[
              {
                content:"合并单元格",
                children:[],
                callback:function(ele:any){
                  console.log("合并单元格",ele)
                }
              },
              {
                content:"拆分单元格",
                children:[],
                callback:function(ele:any){
                  console.log("粘贴",ele)
                }
              }
            ],
            callback:function(ele:any){
              console.log("单元格格式",ele)
            },
          }
    ]
  }
   contextmenu(obj)