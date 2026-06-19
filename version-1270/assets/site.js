(function () {
    const menuToggle = document.querySelector('[data-menu-toggle]');
    const mobileMenu = document.querySelector('[data-mobile-menu]');

    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', function () {
            mobileMenu.classList.toggle('open');
        });
    }

    const carousel = document.querySelector('[data-hero-carousel]');

    if (carousel) {
        const slides = Array.from(carousel.querySelectorAll('.hero-slide'));
        const dots = Array.from(carousel.querySelectorAll('[data-hero-dot]'));
        const prev = carousel.querySelector('[data-hero-prev]');
        const next = carousel.querySelector('[data-hero-next]');
        let active = 0;
        let timer = null;

        function show(index) {
            if (!slides.length) {
                return;
            }

            active = (index + slides.length) % slides.length;
            slides.forEach(function (slide, i) {
                slide.classList.toggle('hero-slide-active', i === active);
            });
            dots.forEach(function (dot, i) {
                dot.classList.toggle('active', i === active);
            });
        }

        function start() {
            stop();
            timer = window.setInterval(function () {
                show(active + 1);
            }, 5200);
        }

        function stop() {
            if (timer) {
                window.clearInterval(timer);
                timer = null;
            }
        }

        if (prev) {
            prev.addEventListener('click', function () {
                show(active - 1);
                start();
            });
        }

        if (next) {
            next.addEventListener('click', function () {
                show(active + 1);
                start();
            });
        }

        dots.forEach(function (dot) {
            dot.addEventListener('click', function () {
                show(Number(dot.getAttribute('data-hero-dot') || 0));
                start();
            });
        });

        carousel.addEventListener('mouseenter', stop);
        carousel.addEventListener('mouseleave', start);
        show(0);
        start();
    }

    const filterInput = document.querySelector('[data-filter-input]');
    const filterYear = document.querySelector('[data-filter-year]');
    const filterType = document.querySelector('[data-filter-type]');
    const cards = Array.from(document.querySelectorAll('[data-movie-card]'));

    function applyFilters() {
        const keyword = filterInput ? filterInput.value.trim().toLowerCase() : '';
        const year = filterYear ? filterYear.value : '';
        const type = filterType ? filterType.value : '';

        cards.forEach(function (card) {
            const haystack = [
                card.getAttribute('data-title') || '',
                card.getAttribute('data-year') || '',
                card.getAttribute('data-type') || '',
                card.getAttribute('data-region') || '',
                card.getAttribute('data-genre') || ''
            ].join(' ').toLowerCase();
            const matchKeyword = !keyword || haystack.indexOf(keyword) !== -1;
            const matchYear = !year || card.getAttribute('data-year') === year;
            const matchType = !type || card.getAttribute('data-type') === type;
            card.classList.toggle('is-filter-hidden', !(matchKeyword && matchYear && matchType));
        });
    }

    [filterInput, filterYear, filterType].forEach(function (node) {
        if (node) {
            node.addEventListener('input', applyFilters);
            node.addEventListener('change', applyFilters);
        }
    });
})();
