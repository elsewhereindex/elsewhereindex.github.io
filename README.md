# Elsewhere Index — Personal Site

Minimal personal site built with Jekyll, hosted on GitHub Pages.

## Setup Instructions

### 1. Create the GitHub repo

1. Go to [github.com/new](https://github.com/new)
2. Repository name: **elsewhereindex.com** (or any name — the custom domain handles the URL)
3. Set to **Public** (required for free GitHub Pages)
4. Don't initialize with README (you're pushing these files)
5. Click **Create repository**

### 2. Push this site to GitHub

Open Terminal, navigate to this folder, and run:

```bash
cd path/to/elsewhere-site
git init
git add .
git commit -m "Initial site"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/elsewhereindex.com.git
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username.

### 3. Enable GitHub Pages

1. Go to your repo on GitHub → **Settings** → **Pages**
2. Under "Source", select **Deploy from a branch**
3. Branch: **main** / folder: **/ (root)**
4. Click **Save**
5. Wait 1-2 minutes — your site will be live at `https://YOUR_USERNAME.github.io/elsewhereindex.com/`

### 4. Add custom domain (after purchasing)

1. Buy `elsewhereindex.com` from [Namecheap](https://namecheap.com), [Cloudflare](https://cloudflare.com), or [Google Domains](https://domains.google)
2. In your domain registrar's DNS settings, add these records:

   **A Records** (point to GitHub's servers):
   ```
   185.199.108.153
   185.199.109.153
   185.199.110.153
   185.199.111.153
   ```

   **CNAME Record:**
   ```
   www → YOUR_USERNAME.github.io
   ```

3. In GitHub repo → **Settings** → **Pages** → **Custom domain**: enter `elsewhereindex.com`
4. Check **Enforce HTTPS**
5. Wait up to 24 hours for DNS to propagate (usually much faster)

### 5. Set up email (optional)

For `earl@elsewhereindex.com`, you can use:
- **ImprovMX** (free) — forwards to your personal email
- **Cloudflare Email Routing** (free if domain is on Cloudflare)
- **Google Workspace** ($6/month — overkill unless you want full Gmail)

The cheapest path: buy the domain on Cloudflare ($10-12/year), use their free email routing to forward `earl@elsewhereindex.com` to your personal Gmail.

## Adding pages later

To add a new page, create a markdown file anywhere in the site:

```markdown
---
layout: page
title: Your Page Title
subtitle: Optional subtitle
nav:
  - title: Home
    url: /
---

Your content here in markdown.
```

Then add a link to it from `index.html` in the `index-links` div.

## Local development (optional)

If you want to preview changes locally before pushing:

```bash
bundle install
bundle exec jekyll serve
```

Then open `http://localhost:4000` in your browser.
