
import gsap, { SteppedEase, toArray } from 'gsap';
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
import {EventDispatcher} from "./shared/eventdispatch";
import {Navigation} from "./shared/nav";
import { Canvas } from './Canvas'
import Splide from '@splidejs/splide';
import { Video } from '@splidejs/splide-extension-video';
import { URLHash } from '@splidejs/splide-extension-url-hash';
import { Intersection } from '@splidejs/splide-extension-intersection';

// globals
let browserHash: string | null;
const navigation = new Navigation();
const eventDispatcher = new EventDispatcher();
gsap.registerPlugin(EasePack, Tween, SteppedEase, Timeline, Power4, Flip, Draggable, ScrollTrigger, Observer, ScrollToPlugin);
let animating = false;
let currentIndex = 0;
let imagePlacementArray: any[] = [];


let isMaskingAnimationRunning = true; // flag to not allow multiple animations to pile up
let mm = gsap.matchMedia();
//handle initial hash and event
function handleInitialHash() {
  browserHash = window.location.hash;
}
//re order list
function reorderListItems() {
  handleInitialHash();
  const ul = document.querySelector('.cards');
  if (!ul) {
    console.error('UL with class "cards" not found');
    return;
  }
  const lis = Array.from(ul.querySelectorAll('li'));
  if (browserHash) {
    const matchingLi = lis.find(li => li.getAttribute('data-splide-hash') === browserHash);
    if (matchingLi) {
      ul.removeChild(matchingLi);
      ul.insertBefore(matchingLi, ul.firstChild);
      console.log(`moved li ${browserHash} to first child`);
    } else {
      console.log('no matching li found for the current hash');
    }
  } else {
    console.log('no browser hash present');
  }
}
reorderListItems();
//text TL
let xMarkTimelines: Map<HTMLElement, GSAPTimeline> = new Map();
function createXMarkTimelines() {
  const xMarks = document.querySelectorAll(".panel-overlay-x");
  xMarks.forEach((xMark) => {
    const timeline = gsap.timeline({ paused: true });
    timeline.fromTo(xMark,
      { duration: 1.25, opacity: 0, ease: "linear", visibility: 'hidden' },
      { duration: 1.25, opacity: 1, ease: "linear", visibility: 'inherit' }
    );
    xMarkTimelines.set(xMark as HTMLElement, timeline);
  });
}
createXMarkTimelines();

function playXMarkForVideo(currentVideo: HTMLVideoElement) {
  gsap.set(".panel-overlay-x", { opacity: 0, visibility: 'hidden' });
  xMarkTimelines.forEach((timeline) => {
    timeline.pause(0);
  });
  const currentXMark = currentVideo.parentElement?.querySelector(".panel-overlay-x") as HTMLElement | null;
  if (currentXMark && xMarkTimelines.has(currentXMark)) {
    const timeline = xMarkTimelines.get(currentXMark);
    timeline?.play();
  }
}

mrScopertonShufflerton();
function mrScopertonShufflerton() {

  function processImages() {
    const wrappers = document.querySelectorAll('.proj--image--wrapper--div');
    let visibleElements = 9;
    let hiddenElements = wrappers.length - visibleElements;

    for (let i = 0; i < visibleElements; i++) {
      const posClass = `image-pos-${i + 1}`;
      const imagePosClass = `image--item${i + 1}`;
      let arrayInfo = {
        wrapperPos: posClass,
        imagePos: imagePosClass
      };
      imagePlacementArray.push(arrayInfo);
    }
    for (let i = 0; i < hiddenElements; i++) {
      const posClass = `proj--hidden--image--wrapper--div`;
      const imagePosClass = `hidden--proj--image`;
      let arrayInfo = {
        wrapperPos: posClass,
        imagePos: imagePosClass
      };
      imagePlacementArray.push(arrayInfo);
    }
    // console.log(imagePlacementArray);
    shuffleArray(imagePlacementArray);
  }
  function shuffleArray(array: any) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
  function projReplacePositioningClasses() {
    const imageWrappers = document.querySelectorAll('.proj--image--wrapper--div');
    imageWrappers.forEach((imageWrapper, index) => {
      if (index < imagePlacementArray.length ) {
        imageWrapper.classList.remove(...imageWrapper.classList);
        imageWrapper.classList.add('proj--image--wrapper--div', imagePlacementArray[index].wrapperPos);
        const image = imageWrapper.querySelector('.proj--image');
        if (image) {
          image.classList.remove(...image.classList);
          image.classList.add('proj--image', imagePlacementArray[index].imagePos);
        }
      }
    });
  }
  processImages();
  projReplacePositioningClasses();
}


