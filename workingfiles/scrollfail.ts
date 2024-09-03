//import jquery , will need this for build to compile correctly when using jquery
import * as jquery from 'jquery';
(window as any).$ = (window as any).jQuery = jquery;

import gsap from 'gsap'
import { Flip } from 'gsap/Flip';
import Draggable from 'gsap/Draggable';
import ScrollTrigger from 'gsap/ScrollTrigger';
import ScrollToPlugin from 'gsap/ScrollToPlugin';
import EasePack from 'gsap/EasePack';
import {Power3,Power2,Power1, Power4 } from 'gsap/gsap-core';
import Observer from 'gsap/Observer';
import Timeline from 'gsap/all';
import  Tween  from 'gsap/src/all';
// others
import Lenis from 'lenis';
import { OverlayScrollbars, ClickScrollPlugin } from 'overlayscrollbars';
import '../scss/overlayscrollbars.css';
import {EventDispatcher} from "./shared/eventdispatch";
import { LoadVideoAssets } from './videohandlers';
// console.log("scroller loaded");

class Scroll {
   time: any;
   animating: boolean;
   static isLoadingContent: boolean = false;
   static contentLoadCount: number = 0;
   static maxContentLoads: number = 6; // Adjust this value as needed
    constructor() {
      gsap.registerPlugin(Flip);
      gsap.registerPlugin(Draggable);
      gsap.registerPlugin(ScrollTrigger);
      gsap.registerPlugin(Observer);
      gsap.registerPlugin(ScrollToPlugin);
      gsap.registerPlugin(Draggable);
      gsap.registerPlugin(Power3);
      gsap.defaults({ease: "power3"});
      gsap.set(".box", {});
      OverlayScrollbars.plugin(ClickScrollPlugin);
      OverlayScrollbars(document.body, {})
      gsap.registerPlugin(Timeline);
      this.animating = true;
    }

      private static lenis: Lenis;
    
      public static init() {
         this.setupLenis();
         this.setupScrollTrigger();
         this.scrollActions();
         console.log("Scroll initialized");
       }
       
       private static setupLenis() {
         this.lenis = new Lenis({
           orientation: 'horizontal',
           gestureOrientation: 'horizontal',
           smoothWheel: true,
           wheelMultiplier: 1,
           smoothTouch: true,
           touchMultiplier: 2,
         });
       
         gsap.ticker.add((time) => {
           this.lenis.raf(time * 1000);
         });
       
         this.lenis.on('scroll', ScrollTrigger.update);
       }
       
      // private static setupLenis() {
      //   this.lenis = new Lenis({
      //     orientation: 'horizontal',
      //     gestureOrientation: 'horizontal',
      //     smoothWheel: true,
      //     wheelMultiplier: 1,
      //     smoothTouch: true,
      //     touchMultiplier: 2,
      //   });
    
      //   gsap.ticker.add((time) => {
      //     this.lenis.raf(time * 1000);
      //   });
    
      //   this.lenis.on('scroll', ScrollTrigger.update);
      // }
    
      private static setupScrollTrigger() {
        ScrollTrigger.defaults({});
        ScrollTrigger.scrollerProxy(document.body, {
          scrollLeft(value) {
            if (arguments.length) {
              this.lenis.scrollTo(value, { immediate: true });
            }
            return this.lenis.scroll;
          },
          getBoundingClientRect() {
            return {top: 0, left: 0, width: window.innerWidth, height: window.innerHeight};
          },
        });
      }
      static initializeBoxAnimations() {
         ScrollTrigger.batch(".box", {
           onEnter: batch => gsap.to(batch, {opacity: 1, x: 0, stagger: 0.15, overwrite: true}),
           onLeave: batch => gsap.to(batch, {opacity: 0, x: 100, overwrite: true}),
           onEnterBack: batch => gsap.to(batch, {opacity: 1, x: 0, stagger: 0.15, overwrite: true}),
           onLeaveBack: batch => gsap.to(batch, {opacity: 0, x: -100, overwrite: true})
         });
       }
       
       
      static start() {
         const sections = gsap.utils.toArray(".section");
         gsap.to(sections, {
           xPercent: -100 * (sections.length - 1),
           ease: "none",
           scrollTrigger: {
             trigger: ".homegrid__container",
             scrub: 1,
             end: () => "+=" + (sections.length - 1) * window.innerWidth,
           },
         });
       }

       static scrollActions() {
         const container = document.querySelector('.homegrid__container');
         const sections = gsap.utils.toArray('.section');
       
         gsap.to(sections, {
           xPercent: -100 * (sections.length - 1),
           ease: "none",
           scrollTrigger: {
             trigger: container,
             pin: true,
             scrub: 1,
             snap: 1 / (sections.length - 1),
             end: () => "+=" + container.offsetWidth,
             onUpdate: (self) => {
               this.lenis.scrollTo(self.progress * container.offsetWidth, { immediate: true });
             }
           }
         });
       
         this.initializeBoxAnimations();
       }
       
         // Animate boxes within sections
        
//   const contentSections = gsap.utils.toArray('.section');
//   const tl = gsap.timeline({
//     defaults: {
//       duration: sectionDuration,
//       ease: 'Power3.inOut',
//       paused: true,
//       clearProps: "all"
//     }
//   });

//   contentSections.forEach((section) => {
//            const boxes = gsap.utils.toArray('.box', section);
           
//            ScrollTrigger.batch(boxes, {
//              onEnter: batch => gsap.to(batch, {
//                opacity: 1, 
//                x: 0, 
//                stagger: 0.15,
//                overwrite: true
//              }),
//              onLeave: batch => gsap.to(batch, {
//                opacity: 0, 
//                x: 100, 
//                overwrite: true
//              }),
//              onEnterBack: batch => gsap.to(batch, {
//                opacity: 1, 
//                x: 0, 
//                stagger: 0.15,
//                overwrite: true
//              }),
//              onLeaveBack: batch => gsap.to(batch, {
//                opacity: 0, 
//                x: -100,
//                overwrite: true
//              })
//            });
//            ScrollTrigger.create({
//             trigger: section,
//             markers: true,
//             start: "center center",
//             end: "bottom center",
//             onEnter: () => tl.add(this.start),
//           });
//         });
      
//         tl.add(this.start, 0);
//       }
      
      static checkForContentLoad(scrollProgress: number) {
         console.log("Scroll progress:", scrollProgress);
         if (scrollProgress > 0.8 && !this.isLoadingContent && this.contentLoadCount < this.maxContentLoads) {
           console.log("Triggering content load");
           this.loadMoreContent();
         }
       }
       
       static loadMoreContent() {
         if (this.isLoadingContent) return;
         this.isLoadingContent = true;
       
         console.log("Loading more content...");
       
         const container = document.querySelector('.homegrid__container');
         const existingGrid = container?.querySelector('.section');
       
         if (existingGrid) {
           const newGrid = existingGrid.cloneNode(true) as HTMLElement;
           
           console.log("New grid created");
       
           // Clear any existing IDs to avoid duplicates
           newGrid.removeAttribute('id');
           newGrid.querySelectorAll('[id]').forEach(el => el.removeAttribute('id'));
       
           // Append the new grid
           container?.appendChild(newGrid);
           console.log("New grid appended to container");
       
           // Increment the content load count
           this.contentLoadCount++;
           console.log("Content load count:", this.contentLoadCount);
       
           // Clear old nodes if necessary
           this.clearOldNodes();
       
           // Reinitialize ScrollTrigger for the new content
           ScrollTrigger.refresh();
       
           // Reinitialize any necessary animations or interactions for the new grid
           this.initializeBoxAnimations();
       
           this.isLoadingContent = false;
         } else {
           console.log("No existing grid found to clone");
         }
       }
       
       static clearOldNodes() {
         const container = document.querySelector('.homegrid__container');
         const sections = container?.querySelectorAll('.section');
       
         if (sections && sections.length > this.maxContentLoads) {
           // Remove the oldest section
           sections[0].remove();
         }
       }
       
       static initializeNewGridContent(newGrid: HTMLElement) {
         // Reinitialize any necessary animations or interactions for the new grid
         // For example:
         ScrollTrigger.batch(newGrid.querySelectorAll(".box"), {
           interval: 2,
           onEnter: batch => gsap.to(batch, {opacity: 1, x: 0, stagger: 0.15}),
           onLeave: batch => gsap.set(batch, {opacity: 0, x: -100}),
           onEnterBack: batch => gsap.to(batch, {opacity: 1, x: 0, stagger: 0.15}),
           onLeaveBack: batch => gsap.set(batch, {opacity: 0, x: 100})
         });
       
         // Add any other initialization code for the new grid here
       }

      }
const eventDispatcher = new EventDispatcher();
const onDOMContentLoaded = () => {
   Scroll.init();
}
const onScroll = () => {
  const scrollSection = document.querySelector(".homegrid__container") as HTMLElement;
  console.log("scrolling");
  Scroll.scrollActions();
}

const onRefresh = () => {
ScrollTrigger.addEventListener("refreshInit", () => gsap.set(".box", {y: 0}));
}
eventDispatcher.addEventListener("refresh", onRefresh);
eventDispatcher.addEventListener("DOMContentLoaded", onDOMContentLoaded);
eventDispatcher.addEventListener("scroll",onScroll);



 // const thumbnails = document.querySelectorAll('.thumbs a');
  // thumbnails.forEach((thumb) => {
  //   thumb.addEventListener('click', (e) => {
  //     e.preventDefault();
  //     const hash = e.target.getAttribute('href').replace('#', '');
  //     scrollToVideo();
  //     window.location.hash = hash;
  //   });
  // });




// document.addEventListener('DOMContentLoaded', () => {
//   setupHashNav();
//   handleExternalLinks();
//   gsap.fromTo("body", { opacity: 0 }, { opacity: 1, duration: 0.5 });
// });
 // // Scroll to video function
// function scrollToVideo(hash) {
//   const video = document.querySelector(`[data-hashnav="${hash}"]`);
//   if (video) {
//     const slider = video.closest('.panel-wide');
//     if (slider) {
//       gsap.to(window, {
//         scrollTo: {
//           y: "+=" + slider.getBoundingClientRect().left,
//         },
//         duration: 0.5,
//         onComplete: () => {
//           ScrollTrigger.refresh();
//         }
//       });
//     }
//   }
// }

// // Hash navigation setup
// function setupHashNav() {
//   if (window.location.hash) {
//     const hash = window.location.hash.replace('#', '');
//     scrollToVideo(hash);
//   }


  // const thumbnails = document.querySelectorAll('.thumbs a');
  // thumbnails.forEach(thumb => {
  //   thumb.addEventListener('click', (e) => {
  //     e.preventDefault();
  //     const hash = e.target.getAttribute('href').replace('#', '');
  //     scrollToVideo(hash);
  //     window.location.hash = hash;
  //   });
  // });
  // allImgs.forEach((img, i) => {
  //   gsap.fromTo(img, {
  //     x: "-45vw"
  //   }, {
  //     x: "45vw",
  //     scrollTrigger: {
  //        trigger: img.parentNode,
  //       // trigger: video,
  //       containerAnimation: scrollTween,
  //       start: "left right",
  //       end: "right left",
  //       scrub: true,
  //       invalidateOnRefresh: true,
      
  //       onRefresh: self => {
  //         if (gsap.start < 0) {
  //           self.animation.progress(gsap.utils.mapRange(self.start, self.end, 0, 1, 0));
  //         }
  //       }
  //     }
  //   });
  // });


  // let progressBar = gsap.timeline({
  //   scrollTrigger: {
  //     trigger: trackWrapper,
  //     containerAnimation: scrollTween,
  //     start: "left left",
  //     end: () => "+=" + (trackWrapperWidth() - window.innerWidth),
  //     scrub: true
  //   }
  // }).to(progress, {
  //   width: "100%",
  //   ease: "none"
  // });
//  let currentSection = sections[currentIndex];
//  let heading = currentSection.querySelector(".panel-overlay-text");
//  let nextSection = sections[index];
//  let nextHeading = nextSection.querySelector(".panel-overlay-text");

//  gsap.set([sections, images], { zIndex: 0, autoAlpha: 0 });
//  gsap.set([sections[currentIndex], images[index]], { zIndex: 1, autoAlpha: 1 });
//  gsap.set([sections[index], images[currentIndex]], { zIndex: 2, autoAlpha: 1 });

//  tl
//   .set(count, { text: index + 1 }, 0.72)
//   .fromTo(
//    outerWrappers[index],
//    {
//     xPercent: 100 * direction
//    },
//    { xPercent: 0 },
//    0
//   )
//   .fromTo(
//    innerWrappers[index],
//    {
//     xPercent: -100 * direction
//    },
//    { xPercent: 0 },
//    0
//   )
//   .to(
//    heading,
//    {
//     "--width": 800,
//     xPercent: 30 * direction
//    },
//    0
//   )
//   .fromTo(
//    nextHeading,
//    {
//     "--width": 800,
//     xPercent: -30 * direction
//    },
//    {
//     "--width": 200,
//     xPercent: 0
//    },
//    0
//   )
//   .fromTo(
//    images[index],
//    {
//     xPercent: 125 * direction,
//     scaleX: 1.5,
//     scaleY: 1.3
//    },
//    { xPercent: 0, scaleX: 1, scaleY: 1, duration: 1 },
//    0
//   )
//   .fromTo(
//    images[currentIndex],
//    { xPercent: 0, scaleX: 1, scaleY: 1 },
//    {
//     xPercent: -125 * direction,
//     scaleX: 1.5,
//     scaleY: 1.3
//    },
//    0
//   )
//   .fromTo(
//    slideImages[index],
//    {
//     scale: 2
//    },
//    { scale: 1 },
//    0
//   )
//   .timeScale(0.8);

//  currentIndex = index;
// }

// const titleList = gsap.utils.toArray('#titleEffects li')
// const titlesTl = gsap.timeline({repeat: -1})

// gsap.registerEffect({
//   name: 'rotateIn',
//   extendTimeline: true,
//   defaults: {
//     duration: 1,
//     rotationY: 0,
//     rotationX: 0,
//     transformOrigin: '50% 50%',
//     ease: 'back',
//     parent: '.wrap',
//   },

//   effect: (targets, config) => {
//     gsap.set(config.parent, { perspective: 800 })

//     let tl = gsap.timeline()
//     tl.from(targets, {
//       duration: config.duration,
//       rotationY: config.rotationY,
//       rotationX: config.rotationX,
//       transformOrigin: config.transformOrigin,
//       ease: config.ease,
//       stagger: {
//         each: 0.06,
//       },
//     })

//     tl.from(
//       targets,
//       {
//         duration: 0.4,
//         autoAlpha: 0,
//         ease: 'none',
//         stagger: {
//           each: 0.05,
//         },
//       },
//       0,
//     )

//     return tl
//   },
// })

// gsap.registerEffect({
//   name: 'rotateOut',
//   extendTimeline: true,
//   defaults: {
//     duration: 0.5,
//     x: 0,
//     y: 0,
//     rotationY: 0,
//     rotationX: 0,
//     rotationZ: 0,
//     transformOrigin: '50% 50%',
//     ease: 'power1.in',
//     parent: '.wrap',
//   },

//   effect: (targets, config) => {
//     gsap.set(config.parent, { perspective: 800 })

//     let tl = gsap.timeline()
//     tl.to(targets, {
//       x: config.x,
//       y: config.y,
//       rotationY: config.rotationY,
//       rotationX: config.rotationX,
//       rotationZ: config.rotationZ,
//       transformOrigin: config.transformOrigin,
//       ease: config.ease,
//       stagger: {
//         each: 0.04,
//       },
//     })

//     tl.to(
//       targets,
//       {
//         duration: 0.45,
//         opacity: 0,
//         ease: 'none',
//         stagger: {
//           amount: 0.02,
//         },
//       },
//       0,
//     )

//     return tl
//   },
// })

// function splitElements() {
//   gsap.set(titleList, { autoAlpha: 1 })
//   titleList.forEach((element, dex) => {
//     let split = new SplitText(element, { type: 'chars,words,lines' })

