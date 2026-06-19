(function () {
    function setupMoviePlayer(streamUrl) {
        function ready(callback) {
            if (document.readyState === "loading") {
                document.addEventListener("DOMContentLoaded", callback);
            } else {
                callback();
            }
        }

        ready(function () {
            var video = document.querySelector("[data-movie-video]");
            var overlay = document.querySelector("[data-play-overlay]");
            var hls = null;
            var attached = false;

            if (!video || !streamUrl) {
                return;
            }

            function attachStream() {
                if (attached) {
                    return;
                }

                if (window.Hls && window.Hls.isSupported()) {
                    hls = new window.Hls({
                        enableWorker: true,
                        lowLatencyMode: true
                    });
                    hls.loadSource(streamUrl);
                    hls.attachMedia(video);
                    hls.on(window.Hls.Events.ERROR, function (event, data) {
                        if (data && data.fatal && hls) {
                            hls.destroy();
                            hls = null;
                            attached = false;
                            video.src = streamUrl;
                        }
                    });
                } else {
                    video.src = streamUrl;
                }

                attached = true;
            }

            function startPlayback() {
                attachStream();
                video.controls = true;
                if (overlay) {
                    overlay.classList.add("is-hidden");
                }
                var promise = video.play();
                if (promise && typeof promise.catch === "function") {
                    promise.catch(function () {
                        if (overlay) {
                            overlay.classList.remove("is-hidden");
                        }
                    });
                }
            }

            if (overlay) {
                overlay.addEventListener("click", startPlayback);
            }

            video.addEventListener("click", function () {
                if (video.paused) {
                    startPlayback();
                } else {
                    video.pause();
                }
            });

            video.addEventListener("play", function () {
                if (overlay) {
                    overlay.classList.add("is-hidden");
                }
            });

            video.addEventListener("ended", function () {
                if (overlay) {
                    overlay.classList.remove("is-hidden");
                }
            });
        });
    }

    window.setupMoviePlayer = setupMoviePlayer;
})();
