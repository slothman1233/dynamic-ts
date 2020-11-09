import Component from '../../component';

class errorBar extends Component {
    dom: any;
    constructor(play: any, option: any, ready: any) {
        super(play, option, ready)
        this.create();
    }
    create() {
        if (Component.options_.errorDom) {
            this.dom = this.createEl('div', {
                className: "error-bar",
            }, {}, Component.options_.errorDom)
        } else {
            this.dom = this.createEl('div', {
                className: "error-bar",
                innerHTML: Component.languages.errorMessage.loadError
            });
        }
        document.getElementsByClassName('live-player')[0].appendChild(this.dom);
    }
}



Component.setComponents("errorBar", errorBar)
export default errorBar