//   titlesTl
//     .rotateIn(split.words, { 
//       rotationX: 90,
//       transformOrigin: '100% 0',
//       ease: 'back(2.3)' 
//     }, dex > 0 ? '-=0.38' : 0, )
//     .rotateOut(split.words, {
//       y: 20,
//       rotationX: -100,
//       transformOrigin: '100% 100%'
//     })
//   })
// }

// splitElements()

// let time = 0;

// // const canvasElement = document.querySelector<HTMLCanvasElement>('.webgl-canvas');
// // if (canvasElement) {
// //   const canvas = new Canvas(canvasElement);
// //   window.addEventListener('beforeunload', () => {
// //     canvas.dispose();
// //   });
// // }

//  function scrollInit() {
//   const hash = window.location.hash.replace('#', '');

//   const lenis = new Lenis({
//     duration: 1.2,
//     easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
//     smooth: true,
//   });
//   // let raf = requestAnimationFrame();
//   function raf(time) {
//     lenis.raf(time);
//     requestAnimationFrame(raf);
//   }



//   lenis.on('scroll', (e: any) => {
//     console.log('is scrolling');
//   });

//   lenis.on('scroll', scrollInit);

//   gsap.ticker.add((time) => {
//     gsap.ticker.lagSmoothing(0);
//   });



//   const select = (e) => document.querySelector(e);
//   const selectAll = (e) => document.querySelectorAll(e);

//   const tracks = selectAll(".sticky-element");

//   tracks.forEach((track, i) => {
//     const trackWrapper = track.querySelectorAll(".track");
//     const trackFlex = track.querySelectorAll(".track-flex");
//     const allImgs = track.querySelectorAll(".slider-video");
//     const progress = track.querySelectorAll(".progress--bar-total");

//     const sliders = gsap.utils.toArray(".panel-wide");
//     const thumbs = gsap.utils.toArray(".thumbs");
//     const visible = gsap.utils.toArray(".visible");

//     const trackWrapperWidth = () => {
//       let width = 0;
//       trackWrapper.forEach((el) => (width += el.offsetWidth));
//       return width;
//     };

//     const trackFlexWidth = () => {
//       let width = 0;
//       trackFlex.forEach((el) => (width += el.offsetWidth));
//       return width;
//     };

//     ScrollTrigger.defaults({});

//     gsap.defaults({
//       ease: "none",
//     });

//     const scrollTween = gsap.to(trackWrapper, {
//       x: () => -trackWrapperWidth() + window.innerWidth,
//       scrollTrigger: {
//         trigger: track,
//         pin: true,
//         anticipatePin: 1,
//         scrub: 1,
//         start: "center center",
//         end: () => "+=" + (track.scrollWidth - window.innerWidth),
//         onRefresh: (self) => self.getTween().resetTo("totalProgress", 0),
//         invalidateOnRefresh: true,
//       },
//     });

//     allImgs.forEach((img, i) => {
//       gsap.fromTo(
//         img,
//         { x: "-45vw" },
//         {
//           x: "45vw",
//           scrollTrigger: {
//             trigger: img.parentNode,
//             containerAnimation: scrollTween,
//             start: "left right",
//             end: "right left",
//             scrub: true,
//             invalidateOnRefresh: true,
//             onRefresh: (self) => {
//               if (self.start < 0) {
//                 self.animation.progress(gsap.utils.mapRange(self.start, self.end, 0, 1, 0));
//               }
//             },
//           },
//         }
//       );
//     });

//     const progressBar = gsap
//       .timeline({
//         scrollTrigger: {
//           trigger: trackWrapper,
//           containerAnimation: scrollTween,
//           start: "left left",
//           end: () => "+=" + (trackWrapperWidth() - window.innerWidth),
//           scrub: true,
//         },
//       })
//       .to(progress, {
//         width: "100%",
//         ease: "none",
//       });

//     sliders.forEach((slider, i) => {
//       const anim = gsap
//         .timeline({
//           scrollTrigger: {
//             trigger: slider,
//             containerAnimation: scrollTween,
//             start: "left right",
//             end: "right right",
//             scrub: true,
//           },
//         })
//         .to(visible, {
//           width: "100%",
//           backgroundColor: "#000000",
//           ease: "none",
//         });
//     });

//     sliders.forEach((slider, i) => {
//       if (thumbs[i]) {
//         thumbs[i].onclick = () => {
//           gsap.to(window, {
//             scrollTo: {
//               y: "+=" + slider.getBoundingClientRect().left,
//             },
//             duration: 0.5,
//           });
//         };
//       }
//     });
//   });
// }
// eventDispatcher.addEventListener("fullscreenchange",onChange);
// eventDispatcher.addEventListener("resize",onResize);
// document.addEventListener("scroll", scrollInit);
// scrollInit();

// const hash = newFunction();
  
// function scrollInit() {
 
//   const hash = window.location.hash.replace('#', '');
//   // const logo = document.querySelector("topbar--svg");
//   // lenis
//   const lenis = new Lenis({
//     duration: 1.2,
//     easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
//     smooth: true,
//     // prevent: (node) => node.id === logo,
//   });

//   function raf(time) {
//     lenis.raf(time);
//     requestAnimationFrame(raf);
//   }

//   requestAnimationFrame(raf);

//   lenis.on('scroll', (e: any) => {
//     console.log('is scrfolling');
//   });

//   lenis.on('scroll', ScrollTrigger.update);

//   gsap.ticker.add((time) => {
//     lenis.raf(time * 1000);

//   });

//   gsap.ticker.lagSmoothing(0);


//   let select = (e) => document.querySelector(e);
//   let selectAll = (e) => document.querySelectorAll(e);

//   const tracks = selectAll(".sticky-element");


//   tracks.forEach((track, i) => {
//     let trackWrapper = track.querySelectorAll(".track");
//     let trackFlex = track.querySelectorAll(".track-flex");
//     let allImgs = track.querySelectorAll(" .slider-video");
//     let progress = track.querySelectorAll(".progress--bar-total");

//     let sliders = gsap.utils.toArray(".panel-wide");
//     let thumbs = gsap.utils.toArray(".thumbs");
//     let visible = gsap.utils.toArray(".visible");

//     let trackWrapperWidth = () => {
//       let width = 0;
//       trackWrapper.forEach((el) => (width += el.offsetWidth));
//       return width;
//     };

//     let trackFlexWidth = () => {
//       let width = 0;
//       trackFlex.forEach((el) => (width += el.offsetWidth));
//       return width;
//     };

//     ScrollTrigger.defaults({});

//     gsap.defaults({
//       ease: "none",
//     });

//     let scrollTween = gsap.to(trackWrapper, {
//       x: () => -trackWrapperWidth() + window.innerWidth,
//       scrollTrigger: {
//         trigger: track,
//         pin: true,
//         anticipatePin: 1,
//         scrub: 1,
//         start: "center center",
//         end: () => "+=" + (track.scrollWidth - window.innerWidth),
//         onRefresh: (self) => self.getTween().resetTo("totalProgress", 0),
//         invalidateOnRefresh: true
//       }
//     });

//     allImgs.forEach((img, i) => {
//       gsap.fromTo(img, {
//         x: "-45vw"
//       }, {
//         x: "45vw",
//         scrollTrigger: {
//           trigger: img.parentNode,
//           containerAnimation: scrollTween,
//           start: "left right",
//           end: "right left",
//           scrub: true,
//           invalidateOnRefresh: true,
//           onRefresh: self => {
//             if (gsap.start < 0) {
//               self.animation.progress(gsap.utils.mapRange(self.start, self.end, 0, 1, 0));
//             }
//           }
//         }
//       });
//     });

//     let progressBar = gsap.timeline({
//       scrollTrigger: {
//         trigger: trackWrapper,
//         containerAnimation: scrollTween,
//         start: "left left",
//         end: () => "+=" + (trackWrapperWidth() - window.innerWidth),
//         scrub: true
//       }
//     }).to(progress, {
//       width: "100%",
//       ease: "none"
//     });

//     sliders.forEach((slider, i) => {
//       let anim = gsap.timeline({
//         scrollTrigger: {
//           trigger: slider,
//           containerAnimation: scrollTween,
//           start: "left right",
//           end: "right right",
//           scrub: true,
//         }
//       }).to(visible, {
//         width: "100%",
//         backgroundColor: "#000000",
//         ease: "none"
//       });
//     });

//     sliders.forEach((slider, i) => {
//       if (thumbs[i]) {
//         thumbs[i].onclick = () => {
//           gsap.to(window, {
//             scrollTo: {
//               y: "+=" + slider.getBoundingClientRect().left,
//             },
//             duration: 0.5,
//           });
//         };
//       }
//     });

//   });

// }

//   // Scroll to video function
//   function scrollToVideo() {
//     // let hash = "";
 
//     const video = document.querySelector(`[data-hashnav="${hash}"]`);
//     if (video) {
//       const slider = video.closest('.panel-wide');
//       if (slider) {
//         gsap.to(window, {
//           scrollTo: {
//             y: "+=" + slider.getBoundingClientRect().left,
//           },
//           duration: 0.5,
//           onComplete: () => {
//             ScrollTrigger.refresh();
//           }
//         });
//       }
//     }
//   }
  
//   // Hash navigation setup
//   function setupHashNav() {
//     if (window.location.hash) {
//     //   const hash = window.location.hash.replace('#', '');
//       scrollToVideo();
//     }
  
//     const thumbnails = document.querySelectorAll('.thumbs a');
//     thumbnails.forEach(thumb => {
//       thumb.addEventListener('click', (e) => {
//         e.preventDefault();
//         const hash = e.target.getAttribute('href').replace('#', '');
//         scrollToVideo();
//         window.location.hash = hash;
//       });
//     });
  
//     window.addEventListener('hashchange', () => {
//     //   const hash = window.location.hash.replace('#', '');
//       scrollToVideo();
//     });
//   }
  
//   // Additional function to handle links from other pages
//   function handleExternalLinks() {
//     if (window.location.hash) {
//       const hash = window.location.hash.replace('#', '');
//       scrollToVideo();
//     }
//   }
  
//   document.addEventListener('DOMContentLoaded', () => {
//     setupHashNav();
//     handleExternalLinks();
//     gsap.fromTo("body", { opacity: 0 }, { opacity: 1, duration: 0.5 });
//   });
  
// //   document.addEventListener('change', (e) => {
// //     if (AnimationEvent) {
// //       // stopOverscroll(".sticky-element");
// //     }
// //   });
// document.addEventListener("scroll", scrollInit);
// scrollInit();

// LoadMe();
// function LoadMe() {
//   var loadedCount = 0; // current number
//   var videosToLoad = ('.video--figure').length; // number of videos
//   var loadingProgress = 0; // TL progress - starts at 0
//   loadProgress();

//   if (!(document.querySelector('.loader-wrapper'))) {
//       for (let i = 0; i < videosToLoad; i++) {
//           loadedCount++;
//           console.log(loadedCount);
//       }
//   }

//   function loadProgress() {
//       // one more image has been loaded
//       loadedCount++;
//       loadingProgress = (loadedCount / videosToLoad);

//       if (document.querySelector('.loader-wrapper')) {
//           gsap.timeline()
//               .to(".loader-wrapper", { duration: 3, opacity: 0, autoAlpha: 0, ease: Power4.easeIn, delay: 0.5 })
//               .set(('#site-loader'), { className: 'is-hidden' })
//               .then(loadComplete)
//               .finally(replenishMe);
//       }
//   }

//   function loadComplete() {
//       if (document.querySelector('.loader-wrapper')) {
//           gsap.timeline()
//               .set(('#site-loader'), { className: 'is-loaded' })
//               .set(('.loader-wrapper'), { className: 'is-loaded' })
//               .set(('.loader-wrapper'), { className: 'is-hidden' })
//               .set(('.mr--texterton__wrapper'), { className: 'is-hidden' })
//               .set(('.mr--bloberton__wrapper'), { className: 'is-hidden' })
          
//               .from("#site-loader", { duration: 3, opacity:0, autoAlpha: 1, ease: Power4.easeInOut, delay: 0.5 });
//       }
//   }

//   function replenishMe() {
//       if (!(document.querySelector('.loader-wrapper'))) {
//           gsap.timeline().kill();
//           console.log("no loader");
//       }
//   }
// }

// function fitPositionAbsoluteElements() {
//   const smileyWrapper = document.querySelector('.central--smile__wrapper') as HTMLElement;
//   //k add

//   function getDomSize() {
//     //this is a "getter"
//     //get height
//     smileyWrapper.style.getPropertyValue('--adjust-height');
//     getComputedStyle(smileyWrapper).getPropertyValue('--adjust-height');
//     // get width
//     smileyWrapper.style.getPropertyValue('--adjust-width');
//     getComputedStyle(smileyWrapper).getPropertyValue('--adjust-width');
//   }
//   if (smileyWrapper) {
//       function updateSize() {
//         getDomSize(); // we are getting these values from this func
        
//         //let's reset the values of our var, or leave them
//         let width = window.innerWidth.toString();
//         let height = window.innerHeight.toString();
//         smileyWrapper.style.setProperty('--adjust-width', width);
//         smileyWrapper.style.setProperty('--adjust-height', height);
//           //old frog
//           // let width = window.innerWidth;
//           // let height = window.innerHeight;
//           // videoGridElement.style.width = `${width} + px`;
//           // videoGridElement.style.height = `${height}px`;
//       }
//       updateSize();
//       window.addEventListener('resize', updateSize);
//   } else {
//       console.error('Element with class .video--placement--grid not found.');
//   }
// }

// fitPositionAbsoluteElements();


// if(reload) {
// reload.addEventListener("click", () => {
//   log.textContent = "";
//   setTimeout(() => {
//     window.location.reload(true);
//   }, 200);
// });
// }

// window.addEventListener("load", (event) => {
//   console.log( "load\n");
// });

// document.addEventListener("readystatechange", (event) => {
//   console.log(`readystate: ${document.readyState}\n`);
//   loadingPage.style.display = "none";
//   setTimeout(() => {
//     // window.location.reload();
//     LoadMe();
//   }, 200);
// });

// document.addEventListener("DOMContentLoaded", (event) => {
//   console.log( `DOMContentLoaded\n`);

//   // await new Promise((resolve) => {
//   //   setTimeout(() => {
//   //    LoadMe();
//   //   })
//   //   console.log("gsap loader loaded")
//   // })

// });






//   const gridElement = document.querySelector('.video--placement--grid') as HTMLElement;
//   const gridItems = gsap.utils.toArray(gridElement.querySelectorAll('.video--figure'));
//   const gridItemsShuffled = gsap.utils.shuffle(gridItems);
//   const fullscreenElement = document.querySelector('.fullscreen--scale') as HTMLElement;
//   const maskingLayer = document.querySelector('.masking--element') as HTMLElement;
//   // Map to store the initial state of each video
//   let currentFullscreenVideo: HTMLElement | null = null;
// // Map to store the initial state of each video
// const originalStates = new Map<Element, { parent: Element, index: number, position: { top: number, left: number, width: number, height: number } }>();
//   // Flag to track fullscreen mode
// let isFullscreen = false;



//   // Pause all videos except the one in fullscreen
// const pauseOtherVideos = (excludeVideo: HTMLVideoElement) => {
//     gridItems.forEach((item: HTMLElement) => {
//       const video = item.querySelector('.video--item') as HTMLVideoElement;
//       if (video && video !== excludeVideo && !video.paused) {
//         video.pause();
//       }
//     });
//   };
  
//   // Play the fullscreen video
// const playFullscreenVideo = (video: HTMLVideoElement) => {
//     if (video.paused) {
//       video.play();
//     }
//   };





// // Event listener for DOMContentLoaded
// document.addEventListener('DOMContentLoaded', () => {




//   console.log('slider page loaded')
// //  .then(() => {
// //     initEvents();
// //     animateLogo();
// //   })

// });




// // Selecting DOM elements
// const gridElement = document.querySelector('.video--placement--grid') as HTMLElement;
// // let gridItems = gridElement.querySelectorAll('.video--figure').gsap.utils.toArray();
// let gridItems = gsap.utils.toArray(gridElement.querySelectorAll('.video--figure'));
// // const gridItems = Array.from(gridElement.querySelectorAll('.video--figure')); // Convert NodeList to Array
// const gridVideo = gridElement.querySelectorAll('.video--item');
// const fullscreenElement = document.querySelector('.fullscreen--scale');
// const maskingLayer = document.querySelector('.masking--element');

