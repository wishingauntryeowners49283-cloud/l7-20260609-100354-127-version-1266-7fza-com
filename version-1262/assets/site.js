(function () {
  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  function initMenu() {
    var toggle = document.querySelector("[data-menu-toggle]");
    var menu = document.querySelector("[data-mobile-menu]");
    if (!toggle || !menu) {
      return;
    }
    toggle.addEventListener("click", function () {
      menu.classList.toggle("is-open");
    });
  }

  function initHero() {
    var slides = Array.prototype.slice.call(document.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(document.querySelectorAll("[data-hero-dot]"));
    if (slides.length < 2) {
      return;
    }
    var current = 0;
    function show(index) {
      current = index;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("is-active", slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("is-active", dotIndex === current);
      });
    }
    dots.forEach(function (dot, index) {
      dot.addEventListener("click", function () {
        show(index);
      });
    });
    window.setInterval(function () {
      show((current + 1) % slides.length);
    }, 5200);
  }

  function textValue(node, name) {
    return (node.getAttribute(name) || "").toLowerCase();
  }

  function initFilter(panel) {
    var scope = panel.parentElement || document;
    var cards = Array.prototype.slice.call(scope.querySelectorAll("[data-movie-card]"));
    var searchInput = panel.querySelector("[data-search-input]");
    var categoryFilter = panel.querySelector("[data-category-filter]");
    var typeFilter = panel.querySelector("[data-type-filter]");
    var yearFilter = panel.querySelector("[data-year-filter]");
    var emptyState = panel.querySelector("[data-empty-state]");
    var params = new URLSearchParams(window.location.search);
    if (searchInput && params.get("q")) {
      searchInput.value = params.get("q");
    }
    function applyFilter() {
      var query = searchInput ? searchInput.value.trim().toLowerCase() : "";
      var category = categoryFilter ? categoryFilter.value : "";
      var type = typeFilter ? typeFilter.value : "";
      var year = yearFilter ? yearFilter.value : "";
      var visible = 0;
      cards.forEach(function (card) {
        var haystack = [
          textValue(card, "data-title"),
          textValue(card, "data-category"),
          textValue(card, "data-region"),
          textValue(card, "data-type"),
          textValue(card, "data-year"),
          card.textContent.toLowerCase()
        ].join(" ");
        var matchesQuery = query === "" || haystack.indexOf(query) !== -1;
        var matchesCategory = category === "" || card.getAttribute("data-category") === category;
        var matchesType = type === "" || card.getAttribute("data-type") === type;
        var matchesYear = year === "" || card.getAttribute("data-year") === year;
        var shouldShow = matchesQuery && matchesCategory && matchesType && matchesYear;
        card.style.display = shouldShow ? "" : "none";
        if (shouldShow) {
          visible += 1;
        }
      });
      if (emptyState) {
        emptyState.classList.toggle("is-visible", visible === 0);
      }
    }
    [searchInput, categoryFilter, typeFilter, yearFilter].forEach(function (field) {
      if (field) {
        field.addEventListener("input", applyFilter);
        field.addEventListener("change", applyFilter);
      }
    });
    applyFilter();
  }

  ready(function () {
    initMenu();
    initHero();
    document.querySelectorAll("[data-filter-form]").forEach(initFilter);
  });
})();
