# KlyraStudio Jewelry Website

This repository contains a luxury jewelry storefront and admin portal built as a static website.

## Files

- `index.html` — customer-facing website
- `admin.html` — admin portal for product and order management
- `styles.css` — visual styling
- `script.js` — storefront behavior and order creation
- `admin.js` — admin logic and order verification

## Deploying to GitHub Pages

1. Create a GitHub repository named `klyrastudio` or `klyrastudio.github.io`.
2. Add the repository remote and push:

```bash
git remote add origin https://github.com/<your-username>/klyrastudio.git
git push -u origin main
```

3. If using GitHub Pages with a repo named `klyrastudio`, enable Pages from the `main` branch and serve from `/`.
4. The site URL will be:
   - `https://<your-username>.github.io/klyrastudio` or
   - `https://<your-username>.github.io` if the repo is named `klyrastudio.github.io`

## Admin Login

- Username: `Klyrastudio11`
- Password: `Klyrastudio@11`

## Notes

- No backend is required; orders are stored locally in browser storage.
- For Google Sheets, export orders to CSV or copy order text and paste into Sheets.
- For a custom domain like `klyrastudio.com`, purchase the domain and configure it in GitHub Pages settings.
