//   const onClick = () => { 
//     const slider = new SeamlessSlider('.gallery');
//     setupHashNav();
//     navigation.checkforAnimation();
//     console.log("clicked");
//     if (window.location.hash) {
//       slider.scrollToVideo(window.location.hash);
//     }
//     // const next = document.querySelector(".next") as HTMLElement ;
//     // const prev = document.querySelector(".prev") as HTMLElement;
//     // next.addEventListener("click", () => scrubTo(scrub.vars.totalTime + spacing));
//     // prev.addEventListener("click", () => scrubTo(scrub.vars.totalTime - spacing));

//   }
// // window.addEventListener('DOMContentLoaded', () => {
// //   // const slider = new SeamlessSlider('.gallery');
// //   navigation.setupNavigationEvents();
// //   projectmaskingAnimationTransition();
// //   initScrollFunctionality();
  
// // //   setupHashNav();
// // //   handleInitialHash();
// // //   setupVideoObservers();
// // // //might be overkill
// // //   if (window.location.hash) {
// // //     scrollToVideo(window.location.hash);
// // //   }
// // });

// // window.addEventListener('hashchange', () => {
// //   const hash = window.location.hash.replace('#', '');
// //   // scrollToVideo(hash);
// // });

// const onScroll = () => {
//   gsap.ticker.lagSmoothing(0); // adjust for a small jump in the tweening
// }
//   const onDOMContentLoaded = () => {
//     const slider = new SeamlessSlider('.gallery');
//     navigation.setupNavigationEvents();
//     projectmaskingAnimationTransition() ;
//     initScrollFunctionality();
//     slider.scrollToSection(0);
//     slider.scrollToVideo('');
//     // setupHashNav();
//     // handleInitialHash();
//     // handleExternalLinks();
//     // setupVideoObservers();
// }
// eventDispatcher.addEventListener("DOMContentLoaded", onDOMContentLoaded);
// eventDispatcher.addEventListener("click", onClick);
// eventDispatcher.addEventListener("scroll", onScroll);
// window.addEventListener('hashchange', onScroll);

//   window.addEventListener('hashchange', () => {
//     const hash = window.location.hash.replace('#', '');
//     // scrollToVideo(hash);
//   });

//   window.addEventListener('resize', () => {
//     ScrollTrigger.refresh();
//   });
  // const eventDispatcher = new EventDispatcher();
// use the dispatcher, this should not need editing 



// Create an Intersection Observer for video n text

// let thumbText = gsap.utils.toArray(".panel-overlay-text");
// let thumbtextTl = gsap.timeline(); //create the timeline
// thumbtextTl.fromTo(thumbText, 
//   { duration: 1.75, opacity: 1, ease: "power4.inOut", stagger:0.525 }, 
//   { duration: 1.75, opacity: 0 , ease: "power4.inOut", stagger:0.525, delay:0.525
//  },
 
// );

// const videoObserver = new IntersectionObserver((entries, observer) => {
//   entries.forEach(entry => {
//     const video = entry.target as HTMLVideoElement;
//     const playPromise = video.play();
//     if (entry.isIntersecting) {
//       playPromise.then(_ => {
//         // Automatic playback started!
//         // Show playing UI.
     
  
//       video.play();
//       video.controls = true;
//       video.autoplay = true;
//       video.loop = true;

//       thumbtextTl.restart();
//       thumbtextTl.play();
//     })
//       .catch(error => {
//         // Auto-play was prevented
//         // Show paused UI.
//       });


//     } else {
//       playPromise.then(_ => {
//       video.pause();
//       video.controls = false;
//       video.autoplay = false;
//       video.muted = true;
//       video.loop = false;
//     })
//     .catch(error => {
//       // Auto-play was prevented
//       // Show paused UI.
//     });
//       // thumbtextTl.pause();
//     }
//   });
// }, { threshold: 0.5 });

// videos.forEach(video => {
  
//   videoObserver.observe(video as HTMLVideoElement);
//   thumbtextTl.play();


// });



// Observer.create({
//  type: "wheel,touch,pointer",
//  preventDefault: true,
//  wheelSpeed: -1,
 
//  onStop: () => {
//   console.log("stopped");
//   let animating = false;
//   let playPromise = Promise.resolve();
 
//   videos.forEach(video => {
//     playPromise.then(_ => {
//     (video as HTMLVideoElement).play();
//     (video as HTMLVideoElement).controls = true;
//     (video as HTMLVideoElement).autoplay = true;

