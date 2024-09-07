//import libs 
import gsap, { SteppedEase} from 'gsap'
import Draggable from 'gsap/Draggable';
import EasePack from 'gsap/EasePack';
import { Power4 } from 'gsap/gsap-core';
import Observer from 'gsap/Observer';
import Timeline from 'gsap/all';
import  Tween  from 'gsap/src/all';
//gsap registration, global scope
gsap.registerPlugin(EasePack);
gsap.registerPlugin(Tween);
gsap.registerPlugin(SteppedEase);
gsap.registerPlugin(Timeline);
gsap.registerPlugin(Power4);
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
let isMaskingAnimationRunning = true; // flag to not allow multiple animations to pile up
const parentGrid = document.querySelector('.homegrid__container');
const canvasElement = document.querySelector<HTMLCanvasElement>('.webgl-canvas');

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
// function projectmaskingAnimationTransition() {
//   let tl = gsap.timeline();
//   tl.to(".maskingintro--element", {
//     opacity: 0,
//     duration: 1.65,
    
//     ease: "power4.out",
//     autoAlpha: 1,
//   }, 0)
//   .then(() => {
//     setTimeout(() => {
//       isMaskingAnimationRunning = false;
//     }, 500);
//   });
// }

// projectmaskingAnimationTransition();
const eventDispatcher = new EventDispatcher();
const onClick = () => {
    navigation.checkforAnimation();
};
const onDOMContentLoaded = () => {
    navigation.setupNavigationEvents();
   
    LoadVideoAssets();
    loadCanvas();
    initEvents();
    document.body.style.visibility = 'visible';
    console.clear();

};

const onChange = () => {
    // videoScreenChange();
}

const onResize = () => {
    callAfterResize();
    killFlip();
    console.clear();
}

const onScroll = () => {

}

// use the dispatcher, this should not need editing 
eventDispatcher.addEventListener("DOMContentLoaded", onDOMContentLoaded);
eventDispatcher.addEventListener("click", onClick);
eventDispatcher.addEventListener("fullscreenchange",onChange);
eventDispatcher.addEventListener("resize",onResize);

