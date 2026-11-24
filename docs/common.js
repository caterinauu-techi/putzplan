// Gemeinsame Helfer: Personen, Datum, Kalender, Texte.

// Farben für Personen (werden der Reihe nach vergeben)
export const PALETTE = [
  { color: '#1F6470', bg: '#D3ECF0' },
  { color: '#8A3A26', bg: '#FFDDD2' },
  { color: '#2A6B46', bg: '#D6EEDF' },
  { color: '#7D3890', bg: '#EBDDF5' },
  { color: '#7A5B12', bg: '#FDEBC8' },
  { color: '#34528F', bg: '#DCE4F7' }
];

export const DEFAULT_PEOPLE = [
  { id: 'olena', de: 'Olena', uk: 'Олена', color: PALETTE[0].color, bg: PALETTE[0].bg, active: true },
  { id: 'ilona', de: 'Ilona', uk: 'Ілона', color: PALETTE[1].color, bg: PALETTE[1].bg, active: true }
];
const OPEN = { de: 'Putzfrau', uk: 'Прибиральниця', color: '#5A5566', bg: '#ECE8F0' };

// Personen-Verzeichnis: wird aus settings/people befüllt (setPeople). Enthält auch entfernte Personen,
// damit alte Häkchen und Nachrichten weiter einen Namen zeigen.
export const PEOPLE = { open: OPEN };
let ACTIVE = DEFAULT_PEOPLE.map(p => p.id);

export function peopleList(settings) {
  const l = settings && settings.people && Array.isArray(settings.people.list) ? settings.people.list : null;
  return l && l.length ? l : DEFAULT_PEOPLE;
}
export function setPeople(settings) {
  const list = peopleList(settings);
  for (const k of Object.keys(PEOPLE)) if (k !== 'open') delete PEOPLE[k];
  list.forEach(p => { PEOPLE[p.id] = { de: p.de, uk: p.uk || p.de, color: p.color, bg: p.bg }; });
  ACTIVE = list.filter(p => p.active !== false).map(p => p.id);
}
export function activePeople() { return ACTIVE.slice(); }

// Lateinische Schreibweise → ukrainische (Näherung, in der Verwaltung korrigierbar)
export function toUkrainian(name) {
  const rules = [['tsch', 'ч'], ['sch', 'ш'], ['ch', 'х'], ['sh', 'ш'], ['zh', 'ж'], ['ts', 'ц'], ['tz', 'ц'], ['ck', 'к'],
    ['ja', 'я'], ['ju', 'ю'], ['je', 'є'], ['ji', 'ї'], ['ya', 'я'], ['yu', 'ю'], ['ei', 'ай'], ['ie', 'і'], ['ph', 'ф'], ['th', 'т'],
    ['ä', 'е'], ['ö', 'е'], ['ü', 'ю'], ['ß', 'сс'], ['a', 'а'], ['b', 'б'], ['c', 'к'], ['d', 'д'], ['e', 'е'], ['f', 'ф'], ['g', 'г'],
    ['h', 'г'], ['i', 'і'], ['j', 'й'], ['k', 'к'], ['l', 'л'], ['m', 'м'], ['n', 'н'], ['o', 'о'], ['p', 'п'], ['q', 'к'], ['r', 'р'],
    ['s', 'с'], ['t', 'т'], ['u', 'у'], ['v', 'в'], ['w', 'в'], ['x', 'кс'], ['y', 'і'], ['z', 'ц']];
  let out = '';
  let i = 0;
  const s = String(name || '');
  while (i < s.length) {
    const rest = s.slice(i).toLowerCase();
    const r = rules.find(([lat]) => rest.startsWith(lat));
    if (r) {
      const upper = s[i] !== s[i].toLowerCase();
      out += upper ? r[1].charAt(0).toUpperCase() + r[1].slice(1) : r[1];
      i += r[0].length;
    } else { out += s[i]; i++; }
  }
  return out;
}

// Standard-Wochenplan, solange in der Verwaltung nichts eingestellt ist (0 = Sonntag … 6 = Samstag)
export const DEFAULT_WEEKLY = { 1: 'open', 3: 'open', 5: 'open' };

