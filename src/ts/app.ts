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
import { on } from 'events';

const navigation = new Navigation();
let isMaskingAnimationRunning = false; // flag to not allow multiple animations to pile up
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
// function smoothLinkClick(e: MouseEvent) {

//   e.preventDefault();

//  let targetUrl = e.currentTarget.getAttribute('href');
//   // Create GSAP animation
//   gsap.to("body", {
//       opacity: 0,
//       duration: 0.5,
//       onComplete: () => {
//           window.location.href = targetUrl;
//       }
//   });

// }
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
let isLoaded = false;
let isLoadingAnimationEnd = false;
const tl = gsap.timeline({
  defaults: {
    ease: "power4.inOut",
    opacity:0,
  }
});

const loadingAnimation = () => {
  tl.from('.outer__wrapper', {
 

    autoAlpha: 0, //animate opacity from zero to one, and set visibility to inherit
    ease: "power4.in",
    // opacity: 1,
    stagger: 0,
    duration: 1,
    onInterrupt: () => {
    //set an interrupt protocol, if this animation fails to fire then nothing will be visible, it should rarely if ever have to be accessed
    tl.restart();
    },
    onComplete: () => { }
  })

 
  const figures = gsap.utils.toArray('.video--item')
  tl.fromTo(figures, 
    { 
      delay: 0.7, // we want to set this tl delay to fire just a little bit before our outer wrap ends
      // opacity: 0,	
      scale: 0, 
      duration: 0.6,
      stagger:0.1
    },
    {
      opacity: 1,	
      // delay: 1.45, //match the duration of the outer-wrapper 
      scale: 1, 
      autoAlpha: 1,
      stagger: 0.2,
      duration: 0.6,
    }
    )
}
const maskingAnimationTransition = () => {
    // tl.to(".maskingintro--element", {
  //   opacity: 0,
  //   duration: 1.15,
  //   ease: "power4.out",
  //   autoAlpha: 1,
  // }, 0)
  //   .then(() => {
//     setTimeout(() => {
//       isMaskingAnimationRunning = false;
//     }, 500);
//   });
}


//this must fire before the other event dispatchers, wont completely prevent bubbling
window.onload = (event) => {
  // console.log("page is fully loaded");
  loadingAnimation();
};
// projectmaskingAnimationTransition();
const eventDispatcher = new EventDispatcher();
const onClick = () => {
    // navigation.checkforAnimation();
};
const onDOMContentLoaded = () => {
    navigation.setupNavigationEvents();
    loadCanvas();
    LoadVideoAssets();
    initEvents();
    console.clear();

};

const onResize = () => {
    callAfterResize();
    // killFlip();
}

const onRefresh = () => {
  window.onload = (event) => {
    // console.log("page is fully loaded");
    loadingAnimation();
  };
  navigation.setupNavigationEvents();
  loadCanvas();
  LoadVideoAssets();
  initEvents();
  // document.body.style.visibility = 'visible';
  console.clear();
}

//before unload will really only be helpful in times of someone on a desktop clicking reload a lot
eventDispatcher.addEventListener('beforeunload', () => {
  killFlip();
  gsap.killTweensOf('.outer__wrapper');
  gsap.killTweensOf('.video--item');
  eventDispatcher.removeEventListener("click", onClick);
  eventDispatcher.removeEventListener("resize", onResize);
  console.clear();
});

// use the dispatcher, this should not need editing , windows elems separate from dom dispatches
eventDispatcher.addEventListener("refresh", onRefresh);
eventDispatcher.addEventListener("DOMContentLoaded", onDOMContentLoaded);
eventDispatcher.addEventListener("click", onClick);

eventDispatcher.addEventListener("resize",onResize);

