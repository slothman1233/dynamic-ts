import Component from '../component';


class flash extends Component {
    constructor(play: any, option: any, ready: any) {
        super(play, option, ready);
        console.log('flash')
    }
}


Component.setComponents("flash", flash);
export default flash