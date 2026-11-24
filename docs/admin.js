import { initStore, isAdminUser } from './store.js';
import { PEOPLE, T, whoFor, weekly, nextVisit, dateOf, el, newId, todayKey, setPeople, activePeople, peopleList, toUkrainian, PALETTE } from './common.js';
import { renderCalendar, progress } from './calendar.js';
import { ROUTINE_FLAT, TEMPLATES } from './tasks.js';
import { mountMessages } from './messages.js';

const t = T.de;
const $ = id => document.getElementById(id);
const state = { settings: {}, days: {}, checks: {}, selected: null, year: 0, month: 0, user: null, error: '' };
let store;
let watching = false;

function banner() {
  const b = $('banners');
  b.replaceChildren();
  if (store && store.demo) b.append(el('div', { class: 'banner info', text: 'Demo-Modus: Daten werden nur in diesem Browser gespeichert. Für den echten Betrieb Firebase einrichten (siehe Anleitung).' }));
  if (state.error) b.append(el('div', { class: 'banner err', text: state.error }));
}

function account() {
  const a = $('account');
  a.replaceChildren();
  if (state.user && !state.user.isAnonymous && !store.demo) {
    a.append(el('span', { style: 'font-weight:700;color:var(--muted);font-size:14px', text: state.user.email || '' }),
      el('button', { class: 'btn ghost small', onclick: () => store.signOut() }, 'Abmelden'));
  }
}

function signInView(msg) {
  $('app').replaceChildren(el('div', { class: 'card signin' },
    el('h2', { text: 'Bitte anmelden' }),
    el('p', { text: msg || 'Die Verwaltung ist nur für dich. Melde dich mit deinem Google-Konto an.' }),
    el('button', { class: 'btn', onclick: () => store.signInGoogle().catch(e => { state.error = 'Anmeldung fehlgeschlagen: ' + (e.code || e.message); banner(); }) }, 'Mit Google anmelden')
  ));
}

async function save(fn) {
  try { await fn(); state.error = ''; }
  catch (e) { state.error = 'Konnte nicht speichern (' + (e.code || e.message) + ').'; }
  banner();
}

let pending = false;
document.addEventListener('focusout', () => setTimeout(() => { if (pending && !typing()) { pending = false; render(); } }, 0));
function typing() {
  const a = document.activeElement;
  return !!(a && (a.tagName === 'TEXTAREA' || (a.tagName === 'INPUT' && a.type === 'text' && !a.readOnly)) && a.value);
}

function render() {
  if (!state.selected) return;
  if (typing()) { pending = true; return; }
  banner(); account();
  const app = $('app');
  app.replaceChildren();
  const layout = el('main', { class: 'layout' });
  const left = el('section', { class: 'sticky' });
  const cal = el('div', { class: 'card' });
  renderCalendar(cal, {
    year: state.year, month: state.month, lang: 'de', selected: state.selected,
    settings: state.settings, days: state.days, checks: state.checks,
    onSelect: k => { state.selected = k; render(); },
    onNav: d => { const m = new Date(state.year, state.month + d, 1); state.year = m.getFullYear(); state.month = m.getMonth(); render(); }
  });
  cal.append(el('div', { class: 'legend' },
    activePeople().concat(['open']).map(p => el('span', null, el('i', { style: 'background:' + PEOPLE[p].bg + ';border:1px solid ' + PEOPLE[p].color }), PEOPLE[p].de)),
    el('span', null, el('i', { style: 'background:#D9622B;border-radius:50%' }), 'Sonderaufgabe')
  ));
  left.append(cal, weeklyCard(), peopleCard(), linkCard());
  layout.append(left, el('section', null, dayCard(), statusCard()));
  app.append(layout);
}

function personOptions(current, withDefault) {
  const opts = [];
  if (withDefault) {
    const w = weekly(state.settings)[dateOf(state.selected).getDay()];
    opts.push(['default', 'Wie Wochenplan (' + (w && w !== 'none' ? PEOPLE[w].de : 'niemand') + ')']);
  }
  activePeople().forEach(id => opts.push([id, PEOPLE[id].de]));
  if (current && current !== 'default' && current !== 'none' && current !== 'open' && !activePeople().includes(current)) opts.push([current, (PEOPLE[current] ? PEOPLE[current].de : 'Unbekannt') + ' (entfernt)']);
  opts.push(['open', 'Putzfrau (noch offen)'], ['none', withDefault ? 'Kommt nicht' : '—']);
  return opts.map(([v, l]) => el('option', { value: v, selected: v === current ? 'selected' : null }, l));
}

