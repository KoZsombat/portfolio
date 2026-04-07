const projectDiv = document.getElementById("prj-holder");
const achievementsDiv = document.getElementById("ach-holder");
const schoolDiv = document.getElementById("school-holder");
const jobDiv = document.getElementById("job-holder");
const resultsDiv = document.getElementById("results");
const ageValue = document.getElementById("age-value");
const projectsMoreButton = document.getElementById("projects-more");
const projectsModal = document.getElementById("projects-modal");
const projectsModalHolder = document.getElementById("projects-modal-holder");
const projectsModalClose = document.getElementById("projects-modal-close");
const imageViewer = document.getElementById("image-viewer");
const imageViewerImg = document.getElementById("image-viewer-img");
const imageViewerClose = document.getElementById("image-viewer-close");
const imageViewerTitle = document.getElementById("image-viewer-title");
const languageButtons = document.querySelectorAll(".lang-btn");

const featuredProjectCount = 2;

const state = {
  lang: localStorage.getItem("portfolioLang") === "hu" ? "hu" : "en",
  achievements: [],
  schools: [],
  jobs: [],
  projects: [],
  activities: []
};

const i18n = {
  en: {
    "meta.description": "Portfolio of Zsombor Kovacs - software developer showcasing projects, recent GitHub activity, and contact links.",
    "skip.link": "Skip to main content",
    "nav.achievements": "Achievements",
    "nav.timeline": "Schools & Jobs",
    "nav.projects": "My Projects",
    "hero.greeting": "<span>Hi, I'm</span> <span class=\"phone-name\">Zsombor</span>",
    "hero.role": "Software Developer",
    "social.linkedin": "LinkedIn",
    "social.github": "GitHub",
    "social.cv": "CV",
    "social.email": "Email",
    "social.linkedin.aria": "Visit my LinkedIn profile",
    "social.github.aria": "Visit my GitHub profile",
    "social.cv.aria": "Download my CV",
    "social.email.aria": "Send me an email",
    "section.achievements": "Achievements",
    "section.timeline": "Schools & Jobs",
    "section.schools": "Schools",
    "section.jobs": "Jobs",
    "section.projects": "My Projects",
    "section.recent": "Recent Activities",
    "projects.showMore": "Show more",
    "projects.modalTitle": "All Projects",
    "projects.close": "Close",
    "imageViewer.title": "Project preview",
    "imageViewer.close": "Close preview",
    "project.openImageAria": "Open full-size image for {name}",
    "timeline.emptyJobs": "Looking for job offers",
    "timeline.emptySchools": "No school entries yet",
    "repos.loading": "Loading...",
    "repos.fetchError": "Could not fetch repositories or no repositories found.",
    "repos.loadError": "Error loading repositories: {message}",
    "repos.open": "Open {name} repository on GitHub",
    "repos.logoAlt": "{name} repository logo",
    "project.cardAria": "{name} project. Click to expand description",
    "project.previewAlt": "{name} project preview",
    "project.github": "GitHub",
    "project.demo": "Demo",
    "project.githubAria": "Open {name} on GitHub",
    "project.demoAria": "Open demo for {name}"
  },
  hu: {
    "meta.description": "Kovács Zsombor portfóliója - szoftverfejlesztő projektek, friss GitHub aktivitás és elérhetőségek.",
    "skip.link": "Ugrás a fő tartalomra",
    "nav.achievements": "Eredmények",
    "nav.timeline": "Iskolák és munkák",
    "nav.projects": "Projektjeim",
    "hero.greeting": "<span>Szia,</span> <span class=\"phone-name\">Zsombor vagyok</span>",
    "hero.role": "Szoftverfejlesztő",
    "social.linkedin": "LinkedIn",
    "social.github": "GitHub",
    "social.cv": "CV",
    "social.email": "Email",
    "social.linkedin.aria": "LinkedIn profil megnyitása",
    "social.github.aria": "GitHub profil megnyitása",
    "social.cv.aria": "Az önéletrajzom letöltése",
    "social.email.aria": "E-mail küldése",
    "section.achievements": "Eredmények",
    "section.timeline": "Iskolák & munkák",
    "section.schools": "Iskolák",
    "section.jobs": "Munkák",
    "section.projects": "Projektjeim",
    "section.recent": "Legutóbbi aktivitások",
    "projects.showMore": "Mutass többet",
    "projects.modalTitle": "Összes projekt",
    "projects.close": "Bezárás",
    "imageViewer.title": "Projekt előnézet",
    "imageViewer.close": "Előnézet bezárása",
    "project.openImageAria": "A(z) {name} teljes méretű képének megnyitása",
    "timeline.emptyJobs": "Jelenleg álláslehetőségeket keresek",
    "timeline.emptySchools": "Még nincs rögzített iskola",
    "repos.loading": "Betöltés...",
    "repos.fetchError": "Nem sikerült lekérni a repositorykat, vagy nem található nyilvános repository.",
    "repos.loadError": "Hiba történt a repositoryk betöltése közben: {message}",
    "repos.open": "A(z) {name} repository megnyitása GitHubon",
    "repos.logoAlt": "{name} repository logó",
    "project.cardAria": "{name} projekt. Kattintásra lenyitható leírás",
    "project.previewAlt": "{name} projekt előnézet",
    "project.github": "GitHub",
    "project.demo": "Demó",
    "project.githubAria": "A(z) {name} projekt megnyitása GitHubon",
    "project.demoAria": "A(z) {name} demó megnyitása"
  }
};

