import { PEOPLE, T, monthCells, whoFor, todayKey, el } from './common.js';
import { ROUTINE_FLAT } from './tasks.js';

export function progress(key, days, checks) {
  const extras = (days[key] && days[key].extras) || [];
  const ids = ROUTINE_FLAT.map(t => t.id).concat(extras.map(x => x.id));
  const done = (checks[key] && checks[key].done) || {};
  const n = ids.filter(id => done[id]).length;
  return { done: n, total: ids.length };
}

// Monatskalender. opts: { year, month, lang, selected, settings, days, checks, onSelect, onNav }
export function renderCalendar(root, opts) {
  const t = T[opts.lang];
  const today = todayKey();
  root.replaceChildren();

  const head = el('div', { class: 'cal-head' },
    el('button', { class: 'icon-btn', 'aria-label': t.prev, onclick: () => opts.onNav(-1) }, '‹'),
    el('h2', { class: 'cal-title', text: t.months[opts.month] + ' ' + opts.year }),
    el('button', { class: 'icon-btn', 'aria-label': t.next, onclick: () => opts.onNav(1) }, '›')
  );
  const grid = el('div', { class: 'cal-grid', role: 'grid' });
  t.weekdaysShort.forEach(w => grid.append(el('div', { class: 'cal-wd', text: w })));

  monthCells(opts.year, opts.month).forEach(key => {
    if (!key) { grid.append(el('div', { class: 'cal-cell empty' })); return; }
    const who = whoFor(key, opts.settings, opts.days);
    const p = who ? PEOPLE[who] : null;
    const extras = (opts.days[key] && opts.days[key].extras) || [];
    const pr = who ? progress(key, opts.days, opts.checks) : null;
    const cls = ['cal-cell'];
    if (key === today) cls.push('today');
    if (key === opts.selected) cls.push('selected');
    if (who) cls.push('visit');
    const label = Number(key.slice(8)) + (p ? ' – ' + p[opts.lang] : '');
    const btn = el('button', { class: cls.join(' '), 'aria-label': label, 'aria-pressed': key === opts.selected ? 'true' : 'false', onclick: () => opts.onSelect(key) },
      el('span', { class: 'cal-num', text: String(Number(key.slice(8))) }),
      p ? el('span', { class: 'cal-who', style: 'background:' + p.bg + ';color:' + p.color, text: p[opts.lang].slice(0, who === 'open' ? 1 : 2) }) : null,
      extras.length ? el('span', { class: 'cal-dot', title: extras.length + '' }) : null,
      pr && pr.done > 0 ? el('span', { class: 'cal-bar' }, el('span', { style: 'width:' + Math.round(100 * pr.done / pr.total) + '%' })) : null
    );
    grid.append(btn);
  });
  root.append(head, grid);
}
