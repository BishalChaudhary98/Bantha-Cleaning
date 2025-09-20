function updateOpeningHours() {
  const e = new Date(),
    t = e.getDay(),
    n = 60 * e.getHours() + e.getMinutes(),
    o = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ][t],
    s = document.getElementById("current-day"),
    r = document.getElementById("current-hours"),
    i = document.getElementById("status-dot"),
    a = document.getElementById("mobile-current-day"),
    l = document.getElementById("mobile-current-hours"),
    d = document.getElementById("mobile-status-dot");
  let c, u;
  if (0 === t || 6 === t) {
    c = "10:00 AM - 4:00 PM";
    u = n >= 600 && n < 960;
  } else {
    c = "8:00 AM - 5:00 PM";
    u = n >= 480 && n < 1020;
  }
  s &&
    r &&
    i &&
    ((s.textContent = o),
    (r.textContent = c),
    (i.className = u ? "status-dot open" : "status-dot closed")),
    a &&
      l &&
      d &&
      ((a.textContent = o),
      (l.textContent = c),
      (d.className = u ? "status-dot open" : "status-dot closed"));
}
const hamburger = document.querySelector(".hamburger"),
  navMenu = document.querySelector(".nav-menu"),
  mobileOverlay = document.querySelector(".mobile-overlay"),
  servicesToggle = document.querySelector(".services-toggle"),
  areasToggle = document.querySelector(".areas-toggle"),
  servicesDropdown = servicesToggle?.parentElement,
  areasDropdown = areasToggle?.parentElement,
  mobileOpeningHours = document.querySelector(".mobile-opening-hours");
function closeAllDropdowns() {
  servicesDropdown && servicesDropdown.classList.remove("dropdown-active"),
    areasDropdown && areasDropdown.classList.remove("dropdown-active");
}
hamburger &&
  navMenu &&
  mobileOverlay &&
  (hamburger.addEventListener("click", function () {
    hamburger.classList.toggle("active"),
      navMenu.classList.toggle("active"),
      mobileOverlay.classList.toggle("active"),
      mobileOpeningHours &&
        (navMenu.classList.contains("active")
          ? (mobileOpeningHours.style.left = "0")
          : (mobileOpeningHours.style.left = "-300px")),
      (document.body.style.overflow = navMenu.classList.contains("active")
        ? "hidden"
        : "");
  }),
  mobileOverlay.addEventListener("click", function () {
    hamburger.classList.remove("active"),
      navMenu.classList.remove("active"),
      mobileOverlay.classList.remove("active"),
      mobileOpeningHours && (mobileOpeningHours.style.left = "-300px"),
      (document.body.style.overflow = "");
  })),
  servicesToggle &&
    servicesToggle.addEventListener("click", function (e) {
      window.innerWidth <= 940 &&
        (e.preventDefault(),
        servicesDropdown.classList.toggle("dropdown-active"),
        areasDropdown && areasDropdown.classList.remove("dropdown-active"));
    }),
  areasToggle &&
    areasToggle.addEventListener("click", function (e) {
      window.innerWidth <= 940 &&
        (e.preventDefault(),
        areasDropdown.classList.toggle("dropdown-active"),
        servicesDropdown &&
          servicesDropdown.classList.remove("dropdown-active"));
    }),
  document.addEventListener("click", function (e) {
    !e.target.matches(".nav-link") ||
      e.target.matches(".services-toggle") ||
      e.target.matches(".areas-toggle") ||
      (window.innerWidth <= 940 &&
        (hamburger && hamburger.classList.remove("active"),
        navMenu && navMenu.classList.remove("active"),
        mobileOverlay && mobileOverlay.classList.remove("active"),
        mobileOpeningHours && (mobileOpeningHours.style.left = "-300px"),
        (document.body.style.overflow = "")));
  }),
  document.addEventListener("click", function (e) {
    window.innerWidth <= 940 &&
      (servicesDropdown &&
        !servicesDropdown.contains(e.target) &&
        servicesDropdown.classList.remove("dropdown-active"),
      areasDropdown &&
        !areasDropdown.contains(e.target) &&
        areasDropdown.classList.remove("dropdown-active"));
  }),
  document.addEventListener("keydown", function (e) {
    "Escape" === e.key &&
      (closeAllDropdowns(),
      window.innerWidth <= 940 &&
        (hamburger && hamburger.classList.remove("active"),
        navMenu && navMenu.classList.remove("active"),
        mobileOverlay && mobileOverlay.classList.remove("active"),
        mobileOpeningHours && (mobileOpeningHours.style.left = "-300px"),
        (document.body.style.overflow = "")));
  });
