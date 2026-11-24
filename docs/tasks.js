// Aufgabenliste (Deutsch / Ukrainisch). Hier können Aufgaben ergänzt oder geändert werden.
// Jede abhakbare Aufgabe braucht eine eindeutige id.

export const COLORS = {
  amber:  { fg: '#7A5B12', bg: '#FDEBC8' },
  coral:  { fg: '#8A3A26', bg: '#FFDDD2' },
  teal:   { fg: '#1F6470', bg: '#D3ECF0' },
  green:  { fg: '#2A6B46', bg: '#D6EEDF' },
  blue:   { fg: '#34528F', bg: '#DCE4F7' },
  purple: { fg: '#7D3890', bg: '#EBDDF5' }
};

export const ROUTINE = [
  { id: 'k1', n: '1', c: 'amber',
    de: 'Küche aufräumen', uk: 'Прибрати на кухні',
    subs: { de: ['Lebensmittel in den Kühlschrank', 'Spülmaschinen ausräumen', 'Frühstücksgeschirr in die Spülmaschine einräumen'],
            uk: ['Продукти поставити в холодильник', 'Розвантажити посудомийні машини', 'Посуд після сніданку завантажити в посудомийну машину'] } },
  { id: 'k2', n: '2', c: 'coral',
    de: 'Betten aufschlagen und lüften', uk: 'Відкинути ковдри на ліжках і провітрити',
    subs: { de: ['Nicht lüften bei Regen'], uk: ['Не провітрювати, коли йде дощ'] } },
  { id: 'k3', n: '3', c: 'teal',
    de: 'Wäsche', uk: 'Прання',
    subs: { de: ['Wäsche aus Bädern und Kinderzimmern einsammeln', 'Unten in die Wäscheboxen entsprechend der Beschriftungen (!) einsortieren', 'Waschmaschine & Trockner ein-/ausräumen'],
            uk: ['Зібрати білизну з ванних і дитячих кімнат', 'Внизу розкласти по кошиках для білизни згідно з підписами (!)', 'Завантажити / розвантажити пральну машину та сушарку'] },
    note: { de: 'Handtücher (90 °C) oder Unterwäsche & Socken (60 °C): Waschmaschine mit Trocknerfunktion im Kinderbad nutzen (Dauer ca. 5 Stunden)',
            uk: 'Рушники (90 °C) або нижню білизну й шкарпетки (60 °C) можна прати в пральній машині з функцією сушіння в дитячій ванній (триває приблизно 5 годин)' } },
  { n: '4', c: 'green', group: true,
    de: 'Erdgeschoss aufräumen und sauber machen', uk: 'Перший поверх: прибрати й почистити',
    children: [
      { id: 'eg_a', n: 'a', de: 'HWR (Hauswirtschaftsraum)', uk: 'Господарська кімната (пральня)',
        subs: { de: ['Jacken aufhängen – links: Alex · rechts: Caterina, Gäste & Allgemeines · Kinderjacken in den Flur', 'Schuhe einsortieren', 'Waschbecken freiräumen', 'Säubern'],
                uk: ['Повісити куртки – ліворуч: Алекс · праворуч: Катеріна, гості та загальне · дитячі куртки – в коридор', 'Розкласти взуття', 'Звільнити раковину', 'Почистити'] } },
      { id: 'eg_b', n: 'b', de: 'Küche', uk: 'Кухня',
        subs: { de: ['Aufräumen & säubern', 'Kücheninsel und Fensterbank freiräumen'], uk: ['Прибрати й почистити', 'Звільнити кухонний острів і підвіконня'] } },
      { id: 'eg_c', n: 'c', de: 'Esszimmer', uk: 'Їдальня',
        subs: { de: ['Aufräumen & säubern', 'Esstisch vollständig freiräumen'], uk: ['Прибрати й почистити', 'Повністю звільнити обідній стіл'] } },
      { id: 'eg_d', n: 'd', de: 'Wohnzimmer', uk: 'Вітальня',
        subs: { de: ['Aufräumen & säubern'], uk: ['Прибрати й почистити'] } },
      { id: 'eg_e', n: 'e', de: 'Gästezimmer', uk: 'Гостьова кімната',
        subs: { de: ['Badezimmer säubern', 'Flur saugen', 'Den Tisch räumen die Kinder auf'], uk: ['Почистити ванну кімнату', 'Пропилососити коридор', 'Стіл прибирають діти'] } },
      { id: 'eg_f', n: 'f', de: 'Gäste-WC', uk: 'Гостьовий туалет' },
      { id: 'eg_g', n: 'g', de: 'Flur', uk: 'Коридор' },
      { id: 'eg_h', n: 'h', de: 'Erdgeschoss komplett wischen', uk: 'Вимити підлогу на всьому першому поверсі' }
    ] },
  { n: '5', c: 'blue', group: true,
    de: 'Obergeschoss', uk: 'Другий поверх',
    children: [
      { id: 'og_a', n: 'a', de: 'Dinge von den Stufen mit nach oben nehmen', uk: 'Речі зі сходів забрати нагору',
        subs: { de: ['Direkt einsortieren – falls nicht bekannt, aufs Bücherregal'], uk: ['Одразу розкласти по місцях – якщо невідомо куди, то на книжкову полицю'] } },
      { id: 'og_b', n: 'b', de: 'Stufen saugen', uk: 'Пропилососити сходи' },
      { id: 'og_c', n: 'c', de: 'Flur', uk: 'Коридор',
        subs: { de: ['Bücher einsortieren', 'Ablage säubern', 'Bild gelegentlich entstauben'], uk: ['Поставити книжки на місце', 'Почистити поличку', 'Час від часу змахнути пил з картини'] },
        note: { de: 'Vorsicht beim Bild: echte Ölfarbe!', uk: 'Обережно з картиною: справжня олійна фарба!' } },
      { id: 'og_d', n: 'd', de: 'Zimmer Max', uk: 'Кімната Макса',
        subs: { de: ['Saubere Wäsche in den Schrank', 'Nachttisch aufräumen', 'Flaschen & Gläser nach unten', 'Saugen, Staubwischen'],
                uk: ['Чистий одяг скласти в шафу', 'Прибрати приліжкову тумбочку', 'Пляшки й склянки віднести вниз', 'Пропилососити, витерти пил'] } },
      { id: 'og_e', n: 'e', de: 'Zimmer Mädels', uk: 'Кімната дівчат',
        subs: { de: ['Aufräumen', 'Saubere Wäsche in die Schränke', 'Kuscheltiere in den schwarzen Korb', 'Flaschen & Gläser nach unten', 'Saugen, Staubwischen'],
                uk: ['Прибрати', 'Чистий одяг скласти в шафи', 'М’які іграшки – в чорний кошик', 'Пляшки й склянки віднести вниз', 'Пропилососити, витерти пил'] } },
      { id: 'og_f', n: 'f', de: 'Kinder-Badezimmer', uk: 'Дитяча ванна кімната',
        subs: { de: ['Säubern', 'Handtücher sortieren', 'Ablage auf der Waschmaschine freiräumen, soweit es geht', 'Zahnputzbecher reinigen'],
                uk: ['Почистити', 'Розкласти рушники', 'Звільнити поверхню на пральній машині, наскільки можливо', 'Вимити склянки для зубних щіток'] } },
      { id: 'og_g', n: 'g', de: 'Badezimmer Caterina', uk: 'Ванна кімната Катеріни',
        subs: { de: ['Ablage freiräumen, soweit es geht', 'Weiße Handtücher aufgerollt in den Heizungswärmer', 'Säubern'],
                uk: ['Звільнити поличку, наскільки можливо', 'Білі рушники скрутити й покласти на рушникосушку', 'Почистити'] } },
      { id: 'og_h', n: 'h', de: 'Badezimmer Alexander', uk: 'Ванна кімната Алекса' },
      { id: 'og_i', n: 'i', de: 'Büro Alexander', uk: 'Кабінет Алекса' },
      { id: 'og_j', n: 'j', de: 'Elternschlafzimmer', uk: 'Батьківська спальня',
        subs: { de: ['Saubere Wäsche in den Schrank räumen'], uk: ['Чистий одяг скласти в шафу'] } }
    ] },
  { n: '6', c: 'purple', group: true,
    de: 'Bügeln & Wäsche', uk: 'Прасування й білизна',
    children: [
      { id: 'bw_a', n: 'a', de: 'Bügeln', uk: 'Прасувати' },
      { id: 'bw_b', n: 'b', de: 'Wäsche falten und in die Schränke einsortieren', uk: 'Скласти білизну й розкласти по шафах' }
    ] }
];

