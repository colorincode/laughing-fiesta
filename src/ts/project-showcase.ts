


//import jquery , will need this for build to compile correctly when using jquery
import * as jquery from 'jquery';
(window as any).$ = (window as any).jQuery = jquery;

console.log("slider module loaded");
//gsap modules
import gsap, { SteppedEase, toArray } from 'gsap';
// import TextPlugin from 'gsap/TextPlugin';
import { Flip } from 'gsap/Flip';
import Draggable from 'gsap/Draggable';
import ScrollTrigger from 'gsap/ScrollTrigger';
import ScrollToPlugin from 'gsap/ScrollToPlugin';
import EasePack from 'gsap/EasePack';
import { Power4 } from 'gsap/gsap-core';
import Observer from 'gsap/Observer';
import SplitText from 'gsap/SplitText';
import Timeline from 'gsap/all';
import  Tween  from 'gsap/src/all';

import Lenis from 'lenis';
import {EventDispatcher} from "./shared/eventdispatch";
import {Navigation} from "./shared/nav";
import { Canvas } from './Canvas'
// import { url } from 'inspector';

const navigation = new Navigation();
const eventDispatcher = new EventDispatcher();
gsap.registerPlugin(EasePack, Tween, SteppedEase, Timeline, Power4, Flip, Draggable, ScrollTrigger, Observer, ScrollToPlugin);

const sections = gsap.utils.toArray(".sticky-element");
const images = gsap.utils.toArray(".track").reverse();
const slideImages = gsap.utils.toArray(".slider-video");
const outerWrappers = gsap.utils.toArray(".track-flex");
const innerWrappers = gsap.utils.toArray(".panel-wide");
const count = document.querySelector(".count");
const wrap = gsap.utils.wrap(0, sections.length);
const logo = document.querySelector(".topbar--global");
const videos = gsap.utils.toArray(document.querySelectorAll('.slider-video')) ;
let animating: boolean;
let currentIndex = 0;

// const canvasElement = document.querySelector<HTMLCanvasElement>('.webgl-canvas');
// if (canvasElement) {
//   const canvas = new Canvas(canvasElement);
//   window.addEventListener('beforeunload', () => {
//     canvas.dispose();
//   });
// }
let isMaskingAnimationRunning = true;
      function projectmaskingAnimationTransition() {
        // isMaskingAnimationRunning = true; // flag to not allow multiple animations to pile up
  
        let tl = gsap.timeline();
  
        tl.to(".maskingintro--element ", {
          y: "100%",
          opacity: 0,
          duration: 4.25,
          ease: "power1.out",
          stagger: {
            amount: 0.5,
            from: "random",
          },
        }, 0) // animation starts at beginning of timeline
        .then(() => {
          setTimeout(() => {
            isMaskingAnimationRunning = false;
          //  setupHashNav();
          }, 500);
        });
      }
  

// Create an Intersection Observer for video n text

let thumbText = gsap.utils.toArray(".panel-overlay-text");
let thumbtextTl = gsap.timeline(); //create the timeline
thumbtextTl.fromTo(thumbText, 
  { duration: 1.75, opacity: 1, ease: "power4.inOut", stagger:0.525 }, 
  { duration: 1.75, opacity: 0 , ease: "power4.inOut", stagger:0.525, delay:0.525
 },
 
);

const videoObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    const video = entry.target as HTMLVideoElement;
    const playPromise = video.play();
    if (entry.isIntersecting) {
      playPromise.then(_ => {
        // Automatic playback started!
        // Show playing UI.
     
  
      video.play();
      video.controls = true;
      video.autoplay = true;
      video.loop = true;

      thumbtextTl.restart();
      thumbtextTl.play();
    })
      .catch(error => {
        // Auto-play was prevented
        // Show paused UI.
      });


    } else {
      playPromise.then(_ => {
      video.pause();
      video.controls = false;
      video.autoplay = false;
      video.muted = true;
      video.loop = false;
    })
    .catch(error => {
      // Auto-play was prevented
      // Show paused UI.
    });
      // thumbtextTl.pause();
    }
  });
}, { threshold: 0.5 });

