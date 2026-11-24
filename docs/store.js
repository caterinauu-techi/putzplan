// Datenzugriff: Firebase (Firestore + Auth) oder Demo-Modus (lokal im Browser).
import { firebaseConfig, ADMIN_EMAILS, AI } from './firebase-config.js';

export const DEMO = !firebaseConfig;
const SDK = 'https://www.gstatic.com/firebasejs/13.4.0/';
const LANG_NAMES = { de: 'Deutsche', uk: 'Ukrainische' };

function translatePrompt(text, target) {
  return 'Übersetze den folgenden Text ins ' + LANG_NAMES[target] + '. Es ist eine kurze Nachricht oder Aufgabe ' +
    'zwischen einer Familie und ihrer Haushaltshilfe (Putzen, Wäsche, Haushalt). Schreibe natürlich und freundlich. ' +
    'Ist der Text schon in der Zielsprache, gib ihn unverändert zurück. Antworte NUR mit der Übersetzung, ohne Anführungszeichen oder Erklärungen.\n\nText:\n' + text;
}

export function isAdminUser(u) {
  return !!(u && u.email && ADMIN_EMAILS.includes(u.email.toLowerCase()));
}

export async function initStore() {
  return DEMO ? demoStore() : firebaseStore();
}

async function firebaseStore() {
  const [{ initializeApp }, fs, au] = await Promise.all([
    import(SDK + 'firebase-app.js'),
    import(SDK + 'firebase-firestore.js'),
    import(SDK + 'firebase-auth.js')
  ]);
  const app = initializeApp(firebaseConfig);
  const db = fs.getFirestore(app);
  const auth = au.getAuth(app);

  // Übersetzung über Firebase AI Logic (Gemini). Wird erst beim ersten Bedarf geladen.
  let modelPromise = null;
  function getModel() {
    if (!AI || !AI.recaptchaSiteKey) return Promise.resolve(null);
    if (!modelPromise) {
      modelPromise = Promise.all([import(SDK + 'firebase-app-check.js'), import(SDK + 'firebase-ai.js')])
        .then(([ac, ai]) => {
          ac.initializeAppCheck(app, { provider: new ac.ReCaptchaV3Provider(AI.recaptchaSiteKey), isTokenAutoRefreshEnabled: true });
          const inst = ai.getAI(app, { backend: new ai.GoogleAIBackend() });
          return ai.getGenerativeModel(inst, { model: AI.model });
        })
        .catch(e => { console.warn('KI nicht verfügbar', e); return null; });
    }
    return modelPromise;
  }

  return {
    demo: false,
    async translate(text, target) {
      if (!text || !text.trim()) return '';
      const model = await getModel();
      if (!model) return null;
      try {
        const r = await model.generateContent(translatePrompt(text, target));
        const out = (r.response.text() || '').trim();
        return out || null;
      } catch (e) {
        console.warn('Übersetzung fehlgeschlagen', e);
        return null;
      }
    },
    add: (col, data) => fs.addDoc(fs.collection(db, col), data),
    remove: (col, id) => fs.deleteDoc(fs.doc(db, col, id)),
    onAuth: cb => au.onAuthStateChanged(auth, cb),
    signInAnon: () => au.signInAnonymously(auth),
    signInGoogle: () => au.signInWithPopup(auth, new au.GoogleAuthProvider()),
    signOut: () => au.signOut(auth),
    watch(col, cb, onErr) {
      return fs.onSnapshot(fs.collection(db, col), snap => {
        const map = {};
        snap.forEach(d => { map[d.id] = d.data(); });
        cb(map);
      }, onErr);
    },
    merge: (col, id, data) => fs.setDoc(fs.doc(db, col, id), data, { merge: true }),
    put: (col, id, data) => fs.setDoc(fs.doc(db, col, id), data),
    removeField: (col, id, fieldPath) => fs.updateDoc(fs.doc(db, col, id), { [fieldPath]: fs.deleteField() })
  };
}

// ---------- Demo-Modus ----------
const KEY = 'putzplan-demo-v1';
function load() {
  try { return JSON.parse(localStorage.getItem(KEY)) || { settings: {}, days: {}, checks: {} }; }
  catch (e) { return { settings: {}, days: {}, checks: {} }; }
}
function save(state) {
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* ignorieren */ }
}
function deepMerge(target, src) {
  for (const k of Object.keys(src)) {
    const v = src[k];
    if (v && typeof v === 'object' && !Array.isArray(v)) {
      if (!target[k] || typeof target[k] !== 'object') target[k] = {};
      deepMerge(target[k], v);
    } else {
      target[k] = v;
    }
  }
  return target;
}

function demoStore() {
  const listeners = [];
  const notify = () => {
    const s = load();
    listeners.forEach(l => l.cb(structuredClone(s[l.col] || {})));
  };
  window.addEventListener('storage', e => { if (e.key === KEY) notify(); });
  const write = fn => { const s = load(); fn(s); save(s); notify(); return Promise.resolve(); };
  return {
    demo: true,
    translate: () => Promise.resolve(null),
    add: (col, data) => write(s => { s[col] = s[col] || {}; s[col]['m' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6)] = structuredClone(data); }),
    remove: (col, id) => write(s => { if (s[col]) delete s[col][id]; }),
    onAuth: cb => { setTimeout(() => cb({ uid: 'demo', email: 'caterina.uu@gmail.com', isAnonymous: false }), 0); return () => {}; },
    signInAnon: () => Promise.resolve(),
    signInGoogle: () => Promise.resolve(),
    signOut: () => Promise.resolve(),
    watch(col, cb) {
      const l = { col, cb };
      listeners.push(l);
      setTimeout(() => cb(structuredClone(load()[col] || {})), 0);
      return () => { const i = listeners.indexOf(l); if (i >= 0) listeners.splice(i, 1); };
    },
    merge: (col, id, data) => write(s => { s[col] = s[col] || {}; s[col][id] = deepMerge(s[col][id] || {}, structuredClone(data)); }),
    put: (col, id, data) => write(s => { s[col] = s[col] || {}; s[col][id] = structuredClone(data); }),
    removeField: (col, id, fieldPath) => write(s => {
      const parts = fieldPath.split('.');
      let o = s[col] && s[col][id];
      for (let i = 0; o && i < parts.length - 1; i++) o = o[parts[i]];
      if (o) delete o[parts[parts.length - 1]];
    })
  };
}
