import { initStore } from './store.js';
import { PEOPLE, T, whoFor, nextVisit, dateOf, el, ICON_CHECK } from './common.js';
import { renderCalendar, progress } from './calendar.js';
import { ROUTINE, COLORS, FRIDAY_NOTE, MATTE_NOTE, PLACES } from './tasks.js';
import { mountMessages } from './messages.js';

const WARN_SVG = '<svg width="22" height="22" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M16 4L2 28h28zM16 13v7M16 24v.5"/></svg>';

const pref = (k, d) => { try { return localStorage.getItem(k) || d; } catch (e) { return d; } };
const setPref = (k, v) => { try { localStorage.setItem(k, v); } catch (e) { /* egal */ } };

const state = {
  lang: pref('putzplan-lang', 'uk'),
  me: pref('putzplan-me', ''),
  settings: {}, days: {}, checks: {},
  selected: null, year: 0, month: 0,
  loaded: { settings: false, days: false, checks: false },
  error: ''
};

const $ = id => document.getElementById(id);
let store;
let msgs = null;

function t() { return T[state.lang]; }

function renderTop() {
  document.documentElement.lang = state.lang;
  $('title').textContent = t().title;
  document.title = t().title;
  $('kicker').textContent = state.lang === 'uk' ? 'Список завдань' : 'Aufgabenliste';
  $('lang-uk').setAttribute('aria-pressed', state.lang === 'uk');
  $('lang-de').setAttribute('aria-pressed', state.lang === 'de');
  const g = $('me-group');
  g.replaceChildren();
  g.setAttribute('aria-label', t().whoAmI);
  ['olena', 'ilona'].forEach(p => {
    g.append(el('button', { 'aria-pressed': state.me === p ? 'true' : 'false', onclick: () => { state.me = p; setPref('putzplan-me', p); renderTop(); } },
      t().whoAmI + ' ' + PEOPLE[p][state.lang]));
  });
  const b = $('banners');
  b.replaceChildren();
  if (store && store.demo) b.append(el('div', { class: 'banner info', text: t().demo }));
  if (state.error) b.append(el('div', { class: 'banner err', text: state.error }));
}

function render() {
  if (!state.selected) return;
  renderTop();
  renderCalendar($('calendar'), {
    year: state.year, month: state.month, lang: state.lang, selected: state.selected,
    settings: state.settings, days: state.days, checks: state.checks,
    onSelect: k => { state.selected = k; render(); },
    onNav: d => { const m = new Date(state.year, state.month + d, 1); state.year = m.getFullYear(); state.month = m.getMonth(); render(); }
  });
  const legend = el('div', { class: 'legend' },
    ['olena', 'ilona'].map(p => el('span', null, el('i', { style: 'background:' + PEOPLE[p].bg + ';border:1px solid ' + PEOPLE[p].color }), PEOPLE[p][state.lang])),
    el('span', null, el('i', { style: 'background:#D9622B;border-radius:50%' }), t().special)
  );
  $('calendar').append(legend);
  renderDay();
}

function renderDay() {
  const L = state.lang;
  const key = state.selected;
  const d = dateOf(key);
  const who = whoFor(key, state.settings, state.days);
  const day = state.days[key] || {};
  const done = (state.checks[key] && state.checks[key].done) || {};
  const root = $('day');
  root.replaceChildren();

  const wdName = t().weekdaysLong[d.getDay()]; const dateText = wdName.charAt(0).toUpperCase() + wdName.slice(1) + ', ' + d.getDate() + '. ' + t().months[d.getMonth()];
  const head = el('div', { class: 'card' },
    el('div', { class: 'day-head' },
      el('h2', { class: 'day-date', text: dateText }),
      who ? el('span', { class: 'who-chip', style: 'background:' + PEOPLE[who].bg + ';color:' + PEOPLE[who].color }, t().comes + ': ' + PEOPLE[who][L]) : null
    )
  );
  if (who) {
    const pr = progress(key, state.days, state.checks);
    head.append(el('div', { class: 'progress' },
      el('div', { class: 'progress-track' }, el('span', { style: 'width:' + (pr.total ? Math.round(100 * pr.done / pr.total) : 0) + '%' })),
      el('div', { class: 'progress-label', text: pr.done + ' / ' + pr.total + ' ' + t().done })
    ));
  } else {
    head.append(el('p', { class: 'empty-hint', text: t().nobody }));
  }
  const warn = el('div', { class: 'warn' }); warn.innerHTML = WARN_SVG; warn.append(el('span', { text: MATTE_NOTE[L] }));
  head.append(warn);
  if (d.getDay() === 5) {
    const fri = el('div', { class: 'warn' }); fri.innerHTML = WARN_SVG; fri.append(el('span', { text: FRIDAY_NOTE[L] }));
    head.append(fri);
  }
  root.append(head);

  // Sonderaufgaben
  const extras = day.extras || [];
  const sp = el('div', { class: 'card' }, el('h3', { class: 'section-title', style: 'margin-top:0', text: t().special }));
  if (day.note) sp.append(el('div', { class: 'note-box', text: (L === 'uk' && day.noteUk) ? day.noteUk : day.note }));
  const spList = el('div', { class: 'tasks', style: 'margin-top:8px' });
  if (!extras.length) spList.append(el('div', { class: 'empty-hint', text: t().noSpecial }));
  extras.forEach(x => spList.append(taskButton({
    id: x.id, label: (L === 'uk' && x.uk) ? x.uk : x.de, extra: true
  }, done)));
  sp.append(spList);
  root.append(sp);

  // Routine
  const rc = el('div', { class: 'card' }, el('h3', { class: 'section-title', style: 'margin-top:0', text: t().routine }));
  const list = el('div', { class: 'tasks' });
  ROUTINE.forEach(item => {
    const col = COLORS[item.c];
    if (item.group) {
      list.append(el('div', { class: 'group-head', style: 'background:' + col.bg + ';color:' + col.fg },
        el('span', { class: 'num', style: 'color:' + col.fg, text: item.n }), el('span', { text: item[L] })));
      item.children.forEach(c => list.append(taskButton({ id: c.id, n: c.n, label: c[L], subs: c.subs && c.subs[L], note: c.note && c.note[L], col, child: true }, done)));
    } else {
      list.append(taskButton({ id: item.id, n: item.n, label: item[L], subs: item.subs && item.subs[L], note: item.note && item.note[L], col, main: true }, done));
    }
  });
  rc.append(list);
  root.append(rc);

  // Wo kommt was hin
  const det = el('details', { class: 'card' }, el('summary', { text: t().places }));
  const pl = el('div', { class: 'places' });
  PLACES.forEach(p => pl.append(el('div', null, el('b', { text: p[L][0] }), el('span', { text: p[L][1] }))));
  det.append(pl);
  root.append(det);
}

