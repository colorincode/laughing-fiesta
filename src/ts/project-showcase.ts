
import curtainsjs, { Curtains, Plane, Vec2 } from './vendors/curtains/index';


import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
// import SplitType from 'split-type'

import fragment from './shader/fragment.glsl'
import vertex from './shader/screen.vert'
import videojs from 'video.js';

gsap.registerPlugin(ScrollTrigger)

window.addEventListener("load", () => {
    // track the mouse positions to send it to the shaders
    const mousePosition = new Vec2();
    // we will keep track of the last position in order to calculate the movement strength/delta
    const mouseLastPosition = new Vec2();

    const deltas = {
        max: 0,
        applied: 0,
    };

    // set up our WebGL context and append the canvas to our wrapper
    const curtains = new Curtains({
        container: "canvas",
        watchScroll: false, // no need to listen for the scroll in this example
        pixelRatio: Math.min(1.5, window.devicePixelRatio) // limit pixel ratio for performance
    });

    // handling errors
    curtains.onError(() => {
        // we will add a class to the document body to display original video
        document.body.classList.add("no-curtains", "curtains-ready");

        // handle video
        document.getElementById("enter-site").addEventListener("click", () => {
            // display canvas and hide the button
            document.body.classList.add("video-started");

            planeElements[0].getElementsByTagName("video")[0].play();
        }, false);
    }).onContextLost(() => {
        // on context lost, try to restore the context
        curtains.restoreContext();
    });

    // get our plane element
    const planeElements = document.getElementsByClassName("curtain");


    const vs = `
        precision mediump float;

        // default mandatory variables
        attribute vec3 aVertexPosition;
        attribute vec2 aTextureCoord;

        uniform mat4 uMVMatrix;
        uniform mat4 uPMatrix;
        
        // our texture matrix uniform
        uniform mat4 simplePlaneVideoTextureMatrix;

        // custom variables
        varying vec3 vVertexPosition;
        varying vec2 vTextureCoord;

        uniform float uTime;
        uniform vec2 uResolution;
        uniform vec2 uMousePosition;
        uniform float uMouseMoveStrength;


        void main() {

            vec3 vertexPosition = aVertexPosition;

            // get the distance between our vertex and the mouse position
            float distanceFromMouse = distance(uMousePosition, vec2(vertexPosition.x, vertexPosition.y));

            // calculate our wave effect
            float waveSinusoid = cos(5.0 * (distanceFromMouse - (uTime / 75.0)));

            // attenuate the effect based on mouse distance
            float distanceStrength = (0.4 / (distanceFromMouse + 0.4));

            // calculate our distortion effect
            float distortionEffect = distanceStrength * waveSinusoid * uMouseMoveStrength;

            // apply it to our vertex position
            vertexPosition.z +=  distortionEffect / 30.0;
            vertexPosition.x +=  (distortionEffect / 30.0 * (uResolution.x / uResolution.y) * (uMousePosition.x - vertexPosition.x));
            vertexPosition.y +=  distortionEffect / 30.0 * (uMousePosition.y - vertexPosition.y);

            gl_Position = uPMatrix * uMVMatrix * vec4(vertexPosition, 1.0);

            // varyings
            vTextureCoord = (simplePlaneVideoTextureMatrix * vec4(aTextureCoord, 0.0, 1.0)).xy;
            vVertexPosition = vertexPosition;
        }
    `;

    const fs = `
        precision mediump float;

        varying vec3 vVertexPosition;
        varying vec2 vTextureCoord;

        uniform sampler2D simplePlaneVideoTexture;

        void main() {
            // apply our texture
            vec4 finalColor = texture2D(simplePlaneVideoTexture, vTextureCoord);

            // fake shadows based on vertex position along Z axis
            finalColor.rgb -= clamp(-vVertexPosition.z, 0.0, 1.0);
            // fake lights based on vertex position along Z axis
            finalColor.rgb += clamp(vVertexPosition.z, 0.0, 1.0);

            // handling premultiplied alpha (useful if we were using a png with transparency)
            finalColor = vec4(finalColor.rgb * finalColor.a, finalColor.a);

            gl_FragColor = finalColor;
        }
    `;

    // some basic parameters
    const params = {
        vertexShader: vs,
        fragmentShader: fs,
        widthSegments: 20,
        heightSegments: 20,
        uniforms: {
            resolution: { // resolution of our plane
                name: "uResolution",
                type: "2f", // notice this is an length 2 array of floats
                value: [planeElements[0].clientWidth, planeElements[0].clientHeight],
            },
            time: { // time uniform that will be updated at each draw call
                name: "uTime",
                type: "1f",
                value: 0,
            },
            mousePosition: { // our mouse position
                name: "uMousePosition",
                type: "2f", // again an array of floats
                value: mousePosition,
            },
            mouseMoveStrength: { // the mouse move strength
                name: "uMouseMoveStrength",
                type: "1f",
                value: 0,
            }
        },
    };

    // create our plane
    const simplePlane = new Plane(curtains, planeElements[0], params);

    simplePlane.onReady(() => {
        // display the button
        document.body.classList.add("curtains-ready");

        // set a fov of 35 to reduce perspective (we could have used the fov init parameter)
        simplePlane.setPerspective(35);

        // now that our plane is ready we can listen to mouse move event
        const wrapper = document.getElementById("page-wrap");

        wrapper.addEventListener("mousemove", (e) => {
            handleMovement(e, simplePlane);
        });

        wrapper.addEventListener("touchmove", (e) => {
            handleMovement(e, simplePlane);
        }, {
            passive: true
        });

        // click to play the videos
        document.getElementById("enter-site").addEventListener("click", () => {
            // display canvas and hide the button
            document.body.classList.add("video-started");

            // apply a little effect once everything is ready
            deltas.max = 2;

            simplePlane.playVideos();
        }, false);


    }).onRender(() => {
        // increment our time uniform
        simplePlane.uniforms.time.value++;

        // decrease both deltas by damping : if the user doesn't move the mouse, effect will fade away
        deltas.applied += (deltas.max - deltas.applied) * 0.02;
        deltas.max += (0 - deltas.max) * 0.01;

        // send the new mouse move strength value
        simplePlane.uniforms.mouseMoveStrength.value = deltas.applied;

    }).onAfterResize(() => {
        const planeBoundingRect = simplePlane.getBoundingRect();
        simplePlane.uniforms.resolution.value = [planeBoundingRect.width, planeBoundingRect.height];
    }).onError(() => {
        // we will add a class to the document body to display original video
        document.body.classList.add("no-curtains", "curtains-ready");

        // handle video
        document.getElementById("enter-site").addEventListener("click", () => {
            // display canvas and hide the button
            document.body.classList.add("video-started");

            planeElements[0].getElementsByTagName("video")[0].play();
        }, false);
    });

    // handle the mouse move event
    function handleMovement(e, plane) {
        // update mouse last pos
        mouseLastPosition.copy(mousePosition);

        const mouse = new Vec2();

        // touch event
        if(e.targetTouches) {
            mouse.set(e.targetTouches[0].clientX, e.targetTouches[0].clientY);
        }
        // mouse event
        else {
            mouse.set(e.clientX, e.clientY);
        }

        // lerp the mouse position a bit to smoothen the overall effect
        mousePosition.set(
            curtains.lerp(mousePosition.x, mouse.x, 0.3),
            curtains.lerp(mousePosition.y, mouse.y, 0.3)
        );

        // convert our mouse/touch position to coordinates relative to the vertices of the plane and update our uniform
        plane.uniforms.mousePosition.value = plane.mouseToPlaneCoords(mousePosition);

        // calculate the mouse move strength
        if(mouseLastPosition.x && mouseLastPosition.y) {
            let delta = Math.sqrt(Math.pow(mousePosition.x - mouseLastPosition.x, 2) + Math.pow(mousePosition.y - mouseLastPosition.y, 2)) / 30;
            delta = Math.min(4, delta);
            // update max delta only if it increased
            if(delta >= deltas.max) {
                deltas.max = delta;
            }
        }
    }
});


