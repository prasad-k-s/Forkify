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
  }
}

export default new SearchView();
