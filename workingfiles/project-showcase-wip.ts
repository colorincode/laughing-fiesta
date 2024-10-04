


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
  
//   const preloaderTl = gsap.timeline({
//     defaults: { ease: "ease-out-quart", delay: .5 }
// });
// preloaderTl
// .fromTo(".loaded", 
//   { yPercent: 0, autoAlpha: 0, duration: 2.6, ease: "custom" }, 



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

// videos.forEach(video => {
  
//   videoObserver.observe(video as HTMLVideoElement);
//   // thumbtextTl.play();


// });
let select = (e) => document.querySelector(e);
let selectAll = (e) => document.querySelectorAll(e);


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
function setupHorizontalScroll() {
  //horizontal scroll thing
  const tracks = selectAll(".sticky-element");
  tracks.forEach((track, i) => {
  let trackWrapper = track.querySelectorAll(".track");
  let trackFlex = track.querySelectorAll(".track-flex");
  let allImgs = track.querySelectorAll(".slider-video");
  let progress = track.querySelectorAll(".progress--bar-total");
  let sliders = gsap.utils.toArray(".panel-wide");
  let thumbs = gsap.utils.toArray(".thumbs");
  let visible = gsap.utils.toArray(".visible");

  let trackWrapperWidth = () => {
    let width = 0;
    trackWrapper.forEach((el) => (width += el.offsetWidth));
    return width;
  };

  let trackFlexWidth = () => {
    let width = 0;
    trackFlex.forEach((el) => (width += el.offsetWidth));
    return width;
  };
//defaults and scroll tweener
  ScrollTrigger.defaults({});
    const scrollTween = gsap.to(trackWrapper, {
      x: () => -trackWrapperWidth() + window.innerWidth,
      scrollTrigger: {
        trigger: track,
        // pin: true,
        anticipatePin: 1,
        scrub: 1,
        start: "center center",
        pinSpacing:false,
        // markers: true,
        onEnter: () => {
          console.log("scrolltrigger has entered");
        },
        onLeave: () => {
          track.style.setProperty("--velocity", 0);
        },
        end: () => "+=" + (track.scrollWidth - window.innerWidth),
        onRefresh: (self) => self.getTween().resetTo("totalProgress", 0),
        invalidateOnRefresh: true,
      },
    });

  gsap.defaults({
    ease: "power4.easeInOut",

  });
  sliders.forEach((slider, i) => {
   

  
    let anim = gsap.timeline({
      scrollTrigger: {
        trigger: slider,
        containerAnimation: scrollTween,
        start: "left right",
        end: "right right",
        scrub: true,
      }
    }).to(visible, {
      width: "100%",
      backgroundColor: "#000000",
      ease: "power4.in"
    });
  });

  sliders.forEach((slider, i) => {
    if (thumbText[i]) {
     slider = gsap.timeline({
        scrollTrigger: {
          trigger: trackWrapper,
          containerAnimation: scrollTween,
          start: "right right",
          end: () => "+=" + (trackWrapperWidth() - window.innerWidth),
          scrub: true
        }
      });
    
    }

  });

  const tracks = selectAll(".sticky-element");

});
  const totalWidth = (panels as HTMLElement[]).reduce((acc, panel) => acc + panel.offsetWidth, 0);
  const computedWidth = totalWidth / (panels as HTMLElement[]).length;

  // panels.forEach((panel) => {
  //    gsap.to(panels, {
  //   x: () => "-45vw",
  //   ease: "none",
  //   scrollTrigger: {
  //     trigger: track,
  //     // pin: true,
  //     scrub: 1,
  //     end: () => "+=" + computedWidth,
  //     // end: () => {innerWrappers.forEach((wrapper) => {
  //     //   getComputedStyle(wrapper, "").getPropertyValue("")
  //     // })}
  //     invalidateOnRefresh: true
  //   }
  // });
  // })
  gsap.to(panels, {
    x: () => `-${totalWidth - window.innerWidth}`,
    ease: "none",
    scrollTrigger: {
      trigger: track,
      // pin: true,
      scrub: 1,
      end: () => `+=${totalWidth}`,
      invalidateOnRefresh: true
    }
  });
  // gsap.to(panels, {
  //   x: () => -totalWidth + window.innerWidth,
  //   ease: "none",
  //   scrollTrigger: {
  //     trigger: track,
  //     pin: true,
  //     scrub: 1,
  //     end: () => "+=" + totalWidth,
  //     invalidateOnRefresh: true
  //   }
  // });
}

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
          // Add space bar event listener
          document.addEventListener('keydown', (event) => {
            if (event.code === 'Space' && video) {
              event.preventDefault(); // Prevent scrolling
              if (video.paused) {
                video.play();
              } else {
                video.pause();
              }
            }
          });
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
    setupHorizontalScroll();
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
 