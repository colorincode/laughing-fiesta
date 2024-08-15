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

//local imports
import {EventDispatcher} from "./shared/eventdispatch";

//constants
const grid = document.querySelector(".homegrid__container") as any;
const items = gsap.utils.toArray(".grid__item") as HTMLElement[];
const originalStates = new Map<Element, { parent: Element, index: number, position: { top: number, left: number, width: number, height: number } }>();
const POSITION_CLASSES = {
    NORTH_WEST: 'pos-north-west',
    NORTH_EAST: 'pos-north-east',
    SOUTH_WEST: 'pos-south-west',
    SOUTH_EAST: 'pos-south-east',
  };
  
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
  }

  const createFlipBatch = (): FlipBatch => {
    const actions: FlipBatchAction[] = [];
    const timeline = gsap.timeline();
    //call event defense
    const eventDispatcher = new EventDispatcher();

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
        return timeline;
      },
      timeline: timeline,
      kill: () => {
        timeline.kill();
        actions.length = 0;
        eventDispatcher.dispose();
      },
      cleanup: () => {
        gsap.killTweensOf(items);
        timeline.clear();
        // eventDispatcher.dispose(); // Clean up all events
        items.forEach(item => {
            eventDispatcher.dispose(); // Clean up all events
        });
        
        console.log("Animation cleanup completed");
      },
      addEventListener: (eventType: string, callback: EventListener) => {
        eventDispatcher.addEventListener(eventType, callback);
      },
      removeEventListener: (eventType: string, callback: EventListener) => {
        eventDispatcher.removeEventListener(eventType, callback);
      },
    };
  };
  
  function getQuadrant(element: HTMLElement): string {
    const rect = element.getBoundingClientRect();
    const gridRect = grid.getBoundingClientRect();
    const centerX = gridRect.left + gridRect.width / 2;
    const centerY = gridRect.top + gridRect.height / 2;
  
    if (rect.top < centerY) {
      return rect.left < centerX ? POSITION_CLASSES.NORTH_WEST : POSITION_CLASSES.NORTH_EAST;
    } else {
      return rect.left < centerX ? POSITION_CLASSES.SOUTH_WEST : POSITION_CLASSES.SOUTH_EAST;
    }
  }
  
  // batch and add action
  const initializeSizesBatch: FlipBatchAction = {
    self: { state: {} as Flip.FlipState },
    getState(self) {
      return Flip.getState(".grid__item");
    },
    setState(self) {
      const sizes = ['small', 'medium', 'large'];
      const gridComputedStyle = window.getComputedStyle(grid);
      const gridColumns = gridComputedStyle.gridTemplateColumns.split(' ').length;
      const gridRows = gridComputedStyle.gridTemplateRows.split(' ').length;
      const totalCells = gridColumns * gridRows;
  
      // Remove any existing fill-space elements
      grid.querySelectorAll('.fill-space').forEach(el => el.remove());
  
      items.forEach((item, index) => {
        // Randomly assign a size class
        const sizeClass = sizes[Math.floor(Math.random() * sizes.length)];
        item.classList.remove('small', 'medium', 'large');
        item.classList.add(sizeClass);
  
        // Set CSS variables for item size
        item.style.setProperty('--item-width', getComputedStyle(item).width);
        item.style.setProperty('--item-height', getComputedStyle(item).height);
      });
  
      // Add fill-space elements
      const remainingCells = totalCells - items.length;
      for (let i = 0; i < remainingCells; i++) {
        const fillSpace = document.createElement('div');
        fillSpace.classList.add('fill-space');
        grid.appendChild(fillSpace);
      }
  
      return items;
    },
    animate(self) {
      // No animation needed for initialization
    },
    onStart(self) {
      console.log("Initializing grid item sizes");
    },
    onComplete(self) {
      console.log("Grid item sizes initialized");
    },
    once: true
  };
  
  const flipBatch = createFlipBatch();
  const initBatch = createFlipBatch();
  initBatch.add(initializeSizesBatch);
  
  // Call this function when the page loads
