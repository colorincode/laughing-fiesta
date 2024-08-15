//import libs 
import gsap from 'gsap';
import EasePack from 'gsap/EasePack';
import { Power4 } from 'gsap/gsap-core';

//gsap registration, global scope
gsap.registerPlugin(Power4);
gsap.registerPlugin(EasePack);

// component deps
import "./shared/header";
import {Navigation, AnimationHandler} from "./shared/nav";
import {scrollEvent} from "./scrollhandler";
import { listenForFlip, killFlip, initSize} from "./grid";
import {EventDispatcher} from "./shared/eventdispatch";
import {videoScreenChange} from "./videohandlers";


const navigation = new Navigation();
const animationHandler = new AnimationHandler();
// const scroll = new scrollEvent();



const eventDispatcher = new EventDispatcher();
const onClick = () => {
    // console.log("click fired from app");
    animationHandler.setupGSAPtl();
    navigation.checkforAnimation();
    listenForFlip();
    if (navigation.isClassActive('is-animating')) {
        killFlip();
    }
};
const onDOMContentLoaded = () => {
    navigation.setupNavigationEvents();
    initSize();
    listenForFlip();

};

const onChange = () => {
    videoScreenChange();
}

// use the dispatcher, this should not need editing 
eventDispatcher.addEventListener("DOMContentLoaded", onDOMContentLoaded);
eventDispatcher.addEventListener("click", onClick);
eventDispatcher.addEventListener("fullscreenchange",onChange)
// eventDispatcher.addEventListener("click",shuffleGridBack);

// Later, if you need to remove specific event listeners
// eventDispatcher.removeEventListener("DOMContentLoaded", onDOMContentLoaded);
// eventDispatcher.removeEventListener("click", onClick);

// Or dispose of all event listeners when they are no longer needed
// eventDispatcher.dispose();
// const loaded = () => {
//     document.addEventListener("DOMContentLoaded", () => {
//         navigation.setupNavigationEvents();
//         shuffle();  


//     })
// }

