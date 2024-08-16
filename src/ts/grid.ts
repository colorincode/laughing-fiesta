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
  // const gallery = document.querySelector(".gallery");
  //   const imgPreview = document.querySelector(".imgPreview");
  //   const imgs = document.querySelectorAll(".imgContainer");
  //   let isimgPreviewOpen = false;
  //   let activeImg: string | Element | Window | null = null;
  //   let activeImgParent: ParentNode | null = null;
  
const gsapDefaults = {
     overwrite: true 
     
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
      
    // const debouncedCleanup = () => {
    //     if (cleanupDelayedCall) {
    //     cleanupDelayedCall.kill();
    //     }
    // cleanupDelayedCall = gsap.delayedCall(3, () => {
    //     if (!isAnimating) {
    //     gsap.killTweensOf(items);
    //     timeline.clear();
    //     eventDispatcher.dispose();
    //     console.log("Animation cleanup completed");
    //     }
    // });
    // };
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
        actions.length = 0;
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
  
  // batch and add action
  const initializeSizesBatch: FlipBatchAction = {
    self: { state: {} as Flip.FlipState },
    getState(self) {
      return Flip.getState(".grid__item");
    },
    setState(self) {
        const sizes = ['small', 'medium', 'large'];
        const contentItems = items.filter(item => !item.classList.contains('fixed-item'));
        const availableAreas = getAvailableGridAreas();
    
        // contentItems.forEach((item, index) => {
        //   // random size
        //   const sizeClass = sizes[Math.floor(Math.random() * sizes.length)];
        //   item.classList.remove('small', 'medium', 'large');
        //   item.classList.add(sizeClass);
    
        //   // random position
        //   const area = availableAreas[index % availableAreas.length];
        //   const [row, col] = area.split('/').map(Number);
        //   item.style.gridArea = `${row} / ${col} / auto / span 1`;
        // });
    
        return contentItems;
      },
      animate(self) {
        Flip.from(self.state, {
          duration: 0.8,
          ease: "power4.inOut",
          absolute: true,
          stagger: 0.05,
          onComplete: () => {
            console.log("Initial layout animation completed");
          }
        });
      },
      onStart(self) {
        console.log("Initializing grid item sizes and positions");
      },
      onComplete(self) {
        console.log("Grid item sizes and positions initialized");
      },
      once: true
    };

    // interface GalleryModalBatch {
    //   self: {
    //     state: FlipState;
    //     targets: Element[];
    //   };
    //   getState: (self: GalleryModalBatch['self']) => FlipState;
    //   setState: (self: GalleryModalBatch['self']) => Element[];
    //   animate: (self: GalleryModalBatch['self']) => void;
    //   onStart: (self: GalleryModalBatch['self']) => void;
    //   onComplete: (self: GalleryModalBatch['self']) => void;
    //   once: boolean;
    // }
    // const galleryModalBatch: FlipBatchAction = {
    //   self: { state: {} as Flip.FlipState, targets: [] as Element[] },
    //   getState(self) {
    //     return Flip.getState(self.targets);
    //   },
    //   setState(self) {
    //     const clickedImg = self.targets[0] as HTMLElement;
    //     if (!clickedImg) {
    //       console.warn("No target found for gallery modal");
    //       return [];
    //     }
    //     const imgMask = clickedImg.querySelector(".wrap");
    //     const img = clickedImg.querySelector("img");
    //     gsap.set(imgPreview, { autoAlpha: 1 });
    //     activeImg = imgMask;
    //     // activeImgImg = img;
    //     activeImgParent = imgMask.parentNode;
    //     imgPreview.appendChild(imgMask);
    //     return [imgMask, img];
    //   },
    //   animate(self) {
    //     const [imgMask, img] = self.targets as HTMLElement[];
    //     if (!imgMask || !img) {
    //       console.warn("Missing elements for gallery modal animation");
    //       return;
    //     }
    //     const imgState = Flip.getState([imgMask, img]);
    //     Flip.from(imgState, {
    //       duration: 1,
    //       ease: "power3.inOut",
    //       scale: true,
    //       onStart: () => {
    //         imgPreview.classList.add("imgPreview--active");
    //       },
    //       onComplete: () => {
    //         isimgPreviewOpen = true;
    //       },
    //     });
    //   },
    //   onStart(self) {
    //     console.log("Gallery modal animation started");
    //   },
    //   onComplete(self) {
    //     console.log("Gallery modal animation completed");
    //   },
    //   once: false,
    // };

    function getAvailableGridAreas() {
      const areas = [];
      for (let row = 1; row <= 12; row++) {
        for (let col = 1; col <= 12; col++) {
          // exclude top-left, top-right, center, and content areas
          if (!((row >= 1 && row <= 4 && col >= 1 && col <= 4) ||
                (row >= 1 && row <= 3 && col >= 9 && col <= 12) ||
                (row >= 4 && row <= 6 && col >= 5 && col <= 8) ||
                (row >= 7 && row <= 12 && col >= 1 && col <= 12))) {
            areas.push(`${row}/${col}`);
          }
        }
      }
      return gsap.utils.shuffle(areas);
    }

  //function invocation and ex ports
  const flipBatch = createFlipBatch();
  const initBatch = createFlipBatch();
  initBatch.add(initializeSizesBatch);
  // flipBatch.add(galleryModalBatch);



  const flipBatchHandler = (e: Event) => {
    // const clickedImg = e.currentTarget as HTMLElement;
    // galleryModalBatch.self.targets = [clickedImg];
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
export function initSize () {
    window.addEventListener('load', () => {
    initBatch.start();
  });
  
}

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


      // const contentModalBatch: FlipBatchAction = {
    //   self: { state: {} as Flip.FlipState, targets: [] as Element[] },
      
    //   getState(self) {
    //     return Flip.getState(self.targets);
    //   },
    //   setState(self) {
    //     const clickedItem = self.targets[0] as HTMLElement;
    //     if (!clickedItem) {
    //       console.warn("No target found for content modal");
    //       return [];
    //     }
        
    //   // clone the clicked item and append it to the fullscreen element
    //   // const clonedItem = clickedItem.cloneNode(true) as HTMLElement;
    //   // const fullscreenElement = document.querySelector('.fullscreen--scale') as HTMLElement;
    //   // fullscreenElement.appendChild(clonedItem);
    // // Add close button

    // //set grid, preview vid and regular vid up 
 
    //     const closeButton = document.createElement('button');
    //     closeButton.textContent = 'Close';
    //     closeButton.classList.add('modal-close');
    //     fullscreenElement.appendChild(closeButton);

    //   // Show the fullscreen element
    //   gsap.set(fullscreenElement, { display: 'block', opacity: 0 });
    //   gsap.to(fullscreenElement, { opacity: 1, duration: 0.3 });
    //     // Open the modal and pass the clicked item to it
    //     modal.open(clickedItem);
        
    //     return [clickedItem];
    //   },
    //   animate(self) {
    //     const [originalItem] = self.targets as HTMLElement[];
    //     if (!originalItem) {
    //       console.warn("No target found for content modal animation");
    //       return;
    //     }
        
    //     const state = Flip.getState(originalItem);
    //     Flip.from(state, {
    //       duration: 0.5,
    //       ease: "power4.inOut",
    //       scale: true,
    //       absolute: true,
    //       onComplete: () => {
    //         // originalItem.style.visibility = 'hidden';
    //         //             clonedItem.classList.add('modal-active');
    //         //             gsap.to(fullscreenElement, { opacity: 1, duration: 0.3 });
    //       }
    //     });
    //   },
    //   onStart(self) {
    //     console.log("Content modal animation started");
    //   },
    //   onComplete(self) {
    //     console.log("Content modal animation completed");
    //   },
    //   once: false
    // };
    
//   const contentModalBatch: FlipBatchAction = {
//     self: { state: {} as Flip.FlipState, targets: [] as Element[] },
//     getState(self) {
//       return Flip.getState(self.targets);
//     },
//     setState(self) {
//       const clickedItem = self.targets[0] as HTMLElement;
//       if (!clickedItem) {
//         console.warn("No target found for content modal");
//         return [];
//       }
  
//       // Remove size classes
//       clickedItem.classList.remove('small', 'medium', 'large');
  
//       const fullscreenElement = document.querySelector('.fullscreen--scale') as HTMLElement;
//       if (!fullscreenElement) {
//         console.warn("Fullscreen element not found");
//         return [];
//       }
  
//       // Clear any existing content in the fullscreen element
//       fullscreenElement.innerHTML = '';
  
//       // Clone the clicked item and append it to the fullscreen element
//       const clonedItem = clickedItem.cloneNode(true) as HTMLElement;
//       fullscreenElement.appendChild(clonedItem);
//     // Add close button
//         const closeButton = document.createElement('button');
//         closeButton.textContent = 'Close';
//         closeButton.classList.add('modal-close');
//         fullscreenElement.appendChild(closeButton);

//       // Show the fullscreen element
//     //   gsap.set(fullscreenElement, { display: 'block', opacity: 0 });
//     //   gsap.to(fullscreenElement, { opacity: 1, duration: 0.3 });
  
//       return [clickedItem, clonedItem, fullscreenElement];
//     },
//     animate(self) {
//         const [originalItem, clonedItem, fullscreenElement] = self.targets as HTMLElement[];
//         if (!originalItem || !clonedItem || !fullscreenElement) {
//           console.warn("Missing elements for content modal animation");
//           return;
//         }
//       const state = Flip.getState(originalItem);
//     // Show the fullscreen element
//     gsap.set(fullscreenElement, { display: 'block', opacity: 0 });
//       Flip.from(state, {
//         duration: 0.5,
//         ease: "power2.inOut",
//         scale: true,
//         absolute: true,
//         onComplete: () => {
//             originalItem.style.visibility = 'hidden';
//             clonedItem.classList.add('modal-active');
//             gsap.to(fullscreenElement, { opacity: 1, duration: 0.3 });
//         }
//       });
  
//       // Add close functionality
//  // Add close functionality
//  const closeModal = () => {
//     const modalState = Flip.getState(clonedItem);

//     Flip.from(modalState, {
//       duration: 0.5,
//       ease: "power2.inOut",
//       scale: true,
//       absolute: true,
//       onComplete: () => {
//         fullscreenElement.innerHTML = '';
//         gsap.set(fullscreenElement, { display: 'none' });
//         originalItem.style.visibility = 'visible';
//       }
//     });

//     gsap.to(fullscreenElement, { opacity: 0, duration: 0.3 });
//     document.removeEventListener('click', closeModal);
//   };

//   document.addEventListener('click', (e) => {
//     if (e.target === fullscreenElement) closeModal();
//   });
// },
// onStart(self) {
//   console.log("Content modal animation started");
// },
// onComplete(self) {
//   console.log("Content modal animation completed");
// },
// once: false
// };
  
// const contentModalBatch: FlipBatchAction = {
//     self: { state: {} as Flip.FlipState, targets: [] as HTMLElement[] },
//     getState(self) {
//       return Flip.getState(self.targets);
//     },
//     setState(self) {
//       const clickedItem = self.targets[0];
//       if (!clickedItem) {
//         console.warn("No target found for content modal");
//         return [];
//       }
      
//       const modalContainer = document.querySelector('.fullscreen--scale') as HTMLElement;
//       if (!modalContainer) {
//         console.error("Modal container not found");
//         return [];
//       }
  
//       const closeIcon = modalContainer.querySelector('.xmark--closer') as HTMLElement;
//       if (!closeIcon) {
//         console.warn("Close icon not found");
//       }
  
//       // Show the modal container
//       gsap.set(modalContainer, { display: 'block', opacity: 0 });
//       gsap.to(modalContainer, { opacity: 1, duration: 0.3 });
  
//       // Clone and move the clicked item to the modal container
//       const clonedItem = clickedItem.cloneNode(true) as HTMLElement;
//       modalContainer.appendChild(clonedItem);
  
//       return [clickedItem, clonedItem, modalContainer];
//     },
//     animate(self) {
//       const [originalItem, clonedItem, modalContainer] = self.targets;
//       if (!originalItem || !clonedItem || !modalContainer) {
//         console.warn("Missing elements for content modal animation");
//         return;
//       }
  
//       const state = Flip.getState(originalItem);
  
//       Flip.from(state, {
//         duration: 0.5,
//         ease: "power2.inOut",
//         scale: true,
//         absolute: true,
//         onComplete: () => {
//           originalItem.style.visibility = 'hidden';
//           clonedItem.classList.add('modal-active');
//         }
//       });
  
//       // Add close functionality
//       const closeIcon = modalContainer.querySelector('.xmark--closer') as HTMLElement;
//       if (closeIcon) {
//         closeIcon.addEventListener('click', () => this.closeModal(originalItem, clonedItem, modalContainer));
//       }
//     },
//     closeModal(originalItem: HTMLElement, clonedItem: HTMLElement, modalContainer: HTMLElement) {
//       const modalState = Flip.getState(clonedItem);
  
//       Flip.from(modalState, {
//         duration: 0.5,
//         ease: "power2.inOut",
//         scale: true,
//         absolute: true,
//         onComplete: () => {
//           modalContainer.innerHTML = '';
//           gsap.set(modalContainer, { display: 'none' });
//           originalItem.style.visibility = 'visible';
//         }
//       });
  
//       gsap.to(modalContainer, { opacity: 0, duration: 0.3 });
//     },
//     onStart(self) {
//       console.log("Content modal animation started");
//     },
//     onComplete(self) {
//       console.log("Content modal animation completed");
//     },
//     once: false
//   };
  
//   const contentModalBatch: FlipBatchAction = {
    
//     self: { state: {} as Flip.FlipState, targets: [] as Element[] },
//     getState(self) {
//       return Flip.getState(self.targets);
//     },
//     setState(self) {
//       const clickedItem = self.targets[0] as HTMLElement;
//       if (!clickedItem) {
//         console.warn("No target found for content modal");
//         return [];
//       }
    
//       const modalContainer = document.querySelector('.fullscreen--scale') as HTMLElement;
//       const closeIcon = modalContainer.querySelector('.xmark--closer') as HTMLElement;
  
//       // Show the modal container
//       gsap.set(modalContainer, { display: 'block', opacity: 0 });
//       gsap.to(modalContainer, { opacity: 1, duration: 0.3 });
  
//       // Move the clicked item to the modal container
//       modalContainer.appendChild(clickedItem.cloneNode(true));
  
//       return [clickedItem, modalContainer];
//     },
//     animate(self) {
//         const [originalItem, clonedItem] = self.targets as HTMLElement[];
//         if (!originalItem || !clonedItem) {
//           console.warn("No target found for content modal animation");
//           return;
//         }
//         const fullscreenElement = document.querySelector('.fullscreen--scale') as HTMLElement;
//         if (!fullscreenElement) {
//           console.warn("Fullscreen element not found");
//           return;
//         }
//         const state = Flip.getState(originalItem);
//         Flip.from(state, {
//             duration: 0.5,
//             ease: "power2.inOut",
//             scale: true,
//             absolute: true,
//             onComplete: () => {
//               originalItem.style.visibility = 'hidden';
//               fullscreenElement.classList.add('modal-active'); // Add class to fullscreen element
//               clonedItem.style.width = '100%';
//               clonedItem.style.height = '100%';
//                                 }
//           });
//           const closeModal = (e: MouseEvent) => {
//             if (e.target !== fullscreenElement.querySelector('.xmark--closer')) return;
          
//             const modalState = Flip.getState(clonedItem);
          
//             Flip.from(modalState, {
//               duration: 0.5,
//               ease: "power2.inOut",
//               scale: true,
//               absolute: true,
//               onComplete: () => {
//                 fullscreenElement.classList.remove('modal-active'); // Remove class from fullscreen element
//                 fullscreenElement.innerHTML = '';
//                 gsap.set(fullscreenElement, { display: 'none' });
//                 originalItem.style.visibility = 'visible';
                
//                 // Reapply size classes
//                 const sizes = ['small', 'medium', 'large'];
//                 const randomSize = sizes[Math.floor(Math.random() * sizes.length)];
//                 originalItem.classList.add(randomSize);
//               }
//             });
          
//             document.removeEventListener('click', closeModal);
//           };
          

//     },
//     onStart(self) {
//       console.log("Content modal animation started");
//     },
//     onComplete(self) {
//       console.log("Content modal animation completed");
//     },
//     once: false
//   };
  

  
  


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
  
  
