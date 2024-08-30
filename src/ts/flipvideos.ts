import gsap, { SteppedEase} from 'gsap'
import { Flip } from 'gsap/Flip';
import Draggable from 'gsap/Draggable';
import ScrollTrigger from 'gsap/ScrollTrigger';
import ScrollToPlugin from 'gsap/ScrollToPlugin';
import EasePack from 'gsap/EasePack';
import { Power4 } from 'gsap/gsap-core';
import Observer from 'gsap/Observer';
import Timeline from 'gsap/all';
import  Tween  from 'gsap/src/all';
import {EventDispatcher} from './shared/eventdispatch';
// import { relative } from 'path';

gsap.registerPlugin(EasePack);
gsap.registerPlugin(Tween);
gsap.registerPlugin(SteppedEase);
gsap.registerPlugin(Timeline);
gsap.registerPlugin(Power4);
gsap.registerPlugin(Flip);
gsap.registerPlugin(Draggable);
gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(Observer);
gsap.registerPlugin(ScrollToPlugin);


// constants
const gridElement = document.querySelector('.homegrid__container') as HTMLElement;
const gridItems = gsap.utils.toArray(gridElement.querySelectorAll('.video--figure'));
const gridItemsShuffled = gsap.utils.shuffle(gridItems);
const fullscreenElement = document.querySelector('.fullscreen--scale') as HTMLElement;
const maskingLayer = document.querySelector('.masking--element') as HTMLElement;
let currentFullscreenVideo: HTMLVideoElement | null = null;
const originalStates = new Map<Element, { parent: Element, index: number, position: { top: number, left: number, width: number, height: number } }>();
let isFullscreen = false;

const shadowGrid = document.createElement('div') as HTMLDivElement;
shadowGrid.className = 'shadow-inner-grid';
const companyName = document.createElement('div');
companyName.className = 'company-name';
const playIconAtag = document.createElement('a');
playIconAtag.className = 'play--icon__wrapper';
playIconAtag.setAttribute("title", "Play");
const projectName = document.createElement('div');
projectName.className = 'project-name';

function setupUnifiedEventHandler(video: HTMLVideoElement, eventDispatcher: EventDispatcher) {
  Observer.create({
    target: video,
    type: "pointer,touch,mouse",
    onClick: (self) => handleEvent(self, "click", video, eventDispatcher),
    onDrag: (self) => handleEvent(self, "drag", video, eventDispatcher),
    onPress: (self) => handleEvent(self, "press", video, eventDispatcher),
    onRelease: (self) => handleEvent(self, "release", video, eventDispatcher),
    tolerance: 10,
    preventDefault: false 
  });
}

function handleEvent(self: any, eventType: string, video: HTMLVideoElement, eventDispatcher: EventDispatcher) {
  const event = new CustomEvent(eventType, {
    detail: {
      originalEvent: self.event,
      video: video
    }
  });
  document.dispatchEvent(event);
}

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
document.addEventListener('DOMContentLoaded', initShadowGrid);
function videoLinksVisible(video: HTMLVideoElement) {
  // console.log(video);
  // shadowGrid.innerHTML = `<div class="shadow-inner-grid">` + companyName + projectName + `</div>`;
  let projectId = video.getAttribute('data-project');
  let getprojectLink =  video.getAttribute('data-hashnav')?.substring(1) ;
  let setprojectLink = '/projects.html' + '#' + getprojectLink;
  let companyId = video.getAttribute('data-company');
  if (!companyId) return;
    companyName.innerHTML = `
      <div class="company-name-revealed" >${companyId}</div>
      `;
  if (!playIconAtag) return;
    playIconAtag.href = setprojectLink;
    playIconAtag.innerHTML = `
      <i class="fa-duotone fa-solid fa-circle-play fa-fw play--icon" onclick="smoothLinkClick(e)"></i>
    `;
  if (!projectId) return;
    projectName.innerHTML = `
      <div class="project-name-revealed" >${projectId}</div>
      `;
    shadowGrid.style.display = "grid";
}


