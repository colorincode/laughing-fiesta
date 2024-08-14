import gsap from 'gsap'
// import TextPlugin from 'gsap/TextPlugin';
import { Flip } from 'gsap/Flip';
import Draggable from 'gsap/Draggable';
import ScrollTrigger from 'gsap/ScrollTrigger';
import ScrollToPlugin from 'gsap/ScrollToPlugin';
import EasePack from 'gsap/EasePack';
import { Power4 } from 'gsap/gsap-core';
import Observer from 'gsap/Observer';
// import { sqrt, MathCollection , create, all, string} from 'mathjs';
import Timeline from 'gsap/all';
import  Tween  from 'gsap/src/all';
import Lenis from 'lenis';

gsap.registerPlugin(Flip);
gsap.registerPlugin(Draggable);
gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(Observer);
gsap.registerPlugin(ScrollToPlugin);

export class scrollEvent  {
    constructor() {
        this.createTimelines();

    }
    isScrolling = false;


    scrollTo(target: string) {
        this.scrollTo(target);

    }
    trigger = document.querySelector("#trigger");

    createTimelines() {
        let tl1 = gsap.timeline({
            scrollTrigger: {
                trigger: "#trigger",
                scrub: true,
                start: "5% top",
                end: "bottom bottom"
            }
        });
    
        tl1.to(".grow", {
            scale: 2
        });
    
        let tl2 = gsap.timeline({
            scrollTrigger: {
                trigger: "#trigger",
                scrub: true,
                start: "5% top",
                end: "bottom bottom"
            }
        });
    
        tl2.to(".spin", {
            rotate: 700
        });
    }
    
  
}