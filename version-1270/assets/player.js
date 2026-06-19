(function () {
    function init(streamUrl, boxId) {
        const box = document.getElementById(boxId);
        if (!box) {
            return;
        }

        const video = box.querySelector('[data-player-video]');
        const cover = box.querySelector('[data-player-start]');
        let ready = false;
        let hls = null;

        function attachStream() {
            if (!video || ready) {
                return;
            }

            ready = true;

            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = streamUrl;
            } else if (window.Hls && window.Hls.isSupported()) {
                hls = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hls.loadSource(streamUrl);
                hls.attachMedia(video);
            } else {
                video.src = streamUrl;
            }
        }

        function play() {
            attachStream();
            if (cover) {
                cover.classList.add('is-hidden');
            }
            const action = video.play();
            if (action && typeof action.catch === 'function') {
                action.catch(function () {});
            }
        }

        if (cover) {
            cover.addEventListener('click', play);
        }

        if (video) {
            video.addEventListener('click', function () {
                if (video.paused) {
                    play();
                }
            });
            video.addEventListener('play', function () {
                if (cover) {
                    cover.classList.add('is-hidden');
                }
            });
            video.addEventListener('ended', function () {
                if (hls && typeof hls.stopLoad === 'function') {
                    hls.stopLoad();
                }
            });
        }
    }

    window.MoviePlayer = {
        init: init
    };
})();
