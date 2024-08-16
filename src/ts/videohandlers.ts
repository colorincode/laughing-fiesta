
//empty grid item array
const items: any[] = [];


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

//^^ these arrays exist so we can set up the players. once you take videos & sources *out* of the dom, you wanna load them.  
export function LoadVideoAssets() {
    smallVideoAssets.forEach((videoAsset, index) => {
      const videoElement = document.createElement('video');
   
        //if the source array exists, pass it url
        videoElement.src = videoAsset.src;
        // videoElement.src = videoAsset.src;
        //you can call your params above if you need to modify the loop, e.g 
        // videoElement.controls = true;
        // videoElement.autoplay = false;
    })
    //if it's not passing your source as a string, or you're not seeing it on the dom
    // you can try this (this can be passed to earlier array or modified in func)
    // let videoElement = document.createElement('video');
    // let src = new URL('../../assets/videos/lenovo-thinkpad-mountain.mp4' , import.meta.url).href;
    // videoElement.src = src.toString(); //if ur not getting a string

}
      
//this no good. but so u have the concept of the loops
        // const videoPlayer = {} as any;
        // const videoPlayers: videojs.Player[] = [];
        // items.forEach((item, index) => {
        //     const videoElement = item.querySelector('video');
        //     if (videoElement) {
        //       const player = videojs(videoElement, {
        //         controls: true,
        //         autoplay: false,
        //         preload: 'auto'
        //       });
        //       videoPlayers.push(player);
              
      
        //       item.addEventListener('click', () => {
        //         player.requestFullscreen();
        //         player.play();
        //       });
        //     }
        //   });
        //   videoPlayers.forEach(player => {
        //     player.spatialNavigation();
        //   });
        
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
  