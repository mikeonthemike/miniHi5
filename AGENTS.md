# AGENTS.md

## Cursor Cloud specific instructions

This is **miniHi5** — a static HTML/CSS/JS web app with no build system, no package manager, and no dependencies.

### Running the dev server

Serve the files with any static HTTP server from the repo root:

```sh
python3 -m http.server 8080
```

Then open `http://localhost:8080` in a browser.

### Notes

- There are no linters, automated tests, or build steps configured in this project.
- The Discord webhook URL in `high-five.js` is hardcoded and likely expired; the app works fine without it (the fetch call will fail silently in the console).
- The `file://` protocol will not work due to CORS restrictions on the `fetch()` call in `high-five.js`; always use an HTTP server.
