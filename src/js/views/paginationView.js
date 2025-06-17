import View from "./view";
import icons from "url:../../img/icons.svg";

class PaginationView extends View {
  _parentElement = document.querySelector(".pagination");

  addHandlerClick(handler) {
    this._parentElement.addEventListener("click", function (e) {
      const btn = e.target.closest(".btn--inline");
      if (!btn) return;

      const goToPage = +btn.dataset.goto;
      handler(goToPage);
    });
  }

  _generateMarkupButton(page, isbtnLeft = true) {
    return `<button data-goto="${
      isbtnLeft ? page - 1 : page + 1
    }" class="btn--inline pagination__btn--${isbtnLeft ? "prev" : "next"}">
            <span>Page ${isbtnLeft ? page - 1 : page + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-${
      isbtnLeft ? "left" : "right"
    }"></use>
            </svg>
          </button>`;
  }

  _generateMarkup() {
    const currentPage = this._data.page;

    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );
    console.log(numPages);

    //page 1, there are other pages
    if (currentPage === 1 && numPages > 1) {
      return this._generateMarkupButton(currentPage, false);
    }
    //Last page
    if (currentPage === numPages && numPages > 1) {
      return this._generateMarkupButton(currentPage, true);
    }
    //Other page
    if (currentPage < numPages) {
      return `${this._generateMarkupButton(currentPage, true)}
    ${this._generateMarkupButton(currentPage, false)}
    `;
    }

    //page 1, there are NO other pages
    return "";
  }
}

export default new PaginationView();
