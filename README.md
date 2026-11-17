# EE-Motion project page

Project page of the WWW 2027 Demonstrations Track paper *EE-Motion: An EEG-based Web Architecture for Live Affective Music Recommendation*, served by GitHub Pages at <https://ee-motion.github.io/>.

## Local preview

```bash
docker compose up -d     # http://localhost:8090 (set PORT=... to change it)
docker compose down
```

The stack is a single `nginx:1.27-alpine` container that serves the repository read-only, so edits are visible on reload. Dotfiles and the Docker files are not served, as on GitHub Pages.

## Layout

| Path | Content |
|---|---|
| `index.html` | The page |
| `static/css/index.css`, `static/js/index.js` | Page styles and scripts (navbar, walkthrough viewer, BibTeX copy) |
| `static/css/bulma.min.css` | Bulma 0.9.1, from the Nerfies template |
| `static/css/fontawesome.all.min.css`, `static/webfonts/` | Font Awesome Free 6.5.2 |
| `static/images/figures/` | Figure 1 of the paper (architecture, PNG and SVG) |
| `static/images/journey/` | Screenshots of Figures 2 and 3, cropped as in the paper (for the Demonstration section, currently not on the page) |
| `static/paper/EE-Motion_paper.pdf` | The paper, public version (no line numbers) |
| `static/videos/` | Demo videos |
| `docker-compose.yml`, `docker/nginx.conf` | Local preview only |

## YouTube links

The "YouTube" button in the header opens a menu with one link per scenario (`#yt-menu` in `index.html`): Scenario 1 (with BCI) and Scenario 2 (without BCI).

## Regenerating the assets

Run from `ee-motion.github.io/`; `PAPER` is the paper folder.

```bash
PAPER=../../paper/definitive

# Paper PDF (the paper folder is mounted read-only; auxiliary files go to /tmp/out)
docker run --rm -v "$PWD/$PAPER":/src:ro -v /tmp/out:/out -w /src -e BIBINPUTS=/src: -e BSTINPUTS=/src: \
       texlive/texlive:latest latexmk -pdf -interaction=nonstopmode -outdir=/out main.tex
cp /tmp/out/main.pdf static/paper/EE-Motion_paper.pdf

# Videos (Scenario 1: bci, Scenario 2: no-bci): GitHub rejects files over 100 MB.
# H.264 at 30 fps, CRF 26, faststart for streaming; 1920 x 1080, as recorded.
for v in bci no-bci; do
  ffmpeg -i ../ee-motion-$v-demo.mp4 -c:v libx264 -preset slow -crf 26 -r 30 -pix_fmt yuv420p \
         -c:a aac -b:a 128k -movflags +faststart static/videos/ee-motion-$v-demo.mp4
  ffmpeg -ss 120 -i static/videos/ee-motion-$v-demo.mp4 -frames:v 1 -vf scale=1600:-2 -q:v 3 \
         static/images/video-poster-$v.jpg
done

# Figure 1
pdftocairo -svg $PAPER/images/architecture/architecture.pdf static/images/figures/architecture.svg
pdftocairo -png -singlefile -r 330 $PAPER/images/architecture/architecture.pdf static/images/figures/architecture

# Figures 2 and 3: crops from figures/journey.tex and figures/recommendations.tex
# (trim = left bottom right top on 2072 x 1696 px screenshots), resized to 1600 px, WebP.
magick $PAPER/images/journey/landing.png -crop 1984x1284+44+140 +repage -resize 1600x -quality 88 static/images/journey/1-landing.webp
```

## Deployment

GitHub Pages serves the `main` branch of `EE-Motion/ee-motion.github.io` from the repository root. `.nojekyll` disables the Jekyll build, so every file is published as is.

## Credits

The page is adapted from the [Nerfies](https://github.com/nerfies/nerfies.github.io) template, licensed under [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/).