// class App {
//   curtains
//   lenis
//   planes = []
//   scrollEffect = 0

//   DOM = {
//     h1: document.querySelector('h1'),
//     planeElements: [...document.querySelectorAll('[data-animation="image"]')],
//     heroImage: document.querySelector('.project_header_img'),
//     heroWebGlPlane: null,
//     paragraphs: [...document.querySelectorAll('[data-animation="paragraph"]')],
//     wheel: document.querySelector('.wheel_icon'),
//     wheelWrapper: document.querySelector('.wheel_wrapper'),
//     pageWrap: document.querySelector('.page-wrapper'),
//   }

//   animationState = {}

//   constructor() {
//     this.init()
//   }

//   async init() {
//     await this.createLoaderAnimation()
//     this.createCurtains()
//     this.setupCurtains()
//     this.createLenis()
//     this.createPlanes()
//     this.createPageAnimations()
//   }

//   createLoaderAnimation() {
//     const loaderDuration = 2
//     return new Promise((resolve) => {
//       this.animationState.pageLoaderTimeline = gsap.timeline()

//       // page loading animation
//       this.animationState.pageLoaderTimeline.set(this.DOM.wheelWrapper, {
//         xPercent: -50,
//         yPercent: -50,
//         x: innerWidth / 2,
//         y: innerHeight / 2,
//         scale: 1.2,
//       })

