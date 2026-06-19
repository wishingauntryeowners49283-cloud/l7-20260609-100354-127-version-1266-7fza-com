(function () {
  function ready(fn) {
    if (document.readyState !== "loading") {
      fn();
      return;
    }
    document.addEventListener("DOMContentLoaded", fn);
  }

  function setupMenu() {
    var button = document.querySelector(".mobile-menu-button");
    var panel = document.querySelector(".mobile-panel");
    if (!button || !panel) {
      return;
    }
    button.addEventListener("click", function () {
      var open = panel.classList.toggle("is-open");
      button.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  function setupHero() {
    var slides = Array.prototype.slice.call(document.querySelectorAll(".hero-slide"));
    var dots = Array.prototype.slice.call(document.querySelectorAll(".hero-dot"));
    if (!slides.length) {
      return;
    }
    var index = 0;
    var timer = null;

    function show(nextIndex) {
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle("is-active", i === index);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle("is-active", i === index);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5200);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
      }
    }

    dots.forEach(function (dot, i) {
      dot.addEventListener("click", function () {
        show(i);
        start();
      });
    });

    var hero = document.querySelector(".hero");
    if (hero) {
      hero.addEventListener("mouseenter", stop);
      hero.addEventListener("mouseleave", start);
    }

    show(0);
    start();
  }

  function setupFilters() {
    var listing = document.querySelector("[data-listing]");
    if (!listing) {
      return;
    }
    var cards = Array.prototype.slice.call(listing.querySelectorAll(".movie-card"));
    var searchInput = document.querySelector("[data-filter-search]");
    var typeSelect = document.querySelector("[data-filter-type]");
    var yearSelect = document.querySelector("[data-filter-year]");
    var empty = document.querySelector("[data-empty]");
    var params = new URLSearchParams(window.location.search);

    if (searchInput && params.get("q")) {
      searchInput.value = params.get("q");
    }
    if (typeSelect && params.get("type")) {
      typeSelect.value = params.get("type");
    }
    if (yearSelect && params.get("year")) {
      yearSelect.value = params.get("year");
    }

    function normalize(value) {
      return String(value || "").trim().toLowerCase();
    }

    function apply() {
      var keyword = normalize(searchInput ? searchInput.value : "");
      var type = typeSelect ? typeSelect.value : "";
      var year = yearSelect ? yearSelect.value : "";
      var visible = 0;

      cards.forEach(function (card) {
        var text = normalize(card.getAttribute("data-search"));
        var okKeyword = !keyword || text.indexOf(keyword) !== -1;
        var okType = !type || card.getAttribute("data-type") === type;
        var okYear = !year || card.getAttribute("data-year") === year;
        var ok = okKeyword && okType && okYear;
        card.style.display = ok ? "" : "none";
        if (ok) {
          visible += 1;
        }
      });

      if (empty) {
        empty.classList.toggle("is-visible", visible === 0);
      }
    }

    [searchInput, typeSelect, yearSelect].forEach(function (item) {
      if (item) {
        item.addEventListener("input", apply);
        item.addEventListener("change", apply);
      }
    });

    apply();
  }

  function setupHeroSearch() {
    var forms = Array.prototype.slice.call(document.querySelectorAll("[data-search-form]"));
    forms.forEach(function (form) {
      form.addEventListener("submit", function (event) {
        var input = form.querySelector("input[name='q']");
        if (!input || !input.value.trim()) {
          event.preventDefault();
        }
      });
    });
  }

  function loadHls() {
    return new Promise(function (resolve, reject) {
      if (window.Hls) {
        resolve(window.Hls);
        return;
      }
      var existing = document.querySelector("script[data-hls-player]");
      if (existing) {
        existing.addEventListener("load", function () {
          resolve(window.Hls);
        });
        existing.addEventListener("error", reject);
        return;
      }
      var script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/npm/hls.js@1.5.20/dist/hls.min.js";
      script.async = true;
      script.setAttribute("data-hls-player", "true");
      script.onload = function () {
        resolve(window.Hls);
      };
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  function bindStream(video, url) {
    if (!url) {
      return;
    }
    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = url;
      return;
    }
    loadHls().then(function (Hls) {
      if (Hls && Hls.isSupported()) {
        var hls = new Hls({ enableWorker: true, lowLatencyMode: true });
        hls.loadSource(url);
        hls.attachMedia(video);
      } else {
        video.src = url;
      }
    }).catch(function () {
      video.src = url;
    });
  }

  function setupPlayers() {
    var players = Array.prototype.slice.call(document.querySelectorAll(".player-video"));
    players.forEach(function (video) {
      var url = video.getAttribute("data-media");
      var shell = video.closest(".player-shell");
      var cover = shell ? shell.querySelector(".player-cover") : null;
      var startButtons = shell ? Array.prototype.slice.call(shell.querySelectorAll(".player-cover, .player-cover-button")) : [];

      bindStream(video, url);

      function hideCover() {
        if (cover) {
          cover.classList.add("is-hidden");
        }
      }

      function showCover() {
        if (cover && video.paused && video.currentTime === 0) {
          cover.classList.remove("is-hidden");
        }
      }

      function start(event) {
        if (event) {
          event.preventDefault();
        }
        hideCover();
        video.play().catch(function () {
          showCover();
        });
      }

      startButtons.forEach(function (button) {
        button.addEventListener("click", start);
      });
      video.addEventListener("play", hideCover);
      video.addEventListener("ended", showCover);
    });
  }

  ready(function () {
    setupMenu();
    setupHero();
    setupHeroSearch();
    setupFilters();
    setupPlayers();
  });
}());
