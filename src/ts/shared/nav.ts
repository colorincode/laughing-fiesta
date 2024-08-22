console.log("nav loaded");
//import libs 
import gsap from 'gsap';
import EasePack from 'gsap/EasePack';
import { Power4 } from 'gsap/gsap-core';
import Timeline from 'gsap/all';
gsap.registerPlugin(Power4);
gsap.registerPlugin(EasePack);
gsap.registerPlugin(Timeline);



export class Navigation {
   tl = gsap.timeline({})
;
   navigation = document.querySelector('.navigation');
   originalWrapper = document.querySelector('#about');
    constructor() {
      
      this.setupNavigationEvents();
      this.logWindowSize();
   

      window.onresize = () => this.logWindowSize(); // Use arrow function
    }

    tweenNav = gsap.to(".navigation", {
      y:0,
      ease: Power4.easeIn,
      duration: 0.75,
      autoAlpha: 1,
      // stagger: 0.2,
      paused: true,
      // transformOrigin:"0% 100%",
  });
  tweenWrap =  gsap.to(".show", {

    y:40,
    ease: Power4.easeOut,
    duration: 0.75,
    autoAlpha: 1,
    stagger: 0.2,
    paused: true,
    // transformOrigin:"0% 100%",
    onStart: () => {
    // this.navigation?.clientTop = 90;




    }

  });

    setupNavigationEvents(): void {
      const showButton = document.querySelector('.navigation .toggle-wrapper .show');
      const hideButton = document.querySelector('.navigation .toggle-wrapper .hide');
      const xMarkSpan = document.querySelector('.xmark--closer__span');
      const navigation = document.querySelector('.navigation');
     

    //   console.log('Setting up event listeners');

      showButton?.addEventListener('click', (e) => {
        // console.log('Show button clicked');
        this.toggleNavigation(true);
        // this.tweenNav.play();
        this.tweenWrap.play();

        e.stopPropagation();
      });
  
      hideButton?.addEventListener('click', (e) => {
        this.toggleNavigation(false);

        e.stopPropagation();
      });
  
      xMarkSpan?.addEventListener('click', (e) => {
        this.xMarksSpot();
        // this.tweenWrap.play();

        e.stopPropagation();
      });
  
      navigation?.addEventListener('click', (e) => {
        this.toggleNavigation(false);
       this.tweenNav.reverse();

        e.stopPropagation();
      });
  
      const toggleWrapper = navigation?.querySelector('.toggle-wrapper');
      toggleWrapper?.addEventListener('click', (e) => {
        this.toggleNavigation(true);
        this.tweenNav.restart();
        this.tweenWrap.restart();

        e.stopPropagation();
      });
    }
  


   toggleNavigation(isOpen: boolean): void {
       const navigation = document.querySelector('.navigation') as HTMLElement;
       const originalWrapper = document.querySelector('#about') as HTMLElement;
     
      if (isOpen) {
        navigation?.classList.add('open');
        // this.tweenSet.play();
        this.tweenNav.play();
        this.tweenNav.restart(); // this to fix an issue where tween only fired once

       
      } else {
        navigation?.classList.remove('open');
        
        this.tweenWrap.play();
        this.tweenNav.reverse();
   

      }
    }
  
   xMarksSpot(): void {
      const xMarkSpan = document.querySelector('.xmark--closer__span');
      const navigation = document.querySelector('.navigation');

      xMarkSpan?.classList.toggle('visible');
      navigation?.classList.remove('open');
      // gsap.to(navigation, {
      //   yPercent:5,
      //   ease: Power4.easeIn,
      //   duration: 0.224,
      //   autoAlpha: 1,

      // })
    }
  
   isClassActive(className: string): boolean {
      const elements = Array.from(document.querySelectorAll(`.${className}`));
      return elements.some((el) => el.classList.contains(className));
    }
  
   checkforAnimation(): void {
      const navigation = document.querySelector('.navigation');
      if (this.isClassActive('is-animating')) {
        navigation?.classList.add('open');
       
      } else {
        navigation?.classList.remove('open');
       
      }
    }
  
    logWindowSize(): void {
    //   console.log("Window width: ", window.innerWidth, "px");
    //   console.log("Window height: ", window.innerHeight, "px");
    }




    }


  
//   export class AnimationHandler {
//    tl: gsap.core.Timeline;
// //    navigation = document.querySelector(".navigation");
//     constructor() {
//       this.tl = this.setupGSAPtl();
//     //   this.playTl();
//     }
   
//     setupGSAPtl(): gsap.core.Timeline {
//       return gsap.timeline({
//         paused: true,
//         defaults: { 
//             duration: 0.8, 
//             ease: "Power4.ease" 
            
//         },
//       })


//     }
  

//   }