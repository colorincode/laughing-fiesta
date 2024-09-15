import gsap from 'gsap';
import SteppedEase from 'gsap/EasePack';
import { Flip } from 'gsap/Flip';
import Draggable from 'gsap/Draggable';
import ScrollTrigger from 'gsap/ScrollTrigger';
import ScrollToPlugin from 'gsap/ScrollToPlugin';
import EasePack from 'gsap/EasePack';
import { Power4 } from 'gsap';
import Observer from 'gsap/Observer';
import Timeline from 'gsap';
import {EventDispatcher} from './shared/eventdispatch';


gsap.registerPlugin(EasePack);
gsap.registerPlugin(SteppedEase);
gsap.registerPlugin(Timeline);
gsap.registerPlugin(Power4);
gsap.registerPlugin(Flip);
gsap.registerPlugin(Draggable);
gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(Observer);
gsap.registerPlugin(ScrollToPlugin);


// global constants
const gridElement = document.querySelector('.homegrid__container') as HTMLElement;
const gridItems = gsap.utils.toArray(gridElement.querySelectorAll('.video--figure'));
const gridItemsShuffled = gsap.utils.shuffle(gridItems);
const fullscreenElement = document.querySelector('.fullscreen--scale') as HTMLElement;
// const maskingLayer = document.querySelector('.masking--element') as HTMLElement;
let currentFullscreenVideo: HTMLVideoElement | null = null;
const originalStates = new Map<Element, { parent: Element, index: number, position: {   } }>();
let isFullscreen = false;
const timeline = gsap.timeline();
const eventDispatcher = new EventDispatcher();
let isMaskingAnimationRunning = false;
let mm = gsap.matchMedia();
let maskertonAnim = gsap.timeline({paused:true});
// stagger:{...}


const shadowGrid = document.createElement('div') as HTMLDivElement;
shadowGrid.className = 'shadow-inner-grid';
const companyName = document.createElement('div');
companyName.className = 'company-name';
const playIconAtag = document.createElement('a');
playIconAtag.className = 'play--icon__wrapper';
playIconAtag.setAttribute("title", "Play");
const projectName = document.createElement('div');
projectName.className = 'project-name';


function initShadowGrid() {
  const checkForElement = () => {
    const videoPlacementGrid = document.querySelector('.homegrid__container');
    if (videoPlacementGrid) {
        shadowGrid.style.display = 'none';
        videoPlacementGrid!.appendChild(shadowGrid);
        // console.log('element has been created');
        shadowGrid.appendChild(companyName);
        shadowGrid.appendChild(playIconAtag);
        shadowGrid.appendChild(projectName);
        // console.log('children of shadow grid');
    } else {
        setTimeout(checkForElement, 3000);
    }
  };
  checkForElement();
}

function videoLinksVisible(video: HTMLVideoElement) {


  let projectId = video.getAttribute('data-project');
  let getprojectLink =  video.getAttribute('data-hashnav')?.substring(1);
  let setprojectLink = '/projects.html' + '#' + getprojectLink;
  let companyId = video.getAttribute('data-company');
  // if (!companyId) return;
  //   companyName.innerHTML = `
  //     <div class="company-name-revealed" >${companyId}</div>
  //     `;
  if (!playIconAtag) return;
    playIconAtag.href = setprojectLink;
    playIconAtag.innerHTML = `
      <i class="fa-duotone fa-solid fa-circle-play fa-fw play--icon"></i>
    `;
  // if (!projectId) return;
  //   projectName.innerHTML = `
  //     <div class="project-name-revealed" >${projectId}</div>
  //     `;
    shadowGrid.style.display = "grid";

   
  
}
function maskingAnimationTransition() {
  isMaskingAnimationRunning = true; // flag to not allow multiple animations to pile up

  let maskertonIsAnimating = gsap.isTweening(maskertonAnim);
  let videoWrap = gsap.utils.selector('.fullscreen--scale');
;

  let video = videoWrap('.video--item') ;


  if (maskertonIsAnimating ) {
    // video.

  }

  maskertonAnim.to(".maskingintro--element", {
    yPercent: 100
  })
  .then(() => {
    setTimeout(() => {
      isMaskingAnimationRunning = false;
      // maskertonAnim.restart();
      window.location.href = playIconAtag.href;
    }, 500);
  });
}
// end create the link elements
function hideVideoLinks() {
  shadowGrid.style.display = "none";
  projectName.innerHTML = '';
  companyName.innerHTML = '';
}