// end create the link elements
function hideVideoLinks() {
  console.log('Hiding video links');
  shadowGrid.style.display = "none";
  projectName.innerHTML = '';
  companyName.innerHTML = '';
  

}
function applyFullscreenStyles() {
  // let tl = 
  // gsap.fromTo(".fullscreen--scale",{
  //   opacity: 0,
  //   scale: 0,
  //   autoAlpha: 1,
  // },{
  //   opacity: 1,
  //   scale: 1,
  //   autoAlpha: 1,
  // });
  // gsap.fromTo('video--item', {
  //   opacity: 1,
  //   width: '80vw'
  // }, {
  //   width: "",
  //   height: "auto"
  // });
  // tl.add({})
  gsap.set(fullscreenElement, {
    position: 'fixed',
    top: '15%',
    left: '15%',
    right: '15%',
    bottom: '15%',
    width: '100vw',
    height: '100vh',
    zIndex: 9999,
    display: "grid",
    placeContent: "center",
    placeItems: "center",
    placeSelf: "center",
    background: "rgba(0,0,0,0.5)",
    maxWidth: 'unset',
    maxHeight: 'unset',
    visibility: "visible"
  });
  //pause vidya except fullscreener
  pauseOtherVideos(currentFullscreenVideo as HTMLVideoElement);
}
function resetFullscreenStyles() {
  gsap.set(fullscreenElement, {
    position: 'static',
    top: 'auto',
    left: 'auto',
    right: 'auto',
    bottom: 'auto',
    width: 'auto',
    height: 'auto',
    zIndex: 'unset',
    display: "none",
    background: "none",
    maxWidth: 'none',
    maxHeight: 'none',
    visibility: "hidden"
  });
}
// defaults
const animationDefaults = {  ease: 'power4.inOut' };


const saveInitialState = () => {
    gridItems.forEach((item: HTMLElement, index: number) => {
      const video = item.querySelector('.video--item') as HTMLVideoElement;
      if (video) {
        const rect = video.getBoundingClientRect();
        originalStates.set(video, { 
          parent: item.parentElement!,
          index,
          position: { 
            top: rect.top, 
            left: rect.left, 
            width: rect.width, 
            height: rect.height 
          } 
   
        });
        //  video is playing when no fullscreen is active
        if (!currentFullscreenVideo) {
            playFullscreenVideo(video);

        }
      }
    });
  };

// pause all videos except the one in fullscreen
const pauseOtherVideos = (excludeVideo: HTMLVideoElement) => {
    gridItems.forEach((item: HTMLElement) => {
      const video = item.querySelector('.video--item') as HTMLVideoElement;
      if (video && video !== excludeVideo && !video.paused) {
        video.pause();
      }
    });
  };
  
// Play the fullscreen video
const playFullscreenVideo = (video: HTMLVideoElement) => {
    if (video.paused) {
      video.play();
    }
  };
  // Flip video to fullscreen
