console.log("nav loaded");
//import libs 
import gsap from 'gsap';
import EasePack from 'gsap/EasePack';
import { Power4 , Power2} from 'gsap/gsap-core';
import Timeline from 'gsap/all';
gsap.registerPlugin(Power4);
gsap.registerPlugin(EasePack);
gsap.registerPlugin(Timeline);
gsap.registerPlugin(Power2);
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
      // y:0,
      ease: 'power2.in',
      delay: 0.5,
      duration: 1.25,
      autoAlpha: 1,
      backgroundColor: "rgba(0, 0, 0, 0.80)",
      paused: true,
      // clearProps: "all",
    //  onComplete: () => {
    //   clearProps: "all",
    //  }



  });
  tweenWrap =  gsap.to(".show", {
    ease: 'power2.in',
    duration: 0.75,
    autoAlpha: 1,
    stagger: 0.2,
    paused: true,
    onStart: () => {
    // this.navigation?.clientTop = 90;
    }

  });
  tweenX = gsap.to(".xmark--closer__span", {
    ease: 'power2.in',
    autoAlpha: 0.75,
    duration:0.75,
    stagger:0.2,

  })
  tweenText = gsap.to('.navigation .toggle-wrapper .show', {
    ease: 'power2.in',
    autoAlpha: 1,
    duration:0.75,
    stagger:0.2,
    paused: true,
  })

    setupNavigationEvents(): void {
      const showButton = document.querySelector('.navigation .toggle-wrapper .show');
      const hideButton = document.querySelector('.navigation .toggle-wrapper .hide');
      const xMarkSpan = document.querySelector('.xmark--closer__span');
      const navigation = document.querySelector('.navigation');
     

    //   console.log('Setting up event listeners');

      showButton?.addEventListener('click', (e) => {
        // console.log('Show button clicked');
        this.toggleNavigation(true);
        this.tweenWrap.play();
        this.tweenX.play();

        e.stopPropagation();
      });
  
      hideButton?.addEventListener('click', (e) => {
        this.toggleNavigation(false);
        this.tweenText.play();

        e.stopPropagation();
      });
  
      xMarkSpan?.addEventListener('click', (e) => {
        this.xMarksSpot();
        this.tweenX.reverse();

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
        this.tweenX.restart();
        this.tweenWrap.restart();

        e.stopPropagation();
      });
    }
  


   toggleNavigation(isOpen: boolean): void {
       const navigation = document.querySelector('.navigation') as HTMLElement;
       const originalWrapper = document.querySelector('#about') as HTMLElement;
     
      if (isOpen) {
        navigation?.classList.add('open');
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