// // Flag to track fullscreen mode
// let isFullscreen = false;

// // Animation defaults
// const animationDefaults = { duration: 1, ease: 'expo.inOut' };

// // // Function to flip the clicked image and animate its movement
// // const flipImage = (gridItem, gridVideo) => {
// //   gsap.set(gridItem, { zIndex: 99 });
// //   const state = Flip.getState(gridVideo, { props: 'borderRadius' });
// //   if (isFullscreen) {
// //     gridItem.appendChild(gridVideo);
// //   } else {
// //     fullscreenElement!.appendChild(gridVideo);
// //   }

// //   Flip.from(state, {
// //     ...animationDefaults,
// //     absolute: true,
// //     prune: true,
// //     onComplete: () => {
// //       if (isFullscreen) {
// //         gsap.set(gridItem, { zIndex: 'auto' });
// //       }
// //       isFullscreen = !isFullscreen;
// //     }
// //   });
// // };

// // newFunction();

// const flipVideo = (gridItem: Element, gridVideo: Element) => {    
//     gsap.set(gridItem, { zIndex: 1 });
//     gsap.set(maskingLayer, { zIndex: 0});
//     gsap.to(maskingLayer, {animationDefaults, opacity: .85 });
//     const state = Flip.getState(gridVideo, { props: 'borderRadius' });
  
//     if (isFullscreen) {
//       gridItem.appendChild(gridVideo);
//       fullscreenElement.innerHTML = '<p class="project-name-revealed">text</p>';


//     } else {
//       fullscreenElement?.appendChild(gridVideo);
//     }
  
//     Flip.from(state, {
//       ...animationDefaults,
//       scale: true,
//       prune: true,
  

//       onStart: () => {},
//       onLeave: () => { 
//         // let gridItems = gsap.utils.toArray(gridItems);

//         gsap.fromTo(gridItem, {opacity: 1}, {opacity: 0}) },
//       onComplete: () => {
//         if (isFullscreen) {
//           gsap.set(gridItem, { zIndex: 'unset' });
//         // gridItem.setAttribute('class', 'greyed-out');
//         }
//         isFullscreen = !isFullscreen;
//       },
//     //   onReverseComplete () => {}
//         });
//   };

// // Function to determine the position class based on the item and clicked item positions
// const determinePositionClass = (itemRect, clickedRect) => {
//   if (itemRect.bottom < clickedRect.top) {
//     return POSITION_CLASSES.NORTH;
//   } else if (itemRect.top > clickedRect.bottom) {
//     return POSITION_CLASSES.SOUTH;
//   } else if (itemRect.right < clickedRect.left) {
//     return POSITION_CLASSES.WEST;
//   } else if (itemRect.left > clickedRect.right) {
//     return POSITION_CLASSES.EAST;
//   }
//   return '';
// //   console.log(itemRect, clickedRect);
// };

// // Function to move other items based on their position relative to the clicked item
// // const moveOtherItems = (gridItem, gridVideo) => {
// //     const clickedRect = gridItem.getBoundingClientRect();
  
// //     // For the remaining stuff
// //     const otherGridItems = gridItems.filter(item => item !== gridItem);
// //     const state = Flip.getState(otherGridItems);
  
// //     otherGridItems.forEach(item => {
// //       const itemRect = item.getBoundingClientRect();
// //       const classname = determinePositionClass(itemRect, clickedRect);
// //       if (classname) {
// //         item.classList.toggle(classname, !isFullscreen);
// //         // item.classList.toggle('video-figure', !isFullscreen);

// //       }
// //     });
  
// //     Flip.from(state, {
// //       ...animationDefaults,
// //       toggleClass: 'greyed-out',
// //       scale: true,
// //     //   prune: true
// //     });
// //   };
  
// const moveOtherItemsBack = (gridItem: Element, gridVideo: Element) => {
//     const clickedRect = gridItem.getBoundingClientRect();

//     for (let i = 0; i < gridItems.length; i++) {
//         const gridItem = gridItems[i];
//         // gridItem.classList.remove('pos-north', 'pos-south', 'pos-west', 'pos-east');
//     //    if (fullscreenElement.contains(gridItem.classList.value)) {
//     //     console.log('full screen detected');

//     //    }
   

//         // if (gridElement.contains(fullscreenElement)) {
//         //     console.log('full screen detected');
//         // }


//         // gridItem.appendChild(gridVideo);

//         const index = parseInt(gridVideo.dataset.index || '0', 10);
//         // addListeners(gridItem, gridVideo);


//         }
//         addListeners(gridItem, gridVideo);
//         function addListeners(gridItem: Element, gridVideo: Element) {
//             gridElement.addEventListener('click', (e) => {
//                console.log(e.target + 'clicked');
//                let videoFigure = document.querySelector('.video--figure') as HTMLElement;
//              e.stopPropagation();
//                if (isFullscreen) {
//                 e.preventDefault();
//                 // killFlips(gridItem, gridVideo);
//                 // gridItem.killFlips();
//                 const fullState = Flip.getState(videoFigure, () => {
//                     console.log(gridVideo + ' removed');

//                 }
// );
//                 Flip.from(fullState, {
//                     ...animationDefaults,
//                     duration: 1,
//                     stagger: 0.4,
//                     onComplete: () => {
//                         appendVidBack();
                    

//                     }



//                 })


//                     function appendVidBack () {   

//                         videoFigure.appendChild(gridVideo.cloneNode(true));
//                         fullState.clear();

//                        console.log(gridVideo + ' cloned');
//                    }
//                 }


//             })

//         }



// }


// // Click event handler for the grid
// const toggleVideo = (e: Event) => {
//     const gridVideo = e.target as HTMLElement;
//     const index = parseInt(gridVideo.dataset.index || '0', 10);
//     const gridItem = gridItems[index];
    
//     flipVideo(gridItem, gridVideo);
//     moveOtherItemsBack(gridItem, gridVideo);
//   };
  
//   function animateLogo() {
//     let originPoint = '239.9 434.7 239.9 405.5 217.5 405.5 188.4 405.5 162.6 405.5 162.6 433.9 162.6 459.9 162.6 487.9 162.6 522.1 162.6 563.4 201.2 564.1 239.9 563.9 239.9 535.2 239.9 499.8 239.9 458.1 239.9 434.7';
//     let endPoint = '301.1 417.1 231.3 438.7 231.9 364.9 165.7 364.9 165.7 438.7 95.8 417.1 74.5 475.4 145.1 496.6 100.2 554.8 152.9 592 198.7 530.5 244.6 592 297.3 554.7 251.9 496.5 322.4 475.4 301.1 417.1';

//     anime({
//         targets: '#rectangle',
//         points: [
//             { value: originPoint },
//             { value: endPoint },
//             { value: originPoint }
//         ],
//         easing: 'easeOutQuad',
//         duration: 2000,
//         loop: false
//     });
// }
//   // Function to initialize event listeners for grid
//   const initEvents = () => {
//     gridVideo.forEach((gridVideo, position) => {
//       // Save the index of the video
//       gridVideo.dataset.index = position.toString();
      
//       // Add click event listener to the video
//       gridVideo.addEventListener('click', toggleVideo);
//     });
//   };
// document.addEventListener('DOMContentLoaded', initEvents);
// document.addEventListener('DOMContentLoaded', animateLogo);









// // Constants for class names
// const POSITION_CLASSES = {
//   NORTH: 'pos-north',
//   SOUTH: 'pos-south',
//   WEST: 'pos-west',
//   EAST: 'pos-east',
// };

// // Selecting DOM elements
// const gridElement = document.querySelector('.video--placement--grid') as HTMLElement;
// const gridItems = Array.from(gridElement.querySelectorAll('.video--figure')) as HTMLElement[]; // Convert NodeList to Array
// const gridVideo = Array.from(gridElement.querySelectorAll('.video--item')) as HTMLElement[];
// const fullscreenElement = document.querySelector('.fullscreen--scale');
// const clickedRect = gridItems.find(item => item.classList.contains('fullscreen--scale'))?.getBoundingClientRect();


// // Flag to track fullscreen mode
// let isFullscreen = false;

// // Animation defaults
// const animationDefaults = { duration: 1.5, ease: 'expo.inOut' };

// // // Function to flip the clicked image and animate its movement
// // const flipImage = (gridItem, gridVideo) => {
// //   gsap.set(gridItem, { zIndex: 99 });
// //   const state = Flip.getState(gridVideo, { props: 'borderRadius' });
// //   if (isFullscreen) {
// //     gridItem.appendChild(gridVideo);
// //   } else {
// //     fullscreenElement!.appendChild(gridVideo);
// //   }

// //   Flip.from(state, {
// //     ...animationDefaults,
// //     absolute: true,
// //     prune: true,
// //     onComplete: () => {
// //       if (isFullscreen) {
// //         gsap.set(gridItem, { zIndex: 'auto' });
// //       }
// //       isFullscreen = !isFullscreen;
// //     }
// //   });
// // };

// let currentFullscreenItem: Element | null = null;
// const maskingLayer = document.querySelector('.masking--element');
// const flipVideo = (gridItem: Element, gridVideo: Element) => {
//     gsap.set(gridItem, { zIndex: 1 });
//     gsap.set(maskingLayer, { zIndex: 0});
//     gsap.to(maskingLayer, {animationDefaults, opacity: .85 });
//     // const state = Flip.getState(gridVideo, { props: 'borderRadius' });
// // gsap.set(gridItem, { zIndex: 99 });
// //   gsap.set(gridItem, { zIndex: 1 });
// //   gsap.set(maskingLayer, { zIndex: 0, pointerEvents: 'none' });

//   const state = Flip.getState(gridVideo, { props: 'borderRadius' });

//   if (isFullscreen) {
//     if (currentFullscreenItem) {
//       currentFullscreenItem.appendChild(gridVideo);
//       currentFullscreenItem = null;
//     }
//   } else {
//     fullscreenElement?.appendChild(gridVideo);
//     currentFullscreenItem = gridItem;
//   }

//   Flip.from(state, {
//     ...animationDefaults,
//     scale: true,
//     prune: true,
//     toggleClass: 'flip-video',
//     onStart: () => {
//         if (currentFullscreenItem) {
//             currentFullscreenItem.appendChild(gridVideo);
//             currentFullscreenItem = null;
//           }
         
//         else {
//           fullscreenElement?.appendChild(gridVideo);
//           currentFullscreenItem = gridItem;
//         }
//     },
//     onComplete: () => {}


//     //   .then(() => {

//     //   })


    
// });
// function getBoundingRect(itemRect: DOMRect, clickedRect: DOMRect) {
//     const fullscreenVideo = fullscreenElement?.querySelector('.fullscreen--scale');
//     // Select the element with the given class name
//     const element = fullscreenVideo?.querySelector(`.${'.fullscreenVideo'}`);
    
//     // Check if the element exists
//     if (element) {
//       // Get the bounding rectangle of the element
//       return element.getBoundingClientRect();
//     } else {
//       // Return null if the element does not exist
//       return null;
//     }
//   }
  





// Function to move other items based on their position relative to the clicked item
// const moveOtherItems = (gridItem: Element, gridVideo: Element) => {
    

  
//     // For the remaining stuff
//     const otherGridItems = gridItems.filter(item => item !== gridItem);
//     // gridItems.reduce
//     const state = Flip.getState(otherGridItems);
//     // const clickedRect = gridItem.getBoundingClientRect();
//     // const clickedRect = gridItems.find(item => item.classList.contains('fullscreen--scale'))?.getBoundingClientRect();
   
//     otherGridItems.forEach(item => {
//         Flip.from(state, {
//             ...animationDefaults,
//        scale: true,

//           isVisible: false,
      
//             prune: true,
//             stagger: {
//               each: 0.1,
//               from: 'start'
//             }
//           });


    //   const itemRect = item.getBoundingClientRect();
     
    //   if (itemRect.bottom < itemRect.top) {}

          // Function to determine the position class based on the item and clicked item positions
// const determinePositionClass = () => {
//     //   const itemRect = gridItems.find(item => item.classList.contains('fullscreen--scale'))?.getBoundingClientRect();
//     //   const clickedRectFind = gridItems.find(item => item.classList.contains('fullscreen--scale'))?.getBoundingClientRect();
//     //     const clickedRect = clickedRectFind.position;
//     const clickedRect = gridItem.getBoundingClientRect();

//         // const clickedRect = gridItem.getBoundingClientRect();
//       if (itemRect.bottom < clickedRect.top) {
//         return POSITION_CLASSES.NORTH;
//       } else if (itemRect.top > clickedRect.bottom) {
//         return POSITION_CLASSES.SOUTH;
//       } else if (itemRect.right < clickedRect.left) {
//         return POSITION_CLASSES.WEST;
//       } else if (itemRect.left > clickedRect.right) {
//         return POSITION_CLASSES.EAST;
//       }
//       return '';
//     //   console.log(itemRect, clickedRect);
//     };
//     const classname = determinePositionClass();
//     if (classname) {
//       item.classList.toggle(classname, !isFullscreen);
//       item.classList.toggle('greyed-out', !isFullscreen);
//       // item.classList.toggle('filler-space'  , !isFullscreen  );
//       // item.classList.toggle('video-figure', !isFullscreen);

//     }
//     });
  
//     Flip.from(state, {
//       ...animationDefaults,
//     //   scale: 0.5,
//     isVisible: false,

//       prune: true,
//       stagger: {
//         each: 0.1,
//         from: 'start'
//       }


//     });
//   };


// // Click event handler for the grid
// const toggleVideo = (e: Event) => {
//     const gridVideo = e.currentTarget as HTMLElement;
//     const index = parseInt(gridVideo.dataset.index || '0', 10);
//     const gridItem = gridItems[index];
//     const flipState = Flip.getState(gridVideo, {  });
//     console.log("flipState", flipState);
//     // if (!gridItem) {
//     //     console.error('Grid item not found');
//     //     return;
//     // }
// //     for (let i = 0;) {
// //     flipVideo(gridItem, gridVideo);
// //  moveOtherItems(gridItem, gridVideo);
// //     }
// //  const boundingRect = clickedRect ? getBoundingRect(new DOMRect, clickedRect) : null;

      
// //  if (boundingRect) {
// //    console.log('Bounding Rectangle:', boundingRect);
// //  } else {
// //    console.log('Element not found');
// //  }

//   };
  
//   // Function to initialize event listeners for grid
//   const initEvents = () => {
//    document.addEventListener('click', toggleVideo);
//     // gridVideo.forEach((videoElement) => {
//     //     (videoElement as HTMLElement).addEventListener('click', toggleVideo);
//     // //   if (gridItems[index]) {
//     // //     (videoElement as HTMLElement).dataset.index = index.toString(); // Cast to HTMLElement
//     // //     (videoElement as HTMLElement).addEventListener('click', toggleVideo);
//     // //   } else {
//     // //     console.error('Index out of bounds:', index);
//     // //   }
//     // });
//   };
// //   const initEvents = () => {
// //     gridVideo.forEach((gridVideo, position) => {

// //         let position = Array.from(gridItems).indexOf(gridItems[position]);


// //       // Save the index of the video
// //     //   let gridItemPos = gridItems[position].dataset.index.position.toString();
// //     //  gridVideo.dataset.index = position.toString();
      
// //       // Add click event listener to the video
// //       gridVideo.addEventListener('click', toggleVideo);
// //     // document.addEventListener('click', (e: Event) => {
// //     //     if (isFullscreen && e.target !== fullscreenElement && !fullscreenElement?.contains(e.target as Node)) {
// //     //       const fullscreenVideo = fullscreenElement?.querySelector('.video--item');
// //     //       if (fullscreenVideo && currentFullscreenItem) {
// //     //         flipVideo(currentFullscreenItem, fullscreenVideo);
// //     //         moveOtherItems(currentFullscreenItem, fullscreenVideo);
// //     //       }
// //     //     }
 
      
// //     });
// //   };


// document.addEventListener('DOMContentLoaded', initEvents);


