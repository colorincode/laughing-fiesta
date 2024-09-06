// Import necessary libraries and plugins
import * as jquery from 'jquery';
import gsap from 'gsap';
import { Flip } from 'gsap/Flip';
import Draggable from 'gsap/Draggable';
import ScrollTrigger from 'gsap/ScrollTrigger';
import ScrollToPlugin from 'gsap/ScrollToPlugin';
import Observer from 'gsap/Observer';
// import LocomotiveScroll from 'locomotive-scroll';
 import Lenis from 'lenis';
import { OverlayScrollbars, ClickScrollPlugin } from 'overlayscrollbars';
import { listenForFlip, killFlip } from "./grid";
import { initEvents } from './flipvideos';
// import '../scss/overlayscrollbars.css';
import { EventDispatcher } from "./shared/eventdispatch";

// Register GSAP plugins
gsap.registerPlugin(Flip, Draggable, ScrollTrigger, Observer, ScrollToPlugin);

// Initialize OverlayScrollbars
OverlayScrollbars(document.body, {
  overflow: { y: 'hidden', x: 'scroll' },
  scrollbars: { theme: 'os-theme-light', autoHide: 'scroll', clickScroll: true },
});
OverlayScrollbars.plugin(ClickScrollPlugin);

// Global Variables
const parentWrapper = document.querySelector('.homegrid__container') as HTMLElement;
const gridItems = gsap.utils.toArray('.grid__item') as HTMLElement[];
const gridItemsDuplicated = [...gridItems, ...gridItems]; // Duplicate items for seamless scroll
const boxes = gsap.utils.selector('.homegrid__container')('.box');
const wrap = gsap.utils.wrap(0, gridItems.length);
const lenis = new Lenis({
  orientation: 'horizontal',
  duration: 1.2,
  easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  syncTouch: true,
  smoothTouch: true,
  infinite: true,
  damping: 0.1,
  lerp: 0.1,
  smooth: true,
  gestureOrientation: 'horizontal',
});
// const eventDispatcher = new EventDispatcher();