function t(key, values = {}) {
  const fallback = i18n.en[key] || key;
  const template = i18n[state.lang][key] || fallback;
  return template.replace(/\{(\w+)\}/g, (_, token) => values[token] || "");
}

function localized(item, field) {
  const localizedField = item[`${field}_${state.lang}`];
  return localizedField || item[field] || "";
}

function calculateAge(birthdateString) {
  const birthdate = new Date(birthdateString);
  const now = new Date();
  let age = now.getFullYear() - birthdate.getFullYear();
  const monthDifference = now.getMonth() - birthdate.getMonth();
  const dayDifference = now.getDate() - birthdate.getDate();

  if (monthDifference < 0 || (monthDifference === 0 && dayDifference < 0)) {
    age -= 1;
  }

  return age;
}

function openImageViewer(src, alt, name) {
  if (!imageViewer || !imageViewerImg) return;

  imageViewerImg.src = src;
  imageViewerImg.alt = alt;
  if (imageViewerTitle) {
    imageViewerTitle.textContent = `${t("imageViewer.title")}: ${name}`;
  }

  if (typeof imageViewer.showModal === "function") {
    imageViewer.showModal();
  } else {
    imageViewer.setAttribute("open", "open");
  }
}

function createProjectCard(project, options = {}) {
  const { featured = false } = options;
  const card = document.createElement("article");
  card.classList.add("prj-content");
  if (featured) {
    card.classList.add("prj-content--featured");
  }
  card.setAttribute("role", "button");
  card.setAttribute("tabindex", "0");
  card.setAttribute("aria-expanded", "false");
  card.setAttribute("aria-label", t("project.cardAria", { name: localized(project, "name") }));

  const fullText = localized(project, "desc");
  const shortWordLimit = featured ? 14 : 4;
  const shortText = fullText.split(" ").slice(0, shortWordLimit).join(" ");
  const stackLabels = project[`stack_${state.lang}`] || project.stack || [];

  const stackHTML = (project.stackimg || []).map((stackClass, index) => {
    const stackLabel = stackLabels[index] || "";
    return `<span class="stack-content"><i class="${stackClass}" aria-hidden="true"></i> ${stackLabel}</span>`;
  }).join("");

  const projectName = localized(project, "name");
  const projectPreviewAlt = t("project.previewAlt", { name: projectName });

  card.innerHTML = `
    <img class="prj-image" src="${project.img}" alt="${projectPreviewAlt}" role="button" tabindex="0" aria-label="${t("project.openImageAria", { name: projectName })}">
    <div>
      <div class="prj-demo">
        <h4>${projectName}</h4>
        <div class="prj-wrapper">
          <a class="stack-content" href="${project.github}" target="_blank" rel="noopener noreferrer" aria-label="${t("project.githubAria", { name: projectName })}">${t("project.github")} <i class="fa-brands fa-github" aria-hidden="true"></i></a>
          ${project.link ? `<a class="stack-content" href="${project.link}" target="_blank" rel="noopener noreferrer" aria-label="${t("project.demoAria", { name: projectName })}">${t("project.demo")} <i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i></a>` : "" }
        </div>
      </div>
      <p class="prj-desc">${shortText}${fullText.split(" ").length > shortWordLimit ? "..." : ""}</p>
      <div class="stack-holder">
        ${stackHTML}
      </div>
    </div>
  `;

  const descEl = card.querySelector(".prj-desc");
  const stackHolder = card.querySelector(".stack-holder");
  const imageEl = card.querySelector(".prj-image");
  let expanded = false;

  const toggleExpanded = (event) => {
    if (event.target.tagName === "A" || event.target.closest("a") || event.target.classList.contains("prj-image")) return;
    if (!descEl) return;

    if (expanded) {
      descEl.textContent = `${shortText}${fullText.split(" ").length > shortWordLimit ? "..." : ""}`;
      descEl.style.maxHeight = "72px";
      if (stackHolder) stackHolder.style.display = "flex";
      card.setAttribute("aria-expanded", "false");
    } else {
      descEl.textContent = fullText;
      descEl.style.maxHeight = "160px";
      if (stackHolder) stackHolder.style.display = "none";
      card.setAttribute("aria-expanded", "true");
    }

    expanded = !expanded;
  };

  card.addEventListener("click", toggleExpanded);
  card.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggleExpanded(event);
    }
  });

  if (imageEl) {
    imageEl.addEventListener("click", (event) => {
      event.stopPropagation();
      openImageViewer(project.img, projectPreviewAlt, projectName);
    });

    imageEl.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        event.stopPropagation();
        openImageViewer(project.img, projectPreviewAlt, projectName);
      }
    });
  }

  return card;
}