//   window.addEventListener('load', () => {
//     initBatch.start();
//   });
  



  const flipgridBatch: FlipBatchAction = {
    self: { state: {} as Flip.FlipState },
    getState(self) {
      return Flip.getState(".grid__item");
    },
    setState(self) {
      // Get the current grid layout
      const gridComputedStyle = window.getComputedStyle(grid);
      const gridColumns = gridComputedStyle.gridTemplateColumns.split(' ').length;
      const gridRows = gridComputedStyle.gridTemplateRows.split(' ').length;
  
      // Create an array of all possible grid positions
      const positions = [];
      for (let row = 1; row <= gridRows; row++) {
        for (let col = 1; col <= gridColumns; col++) {
          positions.push({ row, col });
        }
      }
  
      // Shuffle the positions
      const shuffledPositions = gsap.utils.shuffle(positions);
  
      // Assign new positions to items
      items.forEach((item, index) => {
        const { row, col } = shuffledPositions[index];
        item.style.gridArea = `${row} / ${col} / auto / span 1`;
      });
  
      return items;
    },
    animate(self) {
      Flip.from(self.state, {
        duration: 0.8,
        ease: "power4.inOut",
        absolute: true,
        stagger: 0.05,
        onEnter: elements => {
          gsap.fromTo(elements, 
            { 
              opacity: 0,
              rotation: () => gsap.utils.random(-45, 45),
            },
            { 
              opacity: 1,
              rotation: 0,
              duration: 0.8,
              ease: "back.out(1.7)"
            }
          );
        },
        onLeave: elements => {
          gsap.to(elements, {
            opacity: 0,
            rotation: () => gsap.utils.random(-45, 45),
            duration: 0.8,
            ease: "back.in(1.7)"
          });
        },
      });
    },
    onStart(self) {
      console.log("Shuffle animation started");
    },
    onComplete(self) {
      console.log("Shuffle animation completed");
      items.forEach((item, index) => {
        const finalQuadrant = getQuadrant(item);
        console.log(`Item ${index + 1} ended up in quadrant: ${finalQuadrant}`);
      });
    },
    once: false
  };
  
  
  
  //function invocation and ex ports
  flipBatch.add(flipgridBatch);
  const flipBatchHandler = () => {
    flipBatch.start().then(() => {
      flipBatch.cleanup(); // Clean up after animation completes
    });
  };
  
  // exports
export function initSize () {
    window.addEventListener('load', () => {
    initBatch.start();
  });
  
}

export function listenForFlip() {
    items.forEach(item => {
      flipBatch.addEventListener('click', flipBatchHandler);
    });
  }
  
  export function killFlip() {
    flipBatch.kill();
  }
  
  
//   function getQuadrant(element: HTMLElement): string {
//     const rect = element.getBoundingClientRect();
//     const gridRect = grid.getBoundingClientRect();
//     const centerX = gridRect.left + gridRect.width / 2;
//     const centerY = gridRect.top + gridRect.height / 2;
  
//     if (rect.top < centerY) {
//       return rect.left < centerX ? POSITION_CLASSES.NORTH_WEST : POSITION_CLASSES.NORTH_EAST;
//     } else {
//       return rect.left < centerX ? POSITION_CLASSES.SOUTH_WEST : POSITION_CLASSES.SOUTH_EAST;
//     }
//   }
  
  
// const batch = createFlipBatch();


// const flipgridBatch = batch.add({
//     self: { state: {} as Flip.FlipState },
//     getState(self) {
//       return Flip.getState(".grid__item");
//     },
//     setState(self) {
//       for (let i = items.length; i >= 0; i--) {
//         grid.appendChild(grid.children[Math.random() * i | 0]);
//       }
//       return items;
//     },
//     animate(self) {
//       Flip.from(self.state, {
//         duration: 0.8,
//         ease: "power4.inOut",
//         absolute: true,
//         stagger: 0.05,
//         onEnter: elements => {
//           gsap.fromTo(elements, 
//             { 
//               opacity: 0, 
//               scale: 0, 
//               x: () => gsap.utils.random(-window.innerWidth / 2, window.innerWidth / 2),
//               y: () => gsap.utils.random(-window.innerHeight / 2, window.innerHeight / 2),
//             },
//             { 
//               opacity: 1, 
//               scale: 1, 
//               duration: 0.8,
//               x: 0,
//               y: 0,
//               ease: "power4.inOut"
//             }
//           );
//         },
//         onLeave: elements => {
//           gsap.to(elements, {
//             opacity: 0,
//             scale: 0,
//             x: () => gsap.utils.random(-window.innerWidth / 2, window.innerWidth / 2),
//             y: () => gsap.utils.random(-window.innerHeight / 2, window.innerHeight / 2),
//             duration: 0.8,
//             ease: "power4.inOut"
//           });
//         },
//         onComplete: () => {
//           // Track final positions of items
//           items.forEach((item, index) => {
//             const finalQuadrant = getQuadrant(item);
//             console.log(`Item ${index + 1} ended up in quadrant: ${finalQuadrant}`);
//           });
//         }
//       });
//     },
//     onStart(self) {
//       console.log("Shuffle animation started");
//     },
//     onComplete(self) {
//       console.log("Shuffle animation completed");
//     },
//     once: false
//   });
// //   flipBatch.add(flipgridBatch);

