(function () {
    window.initMoviePlayer = function (sourceUrl) {
        const video = document.querySelector('[data-player]');
        const overlay = document.querySelector('[data-player-overlay]');
        const button = document.querySelector('[data-play-button]');
        let attached = false;
        let instance = null;

        if (!video || !sourceUrl) {
            return;
        }

        function attach() {
            if (attached) {
                return;
            }
            attached = true;
            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = sourceUrl;
            } else if (window.Hls && window.Hls.isSupported()) {
                instance = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                instance.loadSource(sourceUrl);
                instance.attachMedia(video);
            } else {
                video.src = sourceUrl;
            }
        }

        function playVideo() {
            attach();
            const result = video.play();
            if (result && typeof result.catch === 'function') {
                result.catch(function () {});
            }
        }

        function hideOverlay() {
            if (overlay) {
                overlay.classList.add('is-hidden');
            }
        }

        function showOverlay() {
            if (overlay && video.paused) {
                overlay.classList.remove('is-hidden');
            }
        }

        if (overlay) {
            overlay.addEventListener('click', playVideo);
        }
        if (button) {
            button.addEventListener('click', function (event) {
                event.stopPropagation();
                playVideo();
            });
        }
        video.addEventListener('play', hideOverlay);
        video.addEventListener('pause', showOverlay);
        video.addEventListener('ended', showOverlay);
        video.addEventListener('click', function () {
            if (video.paused) {
                playVideo();
            }
        });
        window.addEventListener('beforeunload', function () {
            if (instance) {
                instance.destroy();
            }
        });
    };
})();