//     thumbtextTl.restart();

//    })
//     .catch(error => {
//       // Auto-play was prevented
//       // Show paused UI.
//     });
//   })
//  },
//  onUp: () => {
//   console.log("down");
//   if (animating) return;
//   // gotoSection(currentIndex + 1, +1);
//   if (animating) {
//     videos.forEach(video => {
//       (video as HTMLVideoElement).pause();
//       (video as HTMLVideoElement).controls = false;
//       (video as HTMLVideoElement).autoplay = false;
//       (video as HTMLVideoElement).muted = true;
//       thumbtextTl.reverse();
//     });
// }


//  },
//  onDown: () => {
//   console.log("up");
//   if (animating) return;
//   // gotoSection(currentIndex - 1, -1);
//   videos.forEach(video => {
//     (video as HTMLVideoElement).pause();
//     (video as HTMLVideoElement).controls = false;
//     (video as HTMLVideoElement).autoplay = false;
//     thumbtextTl.reverse();

//   });
//  },
//  onChange: () => {
//    if (animating) return;

  
//  },
//  tolerance: 10
// });


// const lenis = new Lenis({
//   duration: 1.3,
//   easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
//   smooth: true,
//   smoothWheel: true,
//   syncTouchLerp: true,
//   syncTouch: true,
//   // infinite: true,
//   mouseMultiplier: 1,
//   smoothTouch: false,
//   touchMultiplier: 2,
//   autoResize: true,
//   prevent: (node) => node.id === 'elements',

// });

// function raf(time: any) {
//   lenis.raf(time);
//   requestAnimationFrame(raf);
// }

// requestAnimationFrame(raf);
// create an observer and disable it to start



// let { iteration, seamlessLoop, scrub, trigger, spacing } = seamlessLoopScroll();

// function  seamlessLoopScroll() {
//   ScrollTrigger.defaults({markers: {startColor: "white", endColor: "white"}});
//   let iteration = 0; // gets iterated when we scroll all the way to the end or start and wraps around 
//   // let sections = gsap.utils.toArray(".panel");
//   const spacing = 0.1, // (stagger)
//     snap = gsap.utils.snap(spacing), // we'll use this to snap the playhead on the seamlessLoop
//     cards = gsap.utils.toArray('.cards li'), seamlessLoop = buildSeamlessLoop(cards, spacing), scrub = gsap.to(seamlessLoop, {
//       totalTime: 0,
//       duration: 0.5,
//       ease: "power3",
//       paused: true
//     }), 
//     trigger = ScrollTrigger.create({
//       start: 0,
//       // pinSpacing: false,
//       // markers: {startColor: "white", endColor: "white", fontSize: "18px", fontWeight: "bold", indent: 20},
//       onEnter: () => {
//         console.log("scrolltrigger entered")
       
//       },
//       onUpdate(self) {
//         if (self.progress === 1 && self.direction > 0 && !self.wrapping) {
//           wrapForward(self);
//           console.log('wrapping forward')
//         } else if (self.progress < 1e-5 && self.direction < 0 && !self.wrapping) {
//           wrapBackward(self);
//           console.log('wrapping backward')
//         } else {
//           scrub.vars.totalTime = snap((iteration + self.progress) * seamlessLoop.duration());
//           scrub.invalidate().restart(); // to improve performance, we just invalidate and restart the same tween.
//           self.wrapping = false;
//         }
//       // },
//       // Determine the current item based on the scroll position
//       // let totalTime = scrub.vars.totalTime;
//       // let currentLabel = '';
//       // for (let i = 0; i <= cards.length; i++) {
//       //   let labelTime = seamlessLoop.labels["label" + i];
//       //   if (labelTime !== undefined && totalTime >= labelTime) {
//       //     currentLabel = "label" + i;
//       //   }
//       // }
//       // console.log("Current item:", currentLabel);
//     },
//       end: "+=3000",
//       pin: ".gallery"
//     });
//     const videoArray = gsap.utils.toArray('.slider-video') as HTMLElement[];
//     let videoWrap = gsap.utils.selector('#masterWrap'); //find videos only on master wrap
//     let videoHashElems = videoWrap(`[data-hashnav="#${hash}"]`); 
//     let currentItem = {

//       label: "",
//       element: HTMLElement,
//     };
    