function taskButton(o, done) {
  const isDone = !!done[o.id];
  const cls = ['task'];
  if (o.child) cls.push('child');
  if (o.main) cls.push('main');
  if (o.extra) cls.push('extra');
  const style = o.main ? 'background:' + o.col.bg : null;
  const box = el('span', { class: 'box' }); box.innerHTML = ICON_CHECK;
  const body = el('span', { class: 'body' },
    el('span', { class: 't-label', style: o.main ? 'color:' + o.col.fg : null, text: (o.n ? o.n + '  ' : '') + o.label }),
    o.subs && o.subs.length ? el('span', { class: 't-subs', text: '• ' + o.subs.join('  • ') }) : null,
    o.note ? el('span', { class: 't-note', style: o.col ? 'color:' + o.col.fg : null, text: o.note }) : null,
    isDone && done[o.id].by ? el('span', { class: 't-meta', text: '✓ ' + (PEOPLE[done[o.id].by] ? PEOPLE[done[o.id].by][state.lang] : '') + ' · ' + new Date(done[o.id].at).toLocaleTimeString(state.lang === 'uk' ? 'uk-UA' : 'de-DE', { hour: '2-digit', minute: '2-digit' }) }) : null
  );
  return el('button', { class: cls.join(' '), style, role: 'checkbox', 'aria-checked': isDone ? 'true' : 'false', onclick: () => toggle(o.id, !isDone) }, box, body);
}

async function toggle(id, on) {
  const key = state.selected;
  const by = state.me || whoFor(key, state.settings, state.days) || '';
  // sofort anzeigen
  state.checks[key] = state.checks[key] || { done: {} };
  state.checks[key].done = Object.assign({}, state.checks[key].done);
  if (on) state.checks[key].done[id] = { at: Date.now(), by };
  else delete state.checks[key].done[id];
  render();
  try {
    if (on) await store.merge('checks', key, { done: { [id]: { at: Date.now(), by } } });
    else await store.removeField('checks', key, 'done.' + id);
    state.error = '';
  } catch (e) {
    state.error = t().saveError;
    render();
  }
}

function maybeStart() {
  if (state.selected || !state.loaded.settings || !state.loaded.days) return;
  state.selected = nextVisit(state.settings, state.days);
  const d = dateOf(state.selected);
  state.year = d.getFullYear(); state.month = d.getMonth();
  render();
}

$('lang-uk').onclick = () => { state.lang = 'uk'; setPref('putzplan-lang', 'uk'); state.selected ? render() : renderTop(); if (msgs) msgs.relabel(); };
$('lang-de').onclick = () => { state.lang = 'de'; setPref('putzplan-lang', 'de'); state.selected ? render() : renderTop(); if (msgs) msgs.relabel(); };

(async function main() {
  renderTop();
  store = await initStore();
  renderTop();
  const onErr = () => { state.error = t().offline; renderTop(); };
  const start = () => {
    store.watch('settings', m => { state.settings = m; state.loaded.settings = true; maybeStart(); render(); }, onErr);
    store.watch('days', m => { state.days = m; state.loaded.days = true; maybeStart(); render(); }, onErr);
    store.watch('checks', m => { state.checks = m; state.loaded.checks = true; render(); }, onErr);
    msgs = mountMessages($('messages'), { store, side: 'cleaner', lang: () => state.lang, me: () => state.me, onError: m => { state.error = m; renderTop(); } });
    store.watch('messages', m => msgs.setMessages(m), onErr);
  };
  let started = false;
  store.onAuth(u => {
    if (u && !started) { started = true; start(); }
    else if (!u) store.signInAnon().catch(onErr);
  });
})();