function dayCard() {
  const key = state.selected;
  const d = dateOf(key);
  const day = state.days[key] || {};
  const who = whoFor(key, state.settings, state.days);
  const card = el('div', { class: 'card' });
  card.append(el('div', { class: 'day-head' },
    el('h2', { class: 'day-date', text: t.weekdaysLong[d.getDay()] + ', ' + d.getDate() + '. ' + t.months[d.getMonth()] + ' ' + d.getFullYear() }),
    who ? el('span', { class: 'who-chip', style: 'background:' + PEOPLE[who].bg + ';color:' + PEOPLE[who].color }, PEOPLE[who].de) : el('span', { class: 'who-chip', style: 'background:#F1EEE8;color:var(--muted)' }, 'Niemand')
  ));

  const sel = el('select', { id: 'who-sel', onchange: e => save(() => store.merge('days', key, { who: e.target.value })) }, personOptions(day.who || 'default', true));
  card.append(el('label', { class: 'field', for: 'who-sel' }, 'Wer kommt an diesem Tag?', sel));

  const note = el('textarea', { id: 'note', placeholder: 'z. B. „Heute bitte zuerst das Gästezimmer – Besuch kommt um 15 Uhr“' });
  note.value = day.note || '';
  const preview = el('div', { class: 'tr-preview', text: day.note ? (day.noteUk ? 'UA: ' + day.noteUk : 'Keine automatische Übersetzung – Olena sieht die Notiz auf Deutsch.') : '' });
  const saveNote = async () => {
    const txt = note.value.trim();
    preview.textContent = txt ? 'Übersetze …' : '';
    const uk = txt ? await store.translate(txt, 'uk') : '';
    await save(() => store.merge('days', key, { note: txt, noteUk: uk || '' }));
  };
  note.addEventListener('change', saveNote);
  card.append(el('label', { class: 'field', for: 'note' }, 'Notiz für die Putzfrau (auf Deutsch – wird automatisch ins Ukrainische übersetzt)', note), preview);

  // Sonderaufgaben
  const extras = day.extras || [];
  card.append(el('h3', { class: 'section-title', text: 'Sonderaufgaben an diesem Tag' }));
  const list = el('div');
  if (!extras.length) list.append(el('div', { class: 'empty-hint', text: 'Noch keine Sonderaufgaben.' }));
  const done = (state.checks[key] && state.checks[key].done) || {};
  extras.forEach(x => {
    list.append(el('div', { class: 'extra-row' },
      el('span', { class: done[x.id] ? 'ok' : 'no', style: 'font-weight:900;color:' + (done[x.id] ? 'var(--done)' : '#B9B1A3'), text: done[x.id] ? '✓' : '○' }),
      el('div', { class: 'grow' }, el('div', { style: 'font-weight:800', text: x.de }), x.uk ? el('div', { class: 'sub', text: x.uk }) : el('div', { class: 'sub', text: 'Ohne ukrainische Übersetzung – wird auf Deutsch angezeigt.' })),
      el('button', { class: 'btn ghost small', 'aria-label': 'Sonderaufgabe entfernen', onclick: () => save(() => store.merge('days', key, { extras: extras.filter(y => y.id !== x.id) })) }, 'Entfernen')
    ));
  });
  card.append(list);

  const de = el('input', { type: 'text', id: 'x-de', placeholder: 'Neue Sonderaufgabe auf Deutsch' });
  const add = (item) => save(() => store.merge('days', key, { extras: extras.concat([Object.assign({ id: 'x_' + newId() }, item)]) }));
  const addBtn = el('button', { class: 'btn', onclick: async () => {
    const txt = de.value.trim();
    if (!txt) return;
    addBtn.disabled = true; addBtn.textContent = 'Übersetze …';
    const uk = await store.translate(txt, 'uk');
    de.value = '';
    add({ de: txt, uk: uk || '' });
  } }, 'Hinzufügen');
  card.append(el('label', { class: 'field', for: 'x-de' }, 'Sonderaufgabe hinzufügen (wird automatisch übersetzt)'),
    el('div', { class: 'row' }, de, addBtn));
  const tpl = el('select', { id: 'tpl' }, el('option', { value: '' }, 'Aus Vorlage wählen (Ferienzeit, Projekte, Checks) …'),
    TEMPLATES.map((x, i) => el('option', { value: String(i) }, x.de)));
  tpl.addEventListener('change', () => { if (tpl.value !== '') add(Object.assign({}, TEMPLATES[Number(tpl.value)])); });
  card.append(el('label', { class: 'field', for: 'tpl' }, 'Oder aus Vorlage (mit Übersetzung)', tpl));
  return card;
}