videos.forEach(video => {
  
  videoObserver.observe(video as HTMLVideoElement);
  thumbtextTl.play();


});
// let select = (e) => document.querySelector(e);
// let selectAll = (e) => document.querySelectorAll(e);


Observer.create({
 type: "wheel,touch,pointer",
 preventDefault: true,
 wheelSpeed: -1,
 
 onStop: () => {
  console.log("stopped");
  let animating = false;
  let playPromise = Promise.resolve();
 
  videos.forEach(video => {
    playPromise.then(_ => {
    (video as HTMLVideoElement).play();
    (video as HTMLVideoElement).controls = true;
    (video as HTMLVideoElement).autoplay = true;

    thumbtextTl.restart();

   })
    .catch(error => {
      // Auto-play was prevented
      // Show paused UI.
    });
  })
 },
 onUp: () => {
  console.log("down");
  if (animating) return;
  // gotoSection(currentIndex + 1, +1);
  if (animating) {
    videos.forEach(video => {
      (video as HTMLVideoElement).pause();
      (video as HTMLVideoElement).controls = false;
      (video as HTMLVideoElement).autoplay = false;
      (video as HTMLVideoElement).muted = true;
      thumbtextTl.reverse();
    });
}


 },
 onDown: () => {
  console.log("up");
  if (animating) return;
  // gotoSection(currentIndex - 1, -1);
  videos.forEach(video => {
    (video as HTMLVideoElement).pause();
    (video as HTMLVideoElement).controls = false;
    (video as HTMLVideoElement).autoplay = false;
    thumbtextTl.reverse();

  });
 },
 onChange: () => {
   if (animating) return;

  
 },
 tolerance: 10
});


const lenis = new Lenis({
  duration: 1.3,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smooth: true,
  smoothWheel: true,
  syncTouchLerp: true,
  syncTouch: true,
  // infinite: true,
  mouseMultiplier: 1,
  smoothTouch: false,
  touchMultiplier: 2,
  autoResize: true,
  prevent: (node) => node.id === 'elements',

});

function raf(time: any) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

// lenis.on('scroll', (e: any) => {
//   // console.log(e)
// })

// lenis.on('scroll', ScrollTrigger.update)

// gsap.ticker.add((time)=>{
//   lenis.raf(time * 1000);
  
// })

// gsap.ticker.lagSmoothing(0)

const track = document.querySelector('.track') as HTMLElement;
const panels = gsap.utils.toArray('.panel-wide');
// const colorArray = [
//   "#683A5E",
//   "#262626",
//   "#426F42",
//   "#8B814C",
//   "#36648B",
//   "#36648B"
// ];
const slides = document.querySelectorAll(".panel-wide");
const container = document.querySelector(".sticky-element");
let dur = 0.5;
let offsets = [];
let oldSlide = 0;
let activeSlide = 0;
let dots = document.querySelector(".thumbs");
let navDots = [];
let iw = window.innerWidth;
const mouseAnim = gsap.timeline({ repeat: -1, repeatDelay: 1 });
const handAnim = gsap.timeline({ repeat: -1, repeatDelay: 1 });
const cursorAnim = gsap.timeline({ repeat: -1, repeatDelay: 1 });
const arrowAnim = gsap.timeline({ repeat: -1, repeatDelay: 1 });

document.querySelector("#leftArrow").addEventListener("click", slideAnim);
document.querySelector("#rightArrow").addEventListener("click", slideAnim);

// set slides background colors and create the nav dots
for (let i = 0; i < slides.length; i++) {
  // gsap.set(slides[i], { backgroundColor: colorArray[i] });
  let newDot = document.createElement("div");
  newDot.className = "dot";
  newDot.index = i;
  navDots.push(newDot);
  newDot.addEventListener("click", slideAnim);
  dots.appendChild(newDot);
}

