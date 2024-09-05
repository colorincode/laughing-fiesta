


// //import jquery , will need this for build to compile correctly when using jquery
// import * as jquery from 'jquery';
// (window as any).$ = (window as any).jQuery = jquery;

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

// import Lenis from 'lenis';
import {EventDispatcher} from "./shared/eventdispatch";
import {Navigation} from "./shared/nav";
import { Canvas } from './Canvas'
import { time } from 'console';
import { each } from 'jquery';
import _ScrollTrigger from 'gsap/ScrollTrigger';
// import { url } from 'inspector';

const navigation = new Navigation();
const eventDispatcher = new EventDispatcher();
gsap.registerPlugin(EasePack, Tween, SteppedEase, Timeline, Power4, Flip, Draggable, ScrollTrigger, Observer, ScrollToPlugin);

// const sections = gsap.utils.toArray(".sticky-element");
// const images = gsap.utils.toArray(".track").reverse();
// const slideImages = gsap.utils.toArray(".slider-video");
// const outerWrappers = gsap.utils.toArray(".track-flex");
// const innerWrappers = gsap.utils.toArray(".panel-wide");
// const count = document.querySelector(".count");
// const wrap = gsap.utils.wrap(0, sections.length);
// const logo = document.querySelector(".topbar--global");
// const videos = gsap.utils.toArray(document.querySelectorAll('.slider-video')) ;
let animating: boolean;
let currentIndex = 0;

// const canvasElement = document.querySelector<HTMLCanvasElement>('.webgl-canvas');
// if (canvasElement) {
//   const canvas = new Canvas(canvasElement);
//   window.addEventListener('beforeunload', () => {
//     canvas.dispose();
//   });
// }

let thumbText = gsap.utils.toArray(".panel-overlay-text");
let thumbtextTl = gsap.timeline(); //create the timeline
thumbtextTl.fromTo(thumbText, 
  { duration: 1.75, opacity: 1, ease: "power4.inOut", stagger:0.525 }, 
  { duration: 1.75, opacity: 0 , ease: "power4.inOut", stagger:0.525, delay:0.525
 },
 
);
let imagePlacementArray: any[] = [];

