console.log("nav loaded");
//import libs 
import gsap from 'gsap';
import EasePack from 'gsap/EasePack';
import { Power4 } from 'gsap/gsap-core';
gsap.registerPlugin(Power4);
gsap.registerPlugin(EasePack);


export class Navigation {
    constructor() {
      this.setupNavigationEvents();
      this.logWindowSize();
     
      window.onresize = () => this.logWindowSize(); // Use arrow function
    }
  
    setupNavigationEvents(): void {
      const showButton = document.querySelector('.navigation .toggle-wrapper .show');
      const hideButton = document.querySelector('.navigation .toggle-wrapper .hide');
      const xMarkSpan = document.querySelector('.xmark--closer__span');
      const navigation = document.querySelector('.navigation');
      console.log('Setting up event listeners');

      showButton?.addEventListener('click', (e) => {
        // console.log('Show button clicked');
        this.toggleNavigation(true);
      
        e.stopPropagation();
      });
  
      hideButton?.addEventListener('click', (e) => {
        this.toggleNavigation(false);
        e.stopPropagation();
      });
  
      xMarkSpan?.addEventListener('click', (e) => {
        this.xMarksSpot();
        e.stopPropagation();
      });
  
      navigation?.addEventListener('click', (e) => {
        this.toggleNavigation(false);
        e.stopPropagation();
      });
  
      const toggleWrapper = navigation?.querySelector('.toggle-wrapper');
      toggleWrapper?.addEventListener('click', (e) => {
        this.toggleNavigation(true);
    
        e.stopPropagation();
      });
    }
  
   toggleNavigation(isOpen: boolean): void {
      const navigation = document.querySelector('.navigation');
      if (isOpen) {
        navigation?.classList.add('open');
     
       
      } else {
        navigation?.classList.remove('open');
      }
    }
  
   xMarksSpot(): void {
      const xMarkSpan = document.querySelector('.xmark--closer__span');
      const navigation = document.querySelector('.navigation');

      xMarkSpan?.classList.toggle('visible');
      navigation?.classList.remove('open');
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
      console.log("Window width: ", window.innerWidth, "px");
      console.log("Window height: ", window.innerHeight, "px");
    }




    }


  
  export class AnimationHandler {
   tl: gsap.core.Timeline;
//    navigation = document.querySelector(".navigation");
    constructor() {
      this.tl = this.setupGSAPtl();
    //   this.playTl();
    }
   
    setupGSAPtl(): gsap.core.Timeline {
      return gsap.timeline({
        paused: true,
        defaults: { 
            duration: 0.8, 
            ease: "Power4.ease" 
            
        },
      })


    }
  

  }