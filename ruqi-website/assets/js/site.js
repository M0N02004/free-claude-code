/* رقي الفعاليات — interactions */
(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const PHONE = '966555977189';
  const wa = t => 'https://wa.me/' + PHONE + '?text=' + encodeURIComponent(t);
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ar = n => Number(n).toLocaleString('en-US');

  /* WhatsApp links */
  $$('[data-wa]').forEach(a => {
    a.href = wa(a.dataset.wa || 'السلام عليكم، أبغى استشارة بخصوص مناسبة.');
    a.target = '_blank';
    a.rel = 'noopener';
  });

  /* header: solid on scroll, hide on scroll down */
  const hdr = $('.hdr'), mbar = $('.mbar');
  let lastY = 0;
  const onScroll = () => {
    const y = scrollY;
    hdr.classList.toggle('solid', y > 40);
    hdr.classList.toggle('hide', y > 500 && y > lastY + 4 && !menu.classList.contains('open'));
    if (y < lastY - 4) hdr.classList.remove('hide');
    if (mbar) mbar.classList.toggle('show', y > innerHeight * 0.6);
    lastY = y;
  };

  /* mobile menu */
  const menu = $('.menu');
  const setMenu = open => {
    menu.classList.toggle('open', open);
    menu.setAttribute('aria-hidden', String(!open));
    $('.burger').setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
    if (open) $('.menu .x').focus();
  };
  $('.burger').addEventListener('click', () => setMenu(true));
  $('.menu .x').addEventListener('click', () => setMenu(false));
  $$('.menu nav a').forEach(a => a.addEventListener('click', () => setMenu(false)));
  addEventListener('keydown', e => { if (e.key === 'Escape' && menu.classList.contains('open')) setMenu(false); });
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* hero slider */
  const slides = $$('.slide'), bars = $$('.bars button'), cap = $('.cap');
  if (slides.length > 1) {
    const DUR = 7000;
    let k = 0, timer;
    document.documentElement.style.setProperty('--dur', DUR + 'ms');
    const go = i => {
      slides[k].classList.remove('on');
      bars.forEach((b, j) => { b.classList.remove('on'); b.classList.toggle('done', j < i); });
      k = (i + slides.length) % slides.length;
      slides[k].classList.add('on');
      void bars[k].offsetWidth;
      bars[k].classList.add('on');
      if (cap) {
        cap.style.opacity = 0;
        setTimeout(() => {
          const b = document.createElement('b');
          b.textContent = slides[k].dataset.t;
          cap.replaceChildren(b, slides[k].dataset.d);
          cap.style.opacity = 1;
        }, 300);
      }
      clearTimeout(timer);
      if (!RM) timer = setTimeout(() => go(k + 1), DUR);
    };
    bars.forEach((b, i) => b.addEventListener('click', () => go(i)));
    go(0);
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) clearTimeout(timer); else if (!RM) timer = setTimeout(() => go(k + 1), DUR);
    });
  }

  /* reveal on scroll */
  const io = 'IntersectionObserver' in window ? new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }), { threshold: 0.12, rootMargin: '0px 0px -6% 0px' }) : null;
  $$('[data-rv]').forEach(group => {
    [...group.children].forEach((el, i) => {
      el.classList.add('rv');
      el.style.setProperty('--d', Math.min(i, 6) * 0.08 + 's');
      io ? io.observe(el) : el.classList.add('in');
    });
  });
  $$('.rv-img,.rv').forEach(el => io ? io.observe(el) : el.classList.add('in'));

  /* counters */
  const cio = io && new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    cio.unobserve(e.target);
    const el = e.target, to = +el.dataset.count, t0 = performance.now(), d = 1600;
    if (RM) { el.textContent = to; return; }
    const tick = t => {
      const p = Math.min((t - t0) / d, 1), v = Math.round(to * (1 - Math.pow(1 - p, 4)));
      el.textContent = v;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }), { threshold: 0.6 });
  $$('[data-count]').forEach(el => cio ? cio.observe(el) : 0);

  /* marquee: clone for a seamless loop */
  $$('.mq .tr').forEach(tr => tr.append(tr.firstElementChild.cloneNode(true)));

  /* feature card glow follows pointer */
  $$('.feat').forEach(c => c.addEventListener('pointermove', e => {
    const r = c.getBoundingClientRect();
    c.style.setProperty('--mx', e.clientX - r.left + 'px');
    c.style.setProperty('--my', e.clientY - r.top + 'px');
  }));

  /* gallery: filter, load more, lightbox */
  const gal = $('.gal');
  if (gal) {
    const items = $$('.it', gal), more = $('.gal-more');
    let expanded = false;
    const visible = () => items.filter(i => !i.hidden && !(gal.classList.contains('cut') && i.classList.contains('more')));
    $$('.filters button').forEach(b => b.addEventListener('click', () => {
      $$('.filters button').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
      const f = b.dataset.f;
      items.forEach(i => { i.hidden = f !== 'all' && i.dataset.c !== f; });
      const all = f === 'all';
      gal.classList.toggle('cut', all && !expanded);
      if (more) more.hidden = !all || expanded;
    }));
    if (more) $('button', more).addEventListener('click', () => {
      expanded = true; gal.classList.remove('cut'); more.hidden = true;
    });

    const lb = $('.lb'), im = $('.stage img', lb), ct = $('.ct', lb), cp = $('.cp', lb);
    let list = [], cur = 0;
    const show = i => {
      cur = (i + list.length) % list.length;
      const it = list[cur], src = it.dataset.full, alt = $('img', it).alt;
      im.classList.add('ld');
      const pre = new Image();
      pre.onload = pre.onerror = () => { im.src = src; im.alt = alt; im.classList.remove('ld'); };
      pre.src = src;
      ct.textContent = (cur + 1) + ' / ' + list.length;
      cp.textContent = alt;
      [1, -1].forEach(d => { const n = list[(cur + d + list.length) % list.length]; if (n) new Image().src = n.dataset.full; });
    };
    items.forEach(it => it.addEventListener('click', () => {
      list = visible();
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
    $('.stage', lb).addEventListener('click', e => { if (e.target === e.currentTarget) lb.close(); });
  }

  /* space calculator */
  const calc = $('.calc');
  if (calc) {
    const g = $('#guests', calc), rg = $('#guestsRange', calc);
    const out = { area: $('#area', calc), dims: $('#dims', calc), type: $('#ttype', calc), send: $('#calcSend', calc) };
    const SPANS = [10, 15, 20, 25, 30, 40, 50];
    const clamp = n => Math.min(Math.max(Math.round(+n || 0), 10), 5000);
    let shown = 0, raf;
    const animate = to => {
      cancelAnimationFrame(raf);
      if (RM) { out.area.firstChild.nodeValue = ar(to); shown = to; return; }
      const from = shown, t0 = performance.now();
      const step = t => {
        const p = Math.min((t - t0) / 550, 1), v = Math.round(from + (to - from) * (1 - Math.pow(1 - p, 3)));
        out.area.firstChild.nodeValue = ar(v);
        if (p < 1) raf = requestAnimationFrame(step); else shown = to;
      };
      raf = requestAnimationFrame(step);
    };
    const run = () => {
      const n = clamp(g.value), seat = $('input[name=seat]:checked', calc), ex = $$('input[name=extra]:checked', calc);
      const factor = +seat.value * (1 + ex.reduce((s, i) => s + +i.dataset.add, 0));
      const area = Math.ceil(n * factor / 5) * 5;
      let w = SPANS.find(s => Math.ceil(area / s / 5) * 5 <= s * 3) || 50;
      const l = Math.max(Math.ceil(area / w / 5) * 5, w);
      const t = n <= 120 ? 'الهرمية أو الدوم' : n <= 400 ? 'البوليجون أو القبة' : 'المنهاتن أو البوليجون الكبيرة';
      animate(area);
      out.dims.textContent = w + ' × ' + l + ' م';
      out.type.textContent = t;
      out.send.href = wa('السلام عليكم، أبغى عرض سعر لخيمة أوروبية:\n• عدد الضيوف: ' + n + '\n• نوع الجلسة: ' + seat.dataset.l +
        (ex.length ? '\n• إضافات: ' + ex.map(i => i.dataset.l).join('، ') : '') + '\n• المساحة التقريبية: ' + area + ' م² (' + w + '×' + l + ' م)\n• النوع المقترح: ' + t);
    };
    g.addEventListener('input', () => { rg.value = clamp(g.value); run(); });
    g.addEventListener('change', () => { g.value = clamp(g.value); run(); });
    rg.addEventListener('input', () => { g.value = rg.value; run(); });
    $('#plus', calc).addEventListener('click', () => { g.value = clamp(+g.value + 10); rg.value = g.value; run(); });
    $('#minus', calc).addEventListener('click', () => { g.value = clamp(+g.value - 10); rg.value = g.value; run(); });
    $$('input[name=seat],input[name=extra]', calc).forEach(i => i.addEventListener('change', run));
    out.send.target = '_blank';
    out.send.rel = 'noopener';
    run();
  }

  /* quote form → WhatsApp */
  $$('form[data-quote]').forEach(f => f.addEventListener('submit', e => {
    e.preventDefault();
    const d = new FormData(f), v = k => (d.get(k) || '').toString().trim();
    const lines = ['السلام عليكم، أبغى عرض سعر من رقي الفعاليات.', 'الاسم: ' + v('name'), 'نوع المناسبة: ' + v('type'), 'المدينة: ' + v('city')];
    if (v('date')) lines.push('التاريخ: ' + v('date'));
    if (v('guests')) lines.push('عدد الضيوف: ' + v('guests'));
    if (v('notes')) lines.push('ملاحظات: ' + v('notes'));
    open(wa(lines.join('\n')), '_blank', 'noopener');
  }));

  /* reel: play only when visible */
  const vid = $('.phone video');
  if (vid && io) {
    new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting && !RM) vid.play().catch(() => {}); else vid.pause();
    }), { threshold: 0.3 }).observe(vid);
  }

  /* active nav link */
  const links = $$('.nav a[href^="#"]');
  if (links.length && io) {
    const so = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) links.forEach(a => a.classList.toggle('on', a.getAttribute('href') === '#' + e.target.id));
    }), { rootMargin: '-45% 0px -50% 0px' });
    links.forEach(a => { const t = $(a.getAttribute('href')); if (t) so.observe(t); });
  }

  $$('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });
})();