function mrScopertonShufflerton() {

  function processImages() {
    const wrappers = document.querySelectorAll('.proj--image--wrapper--div');
    // const filteredFigures = Array.from(figures).filter(figure => !figure.classList.contains('fixed-item'));
    // console.log(filteredFigures.length);
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
    console.log(imagePlacementArray);
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

// let isMaskingAnimationRunning = true; // flag to not allow multiple animations to pile up
// function projectmaskingAnimationTransition() {
//   // isMaskingAnimationRunning = true; 

//   let tl = gsap.timeline();

//   tl.to(".maskingintro--element ", {
//     opacity: 0,
//     duration: 1.25,
//     ease: "power1.out",
//   }, 0) // animation starts at beginning of timeline
//   .then(() => {
//     setTimeout(() => {
//       isMaskingAnimationRunning = false;
//     }, 500);
//   });
// }
  
const hash = window.location.hash.substring(1);
const videoArray = gsap.utils.toArray('.slider-video') as HTMLElement[];
    let videoWrap = gsap.utils.selector('#masterWrap'); //find videos only on master wrap
    let videoHashElems = videoWrap(`[data-hashnav="#${hash}"]`); 
let { iteration, seamlessLoop, scrub, trigger, spacing } = seamlessLoopScroll();

function  seamlessLoopScroll() {
  // ScrollTrigger.defaults({markers: {startColor: "white", endColor: "white"}});
  let iteration = 0; // gets iterated when we scroll all the way to the end or start and wraps around 
  // let sections = gsap.utils.toArray(".panel");
  const spacing = 0.1, // (stagger)
    snap = gsap.utils.snap(spacing), // we'll use this to snap the playhead on the seamlessLoop
    cards = gsap.utils.toArray('.cards li'), seamlessLoop = buildSeamlessLoop(cards, spacing), scrub = gsap.to(seamlessLoop, {
      totalTime: 0,
      duration: 0.5,
      ease: "power3",
      paused: true
    }), 
    trigger = ScrollTrigger.create({
      start: 0,
      // pinSpacing: false,
      // markers: {startColor: "white", endColor: "white", fontSize: "18px", fontWeight: "bold", indent: 20},
      onEnter: () => {
        console.log("scrolltrigger entered")
       
      },
      onUpdate(self) {
        if (self.progress === 1 && self.direction > 0 && !self.wrapping) {
          wrapForward(self);
          console.log('wrapping forward')
        } else if (self.progress < 1e-5 && self.direction < 0 && !self.wrapping) {
          wrapBackward(self);
          console.log('wrapping backward')
        } else {
          scrub.vars.totalTime = snap((iteration + self.progress) * seamlessLoop.duration());
          scrub.invalidate().restart(); // to improve performance, we just invalidate and restart the same tween.
          self.wrapping = false;
        }
      // },
      // Determine the current item based on the scroll position
      // let totalTime = scrub.vars.totalTime;
      // let currentLabel = '';
      // for (let i = 0; i <= cards.length; i++) {
      //   let labelTime = seamlessLoop.labels["label" + i];
      //   if (labelTime !== undefined && totalTime >= labelTime) {
      //     currentLabel = "label" + i;
      //   }
      // }
      // console.log("Current item:", currentLabel);
    },
      end: "+=3000",
      pin: ".gallery"
    });
    // const videoArray = gsap.utils.toArray('.slider-video') as HTMLElement[];
    // let videoWrap = gsap.utils.selector('#masterWrap'); //find videos only on master wrap
    // let videoHashElems = videoWrap(`[data-hashnav="#${hash}"]`); 
    // let currentItem = {

    //   label: "",
    //   element: HTMLElement,
    // };
    
    // function updateCurrentItem() {
    //   let totalTime = scrub.vars.totalTime;
    //   let currentLabel = '';
    //   let currentElement = null;
    
    //   for (let i = 0; i <= cards.length; i++) {
    //     let labelTime = seamlessLoop.labels["label" + i];
    //     if (labelTime !== undefined && totalTime >= labelTime) {
    //       currentLabel = "label" + i;
    //       currentElement = cards[i];
    //     }
    //   }
    
    //   currentItem.label = currentLabel;
    //   currentItem.element = currentElement;
    
    //   console.log("Current item:", currentItem);
    // }
    
    // seamlessLoop.add('label1', 0)
    // seamlessLoop.add("label2", 1)
  return { iteration, seamlessLoop, scrub, trigger, spacing };
}

function wrapForward(trigger) { // when the ScrollTrigger reaches the end, loop back to the beginning
	iteration++;
	trigger.wrapping = true;
	trigger.scroll(trigger.start + 1);
}

function wrapBackward(trigger) { // when the ScrollTrigger reaches the start again, loop back to the end
	iteration--;
	if (iteration < 0) { // to keep the playhead from stopping at the beginning, we jump ahead 10 iterations
		iteration = 9;
		seamlessLoop.totalTime(seamlessLoop.totalTime() + seamlessLoop.duration() * 10);
    scrub.pause(); // otherwise it may update the totalTime right before the trigger updates 
	}
	trigger.wrapping = true;
	trigger.scroll(trigger.end - 1);
}

function scrubTo(totalTime) { // moves the scroll position to the place that corresponds to the totalTime value of the seamlessLoop
	let progress = (totalTime - seamlessLoop.duration() * iteration) / seamlessLoop.duration();
	if (progress > 1) {
		wrapForward(trigger);
	} else if (progress < 0) {
		wrapBackward(trigger);
	} else {
		trigger.scroll(trigger.start + progress * (trigger.end - trigger.start));
	}
}

function buildSeamlessLoop(items, spacing) {
	let overlap = Math.ceil(1 / spacing), //  accommodate the seamless looping
		startTime = items.length * spacing + 0.5, // the time on the rawSequence at which we'll start the seamless loop
		loopTime = (items.length + overlap) * spacing + 1, // the spot at the end where we loop back to the startTime 
		rawSequence = gsap.timeline({paused: true}), // this is where all the "real" animations live
		seamlessLoop = gsap.timeline({ // this merely scrubs the playhead of the rawSequence so that it appears to seamlessly loop
			paused: true,
			repeat: -1, // to accommodate infinite scrolling/looping
			onRepeat() { // works around a super rare edge case bug that's fixed GSAP 3.6.1
				this._time === this._dur && (this._tTime += this._dur - 0.01);
			}
		}),
		l = items.length + overlap * 2,
		time = 0,
		i, index, item;

	// set initial state of items
	// gsap.set(items, {xPercent: 400, opacity: 0,	scale: 0});

	// create all the animations in a staggered fashion. create EXTRA animations at the end 4 seamless looping.
	for (i = 0; i < l; i++) {
		index = i % items.length;
		item = items[index];
		time = i * spacing;
		rawSequence.fromTo(item, {scale: 0, opacity: 0}, {scale: 1, opacity: 1, zIndex: 100, duration: 0.5, yoyo: true, repeat: 1, ease: "power1.in", immediateRender: true}, time)
		           .fromTo(item, {xPercent: 400}, {xPercent: -400, duration: 1, ease: "none", immediateRender: true}, time);
		i <= items.length && seamlessLoop.add("label" + i, time); // we don't really need these, but if you wanted to jump to key spots using labels, here ya go.
// console.log("label" + i, time);
	}
  // let currentItem = "";

  // function updateCurrentItem() {
  //   items.forEach((item, time) => {
  //     if (ScrollTrigger.isInViewport(item, 0.5)) {
  //       currentItem = "label" + item + time;
  //     }
  //   });
  // }
  // ScrollTrigger.addEventListener("scrollEnd", updateCurrentItem);
	// label.
	// set up the scrubbing of the playhead to make it appear seamless. 
	rawSequence.time(startTime);
	seamlessLoop.to(rawSequence, {
		time: loopTime,
		duration: loopTime - startTime,
		ease: "none"
	}).fromTo(rawSequence, {time: overlap * spacing + 1}, {
		time: startTime,
		duration: startTime - (overlap * spacing + 1),
		immediateRender: false,
		ease: "none"
	});
	return seamlessLoop;
}

// function reconstructVideo () {
//   let videos = gsap.utils.toArray('.slider-video') as HTMLVideoElement[];
//   const state = Flip.getState(videos);
//   function swapPosition() {
//     var parent = box.parentElement === container1 ? container2 : container1;
//     parent.appendChild(box);
//   }
//   function flip(elements, changeFunc, vars) {
//     elements = gsap.utils.toArray(elements);
//     vars = vars || {};
//     let tl = gsap.timeline({onComplete: vars.onComplete, delay: vars.delay || 0}),
//         bounds = elements.map(el => el.getBoundingClientRect()),
//         copy = {},
//         p;
//     elements.forEach(el => {
//       el._flip && el._flip.progress(1);
//       el._flip = tl;
//     })
//     changeFunc();
//     for (p in vars) {
//       p !== "onComplete" && p !== "delay" && (copy[p] = vars[p]);
//     }
//     copy.x = (i, element) => "+=" + (bounds[i].left - element.getBoundingClientRect().left);
//     copy.y = (i, element) => "+=" + (bounds[i].top - element.getBoundingClientRect().top);
//     return tl.from(elements, copy);
//   }
// }

 function setupVideos() {
  const videoSources: { [key: string]: string } = {
    '#selfie-by-flip': '../assets/optimized/full/selfie-by-flip-compressed-full.mp4',
    '#food-mood': '../assets/optimized/full/food-mood-compressed-full.mp4',
    '#fold-4-launch': '../assets/optimized/full/galaxy-fold-4-launch-compressed-full.mp4',
    '#coca-cola-y3000': '../assets/optimized/full/y3000-case-film-compressed-full.mp4',
    '#tiny-type': '../assets/optimized/full/samsung-tiny-type-compressed-full.mp4',
   
};

  let videos = gsap.utils.toArray('.slider-video') as HTMLVideoElement[];
    videos.forEach((video) => {
       // Set initial visibility
    // gsap.set(video, { autoAlpha: 0 }); // Start with all videos hidden
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            video.classList.add("playing");
             // Swap the video source based on data-hashnav
             const hashNav = video.dataset.hashnav;
            //  console.log(hashNav);
            // flip([box], swapPosition);
              // const hash = video.getAttribute('data-hashnav')?.replace('#', '') || '';
              // gsap.to(hash, { duration: 1, autoAlpha: 1, ease: 'power2.inOut' });
              console.log(`hash nav matches and Video ${video.dataset.hashnav} is playing `);
             
            
             
            //  else {
            //   console.log("hash nav dont match");
            //  }
          //    if (hashNav && hashNav in videoSources) {
          //     // videos.push(videoSources[hashNav]);
          //     // video.src = videoSources[hashNav];
          // }
            video.play();
            thumbtextTl.restart();
            thumbtextTl.play();
            // console.log(`Video ${video} is playing`);
       
            // console.log(`Video ${video.dataset.hashnav} is playing`);
          } else {
            video.pause();
            thumbtextTl.pause();
            console.log(`Video ${video.dataset.hashnav} is paused`);
          }
        });
      }, { threshold: 0.5 });
  
      observer.observe(video);
    });
  }
  // function swapPlayingVideo () {
  //   const video = document.querySelector('.slider-video') as HTMLVideoElement;
  //   if (!video.isPlaying) {
  //   console.log(`Video ${video} is playing`);
  //   }
  // }
 function scrollToVideo(hash: string) {
    console.log('Attempting to scroll to video with hash:', hash);
    const currentVideo = document.querySelector('.playing') as HTMLElement;
    const targetVideo = document.querySelector(`[data-hashnav="#${hash}"]`) as HTMLElement;
  if (currentVideo && targetVideo) {
    gsap.to(window, {
            scrollTo: { y: videoArray.length }, // Adjust offset as needed
            duration: 1,
            ease: 'power2.inOut'
          });
          
    history.pushState('', `#${hash}`, `#${hash}`);
    ScrollTrigger.refresh();
    // _ScrollTrigger.
  }
    if (targetVideo) {
      history.pushState('', `#${hash}`, `#${hash}`);
      console.log('URL hash updated to:', hash);
    } else {
      console.log('Target video not found for hash:', hash);
    }
  }
  function setupHashNav() {
    const thumbnails = document.querySelectorAll('.thumbtext');
    thumbnails.forEach((thumb) => {
      thumb.addEventListener('click', (e) => {
        e.preventDefault();
        const target = e.currentTarget as HTMLAnchorElement;
        const hash = target.getAttribute('href')?.replace('#', '') || '';
        
      });
    });
  }
  
  function handleInitialHash() {
    if (window.location.hash) {
      const hash = window.location.hash.replace('#', '');
      setupHashNav ();
      scrollToVideo(hash);
    }
  }
    // const slider = new SeamlessSlider('.gallery');
  
  // Event listeners
  function initScrollFunctionality() {
    // const slider = new SeamlessSlider('.gallery');
  
    // Call any other scroll-related initialization code
  }
  let isMaskingAnimationRunning = true; // flag to not allow multiple animations to pile up
  
  function projectmaskingAnimationTransition() {
    // const slider = new SeamlessSlider('.gallery');
    let tl = gsap.timeline();
  
    tl.to(".maskingintro--element", {
      opacity: 0,
      duration: 1.25,
      ease: "power1.out",
    }, 0)
    .then(() => {
      setTimeout(() => {
        isMaskingAnimationRunning = false;
        initScrollFunctionality(); // Call the scroll initialization function here
        // if (window.location.hash) {
        //   const hash = window.location.hash.substring(1);
        //   slider.scrollToVideo(hash);
        // }
      }, 500);
    });
  }
  
  const onDOMContentLoaded = () => {
  console.clear();
    navigation.setupNavigationEvents();
    projectmaskingAnimationTransition();
    setupVideos();
    // Remove the direct initialization of SeamlessSlider from here
  };
  
  const onClick = () => {
    navigation.checkforAnimation();
    console.log("clicked");
  };
  
  const onScroll = () => {
    gsap.ticker.lagSmoothing(0); // adjust for a small jump in the tweening
  };
  
  // const eventDispatcher = new EventDispatcher();
  
  // use the dispatcher, this should not need editing
  eventDispatcher.addEventListener("DOMContentLoaded", onDOMContentLoaded);
  eventDispatcher.addEventListener("click", onClick);
  eventDispatcher.addEventListener("scroll", onScroll);
  window.addEventListener('hashchange', onScroll);
  
