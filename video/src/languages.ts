import Component from './component'
import cn from './languages/cn';
import en from './languages/en';

export default (()=>{

    switch(Component.options_.languages){
        case 'en':
            return en;
        case "cn":
        default: 
            return cn;
    }


})