let splide =new Splide( '.splide', {
  intersection: {
    inView: {
      autoScroll:false,
      keyboard:true,
      video:false,
    },
    outView: {
      autoScroll:false,
      keyboard:false,
      video:false,
   
    },
  },
  type   : 'loop',
  rewind      : true,
  rewindByDrag: true,
  // drag   : 'free',
  // autoWidth: true,
  // direction: "ltr",
  slideFocus: true,
  focusableNodes: "a, button, i, div, input, select, video",
  fixedHeight    : 'calc(52rem * 9 / 16)',
  fixedWidth : "52rem",
  gap        : '4rem',
  // snap   : true,
  arrows:true,
  perPage: 3,
  drag   : 'free',
  snap   : true,
  focus  : 'center',
  lazyLoad: 'nearby',
  // trimSpace : 'move',
  wheel       : true,
  releaseWheel: true,
  noDrag: '.topbar--global, header, .navigation, .toggle-wrapper, .proj--background--grid__wrapper, .maskingintro--container',
  // pagination: '',
  easing : "cubic-bezier(0.25, 1, 0.5, 1)",
  keyboard:"focused",
  breakpoints: {
  
    640: {
      // destroy : "completely",
      // perPage: 3,
      drag   : 'free',
      snap   : true,
      focus  : 'center',
      // autoWidth: "true",
      padding: { left: '0', right: '0' },
      // gap        : '2rem',
      trimSpace : 'move',
      noDrag: '.topbar--global, header, .navigation, .toggle-wrapper, .proj--background--grid__wrapper, .maskingintro--container',
      fixedWidth    : '17rem',
      fixedHeight : "calc(17rem * 9 / 16)",
      // autoWidth:true,
      // width:'80%',
      type   : 'loop',
      rewind      : true,
      rewindByDrag: true,
      lazyLoad: 'nearby',
		},
  },
    dragMinThreshold: {
      mouse: 0,
      touch: 10,
    },
  
} );
  splide.mount({ URLHash , Intersection });

  const width = window.innerWidth;

if (width > 1969) {
  console.log("window height greater than 1268");
 splide.destroy();

 let desktopSplide =new Splide( '.splide', {
  intersection: {
    inView: {
      autoScroll:false,
      keyboard:true,
      video:false,
    },
    outView: {
      autoScroll:false,
      keyboard:false,
      video:false,
   
    },
  },
  type   : 'loop',
  rewind      : true,
  rewindByDrag: true,
  // drag   : 'free',
  // autoWidth: true,
  // direction: "ltr",
  slideFocus: true,
  focusableNodes: "a, button, i, div, input, select, video",
  fixedHeight    : 'calc(82rem * 9 / 16)',
  fixedWidth : "82rem",
  gap        : '4rem',
  // snap   : true,
  arrows:true,
  perPage: 3,
  drag   : 'free',
  snap   : true,
  focus  : 'center',
  lazyLoad: 'nearby',
  // trimSpace : 'move',
  wheel       : true,
  releaseWheel: true,
  noDrag: '.topbar--global, header, .navigation, .toggle-wrapper, .proj--background--grid__wrapper, .maskingintro--container',
  // pagination: '',
  easing : "cubic-bezier(0.25, 1, 0.5, 1)",
  keyboard:"focused",
  breakpoints: {
  
    640: {
      // destroy : "completely",
      // perPage: 3,
      drag   : 'free',
      snap   : true,
      focus  : 'center',
      // autoWidth: "true",
      padding: { left: '0', right: '0' },
      // gap        : '2rem',
      trimSpace : 'move',
      noDrag: '.topbar--global, header, .navigation, .toggle-wrapper, .proj--background--grid__wrapper, .maskingintro--container',
      fixedWidth    : '17rem',
      fixedHeight : "calc(17rem * 9 / 16)",
      // autoWidth:true,
      // width:'80%',
      type   : 'loop',
      rewind      : true,
      rewindByDrag: true,
      lazyLoad: 'nearby',
		},
  },
    dragMinThreshold: {
      mouse: 0,
      touch: 10,
    },
  
} );
desktopSplide.mount({ URLHash , Intersection });
}
// function raf(time) {
//   lenis.raf(time)
//   requestAnimationFrame(raf)
// }