// class SeamlessSlider {
//   private slider: HTMLElement;
//   private sections: HTMLElement[];
//   private videos: HTMLVideoElement[];
//   private seamlessLoop: gsap.core.Timeline;
//   private spacing: number;
//   private scrub: gsap.core.Tween;
//   // private totalTime = this.scrub.vars.totalTime;
//   private trigger: ScrollTrigger;
//   private iteration: number;
//   // sliderWidth: number;
//   // sectionWidth: number;
  
//   // sliderWidth: number;

//   constructor(sliderSelector: string) {
//     this.slider = document.querySelector('.gallery') as HTMLElement;
//     this.sections = Array.from(this.slider.querySelectorAll('.cards li'));
//     this.videos = Array.from(this.slider.querySelectorAll('.slider-video'));
//     this.spacing = 0.1;
//     this.iteration = 0;

//     this.init();
//     window.addEventListener('resize', this.handleResize.bind(this));
//   }

//   private init() {
//     gsap.registerPlugin(ScrollTrigger);
//     gsap.registerPlugin(Flip);

//     this.setupSeamlessLoop();
//     this.setupVideos();
//     this.setupScrollTrigger();
//     this.setupHashNavigation();
//     this.calculateSizes();
//   }
//   private handleResize() {
//     this.calculateSizes();
//     this.updatePositions();
//     ScrollTrigger.refresh();
//   }

