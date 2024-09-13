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
   tl = gsap.timeline({});
   navigation = document.querySelector('.navigation');
   originalWrapper = document.querySelector('#about');
    constructor() {
      
      this.setupNavigationEvents();
      this.logWindowSize();
   

      window.onresize = () => this.logWindowSize(); // Use arrow function
    }
tweenNav = this.tl.fromTo('.navigation > .open',
{  
  opacity: 0,	
  scale: 0, 
  duration: 1,
  autoAlpha: 1,
  // yPercent:-100,
  
  stagger: 0.2,
},
{
  opacity: 1,
  scale: 1,
  duration: 1,
  backgroundColor: "rgba(0, 0, 0, 0.90)",
  // yPercent:0,
  ease: 'power4.in',
  paused: true,
}
)



  //   tweenNav = gsap.to(".navigation ", {
  //     // y:0,
  //     ease: 'power4.in',
  //     // delay: 0.5,
  //     duration: 1.25,
  //     autoAlpha: 1,
  //     backgroundColor: "rgba(0, 0, 0, 0.80)",
  //     // paused: true,
  //     stagger: 0.2,
  //     // clearProps: "all",
  //   //  onComplete: () => {
  //   //   clearProps: "all",
  //   //  }



  // });
  tweenWrap =  this.tl.to(".show", {
    ease: 'power2.in',
    duration: 0.75,
    autoAlpha: 1,
    // stagger: 0.2,
    paused: true,
    onStart: () => {
    // this.navigation?.clientTop = 90;
    }

  });
  tweenX = this.tl.fromTo(".xmark--closer", {
    ease: 'power4.inOut',
    scaleY: 0,
    autoAlpha: 0,
    opacity: 0,
    duration:0.7,
    stagger:0.2,
    yPercent:5,
  }, {
  
    scaleY: 1,
    scale:1,
    autoAlpha: 1,
    opacity: 1,
    duration:0.7,
 
    stagger:0.2,
    yPercent:-5,
  })
  tweenText = this.tl.to('.navtext', {
    ease: 'power4.in',
    opacity: 1,
    scaleY: 1,
    // autoAlpha: 1,
    // yPercent:3,

  })
  sidenavTl = this.tl.fromTo(".sidenav__desktop", 
    {
      // yPercent:5,
      // xPercent:0,
      autoAlpha: 1,
      duration: 0.7,
      stagger:0.2,
      ease: 'none',
  }, {
  
  // scale: 1,
  // stagger:0.2,
  // duration: 0.7,
  // duration: 1,
  autoAlpha: 1,
  // yPercent:5,
  // xPercent:0,
  ease: 'none',

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
        this.sidenavTl.play();
        this.tweenX.play();
        // this.tweenWrap.play();
      
        e.stopPropagation();
      });
  
      hideButton?.addEventListener('click', (e) => {
        this.toggleNavigation(false);
        this.tweenText.restart();
        this.tweenX.restart();
        e.stopPropagation();
      });
  
      xMarkSpan?.addEventListener('click', (e) => {
        this.xMarksSpot();
        this.tweenX.reverse();
        // this.tweenText.reverse();
        this.sidenavTl.reverse();
        // this.tweenWrap.play();

        e.stopPropagation();
      });
  
      navigation?.addEventListener('click', (e) => {
        this.toggleNavigation(false);
        // this.tweenText.reverse();

        e.stopPropagation();
      });
  
      const toggleWrapper = navigation?.querySelector('.toggle-wrapper');
      toggleWrapper?.addEventListener('click', (e) => {
        this.toggleNavigation(true);
        this.tweenNav.restart();
        this.tweenX.restart();
        this.tweenWrap.restart();
        this.tweenText.restart();
        this.sidenavTl.restart();
        e.stopPropagation();
      });
    }
  


   toggleNavigation(isOpen: boolean): void {
       const navigation = document.querySelector('.navigation') as HTMLElement;
       const originalWrapper = document.querySelector('#about') as HTMLElement;
     
      if (isOpen) {
        navigation?.classList.add('open');
        this.sidenavTl.play();
        this.tweenX.play();
    
        this.tweenNav.play();
        this.tweenNav.restart(); // this to fix an issue where tween only fired once
        this.sidenavTl.restart();
       
      } else {
        navigation?.classList.remove('open');
        this.tweenX.reverse();
        // this.tweenWrap.play();
        this.tweenNav.reverse();
        this.sidenavTl.reverse();

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