// preload but. not workee yet
// preloadImages('.video--item').then(() => {
//   // Remove the loading class from the body
//   document.body.classList.remove('loading');
//   // Initialize event listeners
//   initEvents();
// });


// function sortVideoGrid {
//         // these are chained functions to illustrate map / toString / split / push but wrote selectors below. 
//          // const videoFigures = Array.from(gridContainer.querySelectorAll('.video--figure')).map(figure => figure.querySelector('video'));
//         // const videos = Array.from(gridContainer?.children || []).push(gridContainer) .toString().split(',');

//         let videoFigure = document.querySelector('.video--figure') as HTMLElement; // as singular element
//         let videoFigures = document.querySelectorAll('.video--figure') as any; // as array



//        let currentBoundRect =  videoFigure.getBoundingClientRect();
//         // let currentRect = videoFigure.getClientRects(); //sometimmes this can compute better. 
//         const fillers = videoFigure.hasAttribute("filler-space");


//         // filter out the filler classes
//        const filterVideos = videoFigures.filter(fillers).toArray(); // put this in its own array
//        filterVideos.forEach(videoFigure => {})
//             //assign a class or sort these diff from your regular function
// }


// document.addEventListener('DOMContentLoaded', () => {
//     const gridContainer = document.querySelector('.video--placement--grid') as HTMLElement;
//     const videoItems = Array.from(gridContainer.querySelectorAll('.video--item'));
//     const videoFigures = Array.from(gridContainer.querySelectorAll('.video--figure')).map(figure => figure.querySelector('video'));

//     const videos = Array.from(gridContainer?.children || []).push(gridContainer) .toString().split(',');



//     const totalCells = 20; // Total number of cells in the grid (5 columns * 4 rows)
//     const minWidth = 100; // Minimum width in pixels
//     const maxWidth = 300; // Maximum width in pixels

//     function isCellOccupied(startRow: number, startColumn: number, endRow: any, endColumn: any) {
//         return videoFigures.some(video => {

//             // videoStartRow = parseInt(videoItems.style.gridRowStart, 10) - 1;

//             const videoStartRow = parseInt(video!.style.gridRowStart, 10) - 1;
//             const videoStartColumn = parseInt(video!.style.gridColumnStart, 10) - 1;
//             const videoEndRow = parseInt(video!.style.gridRowEnd, 10) - 1;
//             const videoEndColumn = parseInt(video!.style.gridColumnEnd, 10) - 1;
//             return startRow >= videoStartRow && startRow <= videoEndRow &&
//                    startColumn >= videoStartColumn && startColumn <= videoEndColumn;
//         });
//     }

//     videoItems.forEach(video => {
//         let startRow, startColumn, endRow, endColumn;
//         //untested methods that you might use
        



//         // do {
           
//         // } while (isCellOccupied(startRow, startColumn, endRow, endColumn));

//         // Generate random start and end positions within the grid
//         startRow = Math.floor(Math.random() * numOfRows); // Random starting row
//         startColumn = Math.floor(Math.random() * numOfColumns); // Random starting column
//         endRow = startRow + Math.floor(Math.random() * numOfRows); // Random ending row
//         endColumn = startColumn + Math.floor(Math.random() * numOfColumns); // Random ending column

//         // Ensure the video fits within the grid bounds
//         if (endRow >= numOfRows || endColumn >= numOfColumns) {
//             endRow = Math.min(endRow, numOfRows - 1);
//             endColumn = Math.min(endColumn, numOfColumns - 1);
//         }

//         // Generate a random size between minWidth and maxWidth
//         let randomSize = Math.floor(minWidth + Math.random() * (maxWidth - minWidth));

//         // Apply grid placement and random size
//         video.style.gridColumnStart = startColumn + 1;
//         video.style.gridRowStart = startRow + 1;
//         video.style.gridColumnEnd = endColumn + 1;
//         video.style.gridRowEnd = endRow + 1;
//         video.style.width = `${randomSize} + px`; // Set the width of the video
//         // Optionally, set the height based on aspect ratio or other criteria
//     });
// });


// window.addEventListener("load", () => {
//     // track the mouse positions to send it to the shaders
//     const mousePosition = new Vec2();
//     // we will keep track of the last position in order to calculate the movement strength/delta
//     const mouseLastPosition = new Vec2();

//     const deltas = {
//         max: 0,
//         applied: 0,
//     };

//     // set up our WebGL context and append the canvas to our wrapper
//     const curtains = new Curtains({
//         container: "canvas",
//         watchScroll: false, // no need to listen for the scroll in this example
//         pixelRatio: Math.min(1.5, window.devicePixelRatio) // limit pixel ratio for performance
//     });

//     // handling errors
//     curtains.onError(() => {
//         // we will add a class to the document body to display original video
//         document.body.classList.add("no-curtains", "curtains-ready");

//         // handle video
//         document.getElementById("enter-site").addEventListener("click", () => {
//             // display canvas and hide the button
//             document.body.classList.add("video-started");

//             planeElements[0].getElementsByTagName("video")[0].play();
//         }, false);
//     }).onContextLost(() => {
//         // on context lost, try to restore the context
//         curtains.restoreContext();
//     });

//     // get our plane element
//     const planeElements = document.getElementsByClassName("curtain");


//     const vs = `
//         precision mediump float;

//         // default mandatory variables
//         attribute vec3 aVertexPosition;
//         attribute vec2 aTextureCoord;

//         uniform mat4 uMVMatrix;
//         uniform mat4 uPMatrix;
        
//         // our texture matrix uniform
//         uniform mat4 simplePlaneVideoTextureMatrix;

//         // custom variables
//         varying vec3 vVertexPosition;
//         varying vec2 vTextureCoord;

//         uniform float uTime;
//         uniform vec2 uResolution;
//         uniform vec2 uMousePosition;
//         uniform float uMouseMoveStrength;


//         void main() {

//             vec3 vertexPosition = aVertexPosition;

//             // get the distance between our vertex and the mouse position
//             float distanceFromMouse = distance(uMousePosition, vec2(vertexPosition.x, vertexPosition.y));

//             // calculate our wave effect
//             float waveSinusoid = cos(5.0 * (distanceFromMouse - (uTime / 75.0)));

//             // attenuate the effect based on mouse distance
//             float distanceStrength = (0.4 / (distanceFromMouse + 0.4));

//             // calculate our distortion effect
//             float distortionEffect = distanceStrength * waveSinusoid * uMouseMoveStrength;

//             // apply it to our vertex position
//             vertexPosition.z +=  distortionEffect / 30.0;
//             vertexPosition.x +=  (distortionEffect / 30.0 * (uResolution.x / uResolution.y) * (uMousePosition.x - vertexPosition.x));
//             vertexPosition.y +=  distortionEffect / 30.0 * (uMousePosition.y - vertexPosition.y);

//             gl_Position = uPMatrix * uMVMatrix * vec4(vertexPosition, 1.0);

//             // varyings
//             vTextureCoord = (simplePlaneVideoTextureMatrix * vec4(aTextureCoord, 0.0, 1.0)).xy;
//             vVertexPosition = vertexPosition;
//         }
//     `;

//     const fs = `
//         precision mediump float;

//         varying vec3 vVertexPosition;
//         varying vec2 vTextureCoord;

//         uniform sampler2D simplePlaneVideoTexture;

//         void main() {
//             // apply our texture
//             vec4 finalColor = texture2D(simplePlaneVideoTexture, vTextureCoord);

//             // fake shadows based on vertex position along Z axis
//             finalColor.rgb -= clamp(-vVertexPosition.z, 0.0, 1.0);
//             // fake lights based on vertex position along Z axis
//             finalColor.rgb += clamp(vVertexPosition.z, 0.0, 1.0);

//             // handling premultiplied alpha (useful if we were using a png with transparency)
//             finalColor = vec4(finalColor.rgb * finalColor.a, finalColor.a);

//             gl_FragColor = finalColor;
//         }
//     `;

//     // some basic parameters
//     const params = {
//         vertexShader: vs,
//         fragmentShader: fs,
//         widthSegments: 20,
//         heightSegments: 20,
//         uniforms: {
//             resolution: { // resolution of our plane
//                 name: "uResolution",
//                 type: "2f", // notice this is an length 2 array of floats
//                 value: [planeElements[0].clientWidth, planeElements[0].clientHeight],
//             },
//             time: { // time uniform that will be updated at each draw call
//                 name: "uTime",
//                 type: "1f",
//                 value: 0,
//             },
//             mousePosition: { // our mouse position
//                 name: "uMousePosition",
//                 type: "2f", // again an array of floats
//                 value: mousePosition,
//             },
//             mouseMoveStrength: { // the mouse move strength
//                 name: "uMouseMoveStrength",
//                 type: "1f",
//                 value: 0,
//             }
//         },
//     };

//     // create our plane
//     const simplePlane = new Plane(curtains, planeElements[0], params);

//     simplePlane.onReady(() => {
//         // display the button
//         document.body.classList.add("curtains-ready");

//         // set a fov of 35 to reduce perspective (we could have used the fov init parameter)
//         simplePlane.setPerspective(35);

//         // now that our plane is ready we can listen to mouse move event
//         const wrapper = document.getElementById("page-wrap");

//         wrapper.addEventListener("mousemove", (e) => {
//             handleMovement(e, simplePlane);
//         });

//         wrapper.addEventListener("touchmove", (e) => {
//             handleMovement(e, simplePlane);
//         }, {
//             passive: true
//         });

//         // click to play the videos
//         document.getElementById("enter-site").addEventListener("click", () => {
//             // display canvas and hide the button
//             document.body.classList.add("video-started");

//             // apply a little effect once everything is ready
//             deltas.max = 2;

//             simplePlane.playVideos();
//         }, false);


//     }).onRender(() => {
//         // increment our time uniform
//         simplePlane.uniforms.time.value++;

//         // decrease both deltas by damping : if the user doesn't move the mouse, effect will fade away
//         deltas.applied += (deltas.max - deltas.applied) * 0.02;
//         deltas.max += (0 - deltas.max) * 0.01;

//         // send the new mouse move strength value
//         simplePlane.uniforms.mouseMoveStrength.value = deltas.applied;

//     }).onAfterResize(() => {
//         const planeBoundingRect = simplePlane.getBoundingRect();
//         simplePlane.uniforms.resolution.value = [planeBoundingRect.width, planeBoundingRect.height];
//     }).onError(() => {
//         // we will add a class to the document body to display original video
//         document.body.classList.add("no-curtains", "curtains-ready");

//         // handle video
//         document.getElementById("enter-site").addEventListener("click", () => {
//             // display canvas and hide the button
//             document.body.classList.add("video-started");

//             planeElements[0].getElementsByTagName("video")[0].play();
//         }, false);
//     });

//     // handle the mouse move event
//     function handleMovement(e, plane) {
//         // update mouse last pos
//         mouseLastPosition.copy(mousePosition);

//         const mouse = new Vec2();

//         // touch event
//         if(e.targetTouches) {
//             mouse.set(e.targetTouches[0].clientX, e.targetTouches[0].clientY);
//         }
//         // mouse event
//         else {
//             mouse.set(e.clientX, e.clientY);
//         }

//         // lerp the mouse position a bit to smoothen the overall effect
//         mousePosition.set(
//             curtains.lerp(mousePosition.x, mouse.x, 0.3),
//             curtains.lerp(mousePosition.y, mouse.y, 0.3)
//         );

//         // convert our mouse/touch position to coordinates relative to the vertices of the plane and update our uniform
//         plane.uniforms.mousePosition.value = plane.mouseToPlaneCoords(mousePosition);

//         // calculate the mouse move strength
//         if(mouseLastPosition.x && mouseLastPosition.y) {
//             let delta = Math.sqrt(Math.pow(mousePosition.x - mouseLastPosition.x, 2) + Math.pow(mousePosition.y - mouseLastPosition.y, 2)) / 30;
//             delta = Math.min(4, delta);
//             // update max delta only if it increased
//             if(delta >= deltas.max) {
//                 deltas.max = delta;
//             }
//         }
//     }
// });




//gsap modules
// import gsap from 'gsap'
// import { Flip } from 'gsap/Flip';
// import Draggable from 'gsap/Draggable';
// import ScrollTrigger from 'gsap/ScrollTrigger';
// import ScrollToPlugin from 'gsap/ScrollToPlugin';
// import EasePack from 'gsap/EasePack';
// import { Power4 } from 'gsap/gsap-core';
// import Observer from 'gsap/Observer';
// import SplitText from 'gsap/SplitText';
// import Timeline from 'gsap/all';
// import  Tween  from 'gsap/src/all';



// import Splide from "@splidejs/splide";
// import { Video } from '@splidejs/splide-extension-video';
// import { URLHash } from '@splidejs/splide-extension-url-hash';
// // import '@splidejs/splide/css/core';
// //others
// // import curtainsjs, { Curtains, Plane, Vec2 } from './vendors/curtains/index';
// // import Lenis from 'lenis';
// import {EventDispatcher} from "./shared/eventdispatch";
// import { Canvas } from './Canvas'
// import {Navigation, AnimationHandler} from "./shared/nav";
// const navigation = new Navigation();
// console.log("slider module loaded");

// const smallVideoAssets = [
//   { src: '../../assets/videos/lenovo-thinkpad-mountain.mp4' },
//   { src: '../../assets/optimized/y3000casefilmH.264.mp4' },
//   { src: '../../assets/optimized/voicesofgalaxyH.264.mp4' },
//   { src: '../../assets/optimized/galaxyfold4launchH.264.mp4' },
//   { src: '../../assets/optimized/food_moodH.264.mp4' },
//   { src: '../../assets/voices-of-galaxy.mp4' },
//   { src: '../../assets/optimized/samsungtinytypeH.264.mp4' },
//   { src: '../../assets/videos/hrblock-life-uncertainties.mp4' },
//   { src: '../../assets/optimized/flip_&_fold_launchH.264.mp4' },
//   { src: '../../assets/optimized/selfie_by_flipH.264.mp4' },


  
// ];
// // do it again, set up the src of the video assets - big version
// const largeVideoAssets = [
// { src: '../../assets/videos/lenovo-thinkpad-mountain.mp4' },
// { src: '../../assets/optimized/y3000casefilmH.264.mp4' },
// { src: '../../assets/optimized/voicesofgalaxyH.264.mp4' },
// { src: '../../assets/optimized/galaxyfold4launchH.264.mp4' },
// { src: '../../assets/optimized/food_moodH.264.mp4' },
// { src: '../../assets/voices-of-galaxy.mp4' },
// { src: '../../assets/optimized/samsungtinytypeH.264.mp4' },
// { src: '../../assets/videos/hrblock-life-uncertainties.mp4' },
// { src: '../../assets/optimized/flip_&_fold_launchH.264.mp4' },
// { src: '../../assets/optimized/selfie_by_flipH.264.mp4' },



// ];

// largeVideoAssets.map(asset => {
//   asset.src = `../../assets/${asset.src}`;
// console.log('asset array map loaded');


// })

// const splide = new Splide( '.splide', {
//   heightRatio: 0.5625,
//   cover      : true,
//   rewind    : true,
//   arrows    : false,

//   video      : {
//     loop: true,
//     autoplay: false,
//     playerOptions: {
//       htmlVideo: {
//         playsInline: false
//       }
//     }




//   },
// } );

// splide.mount( { Video , URLHash} );

// splide.on( 'isActive', () => {
//   console.log( 'slide is active' );
// } );

// splide.on( 'video:pause', () => {
//   console.log( 'pause' );
// } );

// splide.on( 'video:ended', () => {
//   console.log( 'ended' );
// } );

// // splide.Components.Slides.forEach((slide) => {
// //   const video = slide.querySelector(".slider-video") as HTMLVideoElement;

// // console.log(splide.index)


// // })

// //locals
// // import { scrollEvent, scrollInit } from './scrollhandler';


// // gsap.registerPlugin(EasePack, Tween, SteppedEase, Timeline, Power4, Flip, Draggable, ScrollTrigger, Observer, ScrollToPlugin);

