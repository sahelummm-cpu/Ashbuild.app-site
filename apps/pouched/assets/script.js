// Pouched site — nav shadow, scroll reveal, taper chart, savings calculator, breathing demo.
(function () {
  "use strict";

  // Nav border once the page scrolls.
  var nav = document.getElementById("nav");
  if (nav) {
    var onScroll = function () { nav.classList.toggle("scrolled", window.scrollY > 8); };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  // Reveal on scroll.
  var items = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px" });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add("in"); });
  }

  // Taper chart: 30-day plan from 15 to 6 pouches, usage just under the limit.
  var chart = document.getElementById("taperChart");
  if (chart) {
    var NS = "http://www.w3.org/2000/svg";
    var W = 1000, H = 300, L = 40, R = 16, T = 16, B = 34;
    var days = 30, max = 16;
    var x = function (d) { return L + (d / (days - 1)) * (W - L - R); };
    var y = function (v) { return T + (1 - v / max) * (H - T - B); };
    var el = function (name, attrs) {
      var n = document.createElementNS(NS, name);
      for (var k in attrs) n.setAttribute(k, attrs[k]);
      chart.appendChild(n);
      return n;
    };
    [0, 4, 8, 12, 16].forEach(function (v) {
      el("line", { x1: L, x2: W - R, y1: y(v), y2: y(v), stroke: "#eef2f7" });
      el("text", { x: L - 10, y: y(v) + 4, "text-anchor": "end" }).textContent = v;
    });
    [0, 7, 14, 21, 29].forEach(function (d) {
      var anchor = d === 0 ? "start" : d === days - 1 ? "end" : "middle";
      el("text", { x: x(d), y: H - 10, "text-anchor": anchor }).textContent = "Day " + (d + 1);
    });
    var limit = function (d) { return Math.round(15 - (9 * d) / (days - 1)); };
    // Stepped limit line.
    var p = "M" + x(0) + " " + y(limit(0));
    for (var d = 1; d < days; d++) p += " H" + x(d) + " V" + y(limit(d));
    el("path", { d: p, fill: "none", stroke: "#cbd5e1", "stroke-width": 3, "stroke-linejoin": "round" });
    // Usage: deterministic wobble under the limit.
    var used = [];
    for (var i = 0; i < days; i++) used.push(Math.max(1, limit(i) - (i % 3 === 0 ? 0 : 1) - (i % 5 === 2 ? 1 : 0)));
    var area = "M" + x(0) + " " + y(0);
    used.forEach(function (v, i) { area += " L" + x(i) + " " + y(v); });
    area += " L" + x(days - 1) + " " + y(0) + " Z";
    var grad = el("defs", {});
    grad.innerHTML = '<linearGradient id="ug" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0284c7" stop-opacity=".22"/><stop offset="1" stop-color="#0284c7" stop-opacity="0"/></linearGradient>';
    el("path", { d: area, fill: "url(#ug)" });
    var line = "M" + x(0) + " " + y(used[0]);
    used.forEach(function (v, i) { if (i) line += " L" + x(i) + " " + y(v); });
    el("path", { d: line, fill: "none", stroke: "#0284c7", "stroke-width": 3, "stroke-linejoin": "round", "stroke-linecap": "round" });
    used.forEach(function (v, i) { el("circle", { cx: x(i), cy: y(v), r: 4, fill: "#fff", stroke: "#0284c7", "stroke-width": 2 }); });
  }

  // Savings calculator.
  var perDay = document.getElementById("perDay");
  if (perDay) {
    var canPrice = document.getElementById("canPrice");
    var perCan = document.getElementById("perCan");
    var money = function (n, cents) {
      return "$" + n.toLocaleString("en-US", { minimumFractionDigits: cents ? 2 : 0, maximumFractionDigits: cents ? 2 : 0 });
    };
    var fill = function (input) {
      var pct = ((input.value - input.min) / (input.max - input.min)) * 100;
      input.style.setProperty("--p", pct + "%");
    };
    var update = function () {
      var pd = +perDay.value, price = +canPrice.value, pc = +perCan.value;
      document.getElementById("perDayOut").textContent = pd;
      document.getElementById("canPriceOut").textContent = money(price, true);
      document.getElementById("perCanOut").textContent = pc;
      var cansYear = (pd * 365) / pc;
      var year = cansYear * price;
      document.getElementById("yearTotal").textContent = money(Math.round(year));
      document.getElementById("monthTotal").textContent = money(Math.round(year / 12));
      document.getElementById("cansYear").textContent = Math.round(cansYear).toLocaleString("en-US");
      document.getElementById("fiveYear").textContent = money(Math.round(year * 5));
      [perDay, canPrice, perCan].forEach(fill);
    };
    [perDay, canPrice, perCan].forEach(function (i) { i.addEventListener("input", update); });
    update();
  }

  // 4-7-8 breathing demo (three cycles).
  var stage = document.getElementById("orb");
  var btn = document.getElementById("orbBtn");
  if (stage && btn) {
    var word = document.getElementById("orbWord");
    var hint = document.getElementById("orbHint");
    var timers = [];
    var clear = function () { timers.forEach(clearTimeout); timers = []; stage.className = "orb-stage reveal in"; };
    var phase = function (cls, w, h, at) {
      timers.push(setTimeout(function () { stage.className = "orb-stage reveal in " + cls; word.textContent = w; hint.textContent = h; }, at));
    };
    btn.addEventListener("click", function () {
      clear();
      var t = 0;
      for (var c = 0; c < 3; c++) {
        phase("inhale", "Breathe in", "for 4 seconds", t); t += 4000;
        phase("hold", "Hold", "for 7 seconds", t); t += 7000;
        phase("exhale", "Breathe out", "for 8 seconds", t); t += 8000;
      }
      timers.push(setTimeout(function () { clear(); word.textContent = "Nice work"; hint.textContent = "Tap to go again"; }, t));
    });
  }
})();
