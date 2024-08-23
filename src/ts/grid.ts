//gsap modules
import gsap, { random, SteppedEase, toArray } from 'gsap'
import { Flip } from 'gsap/Flip';
import Draggable from 'gsap/Draggable';
import ScrollTrigger from 'gsap/ScrollTrigger';
import ScrollToPlugin from 'gsap/ScrollToPlugin';
import EasePack from 'gsap/EasePack';
import { Power4 } from 'gsap/gsap-core';
import Observer from 'gsap/Observer';
import Timeline from 'gsap/all';
import  Tween  from 'gsap/src/all';

//register gsap
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

//others

//local imports
import {EventDispatcher} from "./shared/eventdispatch";
import {videoScreenChange} from "./videohandlers";

//constants
const grid = document.querySelector(".homegrid__container") as any;
const items = gsap.utils.toArray(".grid__item") as HTMLElement[];
const originalStates = new Map<Element, { parent: Element, index: number, position: { top: number, left: number, width: number, height: number } }>();
const GRID_AREAS = {
    TOP_LEFT: 'top-left',
    TOP_RIGHT: 'top-right',
    CENTER: 'center',
    CONTENT: 'content'
  };

  
const gsapDefaults = {
    //  overwrite: true 
     
}
interface FlipBatchActionSelf {
    state: Flip.FlipState;
    targets?: Element[];
    batch?: FlipBatch;
    timeline?: gsap.core.Timeline;
  }
  
  interface FlipBatchAction {
    self: FlipBatchActionSelf;
    getState: (self: FlipBatchActionSelf) => Flip.FlipState;
    setState: (self: FlipBatchActionSelf) => Element[] | void;
    animate: (self: FlipBatchActionSelf) => void;
    onEnter?: (elements: Element[]) => void;
    onLeave?: (elements: Element[]) => void;
    onStart?: (self: FlipBatchActionSelf) => void;
    onComplete?: (self: FlipBatchActionSelf) => void;
    once?: boolean;
  }
  
  interface FlipBatch {
     //whatever is added to flip batch needs to. be added herer
    add: (action: FlipBatchAction) => FlipBatch;
    start: () => gsap.core.Timeline;
    timeline: gsap.core.Timeline;
    kill: () => void;
    cleanup:() => void;
    addEventListener: (eventType: string, callback: EventListener) => void;
    removeEventListener: (eventType: string, callback: EventListener) => void;
    removeAction: (action: FlipBatchAction) => void;
  }

  const createFlipBatch = (): FlipBatch => {
    const actions: FlipBatchAction[] = [];
    const timeline = gsap.timeline();
    //call event defense
    const eventDispatcher = new EventDispatcher();
    let isAnimating = false;
    let cleanupDelayedCall: gsap.core.Tween | null = null;
    const debouncedCleanup = () => {
        if (cleanupDelayedCall) {
          cleanupDelayedCall.kill();
        }
        cleanupDelayedCall = gsap.delayedCall(3, () => {
          if (!isAnimating) {
            gsap.killTweensOf(items);
            timeline.clear();
            eventDispatcher.dispose();
            console.log("Animation cleanup completed");
          }
        });
      };
      
    return {
      add: (action: FlipBatchAction) => {
        actions.push(action);
        return this;
      },
      start: () => {
        actions.forEach(action => {
          const state = action.getState(action.self);
          action.self.state = state;
          action.setState(action.self);
          action.animate(action.self);
          if (action.onStart) action.onStart(action.self);
        });
        timeline.eventCallback("onComplete", () => {
            isAnimating = false;
            debouncedCleanup();
          });
        return timeline;
      },
      timeline: timeline,
      kill: () => {
        timeline.kill();
        // actions.length = 0;
        if (cleanupDelayedCall) {
          cleanupDelayedCall.kill();
        }
        eventDispatcher.dispose();
      },
      
    //   kill: () => {
    //     timeline.kill();
    //     actions.length = 0;
    //     if (cleanupDelayedCall) {
    //         cleanupDelayedCall.kill();
    //       }
    //       eventDispatcher.dispose();
    //   },
      cleanup: () => {
        debouncedCleanup();
      },
      removeAction: (actionToRemove: FlipBatchAction) => {
        const index = actions.indexOf(actionToRemove);
        if (index > -1) {
          actions.splice(index, 1);
        }
    },
      addEventListener: (eventType: string, callback: EventListener) => {
        eventDispatcher.addEventListener(eventType, callback);
      },
      removeEventListener: (eventType: string, callback: EventListener) => {
        eventDispatcher.removeEventListener(eventType, callback);
      },
    };
  };
  
  // // batch and add action
  // const initializeSizesBatch: FlipBatchAction = {
  //   self: { state: {} as Flip.FlipState },
  //   getState(self) {
  //     return Flip.getState(".grid__item");
  //   },
  //   setState(self) {
  //       const sizes = ['small', 'medium', 'large'];
  //       const contentItems = items.filter(item => !item.classList.contains('fixed-item'));
  //       const availableAreas = getAvailableGridAreas();
  //       return contentItems;
  //     },
  //     animate(self) {
  //       Flip.from(self.state, {
  //         duration: 0.8,
  //         ease: "power4.inOut",
  //         absolute: true,
  //         stagger: 0.05,
  //         onComplete: () => {
  //           console.log("Initial layout animation completed");
  //         }
  //       });
  //     },
  //     onStart(self) {
  //       console.log("Initializing grid item sizes and positions");
  //     },
  //     onComplete(self) {
  //       console.log("Grid item sizes and positions initialized");
  //     },
  //     once: true
  //   };


    // function getAvailableGridAreas() {
    //   const areas = [];
    //   for (let row = 1; row <= 12; row++) {
    //     for (let col = 1; col <= 12; col++) {
    //       // exclude top-left, top-right, center, and content areas
    //       if (!((row >= 1 && row <= 4 && col >= 1 && col <= 4) ||
    //             (row >= 1 && row <= 3 && col >= 9 && col <= 12) ||
    //             (row >= 4 && row <= 6 && col >= 5 && col <= 8) ||
    //             (row >= 7 && row <= 12 && col >= 1 && col <= 12))) {
    //         areas.push(`${row}/${col}`);
    //       }
    //     }
    //   }
    //   return gsap.utils.shuffle(areas);
    // }

  //function invocation and ex ports
  const flipBatch = createFlipBatch();
  // const initBatch = createFlipBatch();
  // initBatch.add(initializeSizesBatch);
  // flipBatch.add(galleryModalBatch);



  const flipBatchHandler = (e: Event) => {
    flipBatch.start();
  };
  // const closeModalHandler = (e: Event) => {
  //   if (e.target !== imgPreview) return;
  
  //   const activeImgState = Flip.getState([activeImg]);
  //   activeImgParent.appendChild(activeImg);
  
  //   Flip.from(activeImgState, {
  //     duration: 1,
  //     ease: "power3.inOut",
  //     absolute: true,
  //     scale: true,
  //     onStart: () => {
  //       imgPreview.classList.remove("imgPreview--active");
  //     },
  //     onComplete: () => {
  //       isimgPreviewOpen = false;
  //       gsap.set(imgPreview, { autoAlpha: 0 });
        
  //       // Return the element to its original position on the grid
  //       const originalState = Flip.getState(activeImg);
  //       Flip.from(originalState, {
  //         duration: 0.5,
  //         ease: "power3.inOut",
  //         absolute: true,
  //         scale: true,
  //         onComplete: () => {
  //           activeImg.style.zIndex = "";
  //         }
  //       });
  //     },
  //   });
  // };
  
