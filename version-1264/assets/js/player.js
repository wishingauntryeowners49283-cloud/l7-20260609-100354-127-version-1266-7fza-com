(function () {
    function setupVideoPlayer(streamUrl) {
        var frame = document.querySelector("[data-player]");
        if (!frame) {
            return;
        }

        var video = frame.querySelector("video");
        var overlay = frame.querySelector(".player-overlay");
        var loaded = false;
        var hls = null;

        function loadStream() {
            if (loaded || !video) {
                return;
            }
            loaded = true;

            if (window.Hls && window.Hls.isSupported()) {
                hls = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hls.loadSource(streamUrl);
                hls.attachMedia(video);
            } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
                video.src = streamUrl;
            } else {
                video.src = streamUrl;
            }
        }

        function play() {
            loadStream();
            var attempt = video.play();
            if (attempt && typeof attempt.then === "function") {
                attempt.catch(function () {});
            }
            if (overlay) {
                overlay.classList.add("is-hidden");
            }
        }

        if (overlay) {
            overlay.addEventListener("click", play);
        }

        video.addEventListener("click", function () {
            if (video.paused) {
                play();
            } else {
                video.pause();
            }
        });

        video.addEventListener("play", function () {
            if (overlay) {
                overlay.classList.add("is-hidden");
            }
        });

        window.addEventListener("pagehide", function () {
            if (hls && typeof hls.destroy === "function") {
                hls.destroy();
            }
        });
    }

    window.setupVideoPlayer = setupVideoPlayer;
})();