// Alle abhakbaren Routine-Aufgaben als flache Liste
export const ROUTINE_FLAT = ROUTINE.flatMap(t => t.group ? t.children : [t]);

export const FRIDAY_NOTE = {
  de: 'WICHTIG: Freitags muss alles vollständig gewaschen, gebügelt und eingeräumt sein!',
  uk: 'ВАЖЛИВО: у п’ятницю все має бути повністю випрано, випрасувано й розкладено по місцях!'
};

export const MATTE_NOTE = {
  de: 'Türen, Rahmen, Badezimmerschränke und Küchenfronten sind matt – bitte nicht mit scharfem Reinigungsmittel oder Mikrofasertüchern säubern.',
  uk: 'Двері, дверні рами, шафи у ванних кімнатах і кухонні фасади – матові. Будь ласка, не чистіть їх агресивними миючими засобами чи серветками з мікрофібри.'
};

export const PLACES = [
  { de: ['Gesellschafts- und Kartenspiele', 'Wohnzimmer, rechter Schrank unten'],
    uk: ['Настільні та карткові ігри', 'Вітальня, права шафа внизу'] },
  { de: ['Mal- & Bastelsachen', 'Gästezimmer: auf den Tisch oder direkt einräumen. Perlen: Flur, linker Schrank, unterste Schublade. Blätter, Stifte, Kleber: Flur, linker Schrank, untere Schubladen, Fächer & Boxen'],
    uk: ['Речі для малювання й творчості', 'Гостьова кімната: на стіл або одразу розкласти по місцях. Намистини: коридор, ліва шафа, найнижча шухляда. Папір, олівці, клей: коридор, ліва шафа, нижні шухляди, полиці й коробки'] },
  { de: ['Bürsten, Haargummis, Haarklammern', 'Mädchenzimmer – bitte direkt in die Box. Eine Bürste bleibt am Waschbecken im HWR.'],
    uk: ['Щітки для волосся, резинки, заколки', 'Кімната дівчат – будь ласка, одразу в коробку. Одна щітка залишається біля раковини в господарській кімнаті.'] },
  { de: ['Schmuck, Armbänder', 'Mädchenzimmer'], uk: ['Прикраси, браслети', 'Кімната дівчат'] },
  { de: ['Medikamente', 'Elternbereich, Schrank über der Bettwäsche (hinter der Tür)'],
    uk: ['Ліки', 'Батьківська частина, шафа над постільною білизною (за дверима)'] }
];

