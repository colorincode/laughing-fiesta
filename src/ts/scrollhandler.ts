import gsap from 'gsap'
// import TextPlugin from 'gsap/TextPlugin';
import { Flip } from 'gsap/Flip';
import Draggable from 'gsap/Draggable';
import ScrollTrigger from 'gsap/ScrollTrigger';
import ScrollToPlugin from 'gsap/ScrollToPlugin';
import EasePack from 'gsap/EasePack';
import { Power4 } from 'gsap/gsap-core';
import Observer from 'gsap/Observer';
// import { sqrt, MathCollection , create, all, string} from 'mathjs';
import Timeline from 'gsap/all';
import  Tween  from 'gsap/src/all';
import Lenis from 'lenis';

gsap.registerPlugin(Flip);
gsap.registerPlugin(Draggable);
gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(Observer);
gsap.registerPlugin(ScrollToPlugin);
gsap.registerPlugin(Draggable);

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