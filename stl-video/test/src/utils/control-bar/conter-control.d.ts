import Component from '../../component';
/**
 * 视频中间的元素 可以是进入直播间的快捷按钮 也可以是一些广告的容器元素
 */
declare class centerControl extends Component {
    dom: HTMLElement;
    constructor(play: any, option: any, ready: any);
    create(): void;
}
export default centerControl;
