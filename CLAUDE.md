# GI Knowledge Repo — Claude Context

## Repo
- Local: `/Users/bobby/Documents/Claude/Projects/GI Knowledge Repo`
- Remote: `git@github.com:bobbykahlon/gi-knowledge-repo.git`
- Live site: `https://bobbykahlon.github.io/gi-knowledge-repo/`

## Deploy
```bash
git add .
git commit -m "description"
git push
```
Live in ~30 seconds after push.

## Adding Content

**New topic:**
1. Create `content/[category]/[topic-name].md`
2. Add entry to `content/index.json` under the right category

**New image:**
1. Drop in `images/[category]/`
2. Reference in markdown: `![alt](../../images/[category]/filename.png)`

**New interactive algorithm:**
1. Create `content/[category]/[topic]-algorithm.html` (model on `content/pancreas/cyst-algorithm.html`)
2. Embed in `.md` via iframe + auto-resize script (see existing examples)

## Categories
esophagus, stomach, small-intestine, liver, biliary-tract, pancreas, gi-bleeding, large-intestine, ibd, miscellaneous, endoscopy

## Current Pancreatic Cysts Page Structure
Overview image → Cyst Fluid Analysis → Key Differentiating Points → Management Algorithm → Cyst Surveillance
