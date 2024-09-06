
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
import {EventDispatcher} from "./shared/eventdispatch";
import {Navigation} from "./shared/nav";
import { Canvas } from './Canvas'

const navigation = new Navigation();
const eventDispatcher = new EventDispatcher();
gsap.registerPlugin(EasePack, Tween, SteppedEase, Timeline, Power4, Flip, Draggable, ScrollTrigger, Observer, ScrollToPlugin);
let animating: boolean;
let currentIndex = 0;

// const canvasElement = document.querySelector<HTMLCanvasElement>('.webgl-canvas');
// if (canvasElement) {
//   const canvas = new Canvas(canvasElement);
//   window.addEventListener('beforeunload', () => {
//     canvas.dispose();
//   });
// }
// this is the panel overlay text - which probably needs to move in with flip or something so it acts right.
// or possibly just called in global scope
let thumbText = gsap.utils.toArray(".panel-overlay-text");
let thumbtextTl = gsap.timeline(); //create the timeline
thumbtextTl.fromTo(thumbText, 
  { duration: 1.75, opacity: 1, ease: "power4.inOut", stagger:0.525 }, 
  { duration: 1.75, opacity: 0 , ease: "power4.inOut", stagger:0.525, delay:0.525
 },
 
);
let imagePlacementArray: any[] = [];

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

const hash = window.location.hash.substring(1);
const videoArray = gsap.utils.toArray('.slider-video') as HTMLElement[];
let videoWrap = gsap.utils.selector('#masterWrap'); //find videos only on master wrap
let videoHashElems = videoWrap(`[data-hashnav="#${hash}"]`); 
let { iteration, seamlessLoop, scrub, trigger, spacing } = seamlessLoopScroll();

function  seamlessLoopScroll() {
  // reconstructVideo(hash);
  // ScrollTrigger.defaults({markers: {startColor: "white", endColor: "white"}});
  let iteration = 0; // gets iterated when we scroll all the way to the end or start and wraps around 
  const spacing = 0.1, // (stagger)
    snap = gsap.utils.snap(spacing), // we'll use this to snap the playhead on the seamlessLoop
    cards = gsap.utils.toArray('.cards li'), 
    seamlessLoop = buildSeamlessLoop(cards, spacing), 
    scrub = gsap.to(seamlessLoop, {
      totalTime: 0,
      duration: 0.5,
      ease: "power3",
      paused: true
    }), 
    trigger = ScrollTrigger.create({
      start: 0,
      // trigger: 'video-matching',
      invalidateOnRefresh: true,
      // pinSpacing: false,
      // markers: {startColor: "white", endColor: "white", fontSize: "18px", fontWeight: "bold", indent: 20},
      onEnter: () => {
        console.log("scrolltrigger entered");
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
    },
      end: "+=3000",
      pin: ".gallery"
    });

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
			onRepeat() { // may be overkill
				this._time === this._dur && (this._tTime += this._dur - 0.01);
			}
		}),
		l = items.length + overlap * 2,
		time = 0,
		i, index, item;

	// set initial state of items
	// gsap.set(items, {xPercent: 0, opacity: 0,	scale: 0});

	for (i = 0; i < l; i++) {
		index = i % items.length;
		item = items[index];
		time = i * spacing;
		rawSequence
    .fromTo(item, {scale: 0, opacity: 0}, {scale: 1, opacity: 1, zIndex: 100, duration: 0.5, yoyo: true, repeat: 1, ease: "power1.in", immediateRender: true}, time)
		.fromTo(item, {xPercent: 400}, {xPercent: -400, duration: 1, ease: "none", immediateRender:true}, time);
		i <= items.length && seamlessLoop.add("label" + i, time); // we don't really need these, but if you wanted to jump to key spots using labels, here ya go.
	}
gsap.timeline({}) //overkill prob
.addLabel('start', startTime)  //overkill prob
	// set up the scrubbing of the playhead to make it appear seamless. 
	rawSequence.time(startTime);
  // rawSequence.addLabel("time", time);
  seamlessLoop.addLabel("start", time);
	seamlessLoop.to(rawSequence, {
		time: loopTime,
		duration: loopTime - startTime,
		ease: "none",
	}).fromTo(rawSequence, {time: overlap * spacing + 1}, {
		time: startTime,
		duration: startTime - (overlap * spacing + 1),
		immediateRender: false,
		ease: "none"
	});
	return seamlessLoop;
}