let resizeTimeout,
  touchStartY = 0;
function showLoadingState() {
  [
    document.getElementById("current-day"),
    document.getElementById("mobile-current-day"),
  ].forEach((e) => {
    e && (e.textContent = "Loading...");
  });
}
function handleOpeningHoursError() {
  [
    {
      day: document.getElementById("current-day"),
      hours: document.getElementById("current-hours"),
    },
    {
      day: document.getElementById("mobile-current-day"),
      hours: document.getElementById("mobile-current-hours"),
    },
  ].forEach((e) => {
    e.day &&
      e.hours &&
      ((e.day.textContent = "Today"), (e.hours.textContent = "Call for hours"));
  });
}
function safeUpdateOpeningHours() {
  try {
    updateOpeningHours();
  } catch (e) {
    console.error("Error updating opening hours:", e),
      handleOpeningHoursError();
  }
}
document.addEventListener("touchstart", function (e) {
  touchStartY = e.touches[0].clientY;
}),
  document.addEventListener("touchend", function (e) {
    const t = e.changedTouches[0].clientY;
    touchStartY - t > 50 && window.innerWidth <= 940 && closeAllDropdowns();
  }),
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimeout),
      (resizeTimeout = setTimeout(function () {
        window.innerWidth > 940 &&
          (hamburger && hamburger.classList.remove("active"),
          navMenu && navMenu.classList.remove("active"),
          mobileOverlay && mobileOverlay.classList.remove("active"),
          mobileOpeningHours && (mobileOpeningHours.style.left = "-300px"),
          (document.body.style.overflow = ""),
          closeAllDropdowns());
      }, 250));
  }),
  document.addEventListener("DOMContentLoaded", function () {
    updateOpeningHours();
  }),
  setInterval(updateOpeningHours, 6e4),
  document.querySelectorAll(".nav-link").forEach((e) => {
    e.addEventListener("click", function (e) {
      this.getAttribute("href").startsWith("#") && e.preventDefault();
    });
  }),
  document.addEventListener("DOMContentLoaded", function () {
    safeUpdateOpeningHours();
  }),
  setInterval(safeUpdateOpeningHours, 6e4);