//     function updateCurrentItem() {
//       let totalTime = scrub.vars.totalTime;
//       let currentLabel = '';
//       let currentElement = null;
    
//       for (let i = 0; i <= cards.length; i++) {
//         let labelTime = seamlessLoop.labels["label" + i];
//         if (labelTime !== undefined && totalTime >= labelTime) {
//           currentLabel = "label" + i;
//           currentElement = cards[i];
//         }
//       }
    
//       currentItem.label = currentLabel;
//       currentItem.element = currentElement;
    
//       console.log("Current item:", currentItem);
//     }
    
//     // seamlessLoop.add('label1', 0)
//     // seamlessLoop.add("label2", 1)
//   return { iteration, seamlessLoop, scrub, trigger, spacing };
// }

// function wrapForward(trigger) { // when the ScrollTrigger reaches the end, loop back to the beginning
// 	iteration++;
// 	trigger.wrapping = true;
// 	trigger.scroll(trigger.start + 1);
// }

// function wrapBackward(trigger) { // when the ScrollTrigger reaches the start again, loop back to the end
// 	iteration--;
// 	if (iteration < 0) { // to keep the playhead from stopping at the beginning, we jump ahead 10 iterations
// 		iteration = 9;
// 		seamlessLoop.totalTime(seamlessLoop.totalTime() + seamlessLoop.duration() * 10);
//     scrub.pause(); // otherwise it may update the totalTime right before the trigger updates 
// 	}
// 	trigger.wrapping = true;
// 	trigger.scroll(trigger.end - 1);
// }

// function scrubTo(totalTime) { // moves the scroll position to the place that corresponds to the totalTime value of the seamlessLoop
// 	let progress = (totalTime - seamlessLoop.duration() * iteration) / seamlessLoop.duration();
// 	if (progress > 1) {
// 		wrapForward(trigger);
// 	} else if (progress < 0) {
// 		wrapBackward(trigger);
// 	} else {
// 		trigger.scroll(trigger.start + progress * (trigger.end - trigger.start));
// 	}
// }

// function buildSeamlessLoop(items, spacing) {
// 	let overlap = Math.ceil(1 / spacing), //  accommodate the seamless looping
// 		startTime = items.length * spacing + 0.5, // the time on the rawSequence at which we'll start the seamless loop
// 		loopTime = (items.length + overlap) * spacing + 1, // the spot at the end where we loop back to the startTime 
// 		rawSequence = gsap.timeline({paused: true}), // this is where all the "real" animations live
// 		seamlessLoop = gsap.timeline({ // this merely scrubs the playhead of the rawSequence so that it appears to seamlessly loop
// 			paused: true,
// 			repeat: -1, // to accommodate infinite scrolling/looping
// 			onRepeat() { // works around a super rare edge case bug that's fixed GSAP 3.6.1
// 				this._time === this._dur && (this._tTime += this._dur - 0.01);
// 			}
// 		}),
// 		l = items.length + overlap * 2,
// 		time = 0,
// 		i, index, item;

// 	// set initial state of items
// 	// gsap.set(items, {xPercent: 400, opacity: 0,	scale: 0});

// 	// create all the animations in a staggered fashion. create EXTRA animations at the end 4 seamless looping.
// 	for (i = 0; i < l; i++) {
// 		index = i % items.length;
// 		item = items[index];
// 		time = i * spacing;
// 		rawSequence.fromTo(item, {scale: 0, opacity: 0}, {scale: 1, opacity: 1, zIndex: 100, duration: 0.5, yoyo: true, repeat: 1, ease: "power1.in", immediateRender: true}, time)
// 		           .fromTo(item, {xPercent: 400}, {xPercent: -400, duration: 1, ease: "none", immediateRender: true}, time);
// 		i <= items.length && seamlessLoop.add("label" + i, time); // we don't really need these, but if you wanted to jump to key spots using labels, here ya go.
// // console.log("label" + i, time);
// 	}
//   // let currentItem = "";

//   // function updateCurrentItem() {
//   //   items.forEach((item, time) => {
//   //     if (ScrollTrigger.isInViewport(item, 0.5)) {
//   //       currentItem = "label" + item + time;
//   //     }
//   //   });
//   // }
//   // ScrollTrigger.addEventListener("scrollEnd", updateCurrentItem);
// 	// label.
// 	// set up the scrubbing of the playhead to make it appear seamless. 
// 	rawSequence.time(startTime);
// 	seamlessLoop.to(rawSequence, {
// 		time: loopTime,
// 		duration: loopTime - startTime,
// 		ease: "none"
// 	}).fromTo(rawSequence, {time: overlap * spacing + 1}, {
// 		time: startTime,
// 		duration: startTime - (overlap * spacing + 1),
// 		immediateRender: false,
// 		ease: "none"
// 	});
// 	return seamlessLoop;
// }