function setLanguage(lang) {
  state.lang = lang === "hu" ? "hu" : "en";
  localStorage.setItem("portfolioLang", state.lang);
  applyTranslations();
  renderAll();
}

function applyTranslations() {
  document.documentElement.lang = state.lang;

  const metaDescription = document.querySelector("meta[name='description']");
  if (metaDescription) {
    metaDescription.setAttribute("content", t("meta.description"));
  }

  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.getAttribute("data-i18n");
    if (!key) return;
    if (element.hasAttribute("data-i18n-html")) {
      element.innerHTML = t(key);
    } else {
      element.textContent = t(key);
    }
  });

  document.querySelectorAll("[data-i18n-aria-label]").forEach((element) => {
    const key = element.getAttribute("data-i18n-aria-label");
    if (!key) return;
    element.setAttribute("aria-label", t(key));
  });

  languageButtons.forEach((button) => {
    const buttonLang = button.getAttribute("data-lang");
    const isActive = buttonLang === state.lang;
    button.setAttribute("aria-pressed", String(isActive));
    button.classList.toggle("active", isActive);
  });
}

function renderAchievements(items) {
  if (!achievementsDiv) return;

  achievementsDiv.innerHTML = "";
  items.forEach((item) => {
    const card = document.createElement("article");
    card.classList.add("ach-content");

    card.innerHTML = `
      <div class="ach-top">
        <span class="ach-icon" aria-hidden="true"><i class="${item.icon}"></i></span>
        <h4 class="ach-title">${localized(item, "title")}</h4>
      </div>
      <p class="ach-meta">${localized(item, "meta")}</p>
      <p class="ach-desc">${localized(item, "desc")}</p>
    `;

    achievementsDiv.appendChild(card);
  });
}

function renderTimelineItems(items, holder, emptyText) {
  if (!holder) return;

  holder.innerHTML = "";
  if (!items || items.length === 0) {
    const empty = document.createElement("p");
    empty.classList.add("timeline-empty");
    empty.textContent = emptyText;
    holder.appendChild(empty);
    return;
  }

  items.forEach((item) => {
    const card = document.createElement("article");
    card.classList.add("timeline-item");

    card.innerHTML = `
      <span class="timeline-icon" aria-hidden="true"><i class="${item.icon}"></i></span>
      <div>
        <h4>${localized(item, "title")}</h4>
        <p class="timeline-meta">${localized(item, "meta")}</p>
        <p class="timeline-desc">${localized(item, "desc")}</p>
      </div>
    `;

    holder.appendChild(card);
  });
}

function renderProjects() {
  if (!projectDiv) return;

  projectDiv.innerHTML = "";

  const featuredProjects = state.projects.slice(0, featuredProjectCount);
  featuredProjects.forEach((project) => {
    projectDiv.appendChild(createProjectCard(project, { featured: true }));
  });

  if (projectsMoreButton) {
    const hasMoreProjects = state.projects.length > featuredProjectCount;
    projectsMoreButton.hidden = !hasMoreProjects;
    projectsMoreButton.textContent = t("projects.showMore");
  }

  if (projectsModalHolder) {
    projectsModalHolder.innerHTML = "";
    state.projects.forEach((project) => {
      projectsModalHolder.appendChild(createProjectCard(project));
    });
  }
}

function renderRepos() {
  if (!resultsDiv) return;

  resultsDiv.innerHTML = "";
  resultsDiv.setAttribute("aria-busy", "false");

  state.activities.forEach((activity) => {
    const container = document.createElement("div");
    container.className = "repo";
    container.setAttribute("role", "button");
    container.setAttribute("tabindex", "0");
    container.setAttribute("aria-label", t("repos.open", { name: activity.repoName }));

    const openRepo = () => window.open(activity.url, "_blank");
    container.onclick = openRepo;
    container.onkeydown = (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openRepo();
      }
    };

    container.innerHTML = `
      <img class="repo-img" src="${activity.avatar}" alt="${t("repos.logoAlt", { name: activity.repoName })}">
      <div>
        <div class="repo-name">${activity.repoName}</div>
        <div class="commit-msg">${activity.message}</div>
      </div>
    `;

    resultsDiv.appendChild(container);
  });
}

