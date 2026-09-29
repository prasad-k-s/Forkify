import icons from "url:../../img/icons.svg";
import Fraction from "fraction.js";
import View from "./view";

const STACKED_LAYOUT = "(max-width: 37.5em)";

class RecipeView extends View {
  _parentElement = document.querySelector(".recipe");
  _errorMessage = "We could not find that recipe. Please try another one!";
  _message = "";

  addHandlerRender(handler) {
    ["hashchange", "load"].forEach((ev) =>
      window.addEventListener(ev, handler)
    );
  }

  addHandlerUpdateServings(handler) {
    this._parentElement.addEventListener("click", function (e) {
      const btn = e.target.closest(".btn--update-servings");
      if (!btn) return;
      const updateTo = +btn.dataset.updateTo;
      if (updateTo > 0) handler(updateTo);
    });
  }

  addHandlerBookmark(handler) {
    this._parentElement.addEventListener("click", function (e) {
      const btn = e.target.closest(".btn--bookmark");
      if (!btn) return;
      handler();
    });
  }

  addHandlerBack(handler) {
    this._parentElement.addEventListener("click", function (e) {
      if (e.target.closest(".recipe__back")) handler();
    });
  }

  // On phones, results and recipe are two separate screens
  isStackedLayout() {
    return window.matchMedia(STACKED_LAYOUT).matches;
  }

  showScreen(isOpen) {
    document.body.classList.toggle("recipe-open", isOpen);
    if (isOpen && this.isStackedLayout()) window.scrollTo(0, 0);
  }

  renderError(message = this._errorMessage) {
    super.renderError(message);
    this._parentElement.insertAdjacentHTML(
      "afterbegin",
      this._generateMarkupBack()
    );
  }

  _generateMarkupBack() {
    return `
      <button class="btn--inline recipe__back" type="button">
        <svg>
          <use href="${icons}#icon-arrow-left"></use>
        </svg>
        <span>Back to results</span>
      </button>`;
  }

  _generateMarkup() {
    return `
      ${this._generateMarkupBack()}
      <figure class="recipe__fig">
        <img src="${this._data.image}" alt="${this._data.title}" class="recipe__img" />
        <h1 class="recipe__title">
          <span>${this._data.title}</span>
        </h1>
      </figure>

      <div class="recipe__details">
        <div class="recipe__info">
          <svg class="recipe__info-icon">
            <use href="${icons}#icon-clock"></use>
          </svg>
          <span class="recipe__info-data recipe__info-data--minutes">${
            this._data.cookingTime
          }</span>
          <span class="recipe__info-text">minutes</span>
        </div>
        <div class="recipe__info">
          <svg class="recipe__info-icon">
            <use href="${icons}#icon-users"></use>
          </svg>
          <span class="recipe__info-data recipe__info-data--people">${
            this._data.servings
          }</span>
          <span class="recipe__info-text">servings</span>

          <div class="recipe__info-buttons">
            <button class="btn--tiny btn--update-servings" data-update-to="${
              this._data.servings - 1
            }" aria-label="Decrease servings">
              <svg>
                <use href="${icons}#icon-minus-circle"></use>
              </svg>
            </button>
            <button class="btn--tiny btn--update-servings" data-update-to="${
              this._data.servings + 1
            }" aria-label="Increase servings">
              <svg>
                <use href="${icons}#icon-plus-circle"></use>
              </svg>
            </button>
          </div>
        </div>

        <div class="recipe__user-generated ${this._data.key ? "" : "hidden"}">
          <svg>
            <use href="${icons}#icon-user"></use>
          </svg>
        </div>
        <button class="btn--round btn--bookmark" aria-label="${
          this._data.bookmarked ? "Remove bookmark" : "Bookmark recipe"
        }">
          <svg>
            <use href="${icons}#icon-bookmark${
              this._data.bookmarked ? "-fill" : ""
            }"></use>
          </svg>
        </button>
      </div>

      <div class="recipe__ingredients">
        <h2 class="heading--2">Recipe ingredients</h2>
        <ul class="recipe__ingredient-list">
          ${this._data.ingredients.map(this._generateMarkupIngredient).join("")}
        </ul>
      </div>

      <div class="recipe__directions">
        <h2 class="heading--2">How to cook it</h2>
        <p class="recipe__directions-text">
          This recipe was carefully designed and tested by
          <span class="recipe__publisher">${this._data.publisher}</span>. Please
          check out directions at their website.
        </p>
        <a
          class="btn--small recipe__btn"
          href="${this._data.sourceUrl}"
          target="_blank"
          rel="noopener"
        >
          <span>Directions</span>
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-right"></use>
          </svg>
        </a>
      </div>`;
  }

  _formatQuantity(quantity) {
    if (!quantity) return "";
    // Round to the nearest sensible fraction (e.g. 0.3333 -> 1/3)
    return new Fraction(quantity).simplify(0.01).toFraction(true);
  }

  _generateMarkupIngredient = (ing) => `
    <li class="recipe__ingredient">
      <svg class="recipe__icon">
        <use href="${icons}#icon-check"></use>
      </svg>
      <div class="recipe__quantity">${this._formatQuantity(ing.quantity)}</div>
      <div class="recipe__description">
        <span class="recipe__unit">${ing.unit}</span>
        ${ing.description}
      </div>
    </li>`;
}

export default new RecipeView();
