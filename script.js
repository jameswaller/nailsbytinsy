/* ===========================================================
   NAV SCROLL BEHAVIOR
   =========================================================== */
const nav = document.getElementById('mainNav');
const hero = document.getElementById('hero');

function updateNav() {
  const heroBottom = hero.getBoundingClientRect().bottom;
  if (heroBottom <= 60) {
    nav.classList.add('scrolled');
    nav.classList.remove('hero-visible');
  } else {
    nav.classList.remove('scrolled');
    nav.classList.add('hero-visible');
  }
}
window.addEventListener('scroll', updateNav, { passive: true });
updateNav();

/* ===========================================================
   CAROUSEL
   =========================================================== */
const track = document.querySelector(".carousel-track");
const nextBtn = document.querySelector(".next");
const prevBtn = document.querySelector(".prev");

if (nextBtn && prevBtn && track) {
  nextBtn.addEventListener("click", () => {
    track.scrollBy({ left: 350, behavior: "smooth" });
  });

  prevBtn.addEventListener("click", () => {
    track.scrollBy({ left: -350, behavior: "smooth" });
  });
}

/* ===========================================================
   FADE IN ON SCROLL
   =========================================================== */
const faders = document.querySelectorAll('.fade-in');
const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      fadeObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

faders.forEach(el => fadeObserver.observe(el));

/* ===========================================================
   SMART INSTAGRAM LINK HANDLING
   -----------------------------------------------------------
   Handles deep-linking to the Instagram app on mobile,
   in-app browser quirks, and desktop fallback.
   =========================================================== */
(function () {
  const ua = navigator.userAgent || navigator.vendor || window.opera || "";

  function isInAppBrowser() {
    return /Instagram|FBAN|FBAV|FB_IAB|Messenger|Twitter|Line|TikTok|Snapchat|Pinterest/i.test(ua);
  }

  function isIOS() {
    return /iPad|iPhone|iPod/.test(ua) && !window.MSStream;
  }

  function isAndroid() {
    return /Android/i.test(ua);
  }

  function isMobile() {
    return isIOS() || isAndroid();
  }

  function openInstagram(username, webUrl) {
    var appUrl = "instagram://user?username=" + encodeURIComponent(username);

    // In-app browsers: target="_blank" is unreliable. Navigate same tab.
    if (isInAppBrowser()) {
      window.location.href = webUrl;
      return;
    }

    // Desktop: normal new tab.
    if (!isMobile()) {
      var win = window.open(webUrl, "_blank", "noopener,noreferrer");
      if (!win) window.location.href = webUrl;
      return;
    }

    // Mobile: try app first, fall back to web after timeout.
    var fallbackTimer = null;
    var now = Date.now();

    function onVisibility() {
      if (document.hidden) {
        clearTimeout(fallbackTimer);
        document.removeEventListener("visibilitychange", onVisibility);
      }
    }
    document.addEventListener("visibilitychange", onVisibility);

    fallbackTimer = setTimeout(function () {
      document.removeEventListener("visibilitychange", onVisibility);
      if (Date.now() - now < 2000) {
        window.location.href = webUrl;
      }
    }, 1200);

    try {
      window.location.href = appUrl;
    } catch (e) {
      clearTimeout(fallbackTimer);
      window.location.href = webUrl;
    }
  }

  document.querySelectorAll(".ig-link").forEach(function (link) {
    link.addEventListener("click", function (e) {
      var username = link.getAttribute("data-ig-user");
      var webUrl = link.getAttribute("href");
      if (!username || !webUrl) return;
      e.preventDefault();
      openInstagram(username, webUrl);
    });
  });
})();
