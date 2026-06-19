(function () {
    const mobileButton = document.querySelector('[data-mobile-toggle]');
    const mobilePanel = document.querySelector('[data-mobile-panel]');

    if (mobileButton && mobilePanel) {
        mobileButton.addEventListener('click', function () {
            mobilePanel.classList.toggle('is-open');
        });
    }

    const slides = Array.from(document.querySelectorAll('[data-hero-slide]'));
    const dots = Array.from(document.querySelectorAll('[data-hero-dot]'));
    const prev = document.querySelector('[data-hero-prev]');
    const next = document.querySelector('[data-hero-next]');
    let active = 0;
    let timer = null;

    function showSlide(index) {
        if (!slides.length) {
            return;
        }
        active = (index + slides.length) % slides.length;
        slides.forEach(function (slide, slideIndex) {
            slide.classList.toggle('is-active', slideIndex === active);
        });
        dots.forEach(function (dot, dotIndex) {
            dot.classList.toggle('is-active', dotIndex === active);
        });
    }

    function startHero() {
        if (timer) {
            window.clearInterval(timer);
        }
        if (slides.length > 1) {
            timer = window.setInterval(function () {
                showSlide(active + 1);
            }, 5200);
        }
    }

    if (slides.length) {
        showSlide(0);
        startHero();
        dots.forEach(function (dot, index) {
            dot.addEventListener('click', function () {
                showSlide(index);
                startHero();
            });
        });
        if (prev) {
            prev.addEventListener('click', function () {
                showSlide(active - 1);
                startHero();
            });
        }
        if (next) {
            next.addEventListener('click', function () {
                showSlide(active + 1);
                startHero();
            });
        }
    }

    const filterInput = document.querySelector('[data-filter-input]');
    const filterItems = Array.from(document.querySelectorAll('[data-filter-item]'));
    const emptyBox = document.querySelector('[data-empty-filter]');

    function runFilter(value) {
        const keyword = (value || '').trim().toLowerCase();
        let visible = 0;
        filterItems.forEach(function (item) {
            const text = (item.getAttribute('data-filter-text') || item.textContent || '').toLowerCase();
            const matched = !keyword || text.indexOf(keyword) !== -1;
            item.style.display = matched ? '' : 'none';
            if (matched) {
                visible += 1;
            }
        });
        if (emptyBox) {
            emptyBox.style.display = visible ? 'none' : 'block';
        }
    }

    if (filterInput) {
        const params = new URLSearchParams(window.location.search);
        const query = params.get('q') || '';
        if (query && !filterInput.value) {
            filterInput.value = query;
        }
        runFilter(filterInput.value);
        filterInput.addEventListener('input', function () {
            runFilter(filterInput.value);
        });
    }
})();