//       this.animationState.pageLoaderTimeline.to(this.DOM.wheelWrapper, {
//         autoAlpha: 1,
//         rotation: 360 * 3,
//         duration: loaderDuration,
//       })

//       this.animationState.pageLoaderTimeline.to(this.DOM.wheelWrapper, {
//         xPercent: 0,
//         yPercent: -100,
//         x: 20,
//         y: innerHeight - 20,
//         scale: 0.75,
//         duration: 1,
//         onComplete: resolve,
//       })
//     })
//   }

//   createCurtains() {
//     this.curtains = new Curtains({
//       container: 'canvas',
//       pixelRatio: Math.min(1.5, window.devicePixelRatio), // limit pixel ratio for performance
//       watchScroll: false,
//     })
//   }

//   setupCurtains() {
//     this.curtains
//       .onRender(() => {
//         // update our planes deformation
//         this.scrollEffect = this.curtains.lerp(this.scrollEffect, 0, 0.075)
//       })
//       .onScroll(() => {
//         // get scroll deltas to apply the effect on scroll
//         const delta = this.curtains.getScrollDeltas()

//         // invert value for the effect
//         delta.y = -delta.y

//         // threshold
//         if (delta.y > 60) {
//           delta.y = 60
//         } else if (delta.y < -60) {
//           delta.y = -60
//         }

//         if (Math.abs(delta.y) > Math.abs(this.scrollEffect)) {
//           this.scrollEffect = this.curtains.lerp(
//             this.scrollEffect,
//             delta.y,
//             0.5
//           )
//         }
//       })
//       .onError(() => {
//         // we will add a class to the document body to display original images
//         document.body.classList.add('no-curtains', 'planes-loaded')
//       })
//       .onContextLost(() => {
//         // on context lost, try to restore the context
//         this.curtains.restoreContext()
//       })
//   }

//   createLenis() {
//     this.curtains.disableDrawing()

//     this.lenis = new Lenis({
//       duration: 2.5,
//       easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // https://www.desmos.com/calculator/brs54l4xou
//       direction: 'vertical', // vertical, horizontal
//       gestureDirection: 'vertical', // vertical, horizontal, both
//       smooth: true,
//       mouseMultiplier: 1,
//       smoothTouch: false,
//       touchMultiplier: 2,
//       infinite: false,
//     })

//     this.lenis.on('scroll', ({ scroll }) => {
//       // update our scroll manager values
//       this.curtains.updateScrollValues(0, scroll)
//       // render scene
//       this.curtains.needRender()
//     })

//     gsap.ticker.add((time) => {
//       this.lenis.raf(time * 1000)
//     })
//   }