// this is where I swap the hash video and the currently playing video
function scrollToVideo(hash) {
  const video = document.querySelector(`[data-hashnav="${hash}"]`);
  if (video) {
    const container = video.closest('.cards');
    const scrollPosition = video.offsetTop - container.offsetTop;
    
    gsap.to(container, {
      scrollTo: {y: scrollPosition, autoKill: false},
      duration: 1,
      ease: "power2.inOut",
      
      onComplete: () => {
        ScrollTrigger.refresh();
      }
    });
  }
}
function reconstructVideo(hash) {
  let videos = gsap.utils.toArray('.slider-video');
  let videoMatchingBrowserHash = videos.find(video => video.dataset.hashnav === hash);
  let listItems = gsap.utils.toArray('.cards li');
  if (videoMatchingBrowserHash) {
    const state = Flip.getState(videos);
    // const state = Flip.getState(listItems);
    videos.splice(videos.indexOf(videoMatchingBrowserHash), 1);
    videos.unshift(videoMatchingBrowserHash);
    const container = document.querySelector('.cards li');
    container.innerHTML = '';
    videos.forEach(video => 

      container.appendChild(video)
     
    );
    Flip.from(state, {
      absolute: true,
      ease: "power1.inOut",
      onComplete: () => {
        seamlessLoop = buildSeamlessLoop(videos, spacing);
        scrub = gsap.to(seamlessLoop, {
          totalTime: 0,
          duration: 0.5,
          ease: "power3",
          paused: true
        });
        ScrollTrigger.refresh();
      }
    });
  }
}
//  this is where I get the browser window hash
function handleInitialHash() {
  if (window.location.hash) {
    const hash = window.location.hash;
    reconstructVideo(hash);
    
    // Wait for the DOM to update before scrolling
    setTimeout(() => {
      scrollToVideo(hash);
    }, 100);
  }
}

// this is where I get the currently playing video

 function setupVideos() {
let videos = gsap.utils.toArray('.slider-video') as HTMLVideoElement[];
videos.forEach((video) => {
  const hashNav = video.dataset.hashnav;
  const currentVideo = video.querySelector('.video-matching') as HTMLVideoElement;
  const targetVideo = video.querySelector(`[data-hashnav="#${hash}"]`) as HTMLElement;
  const state = Flip.getState(targetVideo);
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        video.play();
        thumbtextTl.restart();
        thumbtextTl.play();
        
      } else {
        video.pause();
        thumbtextTl.pause();
        video.classList.remove('active');
      }
    });
  }, { threshold: 0.5 });

  observer.observe(video);
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
    if (cardsElement) {
      cardsElement.style.marginTop = `${Math.floor(remainingSpace / 2)}px`;
    } else {
      console.error('Cards element not found');
    }
  }
  window.addEventListener('load', sliderVerticalCentering);
  window.addEventListener('resize', sliderVerticalCentering);

  // Event listeners

  let isMaskingAnimationRunning = true; // flag to not allow multiple animations to pile up
  
  function projectmaskingAnimationTransition() {
    let tl = gsap.timeline();
    tl.to(".maskingintro--element", {
      opacity: 0,
      duration: 1.25,
      ease: "power1.out",
    }, 0)
    .then(() => {
      setTimeout(() => {
        isMaskingAnimationRunning = false;
      }, 500);
    });
  }
  
  const onDOMContentLoaded = () => {
    navigation.setupNavigationEvents();
    projectmaskingAnimationTransition();
    setupVideos();
    setTimeout(() => {
      handleInitialHash();
    }, 2000);
  };
  
  const onClick = () => {
    navigation.checkforAnimation();
    console.log("clicked");
  };
  
  const onScroll = () => {
    gsap.ticker.lagSmoothing(0); // adjust for a small jump in the tweening
  };
  const onhashchange = () => {
    window.location.hash = hash;
  }

  eventDispatcher.addEventListener("DOMContentLoaded", onDOMContentLoaded);
  eventDispatcher.addEventListener("click", onClick);
  eventDispatcher.addEventListener("scroll", onScroll);
  eventDispatcher.addEventListener('hashchange', onhashchange);
  


