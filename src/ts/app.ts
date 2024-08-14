//import libs 
import gsap from 'gsap';
import EasePack from 'gsap/EasePack';
import { Power4 } from 'gsap/gsap-core';

//gsap registration, global scope
gsap.registerPlugin(Power4);
gsap.registerPlugin(EasePack);

// component deps
import "./shared/header";
import {Navigation, AnimationHandler} from "./shared/nav";
import {scrollEvent} from "./scrollhandler";

const navigation = new Navigation();
const animationHandler = new AnimationHandler();
const scroll = new scrollEvent();


// event listeners
// listen for nav 
const loaded = () => {
    document.addEventListener("DOMContentLoaded", () => {
        navigation.setupNavigationEvents();
       

    })
}
const click = () => {
    document.addEventListener("click", () => {
        console.log("click fired from app")
        animationHandler.setupGSAPtl();
        // if (navigation.isClassActive("open")) {
        //     animationHandler.setupGSAPtl() 
        //     .to(navigation, {
        //         duration: 1.5,
        //         ease: "Power4.out",
        //         y: 0
        //       }).to(".navigation", {
        //         opacity: 1,
        //         y: 0,
        //         duration: 3,
        //         stagger: {
        //           // wrap advanced options in an object
        //           each: 0.2,
        //           ease: "Power4.in"
        //         }
        //       })
        //       .reverse();;
        //     console.log("open detected, click fired");
        // }
        // else {
        //     animationHandler.setupGSAPtl().pause();
        //     // console.log("closed detected, click fired");
        // }


})

}



document.addEventListener("change", function () {
	if (scroll.isScrolling) {
		let allTriggers = ScrollTrigger.getAll();
		allTriggers.forEach((trigger) => {
			trigger.kill(true);
		});
	} else {
		scroll.createTimelines();
	}
});
document.addEventListener("click", click);