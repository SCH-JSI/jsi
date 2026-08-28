const grid = document.querySelector("#project-grid");

const createProjectBook = (project, index) => {
  const link = document.createElement("a");
  link.className = "project-book project-shape-" + ((index % 6) + 1);
  if (project.title.length > 24) link.classList.add("project-book-long-title");
  link.href = project.path;
  link.setAttribute("aria-label", "Open " + project.title);

  const number = document.createElement("span");
  number.className = "book-number";
  number.textContent = "JSI " + String(index + 1).padStart(3, "0");

  const title = document.createElement("strong");
  title.textContent = project.title;

  const description = document.createElement("small");
  description.textContent = project.description;

  const arrow = document.createElement("i");
  arrow.setAttribute("aria-hidden", "true");
  arrow.textContent = "↗";

  link.append(number, title, description, arrow);
  return link;
};

fetch("projects.json", { cache: "no-store" })
  .then((response) => {
    if (!response.ok) throw new Error("Could not load projects.");
    return response.json();
  })
  .then((data) => {
    const projects = (data.projects || [])
      .filter((project) => !project.hidden)
      .sort((a, b) => b.date.localeCompare(a.date));

    grid.replaceChildren(...projects.map(createProjectBook));
    grid.setAttribute("aria-label", projects.length
      ? projects.length + " project" + (projects.length === 1 ? "" : "s") + " on the shelf"
      : "The shelf is ready for its first public project");
  })
  .catch(() => {
    grid.setAttribute("aria-label", "The project shelf is temporarily unavailable");
  });