// Vorlagen für Sonderaufgaben (Verwaltung → „Aus Vorlage hinzufügen“)
export const TEMPLATES = [
  { de: 'Kühlschrank auswischen', uk: 'Протерти холодильник' },
  { de: 'Spülmaschinen säubern, besonders Ränder und die Wände daneben', uk: 'Почистити посудомийні машини, особливо краї та стінки поруч' },
  { de: 'Waschmaschinen säubern: Waschmittel-Schublade herausnehmen und gründlich reinigen, Flusen an den Gummidichtungen entfernen', uk: 'Почистити пральні машини: вийняти й ретельно вимити відсік для засобу, прибрати ворс уздовж гумових ущільнювачів' },
  { de: 'Erdgeschoss: Holzboden schrubben', uk: 'Перший поверх: відтерти дерев’яну підлогу' },
  { de: 'Alle (!!) Fußleisten reinigen, auch oben drauf entstauben', uk: 'Почистити всі (!!) плінтуси, також витерти пил зверху' },
  { de: 'Alle Türen abwischen', uk: 'Протерти всі двері' },
  { de: 'Türgriffe und Lichtschalter', uk: 'Дверні ручки та вимикачі' },
  { de: 'Haustüren (Haupt- und Nebeneingang) von außen reinigen, ebenso die Türzargen', uk: 'Вхідні двері (головний і бічний вхід) почистити ззовні, а також дверні коробки' },
  { de: 'Kleiderschränke: ordentlich falten und aufräumen, Schubladen aussaugen', uk: 'Шафи для одягу: акуратно скласти й упорядкувати речі, пропилососити шухляди' },
  { de: 'Keller sortieren und aufräumen', uk: 'Розібрати й прибрати підвал' },
  { de: 'Garage entrümpeln und aufräumen', uk: 'Розчистити й прибрати гараж' },
  { de: 'Schwimmtasche Clara ausräumen, waschen, einräumen', uk: 'Сумку для басейну Клари розібрати, випрати й знову скласти' },
  { de: 'Check: Schwimmtasche Clara wieder gepackt', uk: 'Перевірити: сумка для басейну Клари знову зібрана' },
  { de: 'Check: Sportsachen Max gewaschen (wichtig für Montagmorgen)', uk: 'Перевірити: спортивний одяг Макса випраний (важливо на ранок понеділка)' }
];