// // const sections = gsap.utils.toArray(".sticky-element");
// // const images = gsap.utils.toArray(".track").reverse();
// // const slideImages = gsap.utils.toArray(".slider-video");
// // const outerWrappers = gsap.utils.toArray(".track-flex");
// // const innerWrappers = gsap.utils.toArray(".panel-wide");
// // const count = document.querySelector(".count");
// // const wrap = gsap.utils.wrap(0, sections.length);
// // let animating;
// // let currentIndex = 0;

// // gsap.set(outerWrappers, { xPercent: 100 });
// // gsap.set(innerWrappers, { xPercent: -100 });
// // gsap.set(".slide:nth-of-type(1) .slide__outer", { xPercent: 0 });
// // gsap.set(".slide:nth-of-type(1) .slide__inner", { xPercent: 0 });

// // function gotoSection(index, direction) {
// //  animating = true;
// //  index = wrap(index);

// //  let tl = gsap.timeline({
// //   defaults: { duration: 1, ease: "expo.inOut" },
// //   onComplete: () => {
// //    animating = false;
// //   }
// //  });

// //  let currentSection = sections[currentIndex];
// //  let heading = currentSection.querySelector(".panel-overlay-text");
// //  let nextSection = sections[index];
// //  let nextHeading = nextSection.querySelector(".panel-overlay-text");

// //  gsap.set([sections, images], { zIndex: 0, autoAlpha: 0 });
// //  gsap.set([sections[currentIndex], images[index]], { zIndex: 1, autoAlpha: 1 });
// //  gsap.set([sections[index], images[currentIndex]], { zIndex: 2, autoAlpha: 1 });

// //  tl
// //   .set(count, { text: index + 1 }, 0.32)
// //   .fromTo(
// //    outerWrappers[index],
// //    {
// //     xPercent: 100 * direction
// //    },
// //    { xPercent: 0 },
// //    0
// //   )
// //   .fromTo(
// //    innerWrappers[index],
// //    {
// //     xPercent: -100 * direction
// //    },
// //    { xPercent: 0 },
// //    0
// //   )
// //   .to(
// //    heading,
// //    {
// //     "--width": 800,
// //     xPercent: 30 * direction
// //    },
// //    0
// //   )
// //   .fromTo(
// //    nextHeading,
// //    {
// //     "--width": 800,
// //     xPercent: -30 * direction
// //    },
// //    {
// //     "--width": 200,
// //     xPercent: 0
// //    },
// //    0
// //   )
// //   .fromTo(
// //    images[index],
// //    {
// //     xPercent: 125 * direction,
// //     scaleX: 1.5,
// //     scaleY: 1.3
// //    },
// //    { xPercent: 0, scaleX: 1, scaleY: 1, duration: 1 },
// //    0
// //   )
// //   .fromTo(
// //    images[currentIndex],
// //    { xPercent: 0, scaleX: 1, scaleY: 1 },
// //    {
// //     xPercent: -125 * direction,
// //     scaleX: 1.5,
// //     scaleY: 1.3
// //    },
// //    0
// //   )
// //   .fromTo(
// //    slideImages[index],
// //    {
// //     scale: 2
// //    },
// //    { scale: 1 },
// //    0
// //   )
// //   .timeScale(0.8);

// //  currentIndex = index;
// // }

// // Observer.create({
// //  type: "wheel,touch,pointer",
// //  preventDefault: true,
// //  wheelSpeed: -1,
// //  onUp: () => {
// //   console.log("down");
// //   if (animating) return;
// //   gotoSection(currentIndex + 1, +1);
// //  },
// //  onDown: () => {
// //   console.log("up");
// //   if (animating) return;
// //   gotoSection(currentIndex - 1, -1);
// //  },
// //  tolerance: 10
// // });

// // document.addEventListener("keydown", logKey);

// // function logKey(e) {
// //  console.log(e.code);
// //  if ((e.code === "ArrowUp" || e.code === "ArrowLeft") && !animating) {
// //   gotoSection(currentIndex - 1, -1);
// //  }
// //  if (
// //   (e.code === "ArrowDown" ||
// //    e.code === "ArrowRight" ||
// //    e.code === "Space" ||
// //    e.code === "Enter") &&
// //   !animating
// //  ) {
// //   gotoSection(currentIndex + 1, 1);
// //  }
// // }



// function scrollToVideo() {
//   const video = document.querySelector(`[data-hashnav="${hash}"]`);
//   if (video) {
//     const slider = video.closest('.panel-wide');
//     if (slider) {
//       gsap.to(window, {
//         scrollTo: {
//           y: "+=" + slider.getBoundingClientRect().left,
//         },
//         duration: 0.5,
//         onComplete: () => {
//           ScrollTrigger.refresh();
//         },
//       });
//     }
//   }
// }

// function setupHashNav() {
//   if (window.location.hash) {
//     scrollToVideo();
//   }

//   const thumbnails = document.querySelectorAll('.thumbs a');
//   thumbnails.forEach((thumb) => {
//     thumb.addEventListener('click', (e) => {
//       e.preventDefault();
//       const hash = e.target.getAttribute('href').replace('#', '');
//       scrollToVideo();
//       window.location.hash = hash;
//     });
//   });

//   window.addEventListener('hashchange', () => {
//     scrollToVideo();
//   });
// }

// function handleExternalLinks() {
//   if (window.location.hash) {
//     const hash = window.location.hash.replace('#', '');
//     scrollToVideo();
//   }
// }

// // document.addEventListener('DOMContentLoaded', () => {
// //   setupHashNav();
// //   handleExternalLinks();
// //   gsap.fromTo("body", { opacity: 0 }, { opacity: 1, duration: 0.5 });
// // });

// const onScroll = () => {

  
  
//   }

//   const onDOMContentLoaded = () => {
//     console.log("dom content loaded")
//   }

//   const onClick = () => { 
//     console.log("clicked");

//   }
//   const eventDispatcher = new EventDispatcher();
// // use the dispatcher, this should not need editing 
// eventDispatcher.addEventListener("DOMContentLoaded", onDOMContentLoaded);
// eventDispatcher.addEventListener("click", onClick);
// eventDispatcher.addEventListener("scroll", onScroll);



// let time = 0;

// // const canvasElement = document.querySelector<HTMLCanvasElement>('.webgl-canvas');
// // if (canvasElement) {
// //   const canvas = new Canvas(canvasElement);
// //   window.addEventListener('beforeunload', () => {
// //     canvas.dispose();
// //   });
// // }

//  function scrollInit() {
//   const hash = window.location.hash.replace('#', '');

//   // const lenis = new Lenis({
//   //   duration: 1.2,
//   //   easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
//   //   smooth: true,
//   // });

//   // function raf(time) {
//   //   lenis.raf(time);
//   //   requestAnimationFrame(raf);
//   // }

//   // let raf = requestAnimationFrame();

//   // lenis.on('scroll', (e: any) => {
//   //   console.log('is scrolling');
//   // });

//   // lenis.on('scroll', scrollInit);

//   gsap.ticker.add((time) => {
//     gsap.ticker.lagSmoothing(0);
//   });



//   const select = (e) => document.querySelector(e);
//   const selectAll = (e) => document.querySelectorAll(e);

//   const tracks = selectAll(".sticky-element");

//   tracks.forEach((track, i) => {
//     const trackWrapper = track.querySelectorAll(".track");
//     const trackFlex = track.querySelectorAll(".track-flex");
//     const allImgs = track.querySelectorAll(".slider-video");
//     const progress = track.querySelectorAll(".progress--bar-total");

//     const sliders = gsap.utils.toArray(".panel-wide");
//     const thumbs = gsap.utils.toArray(".thumbs");
//     const visible = gsap.utils.toArray(".visible");

//     const trackWrapperWidth = () => {
//       let width = 0;
//       trackWrapper.forEach((el) => (width += el.offsetWidth));
//       return width;
//     };

//     const trackFlexWidth = () => {
//       let width = 0;
//       trackFlex.forEach((el) => (width += el.offsetWidth));
//       return width;
//     };

//     ScrollTrigger.defaults({});

//     gsap.defaults({
//       ease: "none",
//     });

//     const scrollTween = gsap.to(trackWrapper, {
//       x: () => -trackWrapperWidth() + window.innerWidth,
//       scrollTrigger: {
//         trigger: track,
//         pin: true,
//         anticipatePin: 1,
//         scrub: 1,
//         start: "center center",
//         end: () => "+=" + (track.scrollWidth - window.innerWidth),
//         onRefresh: (self) => self.getTween().resetTo("totalProgress", 0),
//         invalidateOnRefresh: true,
//       },
//     });

//     allImgs.forEach((img, i) => {
//       gsap.fromTo(
//         img,
//         { x: "-45vw" },
//         {
//           x: "45vw",
//           scrollTrigger: {
//             trigger: img.parentNode,
//             containerAnimation: scrollTween,
//             start: "left right",
//             end: "right left",
//             scrub: true,
//             invalidateOnRefresh: true,
//             onRefresh: (self) => {
//               if (self.start < 0) {
//                 self.animation.progress(gsap.utils.mapRange(self.start, self.end, 0, 1, 0));
//               }
//             },
//           },
//         }
//       );
//     });

//     const progressBar = gsap
//       .timeline({
//         scrollTrigger: {
//           trigger: trackWrapper,
//           containerAnimation: scrollTween,
//           start: "left left",
//           end: () => "+=" + (trackWrapperWidth() - window.innerWidth),
//           scrub: true,
//         },
//       })
//       .to(progress, {
//         width: "100%",
//         ease: "none",
//       });

//     sliders.forEach((slider, i) => {
//       const anim = gsap
//         .timeline({
//           scrollTrigger: {
//             trigger: slider,
//             containerAnimation: scrollTween,
//             start: "left right",
//             end: "right right",
//             scrub: true,
//           },
//         })
//         .to(visible, {
//           width: "100%",
//           backgroundColor: "#000000",
//           ease: "none",
//         });
//     });

//     sliders.forEach((slider, i) => {
//       if (thumbs[i]) {
//         thumbs[i].onclick = () => {
//           gsap.to(window, {
//             scrollTo: {
//               y: "+=" + slider.getBoundingClientRect().left,
//             },
//             duration: 0.5,
//           });
//         };
//       }
//     });
//   });
// }
// eventDispatcher.addEventListener("fullscreenchange",onChange);
// eventDispatcher.addEventListener("resize",onResize);
// document.addEventListener("scroll", scrollInit);
// scrollInit();

// const hash = newFunction();
  
// function scrollInit() {
 
//   const hash = window.location.hash.replace('#', '');
//   // const logo = document.querySelector("topbar--svg");
//   // lenis
//   const lenis = new Lenis({
//     duration: 1.2,
//     easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
//     smooth: true,
//     // prevent: (node) => node.id === logo,
//   });

//   function raf(time) {
//     lenis.raf(time);
//     requestAnimationFrame(raf);
//   }

//   requestAnimationFrame(raf);

//   lenis.on('scroll', (e: any) => {
//     console.log('is scrfolling');
//   });

//   lenis.on('scroll', ScrollTrigger.update);

//   gsap.ticker.add((time) => {
//     lenis.raf(time * 1000);

//   });

//   gsap.ticker.lagSmoothing(0);


//   let select = (e) => document.querySelector(e);
//   let selectAll = (e) => document.querySelectorAll(e);

//   const tracks = selectAll(".sticky-element");


//   tracks.forEach((track, i) => {
//     let trackWrapper = track.querySelectorAll(".track");
//     let trackFlex = track.querySelectorAll(".track-flex");
//     let allImgs = track.querySelectorAll(" .slider-video");
//     let progress = track.querySelectorAll(".progress--bar-total");

//     let sliders = gsap.utils.toArray(".panel-wide");
//     let thumbs = gsap.utils.toArray(".thumbs");
//     let visible = gsap.utils.toArray(".visible");

//     let trackWrapperWidth = () => {
//       let width = 0;
//       trackWrapper.forEach((el) => (width += el.offsetWidth));
//       return width;
//     };

//     let trackFlexWidth = () => {
//       let width = 0;
//       trackFlex.forEach((el) => (width += el.offsetWidth));
//       return width;
//     };

//     ScrollTrigger.defaults({});

//     gsap.defaults({
//       ease: "none",
//     });

//     let scrollTween = gsap.to(trackWrapper, {
//       x: () => -trackWrapperWidth() + window.innerWidth,
//       scrollTrigger: {
//         trigger: track,
//         pin: true,
//         anticipatePin: 1,
//         scrub: 1,
//         start: "center center",
//         end: () => "+=" + (track.scrollWidth - window.innerWidth),
//         onRefresh: (self) => self.getTween().resetTo("totalProgress", 0),
//         invalidateOnRefresh: true
//       }
//     });

//     allImgs.forEach((img, i) => {
//       gsap.fromTo(img, {
//         x: "-45vw"
//       }, {
//         x: "45vw",
//         scrollTrigger: {
//           trigger: img.parentNode,
//           containerAnimation: scrollTween,
//           start: "left right",
//           end: "right left",
//           scrub: true,
//           invalidateOnRefresh: true,
//           onRefresh: self => {
//             if (gsap.start < 0) {
//               self.animation.progress(gsap.utils.mapRange(self.start, self.end, 0, 1, 0));
//             }
//           }
//         }
//       });
//     });

//     let progressBar = gsap.timeline({
//       scrollTrigger: {
//         trigger: trackWrapper,
//         containerAnimation: scrollTween,
//         start: "left left",
//         end: () => "+=" + (trackWrapperWidth() - window.innerWidth),
//         scrub: true
//       }
//     }).to(progress, {
//       width: "100%",
//       ease: "none"
//     });

//     sliders.forEach((slider, i) => {
//       let anim = gsap.timeline({
//         scrollTrigger: {
//           trigger: slider,
//           containerAnimation: scrollTween,
//           start: "left right",
//           end: "right right",
//           scrub: true,
//         }
//       }).to(visible, {
//         width: "100%",
//         backgroundColor: "#000000",
//         ease: "none"
//       });
//     });

//     sliders.forEach((slider, i) => {
//       if (thumbs[i]) {
//         thumbs[i].onclick = () => {
//           gsap.to(window, {
//             scrollTo: {
//               y: "+=" + slider.getBoundingClientRect().left,
//             },
//             duration: 0.5,
//           });
//         };
//       }
//     });

//   });

// }

//   // Scroll to video function
//   function scrollToVideo() {
//     // let hash = "";
 
//     const video = document.querySelector(`[data-hashnav="${hash}"]`);
//     if (video) {
//       const slider = video.closest('.panel-wide');
//       if (slider) {
//         gsap.to(window, {
//           scrollTo: {
//             y: "+=" + slider.getBoundingClientRect().left,
//           },
//           duration: 0.5,
//           onComplete: () => {
//             ScrollTrigger.refresh();
//           }
//         });
//       }
//     }
//   }
  
//   // Hash navigation setup
//   function setupHashNav() {
//     if (window.location.hash) {
//     //   const hash = window.location.hash.replace('#', '');
//       scrollToVideo();
//     }
  
//     const thumbnails = document.querySelectorAll('.thumbs a');
//     thumbnails.forEach(thumb => {
//       thumb.addEventListener('click', (e) => {
//         e.preventDefault();
//         const hash = e.target.getAttribute('href').replace('#', '');
//         scrollToVideo();
//         window.location.hash = hash;
//       });
//     });
  
//     window.addEventListener('hashchange', () => {
//     //   const hash = window.location.hash.replace('#', '');
//       scrollToVideo();
//     });
//   }
  
//   // Additional function to handle links from other pages
//   function handleExternalLinks() {
//     if (window.location.hash) {
//       const hash = window.location.hash.replace('#', '');
//       scrollToVideo();
//     }
//   }
  
//   document.addEventListener('DOMContentLoaded', () => {
//     setupHashNav();
//     handleExternalLinks();
//     gsap.fromTo("body", { opacity: 0 }, { opacity: 1, duration: 0.5 });
//   });
  
// //   document.addEventListener('change', (e) => {
// //     if (AnimationEvent) {
// //       // stopOverscroll(".sticky-element");
// //     }
// //   });
// document.addEventListener("scroll", scrollInit);
// scrollInit();

