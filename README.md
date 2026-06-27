# GI Knowledge Repository

A static, GitHub Pages-hosted reference site for gastroenterology knowledge. Clean sidebar navigation, Markdown-based content, image support.

---

## Setup

1. Push this repo to GitHub
2. Go to **Settings → Pages → Source** → select `main` branch, root `/`
3. Your site will be live at `https://[your-username].github.io/[repo-name]/`
4. Add a `.nojekyll` file to the root if GitHub tries to process the files (already included)

---

## Adding a New Topic

**1. Create the Markdown file**

Add a `.md` file in the appropriate category folder under `content/`:

```
content/esophagus/eosinophilic-esophagitis.md
```

**2. Add it to the navigation index**

Open `content/index.json` and add an entry to the matching category's `topics` array:

```json
{ "title": "Eosinophilic Esophagitis", "file": "content/esophagus/eosinophilic-esophagitis.md" }
```

That's it. The sidebar will update automatically.

---

## Adding Images

**1. Add the image file**

Drop the image into the appropriate folder under `images/`:

```
images/esophagus/eoe-endoscopy.png
```

Accepted formats: `.png`, `.jpg`, `.jpeg`, `.gif`, `.webp`

**2. Reference it in your Markdown**

```markdown
![EoE endoscopic rings](../../images/esophagus/eoe-endoscopy.png)
```

The `../../` prefix navigates up from `content/[category]/` to the repo root, then into `images/`.

---

## Adding a New Category

1. Add a new folder under `content/` and `images/`
2. Add a new entry in `content/index.json` under `"categories"`:

```json
{
  "id": "motility",
  "name": "Motility",
  "topics": [
    { "title": "Achalasia", "file": "content/motility/achalasia.md" }
  ]
}
```

---

## Markdown Tips

Standard Markdown is supported, including:

- `# H1`, `## H2`, `### H3` for headings
- `**bold**`, `*italic*`
- `-` or `*` for bullet lists, `1.` for numbered lists
- Tables using `| Col | Col |` syntax
- `> blockquote` for callouts
- ` ```code blocks``` `

---

## File Structure

```
/
├── index.html              # App shell
├── style.css               # All styles
├── app.js                  # Navigation + content loader
├── .nojekyll               # Prevents Jekyll processing
├── content/
│   ├── index.json          # Navigation index (edit this to add topics)
│   └── [category]/
│       └── [topic].md      # Topic content files
└── images/
    └── [category]/
        └── *.png / *.jpg   # Images referenced in .md files
```