// Function to initialize smooth scrolling with Lenis
function initLenis() {
  function raf(time: any) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(time => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}
// the magic helper function...
function getScrollPosition(animation, progress) {
  let p = gsap.utils.clamp(0, 1, progress || 0),
      nested = !animation.scrollTrigger,
      st = nested ? animation.parent.scrollTrigger : animation.scrollTrigger,
      containerAnimation = st.vars.containerAnimation,
      range = st.end - st.start,
      position = st.start + range * p;
  if (containerAnimation) {
    st = containerAnimation.scrollTrigger;
    return (st.start + (st.end - st.start) * (position / containerAnimation.duration()));
  } else if (nested) {
    let start = st.start + (animation.startTime() / animation.parent.duration()) * range,
        end = st.start + ((animation.startTime() + animation.duration()) / animation.parent.duration()) * range;
    return start + (end - start) * p;
  }
  return position;
}

//  initialize GSAP
function scrollInit() {
  Observer.create({
    type: 'wheel,touch,pointer',
    preventDefault: true,
    wheelSpeed: -1,
    onChange: function(e) {
      getAvailableGridAreas() 
    },
    onStop: () => {
      console.log('scroll stopped');
      listenForFlip();
    },
  });

  ScrollTrigger.normalizeScroll(true);
  ScrollTrigger.defaults({markers: {startColor: "white", endColor: "white"}});
  // Create horizontal scroll effect
  let sections = gsap.utils.toArray(".homegrid__container");
  // let horizontalScrollLength = sections.length;
  let pinWrapWidth = parentWrapper.offsetWidth;
  let horizontalScrollLength = pinWrapWidth - window.innerWidth;
  gsap.to('.homegrid__container', {
    x: () => -parentWrapper.offsetWidth *10,
    //  x: -horizontalScrollLength,
    // xPercent: -100 * (sections.length - 1),
    ease: 'none',
    scrollTrigger: {
      trigger: parentWrapper,
      // scrub: true,
     markers: {startColor: "blue", endColor : "blue"},
      scrub: 0.15,
      start: 'top top',
      // pin: true,
        //  end: "+=3000",
       end: () => `+=${parentWrapper.scrollWidth}`,
      // end: "+=3000",
      snap: 1 / gridItemsDuplicated.length,
      invalidateOnRefresh: true,
    },
  });

  // Handle batch animations for grid items
  ScrollTrigger.batch('.box', {
    interval: 0.9,
    // pin: true,

    onEnter: batch => gsap.to(batch, {
      // scale: 0.5,
      // x: -horizontalScrollLength,
      // xPercent: gridItemsDuplicated.length - (window.innerWidth / 75),
      ease: "none", // <-- IMPORTANT!
      // scrub: 0.1,
      position: 'relative',

      stagger: { each: 0.15, grid: [8, 12] },
    }),
    onLeave: batch => gsap.set(batch, {
      opacity: 0.5,
      xPercent: gridItemsDuplicated.length - (window.innerWidth / 75),
    }),
    onEnterBack: batch => gsap.to(batch, {
      opacity: 1,
      xPercent: gridItemsDuplicated.length - (window.innerWidth / 75),
    }),
    onLeaveBack: batch => gsap.set(batch, {
      opacity: 0.5,
      xPercent: gridItemsDuplicated.length - (window.innerWidth / 75),
    }),
  });
}
function getAvailableGridAreas() {
  const areas = [];
  for (let row = 1; row <= 12; row++) {
    for (let col = 1; col <= 12; col++) {
      // exclude top-left, top-right, center, and content areas
      if (!((row >= 1 && row <= 4 && col >= 1 && col <= 4) ||
            (row >= 1 && row <= 3 && col >= 9 && col <= 12) ||
            (row >= 4 && row <= 6 && col >= 5 && col <= 8) ||
            (row >= 7 && row <= 12 && col >= 1 && col <= 12))) {
        areas.push(`${row}/${col}`);
      }
    }
  }
  return gsap.utils.shuffle(areas);
}
//   ScrollTrigger.addEventListener("refresh", () => scroller.update());

//   ScrollTrigger.refresh();
// // });

const eventDispatcher = new EventDispatcher();
// Event Handlers
function onDOMContentLoaded() {
  // Initialize scroll functionality on DOMContentLoaded
  initLenis();
  scrollInit();
}

function onClick() {
  listenForFlip();
  initEvents();
}

function scrollMe() {
  killFlip();
  listenForFlip();
}

function onRefresh() {
  // ScrollTrigger.refresh();
  // gsap.set(boxes, { y: 100, x: 0 });
  ScrollTrigger.addEventListener("refresh", () => scroller.update());
}

eventDispatcher.addEventListener('refresh', onRefresh);
eventDispatcher.addEventListener('DOMContentLoaded', onDOMContentLoaded);
eventDispatcher.addEventListener('scroll', scrollMe);

// Initialize on page load
onDOMContentLoaded();
// // Function to initialize smooth scrolling with Lenis
// const lenis = new Lenis({
//   orientation: 'horizontal',
//   duration: 1.2,
//   easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
//   syncTouch: true,
//   smoothTouch: true,
//   infinite: true,
//   damping: 0.1,
//   lerp: 0.1,
//   smooth: true,
//   gestureOrientation: 'horizontal',
// });
// function initLenis() {
//   function raf(time: any) {
//     lenis.raf(time);
//     requestAnimationFrame(raf);
//   }
//   requestAnimationFrame(raf);
//   lenis.on('scroll', ScrollTrigger.update);
//   gsap.ticker.add(time => lenis.raf(time * 1000));
//   gsap.ticker.lagSmoothing(0);
// }

// // Initialize GSAP
// function scrollInit() {
//   Observer.create({
//     type: 'wheel,touch,pointer',
//     preventDefault: true,
//     wheelSpeed: -1,
//     onChange: function(e) {
//       // getAvailableGridAreas();
//     },
//     onStop: () => {
//       console.log('scroll stopped');
//       listenForFlip();
//     },
//   });

//   ScrollTrigger.normalizeScroll(true);
//   ScrollTrigger.defaults({markers: {startColor: "white", endColor: "white"}});
// }
// // Initialize OverlayScrollbars
// OverlayScrollbars(document.body, {
//   overflow: { y: 'hidden', x: 'scroll' },
//   scrollbars: { theme: 'os-theme-light', autoHide: 'scroll', clickScroll: true },
// });
// OverlayScrollbars.plugin(ClickScrollPlugin);

// // Global Variables
// const parentWrapper = document.querySelector('.homegrid__container') as HTMLElement;
// const gridItems = gsap.utils.toArray('.grid__item') as HTMLElement[];
// const gridItemsDuplicated = [...gridItems, ...gridItems]; // Duplicate items for seamless scroll


// function setupInfiniteScroll() {
//   const totalWidth = parentWrapper.scrollWidth;
//   const viewportWidth = window.innerWidth;
  
//   // Create the horizontal scroll effect
//   gsap.to(parentWrapper, {
//     x: () => -(totalWidth - viewportWidth),
//     ease: "none",
//     scrollTrigger: {
//       trigger: parentWrapper,
//       // pin: true,
//       scrub: 1,
//       end: () => `+=${totalWidth}`,
//       invalidateOnRefresh: true
//     }
//   });

//   // Set up IntersectionObserver
//   const observer = new IntersectionObserver((entries) => {
//     entries.forEach(entry => {
//       if (!entry.isIntersecting) {
//         repositionElement(entry.target as HTMLElement);
//       }
//     });
//   }, { root: null, rootMargin: "0px", threshold: 0 });

//   // Observe all grid items
//   gridItems.forEach(item => observer.observe(item));
// }

// function repositionElement(element: HTMLElement) {
//   const state = Flip.getState(element);
  
//   if (element.getBoundingClientRect().right < 0) {
//     // Move to the right end
//     parentWrapper.appendChild(element);
//   } else if (element.getBoundingClientRect().left > window.innerWidth) {
//     // Move to the left end
//     parentWrapper.prepend(element);
//   }

//   Flip.from(state, {
//     duration: 0,
//     absolute: true,
//     onComplete: () => ScrollTrigger.refresh()
//   });
// }

// function setupGrid() {
//     // Set basic grid properties
//     parentWrapper.style.display = 'grid';
//     parentWrapper.style.height = '100vh';
//     parentWrapper.style.overflowX = 'scroll';
//     parentWrapper.style.overflowY = 'hidden';
//     parentWrapper.style.whiteSpace = 'nowrap';
  
//     // Function to apply grid template based on screen width
//     function applyGridTemplate() {
//       const width = window.innerWidth;
  
//       if (width > 1024) {
//         parentWrapper.style.width = '100%';
//         parentWrapper.style.gridTemplate = `
//           "     .      .      .      .      . video1 video1 video1     . video3 video3      ." 12.5%
//           "     . video2 video2 video2      .      .     .      .      . video3 video3      ." 12.5%
//           "     . video2 video2 video2      .      .     . video5 video5 video5      .      ." 12.5%
//           "     .      .      . video9 video9 video9     . video5 video5 video5 video8 video8" 12.5%
//           "video6 video6      . video9 video9 video9     . video5 video5 video5 video8 video8" 12.5%
//           "video6 video6      . video9 video9 video9     . video7 video7 video7      .      ." 12.5%
//           "     .      . video4 video4 video4 video4     . video7 video7 video7      .      ." 12.5%
//           "     .      . video4 video4 video4 video4     . video7 video7 video7      .      ." 12.5% / 8.33% 8.33% 8.33% 8.33% 8.33% 8.33% 8.33% 8.33% 8.33% 8.33% 8.33% 8.33%
//         `;
//       } else if (width <= 1024 && width > 768) {
//         parentWrapper.style.width = '150vw';
//         parentWrapper.style.gridTemplate = `
//           "     .      .      .      .      . video5 video5 video5      .      .      .      ." 8.33%
//           "     . video1 video1 video1      .      .      .      .      . video3 video3 video3" 8.33%
//           "     . video1 video1 video1      .      .      .      .      . video3 video3 video3" 8.33%
//           "     .      .      .      .      . video2 video2 video2      . video3 video3 video3" 8.33%
//           "video6 video6 video6 video6      . video2 video2 video2      .      .      .      ." 8.33%
//           "video6 video6 video6 video6      . video2 video2 video2      .      .      .      ." 8.33%
//           "video6 video6 video6 video6      . video2 video2 video2 video8 video8 video8 video8" 8.33%
//           "     .      . video9 video9 video9 video9      .      . video8 video8 video8 video8" 8.33%
//           "     .      . video9 video9 video9 video9      .      . video8 video8 video8 video8" 8.33%
//           "     .      . video9 video9 video9 video9      . video7 video7 video7 video7      ." 8.33%
//           "     . video4 video4 video4 video4 video4      . video7 video7 video7 video7      ." 8.33%
//           "     . video4 video4 video4 video4 video4      . video7 video7 video7 video7      ." 8.33% / 8.33% 8.33% 8.33% 8.33% 8.33% 8.33% 8.33% 8.33% 8.33% 8.33% 8.33% 8.33%
//         `;
//       } else {
//         // Mobile layout (width <= 768px)
//         parentWrapper.style.gridTemplate = `
//           "     .      .      .      .      . video1 video1 video1     . video3 video3      ." 12.5%
//           "     . video2 video2 video2      .      .     .      .      . video3 video3      ." 12.5%
//           "     . video2 video2 video2      .      .     . video5 video5 video5      .      ." 12.5%
//           "     .      .      . video9 video9 video9     . video5 video5 video5 video8 video8" 12.5%
//           "video6 video6      . video9 video9 video9     . video5 video5 video5 video8 video8" 12.5%
//           "video6 video6      . video9 video9 video9     . video7 video7 video7      .      ." 12.5%
//           "     .      . video4 video4 video4 video4     . video7 video7 video7      .      ." 12.5%
//           "     .      . video4 video4 video4 video4     . video7 video7 video7      .      ." 12.5% / 8.33% 8.33% 8.33% 8.33% 8.33% 8.33% 8.33% 8.33% 8.33% 8.33% 8.33% 8.33%
//         `;
//       }
//     }
  
//     // Apply initial grid template
//     applyGridTemplate();
  
//     // Update grid on window resize
//     window.addEventListener('resize', applyGridTemplate);
//   // parentWrapper.style.display = 'grid';
//   // parentWrapper.style.gridTemplateColumns = 'repeat(12, 1fr)';
//   // parentWrapper.style.gridTemplateRows = 'repeat(8, 1fr)';
//   // parentWrapper.style.gap = '10px';

//   // gridItems.forEach((item, index) => {
//   //   const row = Math.floor(index / 12) + 1;
//   //   const col = (index % 12) + 1;
//   //   item.style.gridArea = `${row} / ${col} / span 1 / span 1`;
//   // });
//  // Set grid area for each item
//  gridItems.forEach((item) => {
//   const videoNumber = item.getAttribute('data-video-number');
//   if (videoNumber) {
//     item.style.gridArea = `video${videoNumber}`;
//   }
// });

// // Set gap
// parentWrapper.style.gap = '5%';


// }
// // const boxes = gsap.utils.selector('.homegrid__container')('.box');
// // const wrap = gsap.utils.wrap(0, gridItems.length);

// function init() {
//   setupGrid();
//   setupInfiniteScroll();
// }
// const eventDispatcher = new EventDispatcher();
// // Event Handlers
// function onDOMContentLoaded() {
//   // Initialize scroll functionality on DOMContentLoaded
//   init()
//   // initLenis();
//   // scrollInit();
// }

// function onClick() {
//   listenForFlip();
//   initEvents();
// }

// function scrollMe() {
//   killFlip();
//   listenForFlip();
// }

// function onRefresh() {
//   ScrollTrigger.refresh();
// }

// eventDispatcher.addEventListener('refresh', onRefresh);
// eventDispatcher.addEventListener('DOMContentLoaded', onDOMContentLoaded);
// eventDispatcher.addEventListener('scroll', scrollMe);

// // Initialize on page load
// onDOMContentLoaded();

// // Create horizontal scroll effect
// gsap.to(parentWrapper, {
//   x: () => -parentWrapper.scrollWidth + window.innerWidth,
//   ease: 'none',
//   scrollTrigger: {
//     trigger: parentWrapper,
//     pin: true,
//     scrub: true,
//     end: () => `+=${parentWrapper.scrollWidth}`,
//     invalidateOnRefresh: true,
//     // Add markers for debugging
//     markers: {
//       startColor: 'green',
//       endColor: 'red',
//       fontSize: '12px',
//       indent: 20,
//     },
//   },
// });
//   gsap.set(gridItems, {
//     width: () => gridItems[0].offsetWidth,
//     height: '100%',
//     display: 'inline-flex',
//   });

//   const scrollTween = gsap.to(parentWrapper, {
//     x: () => -(parentWrapper.scrollWidth - window.innerWidth),
//     ease: 'none',
//     scrollTrigger: {
//       trigger: parentWrapper,
//       pin: true,
//       scrub: true,
//       end: () => `+=${parentWrapper.scrollWidth}`,
//       invalidateOnRefresh: true,
//     },
//   });

//   // Handle batch animations for grid items
//   ScrollTrigger.batch(boxes, {
//     interval: 0.1,
//     onEnter: batch => gsap.to(batch, {
//       opacity: 1,
//       y: 0,
//       stagger: 0.15,
//       overwrite: true,
//     }),
//     onLeave: batch => gsap.set(batch, {
//       opacity: 0,
//       y: -100,
//       overwrite: true,
//     }),
//     onEnterBack: batch => gsap.to(batch, {
//       opacity: 1,
//       y: 0,
//       stagger: 0.15,
//       overwrite: true,
//     }),
//     onLeaveBack: batch => gsap.set(batch, {
//       opacity: 0,
//       y: 100,
//       overwrite: true,
//     }),
//     start: 0,
//     end: () => `+=${parentWrapper.scrollWidth}`,
//   });
// }

// function getAvailableGridAreas() {
//   const areas = [];
//   for (let row = 1; row <= 12; row++) {
//     for (let col = 1; col <= 12; col++) {
//       // exclude top-left, top-right, center, and content areas
//       if (!((row >= 1 && row <= 4 && col >= 1 && col <= 4) ||
//             (row >= 1 && row <= 3 && col >= 9 && col <= 12) ||
//             (row >= 4 && row <= 6 && col >= 5 && col <= 8) ||
//             (row >= 7 && row <= 12 && col >= 1 && col <= 12))) {
//         areas.push(`${row}/${col}`);
//       }
//     }
//   }
//   return gsap.utils.shuffle(areas);
// }
// window.addEventListener("load", function () {
  // gsap.registerPlugin(ScrollTrigger);

//   const pageContainer = document.querySelector(".container");
//   pageContainer.setAttribute("data-scroll-container", "");

//   const scroller = new LocomotiveScroll({
//     el: pageContainer,
//     inertia: 0.8,
//     smooth: true,
//     getDirection: true
//   });

//   scroller.on("scroll", function (t) {
//     document.documentElement.setAttribute("data-direction", t.direction);
//   });

//   scroller.on("scroll", ScrollTrigger.update);

//   ScrollTrigger.scrollerProxy(pageContainer, {
//     scrollTop(value) {
//       return arguments.length
//         ? scroller.scrollTo(value, 0, 0)
//         : scroller.scroll.instance.scroll.y;
//     },
//     getBoundingClientRect() {
//       return {
//         left: 0,
//         top: 0,
//         width: window.innerWidth,
//         height: window.innerHeight
//       };
//     },
//     pinType: pageContainer.style.transform ? "transform" : "fixed"
//   });

//   // Pinning and horizontal scrolling

//   let horizontalSections = document.querySelectorAll(".horizontal-scroll");

//   horizontalSections.forEach((horizontalSection) => {
//     let pinWrap = horizontalSection.querySelector(".pin-wrap");
//     let pinWrapWidth = pinWrap.offsetWidth;
//     let horizontalScrollLength = pinWrapWidth - window.innerWidth;
//     gsap.to(pinWrap, {
//       scrollTrigger: {
//         scroller: "[data-scroll-container]",
//         scrub: true,
//         trigger: horizontalSection,
//         pin: true,
//         start: "top top",
//         end: () => `+=${pinWrapWidth}`,
//         invalidateOnRefresh: true
//       },
//       x: -horizontalScrollLength,
//       ease: "none"
//     });
//   });

//   /* COLOR CHANGER */

//   const scrollColorElems = document.querySelectorAll("[data-bgcolor]");
//   scrollColorElems.forEach((colorSection, i) => {
//     // const prevBg = i === 0 ? "" : scrollColorElems[i - 1].dataset.bgcolor;
//     // const prevText = i === 0 ? "" : scrollColorElems[i - 1].dataset.textcolor;

//     ScrollTrigger.create({
//       trigger: colorSection,
//       scroller: "[data-scroll-container]",
//       start: "top 50%",
//       onEnter: () =>
//         gsap.to("body", {
//           // backgroundColor: colorSection.dataset.bgcolor,
//           // color: colorSection.dataset.textcolor,
//           overwrite: "auto"
//         }),
//       onLeaveBack: () =>
//         gsap.to("body", {
//           // backgroundColor: prevBg,
//           // color: prevText,
//           overwrite: "auto"
//         })
//     });
//   });


// // Import necessary libraries and plugins
// import * as jquery from 'jquery';
// import gsap from 'gsap';
// import { Flip } from 'gsap/Flip';
// import Draggable from 'gsap/Draggable';
// import ScrollTrigger from 'gsap/ScrollTrigger';
// import ScrollToPlugin from 'gsap/ScrollToPlugin';
// import Observer from 'gsap/Observer';
// import Lenis from 'lenis';
// import { OverlayScrollbars, ClickScrollPlugin } from 'overlayscrollbars';
// import { listenForFlip, killFlip } from "./grid";
// import { initEvents } from './flipvideos';
// import '../scss/overlayscrollbars.css';
// import { EventDispatcher } from "./shared/eventdispatch";

// // Register GSAP plugins
// gsap.registerPlugin(Flip, Draggable, ScrollTrigger, Observer, ScrollToPlugin);

// // Initialize OverlayScrollbars
// OverlayScrollbars(document.body, {
//   overflow: { y: 'hidden', x: 'scroll' },
//   scrollbars: { theme: 'os-theme-light', autoHide: 'scroll', clickScroll: true },
// });
// OverlayScrollbars.plugin(ClickScrollPlugin);

// // Global Variables
// const parentWrapper = document.querySelector('.homegrid__container') as HTMLElement;
// const gridItems = gsap.utils.toArray('.grid__item') as HTMLElement[];
// const gridItemsDuplicated = [...gridItems, ...gridItems]; // Duplicate items for seamless scroll
// const boxes = gsap.utils.selector('.homegrid__container')('.box');
// const wrap = gsap.utils.wrap(0, gridItems.length);
// const lenis = new Lenis({
//   orientation: 'horizontal',
//   duration: 1.2,
//   easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
//   syncTouch: true,
//   smoothTouch: true,
//   infinite: true,
//   damping: 0.1,
//   lerp: 0.1,
//   smooth: true,
//   gestureOrientation: 'horizontal',
// });
// const eventDispatcher = new EventDispatcher();

// // Function to initialize smooth scrolling with Lenis
// function initLenis() {
//   function raf(time: any) {
//     lenis.raf(time);
//     requestAnimationFrame(raf);
//   }
//   requestAnimationFrame(raf);
//   lenis.on('scroll', ScrollTrigger.update);
//   gsap.ticker.add(time => lenis.raf(time * 1000));
//   gsap.ticker.lagSmoothing(0);
// }
// // the magic helper function...
// function getScrollPosition(animation, progress) {
//   let p = gsap.utils.clamp(0, 1, progress || 0),
//       nested = !animation.scrollTrigger,
//       st = nested ? animation.parent.scrollTrigger : animation.scrollTrigger,
//       containerAnimation = st.vars.containerAnimation,
//       range = st.end - st.start,
//       position = st.start + range * p;
//   if (containerAnimation) {
//     st = containerAnimation.scrollTrigger;
//     return (st.start + (st.end - st.start) * (position / containerAnimation.duration()));
//   } else if (nested) {
//     let start = st.start + (animation.startTime() / animation.parent.duration()) * range,
//         end = st.start + ((animation.startTime() + animation.duration()) / animation.parent.duration()) * range;
//     return start + (end - start) * p;
//   }
//   return position;
// }

// //  initialize GSAP
// function scrollInit() {
//   Observer.create({
//     type: 'wheel,touch,pointer',
//     preventDefault: true,
//     wheelSpeed: -1,
//     onChange: function(e) {
//       getAvailableGridAreas() 
//     },
//     onStop: () => {
//       console.log('scroll stopped');
//       listenForFlip();
//     },
//   });

//   ScrollTrigger.normalizeScroll(true);
//   ScrollTrigger.defaults({markers: {startColor: "white", endColor: "white"}});
//   // Create horizontal scroll effect
//   let sections = gsap.utils.toArray(".homegrid__container");
//   // let horizontalScrollLength = sections.length;
//   let pinWrapWidth = parentWrapper.offsetWidth;
//   let horizontalScrollLength = pinWrapWidth - window.innerWidth;
//   gsap.to('.homegrid__container', {
//     x: () => -parentWrapper.offsetWidth *10,
//     //  x: -horizontalScrollLength,
//     // xPercent: -100 * (sections.length - 1),
//     ease: 'none',
//     scrollTrigger: {
//       trigger: parentWrapper,
//       // scrub: true,
//      markers: {startColor: "blue", endColor : "blue"},
//       scrub: 0.15,
//       start: 'top top',
//       // pin: true,
//         //  end: "+=3000",
//        end: () => `+=${parentWrapper.scrollWidth}`,
//       // end: "+=3000",
//       snap: 1 / gridItemsDuplicated.length,
//       invalidateOnRefresh: true,
//     },
//   });

//   // Handle batch animations for grid items
//   ScrollTrigger.batch('.box', {
//     interval: 0.9,
//     // pin: true,

//     onEnter: batch => gsap.to(batch, {
//       // scale: 0.5,
//       // x: -horizontalScrollLength,
//       // xPercent: gridItemsDuplicated.length - (window.innerWidth / 75),
//       ease: "none", // <-- IMPORTANT!
//       // scrub: 0.1,
//       position: 'relative',

//       stagger: { each: 0.15, grid: [8, 12] },
//     }),
//     onLeave: batch => gsap.set(batch, {
//       opacity: 0.5,
//       xPercent: gridItemsDuplicated.length - (window.innerWidth / 75),
//     }),
//     onEnterBack: batch => gsap.to(batch, {
//       opacity: 1,
//       xPercent: gridItemsDuplicated.length - (window.innerWidth / 75),
//     }),
//     onLeaveBack: batch => gsap.set(batch, {
//       opacity: 0.5,
//       xPercent: gridItemsDuplicated.length - (window.innerWidth / 75),
//     }),
//   });
// }

//   // // batch and add action
//   // const initializeSizesBatch: FlipBatchAction = {
//   //   self: { state: {} as Flip.FlipState },
//   //   getState(self) {
//   //     return Flip.getState(".grid__item");
//   //   },
//   //   setState(self) {
//   //       const sizes = ['small', 'medium', 'large'];
//   //       const contentItems = items.filter(item => !item.classList.contains('fixed-item'));
//   //       const availableAreas = getAvailableGridAreas();
//   //       return contentItems;
//   //     },
//   //     animate(self) {
//   //       Flip.from(self.state, {
//   //         duration: 0.8,
//   //         ease: "power4.inOut",
//   //         absolute: true,
//   //         stagger: 0.05,
//   //         onComplete: () => {
//   //           console.log("Initial layout animation completed");
//   //         }
//   //       });
//   //     },
//   //     onStart(self) {
//   //       console.log("Initializing grid item sizes and positions");
//   //     },
//   //     onComplete(self) {
//   //       console.log("Grid item sizes and positions initialized");
//   //     },
//   //     once: true
//   //   };


//     function getAvailableGridAreas() {
//       const areas = [];
//       for (let row = 1; row <= 12; row++) {
//         for (let col = 1; col <= 12; col++) {
//           // exclude top-left, top-right, center, and content areas
//           if (!((row >= 1 && row <= 4 && col >= 1 && col <= 4) ||
//                 (row >= 1 && row <= 3 && col >= 9 && col <= 12) ||
//                 (row >= 4 && row <= 6 && col >= 5 && col <= 8) ||
//                 (row >= 7 && row <= 12 && col >= 1 && col <= 12))) {
//             areas.push(`${row}/${col}`);
//           }
//         }
//       }
//       return gsap.utils.shuffle(areas);
//     }

// // Event Handlers
// function onDOMContentLoaded() {
//   // Initialize scroll functionality on DOMContentLoaded
//   initLenis();
//   scrollInit();
// }

// function onClick() {
//   listenForFlip();
//   initEvents();
// }

// function scrollMe() {
//   killFlip();
//   listenForFlip();
// }

// function onRefresh() {
//   ScrollTrigger.refresh();
//   gsap.set(boxes, { y: 100, x: 0 });
// }

// eventDispatcher.addEventListener('refresh', onRefresh);
// eventDispatcher.addEventListener('DOMContentLoaded', onDOMContentLoaded);
// eventDispatcher.addEventListener('scroll', scrollMe);

// // Initialize on page load
// onDOMContentLoaded();



