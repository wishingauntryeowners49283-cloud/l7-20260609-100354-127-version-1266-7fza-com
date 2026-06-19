function setupPlayer(source) {
  var video = document.getElementById('movie-player');
  var cover = document.getElementById('play-cover');
  var loaded = false;

  if (!video || !cover || !source) return;

  function attach() {
    if (!loaded) {
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = source;
      } else if (window.Hls && window.Hls.isSupported()) {
        var hls = new Hls({ enableWorker: true });
        hls.loadSource(source);
        hls.attachMedia(video);
      } else {
        video.src = source;
      }
      loaded = true;
    }
    cover.classList.add('is-hidden');
    var result = video.play();
    if (result && result.catch) {
      result.catch(function () {});
    }
  }

  cover.addEventListener('click', attach);
  video.addEventListener('click', function () {
    if (video.paused) attach();
  });
}