// requestAnimationFrame(raf)
// const hash = window.location.hash.substring(1);
// const videoArray = gsap.utils.toArray('.slider-video') as HTMLElement[];
// let videoWrap = gsap.utils.selector('#masterWrap'); //find videos only on master wrap
// let videoHashElems = videoWrap(`[data-hashnav="#${hash}"]`); 

// updateDOMFromArray(cardsArray).then(() => {
//   let { iteration, seamlessLoop, scrub, trigger, spacing } = seamlessLoopScroll();
// // });

// function  seamlessLoopScroll() {


//   let iteration = 0; // gets iterated when we scroll all the way to the end or start and wraps around 
//   const spacing = 0.1, // (stagger)
//     snap = gsap.utils.snap(spacing), // we'll use this to snap the playhead on the seamlessLoop
//     cards = gsap.utils.toArray('.cards li'), 
//     seamlessLoop = buildSeamlessLoop(cards, spacing), 
//     scrub = gsap.to(seamlessLoop, {
//       totalTime: 0,
//       duration: 0.5,
//       ease: "power3",
//       paused: true
//     }), 
//     trigger = ScrollTrigger.create({
//       start: 0,
//       scrub: true,
//       // trigger: 'video-matching',
//       invalidateOnRefresh: true,
//       // pinSpacing: false,
//       // markers: {startColor: "white", endColor: "white", fontSize: "18px", fontWeight: "bold", indent: 20},
//       onEnter: () => {
//         // console.log("scrolltrigger entered");
//       },
//       onUpdate(self) {
//         if (self.progress === 1 && self.direction > 0 && !self.wrapping) {
//           wrapForward(self);
//           // console.log("velocity:", self.getVelocity())
//           // console.log('wrapping forward')
//         } else if (self.progress < 1e-5 && self.direction < 0 && !self.wrapping) {
//           wrapBackward(self);
//           // console.log('wrapping backward')
//           // console.log("velocity:", self.getVelocity())
//         } else {
//           scrub.vars.totalTime = snap((iteration + self.progress) * seamlessLoop.duration());
//           scrub.invalidate().restart(); // to improve performance, we just invalidate and restart the same tween.
//           self.wrapping = false;
//         }
//     },
//       end: "+=3000",
//       pin: ".gallery"
//     });
    // let mm = gsap.matchMedia();
    // let maxWidth = 0;

    // mm.add("(max-width: 768px)", () => { 
    //       const getMaxWidth = () => {
    //   maxWidth = 0;
    //   videoArray.forEach((section) => {
    //   maxWidth += section.offsetWidth;
    //   });
    // };
    // getMaxWidth();
    //        //if a phone make it draggable??
    //   let scrollTween = gsap.to(videoArray, {
    //     x: () => `-${maxWidth - window.innerWidth}`,
    //     ease: "none",
    //   });
      
    //   let horizontalScroll = ScrollTrigger.create({
    //     animation: scrollTween,
    //     trigger: ".wrapper",
    //     pin: true,
    //     scrub: true,
    //     end: () => `+=${maxWidth}`,
    //     invalidateOnRefresh: true
    //   });
      
    //   var dragRatio = (maxWidth / (maxWidth - window.innerWidth))
 
    //   var drag = Draggable.create(".drag-proxy", {
    //     trigger: '.wrapper',
    //     type: "x",
    //     allowContextMenu: true,
    //     onPress() {
    //       this.startScroll = horizontalScroll.scroll();
    //     },
    //     onDrag() {
    //       horizontalScroll.scroll(this.startScroll - (this.x - this.startX) * dragRatio);
    //     }
    //   })[0];

    // })
    // Observer.create({
    //   type: "touch",
    //   // start: 0,
    //   // trigger: 'video-matching',
    //   // invalidateOnRefresh: true,
    //   // wheelSpeed: -1,
    //   tolerance: 10,
    //   preventDefault: true,
    //   onDrag: () =>  {
    //     if (self.progress === 1 && self.direction > 0 && !self.wrapping) {
    //       wrapForward(self);
    //       console.log('wrapping forward')
    //     } else if (self.progress < 1e-5 && self.direction < 0 && !self.wrapping) {
    //       wrapBackward(self);
    //       console.log('wrapping backward')
    //     } else {
    //       scrub.vars.totalTime = snap((iteration + self.progress) * seamlessLoop.duration());
    //       scrub.invalidate().restart(); // to improve performance, we just invalidate and restart the same tween.
    //       self.wrapping = false;
    //     }
    // },
    //   onDragEnd: () =>  {
    //     scrub.vars.totalTime = snap((iteration + self.progress) * seamlessLoop.duration());
    //       scrub.invalidate().restart(); // to improve performance, we just invalidate and restart the same tween.
    //       self.wrapping = false;
    //   },
    //   // tolerance: 10,
    //   // preventDefault: true
    // });
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
// 		iteration = 10;
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
//   trigger.wrapping = true;
// }

