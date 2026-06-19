(function () {
    var header = document.querySelector(".navbar");
    var toggle = document.querySelector("[data-mobile-toggle]");
    var menu = document.querySelector("[data-mobile-menu]");

    function updateHeader() {
        if (!header) {
            return;
        }
        if (window.scrollY > 12) {
            header.classList.add("is-scrolled");
        } else {
            header.classList.remove("is-scrolled");
        }
    }

    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });

    if (toggle && menu && header) {
        toggle.addEventListener("click", function () {
            var open = menu.classList.toggle("is-open");
            header.classList.toggle("is-open", open);
            document.body.classList.toggle("menu-open", open);
        });
    }

    document.querySelectorAll("[data-search-form]").forEach(function (form) {
        form.addEventListener("submit", function (event) {
            var input = form.querySelector("input[name='q']");
            if (!input || !input.value.trim()) {
                event.preventDefault();
                window.location.href = "search.html";
            }
        });
    });

    var hero = document.querySelector("[data-hero]");
    if (hero) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
        var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
        var prev = hero.querySelector("[data-hero-prev]");
        var next = hero.querySelector("[data-hero-next]");
        var index = 0;
        var timer = null;

        function showSlide(nextIndex) {
            if (!slides.length) {
                return;
            }
            index = (nextIndex + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle("is-active", slideIndex === index);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle("is-active", dotIndex === index);
            });
        }

        function startTimer() {
            if (timer) {
                window.clearInterval(timer);
            }
            timer = window.setInterval(function () {
                showSlide(index + 1);
            }, 5000);
        }

        dots.forEach(function (dot) {
            dot.addEventListener("click", function () {
                showSlide(Number(dot.getAttribute("data-hero-dot")) || 0);
                startTimer();
            });
        });

        if (prev) {
            prev.addEventListener("click", function () {
                showSlide(index - 1);
                startTimer();
            });
        }

        if (next) {
            next.addEventListener("click", function () {
                showSlide(index + 1);
                startTimer();
            });
        }

        showSlide(0);
        startTimer();
    }

    function getQueryValue(name) {
        var params = new URLSearchParams(window.location.search);
        return params.get(name) || "";
    }

    function normalize(value) {
        return String(value || "").toLowerCase().replace(/\s+/g, " ").trim();
    }

    document.querySelectorAll("[data-filter-list]").forEach(function (list) {
        var bar = document.querySelector("[data-filter-bar]");
        var search = document.querySelector("[data-filter-search]");
        var type = document.querySelector("[data-filter-type]");
        var region = document.querySelector("[data-filter-region]");
        var year = document.querySelector("[data-filter-year]");
        var items = Array.prototype.slice.call(list.children);

        if (!bar) {
            return;
        }

        if (search && getQueryValue("q")) {
            search.value = getQueryValue("q");
        }

        function applyFilters() {
            var keyword = normalize(search ? search.value : "");
            var typeValue = normalize(type ? type.value : "");
            var regionValue = normalize(region ? region.value : "");
            var yearValue = normalize(year ? year.value : "");

            items.forEach(function (item) {
                var titleText = normalize(item.getAttribute("data-title"));
                var typeText = normalize(item.getAttribute("data-type"));
                var regionText = normalize(item.getAttribute("data-region"));
                var yearText = normalize(item.getAttribute("data-year"));
                var genreText = normalize(item.getAttribute("data-genre"));
                var haystack = [titleText, typeText, regionText, yearText, genreText].join(" ");
                var visible = true;

                if (keyword && haystack.indexOf(keyword) === -1) {
                    visible = false;
                }

                if (typeValue && typeText.indexOf(typeValue) === -1 && genreText.indexOf(typeValue) === -1) {
                    visible = false;
                }

                if (regionValue && regionText.indexOf(regionValue) === -1) {
                    visible = false;
                }

                if (yearValue && yearText.indexOf(yearValue) === -1) {
                    visible = false;
                }

                item.classList.toggle("is-filtered-out", !visible);
            });
        }

        [search, type, region, year].forEach(function (control) {
            if (!control) {
                return;
            }
            control.addEventListener("input", applyFilters);
            control.addEventListener("change", applyFilters);
        });

        applyFilters();
    });
})();
