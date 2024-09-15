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
  tl = gsap.timeline({ paused: true });
  navigation = document.querySelector('.navigation') as HTMLElement;
  toggleWrapper = document.querySelector('.toggle-wrapper') as HTMLElement;
  navText = document.querySelector('.navtext') as HTMLElement;
  xMarkCloser = document.querySelector('.xmark--closer') as HTMLElement;
  sidenavDesktop = document.querySelector('.sidenav__desktop') as HTMLElement;
  isOpen = false;

  constructor() {
    this.setupAnimations();
    this.setupNavigationEvents();
  }

setupAnimations(): void {
    this.tl
      .to('.navigation', {
        opacity: 1,
        duration: 1,
        backgroundColor: "rgba(0, 0, 0, 0.90)",
        ease: 'power4.in',
      })
      .fromTo('.xmark--closer', {
        scaleY: 0,
        autoAlpha: 0,
        yPercent: 5,
      }, {
        scaleY: 1,
        autoAlpha: 1,
        yPercent: -5,
        duration: 0.7,
        ease: 'power4.inOut',
      }, "<")
      .fromTo('.sidenav__desktop', {
        autoAlpha: 0,
      }, {
        autoAlpha: 1,
        duration: 0.7,
        ease: 'power4.in',
      }, "<");
  }

  setupNavigationEvents(): void {
    this.toggleWrapper?.addEventListener('click', this.toggleNavigation);
    this.xMarkCloser?.addEventListener('click', this.closeNavigation);
    document.addEventListener('click', this.handleDocumentClick);
  }

  toggleNavigation = (e: Event): void => {
    e.stopPropagation();
    this.isOpen ? this.closeNavigation() : this.openNavigation();
  }

  handleDocumentClick = (e: Event): void => {
    if (this.isOpen && !this.navigation.contains(e.target as Node)) {
      this.closeNavigation();
    }
  }

  openNavigation = (): void => {
    this.isOpen = true;
    this.navigation?.classList.add('open');
    this.navText?.classList.add("hideme");
    this.tl.play();
  }

  closeNavigation = (): void => {
    this.isOpen = false;
    this.navigation?.classList.remove('open');
    this.navText?.classList.remove("hideme");
   // Create a new timeline for the exit animation
   const exitTl = gsap.timeline({
    onComplete: () => {
      this.navigation?.classList.remove('open');
      this.navText?.classList.remove("hideme");
    }
  });

  exitTl
    .to('.sidenav__desktop', {
      autoAlpha: 0,
      duration: 0.3,
      ease: 'power2.out'
    })
    .to('.xmark--closer', {
      scaleY: 0,
      autoAlpha: 0,
      yPercent: 5,
      duration: 0.3,
      ease: 'power2.in'
    }, "<")
    .to('.navigation', {
      opacity: 0,
      duration: 0.5,
      ease: 'power2.inOut'
    }, "-=0.2");

  // play the exit animation
  exitTl.play();

  this.tl.reverse();
  }
}