function statusCard() {
  const key = state.selected;
  const done = (state.checks[key] && state.checks[key].done) || {};
  const pr = progress(key, state.days, state.checks);
  const card = el('div', { class: 'card' }, el('h3', { class: 'section-title', style: 'margin-top:0', text: 'Erledigt an diesem Tag: ' + pr.done + ' / ' + pr.total }));
  card.append(el('div', { class: 'progress' }, el('div', { class: 'progress-track' }, el('span', { style: 'width:' + (pr.total ? Math.round(100 * pr.done / pr.total) : 0) + '%' }))));
  const list = el('div', { class: 'status-list' });
  ROUTINE_FLAT.forEach(task => {
    const r = done[task.id];
    list.append(el('div', null,
      el('span', { class: r ? 'ok' : 'no', text: r ? '✓' : '○' }),
      el('span', { text: task.de }),
      r ? el('span', { class: 't-meta', text: (PEOPLE[r.by] ? PEOPLE[r.by].de + ', ' : '') + new Date(r.at).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }) }) : null));
  });
  card.append(list);
  return card;
}

function weeklyCard() {
  const w = Object.assign({}, weekly(state.settings));
  const card = el('div', { class: 'card' }, el('h3', { class: 'section-title', style: 'margin-top:0', text: 'Wochenplan (Standard)' }),
    el('p', { class: 'empty-hint', style: 'padding:0', text: 'Gilt für alle Tage ohne eigene Einstellung.' }));
  const grid = el('div', { class: 'week-grid' });
  [1, 2, 3, 4, 5, 6, 0].forEach(wd => {
    const s = el('select', { id: 'wd-' + wd, onchange: e => { w[wd] = e.target.value; save(() => store.put('settings', 'main', { weekly: w })); } }, personOptions(w[wd] || 'none', false));
    grid.append(el('label', { class: 'field', for: 'wd-' + wd, style: 'margin-top:0' }, t.weekdaysLong[wd], s));
  });
  card.append(grid);
  return card;
}

function peopleCard() {
  const list = peopleList(state.settings).map(p => Object.assign({}, p));
  const saveList = l => save(() => store.put('settings', 'people', { list: l }));
  const card = el('div', { class: 'card' }, el('h3', { class: 'section-title', style: 'margin-top:0', text: 'Personen' }),
    el('p', { class: 'empty-hint', style: 'padding:0', text: 'Wer bei euch putzt. Die ukrainische Schreibweise wird vorgeschlagen und kann geändert werden.' }));
  list.forEach((p, i) => {
    if (p.active === false) return;
    const de = el('input', { type: 'text', value: p.de, 'aria-label': 'Name (Deutsch)' });
    const uk = el('input', { type: 'text', value: p.uk || '', 'aria-label': 'Name (Ukrainisch)' });
    const commit = () => {
      const nde = de.value.trim();
      if (!nde) { de.value = p.de; return; }
      list[i] = Object.assign({}, p, { de: nde, uk: uk.value.trim() || toUkrainian(nde) });
      saveList(list);
    };
    de.addEventListener('change', () => { if (!uk.value.trim() || uk.value === toUkrainian(p.de)) uk.value = toUkrainian(de.value.trim()); commit(); });
    uk.addEventListener('change', commit);
    card.append(el('div', { class: 'extra-row', style: 'align-items:center' },
      el('i', { style: 'width:16px;height:16px;border-radius:5px;flex-shrink:0;background:' + p.bg + ';border:1.5px solid ' + p.color }),
      el('div', { class: 'grow', style: 'display:flex;gap:6px;flex-wrap:wrap' }, de, uk),
      el('button', { class: 'btn ghost small', 'aria-label': p.de + ' entfernen', onclick: () => {
        if (!confirmRemove(p.de)) return;
        list[i] = Object.assign({}, p, { active: false });
        saveList(list);
      } }, 'Entfernen')));
  });
  const nn = el('input', { type: 'text', id: 'new-person', placeholder: 'Name der neuen Person' });
  card.append(el('label', { class: 'field', for: 'new-person' }, 'Person hinzufügen'),
    el('div', { class: 'row' }, nn, el('button', { class: 'btn', onclick: () => {
      const name = nn.value.trim();
      if (!name) return;
      const col = PALETTE[list.length % PALETTE.length];
      nn.value = '';
      saveList(list.concat([{ id: 'p_' + newId(), de: name, uk: toUkrainian(name), color: col.color, bg: col.bg, active: true }]));
    } }, 'Hinzufügen')));
  return card;
}