// icon animations for slide 1
// mouseAnim.fromTo(
//   "#mouseRings circle",
//   { attr: { r: 10 } },
//   { attr: { r: 40 }, duration: 0.8, stagger: 0.25 }
// );
// mouseAnim.fromTo(
//   "#mouseRings circle",
//   { opacity: 0 },
//   { opacity: 1, duration: 0.4, stagger:0.25 },
//   0
// );
// mouseAnim.fromTo(
//   "#mouseRings circle",
//   { opacity: 1 },
//   { opacity: 0, duration: 0.4, stagger:0.25 },
//   0.4
// );

// handAnim.to("#hand", { duration: 0.75, rotation: -10, transformOrigin: "center bottom" });
// handAnim.to("#hand", { duration: 0.5, rotation: 14, ease: "power3.inOut" });
// handAnim.to("#hand", { duration: 1, rotation: 0, transformOrigin: "center bottom" });

// cursorAnim.to("#cursor", { duration: 0.25, x: -22 });
// cursorAnim.to(
//   "#iconCircles circle",
//   0.5,
//   { duration: 0.5, attr: { r: 6 }, stagger:0.15 },
//   "expand"
// );
// cursorAnim.to("#cursor", { duration: 1.1, x: 40 }, "expand");
// cursorAnim.to("#cursor", { duration: 0.75, x: 0 }, "contract");
// cursorAnim.to("#iconCircles circle", { duration: 0.5, attr: { r: 4 } }, "contract");

// arrowAnim.to("#caret", {
//   duration: 0.5,
//   attr: { points: "60 30, 35 50, 60 70" },
//   repeat: 3,
//   yoyo: true,
//   ease: "power2.inOut",
//   repeatDelay: 0.25
// });

// get elements positioned
gsap.set(".thumbs", { xPercent: -50 });
gsap.set(".arrow", { yPercent: -50 });
gsap.set(".panel-overlay-text", { y: 30 });

// lower screen animation with nav dots and rotating titles
const dotAnim = gsap.timeline({ paused: true });
dotAnim.to(
  ".dot",
  {
    stagger: { each: 1, yoyo: true, repeat: 1 },
    scale: 2.1,
    rotation: 0.1,
    ease: "none"
  },
  0.5
);
dotAnim.to(
  ".title",
  slides.length + 1,
  { y: -(slides.length * 30), rotation: 0.01, ease: "none" },
  0
);
dotAnim.time(1);

// make the whole thing draggable
let dragMe = Draggable.create(container, {
  type: "x",
  edgeResistance: 1,
  snap: offsets,
  inertia: true,
  bounds: "#masterWrap",
  onDrag: tweenDot,
  onThrowUpdate: tweenDot,
  onDragEnd: slideAnim,
  allowNativeTouchScrolling: false,
  zIndexBoost: false
});

dragMe[0].id = "dragger";
sizeIt();

// main action check which of the 4 types of interaction called the function
function slideAnim(e) {
  oldSlide = activeSlide;
  // dragging the panels
  if (this.id === "dragger") {
    activeSlide = offsets.indexOf(this.endX);
  } else {
    if (gsap.isTweening(container)) {
      return;
    }
    // arrow clicks
    if (this.id === "leftArrow" || this.id === "rightArrow") {
      activeSlide =
        this.id === "rightArrow" ? (activeSlide += 1) : (activeSlide -= 1);
      // click on a dot
    } else if (this.className === "dot") {
      activeSlide = this.index;
      // scrollwheel
    } else {
      activeSlide = e.deltaY > 0 ? (activeSlide += 1) : (activeSlide -= 1);
    }
  }
  // make sure we're not past the end or beginning slide
  activeSlide = activeSlide < 0 ? 0 : activeSlide;
  activeSlide = activeSlide > slides.length - 1 ? slides.length - 1 : activeSlide;
  if (oldSlide === activeSlide) {
    return;
  }
  // if we're dragging we don't animate the container
  if (this.id != "dragger") {
    gsap.to(container, dur, { x: offsets[activeSlide], onUpdate: tweenDot });
  }
}

// update the draggable element snap points
function sizeIt() {
  offsets = [];
  iw = window.innerWidth;
  gsap.set("#panelWrap", { width: slides.length * iw });
  gsap.set(slides, { width: iw });
  for (let i = 0; i < slides.length; i++) {
    offsets.push(-slides[i].offsetLeft);
  }
  gsap.set(container, { x: offsets[activeSlide] });
  dragMe[0].vars.snap = offsets;
}

