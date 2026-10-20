// Egg Thief site: sticky nav tint, scroll reveals, twinkling sparkles, footer year.
(function () {
  var nav = document.getElementById('nav');
  if (nav && !document.body.classList.contains('doc-page')) {
    var onScroll = function () { nav.classList.toggle('solid', window.scrollY > 40); };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  var items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('in'); });
  }

  document.querySelectorAll('.sparkles').forEach(function (box) {
    var count = parseInt(box.getAttribute('data-count') || '16', 10);
    for (var i = 0; i < count; i++) {
      var s = document.createElement('i');
      var size = 6 + Math.random() * 12;
      s.style.left = (Math.random() * 100) + '%';
      s.style.top = (Math.random() * 100) + '%';
      s.style.width = s.style.height = size + 'px';
      s.style.animationDelay = (-Math.random() * 3.2) + 's';
      s.style.animationDuration = (2.4 + Math.random() * 2.4) + 's';
      box.appendChild(s);
    }
  });

  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
