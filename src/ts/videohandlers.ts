
//empty grid item array
const items: any[] = [];
const figures = document.querySelectorAll('.video--figure');
let videoPlacementArray: any[] = [];

// we are just gonna pass the url string to them
// set up the src of the video assets - small version
const smallVideoAssets = [
    { src: '../../assets/videos/lenovo-thinkpad-mountain.mp4' },
    { src: '../../assets/optimized/y3000casefilmH.264.mp4' },
    { src: '../../assets/optimized/voicesofgalaxyH.264.mp4' },
    { src: '../../assets/optimized/galaxyfold4launchH.264.mp4' },
    { src: '../../assets/optimized/food_moodH.264.mp4' },
    { src: '../../assets/voices-of-galaxy.mp4' },
    { src: '../../assets/optimized/samsungtinytypeH.264.mp4' },
    { src: '../../assets/videos/hrblock-life-uncertainties.mp4' },
    { src: '../../assets/optimized/flip_&_fold_launchH.264.mp4' },
    { src: '../../assets/optimized/selfie_by_flipH.264.mp4' },


    
];
// do it again, set up the src of the video assets - big version
const largeVideoAssets = [
  { src: '../../assets/videos/lenovo-thinkpad-mountain.mp4' },
  { src: '../../assets/optimized/y3000casefilmH.264.mp4' },
  { src: '../../assets/optimized/voicesofgalaxyH.264.mp4' },
  { src: '../../assets/optimized/galaxyfold4launchH.264.mp4' },
  { src: '../../assets/optimized/food_moodH.264.mp4' },
  { src: '../../assets/voices-of-galaxy.mp4' },
  { src: '../../assets/optimized/samsungtinytypeH.264.mp4' },
  { src: '../../assets/videos/hrblock-life-uncertainties.mp4' },
  { src: '../../assets/optimized/flip_&_fold_launchH.264.mp4' },
  { src: '../../assets/optimized/selfie_by_flipH.264.mp4' },


  
];
// full screen player params that need to be passed to FS player object
const fullScreenPlayer = {
            controls: true,
            autoplay: false,
            PictureInPictureWindow:false,
            preload: 'auto',
            fluid: true,
            muted: true,
            loop:true,
            isCrossOrigin: true,
            playsinline:true,
            // sources: [{
            //     src: "videoAssets[0].src",
            //     type: 'video/mp4',
            // }]
        };
// grid video items - small params that need to be passed to our grid video
const gridVideoItems = {
          controls: true,
          autoplay: false,
          PictureInPictureWindow:false,
          preload: 'auto',
          fluid: true,
          muted: true,
          loop:true,
          isCrossOrigin: true,
          playsinline:true,
          // sources: [{
          //     src: "videoAssets[0].src",
          //     type: 'video/mp4',
          // }]
};

// function processFigures() {
//   figures.forEach((figure, index) => {
//     const posClass = `pos-${index + 1}`;
//     const videoPosClass = `video--item${index + 1}`;
//     let arrayInfo = {
//       figurePos: posClass,
//       videoPos: videoPosClass
//     };
//     videoPlacementArray.push(arrayInfo);
//   })
//   shuffleArray(videoPlacementArray);
// }
// function shuffleArray(array: any) {
//   for (let i = array.length - 1; i > 0; i--) {
//     const j = Math.floor(Math.random() * (i + 1));
//     [array[i], array[j]] = [array[j], array[i]];
//   }
//   console.log("Shuffled array:", array);
//   return array;
// }
// function replacePositioningClasses() {
//   const figures = document.querySelectorAll('.video--figure');
//   figures.forEach((figure, index) => {
//     if (index < videoPlacementArray.length) {
//       figure.classList.remove(...figure.classList);
//       figure.classList.add('video--figure', videoPlacementArray[index].figurePos);

//       const video = figure.querySelector('video');
//       if (video) {
//         video.classList.remove(...video.classList);
//         video.classList.add('video--item', videoPlacementArray[index].videoPos);
//       }
//     }
//   });
// }
// document.addEventListener('DOMContentLoaded', () => {
//   processFigures();
//   replacePositioningClasses();
// });
// end video randomization functions

 
export function LoadVideoAssets() {
   
  function processFigures() {
    figures.forEach((figure, index) => {
      const posClass = `pos-${index + 1}`;
      const videoPosClass = `video--item${index + 1}`;
      let arrayInfo = {
        figurePos: posClass,
        videoPos: videoPosClass
      };
      videoPlacementArray.push(arrayInfo);
    })
    shuffleArray(videoPlacementArray);
  }
  function shuffleArray(array: any) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    console.log("Shuffled array:", array);
    return array;
  }
  function replacePositioningClasses() {
    const figures = document.querySelectorAll('.grid__item');
    const filteredFigures = Array.from(figures).filter(figure => !figure.classList.contains('fixed-item'));


    filteredFigures.forEach((figure, index) => {

      // if (figures[index].classList.contains("fixed-item")){
      //   figure.classList.remove(...figure.classList);

      // }
      if (index < videoPlacementArray.length ) {
        

        figure.classList.remove(...figure.classList);
        figure.classList.add(`item-${index + 1}`, videoPlacementArray[index].figurePos);
  
        const video = figure.querySelector('video');
        if (video) {
          video.classList.remove(...video.classList);
          video.classList.add('video--item', videoPlacementArray[index].videoPos);
        }
      }
    });
  }

  processFigures();
  replacePositioningClasses();

}
      
        
//event listern is good
export function videoScreenChange() {
    document.addEventListener('fullscreenchange', () => {
        if (!document.fullscreenElement) {
          // we want something here, if the vidya is fullscreen vs smol etc. 
            // videoPlayers.forEach(player => {
            //     console.log('Focusable elements changed:', player.focusableElements());
            //     player.pause();
            // });
        }
    });
}
  