gsap.set(".hideMe", { opacity: 0 });
window.addEventListener("wheel", slideAnim);
window.addEventListener("resize", sizeIt);

// update dot animation when dragger moves
function tweenDot() {
  gsap.set(dotAnim, {
    time: Math.abs(gsap.getProperty(container, "x") / iw) + 1
  });
}


// function gotoSection(index, direction) {
//   animating = true;
//   index = wrap(index);
 
//   let tl = gsap.timeline({
//    defaults: { duration: 3, ease: "expo.inOut" },
//    onComplete: () => {
//     animating = false;
//    }
//   });
//   currentIndex = index;
//  }
// function setupHorizontalScroll() {
//   //horizontal scroll thing
//   const tracks = selectAll(".sticky-element");
//   tracks.forEach((track, i) => {
//   let trackWrapper = track.querySelectorAll(".track");
//   let trackFlex = track.querySelectorAll(".track-flex");
//   let allImgs = track.querySelectorAll(".slider-video");
//   let progress = track.querySelectorAll(".progress--bar-total");
//   let sliders = gsap.utils.toArray(".panel-wide");
//   let thumbs = gsap.utils.toArray(".thumbs");
//   let visible = gsap.utils.toArray(".visible");

//   let trackWrapperWidth = () => {
//     let width = 0;
//     trackWrapper.forEach((el) => (width += el.offsetWidth));
//     return width;
//   };

//   let trackFlexWidth = () => {
//     let width = 0;
//     trackFlex.forEach((el) => (width += el.offsetWidth));
//     return width;
//   };
// //defaults and scroll tweener
//   ScrollTrigger.defaults({});
//     const scrollTween = gsap.to(trackWrapper, {
//       x: () => -trackWrapperWidth() + window.innerWidth,
//       scrollTrigger: {
//         trigger: track,
//         // pin: true,
//         anticipatePin: 1,
//         scrub: 1,
//         start: "center center",
//         pinSpacing:false,
//         // markers: true,
//         onEnter: () => {
//           console.log("scrolltrigger has entered");
//         },
//         onLeave: () => {
//           track.style.setProperty("--velocity", 0);
//         },
//         end: () => "+=" + (track.scrollWidth - window.innerWidth),
//         onRefresh: (self) => self.getTween().resetTo("totalProgress", 0),
//         invalidateOnRefresh: true,
//       },
//     });

//   gsap.defaults({
//     ease: "power4.easeInOut",

//   });
//   sliders.forEach((slider, i) => {
   

  
//     let anim = gsap.timeline({
//       scrollTrigger: {
//         trigger: slider,
//         containerAnimation: scrollTween,
//         start: "left right",
//         end: "right right",
//         scrub: true,
//       }
//     }).to(visible, {
//       width: "100%",
//       backgroundColor: "#000000",
//       ease: "power4.in"
//     });
//   });

//   sliders.forEach((slider, i) => {
//     if (thumbText[i]) {
//      slider = gsap.timeline({
//         scrollTrigger: {
//           trigger: trackWrapper,
//           containerAnimation: scrollTween,
//           start: "right right",
//           end: () => "+=" + (trackWrapperWidth() - window.innerWidth),
//           scrub: true
//         }
//       });
    
//     }

//   });

//   const tracks = selectAll(".sticky-element");

// });
//   const totalWidth = (panels as HTMLElement[]).reduce((acc, panel) => acc + panel.offsetWidth, 0);
//   const computedWidth = totalWidth / (panels as HTMLElement[]).length;

