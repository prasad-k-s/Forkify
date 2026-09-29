import { API_URL, RESULT_PER_PAGE, KEY } from "./config";
import { AJAX } from "./helpers";

export const state = {
  recipe: {},
  search: {
    query: "",
    results: [],
    resultsPerPage: RESULT_PER_PAGE,
    page: 1,
  },
  bookmarks: [],
};

const createRecipeObject = function (data) {
  const { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  };
};

export const loadRecipe = async function (id) {
  const data = await AJAX(`${API_URL}${id}?key=${KEY}`);
  state.recipe = createRecipeObject(data);
  state.recipe.bookmarked = state.bookmarks.some(
    (bookmark) => bookmark.id === id
  );
};

export const loadSearchResults = async function (query) {
  state.search.query = query;

  const data = await AJAX(
    `${API_URL}?search=${encodeURIComponent(query)}&key=${KEY}`
  );

  state.search.results = data.data.recipes.map((rec) => ({
    id: rec.id,
    title: rec.title,
    publisher: rec.publisher,
    image: rec.image_url,
    ...(rec.key && { key: rec.key }),
  }));

  state.search.page = 1;
};

export const getSearchResultPage = function (page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;
  return state.search.results.slice(start, end);
};

export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach((ing) => {
    if (ing.quantity)
      ing.quantity = ing.quantity * (newServings / state.recipe.servings);
  });

  state.recipe.servings = newServings;
};

const persistBookmarks = function () {
  localStorage.setItem("bookmarks", JSON.stringify(state.bookmarks));
};

export const addBookmark = function (recipe) {
  state.bookmarks.push(recipe);

  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  persistBookmarks();
};

export const deleteBookmark = function (id) {
  const index = state.bookmarks.findIndex((el) => el.id === id);
  if (index !== -1) state.bookmarks.splice(index, 1);

  if (id === state.recipe.id) state.recipe.bookmarked = false;

  persistBookmarks();
};

// Parses "Quantity,Unit,Description" into an ingredient object
export const parseIngredient = function (text) {
  const parts = text.split(",").map((el) => el.trim());
  if (parts.length !== 3)
    throw new Error("Use the format 'Quantity,Unit,Description'");

  const [quantity, unit, description] = parts;
  if (quantity && !(Number(quantity) > 0))
    throw new Error("Quantity must be a number greater than 0, or empty");
  if (!description) throw new Error("Description can't be empty");

  return { quantity: quantity ? +quantity : null, unit, description };
};

export const uploadRecipe = async function (newRecipe) {
  const ingredients = Object.entries(newRecipe)
    .filter(([key, value]) => key.startsWith("ingredient") && value.trim())
    .map(([, value]) => parseIngredient(value));

  const recipe = {
    title: newRecipe.title,
    source_url: newRecipe.sourceUrl,
    image_url: newRecipe.image,
    publisher: newRecipe.publisher,
    cooking_time: +newRecipe.cookingTime,
    servings: +newRecipe.servings,
    ingredients,
  };

  const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
  state.recipe = createRecipeObject(data);
  addBookmark(state.recipe);
};

const init = function () {
  try {
    const storage = JSON.parse(localStorage.getItem("bookmarks"));
    if (Array.isArray(storage)) state.bookmarks = storage;
  } catch {
    state.bookmarks = [];
  }
};
init();