const flipVideo = (video: HTMLVideoElement) => {
    const { parent, position } = originalStates.get(video) || { parent: null, position: null };
    if (!parent || !position) return; // Ensure parent and position are valid
  console.log(parent, position);
    if (currentFullscreenVideo && currentFullscreenVideo !== video) {
      returnToOriginalPosition(video);
    }
    videoLinksVisible(video);
    applyFullscreenStyles();
    let cleanupDelayedCall: gsap.core.Tween | null = null;
    let isAnimating = false;
    const timeline = gsap.timeline();
    const eventDispatcher = new EventDispatcher();
    const debouncedCleanup = () => {
        if (cleanupDelayedCall) {
          cleanupDelayedCall.kill();
        }
        cleanupDelayedCall = gsap.delayedCall(3, () => {
          if (!isAnimating) {
            gsap.killTweensOf(video);
            timeline.clear();
            eventDispatcher.dispose();
            console.log("Animation cleanup completed");
          }
        });
      };
    const state = Flip.getState(video, { props: 'class' });
  
    gsap.set(parent, { zIndex: 1 });
    // gsap.set(maskingLayer, { zIndex: 0 });
    // gsap.to(maskingLayer, { ...animationDefaults, opacity: 0.85 });
      let videoFigure = document.querySelector('.video--figure') as HTMLElement;
      if (fullscreenElement.contains(video)) {
        //  parent.insertBefore(videoFigure, video).appendChild(video);
        videoFigure.appendChild(video);
        parent.appendChild(video);
    } else {
      parent.appendChild(video);
      fullscreenElement.appendChild(video);
      // parent.appendChild(video);
      // fullscreenElement.appendChild(video);
      // pauseOtherVideos(video); //  other videos
      // playFullscreenVideo(video); //  fullscreen video plays
    }
      // modify video attributes when in fullscreen
      video.controls = false; // Show controls
      video.muted = true; // Unmute the video

    Flip.from(state, {
      ...animationDefaults,
      scale: true,
      onStart: () => {
            // Set video to fullscreen
            gsap.to(video, {height: "auto", width: "80vw",  ease: "sine.in", duration:1.3, autoAlpha:1,}); 
            // set full screen to fancy   
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
    const { parent, position } = originalStates.get(video) || { parent: null, position: null };
    if (!parent || !position) return; // Ensure parent and position are valid
  // console.log(parent, position);
    if (fullscreenElement.contains(video)) {
      const state = Flip.getState(video, { props: 'position' });
      fullscreenElement.removeChild(video);
      // parent.removeChild(videoFigure);
      parent.appendChild(video);

    // trying to use fit method 
    Flip.fit(video, parent, {
      position: "relative",
      width: "100%", //resetting to match figure tag
      height: "fit-content", //resetting to match figure tag
      inset: "unset", //resetting to match figure tag
    });
      // parent.append(videoFigure);
      // parent.appendChild(video);

      // fullscreenElement.removeChild(video);
      // Insert video back inside the figure tag
      // videoFigure.appendChild(video);
      // parent.insertBefore(videoFigure, video).appendChild(video);
      hideVideoLinks();
      resetFullscreenStyles();
      // revert video attributes
      video.classList.add('video-figure');
      video.controls = false; // Hide controls
      video.muted = true; // Mute the video
      video.playbackRate = 1; // Reset playback rate to normal speed
      //still wish there was timer
      gsap.set(video, {
        position: 'relative',
        top: 0 + 'px',
        left: 0 + 'px',
        bottom: 0 + 'px',  
        width: position.width + 'px',
        height: position.height + 'px',
        zIndex: 'unset',
        transform: "unset",
    
      });
      Flip.from(state, {
        ...animationDefaults,
        duration:0.6,
        onComplete: () => {
          gsap.set(parent, { zIndex: 'unset'});
          gsap.killTweensOf(video);
          gsap.killTweensOf(fullscreenElement)
           // Remove all figure tags
          // const figures = gsap.utils.toArray('figure');
          // figures.forEach((figure: HTMLElement) => {
          //   gsap.to(figure, {
          //     opacity: 0,
          //     duration: 0.3,
          //     onComplete: () => figure.remove()
          //   });
          // });
          // Resume playback of other videos
          gridItems.forEach((item: HTMLElement) => {
            
            const video = item.querySelector('.video--item') as HTMLVideoElement;
            gsap.set(fullscreenElement, {zIndex: 'unset', background: "none", visibility: "hidden"});
            // parent.removeChild(videoFigure);
            if (video && video !== currentFullscreenVideo && video.paused) {
              video.play().catch(error => {
                console.error('Error attempting to play video:', error);
              });
            }
          });
        }
      });
    }
  };
 export function MatchMedia() {
// create
let mm = gsap.matchMedia();
// mq
mm.add("(min-width: 800px)", () => {
  const video = document.querySelector('.video--item') as HTMLVideoElement;
  let videoFigure = document.querySelector('.video--figure') as HTMLElement;
  const { parent, position } = originalStates.get(video) || { parent: null, position: null };
  if (!parent || !position) return; // Ensure parent and position are valid
 // Find the original figure element
 const originalFigure = parent.querySelector('.video--figure') as HTMLElement;
    
 // If the original figure exists, append the video to it
 if (originalFigure) {
   originalFigure.appendChild(video);
 } else {
   // If not, append directly to the parent
   parent.appendChild(video);
 }

 // Remove any orphaned figure elements inside fullscreenElement
 const orphanedFigures = fullscreenElement.querySelectorAll('figure');
 orphanedFigures.forEach(figure => figure.remove());
  // only runs when viewport is at least 800px wide
  // gsap.to(...);
  // gsap.from(...);
  // ScrollTrigger.create({...});
  // flipVideo();
  // returnToOriginalPosition();

  return () => { // optional
    cleanup();
  };
});

// later, if we need to revert all the animations/ScrollTriggers...
mm.revert();
 } 
//export these funcs.
 export function callAfterResize() {
    // gridItemsShuffled.forEach((item: HTMLElement) => {
    //   const video = item.querySelector('.video--item') as HTMLElement;
    //   if (video) {
    //     const rect = video.getBoundingClientRect();
    //     originalStates.set(video, { 
    //       parent: item.parentElement!,
    //       index: 0,
    //       position: { 
    //         top: rect.top, 
    //         left: rect.left, 
    //         width: rect.width, 
    //         height: rect.height ,
            
    //       }
    //     })
    //   }
    // });
    // cleanup();
    let dc = gsap.delayedCall(0.2 || 0.2, initEvents).pause(),
    
    handler = () => dc.restart(true);
    window.addEventListener("resize", handler);
    return handler; // in case you want to window.removeEventListener() later
  }

 // toggle

//  function ListenEvents () {

//  }
// const toggleVideo = (e: Event) => {
   
//     const video = e.currentTarget as HTMLVideoElement;
//     flipVideo(video);
    
//     if (currentFullscreenVideo && !fullscreenElement.contains(e.target as Node)) {
//         returnToOriginalPosition(currentFullscreenVideo);
//     }
//   };
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
  // const figure = document.getElementsByTagName("figure")[0];
  // if (figure) {
  //   // for (const figure of figure.getElementsByTagName("")) {}
  //   figure.remove();
  // }
  if (currentFullscreenVideo && currentFullscreenVideo !== video) {

    returnToOriginalPosition(currentFullscreenVideo);
   
  }
};
// const toggleVideo = (video: HTMLVideoElement) => {
//   flipVideo(video);
//   if (currentFullscreenVideo && currentFullscreenVideo !== video) {
//     returnToOriginalPosition(currentFullscreenVideo);
//   }
// };      
// target the fullscreen and such
function handleDocumentClick(e: MouseEvent) {
    // e: MouseEvent;

    if (currentFullscreenVideo && !fullscreenElement.contains(e.target as Node)) {
        returnToOriginalPosition(currentFullscreenVideo);
    }
}
  // Initialize event listeners for grid videos
export const initEvents = () => {
    saveInitialState(); // Save the initial state of videos
    // initShadowGrid();
  //   gridItems.forEach((item: HTMLElement) => {
  //     const video = item.querySelector('.video--item') as HTMLElement;
  //     if (video) {
  //       video.addEventListener('click', toggleVideo);
  //     }
  //   });
  //   document.addEventListener('click', handleDocumentClick);
  // };

  gridItems.forEach((item) => {
    const video = item.querySelector('.video--item') as HTMLVideoElement;
    if (video) {
      const eventDispatcher = new EventDispatcher();
      
      // Set up Observer for the video
      Observer.create({
        target: video,
        type: "pointer,touch,mouse",
        onClick: (self) => {
          toggleVideo({
            target: video,
            currentTarget: video,
            type: 'click'
          } as unknown as Event);
        },
        preventDefault: false
      });

      // Store the eventDispatcher on the video element for later cleanup
      (video as any).eventDispatcher = eventDispatcher;
    }
  });

  // Handle document-wide clicks
  Observer.create({
    target: document,
    type: "pointer,touch,mouse",
    onClick: (self) => {
      if (currentFullscreenVideo && !fullscreenElement.contains(self.event.target as Node)) {
        returnToOriginalPosition(currentFullscreenVideo);
      }
    },
    preventDefault: false
  });
};

function cleanup() {
  gridItems.forEach((item: HTMLElement) => {
    const video = item.querySelector('.video--item') as HTMLVideoElement;
    if (video && (video as any).eventDispatcher) {
      (video as any).eventDispatcher.dispose();
      delete (video as any).eventDispatcher;
    }
  });

  // Kill all GSAP animations and observers
  gsap.killTweensOf("*");
  Observer.getAll().forEach(observer => observer.kill());
}