export const T = {
  de: {
    title: 'Putzplan',
    weekdaysShort: ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'],
    weekdaysLong: ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'],
    months: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
    comes: 'Es kommt',
    nobody: 'An diesem Tag kommt niemand.',
    special: 'Besonders an diesem Tag',
    noSpecial: 'Keine Sonderaufgaben.',
    routine: 'Tägliche Aufgaben',
    done: 'erledigt',
    whoAmI: 'Ich bin',
    important: 'Wichtig',
    places: 'Wo kommt was hin?',
    today: 'Heute',
    prev: 'Vorheriger Monat',
    next: 'Nächster Monat',
    note: 'Notiz',
    offline: 'Keine Verbindung – Änderungen werden gespeichert, sobald wieder Internet da ist.',
    demo: 'Demo-Modus: Daten werden nur in diesem Browser gespeichert.',
    saveError: 'Konnte nicht speichern. Bitte noch einmal versuchen.'
  },
  uk: {
    title: 'План прибирання',
    weekdaysShort: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд'],
    weekdaysLong: ['неділя', 'понеділок', 'вівторок', 'середа', 'четвер', 'пʼятниця', 'субота'],
    months: ['січень', 'лютий', 'березень', 'квітень', 'травень', 'червень', 'липень', 'серпень', 'вересень', 'жовтень', 'листопад', 'грудень'],
    comes: 'Приходить',
    nobody: 'Цього дня ніхто не приходить.',
    special: 'Особливо цього дня',
    noSpecial: 'Особливих завдань немає.',
    routine: 'Щоденні справи',
    done: 'виконано',
    whoAmI: 'Я',
    important: 'Важливо',
    places: 'Де що лежить?',
    today: 'Сьогодні',
    prev: 'Попередній місяць',
    next: 'Наступний місяць',
    note: 'Примітка',
    offline: 'Немає зʼєднання – зміни збережуться, щойно зʼявиться інтернет.',
    demo: 'Демо-режим: дані зберігаються лише в цьому браузері.',
    saveError: 'Не вдалося зберегти. Спробуйте ще раз.'
  }
};

export function pad(n) { return String(n).padStart(2, '0'); }
export function keyOf(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
export function dateOf(key) { const [y, m, d] = key.split('-').map(Number); return new Date(y, m - 1, d, 12); }
export function todayKey() { return keyOf(new Date()); }

export function weekly(settings) {
  return (settings && settings.main && settings.main.weekly) || DEFAULT_WEEKLY;
}

// Wer kommt an diesem Tag? 'olena' | 'ilona' | 'open' | null
export function whoFor(key, settings, days) {
  const d = days && days[key];
  let w;
  if (d && d.who && d.who !== 'default') w = d.who;
  else w = weekly(settings)[dateOf(key).getDay()];
  if (!w || w === 'none') return null;
  return PEOPLE[w] ? w : 'open';
}

// Monatsraster, Montag zuerst; null = leere Zelle
export function monthCells(year, month) {
  const first = new Date(year, month, 1, 12);
  const lead = (first.getDay() + 6) % 7;
  const count = new Date(year, month + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < lead; i++) cells.push(null);
  for (let d = 1; d <= count; d++) cells.push(keyOf(new Date(year, month, d, 12)));
  while (cells.length % 7) cells.push(null);
  return cells;
}

// Nächster Einsatztag ab heute (inkl.), max. 60 Tage voraus
export function nextVisit(settings, days) {
  const d = new Date(); d.setHours(12, 0, 0, 0);
  for (let i = 0; i < 60; i++) {
    const k = keyOf(d);
    if (whoFor(k, settings, days)) return k;
    d.setDate(d.getDate() + 1);
  }
  return todayKey();
}

export function el(tag, attrs, ...children) {
  const n = document.createElement(tag);
  if (attrs) for (const [k, v] of Object.entries(attrs)) {
    if (v === undefined || v === null || v === false) continue;
    if (k === 'class') n.className = v;
    else if (k === 'style') n.setAttribute('style', v);
    else if (k.startsWith('on')) n.addEventListener(k.slice(2), v);
    else if (k === 'text') n.textContent = v;
    else n.setAttribute(k, v === true ? '' : v);
  }
  for (const c of children.flat()) {
    if (c === null || c === undefined || c === false) continue;
    n.append(c instanceof Node ? c : document.createTextNode(String(c)));
  }
  return n;
}

export function newId() { return Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4); }

export const ICON_CHECK = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';

// Startwerte, bis die Einstellungen geladen sind
setPeople(null);