function applyFullscreenStyles() {
  gsap.set(fullscreenElement, {
    ease: "none",
    width: '100%',
    height: '100%',
    zIndex: 9999,
    display: "grid",
    placeContent: "center",
    placeItems: "center",
    placeSelf: "center",
    background: "rgba(0,0,0,0.75)",
    visibility: "visible",
    overwrite: true,
    onComplete: () => {
    }
  });
}
function resetFullscreenStyles() {
  gsap.set(fullscreenElement, {
    width: 'auto',
    height: 'auto',
    zIndex: 'unset',
    display: "none",
    background: "none",
    maxWidth: 'none',
    maxHeight: 'none',
    visibility: "hidden",
    overwrite: true,
  });
}

// defaults
const animationDefaults = {  
  ease: 'linear',
};

//cleanup animations
const debouncedCleanup = () => {
  let cleanupDelayedCall: gsap.core.Tween | null = null;
  let isAnimating = false;
  if (cleanupDelayedCall) {
    cleanupDelayedCall.kill();
  }
  cleanupDelayedCall = gsap.delayedCall(3, () => {
    if (!isAnimating) {
      gsap.killTweensOf(self);
      timeline.clear();
      eventDispatcher.dispose();
      console.log("Animation cleanup completed");
    }
  });
};

const saveInitialState = () => {
    gridItems.forEach((item:any, index) => {
      const video = item.querySelector('.video--item') as HTMLVideoElement;
      if (video) {
        const rect = video.getBoundingClientRect();
        originalStates.set(video, { 
          parent: item.parentElement!,
          index,
          position: {  
          }, 
        });
        //  make videos play even when no fullscreen is active
        if (!currentFullscreenVideo) {
            playFullscreenVideo();
        }
      }
    });
  };

// pause all videos except the one in fullscreen, needsfix
// const pauseOtherVideos = () => {
//     const video = document.querySelector('.video--item') as HTMLVideoElement;
//     // fint the parent selector of vidya
//     const VideoParent = video.closest('.fullscreen--scale') as HTMLElement;
//     // If the video is not in the same parent as the clicked video, pause it
//      if (!VideoParent) {
//         video.pause();
//       }
//   };
  
// Play the fullscreen video
const playFullscreenVideo = () => {
  const video = document.querySelector('.video--item') as HTMLVideoElement;
  //   if (video.paused) {
  //     video.play();
  //   }
    const VideoParent = video.closest('.fullscreen--scale') as HTMLElement;
    // If the video is not in the same parent as the clicked video, pause it
     if (!VideoParent) {
        video.pause();
      }
      else {
        video.play();
      }

  };
  // Flip video to fullscreen
