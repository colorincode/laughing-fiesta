
import videojs from 'video.js';

const items: any[] = [];
const videoAssets = [
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
            sources: [{
                src: "videoAssets[0].src",
                type: 'video/mp4',
            }]
        };

        const videoPlayer = {} as any;
        const videoPlayers: videojs.Player[] = [];
        items.forEach((item, index) => {
            const videoElement = item.querySelector('video');
            if (videoElement) {
              const player = videojs(videoElement, {
                controls: true,
                autoplay: false,
                preload: 'auto'
              });
              videoPlayers.push(player);
              
              // Add click event listener to enter fullscreen
              item.addEventListener('click', () => {
                player.requestFullscreen();
                player.play();
              });
            }
          });
          videoPlayers.forEach(player => {
            player.spatialNavigation();
          });
        



export function videoScreenChange() {
    document.addEventListener('fullscreenchange', () => {
        if (!document.fullscreenElement) {
            videoPlayers.forEach(player => {
                console.log('Focusable elements changed:', player.focusableElements());
                player.pause();
            });
        }
    });
}
  