//   private setupSeamlessLoop() {
//     const overlap = Math.ceil(1 / this.spacing);
//     const startTime = this.sections.length * this.spacing + 0.5;
//     const loopTime = (this.sections.length + overlap) * this.spacing + 1;
//     const rawSequence = gsap.timeline({ paused: true });

//     this.seamlessLoop = gsap.timeline({
//       paused: true,
//       repeat: -1,
//       //idk
//       // onRepeat: () => {
//       //   this.seamlessLoop._time === this.seamlessLoop._dur && (this.seamlessLoop._tTime += this.seamlessLoop._dur - 0.01);
//       // },
//     });

//     const l = this.sections.length + overlap * 2;
//     let time = 0;

//     for (let i = 0; i < l; i++) {
//       const index = i % this.sections.length;
//       const section = this.sections[index];
//       time = i * this.spacing;
//       // item = section[index];
//       rawSequence.fromTo(
//        section,
//         { scale: 0, opacity: 0 },
//         {
//           scale: 1,
//           opacity: 1,
//           zIndex: 100,
//           duration: 0.5,
//           yoyo: true,
//           repeat: 1,
//           ease: 'power1.in',
//           immediateRender: true,
//         },
//         time
//       ).fromTo(
//        section,
//         { xPercent: 400 },
//         { xPercent: -400, duration: 1, ease: 'none', immediateRender: true },
//         time
//       );