//   createPlanes() {
//     const params = {
//       vertexShader: vertex,
//       fragmentShader: fragment,
//       widthSegments: 20,
//       heightSegments: 20,
//       uniforms: {
//         scrollEffect: {
//           name: 'uScrollEffect',
//           type: '1f',
//           value: 0.0,
//         },
//       },
//     }

//     // add our planes and handle them
//     for (let i = 0; i < this.DOM.planeElements.length; i++) {
//       const plane = new Plane(this.curtains, this.DOM.planeElements[i], params)

//       this.planes.push(plane)

//       this.handlePlanes(plane)
//     }

//     this.DOM.heroWebGlPlane = this.planes[0]
//   }

//   handlePlanes(plane) {
//     plane.setRenderOrder(-10)
//     plane
//       .onReady(() => {
//         // once everything is ready, display everything
//         if (plane === this.planes[this.planes.length - 1]) {
//           document.body.classList.add('planes-loaded')
//         }
//       })
//       .onRender(() => {
//         // update the uniform
//         if (!this.animationState.pageIntroTimeline.isActive()) {
//           plane.uniforms.scrollEffect.value = this.scrollEffect
//         }
//       })
//   }

//   createPageAnimations() {
//     this.animationState.pageIntroTimeline = gsap.timeline({})

//     this.animationState.pageIntroValues = {
//       translationY: 1000,
//       wiggle: 1500,
//     }

//     // Set h1 visibility back to visible
//     this.animationState.pageIntroTimeline.set(this.DOM.h1, {
//       autoAlpha: 1,
//     })

//     // hero plane intro
//     this.animationState.pageIntroTimeline.to(
//       this.animationState.pageIntroValues,
//       {
//         translationY: 0,
//         duration: 1.5,
//         onUpdate: () => {
//           // plane translation
//           this.DOM.heroWebGlPlane.relativeTranslation.y =
//             this.animationState.pageIntroValues.translationY
//           this.curtains.needRender()
//         },
//       },
//       'start'
//     )

//     // hero plane intro
//     this.animationState.pageIntroTimeline.to(
//       this.animationState.pageIntroValues,
//       {
//         wiggle: 0,
//         duration: 2,
//         onUpdate: () => {
//           // update uniform value
//           this.DOM.heroWebGlPlane.uniforms.scrollEffect.value =
//             this.scrollEffect + this.animationState.pageIntroValues.wiggle * 0.2

//           this.curtains.needRender()
//         },
//       },
//       'start'
//     )

//     // h1 intro
//     const splitH1 = new SplitType(this.DOM.h1, {
//       types: 'lines, words',
//       lineClass: 'line-wrapper',
//     })

//     this.animationState.pageIntroTimeline.from(
//       splitH1.words,
//       {
//         yPercent: 100,
//         duration: 0.6,
//         stagger: 0.075,
//       },
//       'start+=1.5'
//     )

//     // wheel rotation on scroll
//     this.animationState.pageIntroTimeline.to(this.DOM.wheel, {
//       rotate: 360 * 4,
//       scrollTrigger: {
//         trigger: this.DOM.pageWrap,
//         scrub: 1,
//         start: 'top top',
//         end: '+=10000',
//       },
//     })

//     // paragraphs
//     this.DOM.paragraphs.forEach((paragraph) => {
//       const parentSplitText = new SplitType(paragraph, {
//         types: 'lines',
//         lineClass: 'line-wrapper',
//       })

//       const splitText = new SplitType(parentSplitText.lines, {
//         types: `lines`,
//       })

//       gsap.set(paragraph, {
//         autoAlpha: 1,
//       })

//       gsap.from(splitText.lines, {
//         autoAlpha: 0,
//         yPercent: 150,
//         stagger: 0.1,
//         duration: 0.75,
//         ease: 'power.out4',
//         delay: 0.5,
//         scrollTrigger: {
//           trigger: paragraph,
//           start: 'top 90%',
//           once: true,
//         },
//       })
//     })
//   }
// }

// window.addEventListener('load', () => {
//   const app = new App()
//   // console.log('Loaded')
// })
