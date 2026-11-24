// Nachrichten zwischen Putzfrau und Verwaltung, mit automatischer Übersetzung.
import { PEOPLE, el } from './common.js';

export const PRESETS = [
  { de: 'Putzmittel ist fast leer.', uk: 'Миючий засіб майже закінчився.' },
  { de: 'Müllbeutel fehlen.', uk: 'Закінчилися пакети для сміття.' },
  { de: 'Staubsaugerbeutel fehlen.', uk: 'Закінчилися мішки для пилососа.' },
  { de: 'Spülmaschinentabs sind fast leer.', uk: 'Таблетки для посудомийки майже закінчилися.' },
  { de: 'Toilettenpapier ist fast leer.', uk: 'Туалетний папір майже закінчився.' },
  { de: 'Etwas ist kaputt gegangen – bitte melden.', uk: 'Щось зламалося – будь ласка, зв’яжіться зі мною.' }
];

const TXT = {
  uk: { title: 'Повідомлення', placeholder: 'Напишіть повідомлення… (буде перекладено німецькою)', send: 'Надіслати', quick: 'Швидко:', empty: 'Ще немає повідомлень.', you: 'Ви', boss: 'Катеріна', sending: 'Надсилаю…', orig: 'Оригінал', err: 'Не вдалося надіслати.' },
  de: { title: 'Nachrichten', placeholder: 'Nachricht schreiben … (wird automatisch übersetzt)', send: 'Senden', quick: 'Schnell:', empty: 'Noch keine Nachrichten.', you: 'Du', boss: 'Caterina', sending: 'Sende …', orig: 'Original', err: 'Konnte nicht senden.' }
};

// opts: { store, side: 'cleaner'|'admin', lang: () => 'de'|'uk', me: () => 'olena'|'ilona'|'', onError(msg) }
export function mountMessages(root, opts) {
  let messages = {};
  const title = el('h3', { class: 'section-title', style: 'margin-top:0' });
  const list = el('div', { class: 'msg-list', 'aria-live': 'polite' });
  const ta = el('textarea', { class: 'msg-input', rows: '2' });
  const sendBtn = el('button', { class: 'btn' });
  const quick = el('div', { class: 'msg-quick' });
  const status = el('div', { class: 't-meta' });
  let pendingPreset = null;
  root.replaceChildren(title, list, quick, ta, el('div', { class: 'row', style: 'margin-top:8px;align-items:center' }, status, sendBtn));

  async function send() {
    const text = ta.value.trim();
    if (!text) return;
    const L = opts.lang();
    const T = TXT[L];
    sendBtn.disabled = true; status.textContent = T.sending;
    try {
      let doc;
      if (opts.side === 'cleaner') {
        const preset = pendingPreset && pendingPreset.uk === text ? pendingPreset : PRESETS.find(p => p.uk === text || p.de === text);
        const de = preset ? preset.de : await opts.store.translate(text, 'de');
        doc = { from: opts.me() || 'open', orig: text, de: de || null, uk: preset ? preset.uk : text, at: Date.now(), readByAdmin: false };
      } else {
        const uk = await opts.store.translate(text, 'uk');
        doc = { from: 'admin', orig: text, de: text, uk: uk || null, at: Date.now(), readByAdmin: true };
      }
      await opts.store.add('messages', doc);
      ta.value = ''; pendingPreset = null; status.textContent = '';
    } catch (e) {
      status.textContent = T.err;
      if (opts.onError) opts.onError(T.err);
    } finally {
      sendBtn.disabled = false;
    }
  }
  sendBtn.addEventListener('click', send);

  function labels() {
    const L = opts.lang();
    const T = TXT[L];
    title.textContent = T.title;
    ta.placeholder = T.placeholder;
    ta.setAttribute('aria-label', T.title);
    sendBtn.textContent = T.send;
    quick.replaceChildren();
    if (opts.side === 'cleaner') {
      quick.append(el('span', { class: 't-meta', text: T.quick }));
      PRESETS.forEach(p => quick.append(el('button', { class: 'chip', type: 'button', onclick: () => { ta.value = p[L]; pendingPreset = p; ta.focus(); } }, p[L])));
    }
  }

  function renderList() {
    const L = opts.lang();
    const T = TXT[L];
    const items = Object.entries(messages).map(([id, m]) => Object.assign({ id }, m)).sort((a, b) => (a.at || 0) - (b.at || 0)).slice(-30);
    list.replaceChildren();
    if (!items.length) { list.append(el('div', { class: 'empty-hint', text: T.empty })); return; }
    items.forEach(m => {
      const mine = opts.side === 'admin' ? m.from === 'admin' : m.from !== 'admin';
      const shown = (L === 'uk' ? m.uk : m.de) || m.orig || '';
      const who = m.from === 'admin' ? (opts.side === 'admin' ? T.you : T.boss) : (PEOPLE[m.from] ? PEOPLE[m.from][L] : '');
      const time = m.at ? new Date(m.at).toLocaleString(L === 'uk' ? 'uk-UA' : 'de-DE', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }) : '';
      const bubble = el('div', { class: 'msg' + (mine ? ' mine' : '') + (opts.side === 'admin' && !m.readByAdmin && m.from !== 'admin' ? ' unread' : '') },
        el('div', { class: 'msg-meta', text: who + ' · ' + time }),
        el('div', { class: 'msg-text', text: shown }),
        m.orig && shown !== m.orig ? el('div', { class: 'msg-orig', text: T.orig + ': ' + m.orig }) : null
      );
      list.append(bubble);
    });
    list.scrollTop = list.scrollHeight;
  }

  labels();
  renderList();
  return {
    setMessages(map) { messages = map || {}; renderList(); },
    relabel() { labels(); renderList(); },
    unread() { return Object.values(messages).filter(m => m.from !== 'admin' && !m.readByAdmin); },
    unreadIds() { return Object.entries(messages).filter(([, m]) => m.from !== 'admin' && !m.readByAdmin).map(([id]) => id); }
  };
}
