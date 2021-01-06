/**
 * 弹幕效果
 * @param barrage 
 */
import './index.less'
import { appendContent, createEl, remove } from '@stl/tool-ts/src/common/dom'
import { mergeOptions } from '@stl/tool-ts/src/common/compatible'
import '@stl/tool-ts/src/common/es6'
import { NodeListToArray } from '@stl/tool-ts/src/common/obj'
type barragerModel = {
  //width?: number, //弹幕总宽度 默认 500
  img?: string, //图片 
  content: string, //弹幕内容
  close?: boolean, //显示关闭按钮 
  closeImg?: string, //关闭按钮图片地址
  //top?: number, //距离顶部高度,单位px,默认随机
  speed?: number,//延迟,单位秒,默认6 
  color?: string,//颜色,默认白色 
  href?: string,//链接地址
  backgroundColor?: string, //背景颜色
  barragerSpace?: number //弹幕间的间距 //默认50
  beforeCallback?: (dom: HTMLElement) => void //当前弹幕出来前的回调  当前的dom弹幕元素
}

//初始化参数
type barragerInitModel = {
  parentId: string,  //容器id
  barrageHeight?: number  // 弹幕高度限制 
  childHeight?: number //弹幕单条数据高度 默认44

}

/**
 * 弹幕插件
 */
class barrager {
  barrage: barragerModel
  barrageHeight: number
  parentId: string // 承载的id
  barragerPool: Array<any>
  maxBarragerPool: number //最大排数
  randomCache: Array<Boolean> = [] //各排弹幕的状态
  childBaragerFunction: Array<any> = []
  domHeight: number = 44
  constructor({ parentId, barrageHeight, childHeight = 44 }: barragerInitModel) {
    if (!parentId) throw ("父级id不能为空")
    this.domHeight = childHeight
    this.barrage = mergeOptions({
      close: false, //显示关闭按钮 
      closeImg: '', //关闭按钮图片
      bottom: 0, //距离底部高度,单位px,默认随机
      speed: 6,//延迟,单位秒,默认6 
      color: '#fff',//颜色,默认白色 
      backgroundColor: '#fff',//背景颜色
      barragerSpace: 50
    })
    this.parentId = parentId
    this.barrageHeight = barrageHeight
    this.barragerPool = []
    if (!document.getElementById(this.parentId).style.position) {
      document.getElementById(this.parentId).style.position = 'relative'
    }

    const parentDom: HTMLElement = document.getElementById(this.parentId)

    document.getElementById(this.parentId).style.overflow = 'hidden'

    const window_height = parentDom.clientHeight

    const domHeight = this.domHeight

    const maxTop = this.barrageHeight && this.barrageHeight <= window_height ? this.barrageHeight : window_height

    this.maxBarragerPool = Math.floor(maxTop / domHeight)

    //设置默认都为空闲
    for (let i = 0; i < this.maxBarragerPool; i++) {
      this.randomCache[i] = false
      this.childBaragerFunction.push(this.barrages(i))
    }


  }
  /**
  * 添加弹幕
  */
  addBarrage(obj: barragerModel): any {
    let objs = this.deepCopy(obj)
    //超过显示的最大个数
    if (!this.isLeisure()) {
      this.barragerPool.push(objs)
    } else {
      let random = this.getRandomInt(this.maxBarragerPool)
      this.childBaragerFunction[random](objs)
    }
  }

  /**
  * 添加把弹幕添加在最前面
  */
  addBeforeBarrage(obj: barragerModel): any {
    let objs = this.deepCopy(obj)
    //超过显示的最大个数
    if (!this.isLeisure()) {
      this.barragerPool.unshift(objs)
    } else {
      let random = this.getRandomInt(this.maxBarragerPool)
      this.childBaragerFunction[random](objs)
    }
  }

