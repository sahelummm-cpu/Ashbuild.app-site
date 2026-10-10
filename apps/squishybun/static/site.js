// Squishy Bun — tiny site script: nav shadow, scroll reveals, sparkles, odds bars, and a bun you can squeeze.
(function () {
  var nav = document.getElementById("nav");
  function onScroll() { if (nav) nav.classList.toggle("scrolled", window.scrollY > 8); }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Sections fade up as they come into view; odds bars fill to their value
  var items = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add("in");
        e.target.querySelectorAll(".bar span[data-w]").forEach(function (s) { s.style.width = s.dataset.w; });
        io.unobserve(e.target);
      });
    }, { threshold: 0.15 });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add("in"); });
    document.querySelectorAll(".bar span[data-w]").forEach(function (s) { s.style.width = s.dataset.w; });
  }

  // Drifting sparkles in every .sparkles layer
  document.querySelectorAll(".sparkles").forEach(function (layer) {
    var n = parseInt(layer.dataset.count || "14", 10);
    for (var i = 0; i < n; i++) {
      var s = document.createElement("i");
      var size = 8 + Math.random() * 14;
      s.style.left = Math.random() * 100 + "%";
      s.style.top = Math.random() * 100 + "%";
      s.style.width = s.style.height = size + "px";
      s.style.animationDelay = (-Math.random() * 3.6).toFixed(2) + "s";
      s.style.animationDuration = (2.6 + Math.random() * 2.4).toFixed(2) + "s";
      layer.appendChild(s);
    }
  });

  // The hero bun: press to squish (the squish face shows), let go and it jiggles back
  var bun = document.getElementById("heroBun");
  if (bun) {
    var hint = document.getElementById("squeezeHint");
    var down = function (e) {
      e.preventDefault();
      bun.classList.remove("release");
      bun.classList.add("pressed");
      if (navigator.vibrate) navigator.vibrate(18);
      if (hint) hint.style.opacity = "0";
    };
    var up = function () {
      if (!bun.classList.contains("pressed")) return;
      bun.classList.remove("pressed");
      void bun.offsetWidth; // restart the jiggle animation
      bun.classList.add("release");
      if (navigator.vibrate) navigator.vibrate(8);
    };
    bun.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    bun.addEventListener("keydown", function (e) { if (e.key === " " || e.key === "Enter") down(e); });
    bun.addEventListener("keyup", function (e) { if (e.key === " " || e.key === "Enter") up(); });
  }

  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
})();