// LoadMe();
// function LoadMe() {
//   var loadedCount = 0; // current number
//   var videosToLoad = ('.video--figure').length; // number of videos
//   var loadingProgress = 0; // TL progress - starts at 0
//   loadProgress();

//   if (!(document.querySelector('.loader-wrapper'))) {
//       for (let i = 0; i < videosToLoad; i++) {
//           loadedCount++;
//           console.log(loadedCount);
//       }
//   }

//   function loadProgress() {
//       // one more image has been loaded
//       loadedCount++;
//       loadingProgress = (loadedCount / videosToLoad);

//       if (document.querySelector('.loader-wrapper')) {
//           gsap.timeline()
//               .to(".loader-wrapper", { duration: 3, opacity: 0, autoAlpha: 0, ease: Power4.easeIn, delay: 0.5 })
//               .set(('#site-loader'), { className: 'is-hidden' })
//               .then(loadComplete)
//               .finally(replenishMe);
//       }
//   }

//   function loadComplete() {
//       if (document.querySelector('.loader-wrapper')) {
//           gsap.timeline()
//               .set(('#site-loader'), { className: 'is-loaded' })
//               .set(('.loader-wrapper'), { className: 'is-loaded' })
//               .set(('.loader-wrapper'), { className: 'is-hidden' })
//               .set(('.mr--texterton__wrapper'), { className: 'is-hidden' })
//               .set(('.mr--bloberton__wrapper'), { className: 'is-hidden' })
          
//               .from("#site-loader", { duration: 3, opacity:0, autoAlpha: 1, ease: Power4.easeInOut, delay: 0.5 });
//       }
//   }

//   function replenishMe() {
//       if (!(document.querySelector('.loader-wrapper'))) {
//           gsap.timeline().kill();
//           console.log("no loader");
//       }
//   }
// }

// function fitPositionAbsoluteElements() {
//   const smileyWrapper = document.querySelector('.central--smile__wrapper') as HTMLElement;
//   //k add

//   function getDomSize() {
//     //this is a "getter"
//     //get height
//     smileyWrapper.style.getPropertyValue('--adjust-height');
//     getComputedStyle(smileyWrapper).getPropertyValue('--adjust-height');
//     // get width
//     smileyWrapper.style.getPropertyValue('--adjust-width');
//     getComputedStyle(smileyWrapper).getPropertyValue('--adjust-width');
//   }
//   if (smileyWrapper) {
//       function updateSize() {
//         getDomSize(); // we are getting these values from this func
        
//         //let's reset the values of our var, or leave them
//         let width = window.innerWidth.toString();
//         let height = window.innerHeight.toString();
//         smileyWrapper.style.setProperty('--adjust-width', width);
//         smileyWrapper.style.setProperty('--adjust-height', height);
//           //old frog
//           // let width = window.innerWidth;
//           // let height = window.innerHeight;
//           // videoGridElement.style.width = `${width} + px`;
//           // videoGridElement.style.height = `${height}px`;
//       }
//       updateSize();
//       window.addEventListener('resize', updateSize);
//   } else {
//       console.error('Element with class .video--placement--grid not found.');
//   }
// }

// fitPositionAbsoluteElements();


// if(reload) {
// reload.addEventListener("click", () => {
//   log.textContent = "";
//   setTimeout(() => {
//     window.location.reload(true);
//   }, 200);
// });
// }

// window.addEventListener("load", (event) => {
//   console.log( "load\n");
// });

// document.addEventListener("readystatechange", (event) => {
//   console.log(`readystate: ${document.readyState}\n`);
//   loadingPage.style.display = "none";
//   setTimeout(() => {
//     // window.location.reload();
//     LoadMe();
//   }, 200);
// });

// document.addEventListener("DOMContentLoaded", (event) => {
//   console.log( `DOMContentLoaded\n`);

//   // await new Promise((resolve) => {
//   //   setTimeout(() => {
//   //    LoadMe();
//   //   })
//   //   console.log("gsap loader loaded")
//   // })

// });






//   const gridElement = document.querySelector('.video--placement--grid') as HTMLElement;
//   const gridItems = gsap.utils.toArray(gridElement.querySelectorAll('.video--figure'));
//   const gridItemsShuffled = gsap.utils.shuffle(gridItems);
//   const fullscreenElement = document.querySelector('.fullscreen--scale') as HTMLElement;
//   const maskingLayer = document.querySelector('.masking--element') as HTMLElement;
//   // Map to store the initial state of each video
//   let currentFullscreenVideo: HTMLElement | null = null;
// // Map to store the initial state of each video
// const originalStates = new Map<Element, { parent: Element, index: number, position: { top: number, left: number, width: number, height: number } }>();
//   // Flag to track fullscreen mode
// let isFullscreen = false;



//   // Pause all videos except the one in fullscreen
// const pauseOtherVideos = (excludeVideo: HTMLVideoElement) => {
//     gridItems.forEach((item: HTMLElement) => {
//       const video = item.querySelector('.video--item') as HTMLVideoElement;
//       if (video && video !== excludeVideo && !video.paused) {
//         video.pause();
//       }
//     });
//   };
  
//   // Play the fullscreen video
// const playFullscreenVideo = (video: HTMLVideoElement) => {
//     if (video.paused) {
//       video.play();
//     }
//   };





// // Event listener for DOMContentLoaded
// document.addEventListener('DOMContentLoaded', () => {




//   console.log('slider page loaded')
// //  .then(() => {
// //     initEvents();
// //     animateLogo();
// //   })

// });




// // Selecting DOM elements
// const gridElement = document.querySelector('.video--placement--grid') as HTMLElement;
// // let gridItems = gridElement.querySelectorAll('.video--figure').gsap.utils.toArray();
// let gridItems = gsap.utils.toArray(gridElement.querySelectorAll('.video--figure'));
// // const gridItems = Array.from(gridElement.querySelectorAll('.video--figure')); // Convert NodeList to Array
// const gridVideo = gridElement.querySelectorAll('.video--item');
// const fullscreenElement = document.querySelector('.fullscreen--scale');
// const maskingLayer = document.querySelector('.masking--element');

// // Flag to track fullscreen mode
// let isFullscreen = false;

// // Animation defaults
// const animationDefaults = { duration: 1, ease: 'expo.inOut' };

// // // Function to flip the clicked image and animate its movement
// // const flipImage = (gridItem, gridVideo) => {
// //   gsap.set(gridItem, { zIndex: 99 });
// //   const state = Flip.getState(gridVideo, { props: 'borderRadius' });
// //   if (isFullscreen) {
// //     gridItem.appendChild(gridVideo);
// //   } else {
// //     fullscreenElement!.appendChild(gridVideo);
// //   }

// //   Flip.from(state, {
// //     ...animationDefaults,
// //     absolute: true,
// //     prune: true,
// //     onComplete: () => {
// //       if (isFullscreen) {
// //         gsap.set(gridItem, { zIndex: 'auto' });
// //       }
// //       isFullscreen = !isFullscreen;
// //     }
// //   });
// // };

// // newFunction();

// const flipVideo = (gridItem: Element, gridVideo: Element) => {    
//     gsap.set(gridItem, { zIndex: 1 });
//     gsap.set(maskingLayer, { zIndex: 0});
//     gsap.to(maskingLayer, {animationDefaults, opacity: .85 });
//     const state = Flip.getState(gridVideo, { props: 'borderRadius' });
  
//     if (isFullscreen) {
//       gridItem.appendChild(gridVideo);
//       fullscreenElement.innerHTML = '<p class="project-name-revealed">text</p>';


//     } else {
//       fullscreenElement?.appendChild(gridVideo);
//     }
  
//     Flip.from(state, {
//       ...animationDefaults,
//       scale: true,
//       prune: true,
  

//       onStart: () => {},
//       onLeave: () => { 
//         // let gridItems = gsap.utils.toArray(gridItems);

//         gsap.fromTo(gridItem, {opacity: 1}, {opacity: 0}) },
//       onComplete: () => {
//         if (isFullscreen) {
//           gsap.set(gridItem, { zIndex: 'unset' });
//         // gridItem.setAttribute('class', 'greyed-out');
//         }
//         isFullscreen = !isFullscreen;
//       },
//     //   onReverseComplete () => {}
//         });
//   };

// // Function to determine the position class based on the item and clicked item positions
// const determinePositionClass = (itemRect, clickedRect) => {
//   if (itemRect.bottom < clickedRect.top) {
//     return POSITION_CLASSES.NORTH;
//   } else if (itemRect.top > clickedRect.bottom) {
//     return POSITION_CLASSES.SOUTH;
//   } else if (itemRect.right < clickedRect.left) {
//     return POSITION_CLASSES.WEST;
//   } else if (itemRect.left > clickedRect.right) {
//     return POSITION_CLASSES.EAST;
//   }
//   return '';
// //   console.log(itemRect, clickedRect);
// };

// // Function to move other items based on their position relative to the clicked item
// // const moveOtherItems = (gridItem, gridVideo) => {
// //     const clickedRect = gridItem.getBoundingClientRect();
  
// //     // For the remaining stuff
// //     const otherGridItems = gridItems.filter(item => item !== gridItem);
// //     const state = Flip.getState(otherGridItems);
  
// //     otherGridItems.forEach(item => {
// //       const itemRect = item.getBoundingClientRect();
// //       const classname = determinePositionClass(itemRect, clickedRect);
// //       if (classname) {
// //         item.classList.toggle(classname, !isFullscreen);
// //         // item.classList.toggle('video-figure', !isFullscreen);

// //       }
// //     });
  
// //     Flip.from(state, {
// //       ...animationDefaults,
// //       toggleClass: 'greyed-out',
// //       scale: true,
// //     //   prune: true
// //     });
// //   };
  
// const moveOtherItemsBack = (gridItem: Element, gridVideo: Element) => {
//     const clickedRect = gridItem.getBoundingClientRect();

//     for (let i = 0; i < gridItems.length; i++) {
//         const gridItem = gridItems[i];
//         // gridItem.classList.remove('pos-north', 'pos-south', 'pos-west', 'pos-east');
//     //    if (fullscreenElement.contains(gridItem.classList.value)) {
//     //     console.log('full screen detected');

//     //    }
   

//         // if (gridElement.contains(fullscreenElement)) {
//         //     console.log('full screen detected');
//         // }


//         // gridItem.appendChild(gridVideo);

//         const index = parseInt(gridVideo.dataset.index || '0', 10);
//         // addListeners(gridItem, gridVideo);


//         }
//         addListeners(gridItem, gridVideo);
//         function addListeners(gridItem: Element, gridVideo: Element) {
//             gridElement.addEventListener('click', (e) => {
//                console.log(e.target + 'clicked');
//                let videoFigure = document.querySelector('.video--figure') as HTMLElement;
//              e.stopPropagation();
//                if (isFullscreen) {
//                 e.preventDefault();
//                 // killFlips(gridItem, gridVideo);
//                 // gridItem.killFlips();
//                 const fullState = Flip.getState(videoFigure, () => {
//                     console.log(gridVideo + ' removed');

//                 }
// );
//                 Flip.from(fullState, {
//                     ...animationDefaults,
//                     duration: 1,
//                     stagger: 0.4,
//                     onComplete: () => {
//                         appendVidBack();
                    

//                     }



//                 })


//                     function appendVidBack () {   

//                         videoFigure.appendChild(gridVideo.cloneNode(true));
//                         fullState.clear();

//                        console.log(gridVideo + ' cloned');
//                    }
//                 }


//             })

//         }



// }


// // Click event handler for the grid
// const toggleVideo = (e: Event) => {
//     const gridVideo = e.target as HTMLElement;
//     const index = parseInt(gridVideo.dataset.index || '0', 10);
//     const gridItem = gridItems[index];
    
//     flipVideo(gridItem, gridVideo);
//     moveOtherItemsBack(gridItem, gridVideo);
//   };
  
//   function animateLogo() {
//     let originPoint = '239.9 434.7 239.9 405.5 217.5 405.5 188.4 405.5 162.6 405.5 162.6 433.9 162.6 459.9 162.6 487.9 162.6 522.1 162.6 563.4 201.2 564.1 239.9 563.9 239.9 535.2 239.9 499.8 239.9 458.1 239.9 434.7';
//     let endPoint = '301.1 417.1 231.3 438.7 231.9 364.9 165.7 364.9 165.7 438.7 95.8 417.1 74.5 475.4 145.1 496.6 100.2 554.8 152.9 592 198.7 530.5 244.6 592 297.3 554.7 251.9 496.5 322.4 475.4 301.1 417.1';

//     anime({
//         targets: '#rectangle',
//         points: [
//             { value: originPoint },
//             { value: endPoint },
//             { value: originPoint }
//         ],
//         easing: 'easeOutQuad',
//         duration: 2000,
//         loop: false
//     });
// }
//   // Function to initialize event listeners for grid
//   const initEvents = () => {
//     gridVideo.forEach((gridVideo, position) => {
//       // Save the index of the video
//       gridVideo.dataset.index = position.toString();
      
//       // Add click event listener to the video
//       gridVideo.addEventListener('click', toggleVideo);
//     });
//   };
// document.addEventListener('DOMContentLoaded', initEvents);
// document.addEventListener('DOMContentLoaded', animateLogo);









// // Constants for class names
// const POSITION_CLASSES = {
//   NORTH: 'pos-north',
//   SOUTH: 'pos-south',
//   WEST: 'pos-west',
//   EAST: 'pos-east',
// };

// // Selecting DOM elements
// const gridElement = document.querySelector('.video--placement--grid') as HTMLElement;
// const gridItems = Array.from(gridElement.querySelectorAll('.video--figure')) as HTMLElement[]; // Convert NodeList to Array
// const gridVideo = Array.from(gridElement.querySelectorAll('.video--item')) as HTMLElement[];
// const fullscreenElement = document.querySelector('.fullscreen--scale');
// const clickedRect = gridItems.find(item => item.classList.contains('fullscreen--scale'))?.getBoundingClientRect();


// // Flag to track fullscreen mode
// let isFullscreen = false;

// // Animation defaults
// const animationDefaults = { duration: 1.5, ease: 'expo.inOut' };

// // // Function to flip the clicked image and animate its movement
// // const flipImage = (gridItem, gridVideo) => {
// //   gsap.set(gridItem, { zIndex: 99 });
// //   const state = Flip.getState(gridVideo, { props: 'borderRadius' });
// //   if (isFullscreen) {
// //     gridItem.appendChild(gridVideo);
// //   } else {
// //     fullscreenElement!.appendChild(gridVideo);
// //   }

// //   Flip.from(state, {
// //     ...animationDefaults,
// //     absolute: true,
// //     prune: true,
// //     onComplete: () => {
// //       if (isFullscreen) {
// //         gsap.set(gridItem, { zIndex: 'auto' });
// //       }
// //       isFullscreen = !isFullscreen;
// //     }
// //   });
// // };

// let currentFullscreenItem: Element | null = null;
// const maskingLayer = document.querySelector('.masking--element');
// const flipVideo = (gridItem: Element, gridVideo: Element) => {
//     gsap.set(gridItem, { zIndex: 1 });
//     gsap.set(maskingLayer, { zIndex: 0});
//     gsap.to(maskingLayer, {animationDefaults, opacity: .85 });
//     // const state = Flip.getState(gridVideo, { props: 'borderRadius' });
// // gsap.set(gridItem, { zIndex: 99 });
// //   gsap.set(gridItem, { zIndex: 1 });
// //   gsap.set(maskingLayer, { zIndex: 0, pointerEvents: 'none' });

//   const state = Flip.getState(gridVideo, { props: 'borderRadius' });

//   if (isFullscreen) {
//     if (currentFullscreenItem) {
//       currentFullscreenItem.appendChild(gridVideo);
//       currentFullscreenItem = null;
//     }
//   } else {
//     fullscreenElement?.appendChild(gridVideo);
//     currentFullscreenItem = gridItem;
//   }

//   Flip.from(state, {
//     ...animationDefaults,
//     scale: true,
//     prune: true,
//     toggleClass: 'flip-video',
//     onStart: () => {
//         if (currentFullscreenItem) {
//             currentFullscreenItem.appendChild(gridVideo);
//             currentFullscreenItem = null;
//           }
         
