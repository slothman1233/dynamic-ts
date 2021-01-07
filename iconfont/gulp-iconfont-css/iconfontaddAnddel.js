
/*
    data.json  原始的iconfont对照
    data.imgAry  最新图片集合的数组
    data.firstGlyph 默认0xE001
*/

function iconfontaddAnddel(data){
   
var json  = data.json || {};
delete json[""];
var imgAry = data.imgAry || [];
imgAry.map((item,i)=>{//把数组里面的值全部字符串化
    imgAry[i] = item.replace('.svg','').toString();
})
var firstGlyph = data.firstGlyph ||0xE001;
var newJson = {};
//屏蔽掉原来已经有的图片对照
function isOverObject(firstGlyph){
    var Glyph = firstGlyph.toString(16).toUpperCase();
    if(!json[Glyph]) return
    var index = imgAry.indexOf(json[Glyph].toString());
    if(index >=0){
        imgAry.splice(index,1);
        newJson[Glyph] = json[Glyph];
    }
    
    delete json[Glyph];
}

//是否是空对象
function isEmptyObject(obj){
     for(var key in obj){
        return false
    };
   return true
};

while(!isEmptyObject(json)){
    isOverObject(firstGlyph++);
}

  
imgAry.map((item)=>{
    newJson[firstGlyph.toString(16).toUpperCase()] = item.toString();
    firstGlyph++;
})

return newJson

}

module.exports = iconfontaddAnddel;

