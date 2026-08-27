const grid = document.querySelector("#project-grid");
const input = document.querySelector("#search-input");
const count = document.querySelector("#project-count");
const emptyState = document.querySelector("#empty-state");
const clearButton = document.querySelector("#clear-search");

let projects = [];

const escapeHtml = (value = "") => value.replace(/[&<>'"]/g, (character) => ({
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  "'": "&#39;",
  '"': "&quot;",
}[character]));

const highlight = (value, query) => {
  const safe = escapeHtml(value);
  if (!query) return safe;
  const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return safe.replace(new RegExp(`(${escapedQuery})`, "gi"), "<mark>$1</mark>");
};

const searchableText = (project) => [
  project.title,
  project.description,
  ...(project.tags || []),
  ...(project.pages || []).flatMap((page) => [page.title, page.description]),
].filter(Boolean).join(" ").toLowerCase();

const render = () => {
  const query = input.value.trim().toLowerCase();
  const visible = projects.filter((project) => searchableText(project).includes(query));

  count.textContent = `${visible.length} of ${projects.length} project${projects.length === 1 ? "" : "s"}`;
  emptyState.hidden = visible.length !== 0;

  grid.innerHTML = visible.map((project, index) => {
    const pages = project.pages || [];
    const pageLinks = pages.length
      ? `<div class="page-links" aria-label="Pages in ${escapeHtml(project.title)}">${pages.map((page) => (
          `<a href="${escapeHtml(project.path + page.file)}">${highlight(page.title, query)} ↗</a>`
        )).join("")}</div>`
      : "";

    return `
      <article class="project-card">
        <div class="card-top">
          <span class="card-index">${String(index + 1).padStart(2, "0")}${pages.length ? ` · ${pages.length} pages` : ""}</span>
          <a class="card-arrow" href="${escapeHtml(project.path)}" aria-label="Open ${escapeHtml(project.title)}">↗</a>
        </div>
        <h3><a href="${escapeHtml(project.path)}">${highlight(project.title, query)}</a></h3>
        <p class="description">${highlight(project.description, query)}</p>
        ${pageLinks}
        <div class="card-meta">
          ${(project.tags || []).map((tag) => `<span class="tag">${highlight(tag, query)}</span>`).join("")}
          <time class="date" datetime="${escapeHtml(project.date)}">${escapeHtml(project.date)}</time>
        </div>
      </article>`;
  }).join("");
};

input.addEventListener("input", render);
clearButton.addEventListener("click", () => {
  input.value = "";
  render();
  input.focus();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "/" && document.activeElement !== input) {
    event.preventDefault();
    input.focus();
  }
  if (event.key === "Escape" && document.activeElement === input) {
    input.value = "";
    render();
    input.blur();
  }
});

fetch("projects.json", { cache: "no-store" })
  .then((response) => {
    if (!response.ok) throw new Error("Could not load projects.");
    return response.json();
  })
  .then((data) => {
    projects = (data.projects || []).sort((a, b) => b.date.localeCompare(a.date));
    render();
  })
  .catch(() => {
    count.textContent = "Could not load the shelf";
    grid.innerHTML = '<p class="empty-state">The projects list is temporarily unavailable.</p>';
  });
