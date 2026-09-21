/* ==========================================================================
   Portfolio Site — behavior
   ========================================================================== */

(function () {
  "use strict";

  /* ---------------- Theme toggle ---------------- */
  const root = document.documentElement;
  const themeToggle = document.getElementById("themeToggle");
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) root.setAttribute("data-theme", savedTheme);

  themeToggle.addEventListener("click", () => {
    const next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
    root.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
  });

  /* ---------------- Mobile nav ---------------- */
  const header = document.getElementById("header");
  const hamburger = document.getElementById("hamburger");
  hamburger.addEventListener("click", () => header.classList.toggle("menu-open"));
  document.getElementById("navLinks").addEventListener("click", (e) => {
    if (e.target.matches("a")) header.classList.remove("menu-open");
  });

  /* ---------------- Footer year ---------------- */
  document.getElementById("year").textContent = new Date().getFullYear();

  /* ---------------- Scroll reveal ---------------- */
  let revealObserver;
  function observeReveal() {
    if (!revealObserver) {
      revealObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("visible");
              revealObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15 }
      );
    }
    document.querySelectorAll(".reveal:not(.visible)").forEach((el) => revealObserver.observe(el));
  }

  /* ---------------- Skills ---------------- */
  const skillsGrid = document.getElementById("skillsGrid");
  SKILLS.forEach((skill) => {
    const chip = document.createElement("div");
    chip.className = "skill-chip reveal";
    chip.textContent = skill;
    skillsGrid.appendChild(chip);
  });

  /* ---------------- Projects: filters + cards ---------------- */
  const filterBar = document.getElementById("filterBar");
  const projectsGrid = document.getElementById("projectsGrid");
  const noResults = document.getElementById("noResults");

  const allTags = ["All", ...Array.from(new Set(PROJECTS.flatMap((p) => p.tags))).sort()];
  const activeFilters = new Set(["All"]);

  function renderFilters() {
    filterBar.innerHTML = "";
    allTags.forEach((tag) => {
      const btn = document.createElement("button");
      btn.className = "filter-btn" + (activeFilters.has(tag) ? " active" : "");
      btn.textContent = tag;
      btn.type = "button";
      btn.addEventListener("click", () => toggleFilter(tag));
      filterBar.appendChild(btn);
    });
  }

  function toggleFilter(tag) {
    if (tag === "All") {
      activeFilters.clear();
      activeFilters.add("All");
    } else {
      activeFilters.delete("All");
      if (activeFilters.has(tag)) {
        activeFilters.delete(tag);
      } else {
        activeFilters.add(tag);
      }
      if (activeFilters.size === 0) activeFilters.add("All");
    }
    renderFilters();
    renderProjects();
  }

  function cardThumb(project) {
    const firstImage = project.images && project.images[0];
    if (firstImage) {
      return `<img src="${firstImage}" alt="${project.title}" loading="lazy" onerror="this.parentElement.innerHTML='${initials(project.title)}'" />`;
    }
    return initials(project.title);
  }

  function initials(title) {
    return title.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
  }

  function renderProjects() {
    const filtered = activeFilters.has("All")
      ? PROJECTS
      : PROJECTS.filter((p) => p.tags.some((t) => activeFilters.has(t)));

    projectsGrid.innerHTML = "";
    noResults.hidden = filtered.length !== 0;

    filtered.forEach((project) => {
      const card = document.createElement("button");
      card.type = "button";
      card.className = "project-card reveal";
      card.setAttribute("aria-label", `View details for ${project.title}`);
      card.innerHTML = `
        <div class="project-thumb">${cardThumb(project)}</div>
        <div class="project-body">
          <h3>${project.title}</h3>
          <p>${project.shortDesc}</p>
          <div class="project-tags">
            ${project.tags.map((t) => `<span class="tag-chip">${t}</span>`).join("")}
          </div>
        </div>
      `;
      card.addEventListener("click", () => openProjectModal(project));
      projectsGrid.appendChild(card);
    });

    observeReveal();
  }

  renderFilters();
  renderProjects();

  /* ---------------- Project modal + gallery ---------------- */
  const projectModal = document.getElementById("projectModal");
  const galleryTrack = document.getElementById("galleryTrack");
  const galleryDots = document.getElementById("galleryDots");
  const galleryPrev = document.getElementById("galleryPrev");
  const galleryNext = document.getElementById("galleryNext");
  let galleryIndex = 0;
  let galleryLen = 0;

  function openProjectModal(project) {
    document.getElementById("projectModalTitle").textContent = project.title;
    document.getElementById("projectModalDesc").textContent = project.longDesc;
    document.getElementById("projectModalTags").innerHTML = project.tags
      .map((t) => `<span class="tag-chip">${t}</span>`)
      .join("");
    document.getElementById("projectModalRepo").href = project.repo || "#";

    const slides = project.images && project.images.length ? project.images : [null];
    galleryLen = slides.length;
    galleryIndex = 0;
    galleryTrack.innerHTML = "";
    slides.forEach((src, i) => {
      const slide = document.createElement("div");
      slide.className = `gallery-slide${i === 0 ? " active" : ""}`;
      slide.setAttribute("aria-label", `${project.title} screenshot ${i + 1}`);

      if (src) {
        const isVideo = /\.(mp4|webm|ogg|mov)$/i.test(src);

        if (isVideo) {
          const video = document.createElement("video");
          video.src = src;
          video.type = "video/mp4";
          video.muted = true;
          video.playsInline = true;
          video.autoplay = true;
          video.loop = true;
          video.controls = false;
          video.preload = "metadata";
          video.addEventListener("error", () => {
            slide.classList.add("fallback");
            slide.innerHTML = "";
            slide.textContent = initials(project.title);
          });
          slide.appendChild(video);
        } else {
          const img = document.createElement("img");
          img.src = src;
          img.alt = `${project.title} screenshot ${i + 1}`;
          img.loading = "lazy";
          img.addEventListener("error", () => {
            slide.classList.add("fallback");
            slide.innerHTML = "";
            slide.textContent = initials(project.title);
          });
          slide.appendChild(img);
        }
      } else {
        slide.classList.add("fallback");
        slide.textContent = initials(project.title);
      }

      galleryTrack.appendChild(slide);
    });
    galleryDots.innerHTML = slides
      .map((_, i) => `<button class="gallery-dot${i === 0 ? " active" : ""}" data-index="${i}" aria-label="Go to image ${i + 1}"></button>`)
      .join("");
    document.querySelectorAll(".gallery-dot").forEach((dot) =>
      dot.addEventListener("click", () => setGallerySlide(Number(dot.dataset.index)))
    );
    const showArrows = galleryLen > 1;
    galleryPrev.hidden = galleryNext.hidden = !showArrows;

    openModal(projectModal);
  }

  function setGallerySlide(index) {
    galleryIndex = (index + galleryLen) % galleryLen;
    document.querySelectorAll(".gallery-slide").forEach((slide, i) =>
      slide.classList.toggle("active", i === galleryIndex)
    );
    document.querySelectorAll(".gallery-dot").forEach((dot, i) =>
      dot.classList.toggle("active", i === galleryIndex)
    );
  }
  galleryPrev.addEventListener("click", () => setGallerySlide(galleryIndex - 1));
  galleryNext.addEventListener("click", () => setGallerySlide(galleryIndex + 1));

  document.getElementById("projectModalClose").addEventListener("click", () => closeModal(projectModal));

  /* ---------------- Contact modal ---------------- */
  const contactModal = document.getElementById("contactModal");
  document.getElementById("navContactBtn").addEventListener("click", () => openModal(contactModal));
  document.getElementById("heroContactBtn").addEventListener("click", () => openModal(contactModal));
  document.getElementById("contactSectionBtn").addEventListener("click", () => openModal(contactModal));
  document.getElementById("contactModalClose").addEventListener("click", () => closeModal(contactModal));


  const EMAILJS_PUBLIC_KEY = "c7ABuVxDSh_D41cTc";
  const EMAILJS_SERVICE_ID = "service_ywj3o5z";
  const EMAILJS_TEMPLATE_ID = "template_8t6qqj5";

  if (window.emailjs) {
    emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
  }

  const contactForm = document.getElementById("contactForm");
  const contactSubmitBtn = contactForm.querySelector('button[type="submit"]');
  const contactSubmitLabel = contactSubmitBtn.textContent;

  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("cf-name").value.trim();
    const email = document.getElementById("cf-email").value.trim();
    const message = document.getElementById("cf-message").value.trim();
    const formError = document.getElementById("formError");

    if (!name || !email || !message) {
      formError.textContent = "Please fill out every field.";
      formError.hidden = false;
      return;
    }
    formError.hidden = true;
    contactSubmitBtn.disabled = true;
    contactSubmitBtn.textContent = "Sending…";

    emailjs
      .send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, { name, email, message })
      .then(() => {
        closeModal(contactModal);
        contactForm.reset();
        showToast("Message sent! I'll get back to you soon.");
      })
      .catch((err) => {
        console.error("EmailJS error:", err);
        formError.textContent = "Something went wrong sending your message. Please try again.";
        formError.hidden = false;
      })
      .finally(() => {
        contactSubmitBtn.disabled = false;
        contactSubmitBtn.textContent = contactSubmitLabel;
      });
  });

  /* ---------------- Generic modal helpers ---------------- */
  let lastFocused = null;

  function openModal(modalEl) {
    lastFocused = document.activeElement;
    modalEl.hidden = false;
    document.body.style.overflow = "hidden";
    const closeBtn = modalEl.querySelector(".modal-close");
    if (closeBtn) closeBtn.focus();
  }

  function closeModal(modalEl) {
    modalEl.hidden = true;
    document.body.style.overflow = "";
    if (lastFocused) lastFocused.focus();
  }

  [projectModal, contactModal].forEach((modalEl) => {
    modalEl.addEventListener("click", (e) => {
      if (e.target === modalEl) closeModal(modalEl);
    });
  });

  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    if (!projectModal.hidden) closeModal(projectModal);
    if (!contactModal.hidden) closeModal(contactModal);
  });

  /* ---------------- Toast ---------------- */
  let toastTimer;
  function showToast(msg) {
    const toast = document.getElementById("toast");
    toast.textContent = msg;
    toast.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => (toast.hidden = true), 3200);
  }

  observeReveal();
})();
