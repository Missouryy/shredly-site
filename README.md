# Shredly website

Static Home, Support, and Privacy pages for GitHub Pages. No build step or external runtime is required.

## Local preview

From this directory, run `python3 -m http.server 8000` and open `http://localhost:8000/`.

## Publishing

Publish the contents of this directory from the root of `Missouryy/shredly-site` on its `main` branch. In the repository's **Settings → Pages**, choose **Deploy from a branch**, `main`, and `/(root)`. The `.nojekyll` file makes GitHub serve the static assets as written.

Links are relative so the site works at `https://missouryy.github.io/shredly-site/` and in a local preview. The theme follows the system until a visitor chooses light or dark; that choice is saved only in browser local storage.