//         else {
//           fullscreenElement?.appendChild(gridVideo);
//           currentFullscreenItem = gridItem;
//         }
//     },
//     onComplete: () => {}


//     //   .then(() => {

//     //   })


    
// });
// function getBoundingRect(itemRect: DOMRect, clickedRect: DOMRect) {
//     const fullscreenVideo = fullscreenElement?.querySelector('.fullscreen--scale');
//     // Select the element with the given class name
//     const element = fullscreenVideo?.querySelector(`.${'.fullscreenVideo'}`);
    
//     // Check if the element exists
//     if (element) {
//       // Get the bounding rectangle of the element
//       return element.getBoundingClientRect();
//     } else {
//       // Return null if the element does not exist
//       return null;
//     }
//   }
  





// Function to move other items based on their position relative to the clicked item
// const moveOtherItems = (gridItem: Element, gridVideo: Element) => {
    

  
//     // For the remaining stuff
//     const otherGridItems = gridItems.filter(item => item !== gridItem);
//     // gridItems.reduce
//     const state = Flip.getState(otherGridItems);
//     // const clickedRect = gridItem.getBoundingClientRect();
//     // const clickedRect = gridItems.find(item => item.classList.contains('fullscreen--scale'))?.getBoundingClientRect();
   
//     otherGridItems.forEach(item => {
//         Flip.from(state, {
//             ...animationDefaults,
//        scale: true,

//           isVisible: false,
      
//             prune: true,
//             stagger: {
//               each: 0.1,
//               from: 'start'
//             }
//           });


    //   const itemRect = item.getBoundingClientRect();
     
    //   if (itemRect.bottom < itemRect.top) {}

          // Function to determine the position class based on the item and clicked item positions
// const determinePositionClass = () => {
//     //   const itemRect = gridItems.find(item => item.classList.contains('fullscreen--scale'))?.getBoundingClientRect();
//     //   const clickedRectFind = gridItems.find(item => item.classList.contains('fullscreen--scale'))?.getBoundingClientRect();
//     //     const clickedRect = clickedRectFind.position;
//     const clickedRect = gridItem.getBoundingClientRect();

//         // const clickedRect = gridItem.getBoundingClientRect();
//       if (itemRect.bottom < clickedRect.top) {
//         return POSITION_CLASSES.NORTH;
//       } else if (itemRect.top > clickedRect.bottom) {
//         return POSITION_CLASSES.SOUTH;
//       } else if (itemRect.right < clickedRect.left) {
//         return POSITION_CLASSES.WEST;
//       } else if (itemRect.left > clickedRect.right) {
//         return POSITION_CLASSES.EAST;
//       }
//       return '';
//     //   console.log(itemRect, clickedRect);
//     };
//     const classname = determinePositionClass();
//     if (classname) {
//       item.classList.toggle(classname, !isFullscreen);
//       item.classList.toggle('greyed-out', !isFullscreen);
//       // item.classList.toggle('filler-space'  , !isFullscreen  );
//       // item.classList.toggle('video-figure', !isFullscreen);

//     }
//     });
  
//     Flip.from(state, {
//       ...animationDefaults,
//     //   scale: 0.5,
//     isVisible: false,

//       prune: true,
//       stagger: {
//         each: 0.1,
//         from: 'start'
//       }


//     });
//   };


// // Click event handler for the grid
// const toggleVideo = (e: Event) => {
//     const gridVideo = e.currentTarget as HTMLElement;
//     const index = parseInt(gridVideo.dataset.index || '0', 10);
//     const gridItem = gridItems[index];
//     const flipState = Flip.getState(gridVideo, {  });
//     console.log("flipState", flipState);
//     // if (!gridItem) {
//     //     console.error('Grid item not found');
//     //     return;
//     // }
// //     for (let i = 0;) {
// //     flipVideo(gridItem, gridVideo);
// //  moveOtherItems(gridItem, gridVideo);
// //     }
// //  const boundingRect = clickedRect ? getBoundingRect(new DOMRect, clickedRect) : null;

      
// //  if (boundingRect) {
// //    console.log('Bounding Rectangle:', boundingRect);
// //  } else {
// //    console.log('Element not found');
// //  }

//   };
  
//   // Function to initialize event listeners for grid
//   const initEvents = () => {
//    document.addEventListener('click', toggleVideo);
//     // gridVideo.forEach((videoElement) => {
//     //     (videoElement as HTMLElement).addEventListener('click', toggleVideo);
//     // //   if (gridItems[index]) {
//     // //     (videoElement as HTMLElement).dataset.index = index.toString(); // Cast to HTMLElement
//     // //     (videoElement as HTMLElement).addEventListener('click', toggleVideo);
//     // //   } else {
//     // //     console.error('Index out of bounds:', index);
//     // //   }
//     // });
//   };
// //   const initEvents = () => {
// //     gridVideo.forEach((gridVideo, position) => {

// //         let position = Array.from(gridItems).indexOf(gridItems[position]);


// //       // Save the index of the video
// //     //   let gridItemPos = gridItems[position].dataset.index.position.toString();
// //     //  gridVideo.dataset.index = position.toString();
      
// //       // Add click event listener to the video
// //       gridVideo.addEventListener('click', toggleVideo);
// //     // document.addEventListener('click', (e: Event) => {
// //     //     if (isFullscreen && e.target !== fullscreenElement && !fullscreenElement?.contains(e.target as Node)) {
// //     //       const fullscreenVideo = fullscreenElement?.querySelector('.video--item');
// //     //       if (fullscreenVideo && currentFullscreenItem) {
// //     //         flipVideo(currentFullscreenItem, fullscreenVideo);
// //     //         moveOtherItems(currentFullscreenItem, fullscreenVideo);
// //     //       }
// //     //     }
 
      
// //     });
// //   };


// document.addEventListener('DOMContentLoaded', initEvents);


// preload but. not workee yet
// preloadImages('.video--item').then(() => {
//   // Remove the loading class from the body
//   document.body.classList.remove('loading');
//   // Initialize event listeners
//   initEvents();
// });


// function sortVideoGrid {
//         // these are chained functions to illustrate map / toString / split / push but wrote selectors below. 
//          // const videoFigures = Array.from(gridContainer.querySelectorAll('.video--figure')).map(figure => figure.querySelector('video'));
//         // const videos = Array.from(gridContainer?.children || []).push(gridContainer) .toString().split(',');

//         let videoFigure = document.querySelector('.video--figure') as HTMLElement; // as singular element
//         let videoFigures = document.querySelectorAll('.video--figure') as any; // as array



//        let currentBoundRect =  videoFigure.getBoundingClientRect();
//         // let currentRect = videoFigure.getClientRects(); //sometimmes this can compute better. 
//         const fillers = videoFigure.hasAttribute("filler-space");


//         // filter out the filler classes
//        const filterVideos = videoFigures.filter(fillers).toArray(); // put this in its own array
//        filterVideos.forEach(videoFigure => {})
//             //assign a class or sort these diff from your regular function
// }


// document.addEventListener('DOMContentLoaded', () => {
//     const gridContainer = document.querySelector('.video--placement--grid') as HTMLElement;
//     const videoItems = Array.from(gridContainer.querySelectorAll('.video--item'));
//     const videoFigures = Array.from(gridContainer.querySelectorAll('.video--figure')).map(figure => figure.querySelector('video'));

//     const videos = Array.from(gridContainer?.children || []).push(gridContainer) .toString().split(',');



//     const totalCells = 20; // Total number of cells in the grid (5 columns * 4 rows)
//     const minWidth = 100; // Minimum width in pixels
//     const maxWidth = 300; // Maximum width in pixels

//     function isCellOccupied(startRow: number, startColumn: number, endRow: any, endColumn: any) {
//         return videoFigures.some(video => {

//             // videoStartRow = parseInt(videoItems.style.gridRowStart, 10) - 1;

//             const videoStartRow = parseInt(video!.style.gridRowStart, 10) - 1;
//             const videoStartColumn = parseInt(video!.style.gridColumnStart, 10) - 1;
//             const videoEndRow = parseInt(video!.style.gridRowEnd, 10) - 1;
//             const videoEndColumn = parseInt(video!.style.gridColumnEnd, 10) - 1;
//             return startRow >= videoStartRow && startRow <= videoEndRow &&
//                    startColumn >= videoStartColumn && startColumn <= videoEndColumn;
//         });
//     }

//     videoItems.forEach(video => {
//         let startRow, startColumn, endRow, endColumn;
//         //untested methods that you might use
        



//         // do {
           
//         // } while (isCellOccupied(startRow, startColumn, endRow, endColumn));

//         // Generate random start and end positions within the grid
//         startRow = Math.floor(Math.random() * numOfRows); // Random starting row
//         startColumn = Math.floor(Math.random() * numOfColumns); // Random starting column
//         endRow = startRow + Math.floor(Math.random() * numOfRows); // Random ending row
//         endColumn = startColumn + Math.floor(Math.random() * numOfColumns); // Random ending column

//         // Ensure the video fits within the grid bounds
//         if (endRow >= numOfRows || endColumn >= numOfColumns) {
//             endRow = Math.min(endRow, numOfRows - 1);
//             endColumn = Math.min(endColumn, numOfColumns - 1);
//         }

//         // Generate a random size between minWidth and maxWidth
//         let randomSize = Math.floor(minWidth + Math.random() * (maxWidth - minWidth));

//         // Apply grid placement and random size
//         video.style.gridColumnStart = startColumn + 1;
//         video.style.gridRowStart = startRow + 1;
//         video.style.gridColumnEnd = endColumn + 1;
//         video.style.gridRowEnd = endRow + 1;
//         video.style.width = `${randomSize} + px`; // Set the width of the video
//         // Optionally, set the height based on aspect ratio or other criteria
//     });
// });


// window.addEventListener("load", () => {
//     // track the mouse positions to send it to the shaders
//     const mousePosition = new Vec2();
//     // we will keep track of the last position in order to calculate the movement strength/delta
//     const mouseLastPosition = new Vec2();

//     const deltas = {
//         max: 0,
//         applied: 0,
//     };

//     // set up our WebGL context and append the canvas to our wrapper
//     const curtains = new Curtains({
//         container: "canvas",
//         watchScroll: false, // no need to listen for the scroll in this example
//         pixelRatio: Math.min(1.5, window.devicePixelRatio) // limit pixel ratio for performance
//     });

//     // handling errors
//     curtains.onError(() => {
//         // we will add a class to the document body to display original video
//         document.body.classList.add("no-curtains", "curtains-ready");

//         // handle video
//         document.getElementById("enter-site").addEventListener("click", () => {
//             // display canvas and hide the button
//             document.body.classList.add("video-started");

//             planeElements[0].getElementsByTagName("video")[0].play();
//         }, false);
//     }).onContextLost(() => {
//         // on context lost, try to restore the context
//         curtains.restoreContext();
//     });

//     // get our plane element
//     const planeElements = document.getElementsByClassName("curtain");


//     const vs = `
//         precision mediump float;

//         // default mandatory variables
//         attribute vec3 aVertexPosition;
//         attribute vec2 aTextureCoord;

//         uniform mat4 uMVMatrix;
//         uniform mat4 uPMatrix;
        
//         // our texture matrix uniform
//         uniform mat4 simplePlaneVideoTextureMatrix;

//         // custom variables
//         varying vec3 vVertexPosition;
//         varying vec2 vTextureCoord;

//         uniform float uTime;
//         uniform vec2 uResolution;
//         uniform vec2 uMousePosition;
//         uniform float uMouseMoveStrength;


//         void main() {

//             vec3 vertexPosition = aVertexPosition;

//             // get the distance between our vertex and the mouse position
//             float distanceFromMouse = distance(uMousePosition, vec2(vertexPosition.x, vertexPosition.y));

//             // calculate our wave effect
//             float waveSinusoid = cos(5.0 * (distanceFromMouse - (uTime / 75.0)));

//             // attenuate the effect based on mouse distance
//             float distanceStrength = (0.4 / (distanceFromMouse + 0.4));

//             // calculate our distortion effect
//             float distortionEffect = distanceStrength * waveSinusoid * uMouseMoveStrength;

//             // apply it to our vertex position
//             vertexPosition.z +=  distortionEffect / 30.0;
//             vertexPosition.x +=  (distortionEffect / 30.0 * (uResolution.x / uResolution.y) * (uMousePosition.x - vertexPosition.x));
//             vertexPosition.y +=  distortionEffect / 30.0 * (uMousePosition.y - vertexPosition.y);

//             gl_Position = uPMatrix * uMVMatrix * vec4(vertexPosition, 1.0);

//             // varyings
//             vTextureCoord = (simplePlaneVideoTextureMatrix * vec4(aTextureCoord, 0.0, 1.0)).xy;
//             vVertexPosition = vertexPosition;
//         }
//     `;

//     const fs = `
//         precision mediump float;

//         varying vec3 vVertexPosition;
//         varying vec2 vTextureCoord;

//         uniform sampler2D simplePlaneVideoTexture;

//         void main() {
//             // apply our texture
//             vec4 finalColor = texture2D(simplePlaneVideoTexture, vTextureCoord);

//             // fake shadows based on vertex position along Z axis
//             finalColor.rgb -= clamp(-vVertexPosition.z, 0.0, 1.0);
//             // fake lights based on vertex position along Z axis
//             finalColor.rgb += clamp(vVertexPosition.z, 0.0, 1.0);

//             // handling premultiplied alpha (useful if we were using a png with transparency)
//             finalColor = vec4(finalColor.rgb * finalColor.a, finalColor.a);

//             gl_FragColor = finalColor;
//         }
//     `;

//     // some basic parameters
//     const params = {
//         vertexShader: vs,
//         fragmentShader: fs,
//         widthSegments: 20,
//         heightSegments: 20,
//         uniforms: {
//             resolution: { // resolution of our plane
//                 name: "uResolution",
//                 type: "2f", // notice this is an length 2 array of floats
//                 value: [planeElements[0].clientWidth, planeElements[0].clientHeight],
//             },
//             time: { // time uniform that will be updated at each draw call
//                 name: "uTime",
//                 type: "1f",
//                 value: 0,
//             },
//             mousePosition: { // our mouse position
//                 name: "uMousePosition",
//                 type: "2f", // again an array of floats
//                 value: mousePosition,
//             },
//             mouseMoveStrength: { // the mouse move strength
//                 name: "uMouseMoveStrength",
//                 type: "1f",
//                 value: 0,
//             }
//         },
//     };

//     // create our plane
//     const simplePlane = new Plane(curtains, planeElements[0], params);

//     simplePlane.onReady(() => {
//         // display the button
//         document.body.classList.add("curtains-ready");

//         // set a fov of 35 to reduce perspective (we could have used the fov init parameter)
//         simplePlane.setPerspective(35);

//         // now that our plane is ready we can listen to mouse move event
//         const wrapper = document.getElementById("page-wrap");

//         wrapper.addEventListener("mousemove", (e) => {
//             handleMovement(e, simplePlane);
//         });

//         wrapper.addEventListener("touchmove", (e) => {
//             handleMovement(e, simplePlane);
//         }, {
//             passive: true
//         });

//         // click to play the videos
//         document.getElementById("enter-site").addEventListener("click", () => {
//             // display canvas and hide the button
//             document.body.classList.add("video-started");

//             // apply a little effect once everything is ready
//             deltas.max = 2;

//             simplePlane.playVideos();
//         }, false);


//     }).onRender(() => {
//         // increment our time uniform
//         simplePlane.uniforms.time.value++;

//         // decrease both deltas by damping : if the user doesn't move the mouse, effect will fade away
//         deltas.applied += (deltas.max - deltas.applied) * 0.02;
//         deltas.max += (0 - deltas.max) * 0.01;

//         // send the new mouse move strength value
//         simplePlane.uniforms.mouseMoveStrength.value = deltas.applied;

//     }).onAfterResize(() => {
//         const planeBoundingRect = simplePlane.getBoundingRect();
//         simplePlane.uniforms.resolution.value = [planeBoundingRect.width, planeBoundingRect.height];
//     }).onError(() => {
//         // we will add a class to the document body to display original video
//         document.body.classList.add("no-curtains", "curtains-ready");