//       i <= this.sections.length && this.seamlessLoop.add(`label${i}`, time);
//     }

//     rawSequence.time(startTime);
//     this.seamlessLoop.to(rawSequence, {
//       time: loopTime,
//       duration: loopTime - startTime,
//       ease: 'none',
//     }).fromTo(
//       rawSequence,
//       { time: overlap * this.spacing + 1 },
//       {
//         time: startTime,
//         duration: startTime - (overlap * this.spacing + 1),
//         immediateRender: false,
//         ease: 'none',
//       }
//     );
//   }

//   private setupVideos() {
//     this.videos.forEach((video) => {
//       const observer = new IntersectionObserver((entries) => {
//         entries.forEach((entry) => {
//           if (entry.isIntersecting) {
//             video.play();
//             // console.log(`Video ${video} is playing`);
//             console.log(`Video ${video.dataset.hashnav} is playing`);
//           } else {
//             video.pause();
//             console.log(`Video ${video.dataset.hashnav} is paused`);
//           }
//         });
//       }, { threshold: 0.5 });
  
//       observer.observe(video);
//     });
//   }
  
//   // private setupScrollTrigger() {
//   //   const snap = gsap.utils.snap(this.spacing);
//   //   this.scrub = gsap.to(this.seamlessLoop, {
//   //     totalTime: 0,
//   //     duration: 0.5,
//   //     ease: 'power3',
//   //     paused: true,
//   //   });
  
//   //   this.trigger = ScrollTrigger.create({
//   //     trigger: this.slider,
//   //     start: 'top top',
//   //     end: () => `+=${this.sectionWidth}`,
//   //     pin: true,
//   //     pinSpacing: false,
//   //     anticipatePin: 1,
//   //     onUpdate: (self) => {
//   //       // ... (existing code)
//   //     },
//   //     onRefresh: () => {
//   //       this.calculateSizes();
//   //       this.updatePositions();
//   //     },
//   //   });
//   // }
  
//   private setupScrollTrigger() {
//     const snap = gsap.utils.snap(this.spacing);
//     // let maxWidth = 0;