// function setupVideoObservers() {
//   //observers for video playback specifically
//     // array of vidya and selector 
//     const videoArray = gsap.utils.toArray('.slider-video') as HTMLElement[];
//     let videoWrap = gsap.utils.selector('#masterWrap'); //find videos only on master wrap
//     let videoHashElems = videoWrap(`[data-hashnav="#${hash}"]`); 
//     const video = document.querySelector('.slider-video') as HTMLElement;
//   // const videos = document.querySelectorAll('.slider-video');
//   // const observer = new IntersectionObserver((entries) => {
//   //   entries.forEach(entry => {
//   //     const video = entry.target as HTMLVideoElement;
//   //     if (entry.isIntersecting) {
//   //       video.play();
//   //       video.controls = true;
//   //       video.autoplay = true;
//   //       video.loop = true;
//   //     } else {
//   //       video.pause();
//   //       video.controls = false;
//   //       video.autoplay = false;
//   //       video.loop = false;
//   //     }
//   //   });
//   // }, { threshold: 0.5 });

//   // videos.forEach(video => observer.observe(video));
//   //observers for scroll trigger specifically

// let intentObserver = ScrollTrigger.observe({
//   type: "wheel,touch, pointer",
//   // onUp: () => !animating && wrapForward(currentIndex ),
//   // onDown: () => !animating && wrapBackward(currentIndex ),
//   wheelSpeed: -1, // to match mobile behavior, invert the wheel speed
//   tolerance: 10,
//   preventDefault: true,
//   onPress: self => {
//     // on touch devices like iOS, if we want to prevent scrolling, we must call preventDefault() on the touchstart 
//     ScrollTrigger.isTouch && self.event.preventDefault()
//   }
// })

//  //is any part of the element in the viewport? check if more than 40% of elem in viewport
//  if (ScrollTrigger.isInViewport(video, 0.4, true)) {
//   // you can use selector text
//   // do stuff
  
//   console.log("target is in viewport");

// }
// // intentObserver.disable();
// }
// // make the whole thing draggable
// function setUpDraggable () {

// let container = document.querySelector(".gallery");
// let snap = gsap.utils.snap(spacing);
// let dragMe = Draggable.create(container, {
//   type: "x",
//   edgeResistance: 1,
//   snap: snap,
//   inertia: true,
//   bounds: "#masterWrap",
//   // onDrag: seamlessLoop,
//   // onThrowUpdate: tweenDot,
//   // onDragEnd: slideAnim,
//   allowNativeTouchScrolling: false,
//   zIndexBoost: false
// });
// // overkill
// // dragMe[0].id = "dragger";
// }
// // const track = document.querySelector('.track') as HTMLElement;
// // const panels = gsap.utils.toArray('.panel-wide');



// function scrollToVideo(hash: string) {
//   // array of vidya and selector 
//   const videoArray = gsap.utils.toArray('.slider-video') as HTMLElement[];
//   let videoWrap = gsap.utils.selector('#masterWrap'); //find videos only on master wrap
//   let videoHashElems = videoWrap(`[data-hashnav="#${hash}"]`); 
//   const video = document.querySelector('.slider-video') as HTMLElement;
//   // let tl = gsap.timeline({
//   //   scrollTrigger: {
//   //     trigger: videoHashElems[0],
//   //     pin: false,
//   //     scrub: 1,
//   //     markers: true,
//   //     start: "left right",
//   //     // end: () => "+=" + innerWidth * videoHashElems.length,
//   //   },
//   //   defaults: { ease: "none", duration: 1 }
//   // });
  
//   // videoHashElems.forEach(function(e, i) {
    
//   //   tl.fromTo(e, {
//   //     xPercent: 100,
//   //     onComplete: () => {
//   //       scrubTo(scrub.vars.totalTime + spacing);
//   //     }
//   //   }, {
//   //     xPercent: 0,
//   //     onComplete: () => {
//   //       scrubTo(scrub.vars.totalTime - spacing);
//   //     }
//   //   }, i);
//   // });
//   // only show the relevant section's markers at any given time

