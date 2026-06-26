/* Southern Fish Supply — shared interactions */
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* intro overlay */
  var intro = document.getElementById('intro');
  function hideIntro() { if (intro) intro.classList.add('gone'); }
  if (intro) {
    if (reduce) { hideIntro(); }
    else { window.addEventListener('load', function () { setTimeout(hideIntro, 1250); }); setTimeout(hideIntro, 2600); }
  }

  /* nav scroll state */
  var nav = document.querySelector('header.nav');
  function onScroll() { if (nav) nav.classList.toggle('scrolled', window.scrollY > 40); }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* mobile menu */
  var menuBtn = document.querySelector('.menu-btn');
  var links = document.querySelector('.nav-links');
  if (menuBtn && links) {
    menuBtn.addEventListener('click', function () { links.classList.toggle('open'); });
    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { links.classList.remove('open'); });
    });
  }

  /* hero rotation */
  var slides = Array.prototype.slice.call(document.querySelectorAll('.hero-slide'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('.hero-dots button'));
  if (slides.length > 1 && !reduce) {
    var i = 0, timer;
    function go(n) {
      slides[i].classList.remove('active'); if (dots[i]) dots[i].classList.remove('on');
      i = (n + slides.length) % slides.length;
      slides[i].classList.add('active'); if (dots[i]) dots[i].classList.add('on');
    }
    function next() { go(i + 1); }
    function start() { timer = setInterval(next, 6000); }
    dots.forEach(function (d, idx) {
      d.addEventListener('click', function () { clearInterval(timer); go(idx); start(); });
    });
    start();
  }

  /* reveal on scroll */
  var revs = document.querySelectorAll('.reveal');
  if (revs.length) {
    if (reduce || !('IntersectionObserver' in window)) {
      revs.forEach(function (r) { r.classList.add('in'); });
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
      }, { threshold: 0.12 });
      revs.forEach(function (r) { io.observe(r); });
    }
  }

  /* current year */
  var yr = document.getElementById('yr');
  if (yr) yr.textContent = new Date().getFullYear();

  /* FormSubmit AJAX -> inline success */
  document.querySelectorAll('form[data-ajax]').forEach(function (form) {
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var btn = form.querySelector('[type=submit]');
      var original = btn ? btn.textContent : '';
      if (btn) { btn.textContent = 'Sending…'; btn.disabled = true; }
      var endpoint = form.getAttribute('action');
      fetch(endpoint, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } })
        .then(function () { showSuccess(form); })
        .catch(function () { showSuccess(form); })
        .finally(function () { if (btn) { btn.textContent = original; btn.disabled = false; } });
    });
  });
  function showSuccess(form) {
    var box = form.parentNode.querySelector('.form-success');
    if (box) { form.style.display = 'none'; box.classList.add('show'); box.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
    else { form.reset(); }
  }
})();
