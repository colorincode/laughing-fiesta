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
  console.log(video);
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
  // console.log('Hiding video links');
  shadowGrid.style.display = "none";
  projectName.innerHTML = '';
  companyName.innerHTML = '';
}

// defaults
const animationDefaults = { duration: 0.7, ease: 'power4.inOut' };


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
  
    if (currentFullscreenVideo && currentFullscreenVideo !== video) {
      returnToOriginalPosition(video);
    }
    // insertProjectName(video);
    // insertCompanyName(video);
    videoLinksVisible(video);
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
    gsap.set(maskingLayer, { zIndex: 0 });
    gsap.to(maskingLayer, { ...animationDefaults, opacity: 0.85 });
      let videoFigure = document.querySelector('.video--figure') as HTMLElement;
      if (fullscreenElement.contains(video)) {
      fullscreenElement.removeChild(video);
       parent.insertBefore(videoFigure, video).appendChild(video); // video back inside the figure
    } else {
      
      parent.appendChild(video);
      fullscreenElement.appendChild(video);
      pauseOtherVideos(video); //  other videos
      playFullscreenVideo(video); //  fullscreen video plays
    }
      // modify video attributes when in fullscreen
      video.controls = false; // Show controls
      video.muted = true; // Unmute the video
    // Set video to fullscreen
    gsap.set(video, {
      position: 'fixed',
      top: '15%',
      left: '15%',
      right:'15%',
      bottom:'15%',
      width: '70vw',
      height: '70vh',
      zIndex: 9999,
      maxWidth: 'unset',
      maxHeight: 'unset',
    });

    Flip.from(state, {
      ...animationDefaults,
      scale: true,
      onComplete: () => {
        currentFullscreenVideo = fullscreenElement.contains(video) ? video : null;
      //  gsap.set(video, {position:"relative"}) 
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
  
    if (fullscreenElement.contains(video)) {
      const state = Flip.getState(video, { props: 'position' });
     console.log(state);
      fullscreenElement.removeChild(video);
    // trying to use fit method instead, since there is a video figure appendation problemo
    Flip.fit(video, parent, {
      // duration: 0.6,
      ease: "power4.inOut", 
      width: "100%", //resetting to match figure tag
      height: "fit-content", //resetting to match figure tag
      // Optional properties (consult GSAP documentation for details)
      // scale: true, // Use scale instead of width/height (recommended for performance)
      // absolute: true, // Use absolute positioning (might be helpful in some cases)
    });
      parent.appendChild(video);
      // Insert video back inside the figure tag
      // videoFigure.appendChild(video);
      // parent.insertBefore(videoFigure, video).appendChild(video);
      hideVideoLinks();
      // revert video attributes
      video.controls = false; // Hide controls
      video.muted = true; // Mute the video
      video.playbackRate = 1; // Reset playback rate to normal speed
      //couldnt set a timer here, no good
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
        // scale: true,
        // absolute: true, 
        duration:0.6,
        // transform: "unset",
        onComplete: () => {
      
          gsap.set(parent, { zIndex: 'unset'});
          gsap.killTweensOf(video);
          // currentFullscreenVideo = null;
          // Resume playback of other videos
          gridItems.forEach((item: HTMLElement) => {
            const video = item.querySelector('.video--item') as HTMLVideoElement;
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
  
//export these funcs.
 export function callAfterResize() {
    gridItemsShuffled.forEach((item: HTMLElement) => {
      const video = item.querySelector('.video--item') as HTMLElement;
      if (video) {
        const rect = video.getBoundingClientRect();
        originalStates.set(video, { 
          parent: item.parentElement!,
          index: 0,
          position: { 
            top: rect.top, 
            left: rect.left, 
            width: rect.width, 
            height: rect.height ,
            
          }
        })
      }
    });

    let dc = gsap.delayedCall(0.2 || 0.2, initEvents).pause(),
    handler = () => dc.restart(true);
    window.addEventListener("resize", handler);
    return handler; // in case you want to window.removeEventListener() later
  }

 // toggle

//  function ListenEvents () {

//  }
const toggleVideo = (e: Event) => {
   
    const video = e.currentTarget as HTMLVideoElement;
    flipVideo(video);
    };
      
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

    // fitPositionAbsoluteElements(); //reposition grid
    gridItems.forEach((item: HTMLElement) => {
      const video = item.querySelector('.video--item') as HTMLElement;
      if (video) {
        video.addEventListener('click', toggleVideo);
      }
    });
    document.addEventListener('click', handleDocumentClick);
  };
  