class PublicBlog {
  constructor() {
    (this.posts = []), this.loadPosts();
  }
  async loadPosts() {
    try {
      document.getElementById("gridBlogPosts").innerHTML =
        '\n                <div style="text-align: center; padding: 4rem; color: #64748b;">\n                    <div style="font-size: 2rem; margin-bottom: 1rem;">🔄</div>\n                    <h3>Loading posts...</h3>\n                </div>\n            ';
      const e = await fetch(
        "https://raw.githubusercontent.com/BishalChaudhary98/Bantha-Cleaning/main/posts/posts.json"
      );
      e.ok
        ? ((this.posts = await e.json()), this.render())
        : this.showNoPostsMessage();
    } catch (e) {
      console.error("Error loading posts:", e), this.showNoPostsMessage();
    }
  }
  render() {
    const e = document.getElementById("gridBlogPosts");
    if (!this.posts || 0 === this.posts.length)
      return void this.showNoPostsMessage();
    const t = [...this.posts].sort(
      (e, t) => new Date(t.dateCreated) - new Date(e.dateCreated)
    );
    e.innerHTML = t
      .map((e) => {
        let t;
        return (
          (t =
            e.images && e.images.length > 1
              ? `\n                    <img src="${e.images[0]}" alt="${e.title}" onerror="this.style.display='none'">\n                    <div class="badge-image-count">📸 ${e.images.length}</div>\n                `
              : e.image
              ? `<img src="${e.image}" alt="${e.title}" onerror="this.style.display='none'">`
              : `<span>📝 ${e.title}</span>`),
          `\n                <div class="card-blog" onclick="showFullPost('${e.id}')">\n                    <div class="image-blog">\n                        ${t}\n                    </div>\n                    <div class="content-blog">\n                        <div class="date-blog">${e.date}</div>\n                        <h3 class="title-blog">${e.title}</h3>\n                        <p class="excerpt-blog">${e.excerpt}</p>\n                        <span class="link-read-more">Read More →</span>\n                    </div>\n                </div>\n            `
        );
      })
      .join("");
  }
  showNoPostsMessage() {
    document.getElementById("gridBlogPosts").innerHTML =
      '\n            <div class="state-empty">\n                <h3>No posts yet</h3>\n                <p>Check back soon for new cleaning tips and advice!</p>\n            </div>\n        ';
  }
  getPost(e) {
    return this.posts.find((t) => t.id === e);
  }
}
let currentPost = null,
  blog = null;
function showFullPost(e) {
  const t = blog.getPost(e);
  if (!t) return;
  (currentPost = t),
    (document.getElementById("titleModal").textContent = t.title),
    (document.getElementById("dateModal").textContent = t.date);
  let n = t.content;
  n = n.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  let o = n.split(/\n\s*\n/);
  1 === o.length && (o = n.split("\n")),
    (n = o
      .map((e) => e.trim())
      .filter((e) => e.length > 0)
      .map((e) => `<p>${e.replace(/\n/g, "<br>")}</p>`)
      .join("")),
    (document.getElementById("contentModal").innerHTML = n),
    showImageGallery(),
    (document.getElementById("modalPost").style.display = "block"),
    (document.body.style.overflow = "hidden");
}
function showImageGallery() {
  const e = document.getElementById("sectionModalImages");
  currentPost.images && currentPost.images.length > 0
    ? 1 === currentPost.images.length
      ? (e.innerHTML = `<img src="${currentPost.images[0]}" alt="${currentPost.title}">`)
      : (e.innerHTML = `\n                <div class="grid-images-modal">\n                    ${currentPost.images
          .map(
            (e) =>
              `<img src="${e}" alt="${currentPost.title}" onclick="showLargeImage('${e}')">`
          )
          .join("")}\n                </div>\n            `)
    : currentPost.image
    ? (e.innerHTML = `<img src="${currentPost.image}" alt="${currentPost.title}">`)
    : (e.innerHTML = `\n            <div style="height: 200px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: flex; align-items: center; justify-content: center; color: white; font-size: 1.5rem;">\n                📝 ${currentPost.title}\n            </div>\n        `);
}
function showLargeImage(e) {
  document.getElementById(
    "sectionModalImages"
  ).innerHTML = `\n        <img src="${e}" alt="Large view">\n        <div style="position: absolute; top: 10px; left: 10px; background: rgba(0,0,0,0.7); color: white; padding: 0.5rem 1rem; border-radius: 20px; cursor: pointer;" onclick="showImageGallery()">\n            ← Back to Gallery\n        </div>\n    `;
}
function closeModal() {
  (document.getElementById("modalPost").style.display = "none"),
    (document.body.style.overflow = "auto"),
    (currentPost = null);
}
window.addEventListener("click", function (e) {
  const t = document.getElementById("modalPost");
  e.target === t && closeModal();
}),
  document.addEventListener("keydown", function (e) {
    "Escape" === e.key && closeModal();
  }),
  document.addEventListener("DOMContentLoaded", function () {
    blog = new PublicBlog();
  }),
  setInterval(() => {
    blog && blog.loadPosts();
  }, 3e5);
