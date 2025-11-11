# RBLX Cultivation Simulator — GitHub Pages setup

This repository contains a static HTML-based "Elixir Calculator" for the RBLX Cultivation Simulator project.

This workspace is currently prepared to be published as a GitHub Pages *user site* at `https://jensenallenco.github.io/` and to serve a custom domain `cultivationsimulator.wiki`.

What I added here to prepare the user-site:
- `index.html` — the site entry (already present in this folder).
- `CNAME` — contains the custom domain `cultivationsimulator.wiki` (so GitHub Pages knows to use it).
- `README.md` — this file with instructions.

Next steps (one-line commands you can run in PowerShell):

1) Create the GitHub user-site repository and push the current folder contents to it (using `gh`):

```powershell
Set-Location 'D:\Downloads\cultivation_simulator'
# create the repo on GitHub and push (make sure you are authenticated with gh)
gh repo create jensenallenco.github.io --public --source=. --remote=origin --push
```

If you prefer to create the repo in the web UI, create a new repository named `jensenallenco.github.io`, then run:

```powershell
Set-Location 'D:\Downloads\cultivation_simulator'
git init                  # only if not already a git repo in this folder
git remote add origin https://github.com/jensenallenco/jensenallenco.github.io.git
git branch -M main
git add .
git commit -m "Deploy user site: index + CNAME"
git push -u origin main
```

2) Configure DNS for `cultivationsimulator.wiki` (apex/root domain):

- If your DNS provider supports ALIAS/ANAME for apex, point the apex to `jensenallenco.github.io` using ALIAS/ANAME.
- Otherwise, add the following A records for the root (apex) domain:
  - 185.199.108.153
  - 185.199.109.153
  - 185.199.110.153
  - 185.199.111.153

- (Optional) If you want `www.cultivationsimulator.wiki` to redirect/point to the site, add a CNAME for `www` pointing to `jensenallenco.github.io`.

3) Enable Pages & HTTPS:
- In Settings → Pages, choose branch `main` and folder `/ (root)`; save. GitHub will detect the `CNAME` and provision HTTPS for the custom domain. This can take a few minutes.

Notes & caveats:
- GitHub Pages supports only static files (HTML/CSS/JS). All links and resources should use relative paths.
- If you already have a Pages site for the same custom domain on another repo, remove the custom domain there first.
- Certificate issuance for HTTPS may take several minutes. If you see an error, verify DNS records and retry.

If you want, I can run the `gh` command here (requires `gh` authenticated in your shell), or I can instead show exact PowerShell commands to run manually. Tell me which you prefer.