//         // handle video
//         document.getElementById("enter-site").addEventListener("click", () => {
//             // display canvas and hide the button
//             document.body.classList.add("video-started");

//             planeElements[0].getElementsByTagName("video")[0].play();
//         }, false);
//     });

//     // handle the mouse move event
//     function handleMovement(e, plane) {
//         // update mouse last pos
//         mouseLastPosition.copy(mousePosition);

//         const mouse = new Vec2();

//         // touch event
//         if(e.targetTouches) {
//             mouse.set(e.targetTouches[0].clientX, e.targetTouches[0].clientY);
//         }
//         // mouse event
//         else {
//             mouse.set(e.clientX, e.clientY);
//         }

//         // lerp the mouse position a bit to smoothen the overall effect
//         mousePosition.set(
//             curtains.lerp(mousePosition.x, mouse.x, 0.3),
//             curtains.lerp(mousePosition.y, mouse.y, 0.3)
//         );

//         // convert our mouse/touch position to coordinates relative to the vertices of the plane and update our uniform
//         plane.uniforms.mousePosition.value = plane.mouseToPlaneCoords(mousePosition);

//         // calculate the mouse move strength
//         if(mouseLastPosition.x && mouseLastPosition.y) {
//             let delta = Math.sqrt(Math.pow(mousePosition.x - mouseLastPosition.x, 2) + Math.pow(mousePosition.y - mouseLastPosition.y, 2)) / 30;
//             delta = Math.min(4, delta);
//             // update max delta only if it increased
//             if(delta >= deltas.max) {
//                 deltas.max = delta;
//             }
//         }
//     }
// });




    // Initialize the scroll functionality
   //  document.addEventListener('DOMContentLoaded', () => {
   //    Scroll.init();
   //  });
    

//     //initialize defaults
//     public static init() {
//       ScrollTrigger.normalizeScroll(true); // enable
//       console.log("scroller loaded");
//       let mm = gsap.matchMedia();
//       Observer.create({
//       type: "wheel,touch,pointer",
//       wheelSpeed: -1,
//       onStop: () => {
//        console.log("stopped");
//        let animating = false;},
//     });
    
//     }
//     public static lenis = new Lenis({
    
//          orientation: 'horizontal',
//          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
//          syncTouch: true,
//          smoothTouch: true,
//          infinite: true,
//          smooth: true,
//          gestureOrientation: ScrollTrigger.isTouch ? 'horizontal' : 'both',
//     })

//    //setup scrollbars 
//    overlayScrollbars () {
//       OverlayScrollbars(document.body, {
//          overflow: { y: 'hidden', x: 'visible-scroll' },
//          scrollbars: { theme: 'os-theme-light', autoHide: 'scroll', clickScroll: true },
//       })
//    }
//    // setup timers
//    setupTimers () {
//       gsap.ticker.add(time => {
// 	   Scroll.lenis.raf(time * 1000)
//    })
//    }

//    raf(time: any) {
//       Scroll.lenis.raf(time);
//       requestAnimationFrame(this.raf);
//     }
// // setup scroll
// static scrollActions() {
//    let sectionDuration = 1;
//    this.lenis.on('scroll', ScrollTrigger.update);
//    gsap.ticker.lagSmoothing(0);
 
//    let contentSections = gsap.utils.toArray('.section');
//    let tl = gsap.timeline({
//      defaults: {duration: sectionDuration, ease: 'Power3.inOut', paused: true, clearProps: "all"}
//    });
 
//    gsap.to(contentSections, {
//      xPercent: -100 * (contentSections.length - 1),
//      ease: "none",
//      scrollTrigger: {
//        trigger: ".homegrid__container",
//        start: "top top",
//        end: () => "+=" + (contentSections.length - 1) * window.innerWidth,
//        pin: true,
//        scrub: 1,
//        snap: 1 / (contentSections.length - 1),
//        horizontal: true,
//      }
//    });
 
//    // Batch animations for .box elements
//    ScrollTrigger.batch(".box", {
//      interval: 3,
//      onEnter: batch => gsap.to(batch, {opacity: 1, x: 0, stagger: {each: 0.15, grid: [8, 12]}}),
//      onLeave: batch => gsap.set(batch, {opacity: 0, x: -100}),
//      onEnterBack: batch => gsap.to(batch, {opacity: 1, x: 0, stagger: 0.15}),
//      onLeaveBack: batch => gsap.set(batch, {opacity: 0, x: 100})
//    });
//  }
 
   //  static scrollActions() {
   //    const sectionDuration = 1;
   //    this.lenis.on('scroll', ScrollTrigger.update);
   //    gsap.ticker.lagSmoothing(0);
  
   //    const contentSections = gsap.utils.toArray('.section');
   //    const tl = gsap.timeline({
   //      defaults: {
   //        duration: sectionDuration,
   //        ease: 'Power3.inOut',
   //        paused: true,
   //        clearProps: "all"
   //      }
   //    });
  
   //    contentSections.forEach((section) => {
   //      ScrollTrigger.batch(".box", {
   //        interval: 0.5, // Increased interval for better performance
   //        onEnter: batch => gsap.to(batch, {opacity: 1, x: 0, stagger: 0.15}),
   //        onLeave: batch => gsap.set(batch, {opacity: 0, x: -100}),
   //        onEnterBack: batch => gsap.to(batch, {opacity: 1, x: 0, stagger: 0.15}),
   //        onLeaveBack: batch => gsap.set(batch, {opacity: 0, x: 100})
   //      });
  
   //      ScrollTrigger.create({
   //        trigger: section,
   //        start: "center center",
   //        end: "bottom center",
   //        onEnter: () => tl.add(this.start), // Use arrow function to bind `this` correctly
   //      });
   //    });
  
   //    tl.add(this.start, 0);
   //  }
  
   //  start() {
   //    const sections = gsap.utils.toArray(".section");
   //    gsap.to(sections, {
   //      xPercent: -100 * (sections.length - 1),
   //      ease: "none",
   //      scrollTrigger: {
   //        trigger: ".homegrid__container",
   //        scrub: 1,
   //        end: () => "+=" + (sections.length - 1) * window.innerWidth,
   //      },
   //    });
   //  }
  
    // ... (other methods)
//   }
//     //scroll actions 
//   static scrollActions () {
//       let sectionDuration = 1;
//       this.lenis.on('scroll', ScrollTrigger.update);
//       gsap.ticker.lagSmoothing(0);
//       // get all your content sections
//       let contentSections = gsap.utils.toArray('.section')
//       let tl = gsap.timeline({  defaults: {duration: sectionDuration, ease: 'Power3.inOut', paused: true , clearProps: "all"}});

         
//             // // onUpdate: scene.render,
//             // onStart: () => {
//             //    console.log("started");
//             //    let animating = true;
             


//             // },

//             // scrollTrigger: {
//             //   trigger: ".section",
//             //   scrub: true,
//             //   start: "top left",
//             //   end: "botto right",
//             //   markers: true,
              

//             // },
//             // defaults: {duration: sectionDuration, ease: 'Power3.inOut'}
//          // });


// // loopy loop
// contentSections.forEach((section) => {
//   let batch = 
//    ScrollTrigger.batch(".box", {
//       interval: 3, // setting an interval for each baatch since there a lot of elements
//       //batchMax: 3,   // maximum batch size (targets)
//       onEnter: batch => gsap.to(batch, {opacity: 1, x: 0, stagger: {each: 0.15, grid: [8, 12]}, }),
//       onLeave: batch => gsap.set(batch, {opacity: 0, x: -100, }),
//       onEnterBack: batch => gsap.to(batch, {opacity: 1, x: 0, stagger: 0.15, }),
//       onLeaveBack: batch => gsap.set(batch, {opacity: 0, x: 100, })
//       // you can also define things like start, end, etc.
//     });
//   // make a scrolltrigger for this section
//   ScrollTrigger.create({
//    //   trigger: section,
//    start: "top center",
//    end: "bottom center",
// 	  markers:true,	
//     // pass this section to the function that will animate it. tada!
//     onEnter: batch => tl.add(start),
//    //  onRefresh: batch => tl.add(end),
// });
// })
//       let start = () => {
//          const sections = gsap.utils.toArray(".section");

//          gsap.to(sections, {
//             xPercent: -100 * (sections.length - 1),
//             ease: "none",
//             scrollTrigger: {
//                trigger: ".homegrid__container",
//                scrub: 1,
//                // snap: 1 / (sections.length - 1),
//                end: () => "+=" + (sections.length - 1) * window.innerWidth,
//             },
//          });

// //  let end = () => {
// //    const sections = gsap.utils.toArray(".section");

// //    gsap.from(sections, {
// //       xPercent: -100 * (sections.length - 1),
// //       ease: "none",
// //       scrollTrigger: {
// //          trigger: ".section",
// //          scrub: 1,
// //          // snap: 1 / (sections.length - 1),
// //          end: () => "+=" + (sections.length - 1) * window.innerWidth,
// //       },
// //    });

// //  }

//    // ScrollTrigger.batch(".box", {
//    //  interval: 0.1, // time window (in seconds) for batching to occur. 
//    //    //batchMax: 3,   // maximum batch size (targets)
     

//    //    onEnter: batch => gsap.to(batch, {
//    //       opacity: 1, 
//    //       x: 0, 
//    //       stagger: {
//    //          each: 0.15, 
//    //          grid: [8, 12]}, 
//    //          // clearTargets: true, 
//    //          //  clearProps: "all", 
//    //       }),
//    //    onLeave: batch => gsap.set(batch, {
//    //       opacity: 0, 
//    //       // clearProps: "all", 
//    //       x: -100, 
//    //    }),
//    //    onEnterBack: batch => gsap.to(batch, {
//    //       opacity: 1,
//    //       x: 0, 
//    //        stagger: 0.15, }),
//    //    onLeaveBack: batch => gsap.set(batch, {
//    //       opacity: 0, 
//    //       x: 100, 
//    //    }),
//    //    // onUpdate: batch => gsap.set(batch, {
//    //    //     console.log("is scrolling", batch),

//    //    //    }),

//    //  });
         
//       //    const repeatItems = (parentEl, total = 0) => {
//       //       const items = [...parentEl.children];
//       //       for (let i = 0; i <= total-1; ++i) {
//       //           var cln = items[i].cloneNode(true);
//       //           parentEl.appendChild(cln);
//       //       }
//       //   };
//       //   repeatItems(document.querySelector('.box'), 6);
//       // let sections = gsap.utils.toArray(".box");
//       // sections.forEach((section, i) => {
//       //    tl.from('.box', {
//       //       opacity: 0,
//       //       xPercent: -100 * (sections.length - 1),
//       //       stagger: 0.15,
//       //       duration: 0.5,
//       //    })

//       // })
//    }


//       tl.add(start, 0);


//       // let sections = gsap.utils.toArray(".grid__track");
//       // gsap.to(sections, {
//       // xPercent: -100 * (sections.length - 1),
//       // ease: "none",
//       // scrollTrigger: {
//       // trigger: ".homegrid__container",
//       // markers: true,
//       // // pin: true,
//       // scrub: 1,
//       // snap: 1 / (sections.length - 1),
//       // end: () => "+=" + (sections.length - 1) * window.innerWidth, },
//       // });
//    }
//    public static appendPartialHTML() {
//       // new div element to hold the partial HTML content
//       const slider = document.querySelector(".scroll-section") as HTMLElement;
//       const partialHTML = document.createElement("section");
//       const oldGrid = document.querySelector(".homegrid__container") as HTMLElement;
//       partialHTML.className = "scroll-section"; // same class for styling
  
//       // inject partial
//       partialHTML.innerHTML = `
//       <include src="./appendedgrid.html" class="visible" ></include>
//       `;
//  // //lets remove other grid
//     if (oldGrid) {
//       oldGrid.remove();
//       console.log("Old grid removed");
//   }
//       LoadVideoAssets();
//       // Append the new content grid
//       slider.appendChild(partialHTML);
//       //lets remove other grid
//       if (slider.classList.contains("scroll-section")) {
//          console.log("scroll section injected")
//       }
//       // Recalculate sections if using GSAP animations
//       const sections = gsap.utils.toArray(".scroll-section");
//       gsap.to(sections, {
//           xPercent: -100 * (sections.length - 1),
//           ease: "none",
//           scrollTrigger: {
//               trigger: ".homegrid__container-new",
//               scrub: 1,
//               snap: 1 / (sections.length - 1),
//               end: () => "+=" + (sections.length - 1) * window.innerWidth,
//           },
//       });
//   }
//class end   
// }    
   


// Lenis

// const lenis = new Lenis({
// 	orientation: 'horizontal',
//    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
// 	syncTouch: true,
// 	smoothTouch: true,
//    infinite: true,

//    smooth: true,
// 	gestureOrientation: ScrollTrigger.isTouch ? 'horizontal' : 'vertical',
// })
// function raf(time: any) {
//    lenis.raf(time);
//    requestAnimationFrame(raf);
//  }

// lenis.on('scroll', ScrollTrigger.update)

// gsap.ticker.add(time => {
// 	lenis.raf(time * 1000)
// })

// gsap.ticker.lagSmoothing(0)
// // Overlay Scrollbar
// OverlayScrollbars.plugin(ClickScrollPlugin)




// ScrollTrigger.normalizeScroll(true); // enable



// let scrollInit = () => {
//    // console.log("scrolbar loaded");
//    Observer.create({
//       type: "wheel,touch,pointer",
//       // preventDefault: true,
//       wheelSpeed: -1,
      
//       onStop: () => {
//        console.log("stopped");
//        let animating = false;
//       },
//       });


// let normalizer = ScrollTrigger.normalizeScroll(); // gets the Observer instance that's handling normalization (if enabled, of course)
//       ScrollTrigger.create({
//       trigger: ".outer__wrapper",
//       markers: true,

//       start: "top center",
//       end: "+=500",
//       onUpdate: (self) => console.log("direction:", self.direction),
//     });
//    }
//    console.log("normalize loaded");
//    // const tracks = document.querySelectorAll(".outer__wrapper");
//    if (ScrollTrigger.isTouch) {
//       // any touch-capable device...
//     }
    
//     // or get more specific:
//     if (ScrollTrigger.isTouch === 1) {
//       // touch-only device
//     }
//    // x: () => -trackWrapperWidth() + window.innerWidth, {
//    //    if (ScrollTrigger.isScrolling()) {
//    //       // do something if scrolling
//    //       console.log("scrolling");

//    //     }
//    ScrollTrigger.batch(".box", {
//     interval: 0.1, // time window (in seconds) for batching to occur. 
//       //batchMax: 3,   // maximum batch size (targets)
     

//       onEnter: batch => gsap.to(batch, {
//          opacity: 1, 
//          x: 0, 
//          stagger: {
//             each: 0.15, 
//             grid: [8, 12]}, 
//             // clearTargets: true, 
//             //  clearProps: "all", 
//          }),
//       onLeave: batch => gsap.set(batch, {
//          opacity: 0, 
//          // clearProps: "all", 
//          x: -100, 
//       }),
//       onEnterBack: batch => gsap.to(batch, {
//          opacity: 1,
//          x: 0, 
//           stagger: 0.15, }),
//       onLeaveBack: batch => gsap.set(batch, {
//          opacity: 0, 
//          x: 100, 
//       }),
//       // onUpdate: batch => gsap.set(batch, {
//       //     console.log("is scrolling", batch),

//       //    }),

//     });
//break 
// ScrollTrigger.normalizeScroll(false); // disable
// ScrollTrigger.batch(".box", {
//   //interval: 0.1, // time window (in seconds) for batching to occur. 
//   //batchMax: 3,   // maximum batch size (targets)
//   onEnter: batch => gsap.to(batch, {opacity: 1, x: 0, stagger: {each: 0.15, grid: [8, 12]}, }),
//   onLeave: batch => gsap.set(batch, {opacity: 0, x: -100, }),
//   onEnterBack: batch => gsap.to(batch, {opacity: 1, x: 0, stagger: 0.15, }),
//   onLeaveBack: batch => gsap.set(batch, {opacity: 0, x: 100, })
//   // you can also define things like start, end, etc.
// });
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