function renderAll() {
  renderAchievements(state.achievements);
  renderTimelineItems(state.schools, schoolDiv, t("timeline.emptySchools"));
  renderTimelineItems(state.jobs, jobDiv, t("timeline.emptyJobs"));
  renderProjects();
  renderRepos();
}

async function fetchLatestGitHubActivities() {
  if (!resultsDiv) return;

  resultsDiv.setAttribute("aria-busy", "true");
  resultsDiv.innerHTML = `<p role="status">${t("repos.loading")}</p>`;

  try {
    const reposResponse = await fetch("https://api.github.com/users/KoZsombat/repos?sort=pushed&direction=desc&per_page=10");
    const repos = await reposResponse.json();

    if (!Array.isArray(repos)) {
      resultsDiv.setAttribute("aria-busy", "false");
      resultsDiv.innerHTML = `<p role="alert">${t("repos.fetchError")}</p>`;
      return;
    }

    const activityEvents = [];

    for (const repo of repos) {
      if (activityEvents.length >= 4) break;

      const commitsResponse = await fetch(`https://api.github.com/repos/KoZsombat/${repo.name}/commits?per_page=1`);
      const commits = await commitsResponse.json();
      const latestCommit = Array.isArray(commits) ? commits[0] : null;

      if (!latestCommit) continue;

      activityEvents.push({
        repoName: repo.name,
        avatar: repo.owner?.avatar_url || "img/logo.png",
        message: latestCommit.commit?.message || latestCommit.sha,
        url: latestCommit.html_url || repo.html_url,
        sha: latestCommit.sha
      });
    }

    state.activities = activityEvents;

    renderRepos();
  } catch (error) {
    resultsDiv.setAttribute("aria-busy", "false");
    resultsDiv.innerHTML = `<p role="alert">${t("repos.loadError", { message: error.message })}</p>`;
  }
}

async function loadData() {
  try {
    const [achResponse, careerResponse, projectResponse] = await Promise.all([
      fetch("./src/ach.json"),
      fetch("./src/career.json"),
      fetch("./src/prj.json")
    ]);

    if (!achResponse.ok || !careerResponse.ok || !projectResponse.ok) {
      throw new Error("Network response was not ok");
    }

    const [achData, careerData, projectData] = await Promise.all([
      achResponse.json(),
      careerResponse.json(),
      projectResponse.json()
    ]);

    state.achievements = achData.achievements || [];
    state.schools = careerData.schools || [];
    state.jobs = careerData.jobs || [];
    state.projects = projectData.prj || [];

    renderAll();
  } catch (error) {
    console.error("Fetch error:", error);
  }
}

languageButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const selectedLang = button.getAttribute("data-lang");
    setLanguage(selectedLang);
  });
});

if (projectsMoreButton && projectsModal) {
  projectsMoreButton.addEventListener("click", () => {
    if (typeof projectsModal.showModal === "function") {
      projectsModal.showModal();
    } else {
      projectsModal.setAttribute("open", "open");
    }
  });
}

if (projectsModalClose && projectsModal) {
  projectsModalClose.addEventListener("click", () => {
    projectsModal.close();
  });
}

if (projectsModal) {
  projectsModal.addEventListener("click", (event) => {
    const rect = projectsModal.querySelector(".projects-modal__panel")?.getBoundingClientRect();
    if (!rect) return;

    const clickedOutsidePanel = (
      event.clientX < rect.left ||
      event.clientX > rect.right ||
      event.clientY < rect.top ||
      event.clientY > rect.bottom
    );

    if (clickedOutsidePanel) {
      projectsModal.close();
    }
  });
}

if (imageViewerClose && imageViewer) {
  imageViewerClose.addEventListener("click", () => {
    imageViewer.close();
  });
}

if (imageViewer) {
  imageViewer.addEventListener("click", (event) => {
    const panel = imageViewer.querySelector(".image-viewer__panel")?.getBoundingClientRect();
    if (!panel) return;

    const clickedOutsidePanel = (
      event.clientX < panel.left ||
      event.clientX > panel.right ||
      event.clientY < panel.top ||
      event.clientY > panel.bottom
    );

    if (clickedOutsidePanel) {
      imageViewer.close();
    }
  });

  imageViewer.addEventListener("close", () => {
    if (imageViewerImg) {
      imageViewerImg.src = "";
      imageViewerImg.alt = "";
    }
  });
}

applyTranslations();
if (ageValue) {
  ageValue.textContent = String(calculateAge("2008-05-26"));
}
loadData();
fetchLatestGitHubActivities();