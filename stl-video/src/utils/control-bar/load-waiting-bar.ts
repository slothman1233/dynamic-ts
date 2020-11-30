import Component from '../../component';


class loadWaitingBar extends Component {
    dom: any; //加载中的元素
    constructor(play: any, option: any, ready: any) {
        super(play, option, ready)
        this.create();
    }

    create() {
        if (Component.options_.loadWaitingDom) {
            this.dom = this.createEl('div', {
                className: "load-waiting",
            }, {}, Component.options_.loadWaitingDom)
        } else {
            this.dom = this.createEl('div', {
                className: "load-waiting",
                innerHTML: `                
                    <div class='loader-content'></div>                
                `
            })
        }
        document.getElementsByClassName('live-player')[0].appendChild(this.dom);
        Component.videoForegin.operation.hideCenterControl = function () {
            Component.options_.centerControlDom.hide(Component.options_.centerControlDom.dom)
        }
        Component.videoForegin.operation.showCenterControl = function () {
            Component.options_.centerControlDom.show(Component.options_.centerControlDom.dom)
        }
    }

}



Component.setComponents('loadWaitingBar', loadWaitingBar);
export default loadWaitingBar