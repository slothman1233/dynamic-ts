/**
 * 弹幕效果
 * @param barrage 
 */
import './index.less'
import { appendContent, createEl, remove } from '@stl/tool-ts/src/common/dom'

type barragerModel = {
  width?: number, //弹幕总宽度 默认 500
  img?: string, //图片 
  content: string, //弹幕内容
  close?: boolean, //显示关闭按钮 
  closeImg?: string, //关闭按钮图片地址
  top?: number, //距离顶部高度,单位px,默认随机
  speed?: number,//延迟,单位秒,默认6 
  color?: string,//颜色,默认白色 
  href?: string,//链接地址
  backgroundColor?: string //背景颜色
}

//初始化参数
type barragerInitModel = {
  parentId: string,  //容器id
  barrageHeight?: number  // 弹幕高度限制 
}

/**
 * 弹幕插件
 */
class barrager {
  barrage: barragerModel
  barrageHeight: number
  parentId: string // 承载的id
  constructor({ parentId, barrageHeight }: barragerInitModel) {
    if (!parentId) throw ("父级id不能为空")
    this.barrage = Object.assign({
      img: null, //图片 
      close: false, //显示关闭按钮 
      closeImg: '', //关闭按钮图片
      bottom: 0, //距离底部高度,单位px,默认随机
      speed: 6,//延迟,单位秒,默认6 
      color: '#fff',//颜色,默认白色 
      backgroundColor: '#fff'//背景颜色
    })
    this.parentId = parentId
    this.barrageHeight = barrageHeight

    if (!document.getElementById(this.parentId).style.position) {
      document.getElementById(this.parentId).style.position = 'relative'
    }

    document.getElementById(this.parentId).style.overflow = 'hidden'
  }

  /**
   * 添加弹幕
   */
  addBarrage(obj: barragerModel): any {
    const barrage = Object.assign({
      width: 500, //弹幕总宽度
      img: null, //图片 
      content: '',
      closeImg: '',
      close: false, //显示关闭按钮 
      top: 0, //距离顶部高度,单位px,默认随机
      speed: 6,//延迟,单位秒,默认6 
      color: '#fff',//颜色,默认白色 
      href: 'javascript:void(0)', //链接地址
      backgroundColor: null
    }, obj || {});



    var time = new Date().getTime();
    var barrager_id = 'barrage_' + time;
    var id = '#' + barrager_id;

    const parentDom: HTMLElement = document.getElementById(this.parentId)

    const div_barrager: HTMLElement = <HTMLElement>createEl('div', {
      id: barrager_id,
      className: 'barrage'
    })



    appendContent(parentDom, div_barrager)
    const window_height = parentDom.clientHeight
    const maxTop = this.barrageHeight && this.barrageHeight <= window_height - 50 ? this.barrageHeight : window_height - 50
    let top = Math.max((barrage.top == 0) ? Math.floor(Math.random() * maxTop) : barrage.top, 0);

    if (barrage.width) {
      div_barrager.style.width = barrage.width + 'px'
      div_barrager.style.transform = `translateX(${window_height}px)`
    }

    div_barrager.style.top = top + 'px';

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

    appendContent(document.querySelector(id + " .barrage_box .p"), content)

    content.style.color = barrage.color

    var i = window_height

    var looper = setInterval(barrager, barrage.speed);
    var maxleft = parseInt(barrage.width ? `-${barrage.width}` : `-500`)
    function barrager() {

      const thisDom = <HTMLElement>document.querySelector(id)
      if (!thisDom) { clearInterval(looper); return }
      if (i > maxleft) {
        i -= 1;

        thisDom.style.transform = `translateX(${i}px)`

      } else {
        remove(thisDom)
        clearInterval(looper)
        return false;
      }

    }

    div_barrager_box.onmouseover = function () {
      clearInterval(looper)
    }

    div_barrager_box.onmouseout = function () {
      looper = setInterval(barrager, barrage.speed);
    }

    let closeDom: HTMLElement = <HTMLElement>document.querySelector(id + '.barrage .barrage_box .close')
    if (barrage.close) {
      closeDom.onclick = function () {
        remove(document.querySelector(id))

      }
    }

  }

  /**
   * 删除所有弹幕
   */
  removeAll() {
    const parentDom: NodeListOf<HTMLElement> = document.querySelectorAll(`#${this.parentId} .barrage`)

    parentDom.forEach(child => {
      try {
        remove(child)
      } catch (err) { }
    })

  }

}


export default barrager