// function buildSeamlessLoop(items, spacing) {

// 	let overlap = Math.ceil(1 / spacing), //  accommodate the seamless looping
// 		startTime = items.length * spacing + 0.5, // the time on the rawSequence at which we'll start the seamless loop
// 		loopTime = (items.length + overlap) * spacing + 1, // the spot at the end where we loop back to the startTime 
// 		rawSequence = gsap.timeline({paused: true}), // this is where all the "real" animations live
// 		seamlessLoop = gsap.timeline({ // this merely scrubs the playhead of the rawSequence so that it appears to seamlessly loop
// 			paused: true,
// 			repeat: -1, // to accommodate infinite scrolling/looping
// 			onRepeat() { // may be overkill
// 				this._time === this._dur && (this._tTime += this._dur - 0.01);
// 			}
// 		}),
// 		l = items.length + overlap * 2,
// 		time = 0,
// 		i, index, item;

//   // set initial state of items
//   gsap.set(items, {
//     xPercent: 'auto', 
//     opacity:1,  
//     marginRight: 0,
//     marginLeft: 0,
//     paddingLeft:'10%', 
//     paddingRight: '10%',
//   });

//   for (i = 0; i < l; i++) { 
//     index = i % items.length;
//     item = items[index];
//     time = i * spacing;
//     rawSequence
  
//     .fromTo(item, {
//       opacity: 1}, 
//       {  
//       opacity: 1, 
//       zIndex: 100, 
//       duration: 1, 
//       yoyo: true, repeat: 1, ease: "power1.in", immediateRender: true}, time)
//     .fromTo(item, {
//       xPercent: 420
//     }, {
//       xPercent: -420, 
//       duration: 1, ease: "none", immediateRender:true}, time);
//     i <= items.length && seamlessLoop.add("label" + i, time); // we don't really need these, but if you wanted to jump to key spots using labels, here ya go.
//   }

//   function toIndex(index, vars) {
//     vars = vars || {};
//     Math.abs(index - curIndex) > length / 2 &&
//       (index += index > curIndex ? -length : length); // always go in the shortest direction
//     let newIndex = gsap.utils.wrap(0, length, index),
//       time = times[newIndex];
//     if (time > tl.time() !== index > curIndex) {
//       // if we're wrapping the timeline's playhead, make the proper adjustments
//       vars.modifiers = { time: gsap.utils.wrap(0, tl.duration()) };
//       time += tl.duration() * (index > curIndex ? 1 : -1);
//     }
//     curIndex = newIndex;
//     vars.overwrite = true;
//     return tl.tweenTo(time, vars);
//   }
//   tl.next = (vars) => toIndex(curIndex + 1, vars);
//   tl.previous = (vars) => toIndex(curIndex - 1, vars);
//   tl.current = () => curIndex;
//   tl.toIndex = (index, vars) => toIndex(index, vars);
//   tl.times = times;
//   tl.progress(1, true).progress(0, true); // pre-render for performance
//   if (config.reversed) {
//     tl.vars.onReverseComplete();
//     tl.reverse();
//   }
//   return tl;
// }
// gsap.timeline({}) //overkill prob