//   // panels.forEach((panel) => {
//   //    gsap.to(panels, {
//   //   x: () => "-45vw",
//   //   ease: "none",
//   //   scrollTrigger: {
//   //     trigger: track,
//   //     // pin: true,
//   //     scrub: 1,
//   //     end: () => "+=" + computedWidth,
//   //     // end: () => {innerWrappers.forEach((wrapper) => {
//   //     //   getComputedStyle(wrapper, "").getPropertyValue("")
//   //     // })}
//   //     invalidateOnRefresh: true
//   //   }
//   // });
//   // })
//   gsap.to(panels, {
//     x: () => `-${totalWidth - window.innerWidth}`,
//     ease: "none",
//     scrollTrigger: {
//       trigger: track,
//       // pin: true,
//       scrub: 1,
//       end: () => `+=${totalWidth}`,
//       invalidateOnRefresh: true
//     }
//   });
//   // gsap.to(panels, {
//   //   x: () => -totalWidth + window.innerWidth,
//   //   ease: "none",
//   //   scrollTrigger: {
//   //     trigger: track,
//   //     pin: true,
//   //     scrub: 1,
//   //     end: () => "+=" + totalWidth,
//   //     invalidateOnRefresh: true
//   //   }
//   // });
// }

function scrollToVideo(hash: string) {
  const video = document.querySelector(`[data-hashnav="#${hash}"]`) as HTMLElement;
  // if (video) {
    const panel = video.closest('.panel-wide') as HTMLElement;
    if (panel) {
      const track = document.querySelector('.track') as HTMLElement;
      const panels = gsap.utils.toArray('.panel-wide') as HTMLElement[];
      const panelIndex = panels.indexOf(panel);

      // total width needed for wrap
      const scrollPosition = panels.slice(0, panelIndex).reduce((acc, panel) => acc + panel.offsetWidth, 0);

      // viewport center
      const viewportCenter = window.innerWidth / 2;

      //target position to scroll to (center the video)
      const targetPosition = scrollPosition - viewportCenter + (panel.offsetWidth / 2);

      gsap.to(track, {
        x: -targetPosition,
        duration: 1.2,
        ease: "power2.inOut",
        onStart: () => {
          console.log("scroll started:" + track.offsetWidth);
              //  end: () => "+=" + (track.scrollWidth - window.innerWidth),
        },
        onComplete: () => {
          console.log("Scroll completed");
          // ScrollTrigger.refresh();
          // lenis.isStopped;
        }
      });

      // Update the URL hash without triggering a scroll
      history.pushState(null, '', `#${hash}`);
    }
  }
// }


function setupHashNav() {
  const thumbnails = document.querySelectorAll('.thumbtext');
  thumbnails.forEach((thumb) => {
    thumb.addEventListener('click', (e) => {
      e.preventDefault();
      const target = e.currentTarget as HTMLAnchorElement;
      const hash = target.getAttribute('href')?.replace('#', '') || '';
      scrollToVideo(hash);
    });
  });
}
//       scrollToVideo(hash);
//     });
//   });
// }

function handleInitialHash() {
  if (window.location.hash) {
    const hash = window.location.hash.replace('#', '');
    scrollToVideo(hash);
  }
}

function setupVideoObservers() {
  const videos = document.querySelectorAll('.slider-video');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const video = entry.target as HTMLVideoElement;
      if (entry.isIntersecting) {
        video.play();
        video.controls = true;
        video.autoplay = true;
        video.loop = true;
      } else {
        video.pause();
        video.controls = false;
        video.autoplay = false;
        video.loop = false;
      }
    });
  }, { threshold: 0.5 });

  videos.forEach(video => observer.observe(video));
}

// Event listeners
window.addEventListener('DOMContentLoaded', () => {
  setupHashNav();
  handleInitialHash();
  setupVideoObservers();
//might be overkill
  if (window.location.hash) {
    scrollToVideo(window.location.hash);
  }
});

window.addEventListener('hashchange', () => {
  const hash = window.location.hash.replace('#', '');
  scrollToVideo(hash);
});




