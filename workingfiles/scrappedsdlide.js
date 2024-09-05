// const colorArray = [
//   "#683A5E",
//   "#262626",
//   "#426F42",
//   "#8B814C",
//   "#36648B",
//   "#36648B"
// ];
// const slides = document.querySelectorAll(".panel-wide");
// const container = document.querySelector(".sticky-element");
// let dur = 0.5;
// let offsets = [];
// let oldSlide = 0;
// let activeSlide = 0;
// let dots = document.querySelector(".thumbs");
// let navDots = [];
// let iw = window.innerWidth;
// const mouseAnim = gsap.timeline({ repeat: -1, repeatDelay: 1 });
// const handAnim = gsap.timeline({ repeat: -1, repeatDelay: 1 });
// const cursorAnim = gsap.timeline({ repeat: -1, repeatDelay: 1 });
// const arrowAnim = gsap.timeline({ repeat: -1, repeatDelay: 1 });

// document.querySelector("#leftArrow").addEventListener("click", slideAnim);
// document.querySelector("#rightArrow").addEventListener("click", slideAnim);

// // set slides background colors and create the nav dots
// for (let i = 0; i < slides.length; i++) {
//   // gsap.set(slides[i], { backgroundColor: colorArray[i] });
//   let newDot = document.createElement("div");
//   newDot.className = "dot";
//   newDot.index = i;
//   navDots.push(newDot);
//   newDot.addEventListener("click", slideAnim);
//   dots.appendChild(newDot);
// }

// // icon animations for slide 1
// // mouseAnim.fromTo(
// //   "#mouseRings circle",
// //   { attr: { r: 10 } },
// //   { attr: { r: 40 }, duration: 0.8, stagger: 0.25 }
// // );
// // mouseAnim.fromTo(
// //   "#mouseRings circle",
// //   { opacity: 0 },
// //   { opacity: 1, duration: 0.4, stagger:0.25 },
// //   0
// // );
// // mouseAnim.fromTo(
// //   "#mouseRings circle",
// //   { opacity: 1 },
// //   { opacity: 0, duration: 0.4, stagger:0.25 },
// //   0.4
// // );

// // handAnim.to("#hand", { duration: 0.75, rotation: -10, transformOrigin: "center bottom" });
// // handAnim.to("#hand", { duration: 0.5, rotation: 14, ease: "power3.inOut" });
// // handAnim.to("#hand", { duration: 1, rotation: 0, transformOrigin: "center bottom" });

// // cursorAnim.to("#cursor", { duration: 0.25, x: -22 });
// // cursorAnim.to(
// //   "#iconCircles circle",
// //   0.5,
// //   { duration: 0.5, attr: { r: 6 }, stagger:0.15 },
// //   "expand"
// // );
// // cursorAnim.to("#cursor", { duration: 1.1, x: 40 }, "expand");
// // cursorAnim.to("#cursor", { duration: 0.75, x: 0 }, "contract");
// // cursorAnim.to("#iconCircles circle", { duration: 0.5, attr: { r: 4 } }, "contract");

// // arrowAnim.to("#caret", {
// //   duration: 0.5,
// //   attr: { points: "60 30, 35 50, 60 70" },
// //   repeat: 3,
// //   yoyo: true,
// //   ease: "power2.inOut",
// //   repeatDelay: 0.25
// // });

// // get elements positioned
// gsap.set(".thumbs", { xPercent: -50 });
// gsap.set(".arrow", { yPercent: -50 });
// gsap.set(".panel-overlay-text", { y: 30 });

// // lower screen animation with nav dots and rotating titles
// const dotAnim = gsap.timeline({ paused: true });
// dotAnim.to(
//   ".dot",
//   {
//     stagger: { each: 1, yoyo: true, repeat: 1 },
//     scale: 2.1,
//     rotation: 0.1,
//     ease: "none"
//   },
//   0.5
// );
// dotAnim.to(
//   ".title",
//   slides.length + 1,
//   { y: -(slides.length * 30), rotation: 0.01, ease: "none" },
//   0
// );
// dotAnim.time(1);

// // make the whole thing draggable
// let dragMe = Draggable.create(container, {
//   type: "x",
//   edgeResistance: 1,
//   snap: offsets,
//   inertia: true,
//   bounds: "#masterWrap",
//   onDrag: tweenDot,
//   onThrowUpdate: tweenDot,
//   onDragEnd: slideAnim,
//   allowNativeTouchScrolling: false,
//   zIndexBoost: false
// });

// dragMe[0].id = "dragger";
// sizeIt();

// // main action check which of the 4 types of interaction called the function
// function slideAnim(e) {
//   oldSlide = activeSlide;
//   // dragging the panels
//   if (this.id === "dragger") {
//     activeSlide = offsets.indexOf(this.endX);
//   } else {
//     if (gsap.isTweening(container)) {
//       return;
//     }
//     // arrow clicks
//     if (this.id === "leftArrow" || this.id === "rightArrow") {
//       activeSlide =
//         this.id === "rightArrow" ? (activeSlide += 1) : (activeSlide -= 1);
//       // click on a dot
//     } else if (this.className === "dot") {
//       activeSlide = this.index;
//       // scrollwheel
//     } else {
//       activeSlide = e.deltaY > 0 ? (activeSlide += 1) : (activeSlide -= 1);
//     }
//   }
//   // make sure we're not past the end or beginning slide
//   activeSlide = activeSlide < 0 ? 0 : activeSlide;
//   activeSlide = activeSlide > slides.length - 1 ? slides.length - 1 : activeSlide;
//   if (oldSlide === activeSlide) {
//     return;
//   }
//   // if we're dragging we don't animate the container
//   if (this.id != "dragger") {
//     gsap.to(container, dur, { x: offsets[activeSlide], onUpdate: tweenDot });
//   }
// }

// // update the draggable element snap points
// function sizeIt() {
//   offsets = [];
//   iw = window.innerWidth;
//   gsap.set("#panelWrap", { width: slides.length * iw });
//   gsap.set(slides, { width: iw });
//   for (let i = 0; i < slides.length; i++) {
//     offsets.push(-slides[i].offsetLeft);
//   }
//   gsap.set(container, { x: offsets[activeSlide] });
//   dragMe[0].vars.snap = offsets;
// }

// gsap.set(".hideMe", { opacity: 0 });
// window.addEventListener("wheel", slideAnim);
// window.addEventListener("resize", sizeIt);

// // update dot animation when dragger moves
// function tweenDot() {
//   gsap.set(dotAnim, {
//     time: Math.abs(gsap.getProperty(container, "x") / iw) + 1
//   });
// }


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