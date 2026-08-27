---
name: publish-jsi
description: Publish standalone HTML projects to JSI, an S&C Holdings project hosted on GitHub Pages. Use whenever the user casually asks to publish, post, ship, upload, add, or put a page/project/site/tool/game/experiment in JSI, the shelf, collection, or bucket; says “publish this HTML” or “put this online”; or invokes /publish-jsi.
argument-hint: "[files or description to publish, optional project title]"
---

# Publish to JSI

Turn the user's HTML into a tidy project on the searchable shelf. Handle the file work and git workflow; do not expect the user to know repository terminology.

## Safety rule

`main` is the public site. Never create or edit a project directly on `main`, and never merge a draft until the user explicitly approves the preview. Do not force-push, rewrite history, discard unrelated work, or bypass certificate/security checks.

## Understand the request

Infer sensible defaults from the conversation and the supplied files. Ask one concise question only if a missing answer would materially change the result.

Determine:

- the HTML file or files to publish;
- whether this is a new project or an update to a project already in `projects.json`;
- a human title and a kebab-case slug;
- page order for a multi-page project;
- a short description, useful search tags, and today's date.

Related pages belong together in one project. Preserve supporting CSS, JavaScript, images, fonts, and data with their relative paths intact.

## Shelf format

`projects.json` is the source of truth. Each entry has this shape:

```json
{
  "slug": "weekend-weather",
  "title": "Weekend Weather",
  "description": "A short, useful summary.",
  "tags": ["weather", "tool"],
  "date": "YYYY-MM-DD",
  "path": "projects/weekend-weather/",
  "pages": []
}
```

For a multi-page project, `pages` is ordered and contains:

```json
{ "title": "Forecast", "file": "forecast.html", "description": "A seven-day forecast view." }
```

The home page reads this file automatically. Never hard-code project cards into `index.html`.

## Prepare a draft

1. Confirm this is a git repository with an `origin` remote. If not, explain the one missing setup step plainly and stop.
2. Check `git status`. Preserve unrelated changes. If they overlap the files needed for this publish, ask before proceeding.
3. Return to `main`, pull the latest version without overwriting local work, and create or reuse `draft/<slug>`.
4. Create `projects/<slug>/`.
5. For a single-page project, the supplied page becomes `projects/<slug>/index.html`.
6. For a multi-page project, copy each page with a clear filename and create `projects/<slug>/index.html` from `templates/project-hub.html`.
7. Add the JSI navigation immediately inside `<body>` on every HTML page. Use `templates/project-nav.html` as the pattern. Keep it fixed to the top. For multi-page projects, include links to sibling pages and visually mark the current page.
8. Update or append the matching entry in `projects.json`. Keep valid JSON and do not change unrelated entries.
9. Check each published file for broken relative asset paths, missing titles, and obvious browser errors. Serve the repository locally when practical and verify the project and shelf load.
10. Commit only the project, its manifest change, and any deliberate supporting files. Use `Publish <slug>` as the commit subject.
11. Push the draft branch to `origin`.

## Give the user a preview

Read the remote with `git remote get-url origin` and the commit with `git rev-parse HEAD`. Derive the GitHub owner and repository from either the HTTPS or SSH remote.

Share this preview URL, using the full commit SHA:

`https://raw.githack.com/<owner>/<repository>/<commit-sha>/projects/<slug>/index.html`

Say what was added in one sentence and ask the user to approve the preview. Do not merge yet. If changes are requested, keep working on the same draft branch, commit, push, and send a fresh commit-SHA preview.

## Publish after approval

Only after explicit approval:

1. Check out `main` and pull the latest version safely.
2. Merge `draft/<slug>` with a merge commit named `Publish <slug>`.
3. Push `main`.
4. Derive the live project URL from the remote:
   `https://<owner>.github.io/<repository>/projects/<slug>/`
5. GitHub Pages can take a short while to refresh. Check the URL a few times over no more than two minutes; report success when it returns normally, or give the URL and say it is still deploying.
6. After a successful merge, delete the local and remote draft branch.

Finish with the live project link. Keep the explanation nontechnical unless the user asks for details.

## Updates and removals

- For an update, reuse the existing project folder and manifest entry; preserve its slug unless the user asks to rename it.
- If the page list changes, refresh the sibling links on every page in that project.
- Removing a project deletes public content. Explain exactly what will disappear and ask for confirmation immediately before deleting its folder or manifest entry.