//   export function shuffle() {
//     const state = Flip.getState(items);
    
//     for (let i = items.length; i >= 0; i--) {
//       grid.appendChild(grid.children[Math.random() * i | 0]);
//     }
  
//     items.forEach(item => {
//       const quadrant = getQuadrant(item);
//       item.classList.remove(...Object.values(POSITION_CLASSES));
//       item.classList.add(quadrant);
//     });
  
//     Flip.from(state, {
//       absolute: true,
//       ease: "power1.inOut",
//       duration: 0.5,
//       onComplete: () => console.log("Shuffle complete")
//     });
//   }
  

//   const flipBatch = createFlipBatch();
// flipBatch.add(flipgridBatch);

// const anotherBatch = createFlipBatch();
// // anotherBatch.add(someOtherAction);
// // anotherBatch.start(); // Starts some other animation

//   export function listenForFlip() {
//     document.querySelectorAll('.grid__item').forEach(item => {
//       item.addEventListener('click', () => {
//         flipBatch.start();
//       });
//     });
//   }
  

// export function killFlip () {
//     document.querySelectorAll('.grid__item').forEach(item => {
//           batch.timeline.stop();
//           batch.kill();
//       });
// }
// const flipgridBatch = batch.add({
//   self: { state: {} as Flip.FlipState },
//   getState(self) {
//     return Flip.getState(".grid__item");
//   },
//   setState(self) {
//     // self.classList.toggle("active");
//     // return gsap.utils.toArray(".grid__item");
//      for (let i = items.length; i >= 0; i--) {
//         grid.appendChild(grid.children[Math.random() * i | 0]);
//       }
//       return items;
//   },
//   animate(self) {
//     const randomY = gsap.utils.random(-window.innerHeight / 2, window.innerHeight / 2);
//     const randomX = gsap.utils.random(-window.innerWidth / 2, window.innerWidth / 2);
//     Flip.from(self.state, {
//       duration: 0.5,
//       ease: "power4.inOut",
//       absolute: true,
//       stagger: 0.05,
//       onEnter: elements => {
//         gsap.fromTo(elements, 
//           { 
//             opacity: 0, 
//             scale: 0, 
//             x: () => randomX,
//             y: () => randomY,
          
//           },
//           { 
//             opacity: 1, 
//             scale: 1, 
//             duration: 0.8,
//             x: 0,
//             y: 0,
//             ease: "power4.inOut"
//           }
//         );
//       },
//       onLeave: elements => {
//         gsap.to(elements, {
//           opacity: 0,
//           scale: 0,
//           x: () => randomX,
//           y: () => randomY,
//         //   x: () => gsap.utils.random(-500, 500),
//         //   y: () => gsap.utils.random(-600, 300),
//           duration: 0.8,
//           ease: "power4.inOut"
//         });
//       }
//     });
//   },
//   onStart(self) {
//     console.log("Shuffle animation started");
//   },
//   onComplete(self) {
//     console.log("Shuffle animation completed");
//   },
//   once: false
// });



// // You can now call this multiple times
// batch.add(/* ... */);
// batch.add(/* ... */);
// batch.start();
// add an action to the batch
// let action = flipBatch;

//shuffle the grid 
// export function shuffle () {
//     const state = Flip.getState([items, grid]);  
//     for(let i = items.length; i >= 0; i--) {
//         grid.appendChild(grid.children[Math.random() * i | 0]);
//     }
// }


//       onEnter: (elements) => {
//         elements.forEach((el: HTMLElement) => {
//           const randomX = gsap.utils.random(-window.innerWidth / 2, window.innerWidth / 2);
//           const randomY = gsap.utils.random(-window.innerHeight / 2, window.innerHeight / 2);
//           gsap.fromTo(el, 
//             { opacity: 0, scale: 0.5, x: randomX, y: randomY },
//             { opacity: 1, scale: 1, x: 0, y: 0, duration: 0.5, ease: "back.out(1.7)" }
//           );
//         });
//       },
//       onLeave: (elements) => {
//         elements.forEach((el: HTMLElement) => {
//           const randomX = gsap.utils.random(-window.innerWidth / 2, window.innerWidth / 2);
//           const randomY = gsap.utils.random(-window.innerHeight / 2, window.innerHeight / 2);
//           gsap.to(el, { 
//             opacity: 0, 
//             scale: 0.5, 
//             x: randomX, 
//             y: randomY, 
//             duration: 0.5 
//           });
//         });
//       },
//       onComplete: () => {
//         const quadrantCounts = {
//           NORTH_WEST: 0,
//           NORTH_EAST: 0,
//           SOUTH_WEST: 0,
//           SOUTH_EAST: 0
//         };
    
