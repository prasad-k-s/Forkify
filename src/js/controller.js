import * as model from "./model";
import recipeView from "./views/recipeView";
import searchView from "./views/searchView";
import resultsView from "./views/resultsView";
import paginationView from "./views/paginationView";
import bookmarkView from "./views/bookmarkView";
import addRecipeView from "./views/addRecipeView";

import "core-js/stable";
import "regenerator-runtime/runtime";

if (module.hot) {
  module.hot.accept();
}

const controlRecipe = async function () {
  const id = window.location.hash.slice(1);
  bookmarkView.closePanel();
  recipeView.showScreen(Boolean(id));
  if (!id) return;

  try {
    recipeView.renderSpinner();

    resultsView.update(model.getSearchResultPage());
    bookmarkView.update(model.state.bookmarks);

    await model.loadRecipe(id);

    recipeView.render(model.state.recipe);
  } catch (error) {
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  const query = searchView.getQuery();
  if (!query) return;

  // On phones, searching from the recipe screen goes back to the results
  if (recipeView.isStackedLayout() && window.location.hash) {
    window.location.hash = "";
  }

  try {
    resultsView.renderSpinner();
    paginationView.clear();

    await model.loadSearchResults(query);

    resultsView.render(model.getSearchResultPage());
    paginationView.render(model.state.search);
    searchView.clearInput();
  } catch (error) {
    resultsView.renderError(`Something went wrong: ${error.message}`);
  }
};

const controlPagination = function (goToPage) {
  resultsView.render(model.getSearchResultPage(goToPage));
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  model.updateServings(newServings);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  recipeView.update(model.state.recipe);
  bookmarkView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarkView.render(model.state.bookmarks);
};

const controlBack = function () {
  window.location.hash = "";
};

const controlAddRecipe = async function (newRecipe) {
  try {
    addRecipeView.renderSpinner();

    await model.uploadRecipe(newRecipe);

    recipeView.render(model.state.recipe);
    recipeView.showScreen(true);
    addRecipeView.renderMessage();
    bookmarkView.render(model.state.bookmarks);

    window.history.pushState(null, "", `#${model.state.recipe.id}`);
  } catch (error) {
    addRecipeView.renderError(error.message);
  }
};

const init = function () {
  bookmarkView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipe);
  recipeView.addHandlerBookmark(controlAddBookmark);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerBack(controlBack);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();
