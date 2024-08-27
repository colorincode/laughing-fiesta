//import jquery , will need this for build to compile correctly when using jquery
import * as jquery from 'jquery';
(window as any).$ = (window as any).jQuery = jquery;


import gsap from 'gsap'
// import TextPlugin from 'gsap/TextPlugin';
import { Flip } from 'gsap/Flip';
import Draggable from 'gsap/Draggable';
import ScrollTrigger from 'gsap/ScrollTrigger';
import ScrollToPlugin from 'gsap/ScrollToPlugin';
import EasePack from 'gsap/EasePack';
import {Power3,Power2,Power1, Power4 } from 'gsap/gsap-core';

import Observer from 'gsap/Observer';
// import { sqrt, MathCollection , create, all, string} from 'mathjs';
import Timeline from 'gsap/all';
import  Tween  from 'gsap/src/all';
import Lenis from 'lenis';
import { OverlayScrollbars, ClickScrollPlugin } from 'overlayscrollbars';
import { listenForFlip, killFlip} from "./grid";
import { initEvents,callAfterResize } from './flipvideos';
import '../scss/overlayscrollbars.css';
import {EventDispatcher} from "./shared/eventdispatch";
gsap.registerPlugin(Flip);
gsap.registerPlugin(Draggable);
gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(Observer);
gsap.registerPlugin(ScrollToPlugin);
gsap.registerPlugin(Draggable);
// gsap.registerPlugin(ScrollSmoother);
gsap.defaults({ease: "power3"});
gsap.set(".box", {x: 100});


console.log("scroller loaded");
// Lenis

const lenis = new Lenis({
	orientation: 'horizontal',
   easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
	syncTouch: true,
	smoothTouch: true,
   infinite: true,

   smooth: true,
	gestureOrientation: ScrollTrigger.isTouch ? 'horizontal' : 'vertical',
})
function raf(time: any) {
   lenis.raf(time);
   requestAnimationFrame(raf);
 }

lenis.on('scroll', ScrollTrigger.update)

gsap.ticker.add(time => {
	lenis.raf(time * 1000)
})

gsap.ticker.lagSmoothing(0)
// Overlay Scrollbar
OverlayScrollbars.plugin(ClickScrollPlugin)

OverlayScrollbars(document.body, {
	overflow: { y: 'hidden' },
	scrollbars: { theme: 'os-theme-light', autoHide: 'scroll', clickScroll: true },
})

// ScrollTrigger.batch(".box", {
//   //interval: 0.1, // time window (in seconds) for batching to occur. 
//   //batchMax: 3,   // maximum batch size (targets)
//   onEnter: batch => gsap.to(batch, {opacity: 1, x: 0, stagger: {each: 0.15, grid: [8, 12]}, }),
//   onLeave: batch => gsap.set(batch, {opacity: 0, x: -100, }),
//   onEnterBack: batch => gsap.to(batch, {opacity: 1, x: 0, stagger: 0.15, }),
//   onLeaveBack: batch => gsap.set(batch, {opacity: 0, x: 100, })
//   // you can also define things like start, end, etc.
// });




let scrollInit = () => {
   Observer.create({
      type: "wheel,touch,pointer",
      preventDefault: true,
      wheelSpeed: -1,
      
      onStop: () => {
       console.log("stopped");
       killFlip();
       listenForFlip();
       let animating = false;
      },
      });
   ScrollTrigger.normalizeScroll(true); // enable
// ScrollTrigger.normalizeScroll(false); // disable

let normalizer = ScrollTrigger.normalizeScroll(); // gets the Observer instance that's handling normalization (if enabled, of course)
      // ScrollTrigger.defaults({});

      // gsap.defaults({
      //    ease: "power4.easeInOut",

      // });
      ScrollTrigger.create({
      trigger: ".homegrid__container",
      // markers: true,
      // start: "center center",
      // end: "+=500",
      markers: true,
      start: "left left",
      end: "+=3000", // Adjust the value based on the total width of the grid items
      onUpdate: (self) => console.log("direction:", self.direction),
    });
   }
   // const tracks = document.querySelectorAll(".outer__wrapper");
   if (ScrollTrigger.isTouch) {
      // any touch-capable device...
    }
    
    // or get more specific:
    if (ScrollTrigger.isTouch === 1) {
      // touch-only device
    }
   // x: () => -trackWrapperWidth() + window.innerWidth, {
      if (ScrollTrigger.isScrolling()) {
         // do something if scrolling
         console.log("scrolling");

       }

       const onScroll = () => {
         // console.log("scrolling");
     
         ScrollTrigger.batch(".box", {
           interval: 0.1,
           onEnter: batch => gsap.to(batch, {
             opacity: 1,
             x: 0,
             position:'relative',
             stagger: {
               each: 0.15,
               grid: [8, 12],
            
             },
           }),
           onLeave: batch => gsap.set(batch, {
             opacity: 0,
             x: -200,
           }),
           onEnterBack: batch => gsap.to(batch, {
             opacity: 1,
             x: 0,
             stagger: 0.15,
           }),
           onLeaveBack: batch => gsap.set(batch, {
             opacity: 0.5,
             x: 100,
           }),
         });
       };
     
       ScrollTrigger.addEventListener("scrollStart", onScroll);
     
   // ScrollTrigger.batch(".box", {
   //  interval: 0.1, // time window (in seconds) for batching to occur. 
   //    //batchMax: 3,   // maximum batch size (targets)
     

   //    onEnter: batch => gsap.to(batch, {
   //       opacity: 1, 
   //       x: 0, 
   //       stagger: {
   //          each: 0.15, 
   //          grid: [8, 12]}, 
   //          // clearTargets: true, 
   //          //  clearProps: "all", 
   //       }),
   //    onLeave: batch => gsap.set(batch, {
   //       opacity: 0, 
   //       // clearProps: "all", 
   //       x: -100, 
   //    }),
   //    onEnterBack: batch => gsap.to(batch, {
   //       opacity: 1,
   //       x: 0, 
   //        stagger: 0.15, }),
   //    onLeaveBack: batch => gsap.set(batch, {
   //       opacity: 0, 
   //       x: 100, 
   //    }),
   //    // onUpdate: batch => gsap.set(batch, {
   //    //     console.log("is scrolling", batch),

   //    //    }),

   //  });
    
   

