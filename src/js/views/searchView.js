class SearchView {
  _parentElement = document.querySelector(".search");
  _field = document.querySelector(".search__field");

  getQuery() {
    return this._field.value.trim();
  }

  clearInput() {
    this._field.value = "";
    this._field.blur(); // Closes the on-screen keyboard on phones
  }

  addHandlerSearch(handler) {
    this._parentElement.addEventListener("submit", (e) => {
      e.preventDefault();
      handler();
    });

    // Quick-search suggestions shown in the empty results sidebar
    document.querySelector(".results").addEventListener("click", (e) => {
      const btn = e.target.closest(".results__suggestion");
      if (!btn) return;
      this._field.value = btn.dataset.query;
      handler();
    });
  }
}

export default new SearchView();
