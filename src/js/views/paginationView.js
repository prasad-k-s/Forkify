import View from "./view";
import icons from "url:../../img/icons.svg";

class PaginationView extends View {
  _parentElement = document.querySelector(".pagination");

  addHandlerClick(handler) {
    this._parentElement.addEventListener("click", function (e) {
      const btn = e.target.closest(".btn--inline");
      if (!btn) return;
      handler(+btn.dataset.goto);
    });
  }

  _generateMarkupButton(page, isPrev) {
    const goTo = isPrev ? page - 1 : page + 1;
    return `
      <button data-goto="${goTo}" class="btn--inline pagination__btn--${
      isPrev ? "prev" : "next"
    }">
        <span>Page ${goTo}</span>
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-${isPrev ? "left" : "right"}"></use>
        </svg>
      </button>`;
  }

  _generateMarkup() {
    const currentPage = this._data.page;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );

    if (numPages <= 1) return "";
    if (currentPage === 1) return this._generateMarkupButton(currentPage, false);
    if (currentPage === numPages)
      return this._generateMarkupButton(currentPage, true);

    return (
      this._generateMarkupButton(currentPage, true) +
      this._generateMarkupButton(currentPage, false)
    );
  }
}

export default new PaginationView();