const flipVideo = (video: HTMLVideoElement) => {
    const { parent, position } = originalStates.get(video) || { parent: null, position: null };
    if (!parent || !position) return; // Ensure parent and position are valid
    if (currentFullscreenVideo && currentFullscreenVideo !== video) {
      returnToOriginalPosition(video);
    }
    videoLinksVisible(video);
    applyFullscreenStyles();
    playFullscreenVideo ();
    const state = Flip.getState(video, { props: 'class' });
    gsap.set(parent, { zIndex: 1 });
    // gsap.set(position, { zIndex: 1 });
      let videoFigure = document.querySelector('.video--figure') as HTMLElement;
      if (fullscreenElement.contains(video)) {
        // pauseOtherVideos();
    
        videoFigure.appendChild(video);
        parent.appendChild(video);
    } else {
      parent.appendChild(video);
      fullscreenElement.appendChild(video);
    }
      // modify video attributes when in fullscreen
      video.controls = false; // Show controls
      video.muted = true; // mute the video
  
      // playFullscreenVideo ();
      gsap.set(video, {height: "auto", width: "70vw", autoAlpha:1});
         //mq to fix iphone alignment, cant tell if working 
      mm.add("(max-width: 1068px)", () => {
            gsap.set(video, {height: "auto", width: "95vw", autoAlpha:1}); 
          });
    Flip.from(state, {
      ...animationDefaults,
      duration:0.6,
      onStart: () => {
         
          applyFullscreenStyles() ;
      },
      onComplete: () => {
        currentFullscreenVideo = fullscreenElement.contains(video) ? video : null;
      },
      cleanup: () => {
        debouncedCleanup();
        eventDispatcher.dispose();
      },
    });
  };
  // Return video to original position
  const returnToOriginalPosition = (video: HTMLVideoElement) => {
    let videoFigure = document.querySelector('.video--figure') as HTMLElement;
    const { parent, position } = originalStates.get(video) || { parent: null, position: null,  };
    if (!parent || !position) return; // Ensure parent and position are valid
  // console.log(parent, position);
    if (fullscreenElement.contains(video)) {
      const state = Flip.getState(video, { props: 'position' });
      fullscreenElement.removeChild(video);
      parent.appendChild(video);
      hideVideoLinks();
      // revert video attributes
      video.controls = false; // Hide controls
      video.muted = true; // Mute the video
      video.playbackRate = 1; // Reset playback rate to normal speed
      // this is a fix to orphaned elements after a flip is performed, 
      // if this is not present, items will intermittenly "disappear" like a vacuum. 
      // the appendation is to clean up what flip is doing once done, remove orphaned figure tags from full screen bc it will keep appending. 
      const originalFigure = parent.querySelector('.video--figure') as HTMLElement;
      const orphanedFigures = fullscreenElement.querySelectorAll('figure');

      orphanedFigures.forEach(figure => figure.remove());
      // if the original figure exists, append the video to it
      if (originalFigure) {
        originalFigure.appendChild(video);
      } else {
        // if there is no OG figure tag (i.e. animation has run), append directly to the parent
        parent.appendChild(video);
      }
  
 // attempt at fitting based on anim. does fix positioning, but the offset may not be worth perf
    Flip.fit(video, parent, {
      // position: "relative",
      width: "inherit", //resetting to match figure tag
      height: "fit-content", //resetting to match figure tag
      inset: "unset", //resetting to match figure tag
    });
      orphanedFigures.forEach(figure => figure.remove());
      // if the original figure exists, append the video to it
      if (originalFigure) {
        originalFigure.appendChild(video);
      } else {
        // if there is no OG figure tag (i.e. animation has run), append directly to the parent
        parent.appendChild(video);
      }
     
      Flip.from(state, {
        ...animationDefaults,
        // duration:0.6,
        onComplete: () => {
          gsap.set(parent, { zIndex: 'unset'});
          gsap.set(fullscreenElement, {zIndex: 'unset', background: "none", visibility: "hidden"});
          // Resume playback of other videos
          gridItems.forEach((item: HTMLElement) => {
            const video = item.querySelector('.video--item') as HTMLVideoElement;
            if (video && video !== currentFullscreenVideo && video.paused) {
              video.play().catch(error => {
                console.error('Error attempting to play video:', error);
              });
            }
          });
        },
        cleanup: () => {
          debouncedCleanup();
          eventDispatcher.dispose();
          // resetFullscreenStyles();
        },
      });
    }
  };


let videoEventListeners = new EventDispatcher();
const controller = new AbortController();
// toggle event
const toggleVideo = (event: Event | CustomEvent) => {
  let video: HTMLVideoElement | null = null;

  if (event instanceof CustomEvent && event.detail && event.detail.video) {
    video = event.detail.video;
  } else if (event instanceof Event && event.currentTarget instanceof HTMLVideoElement) {
    video = event.currentTarget;
  } else if (event.target instanceof HTMLVideoElement) {
    video = event.target;
  }

  if (!video) {
    console.error('Invalid event or video element');
    return;
  }

  flipVideo(video);
  if (currentFullscreenVideo && currentFullscreenVideo !== video) {
    returnToOriginalPosition(currentFullscreenVideo);
    resetFullscreenStyles();
  }
};

