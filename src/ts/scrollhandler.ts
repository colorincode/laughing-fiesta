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
gsap.registerPlugin(Draggable);
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
        gsap
		.timeline({
			defaults: {
				ease: 'none'
			},
			scrollTrigger: {
                markers: true,
				trigger: this.trigger,
				start: 'top bottom-=15%',
				end: '+=50%',
				scrub: true
			}
		})
        // let tl1 = gsap.timeline({
        //     scrollTrigger: {
        //         trigger: "#trigger",
        //         scrub: true,
        //         start: "5% top",
        //         end: "bottom bottom"
        //     }
        // });
    
        // tl1.to(".grow", {
        //     scale: 2
        // });
    
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

export function scrollInit() {
    const logo = document.querySelector("topbar--svg");
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t:any) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
        direction: 'horizontal', // vertical, horizontal
        gestureDirection: 'horizontal', // vertical, horizontal, both
        smooth: true,
        smoothTouch: true,
        prevent: (node: any) => node.id === logo,

    })
    function raf(time:any) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    lenis.on('scroll', ScrollTrigger.update)
    gsap.ticker.add((time)=>{
        lenis.raf(time * 1000);
    })
  
    gsap.ticker.lagSmoothing(0)

    ScrollTrigger.defaults({});
}