  private barrages(random: number): any {
    const index = random
    const that = this
    return function (obj: barragerModel) {

      const parentId = that.parentId

      const barrage = mergeOptions({
        // width: 500, //弹幕总宽度
        content: '',
        closeImg: '',
        close: false, //显示关闭按钮 
        top: -1, //距离顶部高度,单位px,默认随机
        speed: 6,//延迟,单位秒,默认6 
        color: '#fff',//颜色,默认白色 
        href: 'javascript:void(0)', //链接地址
        backgroundColor: null,
        beforeCallback: null,
        barragerSpace: 50
      }, obj || {});

      ////////////////////////// 元素的创建  ////////////////////////////
      let time = new Date().getTime();
      let barrager_id = 'barrage_' + time;
      let id = '#' + barrager_id;
      const parentDom: HTMLElement = document.getElementById(parentId)

      const div_barrager: HTMLElement = <HTMLElement>createEl('div', {
        id: barrager_id,
        className: 'barrage'
      })

      div_barrager.style.transform = `translateX(${parentDom.clientWidth}px)`
      div_barrager.style.height = `${that.domHeight}px`
      div_barrager.style.lineHeight = `${that.domHeight}px`
      const div_barrager_box: HTMLElement = <HTMLElement>createEl('div', {
        className: 'barrage_box',

      })

      if (barrage.backgroundColor) {
        div_barrager_box.style.backgroundColor = barrage.backgroundColor
      }

      appendContent(div_barrager, div_barrager_box)

      if (barrage.img) {


        appendContent(div_barrager_box, createEl('a', {
          className: 'portrait z'
        }, {
          href: 'javascript:;'
        }))


        appendContent(document.querySelector(id + " .barrage_box .portrait"), createEl('img', {
          src: barrage.img
        }))

      }

      appendContent(div_barrager_box, createEl('div', {
        className: 'z p'
      }))

      if (barrage.close) {
        let colseDom: HTMLElement = <HTMLElement>createEl('div', {
          className: 'close z'
        })
        appendContent(div_barrager_box, colseDom)

        if (barrage.closeImg) {
          colseDom.style.backgroundImage = `url("${barrage.closeImg}")`
        }

      }

      const content: HTMLElement = <HTMLElement>createEl('a', {
        innerHTML: barrage.content
      }, {
        href: barrage.href
      })

      appendContent(parentDom, div_barrager)

      appendContent(document.querySelector(id + " .barrage_box .p"), content)

      content.style.color = barrage.color


      if (barrage.beforeCallback) {
        try { barrage.beforeCallback(div_barrager) } catch (err) { }
      }

      if (!div_barrager) return

      div_barrager.style.display = "inline-block"
      const thisDom = <HTMLElement>document.querySelector(id)
      thisDom.style.transform = `translateX(${parentDom.offsetWidth}px)`

      // let rdom = that.setTop(div_barrager, parentDom, barrage)
      div_barrager.style.top = Math.floor(index * that.domHeight) + 'px'

      that.barrager(parentDom, div_barrager, div_barrager_box, barrage, id, index)

      let closeDom: HTMLElement = <HTMLElement>document.querySelector(id + '.barrage .barrage_box .close')
      if (that.barrage.close) {
        closeDom.onclick = function () {
          remove(document.querySelector(id))

        }
      }


    }

  }

  //滚动动画处理
  private barrager(parentDom: HTMLElement, div_barrager: HTMLElement, div_barrager_box: HTMLElement, barrage: any, id: string, index: number) {
    let that = this
    let looper = setTimeout(interval, barrage.speed);
    let i = parentDom.offsetWidth

    let maxleft = -div_barrager.offsetWidth
    let oldpareWidth = parentDom.offsetWidth
    const thisDom = <HTMLElement>document.querySelector(id)
    div_barrager_box.onmouseover = function () {
      clearTimeout(looper)
    }

    div_barrager_box.onmouseout = function () {
      const thisDom = <HTMLElement>document.querySelector(id)
      thisDom.style.zIndex = '100000'
      looper = setTimeout(interval, barrage.speed);
    }

    function interval() {
      if (!thisDom) { clearInterval(looper); return }
      let parentWidth = parentDom.offsetWidth
      i -= oldpareWidth - parentWidth



      if (i > maxleft) {

        that.calculativeWidthAndaddBarrage(div_barrager, i, parentWidth, barrage, index)

        i -= 1;
        thisDom.style.transform = `translateX(${i}px)`
        looper = setTimeout(interval, barrage.speed);

        oldpareWidth = parentWidth

      } else {
        remove(thisDom)
        clearTimeout(looper)
        return false;
      }


    }



  }




  //计算宽度 让其可以连续但不重叠添加弹幕
  private calculativeWidthAndaddBarrage(barragerDom: HTMLElement, left: number, parentWidth: number, barrage: barragerModel, rdom: number) {
    let that = this
    let domWidth = barragerDom.offsetWidth

    if (parentWidth - left - barrage.barragerSpace !== domWidth) { return }
    if (that.barragerPool.length > 0) {
      let obj = that.barragerPool.shift();
      obj.top = rdom * that.domHeight
      that.childBaragerFunction[rdom](obj)
    }
    else {
      let index = that.randomCache[rdom];
      if (index === true) {
        that.randomCache[rdom] = false;
      }
    }

  }

  //获取不重复的随机数
  private getRandomInt(max: number) {
    let that = this

    if (max <= 0) {
      return 0
    }


    function getRandmon(): number {
      let randmon = Math.floor(Math.random() * Math.floor(max))
      if (that.randomCache[randmon] === true) {
        return getRandmon()
      }
      that.randomCache[randmon] = true
      return randmon

    }

    return getRandmon()
  }

  //是否有空闲的位置
  // false 为没有空闲
  private isLeisure() {
    return this.randomCache.length === this.maxBarragerPool && this.randomCache.indexOf(false) >= 0
  }

  // getRandmon(max: number) {
  //   return Math.floor(Math.random() * Math.floor(max))
  // }


  /**
   * 删除所有弹幕
   */
  removeAll() {
    const parentDom: Array<HTMLElement> = NodeListToArray(document.querySelectorAll(`#${this.parentId} .barrage`))
    
    parentDom.forEach(child => {
      try {
        remove(child)
      } catch (err) { }
    })
    this.barragerPool = []


    for (let i = 0; i < this.maxBarragerPool; i++) {
      this.randomCache[i] = false
    }

  }

  private deepCopy(obj: barragerModel): barragerModel {
    let result = {};
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (typeof obj[key] === 'object') {
          result[key] = this.deepCopy(obj[key]);   // 递归复制
        } else {
          result[key] = obj[key];
        }
      }
    }
    return <barragerModel>result;
  }

}


export default barrager