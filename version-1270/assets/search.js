(function () {
    const input = document.getElementById('searchInput');
    const typeSelect = document.getElementById('searchType');
    const yearSelect = document.getElementById('searchYear');
    const button = document.getElementById('searchButton');
    const results = document.getElementById('searchResults');
    const summary = document.getElementById('searchSummary');
    const movies = Array.isArray(window.MovieSearchIndex) ? window.MovieSearchIndex : [];

    function text(value) {
        return String(value || '').replace(/[&<>"]/g, function (item) {
            return {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;'
            }[item];
        });
    }

    function fillOptions() {
        const types = Array.from(new Set(movies.map(function (movie) {
            return movie.type;
        }).filter(Boolean))).slice(0, 40);
        const years = Array.from(new Set(movies.map(function (movie) {
            return movie.year;
        }).filter(Boolean))).sort().reverse().slice(0, 40);

        types.forEach(function (type) {
            const option = document.createElement('option');
            option.value = type;
            option.textContent = type;
            typeSelect.appendChild(option);
        });

        years.forEach(function (year) {
            const option = document.createElement('option');
            option.value = year;
            option.textContent = year;
            yearSelect.appendChild(option);
        });
    }

    function card(movie) {
        const tags = (movie.tags || []).slice(0, 4).map(function (tag) {
            return '<span class="tag-pill">' + text(tag) + '</span>';
        }).join('');

        return '<article class="movie-card">' +
            '<a class="movie-poster" href="./' + text(movie.url) + '">' +
            '<img src="./' + text(movie.cover) + '" alt="' + text(movie.title) + '" loading="lazy">' +
            '<span class="poster-shade"></span><span class="poster-play">▶</span></a>' +
            '<div class="movie-card-body"><div class="movie-meta-line"><span>' + text(movie.year) + '</span><span>' + text(movie.type) + '</span></div>' +
            '<h2><a href="./' + text(movie.url) + '">' + text(movie.title) + '</a></h2>' +
            '<p>' + text(movie.oneLine) + '</p><div class="tag-row">' + tags + '</div></div></article>';
    }

    function run() {
        const keyword = input.value.trim().toLowerCase();
        const type = typeSelect.value;
        const year = yearSelect.value;
        const filtered = movies.filter(function (movie) {
            const haystack = [movie.title, movie.year, movie.type, movie.region, movie.genre, movie.category, (movie.tags || []).join(' '), movie.oneLine].join(' ').toLowerCase();
            const matchKeyword = !keyword || haystack.indexOf(keyword) !== -1;
            const matchType = !type || movie.type === type;
            const matchYear = !year || movie.year === year;
            return matchKeyword && matchType && matchYear;
        }).slice(0, 160);

        results.innerHTML = filtered.map(card).join('');
        summary.textContent = keyword || type || year ? '已匹配 ' + filtered.length + ' 部影片' : '推荐浏览热门片库';
    }

    function applyQuery() {
        const params = new URLSearchParams(window.location.search);
        const q = params.get('q') || '';
        input.value = q;
        run();
    }

    if (input && typeSelect && yearSelect && button && results) {
        fillOptions();
        button.addEventListener('click', run);
        input.addEventListener('keydown', function (event) {
            if (event.key === 'Enter') {
                event.preventDefault();
                run();
            }
        });
        typeSelect.addEventListener('change', run);
        yearSelect.addEventListener('change', run);
        applyQuery();
    }
})();
