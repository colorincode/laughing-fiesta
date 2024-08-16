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
// import {scrollEvent} from "./scrollhandler";
import { listenForFlip, killFlip, initSize} from "./grid";
import {EventDispatcher} from "./shared/eventdispatch";
import {videoScreenChange} from "./videohandlers";
// import {modal} from "./modal"
import { initEvents,callAfterResize } from './flipvideos';
import { LoadVideoAssets } from './videohandlers';
import {scrollEvent , scrollInit}  from './scrollhandler';


const navigation = new Navigation();
const animationHandler = new AnimationHandler();


// const scroll = new scrollEvent();
const parentGrid = document.querySelector('.homegrid__container');
// const modalOpen = document.querySelector('.modal-overlay');
// const modalNew = new modal();



const eventDispatcher = new EventDispatcher();
const onClick = () => {
    // console.log("click fired from app");
    animationHandler.setupGSAPtl();
    navigation.checkforAnimation();
    listenForFlip();
    initEvents();




};
const onDOMContentLoaded = () => {
    navigation.setupNavigationEvents();
    // initSize();
    LoadVideoAssets();

    listenForFlip();
    initEvents();
  

};

const onChange = () => {
    videoScreenChange();
}

const onResize = () => {
    callAfterResize();
    killFlip();
    listenForFlip();
    LoadVideoAssets();
}

const onScroll = () => {
//    scrollInit();


}


// use the dispatcher, this should not need editing 
eventDispatcher.addEventListener("DOMContentLoaded", onDOMContentLoaded);
eventDispatcher.addEventListener("click", onClick);
eventDispatcher.addEventListener("fullscreenchange",onChange);
eventDispatcher.addEventListener("resize",onResize);
eventDispatcher.addEventListener("scroll",onScroll);


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