// function handleInitialHash() {
//   if (window.location.hash) {
//     const hash = window.location.hash.replace('#', '');
//     scrollToVideo(hash);
//   }
// }
// function setupHashNav() {
//   if (window.location.hash) {
//     const hash = window.location.hash.replace('#', '');
//     scrollToVideo(hash);
//   }

  
//   const thumbnails = document.querySelectorAll('.thumbtext');
//   thumbnails.forEach((thumb) => {
//     thumb.addEventListener('click', (e) => {
//       e.preventDefault();
//       const target = e.currentTarget as HTMLAnchorElement;
//       const hash = target.getAttribute('href')?.replace('#', '') || '';
//       window.location.hash = hash;
//       scrollToVideo(hash);
//     });
//   });
// }
const onScroll = () => {
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);
// scrollToVideo("");
  
  }

  const onDOMContentLoaded = () => {
    // setupHorizontalScroll();
    projectmaskingAnimationTransition() ;
    setupHashNav();
    handleInitialHash();
    handleExternalLinks();
    setupVideoObservers();
  //  if (animating = true ) {

  //  }
}
  

  const onClick = () => { 
    // setupHashNav();
    console.log("clicked");

  }
  window.addEventListener('hashchange', () => {
    const hash = window.location.hash.replace('#', '');
    scrollToVideo(hash);
  });

  window.addEventListener('resize', () => {
    ScrollTrigger.refresh();
  });
  // const eventDispatcher = new EventDispatcher();
// use the dispatcher, this should not need editing 
eventDispatcher.addEventListener("DOMContentLoaded", onDOMContentLoaded);
eventDispatcher.addEventListener("click", onClick);
eventDispatcher.addEventListener("scroll", onScroll);
window.addEventListener('hashchange', onScroll);



function handleExternalLinks() {
  if (window.location.hash) {
    const hash = window.location.hash.replace('#', '');
    scrollToVideo(hash);
  }
}



 
// const tracks = gsap.utils.toArray(".sticky-element");


// tracks.forEach((track, i) => {
//   // let track = gsap.utils.selector( ".track");
//   let trackWrapper = document.querySelectorAll(".track");
//   let trackFlex = document.querySelectorAll(".track-flex");
//   let allImgs = document.querySelectorAll(".image");
//   let progress = document.querySelectorAll(".progress--bar-total");

//   let sliders = gsap.utils.toArray(".panel-wide");
//   let thumbs = gsap.utils.toArray(".thumbs");


//   let visible = gsap.utils.toArray(".visible");

//   let trackWrapperWidth = () => {
//     let width = 0;
//     trackWrapper.forEach((el) => (width += el.offsetWidth));
//     return width;
//   };

//   let trackFlexWidth = () => {
//     let width = 0;
//     trackFlex.forEach((el) => (width += el.offsetWidth));
//     return width;
//   };

//   ScrollTrigger.defaults({});

//   gsap.defaults({
//     ease: "power4.easeInOut",

//   });

//   let scrollTween = gsap.to(trackWrapper, {
//     x: () => -trackWrapperWidth() + window.innerWidth,
//     scrollTrigger: {
//       trigger: track,
//       pin: true,
//       anticipatePin: 1,
//       scrub: 1,
//       start: "center center",
//       // markers: true,
//       // onUpdate: () => {
//       //   console.log("scroller updated")
//       // },
//       end: () => "+=" + (trackWrapperWidth() - window.innerWidth),
//       // onRefresh: (self) => self.getTween().resetTo("totalProgress", 0),
//       invalidateOnRefresh: true
//     }
//   });



//   sliders.forEach((slider, i) => {
   
// // slider = gsap.utils.selector('.slider') as any;
  
//     let anim = gsap.timeline({
//       scrollTrigger: {
//         trigger: slider,
//         containerAnimation: scrollTween,
//         start: "left right",
//         end: "right right",
//         scrub: true,
//       }
//     }).to(visible, {
//       width: "100%",
//       backgroundColor: "#000000",
//       ease: "power4.in"
//     });
//   });

//   sliders.forEach((slider, i) => {
//     if (thumbText[i]) {
//      slider = gsap.timeline({
//         scrollTrigger: {
//           trigger: trackWrapper,
//          containerAnimation: scrollTween,
//           start: "right right",
//           end: () => "+=" + (trackWrapperWidth() - window.innerWidth),
//           scrub: true
//         }
//       });
    
//     }

//   });

// });



// function scrollToVideo(hash: string) {
//  let trackWrapperWidth = window.innerWidth;
//   const video = document.querySelector(`[data-hashnav="#${hash}"]`) as HTMLElement;
 
