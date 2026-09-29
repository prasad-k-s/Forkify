# 🍕 Forkify — Search Over 1,000,000 Recipes

A responsive recipe app built with vanilla JavaScript using the **MVC architecture**. Search for recipes, adjust servings, bookmark your favourites, and upload your own recipes.

![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Sass](https://img.shields.io/badge/Sass-CC6699?style=for-the-badge&logo=sass&logoColor=white)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![Parcel](https://img.shields.io/badge/Parcel-21374B?style=for-the-badge&logo=parcel&logoColor=white)

**🔗 Live demo:** [add your deployed link here](#)

---

## ✨ Features

### 🔍 Search & browse
- Search recipes by name or ingredient
- Friendly empty state with one-tap search suggestions (Pizza, Pasta, Curry…)
- Paginated results (10 per page)
- Loading spinners and friendly error messages (no results, network issues, timeouts)

### 🍳 Recipe details
- Ingredients, cooking time, servings and a link to the full directions
- **Adjust servings** — ingredient quantities update instantly and display as fractions (e.g. `1 1/2 cups`)

### 🔖 Bookmarks
- Bookmark and un-bookmark recipes
- Bookmarks are saved in **localStorage** and survive page reloads
- Bookmarks panel opens on hover (desktop) or tap (mobile)

### ➕ Upload your own recipe
- Add a recipe with title, links, prep time, servings and up to 6 ingredients
- **Inline form validation** — clear, per-field error messages (valid URLs, whole numbers, `Quantity,Unit,Description` ingredient format)
- Your input is kept if the upload fails, so you can fix it and retry
- Uploaded recipes are automatically bookmarked and marked with a user icon

### 📱 Fully responsive
- **Desktop:** results list and recipe side by side
- **Tablet:** compact two-column layout
- **Mobile:** two-screen layout — results list first, tap a recipe to open it, "Back to results" to return (works with the browser back button too)
- Touch-friendly header with icon buttons, full-width search and a scrollable Add Recipe window

---

## 🛠️ Tech Stack

| Technology | Purpose |
| --- | --- |
| **JavaScript (ES2022)** | Classes, private-style fields, async/await, ES modules |
| **Sass (SCSS)** | Modular styles with partials, variables and media queries |
| **Parcel 2** | Bundling, dev server and production builds |
| **fraction.js** | Displaying ingredient quantities as fractions |
| **core-js / regenerator-runtime** | Polyfills for older browsers |
| **Forkify API** | Recipe data |

---

## 🧱 Architecture

The app follows the **Model–View–Controller (MVC)** pattern with a **publisher–subscriber** approach for events:

```
src/js/
├── controller.js      → Connects model and views, handles app logic
├── model.js           → State, API calls, bookmarks, recipe upload
├── helpers.js         → AJAX helper with request timeout
├── config.js          → API URL, key and settings
└── views/
    ├── view.js            → Parent class: render, update, spinner, error, message
    ├── recipeView.js      → Recipe details, servings, bookmark button
    ├── resultsView.js     → Search results list
    ├── previewView.js     → Single result / bookmark item
    ├── paginationView.js  → Page buttons
    ├── bookmarkView.js    → Bookmarks panel
    ├── searchView.js      → Search form
    └── addRecipeView.js   → Upload form and validation
```

Key techniques used:
- **Publisher–subscriber pattern** — views expose `addHandler…` methods and the controller subscribes to them
- **DOM diffing in `update()`** — only changed text and attributes are updated (e.g. when changing servings), instead of re-rendering the whole view
- **Event delegation** for buttons inside dynamically rendered content
- **Hash-based routing** — each recipe has its own URL (`#recipeId`)
- `Promise.race` to add a **timeout** to fetch requests

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or newer)

### Installation

```bash
git clone https://github.com/prasad-k-s/Forkify.git
cd Forkify
npm install
```

### Run locally

```bash
npm start
```

Then open the URL Parcel prints (usually `http://localhost:1234`).

### Production build

```bash
npm run build
```

The optimised files are created in the `dist/` folder, ready to deploy (e.g. Netlify or Vercel).

---

## 📂 Project Structure

```
Forkify/
├── index.html
├── package.json
└── src/
    ├── img/          # Logo, favicon and SVG icon sprite
    ├── js/           # Model, views, controller, helpers
    └── sass/         # SCSS partials
```

---

## 🔮 Future Improvements

- Number of servings and total time in the bookmark list
- Shopping list generated from recipe ingredients
- Weekly meal planning
- Nutrition data for each ingredient
- Delete uploaded recipes

---

## 🙏 Credits

The base project comes from [Jonas Schmedtmann's](https://twitter.com/jonasschmedtman) *The Complete JavaScript Course*.

On top of the course version I added a fully responsive two-screen mobile layout, tap-to-open bookmarks, inline validation for the upload form (keeping input on errors), better error handling for searches, fraction rounding for servings, and several bug fixes and code cleanups.
