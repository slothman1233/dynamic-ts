import Component from '../../component';
/**
 * 视频中间的元素 可以是进入直播间的快捷按钮 也可以是一些广告的容器元素
 */
class centerControl extends Component {
    dom: HTMLElement;
    constructor(play: any, option: any, ready: any) {
        super(play, option, ready)
        this.create();
    }
    create() {
        const parentElement = document.getElementsByClassName('live-player')[0];
        if (Component.options_.centerControlDom) {
            parentElement.appendChild(Component.options_.centerControlDom);
            let height = Component.options_.centerControlDom.clientHeight + 50;
            parentElement.removeChild(Component.options_.centerControlDom);
            this.dom = this.createEl('div', {
                className: "center-control",
            }, {}, Component.options_.centerControlDom)
            this.dom.style.top = ` calc(50% - ${height}px)`;

        } else {
            this.dom = this.createEl('div', {
                className: "center-control",
            });
            this.dom.style.top = ` calc(50%)`;
        }
        parentElement.appendChild(this.dom);
    }
}
Component.setComponents("centerControl", centerControl)
export default centerControl;