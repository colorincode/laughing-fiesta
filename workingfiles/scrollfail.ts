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
