//import libs 
import gsap from 'gsap';
import EasePack from 'gsap/EasePack';
import { Power4 } from 'gsap/gsap-core';
import Observer from 'gsap/Observer';
//gsap registration, global scope
gsap.registerPlugin(Power4);
gsap.registerPlugin(EasePack);
gsap.registerPlugin(Observer);
// component deps
import "./shared/header";
import {Navigation} from "./shared/nav";
// import {scrollEvent} from "./scrollhandler";
import { listenForFlip, killFlip} from "./grid";
import {EventDispatcher} from "./shared/eventdispatch";
import {videoScreenChange} from "./videohandlers";
// import {modal} from "./modal"
import { initEvents,callAfterResize } from './flipvideos';
import { LoadVideoAssets } from './videohandlers';
// import { scrollInit}  from './project-showcase';
import { Canvas } from './Canvas'

const navigation = new Navigation();
// const animationHandler = new AnimationHandler();


// const scroll = new scrollEvent();
const parentGrid = document.querySelector('.homegrid__container');
const canvasElement = document.querySelector<HTMLCanvasElement>('.webgl-canvas');
// const modalOpen = document.querySelector('.modal-overlay');
// const modalNew = new modal();
function loadCanvas() {
  if (canvasElement) {
    const canvas = new Canvas(canvasElement);
    eventDispatcher.addEventListener('beforeunload', () => {
      canvas.dispose();
    });
  }
}
function smoothLinkClick(e: MouseEvent) {

  e.preventDefault();

 let targetUrl = e.currentTarget.getAttribute('href');
  // Create GSAP animation
  gsap.to("body", {
      opacity: 0,
      duration: 0.5,
      onComplete: () => {
          window.location.href = targetUrl;
      }
  });

}


const eventDispatcher = new EventDispatcher();
const onClick = () => {
    // console.log("click fired from app");
    // animationHandler.setupGSAPtl();
    navigation.checkforAnimation();
    // listenForFlip();
    // initEvents();




};
const onDOMContentLoaded = () => {
    navigation.setupNavigationEvents();
    LoadVideoAssets();
    listenForFlip();
    loadCanvas();
    initEvents();
    // initShadowGrid();
    document.body.style.visibility = 'visible';

};

const onChange = () => {
    // videoScreenChange();
}

const onResize = () => {
    callAfterResize();
    killFlip();
    listenForFlip();
    // LoadVideoAssets();
    console.clear();
}

const onScroll = () => {
//  scrollInit();
// let homegridObserve = document.querySelector("homegrid__container");
// if (homegridObserve) {
// Observer.create({
//   type: 'wheel,touch,pointer',
//   preventDefault: true,
//   wheelSpeed: -1,
//   onChange: function(e) {
//   console.log("scroll change");
//   },
//   onStop: () => {
//     console.log('scroll stopped');
//     // listenForFlip();
//   },
// });

// // ScrollTrigger.normalizeScroll(true);
// }

}


// use the dispatcher, this should not need editing 
eventDispatcher.addEventListener("DOMContentLoaded", onDOMContentLoaded);
eventDispatcher.addEventListener("click", onClick);
eventDispatcher.addEventListener("fullscreenchange",onChange);
eventDispatcher.addEventListener("resize",onResize);
// eventDispatcher.addEventListener("scroll",onScroll);
// eventDispatcher.removeEventListener("click", onClick);
// eventDispatcher.removeEventListener("click",LoadVideoAssets);







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