//         gsap.utils.toArray(".grid__item").forEach((el: HTMLElement) => {
//             const finalQuadrant = getQuadrant(el);
//             quadrantCounts[finalQuadrant]++;
//           });
//           console.log("Final quadrant distribution:", quadrantCounts);
//         }
//       });
//     },
//     onStart(self) {
//       console.log("Animation started");
//     },
//     onComplete(self) {
//       console.log("Animation done");
//     },
//     once: false,
//   });

// Constants
// const POSITION_CLASSES = {
//     NORTH: 'pos-north',
//     SOUTH: 'pos-south',
//     WEST: 'pos-west',
//     EAST: 'pos-east',
//   };
//   //f
//   // Selecting DOM elements
//   const gridElement = document.querySelector('.video--placement--grid') as HTMLElement;
//   const gridItems = gsap.utils.toArray(gridElement.querySelectorAll('.video--figure'));
//   const gridItemsShuffled = gsap.utils.shuffle(gridItems);
//   const fullscreenElement = document.querySelector('.fullscreen--scale') as HTMLElement;

//   // Map to store the initial state of each video
//   let currentFullscreenVideo: HTMLElement | null = null;
// // Map to store the initial state of each video
// const originalStates = new Map<Element, { parent: Element, index: number, position: { top: number, left: number, width: number, height: number } }>();
//   // Flag to track fullscreen mode
// let isFullscreen = false;
//   // Flip video to fullscreen
//   const flipVideo = (video: HTMLVideoElement) => {
//     const { parent, position } = originalStates.get(video) || { parent: null, position: null };
//     if (!parent || !position) return; // Ensure parent and position are valid
  
//     if (currentFullscreenVideo && currentFullscreenVideo !== video) {
//       returnToOriginalPosition(currentFullscreenVideo);
//     }
//     insertProjectName(video);
//     // insertVideoLink(video);
//     const state = Flip.getState(video, { props: 'borderRadius' });
  
//     gsap.set(parent, { zIndex: 1 });
//     gsap.set(maskingLayer, { zIndex: 0 });
//     gsap.to(maskingLayer, { ...animationDefaults, opacity: 0.85 });
  
//     if (fullscreenElement.contains(video)) {
//       fullscreenElement.removeChild(video);
//       parent.appendChild(video);
//       // parent.removeChild(video);
//     } else {
//       parent.appendChild(video);
//       fullscreenElement.appendChild(video);
//       parent.appendChild(controlsElement);
//       parent.appendChild(projectName);
//     //   addControlEventListeners(controlsElement); // Add event listeners to controls
//       pauseOtherVideos(video); // Pause other videos
//       playFullscreenVideo(video); // Ensure fullscreen video plays
//     }
//       // Modify video attributes when in fullscreen
//       video.controls = true; // Show controls
//       video.muted = false; // Unmute the video
//     //   video.playbackRate = 1.5; // Increase playback rate
//     // Set video to fullscreen
//     gsap.set(video, {
//       position: 'fixed',
//       top: 0,
//       left: 0,
//       right:0,
//       bottom:0,
//       width: '100vw',
//       height: '90vh',
//       zIndex: 9999,
//     });
//     // Show controls
//     controlsElement.style.display = 'block';
//     projectName.style.display = 'block';

//     Flip.from(state, {
//       ...animationDefaults,
//       scale: true,
//       onComplete: () => {
//         currentFullscreenVideo = fullscreenElement.contains(video) ? video : null;
 


//       }
//     });
//   };
  



// const flip: any(elements: gsap.TweenTarget, changeFunc: () => void, vars: { [x: string]: any; onComplete?: any; delay?: any; }) {
//     elements = gsap.utils.toArray(elements);
//     vars = vars || {};
//     let tl = gsap.timeline({onComplete: vars.onComplete, delay: vars.delay || 0}),
//         bounds = elements.map((el: { getBoundingClientRect: () => any; }) => el.getBoundingClientRect()),
//         copy = {},
//         p;
//     elements.forEach((el: { _flip: gsap.core.Timeline; }) => {
//       el._flip && el._flip.progress(1);
//       el._flip = tl;
//     })
//     changeFunc();
//     for (p in vars) {
//       p !== "onComplete" && p !== "delay" && (copy[p] = vars[p]);
//     }
//     copy.x = (i: string | number, element: { getBoundingClientRect: () => { (): any; new(): any; left: number; }; }) => "+=" + (bounds[i].left - element.getBoundingClientRect().left);
//     copy.y = (i: string | number, element: { getBoundingClientRect: () => { (): any; new(): any; top: number; }; }) => "+=" + (bounds[i].top - element.getBoundingClientRect().top);
//     return tl.from(elements, copy);
//   }