// // is any part of the element in the viewport? check if more than 40% of elem in viewport
// // if (ScrollTrigger.isInViewport(video, 0.4, true)) {
// //   // you can use selector text
// //   // do stuff
// //   console.log("target is in viewport");

// // }
// // videoArray.forEach(video => {
// //   if (ScrollTrigger.isInViewport(video, 0.4, true)) {
// //     console.log("target is in viewport");
// //   }
// // })

//   // if (videoHashElems.length > 0) {
//   //   gsap.to(window, {
//   //     scrollTo: { y: videoHashElems.length, offsetY: 50 }, // Adjust offset as needed
//   //     duration: 1,
//   //     ease: 'power2.inOut'
//   //   });
    
//     //Update the URL hash without triggering a scroll
//     history.pushState( '', `#${hash}`);
//   }
// // }
// // }
// //   ScrollTrigger.observe({
// //     target: video,
// //     type: "touch, wheel, scroll, pointer", //listen for all since it's gonna need to
// //     onUp: () => {},
// //     onDown: () => {},
// //     onDrag: () => {},
// //     onDragEnd: () => {},
// //     onPress: self => {
// //       // on touch devices like iOS, if we want to prevent scrolling, we must call preventDefault() on the touchstart 
// //       ScrollTrigger.isTouch && self.event.preventDefault()
// //       setUpDraggable();
// //     }
// //   })


//   // total width needed for wrap
//   // const scrollPosition = videoArray.slice(0).reduce((acc, panel) => );
//   // let intentObserver = new intentObserver(videoHashElems);
//   // intentObserver.disable();

//   // const video = document.querySelector(`[data-hashnav="#${hash}"]`) as HTMLElement;
//   // // if (video) {
//   //   const panel = video.closest('.panel-wide') as HTMLElement;
//   //   if (panel) {
//   //     const track = document.querySelector('.track') as HTMLElement;
//   //     const panels = gsap.utils.toArray('.panel-wide') as HTMLElement[];
//   //     const panelIndex = panels.indexOf(panel);

//   //     // total width needed for wrap
//   //     const scrollPosition = panels.slice(0, panelIndex).reduce((acc, panel) => acc + panel.offsetWidth, 0);

//   //     // viewport center
//   //     const viewportCenter = window.innerWidth / 2;

//   //     //target position to scroll to (center the video)
//   //     const targetPosition = scrollPosition - viewportCenter + (panel.offsetWidth / 2);

//   //     gsap.to(track, {
//   //       x: -targetPosition,
//   //       duration: 1.2,
//   //       ease: "power2.inOut",
//   //       onStart: () => {
//   //         console.log("scroll started:" + track.offsetWidth);
//   //             //  end: () => "+=" + (track.scrollWidth - window.innerWidth),
//   //       },
//   //       onComplete: () => {
//   //         console.log("Scroll completed");
//   //         // ScrollTrigger.refresh();
//   //         // lenis.isStopped;
//   //       }
//   //     });


//     // }
//   // }
// // }


// function setupHashNav() {
//   const thumbnails = document.querySelectorAll('.thumbtext');
//   thumbnails.forEach((thumb) => {
//     thumb.addEventListener('click', (e) => {
//       e.preventDefault();
//       const target = e.currentTarget as HTMLAnchorElement;
//       const hash = target.getAttribute('href')?.replace('#', '') || '';
//       scrollToVideo(hash);
//     });
//   });
// }

// function handleInitialHash() {
//   if (window.location.hash) {
//     const hash = window.location.hash.replace('#', '');
//     scrollToVideo(hash);
//   }
// }

// // function setupVideoObservers() {
// //   // const videos = document.querySelectorAll('.slider-video');
// //   // const observer = new IntersectionObserver((entries) => {
// //   //   entries.forEach(entry => {
// //   //     const video = entry.target as HTMLVideoElement;
// //   //     if (entry.isIntersecting) {
// //   //       video.play();
// //   //       video.controls = true;
// //   //       video.autoplay = true;
// //   //       video.loop = true;
// //   //     } else {
// //   //       video.pause();
// //   //       video.controls = false;
// //   //       video.autoplay = false;
// //   //       video.loop = false;
// //   //     }
// //   //   });
// //   // }, { threshold: 0.5 });

// //   // videos.forEach(video => observer.observe(video));
// // }







 
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
 