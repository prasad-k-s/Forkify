import View from "./view";
import { MODAL_CLOSE_SEC } from "../config";
import { parseIngredient } from "../model";

const RULES = {
  title: { label: "a title", min: 3 },
  sourceUrl: { label: "the recipe URL", url: true },
  image: { label: "the image URL", url: true },
  publisher: { label: "a publisher", min: 2 },
  cookingTime: { label: "the prep time", number: true, max: 1440 },
  servings: { label: "the servings", number: true, max: 100 },
};

class AddRecipeView extends View {
  _parentElement = document.querySelector(".upload");
  _message = "Recipe was successfully uploaded :)";
  _window = document.querySelector(".add-recipe-window");
  _overlay = document.querySelector(".overlay");
  _btnOpen = document.querySelector(".nav__btn--add-recipe");
  _btnClose = document.querySelector(".btn--close-modal");
  _formMarkup;
  _submitAttempted = false;
  _closeTimer;

  constructor() {
    super();
    this._addErrorElements();
    this._formMarkup = this._parentElement.innerHTML;
    this._addHandlerShowWindow();
    this._addHandlerHideWindow();
    this._addHandlerLiveValidation();
  }

  //------------------------------ Window ------------------------------//

  _isOpen() {
    return !this._window.classList.contains("hidden");
  }

  openWindow() {
    this._resetForm();
    this._overlay.classList.remove("hidden");
    this._window.classList.remove("hidden");
    this._parentElement.querySelector("input")?.focus();
  }

  closeWindow() {
    this._overlay.classList.add("hidden");
    this._window.classList.add("hidden");
  }

  _addHandlerShowWindow() {
    this._btnOpen.addEventListener("click", this.openWindow.bind(this));
  }

  _addHandlerHideWindow() {
    this._btnClose.addEventListener("click", this.closeWindow.bind(this));
    this._overlay.addEventListener("click", this.closeWindow.bind(this));
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this._isOpen()) this.closeWindow();
    });
  }

  // Brings back an empty form (a success message replaces it)
  _resetForm() {
    clearTimeout(this._closeTimer);
    this._parentElement.innerHTML = this._formMarkup;
    this._submitAttempted = false;
  }

  //---------------------------- Validation ----------------------------//

  _addErrorElements() {
    this._parentElement.querySelectorAll("input").forEach((input) => {
      const id = `error-${input.name}`;
      input.id = `input-${input.name}`;
      input.setAttribute("aria-describedby", id);
      input.insertAdjacentHTML(
        "afterend",
        `<p class="upload__field-error" id="${id}" aria-live="polite"></p>`
      );
      input.previousElementSibling?.setAttribute("for", input.id);
    });
  }

  _getFieldError(input) {
    const value = input.value.trim();

    if (input.name.startsWith("ingredient")) {
      if (!value) return "";
      try {
        parseIngredient(value);
        return "";
      } catch (error) {
        return error.message;
      }
    }

    const rule = RULES[input.name];
    if (!rule) return "";
    if (!value) return `Enter ${rule.label}`;

    if (rule.url) {
      try {
        const url = new URL(value);
        if (!["http:", "https:"].includes(url.protocol)) throw new Error();
      } catch {
        return "Enter a valid link starting with http:// or https://";
      }
    }
    if (rule.min && value.length < rule.min)
      return `Must be at least ${rule.min} characters`;
    if (rule.number) {
      const num = Number(value);
      if (!Number.isInteger(num) || num <= 0)
        return "Enter a whole number greater than 0";
      if (num > rule.max) return `Max ${rule.max}`;
    }
    return "";
  }

  _setFieldError(input, message) {
    const errorEl = this._parentElement.querySelector(`#error-${input.name}`);
    if (errorEl) errorEl.textContent = message;
    input.classList.toggle("upload__input--invalid", Boolean(message));
    input.setAttribute("aria-invalid", String(Boolean(message)));
  }

  _validate() {
    const inputs = [...this._parentElement.querySelectorAll("input")];
    let firstInvalid = null;

    inputs.forEach((input) => {
      const message = this._getFieldError(input);
      this._setFieldError(input, message);
      if (message && !firstInvalid) firstInvalid = input;
    });

    // At least one ingredient is required
    const ingredients = inputs.filter((i) => i.name.startsWith("ingredient"));
    if (!ingredients.some((i) => i.value.trim())) {
      this._setFieldError(ingredients[0], "Add at least one ingredient");
      firstInvalid ??= ingredients[0];
    }

    firstInvalid?.focus();
    return !firstInvalid;
  }

  _addHandlerLiveValidation() {
    this._parentElement.addEventListener("input", (e) => {
      if (this._submitAttempted && e.target.matches("input"))
        this._setFieldError(e.target, this._getFieldError(e.target));
    });
  }

  //------------------------------ Upload ------------------------------//

  addHandlerUpload(handler) {
    this._parentElement.addEventListener("submit", (e) => {
      e.preventDefault();
      this._submitAttempted = true;
      this._showFormError("");
      if (!this._validate()) return;

      const data = Object.fromEntries([...new FormData(this._parentElement)]);
      handler(data);
    });
  }

  // While uploading, keep the form and show progress on the button
  renderSpinner() {
    const btn = this._parentElement.querySelector(".upload__btn");
    if (!btn) return;
    btn.disabled = true;
    btn.querySelector("span").textContent = "Uploading…";
  }

  // Errors from the API keep the user's input so they can fix and retry
  renderError(message) {
    const btn = this._parentElement.querySelector(".upload__btn");
    if (btn) {
      btn.disabled = false;
      btn.querySelector("span").textContent = "Upload";
    }
    this._showFormError(message);
  }

  _showFormError(message) {
    const el = this._parentElement.querySelector(".upload__form-error");
    if (!el) return;
    el.textContent = message;
    el.classList.toggle("hidden", !message);
  }

  renderMessage(message = this._message) {
    super.renderMessage(message);
    this._closeTimer = setTimeout(
      () => this.closeWindow(),
      MODAL_CLOSE_SEC * 1000
    );
  }

  _generateMarkup() {
    return "";
  }
}

export default new AddRecipeView();
