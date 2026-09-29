import View from "./view";
import previewView from "./previewView";

class BookmarkView extends View {
  _parentElement = document.querySelector(".bookmarks__list");
  _panel = document.querySelector(".bookmarks");
  _btnToggle = document.querySelector(".nav__btn--bookmarks");
  _errorMessage = "No bookmarks yet. Find a nice recipe and bookmark it :)";
  _message = "";

  constructor() {
    super();
    this._addHandlerTogglePanel();
  }

  // An empty list is a normal state, so show a friendly message, not an error
  render(data, render = true) {
    if (Array.isArray(data) && data.length === 0)
      return this.renderMessage(this._errorMessage);
    return super.render(data, render);
  }

  _generateMarkup() {
    return this._data
      .map((bookmark) => previewView.render(bookmark, false))
      .join("");
  }

  addHandlerRender(handler) {
    window.addEventListener("load", handler);
  }

  // Open on click/tap too, not only on hover (touch screens have no hover)
  _addHandlerTogglePanel() {
    this._btnToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      this.togglePanel();
    });

    document.addEventListener("click", (e) => {
      if (!this._panel.contains(e.target)) this.closePanel();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") this.closePanel();
    });
  }

  togglePanel(open = !this._panel.classList.contains("bookmarks--open")) {
    this._panel.classList.toggle("bookmarks--open", open);
    this._btnToggle.setAttribute("aria-expanded", String(open));
  }

  closePanel() {
    this.togglePanel(false);
  }
}

export default new BookmarkView();