//     // const getMaxWidth = () => {
//     //   maxWidth = 0;
//     //   this.videos.forEach((video, index) => {
//     //     maxWidth += video.width;
//     //     console.log(maxWidth);
//     //   });
//     // };
//     // getMaxWidth();
//     this.scrub = gsap.to(this.seamlessLoop, {
//       totalTime: 0,
//       duration: 0.5,
//       ease: 'power3',
//       paused: true,
//     });
//     // let totalTime = this.scrub.vars.totalTime;
//     // scrubTo(totalTime) { // moves the scroll position to the place that corresponds to the totalTime value of the seamlessLoop
//     //   this.seamlessLoop.totalTime(this.seamlessLoop.totalTime() + this.seamlessLoop.duration() * 10);
//     //   	let progress = (this.totalTime - this.seamlessLoop.duration() * this.iteration) / this.seamlessLoop.duration();
//     //   	if (progress > 1) {
//     //   		this.wrapForward(this.trigger);
//     //   	} else if (progress < 0) {
//     //   		this.wrapBackward(this.trigger);
//     //   	} else {
//     //   		this.trigger.scroll(this.trigger.start + progress * (this.trigger.end - this.trigger.start));
//     //   	}
//     //   }

//     this.trigger = ScrollTrigger.create({
//       start: 0,
//       // end: () => `+=${this.sectionWidth}`,
//       end: '+=3000',
//       pin: "#masterWrap",
//       // pinSpacing: false,
//       //     anticipatePin: 1,
//       // markers: {startColor: "white", endColor: "white", fontSize: "18px", fontWeight: "bold", indent: 20},
//       onUpdate: (self) => {
//         if (self.progress === 1 && self.direction > 0 && !self.wrapping) {
//           this.wrapForward(self);
//         } else if (self.progress < 1e-5 && self.direction < 0 && !self.wrapping) {
//           this.wrapBackward(self);
//         } else {
//           this.scrub.vars.totalTime = snap((this.iteration + self.progress) * this.seamlessLoop.duration());
//           this.scrub.invalidate().restart();
//           self.wrapping = false;
//         }
//       },

//         // onRefresh: () => {
//         //   // Recalculate the width and positioning of elements
//         //   this.calculateSizes();
//         //   this.updatePositions();
//         // },
//       // },
//     });
//   }
//   private calculateSizes() {
//     this.sliderWidth = this.slider.offsetWidth;
//     this.sectionWidth = this.sections.reduce((width, section) => width + section.offsetWidth, 0);
//   }
  
//   private updatePositions() {
//     // gsap.set(this.slider, { width: window.innerWidth, height: window.innerHeight });
//     this.seamlessLoop.progress(this.seamlessLoop.progress());
//   }
//   private setupHashNavigation() {
//     window.addEventListener('hashchange', () => {
//       const hash = window.location.hash.substring(1);
//       this.updateVideoBasedOnHash(hash);
//     });
  
//     const thumbnails = document.querySelectorAll('.thumbtext');
//     thumbnails.forEach((thumb) => {
//       thumb.addEventListener('click', (e) => {
//         e.preventDefault();
//         const target = e.currentTarget as HTMLAnchorElement;
//         const hash = target.getAttribute('href')?.replace('#', '') || '';
//         this.updateVideoBasedOnHash(hash);
//       });
//     });
//   }
  
//   private scrollToSection(index: number) {
//     const progress = index / (this.sections.length - 1);
//     gsap.to(this.seamlessLoop, {
//       progress,
//       duration: 1,
//       ease: 'power1.inOut',
//       // onUpdate: () => {
//       //   ScrollTrigger.refresh();
//       // },
//     });
//   }
//   updateVideoBasedOnHash(currentHash: string) {
//     const hash = window.location.hash.substring(1);
//     if (hash && hash !== currentHash) {
//       const currentVideo = this.slider.querySelector('.slider-video') as HTMLElement;
//       const targetVideo = this.slider.querySelector(`[data-hashnav="#${hash}"]`) as HTMLElement;
  
//       if (targetVideo && targetVideo !== currentVideo) {
//         console.log('Current video:', currentVideo);
//         console.log('Target video:', targetVideo);
  
//         const state = Flip.getState(currentVideo);
  
//         currentVideo.classList.remove('active');
//         targetVideo.classList.add('active');
  
//         Flip.from(state, {
//           duration: 1,
//           ease: 'power1.inOut',
//           onComplete: () => {
//             console.log('Flip animation completed');
//             // ScrollTrigger.refresh();
//           }
//         });
  