// .addLabel('start', startTime)  //overkill prob
// 	// set up the scrubbing of the playhead to make it appear seamless. 
// 	rawSequence.time(startTime);
//   // rawSequence.addLabel("time", time);
//   seamlessLoop.addLabel("start", time);
// 	seamlessLoop.to(rawSequence, {
// 		time: loopTime,
// 		duration: loopTime - startTime,
// 		ease: "none",
// 	}).fromTo(rawSequence, {time: overlap * spacing + 1}, {
// 		time: startTime,
// 		duration: startTime - (overlap * spacing + 1),
// 		immediateRender: false,
// 		ease: "none"
// 	});
// 	return seamlessLoop;
// }

function setupVideos() {
  const videos = document.querySelectorAll('.slider-video');
  let currentVideo: HTMLVideoElement | null = null;
  //this is to avoid null throws on video only for mobile
  let clicked = false;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const video = entry.target as HTMLVideoElement;
        if (entry.isIntersecting) {
          currentVideo = video;
          // play promise so goog and ff dont throw an error
          var playPromise = video.play();

          if (playPromise !== undefined) {
            playPromise.then(_ => {
              // Automatic playback started!
              document.addEventListener("click", function(event) {
                clicked = true;
                // video.autoplay = true;
                // video.controls = true // Show controls
                // video.muted = false; // Unmute the video
                video.setAttribute('aria-pressed', 'true');
              }
                
              )
              video.play();
            })
            .catch(error => {
              // Auto-play was prevented
              video.pause();
            });
          }
              // Show playing UI.
          video.play();
          // video.autoplay = true;
          video.controls = true // Show controls
          video.muted = false; // Unmute the video
          playXMarkForVideo(video);
          let xclick = video.parentElement?.querySelector(".xmark--atag") as HTMLElement | null;
          if (xclick) {
            xclick.addEventListener("touchstart", function(event) {
              window.location.href = '/';
            });
            xclick.addEventListener("click", function(event) {
              window.location.href = '/';
            });
          }
  } 
  else {
    //do nothing, will dispatch this with observe boi
    video.pause();
    video.controls = false;
    video.autoplay = false;
    video.muted = true;
    video.loop = false;
    // Optionally, stop observing the element
    // observer.unobserve(entry.target);
    // thumbtextTl.pause();
  }
});
}, { 
  // root: null, // observing relative to viewport
  // rootMargin: "0px",
  threshold: [0.5, 1], // observe between 0.5 and 1 threshold
 });