const eventDispatcher = new EventDispatcher();
const onDOMContentLoaded = () => {

}
const onClick = () => {
   // console.log("click fired from app");
   // animationHandler.setupGSAPtl();
   // navigation.checkforAnimation();
   listenForFlip();
   initEvents();




};
// const onScroll = () => {
//      scrollInit();
   
   
//    }

const onRefresh = () => {
   ScrollTrigger.refresh();
   // when ScrollTrigger does a refresh(), it maps all the positioning data which 
// factors in transforms, but in this example we're initially setting all the ".box"
// elements to a "y" of 100 solely for the animation in which would throw off the normal 
// positioning, so we use a "refreshInit" listener to reset the y temporarily. When we 
// return a gsap.set() in the listener, it'll automatically revert it after the refresh()!
// ScrollTrigger.addEventListener("refreshInit", () => gsap.set(".box", {y: 0}));
}
eventDispatcher.addEventListener("refresh", onRefresh);
eventDispatcher.addEventListener("DOMContentLoaded", onDOMContentLoaded);
eventDispatcher.addEventListener("scroll",scrollInit);
// export function scrollInit() {
//     const tl1 = () => {
//         let sections = gsap.utils.toArray(".track");
//         gsap.to(sections, {
//             xPercent: -100 * (sections.length - 1),
//             ease: "none",
//             scrollTrigger: {
//                 trigger: ".sticky-element",
//                 markers: true,
//                 // pin: true,
//                 scrub: 1,
//                 snap: 1 / (sections.length - 1),
//                 end: () => "+=" + (sections.length - 1) * window.innerWidth,
//             },
//         });
//     }
//     const logo = document.querySelector("topbar--svg");
//     const lenis = new Lenis({
//         duration: 1.2,
//         easing: (t:any) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
//         direction: 'horizontal', // vertical, horizontal
//         gestureDirection: 'horizontal', // vertical, horizontal, both
//         smooth: true,
//         smoothTouch: true,
//         prevent: (node: any) => node.id === logo,

//     })
//     function raf(time:any) {
//         lenis.raf(time);
//         requestAnimationFrame(raf);
//     }
//     lenis.on('scroll', ScrollTrigger.update);
//     gsap.ticker.add((time)=>{
//         lenis.raf(time * 1000);
//     })
  
//     gsap.ticker.lagSmoothing(0)

//     ScrollTrigger.defaults({});
// }


// let target = 0;
// let current = 0;
// let ease = 0.075;

// const slider = document.querySelector(".slider");
// const sliderWrapper = document.querySelector(".slider-wrapper");
// const slides = document.querySelectorAll(".slide");

// let maxScroll = sliderWrapper.offsetWidth - window.innerWidth;

// function lerp(start, end, factor) {
//   return start + (end - start) * factor;
// }

// function updateScaleAndPosition() {
//   slides.forEach((slide) => {
//     const rect = slide.getBoundingClientRect();
//     const centerPosition = (rect.left + rect.right) / 2;
//     const distanceFromCenter = centerPosition - window.innerWidth / 2;

//     let scale, offsetX;
//     if (distanceFromCenter > 0) {
//       scale = Math.min(1.75, 1 + distanceFromCenter / window.innerWidth);
//       offsetX = (scale - 1) * 300;
//     } else {
//       scale = Math.max(
//         0.5,
//         1 - Math.abs(distanceFromCenter) / window.innerWidth
//       );
//       offsetX = 0;
//     }

//     gsap.set(slide, { scale: scale, x: offsetX });
//   });
// }

// function update() {
//   current = lerp(current, target, ease);

//   gsap.set(".slider-wrapper", {
//     x: -current,
//   });

//   updateScaleAndPosition();

//   requestAnimationFrame(update);
// }
// window.addEventListener("resize", () => {
//   maxScroll = sliderWrapper.offsetWidth - window.innerWidth;
// });

// window.addEventListener("wheel", (e) => {
//   target += e.deltaY;
//   target = Math.max(0, target);
//   target = Math.min(maxScroll, target);
// });

// update();

     // let tl1 = gsap.timeline({
        //     scrollTrigger: {
        //         trigger: "#trigger",
        //         scrub: true,
        //         start: "5% top",
        //         end: "bottom bottom"
        //     }
        // });
    
        // tl1.to(".grow", {
        //     scale: 2
        // });
    
        // let tl2 = gsap.timeline({
        //     scrollTrigger: {
        //         trigger: "#trigger",
        //         scrub: true,
        //         start: "5% top",
        //         end: "bottom bottom"
        //     }
        // });
    
        // tl2.to(".spin", {
        //     rotate: 700
        // });