//         history.pushState('', `#${hash}`, `#${hash}`);
//         console.log('URL hash updated to:', hash);
//       }
//     }
//   }
//   // private scrollToSection(index: number) {
//   //   const progress = index / (this.sections.length - 1);
//   //   this.seamlessLoop.progress(progress);
//   //   ScrollTrigger.refresh();
//   //   console.log(`Scrolled to section: ${index}`);
//   // }
  
//   // private scrollToVideo(hash: string) {
//   //   const video = this.slider.querySelector(`[data-hashnav="#${hash}"]`) as HTMLElement;
//   //   if (video) {
//   //     const section = video.closest('.cards li') as HTMLElement;
//   //     if (section) {
//   //       const sectionIndex = this.sections.indexOf(section);
//   //       if (sectionIndex !== -1) {
//   //         console.log('Scrolling to section:', sectionIndex);
//   //         this.scrollToSection(sectionIndex);
//   //         history.pushState('', `#${hash}`, `#${hash}`);
//   //         console.log('URL hash updated to:', hash);
//   //       } else {
//   //         console.log('Section not found for video:', hash);
//   //       }
//   //     } else {
//   //       console.log('Section not found for video:', hash);
//   //     }
//   //   } else {
//   //     console.log('Video not found for hash:', hash);
//   //   }
//   // }
//   // scrollToVideo(hash: string) {
//   //   console.log('Attempting to scroll to video with hash:', hash);
//   //   const currentVideo = this.slider.querySelector('.slider-video.active') as HTMLElement;
//   //   const targetVideo = this.slider.querySelector(`[data-hashnav="#${hash}"]`) as HTMLElement;
  
//   //   if (targetVideo) {
//   //     if (currentVideo) {
//   //       const state = Flip.getState(currentVideo);
  
//   //       currentVideo.classList.remove('active');
//   //       targetVideo.classList.add('active');
  
//   //       Flip.from(state, {
//   //         duration: 1,
//   //         ease: 'power1.inOut',
//   //         onComplete: () => {
//   //           console.log('Flip animation completed');
//   //           ScrollTrigger.refresh();
//   //         }
//   //       });
//   //     } else {
//   //       console.log('Current video not found');
//   //       targetVideo.classList.add('active');
//   //     }
  
//   //     history.pushState('', `#${hash}`, `#${hash}`);
//   //     console.log('URL hash updated to:', hash);
//   //   } else {
//   //     console.log('Target video not found for hash:', hash);
//   //   }
//   // }
//   private pauseAllVideos() {
//     this.videos.forEach((video) => video.pause());
//   }

//   private playVideoAtIndex(index: number) {
//     if (index >= 0 && index < this.videos.length) {
//       this.videos[index].play();
//     }
//   }

//   private wrapForward(trigger: ScrollTrigger) {
//     this.iteration++;
//     trigger.wrapping = true;
//     trigger.scroll(trigger.start + 1);
//   }

//   private wrapBackward(trigger: ScrollTrigger) {
//     this.iteration--;
//     if (this.iteration < 0) {
//       this.iteration = 9;
//       this.seamlessLoop.totalTime(this.seamlessLoop.totalTime() + this.seamlessLoop.duration() * 10);
//       this.scrub.pause();
//       trigger.wrapping = true;
//       trigger.scroll(trigger.end - 1);
//     }
//   }
// }


// function scrollToVideo(hash: string) {
//   const video = document.querySelector(`[data-hashnav="#${hash}"]`) as HTMLElement;
//   if (video) {
//     const slider = video.closest('.cards li') as HTMLElement;
//     if (slider) {
//       const sliderIndex = Array.from(slider.parentElement.children).indexOf(slider);
//       const sliders = gsap.utils.toArray('.cards li');

//       // Shuffle the sliders array to bring the hashed video to the first position
//       const shuffledSliders = gsap.utils.shuffle(sliders, );

//       // Animate the shuffled sliders to their new positions
//       gsap.to(shuffledSliders, {
//         duration: 1,
//         ease: 'power1.inOut',
//         x: (index) => (index - sliderIndex) * slider.offsetWidth,
//         onComplete: () => {
//           // Play the video after the animation is complete
//           const videoElement = slider.querySelector('video') as HTMLVideoElement;
//           videoElement.play();
//         },
//       });

//       // Update the URL hash without triggering a scroll
//       history.pushState('', `#${hash}`);
//     }
//   }
// }