// exports
// export function initSize () {
//     window.addEventListener('load', () => {
//     initBatch.start();
//   });
  
// }

export function listenForFlip() {
    items.forEach(item => {
      item.removeEventListener('click', flipBatchHandler); // remove existing listener
      item.addEventListener('click', flipBatchHandler); // rdd new listener
    });
  }

export function killFlip() {
  flipBatch.kill();
  // imgs.forEach(img => {
  //   img.removeEventListener('click', flipBatchHandler);
  // });
  // imgPreview.removeEventListener('click', closeModalHandler);
}


  //function invocation and ex ports
//   const flipBatch = createFlipBatch();
//   const initBatch = createFlipBatch();
//   initBatch.add(initializeSizesBatch);
//   flipBatch.add(contentModalBatch);

//   flipBatch.add(flipgridBatch);

//   const flipBatchHandler = async (e: Event) => {
//     e.stopPropagation();
//     const clickedItem = e.currentTarget as HTMLElement;
    
//     try {
//       // Wait for the shuffle animation to complete
//       await flipBatch.start();
      
//       // Now trigger the content modal
//       contentModalBatch.self.targets = [clickedItem];
//       await contentModalBatch.animate(contentModalBatch.self);
//     } catch (error) {
//       console.error("Error in flip batch:", error);
//     } finally {
//       contentModalBatch.self.targets = [];
//       flipBatch.cleanup();
//     }
//   };

//   // exports
// export function initSize () {
//     window.addEventListener('load', () => {
//     initBatch.start();
//   });
  
// }
// export function listenForFlip() {
//     items.forEach(item => {
//       item.removeEventListener('click', flipBatchHandler); // remove existing listener
//       item.addEventListener('click', flipBatchHandler); // rdd new listener
//     });
//   }

  
//   export function killFlip() {
//     flipBatch.kill();
//   }
  
// export function listenForFlip() {
//     const contentItems = items.filter(item => !item.classList.contains('fixed-item'));
//     contentItems.forEach(item => {
//       flipBatch.addEventListener('click', flipBatchHandler);
//     });
//   }
  
  
