/**
 * Automatically binds an audio object to the global playback speed tracker
 * and updates it live if the user changes the dropdown while it's playing.
 * 
 * @param {HTMLAudioElement} audioObj - The audio instance
 * @returns {HTMLAudioElement} The same audio instance for convenience
 */
export function bindAudioSpeed(audioObj) {
  // Set initial rate from global tracker (defaults to 1.0)
  audioObj.playbackRate = window.globalPlaybackRate || 1.0;

  // Listen for live speed updates dispatched by <site-controls>
  window.addEventListener('playbackRateChanged', (e) => {
    audioObj.playbackRate = e.detail.speed;
  });

  return audioObj;
}