//  currentVideo.forEach((entry) => {
//      // Add space bar event listener
//      document.addEventListener('keydown', (event) => {
//       if (event.code === 'Space' && currentVideo) {
//         event.preventDefault(); // Prevent scrolling
//         console.log(currentVideo);
//         if (currentVideo.paused) {
//           currentVideo.play();
//           currentVideo.muted = false; // Unmute the video
//           currentVideo.autoplay = true;
//           currentVideo.controls = true; // Show controls
//           currentVideo.setAttribute('aria-pressed', 'true');
//         } else {
//           currentVideo.pause();
//           currentVideo.muted = true;
//           currentVideo.controls = false;
//           currentVideo.autoplay = false;
//           currentVideo.setAttribute('aria-pressed', 'false');
//         }
//       }
//     });
//   }
// }
videos.forEach(video => {
  observer.observe(video as HTMLVideoElement);
  document.addEventListener('keydown', (event) => {
    if (event.code === 'Space' && currentVideo) {
      event.preventDefault(); // Prevent scrolling
      console.log(currentVideo);
      if (currentVideo.paused) {
        currentVideo.play();
        currentVideo.muted = false; // Unmute the video
        currentVideo.autoplay = true;
        currentVideo.controls = true; // Show controls
        currentVideo.setAttribute('aria-pressed', 'true');
      } else {
        currentVideo.pause();
        currentVideo.muted = true;
        currentVideo.controls = false;
        currentVideo.autoplay = false;
        currentVideo.setAttribute('aria-pressed', 'false');
      }
    }
  });

// play promise so goog and ff dont throw an error

// var playPromise = (video  as HTMLVideoElement).play();

// if (playPromise !== undefined) {
//   playPromise.then(_ => {
//     // Automatic playback started!
//     document.addEventListener("click", function(event) {
//       clicked = true;
//       // currentVideo.autoplay = true;
//       // currentVideo.controls = true // Show controls
//       // currentVideo.muted = false; // Unmute the currentVideo
//       // video.setAttribute('aria-pressed', 'true');
//     }
      
//     )
//     // video.play();
//   })
//   .catch(error => {
//     // Auto-play was prevented
//     // video.pause();
//   });
// }
//   //bind the observe to splide visibility chang event, observe
//   splide.on( "visible", function( e:Event ) {
//     observer.observe(video as HTMLVideoElement);
//   })
//     //bind the hidden visibility of splide to unobserve
//     splide.on( "hidden", function( e:Event ) {
//       observer.unobserve(video as HTMLVideoElement);
//       // video.pause();
//       // video.controls = false;
//       // video.autoplay = false;
//       // video.muted = true;
//       // video.loop = false;

//     })
//   // observer.observe(video as HTMLVideoElement);
// // on the scroll, unobserve
//   splide.on( "scroll", function( e:Event ) {
//     observer.unobserve(video as HTMLVideoElement);
//   })
//   // on the drag, unobserve
//   splide.on( "drag", function(  e:Event) {
//     observer.unobserve(video as HTMLVideoElement);
//   })
//     // when the slider has refreshed, eg after window resize, call de observe back. 
//   splide.on( "refresh", function(  e:Event) {
//     observer.observe(video as HTMLVideoElement);
//   })
});
}


function sliderVerticalCentering() {
  const windowHeight = window.innerHeight;
  const sectionElement = document.querySelector('.section') as HTMLElement;

  if (!sectionElement) {
    console.error('Section element not found');
    return;
  }

  const remainingSpace = windowHeight - sectionElement.offsetHeight;

  const cardsElement = document.querySelector('.cards') as HTMLElement;
  mm.add("(max-width: 412px)", () => {
    if (cardsElement) {
      // cardsElement.style.marginTop = `150px`;
    } else {
      console.error('Cards element not found');
    }

  })

  // if (cardsElement) {
  //   cardsElement.style.marginTop = `${Math.floor(remainingSpace / 2)}px`;

  // } else {
  //   console.error('Cards element not found');
  // }
}
// proj animation transition 
function projectmaskingAnimationTransition() {
  let tl = gsap.timeline();
  tl.to(".maskingintro--element", {
    opacity: 0,
    duration: 1.25,
    ease: "power1.out",
    autoAlpha: 0,
  }, 0)
  .then(() => {
    setTimeout(() => {
      isMaskingAnimationRunning = false;
    }, 500);
  });
}


projectmaskingAnimationTransition();
sliderVerticalCentering();
// window.addEventListener('resize', sliderVerticalCentering);
const onDOMContentLoaded = () => {
  navigation.setupNavigationEvents();
  // console.clear();
  setupVideos();
  adjustXPositionIOS();
};
 

const onResize = () => {
  // var splide     = new Splide();
var Components = splide.Components;

splide.on( 'resized', function() {
  var isOverflow = Components.Layout.isOverflow();
  var list       = Components.Elements.list;
  var lastSlide  = Components.Slides.getAt( splide.length - 1 );

  if ( lastSlide ) {
    // Toggles `justify-content: center`
    list.style.justifyContent = isOverflow ? '' : 'center';

    // Remove the last margin
    if ( ! isOverflow ) {
      lastSlide.slide.style.marginRight = '';
    }
  }
} );
  sliderVerticalCentering();
  splide.refresh();
  splide.mount({ URLHash, Intersection });
  // splide.on( "refresh", function(  e:Event) {
  //   observer.observe(video as HTMLVideoElement);
  // })
}

