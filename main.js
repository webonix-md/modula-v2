(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const D = JSON.parse($('#calc-data').textContent);
  const RO = document.documentElement.lang === 'ro';
  const L = RO ? {
    mod: 'modul', mods: 'module', days: 'zile', m2: 'm²', from: 'de la', calc: 'Calculează',
    delivery: 'Livrare', base: 'Fundație', floor2: 'Etajul 2', total: 'Total', price: 'preț',
    hi: 'Bună ziua! Calcul de pe site:', type: 'Destinație', size: 'Dimensiune', count: 'Număr module',
    kit: 'Echipare', opts: 'Opțiuni', zone: 'Livrare', range: 'Preț estimat', ask: 'Vreau o ofertă exactă.',
    none: 'fără'
  } : {
    mod: 'модуль', mods: 'модулей', days: 'дней', m2: 'м²', from: 'от', calc: 'Посчитать',
    delivery: 'Доставка', base: 'Основание', floor2: 'Второй этаж', total: 'Итого', price: 'цена',
    hi: 'Здравствуйте! Расчёт с сайта:', type: 'Назначение', size: 'Размер', count: 'Модулей',
    kit: 'Комплектация', opts: 'Опции', zone: 'Доставка', range: 'Примерная цена', ask: 'Хочу точный расчёт.',
    none: 'нет'
  };
  const fmt = n => Math.round(n).toLocaleString('ru-RU').replace(/,/g, ' ');

  /* ---------- burger ---------- */
  const nav = $('.nav'), bg = $('#burger');
  bg.onclick = () => {
    const o = nav.classList.toggle('is-open');
    bg.setAttribute('aria-expanded', o);
    document.body.style.overflow = o ? 'hidden' : '';
  };
  $$('.nav a').forEach(a => a.addEventListener('click', () => {
    nav.classList.remove('is-open'); bg.setAttribute('aria-expanded', false); document.body.style.overflow = '';
  }));

  /* ---------- MODELS ---------- */
  const MODELS = RO ? [
    { img: 'use-post', t: 'Post de pază', size: '2x2', type: 'post', kit: 'std', days: 7, li: ['Ferestre pe trei laturi', 'Încălzitor și lumină', 'Se montează la intrare într-o oră'] },
    { img: 'use-bytovka', t: 'Vagon de șantier', size: '6x24', type: 'bytovka', kit: 'eco', days: 10, li: ['Pentru echipă sau depozit de scule', '2 camere sau una mare', 'Se mută de pe un șantier pe altul'] },
    { img: 'use-office', t: 'Oficiu', size: '6x3', type: 'office', kit: 'std', days: 14, li: ['Laminat, 6 prize, aer condiționat', 'Baie — opțional', 'Se îmbină în oficii de 2–6 module'] },
    { img: 'use-dacha', t: 'Modul de vacanță', size: '6x3', type: 'dacha', kit: 'warm', days: 18, li: ['Dormitor + bucătărie sau studio', 'Fereastră panoramică spre grădină', 'Terasă 3 × 2 m — opțional'] },
    { img: 'hero-2', t: 'Casă din două module', size: '6x3', count: 2, type: 'dacha', kit: 'warm', days: 21, li: ['36 m²: dormitor, living, baie', 'Pentru locuit tot anul', 'Se poate adăuga al treilea modul'] },
    { img: 'use-sklad', t: 'Garaj sau depozit', size: '6x4', type: 'sklad', kit: 'eco', days: 10, li: ['Panouri sandwich, fără finisaje', 'Poartă de orice lățime', 'Lumină și prize — la dorință'] }
  ] : [
    { img: 'use-post', t: 'Пост охраны', size: '2x2', type: 'post', kit: 'std', days: 7, li: ['Окна на три стороны', 'Обогреватель и свет', 'Можно поставить на въезде за час'] },
    { img: 'use-bytovka', t: 'Бытовка', size: '6x24', type: 'bytovka', kit: 'eco', days: 10, li: ['Для бригады или склада инструмента', '2 комнаты или одна большая', 'Перевозим с объекта на объект'] },
    { img: 'use-office', t: 'Офис', size: '6x3', type: 'office', kit: 'std', days: 14, li: ['Ламинат, 6 розеток, кондиционер', 'Санузел — опция', 'Стыкуется в офис на 2–6 модулей'] },
    { img: 'use-dacha', t: 'Дачный модуль', size: '6x3', type: 'dacha', kit: 'warm', days: 18, li: ['Спальня + кухня или студия', 'Панорамное окно на сад', 'Терраса 3 × 2 м — опция'] },
    { img: 'hero-2', t: 'Дом из двух модулей', size: '6x3', count: 2, type: 'dacha', kit: 'warm', days: 21, li: ['36 м²: спальня, гостиная, санузел', 'Для жизни круглый год', 'Можно достроить третий модуль'] },
    { img: 'use-sklad', t: 'Гараж или склад', size: '6x4', type: 'sklad', kit: 'eco', days: 10, li: ['Сэндвич-панели, без отделки', 'Ворота любой ширины', 'Свет и розетки — по желанию'] }
  ];
  const size = id => D.sizes.find(s => s.id === id);
  const kit = id => D.kits.find(k => k.id === id);
  const grid = $('#modelsGrid');
  if (grid && MODELS.length) grid.innerHTML = MODELS.map((m, i) => {
    const s = size(m.size), n = m.count || 1;
    const p = Math.round(s.price * kit('std').k * n / 100) * 100;
    return `<article class="model rv">
      <div class="model__img"><img src="img/${m.img}.webp" alt="${m.t}" loading="lazy"><span class="model__size">${s.t}${n > 1 ? ' × ' + n : ''}</span></div>
      <div class="model__body"><h3>${m.t}</h3><p class="model__meta">${fmt(s.m2 * n)} ${L.m2} · ${L.from} ${m.days} ${L.days}</p>
      <ul>${m.li.map(x => `<li>${x}</li>`).join('')}</ul>
      <div class="model__foot"><p class="model__price">${L.from}<b>${fmt(p)} €</b></p><button class="model__go" data-m="${i}">${L.calc}</button></div></div></article>`;
  }).join('');

  /* ---------- WORKS ---------- */
  const WORKS = RO ? [
    { img: 'work-row', f: 'site', t: 'Tabără pentru muncitori', city: 'Chișinău, zona industrială', s: [['module', '12'], ['suprafață', '173 m²'], ['termen', '24 de zile']] },
    { img: 'work-2floor', f: 'biz', t: 'Oficiu cu două etaje la depozit', city: 'Strășeni', s: [['module', '6'], ['suprafață', '108 m²'], ['termen', '30 de zile']] },
    { img: 'work-pano', f: 'life', t: 'Modul cu ferestre panoramice și terasă', city: 'Vadul lui Vodă', s: [['module', '1'], ['suprafață', '18 m²'], ['termen', '16 zile']] },
    { img: 'work-office4', f: 'biz', t: 'Oficiu pentru o firmă de logistică', city: 'Chișinău, Ciocana', s: [['module', '4'], ['suprafață', '72 m²'], ['termen', '22 de zile']] },
    { img: 'use-gorodok', f: 'site', t: 'Vagoane pentru echipă', city: 'Bălți', s: [['module', '4'], ['suprafață', '58 m²'], ['termen', '12 zile']] },
    { img: 'work-sanblok', f: 'site', t: 'Vestiare și bloc sanitar pentru șantier', city: 'Orhei', s: [['module', '3'], ['suprafață', '43 m²'], ['termen', '18 zile']] }
  ] : [
    { img: 'work-row', f: 'site', t: 'Городок для рабочих', city: 'Кишинёв, промзона', s: [['модулей', '12'], ['площадь', '173 м²'], ['срок', '24 дня']] },
    { img: 'work-2floor', f: 'biz', t: 'Двухэтажный офис на складе', city: 'Стрэшень', s: [['модулей', '6'], ['площадь', '108 м²'], ['срок', '30 дней']] },
    { img: 'work-pano', f: 'life', t: 'Модуль с панорамными окнами и террасой', city: 'Вадул-луй-Водэ', s: [['модулей', '1'], ['площадь', '18 м²'], ['срок', '16 дней']] },
    { img: 'work-office4', f: 'biz', t: 'Офис для логистической фирмы', city: 'Кишинёв, Чеканы', s: [['модулей', '4'], ['площадь', '72 м²'], ['срок', '22 дня']] },
    { img: 'use-gorodok', f: 'site', t: 'Бытовки для бригады', city: 'Бельцы', s: [['модулей', '4'], ['площадь', '58 м²'], ['срок', '12 дней']] },
    { img: 'work-sanblok', f: 'site', t: 'Раздевалки и санблок для стройки', city: 'Орхей', s: [['модулей', '3'], ['площадь', '43 м²'], ['срок', '18 дней']] }
  ];
  const wg = $('#worksGrid');
  if (wg && WORKS.length) wg.innerHTML = WORKS.map(w => `<article class="work rv" data-f="${w.f}">
      <div class="work__img"><img src="img/${w.img}.webp" alt="${w.t}" loading="lazy"></div>
      <div class="work__b"><h3>${w.t}</h3><p class="work__city">${w.city}</p>
      <div class="work__specs">${w.s.map(([a, b]) => `<span>${a}<b>${b}</b></span>`).join('')}</div></div></article>`).join('');
  $$('#wFilters button').forEach(b => b.onclick = () => {
    $$('#wFilters button').forEach(x => x.classList.toggle('is-on', x === b));
    $$('.work').forEach(w => w.classList.toggle('is-hidden', b.dataset.f !== 'all' && w.dataset.f !== b.dataset.f));
  });

  /* ---------- ZONES ---------- */
  const zl = $('#zonesList');
  if (zl) zl.innerHTML = D.zones.filter(z => z.p).map(z => `<li><span>${z.t}</span><b>${fmt(z.p)} € / ${L.mod}</b></li>`).join('');

  /* ---------- CALC ---------- */
  const st = { type: 'dacha', size: '6x3', kit: 'warm', count: 1, floor2: false, opts: new Set(['wc']), zone: 'chi', base: 'blocks' };
  const chips = (el, arr, key, sub) => {
    el.innerHTML = arr.map(x => `<button type="button" class="chip" data-v="${x.id}">${x.t}${sub ? `<small>${sub(x)}</small>` : ''}</button>`).join('');
    el.onclick = e => {
      const b = e.target.closest('.chip'); if (!b) return;
      st[key] = b.dataset.v;
      if (key === 'type') { const t = D.types.find(x => x.id === st.type); st.size = t.size; st.kit = t.kit; st.count = t.count || 1; st.opts = new Set(t.opts || []); }
      render();
    };
  };
  chips($('#cType'), D.types, 'type');
  chips($('#cSize'), D.sizes, 'size', s => `${fmt(s.m2)} ${L.m2}`);
  chips($('#cKit'), D.kits, 'kit', k => `${k.sub} · × ${String(k.k).replace('.', ',')}`);
  $('#cOpts').innerHTML = D.options.map(o => `<label><input type="checkbox" value="${o.id}"><span>${o.t}<small>+${fmt(o.p)} €</small></span></label>`).join('');
  $('#cOpts').onchange = e => { e.target.checked ? st.opts.add(e.target.value) : st.opts.delete(e.target.value); render(); };
  $('#cZone').innerHTML = D.zones.map(z => `<option value="${z.id}">${z.t}${z.p ? ` — ${z.p} €` : ''}</option>`).join('');
  $('#cBase').innerHTML = D.bases.map(z => `<option value="${z.id}">${z.t}${z.p ? ` — ${z.p} € / ${L.mod}` : ''}</option>`).join('');
  $('#cZone').onchange = e => { st.zone = e.target.value; render(); };
  $('#cBase').onchange = e => { st.base = e.target.value; render(); };
  $('#cMinus').onclick = () => { st.count = Math.max(1, st.count - 1); render(); };
  $('#cPlus').onclick = () => { st.count = Math.min(12, st.count + 1); render(); };
  $('#cFloor2').onchange = e => { st.floor2 = e.target.checked; render(); };

  function render() {
    $$('#cType .chip').forEach(b => b.classList.toggle('is-on', b.dataset.v === st.type));
    $$('#cSize .chip').forEach(b => b.classList.toggle('is-on', b.dataset.v === st.size));
    $$('#cKit .chip').forEach(b => b.classList.toggle('is-on', b.dataset.v === st.kit));
    $$('#cOpts input').forEach(i => i.checked = st.opts.has(i.value));
    $('#cZone').value = st.zone; $('#cBase').value = st.base; $('#cFloor2').checked = st.floor2;
    if (st.count < 2) { st.floor2 = false; $('#cFloor2').checked = false; }
    $('#cFloor2').disabled = st.count < 2;
    $('#cCount').textContent = st.count;

    const s = size(st.size), k = kit(st.kit), n = st.count;
    const lines = [];
    const mods = s.price * k.k * n;
    lines.push([`${n} × ${s.t}, ${k.t}`, mods]);
    D.options.filter(o => st.opts.has(o.id)).forEach(o => lines.push([o.t, o.per === 'mod' ? o.p * n : o.p]));
    if (st.floor2) lines.push([D.floor2.t, D.floor2.p]);
    const z = D.zones.find(x => x.id === st.zone), b = D.bases.find(x => x.id === st.base);
    if (z.p) lines.push([`${L.delivery}: ${z.t}`, z.p * n]);
    if (b.p) lines.push([`${L.base}: ${b.t}`, b.p * n]);
    const sum = lines.reduce((a, l) => a + l[1], 0);
    const r = v => Math.round(v / 100) * 100;
    const from = r(sum * (1 - D.spread)), to = r(sum * (1 + D.spread));
    const days = D.baseDays + k.days + Math.max(0, n - 1) * 3 + (st.opts.has('wood') ? 2 : 0);
    $('#rFrom').textContent = fmt(from); $('#rTo').textContent = fmt(to);
    $('#rArea').textContent = `${fmt(s.m2 * n)} ${L.m2}`; $('#rDays').textContent = `${days}–${days + 7}`;
    $('#rLines').innerHTML = lines.map(([a, v]) => `<li><span>${a}</span><span>${fmt(v)} €</span></li>`).join('');

    const t = D.types.find(x => x.id === st.type);
    const opt = D.options.filter(o => st.opts.has(o.id)).map(o => o.t).join(', ') || L.none;
    const msg = [L.hi, `${L.type}: ${t.t}`, `${L.size}: ${s.t} × ${n}${st.floor2 ? ' (' + L.floor2 + ')' : ''}`, `${L.kit}: ${k.t}`, `${L.opts}: ${opt}`,
      `${L.zone}: ${z.t}`, `${L.base}: ${b.t}`, `${L.range}: ${fmt(from)}–${fmt(to)} €`, L.ask].join('\n');
    $('#rWa').href = `https://wa.me/${D.phone}?text=${encodeURIComponent(msg)}`;
    $('#rViber').href = `viber://chat?number=%2B${D.phone}&draft=${encodeURIComponent(msg)}`;
  }
  render();

  const goCalc = (o) => { Object.assign(st, o); render(); $('#calc').scrollIntoView({ behavior: 'smooth' }); };
  const preset = id => { const t = D.types.find(x => x.id === id); return { type: t.id, size: t.size, kit: t.kit, count: t.count || 1, opts: new Set(t.opts || []) }; };

  /* ---------- USES: карточки → калькулятор ---------- */
  $$('.ucard').forEach(c => {
    const t = D.types.find(x => x.id === c.dataset.type), sz = size(t.size), n = t.count || 1;
    const p = Math.round(sz.price * kit(t.kit).k * n / 100) * 100;
    const el = $('.ucard__p', c); if (el) el.textContent = `${L.from} ${fmt(p)} €`;
    c.onclick = () => goCalc(preset(t.id));
  });
  if (grid) grid.onclick = e => {
    const b = e.target.closest('.model__go'); if (!b) return;
    const m = MODELS[b.dataset.m];
    goCalc({ ...preset(m.type), size: m.size, kit: m.kit, count: m.count || 1 });
  };

  /* ---------- reveal ---------- */
  const els = $$('.title, .lead, .fcard, .ucard, .model, .work, .kit, .steps li, .rev, .about__pics, .deliv__img, .cmp, .cta__box');
  els.forEach(e => e.classList.add('rv'));
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(es => es.forEach(x => { if (x.isIntersecting) { x.target.classList.add('is-in'); io.unobserve(x.target); } }), { rootMargin: '0px 0px -8% 0px' });
    els.forEach(e => io.observe(e));
  } else els.forEach(e => e.classList.add('is-in'));
})();