//   if (video) {
//     const slider = video.closest('.panel-wide') as HTMLElement;
//     let sliderAnimation = gsap.to(slider, {
//     scrollTrigger: {
//       trigger: slider,
//       start: "left left",
//       end: ()=> "" + (slider.offsetWidth ),
//       scrub: true
//     }
//     })
//     console.log("Target video:", video);
//     console.log("Target slider:", slider);

//     const trackWrapper = document.querySelector(".track") as HTMLElement;
//     const sliders = gsap.utils.toArray(".panel-wide");
//     const thumbText = gsap.utils.toArray(".panel-overlay-text");
//     const visible = gsap.utils.toArray(".visible");

//     let trackWrapperWidth = () => {
//       let width = 0;
//       sliders.forEach((el: HTMLElement) => (width += el.offsetWidth));
//       return width;
//     };

//     let scrollTween = gsap.to(trackWrapper, {
//       x: () => -trackWrapperWidth() + window.innerWidth,
//       scrollTrigger: {
//         trigger: trackWrapper,
//         pin: true,
//         anticipatePin: 1,
//         scrub: 1,
//         start: "center center",
//         end: () => "+=" + (trackWrapperWidth() - window.innerWidth),
//         invalidateOnRefresh: true
//       }
//     });

//     sliders.forEach((sliderElement, i) => {
//       gsap.timeline({
//         scrollTrigger: {
//           trigger: sliderElement,
//           containerAnimation: scrollTween,
//           start: "left right",
//           end: "right right",
//           scrub: true,
//         }
//       }).to(visible[i], {
//         width: "100%",
//         backgroundColor: "#000000",
//         ease: "power4.in"
//       });

//       if (thumbText[i]) {
//         gsap.timeline({
//           scrollTrigger: {
//             trigger: trackWrapper,
//             containerAnimation: scrollTween,
//             start: "right right",
//             end: () => "+=" + (trackWrapperWidth() - window.innerWidth),
//             scrub: true
//           }
//         });
//       }
//     });

//     const sliderOffset = slider.offsetLeft;
//     console.log("Slider offset:", sliderOffset);

//     lenis.scrollTo(sliderOffset, {
//       offset: 0,
//       immediate: false,
//       duration: 1.2,
//       onComplete: () => {
//         console.log("Scroll completed");
//         console.log("Current scroll position:", lenis.scroll);
//         ScrollTrigger.refresh();
//       }
//     });

//     // Update the URL hash without triggering a scroll
//     history.pushState(null, '', `#${hash}`);
//     // if (slider) {
//     //    gsap.set(('.track'), {x:0,});
//     // //  gsap.quickSetter(slider, ".track", () => {})
//     //   // console.log("Scrolling to:", slider);
//     //   console.log("Target video:", video);
//     //   console.log("Target slider:", slider);
//     //   console.log("Slider offset:", slider.offsetLeft);
//     //   const sliderOffset = slider.offsetLeft;
//     //   lenis.scrollTo(sliderOffset, {
//     //     offset: 0,
//     //     immediate: false,
//     //     duration: 1.2,
        
//     //     onComplete: () => {

//     //       console.log("Scroll completed");
//     //       console.log("Current scroll position:", lenis.scroll);
//     //     }
//     //   });
//     //      // Update the URL hash without triggering a scroll
//     //      history.pushState(null, '', `#${hash}`);
//     // }
//   }
// }

// function scrollToVideo(hash: string) {
//   // if (!hash) {
//   //   console.log("No hash provided");
//   //   return;
//   // }

//   const video = document.querySelector(`[data-hashnav="#${hash}"]`) as HTMLElement;
//   if (video) {
//     const slider = video.closest('.panel-wide') as HTMLElement;
//     if (slider) {
//       console.log("Target video:", video);
//       console.log("Target slider:", slider);

//       const trackWrapper = document.querySelector(".track") as HTMLElement;
//       const sliders = gsap.utils.toArray(".panel-wide");
//       const thumbText = gsap.utils.toArray(".panel-overlay-text");
//       const visible = gsap.utils.toArray(".visible");

