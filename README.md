# JSI

An S&C Holdings project: a searchable home for small HTML projects, with a Claude Code skill that handles publishing.

## What you do

1. Open this folder in Claude Code.
2. Ask Claude to create something, or give it HTML you already have.
3. Say something natural such as:

   > Publish this to JSI as “Weekend Weather”.

4. Claude creates a safe draft, publishes a preview link, and asks you to check it.
5. Say `publish it` after the preview looks right. Claude merges the draft into `main`; GitHub Pages updates the public site.

You can also type `/publish-jsi` to call the publishing workflow directly.

## One-time GitHub setup

1. Create a **public** GitHub repository. A name such as `jsi` works well.
2. Put these files in the repository and make sure the default branch is named `main`.
3. In the repository, open **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**, then select `main` and `/(root)`.
5. Open the repository folder in Claude Code and make sure normal `git push` works.

GitHub will show the public address in the Pages settings. It usually has the form:

`https://YOUR-GITHUB-NAME.github.io/YOUR-REPOSITORY-NAME/`

## How the shelf is organised

- `index.html` is the searchable home page.
- `projects.json` is the project list Claude updates.
- Each published item lives in `projects/<project-name>/`.
- `.claude/skills/publish-jsi/SKILL.md` is the reusable publishing instruction Claude follows.
- `.nojekyll` tells GitHub Pages to serve the files exactly as written.

Everything is plain HTML, CSS, and JavaScript. There is no build step and no server to maintain.
