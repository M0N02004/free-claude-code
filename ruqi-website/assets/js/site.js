/* مؤسسة رقي للحفلات */
(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const wa = t => 'https://wa.me/966555977189?text=' + encodeURIComponent(t);

  $$('[data-wa]').forEach(a => {
    a.href = wa(a.dataset.wa || 'السلام عليكم، أبغى استفسار عن خدماتكم.');
    a.target = '_blank';
    a.rel = 'noopener';
  });

  /* mobile menu */
  const menu = $('.menu');
  const setMenu = open => {
    menu.classList.toggle('open', open);
    menu.setAttribute('aria-hidden', String(!open));
    $('.burger').setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  };
  $('.burger').addEventListener('click', () => setMenu(true));
  $('.menu .x').addEventListener('click', () => setMenu(false));
  $$('.menu nav a').forEach(a => a.addEventListener('click', () => setMenu(false)));
  addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });

  /* galleries: show more */
  $$('.gal').forEach(g => {
    const btn = $('.more-btn', g.parentElement);
    if (btn) btn.addEventListener('click', () => { g.classList.remove('cut'); btn.remove(); });
  });

  /* lightbox (browses within the clicked section's gallery) */
  const lb = $('.lb'), im = $('.stage img', lb), ct = $('.ct', lb), cp = $('.cp', lb);
  let list = [], cur = 0;
  const show = i => {
    cur = (i + list.length) % list.length;
    const it = list[cur];
    im.src = it.dataset.full;
    im.alt = $('img', it).alt;
    ct.textContent = (cur + 1) + ' / ' + list.length;
    cp.textContent = im.alt;
  };
  $$('.gal .it').forEach(it => it.addEventListener('click', () => {
    list = $$('.it', it.parentElement);
    show(list.indexOf(it));
    lb.showModal();
    document.body.style.overflow = 'hidden';
  }));
  lb.addEventListener('close', () => { document.body.style.overflow = ''; });
  $('.x', lb).addEventListener('click', () => lb.close());
  $('.nx', lb).addEventListener('click', () => show(cur + 1));
  $('.pv', lb).addEventListener('click', () => show(cur - 1));
  lb.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') show(cur + 1);
    if (e.key === 'ArrowRight') show(cur - 1);
  });
  let x0 = null;
  lb.addEventListener('touchstart', e => { x0 = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', e => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 50) show(cur + (dx < 0 ? 1 : -1));
    x0 = null;
  });

  /* highlight current section in nav */
  const links = $$('.nav a[href^="#"]');
  if ('IntersectionObserver' in window) {
    const so = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) links.forEach(a => a.classList.toggle('on', a.getAttribute('href') === '#' + e.target.id));
    }), { rootMargin: '-40% 0px -55% 0px' });
    links.forEach(a => { const t = $(a.getAttribute('href')); if (t) so.observe(t); });
  }

  $$('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });
})();
