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

// const linkWrapper = document.createElement('div') as HTMLDivElement; 
// const gridSelector = document.querySelector('.video--placement--grid');
// linkWrapper.className = 'shadow-inner-grid';
// linkWrapper.style.display = 'none'; // Initially hidden
// gridSelector!.appendChild(linkWrapper);
// begin create the link elements
const companyName = document.createElement('div');
companyName.className = 'company-name';
companyName.style.display = 'none'; // Initially hidden
document.body.appendChild(companyName);
const samsung = companyName.querySelector('.project-name-revealed');

const projectName = document.createElement('div');
projectName.className = 'project-name';
projectName.style.display = 'none'; // Initially hidden
document.body.appendChild(projectName);




function insertProjectName(video: HTMLVideoElement) {
  let projectId = video.getAttribute('data-project');
  let getprojectLink =  video.getAttribute('data-hashnav')?.substring(1) ;
  let setprojectLink = '/projects.html' + '#' + getprojectLink;


    if (!projectId) return;
    projectName.innerHTML = `
      <a class="project-name-revealed" href='${setprojectLink}' onclick="smoothLinkClick(e)" >${projectId}</a>
      
      `;
      return projectName

}

function insertCompanyName(video: HTMLVideoElement) {
  let projectId = video.getAttribute('data-company');
  let getprojectLink =  video.getAttribute('data-company-link')?.substring(1) ;
  let setprojectLink = '/projects.html' + '#' + getprojectLink;


    if (!projectId) return;
    companyName.innerHTML = `
    
      <a class="company-name-revealed" href='${setprojectLink}' onclick="smoothLinkClick(e)" >${projectId}</a>
      
    
      `;

      return companyName
}

function insertShadowGrid() {



  const shadowGrid = document.createElement('div') as HTMLElement;
  shadowGrid.className = "shadow-inner-grid";
shadowGrid.style.display = "grid";

  shadowGrid.innerHTML = `<div class="shadow-inner-grid">` + companyName + projectName + `</div>`;
  return shadowGrid;


        



    
}


// end create the link elements


// document.body.appendChild(projectName);
// defaults
const animationDefaults = { duration: 0.7, ease: 'expo.inOut' };
// const samsung = controlsElement.querySelector('.project-name-revealed');


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

// function insertProjectName(video: HTMLVideoElement) {
//   let projectId = video.getAttribute('data-project');
//   let getprojectLink =  video.getAttribute('data-hashnav')?.substring(1) ;
//   let setprojectLink = '/projects.html' + '#' + getprojectLink;


//     if (!projectId) return;
//     projectName.innerHTML = `<a class="project-name-revealed" href='${setprojectLink}' onclick="smoothLinkClick(e)" >${projectId}</a>`;
// }


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
    insertCompanyName(video);
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
      // parent.insertBefore(videoFigure, video); //this may need work
      videoFigure.appendChild(video);

      parent.appendChild(video);
      // parent.removeChild(video);
    } else {
      
      parent.appendChild(video);
      
      fullscreenElement.appendChild(video);
      parent.appendChild(insertShadowGrid());
      // parent.appendChild(companyName);
      // parent.appendChild(projectName);

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
    // show project and company names
    
    // insertProjectName(video);
    // insertCompanyName(video);
    insertShadowGrid();
    // controlsElement.style.display = 'block';
    // projectName.style.display = 'block';
    // linkWrapper.style.display = 'grid';
    // insertShadowGrid.shadowGrid.style.display = "grid";
    companyName.style.display = 'block';
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

      if (companyName.parentElement) {
        companyName.parentElement.removeChild(companyName);
      }
      if (projectName.parentElement) {
        projectName.parentElement.removeChild(projectName);
      }
      // revert video attributes
      video.controls = false; // Hide controls
      video.muted = true; // Mute the video
      video.playbackRate = 1; // Reset playback rate to normal speed
      // Hide controls
      // if (companyName) {
      //   companyName.style.display = 'none';
      // }
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
  