const onClick = () => {
  // navigation.checkforAnimation()
  // console.log("clicked");

};
// this._isScrolling = !1, this._isStopped = !1, this._isLocked = !1, this._preventNextNativeScrollEvent = !1, this._resetVelocityTimeout = null, this.time = 0, this.userData = {}, this.lastVelocity = 0, this.velocity = 0, this.direction = 0, this.animate = new Animate, this.emitter = new Emitter, this.onPointerDown = (t)=>{
//   1 === t.button && this.reset();
const onScroll = () => {
  // lenis.on('scroll', Splide.STATES.SCROLLING);
  // gsap.ticker.add((time)=>{
  //   lenis.raf(time * 1000)
  // })
  // gsap.ticker.lagSmoothing(0); // adjust for a small jump in the tweening
};
// const onhashchange = () => {
//   handleInitialHash();
// }
function isIOS() {
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
}
function isTrackpadDevice() {
  return (
    ('ontouchstart' in window) ||
    (navigator.maxTouchPoints > 0)
  );
}
if (isTrackpadDevice()) {
  // let isScrolling = false;
  // let scrollTimeout;

  // document.addEventListener('wheel', (e) => {
 
  //   // e.preventDefault();
  //   if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {

  //     const scrollAmount = e.deltaX * 1;

  //     window.scrollBy(0, scrollAmount);

  //     onScroll();

  //     isScrolling = true;

  //     clearTimeout(scrollTimeout!);
  //     scrollTimeout = setTimeout(() => {
  //       isScrolling = false;
  //     }, 150);
  //   }
  // }, { passive: false });
}
function adjustXPositionIOS() {
  if (isIOS()) {
    const xMarks = document.querySelectorAll('.panel-overlay-x');
    xMarks.forEach(x => {
      if (x instanceof HTMLElement) {
        x.style.transform = 'translate(8px, -40px)';
      }
    });
  }
}

function isTouchDevice() {
  return (
    ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) 
    // ||(window.matchMedia("(pointer: coarse)").matches)
  );
}

if (isTouchDevice()) {
  // let startX, startY;
  // let isSwiping = false;

  // // Sensitivity multipliers for X and Y directions
  // const sensitivityX = 1.25; // Adjust this value to change horizontal sensitivity
  // const sensitivityY = 0.77; // Adjust this value to change vertical sensitivity

  // document.addEventListener('touchstart', (e) => {
  //   e.preventDefault(); // Prevent default scrolling
  //   startX = e.touches[0].clientX;
  //   startY = e.touches[0].clientY;
  //   isSwiping = true;
  // }, { passive: false });

  // document.addEventListener('touchmove', (e) => {
  //   if (!isSwiping) return;
  //   e.preventDefault(); // Prevent default scrolling

  //   const currentX = e.touches[0].clientX;
  //   const currentY = e.touches[0].clientY;
  //   const deltaX = (startX - currentX) * sensitivityX;
  //   const deltaY = (startY - currentY) * sensitivityY;
    
  //   // Calculate scroll amount based on both horizontal and vertical movement
  //   const scrollAmountX = deltaX;
  //   const scrollAmountY = deltaY;
    
  //   // Determine the dominant direction
  //   if (Math.abs(scrollAmountX) > Math.abs(scrollAmountY)) {
  //     // Horizontal swipe is dominant
  //     window.scrollBy(0, scrollAmountX);
  //   } else {
  //     // Vertical swipe is dominant
  //     window.scrollBy(0, scrollAmountY);
  //   }
    
  //   startX = currentX;
  //   startY = currentY;
    
  //   if (typeof onScroll === 'function') {
  //     onScroll();
  //   }
  // }, { passive: false });

  // document.addEventListener('touchend', () => {
  //   isSwiping = false;
  // });
}

// eventDispatcher.addEventListener("load", onready);
eventDispatcher.addEventListener("DOMContentLoaded", onDOMContentLoaded);
// eventDispatcher.addEventListener('hashchange', onhashchange);
eventDispatcher.addEventListener("onResize", onResize);
eventDispatcher.addEventListener("click", onClick);
eventDispatcher.addEventListener("scroll", onScroll);

  