//       let trackWrapperWidth = () => {
//         let width = 0;
//         sliders.forEach((el: HTMLElement) => (width += el.offsetWidth));
//         return width;
//       };

//       let scrollTween = gsap.to(trackWrapper, {
//         x: () => -trackWrapperWidth() + window.innerWidth,
//         scrollTrigger: {
//           trigger: trackWrapper,
//           pin: true,
//           anticipatePin: 1,
//           scrub: 1,
//           start: "center center",
//           end: () => "+=" + (trackWrapperWidth() - window.innerWidth),
//           invalidateOnRefresh: true
//         }
//       });

//       sliders.forEach((sliderElement, i) => {
//         gsap.timeline({
//           scrollTrigger: {
//             trigger: sliderElement,
//             containerAnimation: scrollTween,
//             start: "left right",
//             end: "right right",
//             scrub: true,
//           }
//         }).to(visible[i], {
//           width: "100%",
//           backgroundColor: "#000000",
//           ease: "power4.in"
//         });

//         if (thumbText[i]) {
//           gsap.timeline({
//             scrollTrigger: {
//               trigger: trackWrapper,
//               containerAnimation: scrollTween,
//               start: "right right",
//               end: () => "+=" + (trackWrapperWidth() - window.innerWidth),
//               scrub: true
//             }
//           });
//         }
//       });

//       const sliderOffset = slider.offsetLeft;
//       console.log("Slider offset:", sliderOffset);

//       lenis.scrollTo(sliderOffset, {
//         offset: 0,
//         immediate: false,
//         duration: 1.2,
//         onComplete: () => {
//           console.log("Scroll completed");
//           console.log("Current scroll position:", lenis.scroll);
//           ScrollTrigger.refresh();
//         }
//       });

//       // Update the URL hash without triggering a scroll
//       history.pushState(null, '', `#${hash}`);
//     } else {
//       console.log("Slider not found for video:", video);
//     }
//   } else {
//     console.log("Video not found for hash:", hash);
//   }
// }
// Handle initial hash on page load
// function handleInitialHash() {
//   if (window.location.hash) {
//     const hash = window.location.hash.replace('#', '');
//     scrollToVideo(hash);
//   }
// }
// function setupHashNav() {
//   if (window.location.hash) {
//     const hash = window.location.hash.replace('#', '');
//     scrollToVideo(hash);
//   }

  
//   const thumbnails = document.querySelectorAll('.thumbtext');
//   thumbnails.forEach((thumb) => {
//     thumb.addEventListener('click', (e) => {
//       e.preventDefault();
//       const target = e.currentTarget as HTMLAnchorElement;
//       const hash = target.getAttribute('href')?.replace('#', '') || '';
//       window.location.hash = hash;
//       scrollToVideo(hash);
//     });
//   });
// }
// const onScroll = () => {

// scrollToVideo("");
  
//   }

//   const onDOMContentLoaded = () => {
//     projectmaskingAnimationTransition() ;
//     setupHashNav();
//     handleInitialHash();
//     handleExternalLinks();
//   //  if (animating = true ) {

//   //  }
// }
  

//   const onClick = () => { 
//     // setupHashNav();
//     console.log("clicked");

//   }
//   window.addEventListener('hashchange', () => {
//     const hash = window.location.hash.replace('#', '');
//     scrollToVideo(hash);
//   });
//   // const eventDispatcher = new EventDispatcher();
// // use the dispatcher, this should not need editing 
// eventDispatcher.addEventListener("DOMContentLoaded", onDOMContentLoaded);
// eventDispatcher.addEventListener("click", onClick);
// eventDispatcher.addEventListener("scroll", onScroll);
// window.addEventListener('hashchange', onScroll);



// function handleExternalLinks() {
//   if (window.location.hash) {
//     const hash = window.location.hash.replace('#', '');
//     scrollToVideo(hash);
//   }
// }



// function gotoSection(index, direction) {
//  animating = true;
//  index = wrap(index);

//  let tl = gsap.timeline({
//   defaults: { duration: 3, ease: "expo.inOut" },
//   onComplete: () => {
//    animating = false;
//   }
//  });
//  currentIndex = index;
// }
 