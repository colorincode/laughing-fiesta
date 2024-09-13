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
  if (!companyId) return;
    companyName.innerHTML = `
      <div class="company-name-revealed" >${companyId}</div>
      `;
  if (!playIconAtag) return;
    playIconAtag.href = setprojectLink;
    playIconAtag.innerHTML = `
      <i class="fa-duotone fa-solid fa-circle-play fa-fw play--icon"></i>
    `;
  if (!projectId) return;
    projectName.innerHTML = `
      <div class="project-name-revealed" >${projectId}</div>
      `;
    shadowGrid.style.display = "grid";

   
  
}
function maskingAnimationTransition() {
  isMaskingAnimationRunning = true; // flag to not allow multiple animations to pile up

  let maskertonIsAnimating = gsap.isTweening(maskertonAnim);
  let videoWrap = gsap.utils.selector('.fullscreen--scale');
;

  let video = videoWrap('.video--item') ;


  if (maskertonIsAnimating ) {
     video.pause();

  }
  // let pseudo = CSSRulePlugin.getRule(".maskingintro--element:after");
  // maskertonAnim.from(".maskingintro--element", {
 
  //   opacity: 0,	
  //   // background: "rgba(0,0,0,0.9)",
  //   // delay: 1.45, //match the duration of the outer-wrapper 
  //   ease: "power4.Out",
  //   // scale: 1, 
  //   autoAlpha: 0,
  //   stagger: 0.2,
  //   duration: 2,
  //   onStart: function() {
  //     console.log('masking intro animation started');

  //   },
  //   maskertonAnim.to(".maskingintro--element", {
  //     opacity: 1,
  //     duration: 2.65,
      
  //     ease: "power1.out",
  //     autoAlpha: 1,

  //   // onInterrupt: () => {
  //   // //set an interrupt protocol, if this animation fails to fire then nothing will be visible, it should rarely if ever have to be accessed
  //   // tl.restart();
  //   // },
  //   onComplete: () => { 
  //     isMaskingAnimationRunning = false;
  //   }
  // }, 0)
  maskertonAnim.to(".maskingintro--element", {
    yPercent: 100
  })
  // .to(pseudo, {
  //   cssRule: {
  //     scaleY: 0.4
  //   }
  // })
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
  // console.log('Hiding video links');
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
  timeline.to(fullscreenElement, {
    ease: "none",
    position: 'fixed',
    top: '0',
    left: '0',
    right: '0',
    bottom: '0',
    width: '100%',
    height: '100%',
    zIndex: 9999,
    display: "grid",
    placeContent: "center",
    placeItems: "center",
    placeSelf: "center",
    background: "rgba(0,0,0,0.5)",
    maxWidth: 'unset',
    maxHeight: 'unset',
    visibility: "visible",
    onComplete: () => {
      // timeline.clearProperties();



    }

  });
  //pause vidya except fullscreener
  // pauseOtherVideos(currentFullscreenVideo as HTMLVideoElement);
}
function resetFullscreenStyles() {
  timeline.to(fullscreenElement, {
    position: 'fixed',
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
// function applyFullscreenStyles() {
//   // let tl = 
//   // gsap.fromTo(".fullscreen--scale",{
//   //   opacity: 0,
//   //   scale: 0,
//   //   autoAlpha: 1,
//   // },{
//   //   opacity: 1,
//   //   scale: 1,
//   //   autoAlpha: 1,
//   // });
//   // gsap.fromTo('video--item', {
//   //   opacity: 1,
//   //   width: '80vw'
//   // }, {
//   //   width: "",
//   //   height: "auto"
//   // });
//   // tl.add({})

//   timeline.to(fullscreenElement, {
//     // scaleY: 1,
//     // ...animationDefaults,
//     autoAlpha: 1,
//     // repeat: -1,

//     position: 'fixed',
//     // top: '0',
//     // left: '0',
//     // right: '0',
//     // bottom: '0',
//     // width: '100%',
//     // height: '100%',
//     zIndex: 9999,
//     display: "grid",
//     placeContent: "center",
//     placeItems: "center",
//     placeSelf: "center",
//     background: "rgba(0,0,0,0.5)",
//     // maxWidth: 'unset',
//     // maxHeight: 'unset',
//     visibility: "hidden",
  


//   });
    
//   //   position: 'fixed',
//   //   top: '0',
//   //   left: '0',
//   //   right: '0',
//   //   bottom: '0',
//   //   width: '100%',
//   //   height: '100%',
//   //   zIndex: 9999,
//   //   display: "grid",
//   //   placeContent: "center",
//   //   placeItems: "center",
//   //   placeSelf: "center",
//   //   background: "rgba(0,0,0,0.5)",
//   //   maxWidth: 'unset',
//   //   maxHeight: 'unset',
//   //   visibility: "visible",
//   // }


// // );
//   timeline.to('.shadow-inner-grid', {
//     // autoAlpha: 1,
//     opacity:1,
//     stagger: 0.1,

//   }) 
//   // timeline.to(".company-name", { opacity:1, autoAlpha:0, }, "<");
//   // timeline.to(".project-name-revealed", { opacity:1, autoAlpha:0, }, "<");
//   // timeline.to(".play--icon", { opacity:1, autoAlpha:0, }, "<");
//   //pause vidya except fullscreener
//   // pauseOtherVideos(currentFullscreenVideo as HTMLVideoElement);
// }
// function resetFullscreenStyles() {
//   timeline.to(fullscreenElement, {
//     // position: 'fixed',
//     // top: 'auto',
//     // left: 'auto',
//     // right: 'auto',
//     // bottom: 'auto',
//     // width: 'auto',
//     // height: 'auto',
//     zIndex: 'unset',
//     display: "none",
//     background: "none",
//     // maxWidth: 'none',
//     // maxHeight: 'none',
//     visibility: "hidden"
//   });
// }
// defaults
const animationDefaults = {  
  ease: 'linear',
//   stagger: {
//     // wrap advanced options in an object
//     each: 0.1,
//     // from: 'center',
//     grid: 'auto',
//     // ease: 'power2.inOut',
// }
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
            // top: rect.top, 
            // left: rect.left, 
            // width: rect.width, 
            // height: rect.height 
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
const pauseOtherVideos = () => {
    const video = document.querySelector('.video--item') as HTMLVideoElement;
    // fint the parent selector of vidya
    const VideoParent = video.closest('.fullscreen--scale') as HTMLElement;
    // If the video is not in the same parent as the clicked video, pause it
      if (video !== VideoParent) {
        video.pause();
      }
  };
  
// Play the fullscreen video
const playFullscreenVideo = () => {
  const video = document.querySelector('.video--item') as HTMLVideoElement;
    if (video.paused) {
      video.play();
    }
  };
  // Flip video to fullscreen
const flipVideo = (video: HTMLVideoElement) => {
  // let timelineFullscreen = gsap.timeline();
    const { parent, position } = originalStates.get(video) || { parent: null, position: null };
    if (!parent || !position) return; // Ensure parent and position are valid
    if (currentFullscreenVideo && currentFullscreenVideo !== video) {
      returnToOriginalPosition(video);
    }
    videoLinksVisible(video);
    applyFullscreenStyles();
    const state = Flip.getState(video, { props: 'class' });
    gsap.set(parent, { zIndex: 1 });
      let videoFigure = document.querySelector('.video--figure') as HTMLElement;
      if (fullscreenElement.contains(video)) {
        pauseOtherVideos();
        videoFigure.appendChild(video);
        parent.appendChild(video);
    } else {
      parent.appendChild(video);
      fullscreenElement.appendChild(video);
    }
      // modify video attributes when in fullscreen
      video.controls = false; // Show controls
      video.muted = true; // Unmute the video
      playFullscreenVideo ();

    Flip.from(state, {
      ...animationDefaults,
      duration:0.6,
      scale: true,
      onStart: () => {
          //   // Set video to fullscreen
          applyFullscreenStyles() ;
            // timeline.to(video, {height: "auto", width: "70vw", autoAlpha:1 });

         
           //mq to fix iphone alignment, cant tell if working 
            mm.add("(max-width: 1068px)", () => {
              // timeline.to(video, {height: "auto", width: "95vw", }); 
            });
      },
      onComplete: () => {
          // set full screen to fancy   
     
        currentFullscreenVideo = fullscreenElement.contains(video) ? video : null;
        timeline.from(video, {height: "auto", width: "70vw", autoAlpha:1,});
        // timelineFullscreen.reverse();

        //mq to fix iphone alignment, cant tell if working 
        mm.add("(max-width: 768px)", () => {
          timeline.from(video, {height: "auto", width: "95vw", autoAlpha:1 }); 

        });
      },
      cleanup: () => {
        debouncedCleanup();
        eventDispatcher.dispose();
        timeline.restart();
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

    // // attempt at fitting based on anim. does fix positioning, but the offset may not be worth perf
    Flip.fit(video, parent, {
      position: "relative",
      width: "100%", //resetting to match figure tag
      // height: "fit-content", //resetting to match figure tag
      inset: "unset", //resetting to match figure tag
    });

      hideVideoLinks();
    
      // revert video attributes
      video.classList.add('video-figure');
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
  

      /// this must match the video tag in the css!!! gsap set is to reset the original state
      gsap.set(video, {
        position: "relative",
        width: '100%' ,
        // height: 'fit-content',
      });
    
      orphanedFigures.forEach(figure => figure.remove());
      // if the original figure exists, append the video to it
      if (originalFigure) {
        originalFigure.appendChild(video);
      } else {
        // if there is no OG figure tag (i.e. animation has run), append directly to the parent
        parent.appendChild(video);
      }
      // gsap.set(video, {
      //   position: 'relative',
      //   top: 0 + 'px',
      //   left: 0 + 'px',
      //   bottom: 0 + 'px',  
      //   width: position.width + 'px',
      //   height: position.height + 'px',
      //   zIndex: 'unset',
      //   transform: "unset",
    
      // });
      Flip.from(state, {
        // ...animationDefaults,
        duration:0.6,
        onComplete: () => {
          gsap.set(parent, { zIndex: 'unset'});
          // timeline.pause();
          // gsap.killTweensOf(video);
          // gsap.killTweensOf(fullscreenElement);
          // timeline.clear();

          // Resume playback of other videos
          gridItems.forEach((item: HTMLElement) => {
            const video = item.querySelector('.video--item') as HTMLVideoElement;
            // gsap.set(fullscreenElement, {zIndex: 'unset', background: "none", visibility: "hidden"});
            // gsap.fromTo(fullscreenElement, 
            //   {zIndex: '9999', background: "none", visibility: "inherit", autoAlpha: 1},
            //   {zIndex: 'unset', background: "none", visibility: "hidden", autoAlpha: 0}

            // );
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
          resetFullscreenStyles();
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
    timeline.restart();
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
      // video: video
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
  // // playIcons.forEach((icon) => {
    
  // // })


  // e.preventDefault(); // Prevent the default navigation
  // maskingAnimationTransition();
  // e.stopImmediatePropagation();

}
const addVideoClickListeners = () => {
  const videos = document.querySelectorAll('.video--item:not(.hidden--video)');
  videos.forEach((video) => {
    video.addEventListener('click', handleVideoClick);
    video.addEventListener('click', toggleVideo);
    handlePlayIconClick();

    // video.addEventListener("click", handlePlayIconClick(e));
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
              // documentObserverCreate();
              toggleVideo({
                target: video,
                currentTarget: video,
                type: 'click'
              } as unknown as Event);
             

              // videoObserverKill();
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
  // console.log(filteredVideos);
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
  // document.addEventListener('DOMContentLoaded', initShadowGrid);
  // we dont need much here, we are listening for load on main app. 
  // gridItems.forEach((item: HTMLElement) => {
  //   // const video = item.querySelector('.video--item') as HTMLElement;
  //   // if (video) {
  //   //   video.addEventListener('click', toggleVideo);
  //   // }
  // });
  document.addEventListener('click', onClick);
  // video.addEventListener('click', toggleVideo);
};

// };

const onClick = (e: Event) => {
  if (currentFullscreenVideo && !fullscreenElement.contains(e.target as Node)) {
    returnToOriginalPosition(currentFullscreenVideo);
}
// handlePlayIconClick(eve);

}
// send off the dispatchers, these shouldn't need editing just edit funcs above. 
document.addEventListener("click", onClick);
eventDispatcher.addEventListener("DOMContentLoaded", onDOMContentLoaded);


// // not sure about this listener
// function handleDocumentClick(e: MouseEvent) {
//   // e: MouseEvent;

//   if (currentFullscreenVideo && !fullscreenElement.contains(e.target as Node)) {
//       returnToOriginalPosition(currentFullscreenVideo);
//   }
// }

     // Store the eventDispatcher on the video element for later cleanup
        // let getAll = Observer.getAll();
        // console.log(getAll);
        //   (video as any).clickEventDispatcher = clickEventDispatcher;
// function addVideoClickListeners() {
//   const videos = document.querySelectorAll('.video--item:not(.hidden--video)');
//   videos.forEach((video) => {
//     video.addEventListener('click', handleVideoClick);
//   });
// }

// function handleVideoClick(event: Event) {
//   const video = event.currentTarget as HTMLElement;
//   toggleVideo({
//     target: video,
//     currentTarget: video,
//     type: 'click'
//   } as unknown as Event);
//   removeVideoClickListeners();
// }

// function removeVideoClickListeners() {
//   const videos = document.querySelectorAll('.video--item:not(.hidden--video)');
//   videos.forEach((video) => {
//     video.removeEventListener('click', handleVideoClick);
//   });
//   addDocumentClickListener();
// }

// function addDocumentClickListener() {
//   document.addEventListener('click', handleDocumentClick2);
// }

// function handleDocumentClick2(event: MouseEvent) {
//   if (currentFullscreenVideo && !fullscreenElement.contains(event.target as Node)) {
//     returnToOriginalPosition(currentFullscreenVideo);
//     removeDocumentClickListeners();
//   }
// }

// function removeDocumentClickListeners() {
//   document.removeEventListener('click', handleDocumentClick2);
//   addVideoClickListeners();
// }



//exported funcs
export function callAfterResize() {
  let dc = gsap.delayedCall(0.2 || 0.2, initEvents).pause(),
  handler = () => {
    dc.restart(true);
    Flip.killFlipsOf(".video--item");
    Observer.getAll().forEach(o => o.kill()); 
  }
  window.addEventListener("resize", handler);
  return handler; // in case you want to window.removeEventListener() later
}

export const initEvents = () => {

  addVideoClickListeners();

};

// export const initEvents = () => {
//   saveInitialState(); // Save the initial state of videos
//     // initShadowGrid();
//   //   gridItems.forEach((item: HTMLElement) => {
//   //     const video = item.querySelector('.video--item') as HTMLElement;
//   //     if (video) {
//   //       video.addEventListener('click', toggleVideo);
//   //     }
//   //   });
//   //   document.addEventListener('click', handleDocumentClick);
//   // };
//   console.log('vid observer init trigger');
//   videosObserverCreate();

// };

// let clickEventDispatcher = new EventDispatcher;

// function videosObserverCreate() {
//   console.log('the video observers are being created');
//   const video = document.querySelectorAll('.video--item');
//   const videoEl = document.querySelector(".video--item") as HTMLVideoElement;
//   setupUnifiedEventHandler(videoEl, new EventDispatcher);
//   const filteredVideos = Array.from(video).filter(video => !video.classList.contains('hidden--video'));
//   console.log(filteredVideos);
//   filteredVideos.forEach((video) => {
//     // const video = item.querySelector('.video--item') as HTMLVideoElement;
//     if (video) {
//       setupUnifiedEventHandler(videoEl, new EventDispatcher);
//       // const eventDispatcher = new EventDispatcher();
//       // Set up Observer for the video

//     //   console.log('vid observer');
//       _Observer.create({
//         target: video,
//         type: "pointer,touch,mouse",
//         onClick: (event) => {
//           documentObserverCreate();
//           toggleVideo({
//             target: video,
//             currentTarget: video,
//             type: 'click'
//           } as unknown as Event);
//           videoObserverKill();
//         },
//         preventDefault: false
//       });
//     //   // Store the eventDispatcher on the video element for later cleanup
//     let getAll = _Observer.getAll();
//     console.log(getAll);
//     //   (video as any).clickEventDispatcher = clickEventDispatcher;
//     // }
//   // };
// }   //  
//  });
// }
// function videoObserverKill() {
//   const video = document.querySelectorAll('.video--item');
//   const filteredVideos = Array.from(video).filter(video => !video.classList.contains('hidden--video'));
//   console.log(filteredVideos);
//   filteredVideos.forEach((video) => {
//     // const video = item.querySelector('.video--item') as HTMLVideoElement;
//     if (video && (video as any).eventDispatcher) {
//       // console.log('disposing video observers');
//       // look for array of event observers created 
//       // let getAll = _Observer.getAll();
//       // console.log(getAll);
//       // (video as any).eventDispatcher.dispose();
 

//       // disable the observers (if we want them re enabled later)
//       // kill the observers (if we do not want them re enabled)
//            //dont need this, need to ready the observers for garbage collection here.
//       _Observer.getAll().forEach(o => o.kill()); 
//     // eventdispatcher
//       // clickEventDispatcher.removeEventListener(clickEventDispatcher.listeners['pointer,touch,mouse'][0]);
//       // delete (video as any).eventDispatcher;
//       console.log(video);
//       // delete (video as any).eventDispatcher;
//     }
    
//   });
// }

// // // Handle document-wide clicks
// function documentObserverCreate() {
//   console.log('document observer has been created');
//   const videoEl = document.querySelector(".video--item") as HTMLVideoElement;
//   _Observer.create({
//     target: document,
//     type: "pointer,touch,mouse",
//     onClick: (self) => {
//       if (currentFullscreenVideo && !fullscreenElement.contains(self.event.target as Node)) {
//         returnToOriginalPosition(currentFullscreenVideo);
//       }
//     },
//     onStop: () => {
//       if (currentFullscreenVideo && currentFullscreenVideo) {
//         setupUnifiedEventHandler(videoEl, new EventDispatcher);
//         setInterval (() => {
//           videoEl.removeEventListener("click", videoObserverKill);
//         }, 1)
//         console.log("cleanup completed on stop");
//       }
//     },
//     preventDefault: false
//   });
// }