function setupUnifiedEventHandler(video: HTMLVideoElement, eventDispatcher: EventDispatcher) {
  Observer.create({
    target: video,
    type: "pointer,touch,mouse",
    onClick: (self) => handleEvent(self, "click", eventDispatcher),
    onDrag: (self) => handleEvent(self, "drag", eventDispatcher),
    onPress: (self) => handleEvent(self, "press", eventDispatcher),
    onRelease: (self) => handleEvent(self, "release", eventDispatcher),
    onChange: (self) => handleEvent(self, "change", eventDispatcher),
    onStop: (self) => handleEvent(self,"stop", eventDispatcher),
    tolerance: 10,
    preventDefault: false 
  });
}

function handleEvent(self: any, eventType: string,  eventDispatcher: EventDispatcher) {
  const event = new CustomEvent(eventType, {
    detail: {
      originalEvent: self.event,
    }
  });
  document.dispatchEvent(event);
}

function handlePlayIconClick() {
  console.log("play icon click fired");
  const playIcon = document.querySelector('.play--icon');
  if (playIcon) {
    playIconAtag.addEventListener("click", () => {
      console.log("play icon click fired");
    
      maskertonAnim.play();
      maskingAnimationTransition();
      let e = new PointerEvent("click", {})
      e.preventDefault();
      // e.stopImmediatePropagation();
    })
  }
  else {
    maskertonAnim.reverse();
  }
}
const addVideoClickListeners = () => {
  const videos = document.querySelectorAll('.video--item:not(.hidden--video)');
  videos.forEach((video) => {
    video.addEventListener('click', handleVideoClick);
    video.addEventListener('click', toggleVideo);
    handlePlayIconClick();
  });
}
const handleVideoClick = (e) => {
  const video = e.currentTarget as HTMLVideoElement;
  if (video) {
      setupUnifiedEventHandler(video, new EventDispatcher);

          Observer.create({
            target: video,
            type: "pointer,touch,mouse",
            onClick: (event) => {
              toggleVideo({
                target: video,
                currentTarget: video,
                type: 'click'
              } as unknown as Event);
            },
            onStop: (self) => {
              videoObserverKill();
            },
            preventDefault: false
          });
   
        }
}

// clean up events. 
function videoObserverKill() {
  const video = document.querySelectorAll('.video--item');
  const filteredVideos = Array.from(video).filter(video => !video.classList.contains('hidden--video'));
  filteredVideos.forEach((video) => {
    if (video && (video as any).eventDispatcher) {
      // disable the observers, wont use kill just yet in case there are more click evs
      Observer.getAll().forEach(o => o.disable()); 
      // clear eventdispatcher
      videoEventListeners.dispose();

    }
  });
}

const onDOMContentLoaded = () => {
  initShadowGrid();
  saveInitialState(); // Save the initial state of videos
  addVideoClickListeners();
  document.addEventListener('click', onClick);
};

const onResize = () => {

}


const onClick = (e: Event) => {
  if (currentFullscreenVideo && !fullscreenElement.contains(e.target as Node)) {
    returnToOriginalPosition(currentFullscreenVideo);
}
}
// send off the dispatchers, these shouldn't need editing just edit funcs above. 
document.addEventListener("click", onClick);
eventDispatcher.addEventListener("DOMContentLoaded", onDOMContentLoaded);

//exported funcs
export function callAfterResize() {
  let dc = gsap.delayedCall(0.2 || 0.2, initEvents).pause(),
  handler = () => {
    dc.restart(true);
    Flip.killFlipsOf(".video--item");
    Observer.getAll().forEach(o => o.kill()); 
    gsap.killTweensOf('.video--item');
    resetFullscreenStyles();
  }
  window.addEventListener("resize", handler);
  return handler; // in case you want to window.removeEventListener() later
}

export const initEvents = () => {

  addVideoClickListeners();

};

