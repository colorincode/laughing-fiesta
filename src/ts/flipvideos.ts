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
let currentFullscreenVideo: HTMLElement | null = null;
const originalStates = new Map<Element, { parent: Element, index: number, position: { top: number, left: number, width: number, height: number } }>();
let isFullscreen = false;


// Create and style the controls element
const controlsElement = document.createElement('div');
controlsElement.className = 'video-controls';
controlsElement.innerHTML = `<span class="project-name-revealed">SAMSUNG</span>`;
controlsElement.style.position = 'absolute';
controlsElement.style.bottom = '20px';
controlsElement.style.left = '25%';
controlsElement.style.transform = 'translateX(-50%)';
controlsElement.style.background = 'rgba(0, 0, 0, 0.7)';
controlsElement.style.color = '#fff';
controlsElement.style.padding = '10px';
controlsElement.style.border = '1px solid black';
controlsElement.style.zIndex = '9999';
controlsElement.style.cursor = 'pointer';
controlsElement.style.fontFamily = '"Manrope", sans-serif';
controlsElement.style.fontSize = '1.5rem';
controlsElement.style.lineHeight = '1.5';
controlsElement.style.fontWeight = '200';
controlsElement.style.display = 'none'; // Initially hidden
document.body.appendChild(controlsElement);
const projectName = document.createElement('div');
projectName.className = 'project-name';
projectName.innerHTML = `<span class="project-name">SAMSUNG</span>`;
projectName.style.position = 'absolute';
projectName.style.bottom = '20px';
projectName.style.left = '50%';
projectName.style.transform = 'translateX(-50%)';
projectName.style.background = 'rgba(0, 0, 0, 0.7)';
projectName.style.color = '#fff';
projectName.style.padding = '10px';
projectName.style.border = '1px solid black';
projectName.style.zIndex = '9999';
projectName.style.cursor = 'pointer';
projectName.style.fontFamily = '"Manrope", sans-serif';
projectName.style.fontSize = '1.5rem';
projectName.style.lineHeight = '1.5';
projectName.style.fontWeight = '200';

projectName.style.display = 'none'; // Initially hidden
document.body.appendChild(projectName);
// defaults
const animationDefaults = { duration: 0.7, ease: 'expo.inOut' };
const samsung = controlsElement.querySelector('.project-name-revealed');


// function fitPositionAbsoluteElements() {
//     const smileyWrapper = document.querySelector('.central--smile__wrapper') as HTMLElement;
//     function getDomSize() {
//     //get height
//     smileyWrapper.style.getPropertyValue('--adjust-height');
//     getComputedStyle(smileyWrapper).getPropertyValue('--adjust-height');
//     // get width
//     smileyWrapper.style.getPropertyValue('--adjust-width');
//     getComputedStyle(smileyWrapper).getPropertyValue('--adjust-width');
//     }
//     if (smileyWrapper) {
//         function updateSize() {
//             getDomSize(); 
//             //let's reset the values of our var, or leave them
//             let width = window.innerWidth.toString();
//             let height = window.innerHeight.toString();
//             smileyWrapper.style.setProperty('--adjust-width', width);
//             smileyWrapper.style.setProperty('--adjust-height', height);
//         }
//         updateSize();
//         window.addEventListener('resize', updateSize);
//     } else {
//         console.error('Element with class .video--placement--grid not found.');
//     }
// }


if (samsung) {
  const handleClick = function() {
    window.location.href = '/projects.html';
    samsung.removeEventListener('click', handleClick);
  };
  samsung.addEventListener('click', handleClick);
}

function insertProjectName(video: HTMLVideoElement) {
  let projectId = video.getAttribute('data-project');
  let getprojectLink =  video.getAttribute('data-hashnav')?.substring(1) ;
  let setprojectLink = '/projects.html' + '#' + getprojectLink;


    if (!projectId) return;
    projectName.innerHTML = `
      <a class="project-name" href='${setprojectLink}' onclick="smoothLinkClick(e)" >${projectId}</a>`;
}


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
    insertProjectName(video);
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
    const state = Flip.getState(video, { props: 'borderRadius' });
  
    gsap.set(parent, { zIndex: 1 });
    gsap.set(maskingLayer, { zIndex: 0 });
    gsap.to(maskingLayer, { ...animationDefaults, opacity: 0.85 });
      let videoFigure = parent.querySelector('.video--figure') as HTMLElement;

    if (fullscreenElement.contains(video)) {
      fullscreenElement.removeChild(video);
      parent.insertBefore(videoFigure, video); //this may need work
      parent.appendChild(video);
      // parent.removeChild(video);
    } else {
      
      parent.appendChild(video);
      
      fullscreenElement.appendChild(video);

      parent.appendChild(controlsElement);
      parent.appendChild(projectName);
    //   addControlEventListeners(controlsElement); // Add event listeners to controls
      pauseOtherVideos(video); // Pause other videos
      playFullscreenVideo(video); // Ensure fullscreen video plays
    }
      // Modify video attributes when in fullscreen
      video.controls = true; // Show controls
      video.muted = false; // Unmute the video
    //   video.playbackRate = 1.5; // Increase playback rate
    // Set video to fullscreen
    gsap.set(video, {
      position: 'fixed',
      top: 0,
      left: 0,
      right:0,
      bottom:0,
      width: '100vw',
      height: '90vh',
      zIndex: 9999,
    });
    // Show controls
    controlsElement.style.display = 'block';
    projectName.style.display = 'block';

    Flip.from(state, {
      ...animationDefaults,
      scale: true,
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
    const { parent, position } = originalStates.get(video) || { parent: null, position: null };
    if (!parent || !position) return; // Ensure parent and position are valid
  
    if (fullscreenElement.contains(video)) {
      const state = Flip.getState(video, { props: 'borderRadius' });
      fullscreenElement.removeChild(video);
      parent.appendChild(video);

      if (controlsElement.parentElement) {
        controlsElement.parentElement.removeChild(controlsElement);
      }
      if (projectName.parentElement) {
        projectName.parentElement.removeChild(projectName);
      }
      // revert video attributes
      video.controls = false; // Hide controls
      video.muted = true; // Mute the video
      video.playbackRate = 1; // Reset playback rate to normal speed
      // Hide controls
      if (controlsElement) {
        controlsElement.style.display = 'none';
      }
      //couldnt set a timer here, no good
      gsap.set(video, {
        position: 'absolute',
        top: position.top + 'px',
        left: position.left + 'px',
        width: position.width + 'px',
        height: position.height + 'px',
        zIndex: 'unset',
      });
  
      Flip.from(state, {
        ...animationDefaults,
        scale: true,
        onComplete: () => {
          gsap.set(parent, { zIndex: 'unset' });
          gsap.killTweensOf(video);
          currentFullscreenVideo = null;
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
            height: rect.height 
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
    // fitPositionAbsoluteElements(); //reposition grid
    gridItems.forEach((item: HTMLElement) => {
      const video = item.querySelector('.video--item') as HTMLElement;
      if (video) {
        video.addEventListener('click', toggleVideo);
      }
    });
    document.addEventListener('click', handleDocumentClick);
  };
  


// document.addEventListener( "resize",( ev: UIEvent) =>  {
//     callAfterResize();

// });

// document.addEventListener('DOMContentLoaded', () => {
//   initEvents();
//   console.log('flip videos loaded')


// });
