
import Component from '../component';
class html5 extends Component {
    constructor(play:any, option:any, ready:any) {
        super(play, option, ready);
        let mode;
        if (this.options_.streamLink.mp4) {
            mode = Component.getComponents('mp4');
        }
        else if (this.options_.streamLink.flv) {
            mode = Component.getComponents('flv');
        } else if (this.options_.streamLink.hls) {
            mode = Component.getComponents('hls');
        } else {
            throw new Error(`${Component.languages.errorMessage.noStream}`);
        }
        return new mode(play, Component.options_);
    }
}
Component.setComponents("html5", html5);
export default html5