// Entfernen ohne Browser-Dialog: zweimal klicken innerhalb von 4 Sekunden
let pendingRemove = null;
function confirmRemove(name) {
  if (pendingRemove && pendingRemove.name === name && Date.now() - pendingRemove.at < 4000) { pendingRemove = null; return true; }
  pendingRemove = { name, at: Date.now() };
  state.error = 'Zum Entfernen von ' + name + ' noch einmal auf „Entfernen“ klicken. Bisherige Einträge bleiben erhalten.';
  banner();
  setTimeout(() => { if (pendingRemove && pendingRemove.name === name) { pendingRemove = null; state.error = ''; banner(); } }, 4000);
  return false;
}

function linkCard() {
  const url = new URL('index.html', location.href).href;
  const inp = el('input', { type: 'text', readonly: true, value: url, 'aria-label': 'Link für die Putzfrau' });
  return el('div', { class: 'card' }, el('h3', { class: 'section-title', style: 'margin-top:0', text: 'Link für Olena und Ilona' }),
    el('p', { class: 'empty-hint', style: 'padding:0', text: 'Diese Seite ist auf Ukrainisch (umschaltbar auf Deutsch). Abhaken ist ohne Anmeldung möglich.' }),
    el('div', { class: 'copy' }, inp, el('button', { class: 'btn ghost small', onclick: () => { navigator.clipboard && navigator.clipboard.writeText(url); } }, 'Kopieren')));
}

function startWatching() {
  if (watching) return;
  watching = true;
  const onErr = e => { state.error = 'Verbindung/Berechtigung: ' + (e.code || e.message); banner(); };
  let loaded = { s: false, d: false };
  const maybe = () => {
    if (!state.selected && loaded.s && loaded.d) {
      state.selected = nextVisit(state.settings, state.days) || todayKey();
      const d = dateOf(state.selected); state.year = d.getFullYear(); state.month = d.getMonth();
    }
    render();
  };
  store.watch('settings', m => { state.settings = m; setPeople(m); loaded.s = true; maybe(); }, onErr);
  store.watch('days', m => { state.days = m; loaded.d = true; maybe(); }, onErr);
  store.watch('checks', m => { state.checks = m; maybe(); }, onErr);
  $('msg-area').hidden = false;
  const msgs = mountMessages($('messages'), { store, side: 'admin', lang: () => 'de', me: () => 'admin', onError: m => { state.error = m; banner(); } });
  $('mark-read').onclick = () => msgs.unreadIds().forEach(id => store.merge('messages', id, { readByAdmin: true }).catch(onErr));
  store.watch('messages', m => {
    msgs.setMessages(m);
    const n = msgs.unreadIds().length;
    $('unread').replaceChildren(n ? el('span', { class: 'badge', text: String(n) }) : '');
    $('mark-read').hidden = !n;
    document.title = (n ? '(' + n + ') ' : '') + 'Putzplan – Verwaltung';
  }, onErr);
}

(async function main() {
  store = await initStore();
  banner();
  store.onAuth(u => {
    state.user = u;
    account();
    if (!u || u.isAnonymous) { signInView(); return; }
    if (!isAdminUser(u)) { signInView('Dieses Konto (' + (u.email || '') + ') hat keinen Zugriff auf die Verwaltung.'); return; }
    startWatching();
  });
})();
