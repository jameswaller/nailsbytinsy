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
   SMART INSTAGRAM LINK HANDLING
   -----------------------------------------------------------
   Why this exists:
   - target="_blank" is broken inside Instagram/Facebook/TikTok
     in-app browsers (they open a blank tab that never loads).
   - On mobile with the IG app installed, tapping a web link
     can cause a redirect loop between web and app.
   - Incognito/private mode blocks third-party cookies, which
     can send the user to a broken login-wall state.
   - iOS Safari in private mode has had bugs where window.open
     with _blank silently fails.

   Strategy:
   1. Detect the environment (in-app browser? mobile? desktop?)
   2. On mobile: try the native app via instagram:// scheme,
      fall back to the web URL after a short timeout.
   3. In in-app browsers: use location.href (same tab) because
      _blank is unreliable there.
   4. On desktop: normal new-tab behavior.
   =========================================================== */

(function () {
  const ua = navigator.userAgent || navigator.vendor || window.opera || "";

  // Detect in-app browsers that have known issues with target="_blank"
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

  // Try to open the Instagram app; fall back to the web URL if it fails.
  function openInstagram(username, webUrl) {
    const appUrl = "instagram://user?username=" + encodeURIComponent(username);

    // In-app browsers: _blank is unreliable. Navigate the current tab instead.
    if (isInAppBrowser()) {
      window.location.href = webUrl;
      return;
    }

    // Desktop: just open the web URL in a new tab normally.
    if (!isMobile()) {
      const win = window.open(webUrl, "_blank", "noopener,noreferrer");
      // If popup blocked, fall back to same-tab navigation.
      if (!win) window.location.href = webUrl;
      return;
    }

    // Mobile path: try the app first, then fall back to the web.
    // We use a timeout: if the app opens, the page is backgrounded
    // and the timeout never fires. If it doesn't open, we redirect
    // to the web URL.
    let fallbackTimer = null;
    const now = Date.now();

    // When the page is hidden (app opened), cancel the fallback.
    function onVisibility() {
      if (document.hidden) {
        clearTimeout(fallbackTimer);
        document.removeEventListener("visibilitychange", onVisibility);
      }
    }
    document.addEventListener("visibilitychange", onVisibility);

    fallbackTimer = setTimeout(function () {
      document.removeEventListener("visibilitychange", onVisibility);
      // If we're still here ~1.2s later, the app didn't open.
      // Sanity check: make sure we haven't been backgrounded long enough
      // for the user to have come back from the app.
      if (Date.now() - now < 2000) {
        window.location.href = webUrl;
      }
    }, 1200);

    // Attempt the deep link.
    try {
      window.location.href = appUrl;
    } catch (e) {
      clearTimeout(fallbackTimer);
      window.location.href = webUrl;
    }
  }

  // Wire up every link marked with .ig-link
  document.querySelectorAll(".ig-link").forEach(function (link) {
    link.addEventListener("click", function (e) {
      const username = link.getAttribute("data-ig-user");
      const webUrl = link.getAttribute("href");
      if (!username || !webUrl) return; // let the default behavior run

      e.preventDefault();
      openInstagram(username, webUrl);
    });
  });
})();
