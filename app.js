/* Straßenbau-Trainer – App-Logik (ohne Frameworks, Speicherung in localStorage) */
(function () {
  'use strict';

  var I = window.INHALT || { bereiche: [], karten: [], fragen: [] };
  var R = window.RECHNEN;
  var SPEICHER = 'strassenbau-trainer-v1';
  var app = document.getElementById('app');

  /* ================= Zustand ================= */
  function standard() {
    return {
      version: 1,
      einstellungen: { bereiche: [], stufe: 'alle', lernzeit: 20, pruefungMinuten: 100, pruefungAnzahl: 30, pruefungsdatum: '', darstellung: 'system', schrift: 'normal', pruefungArt: 'strassenbau' },
      karten: {},       // id -> { status: 'kann'|'ueben', datum }
      fragen: {},       // id -> { richtig, falsch, letzte: true|false }
      rechnen: {},      // thema -> { richtig, falsch }
      fehler: {},       // schluessel -> { ref } oder { aufgabe }, anzahl, datum
      pruefungen: [],   // Verlauf
      letztePruefung: null,
      pruefungLauf: null,
      merkliste: [],    // Karten-IDs
      notizen: [],      // { id, titel, text, datum }
      zeit: {}          // 'JJJJ-MM-TT' -> Sekunden
    };
  }
  var S = laden();
  var speicherOk = true;

  function laden() {
    try {
      var roh = localStorage.getItem(SPEICHER);
      if (roh) return bereinige(JSON.parse(roh));
    } catch (e) { /* ungültige Daten -> Standard */ }
    return standard();
  }
  function istObj(x) { return x && typeof x === 'object' && !Array.isArray(x); }
  // Gespeicherte oder importierte Daten auf die erwartete Struktur bringen
  function bereinige(d) {
    var s = standard();
    if (!istObj(d)) return s;
    ['karten', 'fragen', 'rechnen', 'fehler', 'zeit'].forEach(function (k) { if (istObj(d[k])) s[k] = d[k]; });
    ['merkliste', 'notizen', 'pruefungen'].forEach(function (k) { if (Array.isArray(d[k])) s[k] = d[k]; });
    s.merkliste = s.merkliste.filter(function (x) { return typeof x === 'string'; });
    s.notizen = s.notizen.filter(istObj).map(function (n) { return { id: String(n.id || ('n' + Math.random().toString(36).slice(2))), titel: String(n.titel || ''), text: String(n.text || ''), datum: Number(n.datum) || Date.now() }; });
    s.pruefungen = s.pruefungen.filter(istObj).map(function (v) { return { datum: Number(v.datum) || 0, punkte: Number(v.punkte) || 0, max: Number(v.max) || 0, prozent: Number(v.prozent) || 0, note: String(v.note || ''), art: String(v.art || ''), richtig: Number(v.richtig) || 0, anzahl: Number(v.anzahl) || 0, dauer: Number(v.dauer) || 0 }; });
    Object.keys(s.zeit).forEach(function (k) { s.zeit[k] = Number(s.zeit[k]) || 0; });
    if (istObj(d.letztePruefung) && Array.isArray(d.letztePruefung.details)) s.letztePruefung = d.letztePruefung;
    if (istObj(d.pruefungLauf) && Array.isArray(d.pruefungLauf.items) && Array.isArray(d.pruefungLauf.antworten)) s.pruefungLauf = d.pruefungLauf;
    if (istObj(d.einstellungen)) {
      var e = Object.assign(s.einstellungen, d.einstellungen);
      e.bereiche = Array.isArray(e.bereiche) ? e.bereiche.filter(function (x) { return typeof x === 'string'; }) : [];
      e.lernzeit = Number(e.lernzeit) || 20; e.pruefungMinuten = Number(e.pruefungMinuten) || 45; e.pruefungAnzahl = Number(e.pruefungAnzahl) || 20;
      e.stufe = ['alle', '1', '2', '3', 1, 2, 3].indexOf(e.stufe) >= 0 ? String(e.stufe) : 'alle';
      e.pruefungsdatum = /^\d{4}-\d{2}-\d{2}$/.test(e.pruefungsdatum) ? e.pruefungsdatum : '';
      e.darstellung = ['system', 'light', 'dark'].indexOf(e.darstellung) >= 0 ? e.darstellung : 'system';
      e.schrift = e.schrift === 'gross' ? 'gross' : 'normal';
      e.pruefungArt = typeof e.pruefungArt === 'string' ? e.pruefungArt : 'strassenbau';
    }
    return s;
  }
  function speichern() {
    try { localStorage.setItem(SPEICHER, JSON.stringify(S)); speicherOk = true; }
    catch (e) { speicherOk = false; }
  }

  /* ================= Hilfen ================= */
  function esc(t) {
    return String(t === undefined || t === null ? '' : t).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function mische(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function heute() { var d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
  function datumText(ms) { return new Date(ms).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' }); }
  function prozent(a, b) { return b ? Math.round(a / b * 100) : 0; }
  function bereich(id) { return I.bereiche.filter(function (b) { return b.id === id; })[0] || { id: id, name: id }; }
  function frageById(id) { return I.fragen.filter(function (f) { return f.id === id; })[0]; }
  function karteById(id) { return I.karten.filter(function (k) { return k.id === id; })[0]; }
  function ansage(t) { var a = document.getElementById('ansage'); a.textContent = ''; setTimeout(function () { a.textContent = t; }, 50); }
  function toast(t) {
    var alt = document.querySelector('.toast'); if (alt) alt.remove();
    var el = document.createElement('div'); el.className = 'toast'; el.setAttribute('role', 'status'); el.textContent = t;
    document.body.appendChild(el); setTimeout(function () { el.remove(); }, 2600);
  }
  function balken(p, gut) { return '<div class="balken' + (gut ? ' gut' : '') + '" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + p + '" aria-label="' + p + ' Prozent"><span style="width:' + (Number(p) || 0) + '%"></span></div>'; }
  var STUFEN = { 1: 'leicht', 2: 'mittel', 3: 'schwer' };
  function normText(t) {
    return String(t || '').toLowerCase().trim().replace(/\s+/g, ' ')
      .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss').replace(/[.!]$/, '');
  }

  function aktiveBereiche() {
    var gueltig = S.einstellungen.bereiche.filter(function (id) { return I.bereiche.some(function (b) { return b.id === id; }); });
    return gueltig.length ? gueltig : I.bereiche.map(function (b) { return b.id; });
  }
  function passtStufe(st) { var s = S.einstellungen.stufe; return s === 'alle' || Number(s) === st; }
  function stufeZahl() { var s = S.einstellungen.stufe; return s === 'alle' ? 0 : Number(s); }

  // Fragenpool mit Rückfall, falls die gewählte Schwierigkeit leer ist
  function fragenPool(bereiche, typ) {
    var basis = I.fragen.filter(function (f) {
      return bereiche.indexOf(f.bereich) >= 0 && (typ === 'alle' || !typ || (typ === 'mc' ? f.typ === 'mc' : f.typ !== 'mc'));
    });
    var mitStufe = basis.filter(function (f) { return passtStufe(f.stufe); });
    return { liste: mitStufe.length ? mitStufe : basis, rueckfall: !mitStufe.length && basis.length > 0 };
  }

  function lernplan() {
    var m = Number(S.einstellungen.lernzeit) || 20;
    return { karten: Math.max(5, Math.round(m * 0.5)), quiz: Math.max(5, Math.round(m * 0.4)), rechnen: Math.max(3, Math.round(m * 0.2)) };
  }

  /* ================= Fortschritt ================= */
  function fortschritt(bid) {
    var k = I.karten.filter(function (x) { return x.bereich === bid; });
    var f = I.fragen.filter(function (x) { return x.bereich === bid; });
    var kk = k.filter(function (x) { return S.karten[x.id] && S.karten[x.id].status === 'kann'; }).length;
    var fr = f.filter(function (x) { return S.fragen[x.id] && S.fragen[x.id].letzte === true; }).length;
    var gesehen = k.filter(function (x) { return S.karten[x.id]; }).length + f.filter(function (x) { return S.fragen[x.id]; }).length;
    var gesamt = k.length + f.length;
    return { karten: k.length, kartenKann: kk, fragen: f.length, fragenRichtig: fr, gesehen: gesehen, gesamt: gesamt, prozent: prozent(kk + fr, gesamt) };
  }
  function gesamtFortschritt() {
    var a = 0, b = 0;
    I.bereiche.forEach(function (x) { var f = fortschritt(x.id); a += f.kartenKann + f.fragenRichtig; b += f.gesamt; });
    return prozent(a, b);
  }
  function statusVon(f) {
    if (!f.gesehen) return { cls: 'neu', text: 'noch nicht begonnen' };
    if (f.prozent >= 75) return { cls: 'sicher', text: 'sicher' };
    return { cls: 'offen', text: 'noch üben' };
  }

  /* ================= Fehler ================= */
  function fehlerSchluessel(item) { return item.quelle === 'frage' ? item.id : item.id; }
  function fehlerMerken(item) {
    var k = fehlerSchluessel(item);
    var e = S.fehler[k] || (item.quelle === 'frage' ? { ref: item.id } : { aufgabe: item.aufgabe });
    e.anzahl = (e.anzahl || 0) + 1; e.datum = Date.now();
    S.fehler[k] = e;
  }
  function fehlerItems() {
    return Object.keys(S.fehler).map(function (k) {
      var e = S.fehler[k];
      if (e.ref) { var f = frageById(e.ref); return f ? alsItem(f) : null; }
      if (istObj(e.aufgabe)) return rechenItem(e.aufgabe);
      return null;
    }).filter(Boolean);
  }
  function fehlerAnzahl() { return fehlerItems().length; }

  /* ================= Aufgaben-Einheit ================= */
  function stufeOk(x) { x = Number(x); return x === 2 || x === 3 ? x : 1; }
  function alsItem(f) { return { quelle: 'frage', id: f.id, typ: f.typ, bereich: f.bereich, stufe: stufeOk(f.stufe), f: f }; }
  function rechenItem(a) {
    a.loesung = Number(a.loesung); a.toleranz = Number(a.toleranz) || 0; a.nk = Math.max(0, Math.min(6, Number(a.nk) || 0));
    if (!Array.isArray(a.weg)) a.weg = [];
    return { quelle: 'rechnen', id: String(a.id), typ: 'rechnen', bereich: 'fachrechnen', stufe: stufeOk(a.stufe), aufgabe: a };
  }
  function hatAntwort(x) { return x !== undefined && x !== null && x !== ''; }

  function itemFrage(item) { return item.quelle === 'frage' ? item.f.frage : item.aufgabe.frage; }
  function itemEtikett(item) {
    if (item.quelle === 'frage') return bereich(item.bereich).name;
    return 'Fachrechnen · ' + item.aufgabe.themaName;
  }
  function pruefeAntwort(item, wert) {
    if (!hatAntwort(wert)) return null;
    if (item.quelle === 'rechnen') return R.pruefe(item.aufgabe, wert);
    var f = item.f;
    if (f.typ === 'mc') return Number(wert) === f.richtig;
    if (f.typ === 'zahl') {
      var tol = f.toleranz !== undefined ? f.toleranz : Math.max(0.01, Math.abs(f.loesung) * 0.005);
      return R.pruefeZahl(wert, f.loesung, tol);
    }
    var w = normText(wert);
    if (!w) return null;
    return (f.antworten || []).some(function (a) { return normText(a) === w; });
  }
  function richtigeAntwortText(item) {
    if (item.quelle === 'rechnen') return R.zahl(item.aufgabe.loesung, item.aufgabe.nk) + ' ' + item.aufgabe.einheit;
    var f = item.f;
    if (f.typ === 'mc') return f.optionen[f.richtig];
    if (f.typ === 'zahl') return R.zahl(f.loesung, nachkomma(f.loesung)) + (f.einheit ? ' ' + f.einheit : '');
    return (f.antworten || [])[0] || '';
  }
  function nachkomma(x) { var s = String(x); return s.indexOf('.') >= 0 ? Math.min(3, s.split('.')[1].length) : 0; }
  function antwortAnzeige(item, wert) {
    if (!hatAntwort(wert)) return '— (keine Antwort)';
    if (item.quelle === 'frage' && item.f.typ === 'mc') return item.f.optionen[wert];
    return String(wert);
  }
  function erklaerungHtml(item) {
    if (item.quelle === 'rechnen') {
      var a = item.aufgabe;
      return '<p><strong>Lösungsweg:</strong></p><ol class="weg">' + a.weg.map(function (s) { return '<li>' + esc(s) + '</li>'; }).join('') + '</ol>' +
        (a.hinweis ? '<p class="leise" style="margin-top:.5rem">' + esc(a.hinweis) + '</p>' : '');
    }
    return '<p>' + esc(item.f.erklaerung || '') + '</p>';
  }
  function statistikBuchen(item, ok) {
    if (item.quelle === 'frage') {
      var s = S.fragen[item.id] || { richtig: 0, falsch: 0 };
      if (ok) s.richtig++; else s.falsch++;
      s.letzte = ok; S.fragen[item.id] = s;
    } else {
      var t = item.aufgabe.thema, r = S.rechnen[t] || { richtig: 0, falsch: 0 };
      if (ok) r.richtig++; else r.falsch++;
      S.rechnen[t] = r;
    }
  }

  // Eingabebereich für eine Aufgabe (Quiz/Fehler: sofort prüfen; Prüfung: nur speichern)
  function eingabeHtml(item, opts) {
    opts = opts || {};
    var gewaehlt = opts.wert, beantwortet = opts.beantwortet;
    if (item.quelle === 'frage' && item.f.typ === 'mc') {
      return '<div class="optionen" role="group" aria-label="Antwortmöglichkeiten">' + item.f.optionen.map(function (o, i) {
        var cls = 'knopf option';
        if (beantwortet) {
          if (i === item.f.richtig) cls += ' richtig';
          else if (String(i) === String(gewaehlt)) cls += ' falsch';
        } else if (String(i) === String(gewaehlt)) cls += ' gewaehlt';
        var zusatz = beantwortet && i === item.f.richtig ? ' <span class="versteckt">(richtige Antwort)</span>' : (beantwortet && String(i) === String(gewaehlt) ? ' <span class="versteckt">(deine Antwort)</span>' : '');
        return '<button type="button" class="' + cls + '" data-action="' + opts.aktion + '" data-wert="' + i + '"' + (beantwortet ? ' disabled' : '') +
          (!beantwortet && String(i) === String(gewaehlt) ? ' aria-pressed="true"' : '') + '><span class="buchst" aria-hidden="true">' + 'ABCD'[i] + '</span><span>' + esc(o) + zusatz + '</span></button>';
      }).join('') + '</div>';
    }
    var einheit = item.quelle === 'rechnen' ? item.aufgabe.einheit : (item.f.einheit || '');
    var istZahl = item.quelle === 'rechnen' || item.f.typ === 'zahl';
    return '<form class="eingabe-form" data-form="' + opts.aktion + '"><label for="antwort">Deine Antwort' + (istZahl ? ' (Komma oder Punkt erlaubt)' : '') + '</label>' +
      '<div class="eingabe-zeile"><input id="antwort" type="text" autocomplete="off" ' + (istZahl ? 'inputmode="decimal" ' : 'autocapitalize="off" spellcheck="false" ') +
      'value="' + esc(gewaehlt || '') + '"' + (beantwortet ? ' disabled' : '') + '>' +
      (einheit ? '<span class="einheit">' + esc(einheit) + '</span>' : '') +
      (opts.ohneKnopf ? '' : '<button class="knopf haupt" type="submit"' + (beantwortet ? ' disabled' : '') + '>' + (opts.knopfText || 'Prüfen') + '</button>') +
      '</div></form>';
  }
  function rueckmeldungHtml(item, ok, wert) {
    var titel = ok ? 'Richtig! 👍' : (wert === '' || wert === undefined ? 'Lösung' : 'Leider nicht richtig');
    return '<div class="rueckmeldung ' + (ok ? 'gut' : 'schlecht') + '" role="status" tabindex="-1" id="rueckmeldung">' +
      '<h3>' + titel + '</h3>' +
      (ok ? '' : '<p>Richtige Antwort: <strong>' + esc(richtigeAntwortText(item)) + '</strong>' + (wert !== '' && wert !== undefined ? '<br><span class="leise">Deine Antwort: ' + esc(antwortAnzeige(item, wert)) + '</span>' : '') + '</p>') +
      erklaerungHtml(item) + '</div>';
  }

  /* ================= Navigation ================= */
  var SEITEN = [
    { id: 'start', name: 'Übersicht' }, { id: 'karten', name: 'Lernkarten' }, { id: 'quiz', name: 'Quiz' },
    { id: 'rechnen', name: 'Rechenübungen' }, { id: 'pruefung', name: 'Prüfungssimulation' }, { id: 'fehler', name: 'Fehlertraining' },
    { id: 'merkliste', name: 'Merkliste & Notizen' }, { id: 'einstellungen', name: 'Einstellungen' }
  ];
  var aktuelleSeite = 'start';
  function navZeichnen() {
    var n = fehlerAnzahl();
    document.getElementById('navliste').innerHTML = SEITEN.map(function (s) {
      return '<li><a href="#/' + s.id + '"' + (s.id === aktuelleSeite ? ' aria-current="page"' : '') + '>' + s.name +
        (s.id === 'fehler' && n ? '<span class="zaehler" aria-hidden="true">' + n + '</span><span class="versteckt">, ' + n + ' offene Fehler</span>' : '') + '</a></li>';
    }).join('');
    var cd = document.getElementById('countdown');
    var tage = tageBisPruefung();
    cd.textContent = tage === null ? '' : tage > 0 ? 'Noch ' + tage + (tage === 1 ? ' Tag' : ' Tage') + ' bis zur Prüfung' : tage === 0 ? 'Heute ist Prüfung – viel Erfolg!' : '';
  }
  function tageBisPruefung() {
    var d = S.einstellungen.pruefungsdatum; if (!d) return null;
    var ziel = new Date(d + 'T00:00:00'), jetzt = new Date(heute() + 'T00:00:00');
    return Math.round((ziel - jetzt) / 86400000);
  }

  var sitzung = null; // aktive Übungseinheit (Karten/Quiz/Rechnen/Fehler)
  function route() {
    if (location.hash && !/^#\//.test(location.hash)) return; // z. B. Sprunglink #app
    var h = (location.hash || '#/start').replace(/^#\/?/, '').split('?');
    var seite = h[0] || 'start';
    var param = new URLSearchParams(h[1] || '');
    if (!SEITEN.some(function (s) { return s.id === seite; })) seite = 'start';
    if (seite !== aktuelleSeite) sitzung = null;
    aktuelleSeite = seite;
    navZeichnen();
    var fn = { start: seiteStart, karten: seiteKarten, quiz: seiteQuiz, rechnen: seiteRechnen, pruefung: seitePruefung, fehler: seiteFehler, merkliste: seiteMerkliste, einstellungen: seiteEinstellungen }[seite];
    fn(param);
    var titel = SEITEN.filter(function (s) { return s.id === seite; })[0].name;
    document.title = titel + ' – Straßenbau-Trainer';
  }
  function zeige(html, fokus) {
    app.innerHTML = html;
    if (fokus !== false) {
      var h = app.querySelector('h1');
      if (h) { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); }
      window.scrollTo(0, 0);
    }
  }
  function gehe(pfad) { if (location.hash === pfad) route(); else location.hash = pfad; }

  /* ================= Übersicht ================= */
  function seiteStart() {
    var g = gesamtFortschritt(), plan = lernplan();
    var minuten = Math.round((S.zeit[heute()] || 0) / 60), ziel = Number(S.einstellungen.lernzeit) || 20;
    var liste = I.bereiche.map(function (b) { return { b: b, f: fortschritt(b.id) }; });
    var offen = liste.filter(function (x) { return x.f.prozent < 75; }).sort(function (a, b) { return a.f.prozent - b.f.prozent; });
    var letzte = S.pruefungen[S.pruefungen.length - 1];
    var rechnenGes = Object.keys(S.rechnen).reduce(function (s, k) { return s + S.rechnen[k].richtig + S.rechnen[k].falsch; }, 0);
    var rechnenOk = Object.keys(S.rechnen).reduce(function (s, k) { return s + S.rechnen[k].richtig; }, 0);
    var nF = fehlerAnzahl();

    var html = '<h1>Lernübersicht</h1>' +
      '<div class="hinweisbox"><strong>Hinweis:</strong> Das ist allgemeines Übungsmaterial für die Zwischenprüfung Straßenbauer/in, keine offizielle Prüfungsaufgabensammlung. Maßgeblich sind deine Unterlagen aus Betrieb, Berufsschule und überbetrieblicher Ausbildung.</div>' +
      (S.pruefungLauf ? '<div class="hinweisbox warn">Du hast eine laufende Prüfungssimulation. <a href="#/pruefung">Weitermachen</a></div>' : '') +
      (!speicherOk ? '<div class="hinweisbox warn">Der Lernfortschritt kann in diesem Browser nicht gespeichert werden (z. B. privates Fenster).</div>' : '') +
      '<div class="raster">' +
      '<div class="karte"><div class="leise">Gesamtfortschritt</div><div class="kennzahl">' + g + ' %</div>' + balken(g, g >= 75) + '<p class="leise" style="margin:.5rem 0 0">Anteil der Karten mit „kann ich“ und zuletzt richtig beantworteten Fragen.</p></div>' +
      '<div class="karte"><div class="leise">Heute gelernt</div><div class="kennzahl">' + minuten + ' / ' + ziel + ' min</div>' + balken(Math.min(100, prozent(minuten, ziel)), minuten >= ziel) + '<p class="leise" style="margin:.5rem 0 0">' + (minuten >= ziel ? 'Tagesziel erreicht – stark!' : 'Gezählt wird die Zeit, in der du aktiv übst.') + '</p></div>' +
      '<div class="karte"><div class="leise">Fehlertraining</div><div class="kennzahl">' + nF + '</div><p class="leise">' + (nF ? 'Aufgaben warten auf Wiederholung.' : 'Keine offenen Fehler.') + '</p>' + (nF ? '<a class="knopf klein" href="#/fehler">Fehler üben</a>' : '') + '</div>' +
      '<div class="karte"><div class="leise">Letzte Prüfungssimulation</div><div class="kennzahl">' + (letzte ? letzte.prozent + ' %' : '–') + '</div><p class="leise">' + (letzte ? datumText(letzte.datum) + ' · ' + esc(letzte.note) : 'Noch keine Simulation gemacht.') + '</p><a class="knopf klein" href="#/pruefung">Zur Prüfung</a></div>' +
      '</div>' +
      '<section class="karte"><h2>Dein Lernplan für heute (' + ziel + ' Minuten)</h2><p class="leise">Vorschlag passend zu deiner Lernzeit. Ändern kannst du sie in den Einstellungen.</p>' +
      '<div class="zeile"><a class="knopf haupt" href="#/karten?start=1">' + plan.karten + ' Lernkarten</a><a class="knopf" href="#/quiz?start=1">' + plan.quiz + ' Quizfragen</a><a class="knopf" href="#/rechnen?start=1">' + plan.rechnen + ' Rechenaufgaben</a></div></section>';

    if (offen.length) {
      html += '<section class="karte"><h2>Offene Bereiche</h2><p class="leise">Hier lohnt sich das Üben am meisten (unter 75 %).</p><div class="zeile">' +
        offen.slice(0, 4).map(function (x) { return '<a class="knopf klein" href="#/quiz?bereich=' + x.b.id + '&start=1">' + esc(x.b.name) + ' (' + x.f.prozent + ' %)</a>'; }).join('') + '</div></section>';
    }

    html += '<section class="karte"><h2>Themen und Fortschritt</h2><ul class="bereichliste">' + liste.map(function (x) {
      var st = statusVon(x.f);
      return '<li><div class="zeile"><span class="name">' + esc(x.b.name) + '</span><span class="marke-status ' + st.cls + '">' + st.text + '</span><span class="leise">' + x.f.prozent + ' %</span></div>' +
        balken(x.f.prozent, x.f.prozent >= 75) +
        '<div class="zeile zwischen" style="margin-top:.4rem"><span class="leise">Karten ' + x.f.kartenKann + '/' + x.f.karten + ' · Fragen ' + x.f.fragenRichtig + '/' + x.f.fragen + '</span>' +
        '<span class="zeile"><a class="knopf klein" href="#/karten?bereich=' + x.b.id + '&start=1">Karten</a><a class="knopf klein" href="#/quiz?bereich=' + x.b.id + '&start=1">Quiz</a></span></div></li>';
    }).join('') + '</ul></section>';

    html += '<section class="karte"><h2>Fachrechnen</h2><p>' + (rechnenGes ? rechnenOk + ' von ' + rechnenGes + ' Rechenaufgaben richtig (' + prozent(rechnenOk, rechnenGes) + ' %).' : 'Noch keine Rechenaufgaben gelöst.') + '</p>' +
      '<div class="zeile">' + R.THEMEN.map(function (t) {
        var r = S.rechnen[t.id]; return '<a class="knopf klein" href="#/rechnen?thema=' + t.id + '&start=1">' + t.name + (r ? ' · ' + prozent(r.richtig, r.richtig + r.falsch) + ' %' : '') + '</a>';
      }).join('') + '</div></section>';
    zeige(html);
  }

  /* ================= Lernkarten ================= */
  function bereichSelect(id, gewaehlt, mitAlle) {
    return '<select id="' + id + '">' + (mitAlle ? '<option value="">Alle gewählten Bereiche</option>' : '') +
      I.bereiche.map(function (b) { return '<option value="' + b.id + '"' + (b.id === gewaehlt ? ' selected' : '') + '>' + esc(b.name) + '</option>'; }).join('') + '</select>';
  }
  function seiteKarten(p) {
    if (p.get('start') && !sitzung) { starteKarten(p.get('bereich') || '', p.get('nur') || 'alle'); return; }
    if (sitzung && sitzung.art === 'karten') { zeigeKarte(); return; }
    var plan = lernplan();
    zeige('<h1>Lernkarten</h1><p>Lies die Frage, überlege dir die Antwort und dreh dann die Karte um. Sei ehrlich zu dir: „Kann ich“ oder „Noch üben“.</p>' +
      '<div class="karte"><div class="feld"><label for="k-bereich">Lernbereich</label>' + bereichSelect('k-bereich', p.get('bereich') || '', true) + '</div>' +
      '<div class="feld"><label for="k-nur">Welche Karten?</label><select id="k-nur"><option value="alle">Alle (offene zuerst)</option><option value="ueben">Nur „noch üben“ und neue</option><option value="merk">Nur Karten aus der Merkliste</option></select></div>' +
      '<p class="leise">Pro Runde ' + plan.karten + ' Karten (aus deiner Lernzeit berechnet).</p>' +
      '<button class="knopf haupt" data-action="karten-start">Lernkarten starten</button></div>' + kartenStatistik());
  }
  function kartenStatistik() {
    var kann = 0, ueben = 0;
    Object.keys(S.karten).forEach(function (k) { if (S.karten[k].status === 'kann') kann++; else ueben++; });
    return '<div class="karte"><h2>Stand</h2><p>Kann ich: <strong>' + kann + '</strong> · Noch üben: <strong>' + ueben + '</strong> · Neu: <strong>' + Math.max(0, I.karten.length - kann - ueben) + '</strong> (von ' + I.karten.length + ')</p></div>';
  }
  function starteKarten(bid, nur) {
    var bereiche = bid ? [bid] : aktiveBereiche();
    var liste = I.karten.filter(function (k) { return bereiche.indexOf(k.bereich) >= 0; });
    if (nur === 'ueben') liste = liste.filter(function (k) { return !S.karten[k.id] || S.karten[k.id].status !== 'kann'; });
    if (nur === 'merk') liste = I.karten.filter(function (k) { return S.merkliste.indexOf(k.id) >= 0; });
    // offene und neue zuerst, dann gekonnte
    var rang = function (k) { var s = S.karten[k.id]; return !s ? 1 : s.status === 'ueben' ? 0 : 2; };
    liste = mische(liste).sort(function (a, b) { return rang(a) - rang(b); }).slice(0, lernplan().karten);
    if (!liste.length) {
      zeige('<h1>Lernkarten</h1><div class="karte leer"><p>Keine passenden Karten gefunden.' + (nur === 'merk' ? ' Deine Merkliste ist leer – markiere Karten mit „Merken“.' : nur === 'ueben' ? ' Du kannst hier schon alle Karten. 🎉' : '') + '</p><a class="knopf" href="#/karten">Zurück</a></div>');
      return;
    }
    sitzung = { art: 'karten', liste: liste, i: 0, offen: false, kann: 0, ueben: 0, bid: bid, nur: nur };
    zeigeKarte();
  }
  var letzteKartenWahl = { bid: '', nur: 'alle' };
  function zeigeKarte() {
    var s = sitzung;
    if (s.i >= s.liste.length) {
      zeige('<h1>Runde geschafft!</h1><div class="karte"><p>Du hast <strong>' + s.liste.length + '</strong> Karten durchgearbeitet.</p><p>Kann ich: <strong>' + s.kann + '</strong> · Noch üben: <strong>' + s.ueben + '</strong></p>' +
        '<p>' + (s.ueben ? 'Die Karten mit „noch üben“ kommen in der nächsten Runde zuerst dran.' : 'Super, alles gewusst!') + '</p>' +
        '<div class="zeile"><button class="knopf haupt" data-action="karten-neu">Neue Runde</button><a class="knopf" href="#/start">Zur Übersicht</a></div></div>');
      letzteKartenWahl = { bid: s.bid, nur: s.nur }; sitzung = null; return;
    }
    var k = s.liste[s.i], gemerkt = S.merkliste.indexOf(k.id) >= 0, st = S.karten[k.id];
    zeige('<div class="kopfzeile"><h1 style="margin:0">Lernkarten</h1><span class="etikett">Karte ' + (s.i + 1) + ' von ' + s.liste.length + '</span></div>' +
      balken(prozent(s.i, s.liste.length)) +
      '<p class="leise" style="margin-top:.6rem">' + esc(bereich(k.bereich).name) + (st ? ' · zuletzt: ' + (st.status === 'kann' ? 'kann ich' : 'noch üben') : ' · neu') + '</p>' +
      '<button class="lernkarte' + (s.offen ? ' offen' : '') + '" data-action="karte-drehen">' +
      '<span class="seite">' + (s.offen ? 'Antwort' : 'Frage') + '</span><span class="inhalt">' + esc(s.offen ? k.antwort : k.frage) + '</span>' +
      (s.offen ? '' : '<span class="leise" style="margin-top:1rem">Tippen zum Umdrehen</span>') + '</button>' +
      (s.offen ? '<p class="leise" style="margin-top:.75rem"><strong>Frage:</strong> ' + esc(k.frage) + '</p>' : '') +
      '<div class="zeile" style="margin-top:1rem">' +
      (s.offen ? '<button class="knopf gut" data-action="karte-bewerten" data-wert="kann">✓ Kann ich</button><button class="knopf schlecht" data-action="karte-bewerten" data-wert="ueben">↻ Noch üben</button>'
        : '<button class="knopf haupt" data-action="karte-drehen">Antwort zeigen</button>') +
      '<button class="knopf" data-action="merken" data-wert="' + k.id + '" aria-pressed="' + gemerkt + '">' + (gemerkt ? '★ Gemerkt' : '☆ Merken') + '</button>' +
      '<button class="knopf" data-action="karten-ende">Beenden</button></div>', s.i === 0 && !s.offen);
    if (!(s.i === 0 && !s.offen)) { var b = app.querySelector(s.offen ? '[data-action="karte-bewerten"]' : '.lernkarte'); if (b) b.focus(); }
  }

  /* ================= Quiz ================= */
  function seiteQuiz(p) {
    if (p.get('start') && !sitzung) { starteQuiz(p.get('bereich') || '', 'alle'); return; }
    if (sitzung && sitzung.art === 'quiz') { zeigeUebung(); return; }
    var plan = lernplan();
    zeige('<h1>Quiz</h1><p>Multiple-Choice und kurze Eingabeaufgaben. Nach jeder Antwort bekommst du sofort eine Erklärung.</p>' +
      '<div class="karte"><div class="feld"><label for="q-bereich">Lernbereich</label>' + bereichSelect('q-bereich', p.get('bereich') || '', true) + '</div>' +
      '<div class="feld"><label for="q-typ">Aufgabenart</label><select id="q-typ"><option value="alle">Gemischt</option><option value="mc">Nur Multiple Choice</option><option value="eingabe">Nur Eingabeaufgaben</option></select></div>' +
      '<div class="feld"><label for="q-anzahl">Anzahl Fragen</label><select id="q-anzahl">' + [5, 10, 15, 20, 30].concat([plan.quiz]).filter(function (v, i, a) { return a.indexOf(v) === i; }).sort(function (a, b) { return a - b; })
        .map(function (n) { return '<option' + (n === plan.quiz ? ' selected' : '') + '>' + n + '</option>'; }).join('') + '</select></div>' +
      '<p class="leise">Schwierigkeit laut Einstellungen: <strong>' + (S.einstellungen.stufe === 'alle' ? 'gemischt' : STUFEN[S.einstellungen.stufe]) + '</strong></p>' +
      '<button class="knopf haupt" data-action="quiz-start">Quiz starten</button></div>');
  }
  function starteQuiz(bid, typ, anzahl) {
    var bereiche = bid ? [bid] : aktiveBereiche();
    var pool = fragenPool(bereiche, typ);
    // selten/nie oder falsch beantwortete Fragen bevorzugen
    var gewicht = function (f) { var s = S.fragen[f.id]; return !s ? 1 : s.letzte === false ? 0 : 2; };
    var liste = mische(pool.liste).sort(function (a, b) { return gewicht(a) - gewicht(b); }).slice(0, anzahl || lernplan().quiz);
    if (!liste.length) { zeige('<h1>Quiz</h1><div class="karte leer"><p>Für diese Auswahl gibt es keine Fragen.</p><a class="knopf" href="#/quiz">Zurück</a></div>'); return; }
    sitzung = { art: 'quiz', items: mische(liste).map(alsItem), i: 0, antworten: [], ergebnisse: [], rueckfall: pool.rueckfall, titel: 'Quiz' };
    zeigeUebung();
  }

  /* Gemeinsame Ansicht für Quiz und Fehlertraining */
  function zeigeUebung() {
    var s = sitzung;
    if (s.i >= s.items.length) { zeigeUebungsEnde(); return; }
    var item = s.items[s.i], beantwortet = s.ergebnisse[s.i] !== undefined, wert = s.antworten[s.i];
    var html = '<div class="kopfzeile"><h1 style="margin:0">' + s.titel + '</h1><span class="etikett">Frage ' + (s.i + 1) + ' von ' + s.items.length + '</span></div>' +
      balken(prozent(s.i + (beantwortet ? 1 : 0), s.items.length)) +
      (s.rueckfall && s.i === 0 ? '<div class="hinweisbox" style="margin-top:1rem">Für die gewählte Schwierigkeit gab es keine Fragen – es werden alle Schwierigkeitsstufen genutzt.</div>' : '') +
      '<div class="karte" style="margin-top:1rem"><div class="zeile" style="margin-bottom:.6rem"><span class="etikett">' + esc(itemEtikett(item)) + '</span><span class="etikett">' + STUFEN[item.stufe] + '</span></div>' +
      '<p class="frage-text" id="frage">' + esc(itemFrage(item)) + '</p>' +
      eingabeHtml(item, { aktion: 'uebung-antwort', wert: wert, beantwortet: beantwortet }) +
      (beantwortet ? rueckmeldungHtml(item, s.ergebnisse[s.i], wert) : '') + '</div>' +
      '<div class="zeile">' + (beantwortet ? '<button class="knopf haupt" data-action="uebung-weiter">' + (s.i + 1 < s.items.length ? 'Nächste Frage →' : 'Zur Auswertung') + '</button>'
        : (item.quelle === 'rechnen' || item.f.typ !== 'mc' ? '<button class="knopf" data-action="uebung-loesung">Weiß ich nicht – Lösung zeigen</button>' : '')) +
      '<button class="knopf" data-action="uebung-ende">Beenden</button></div>';
    zeige(html, !beantwortet && s.i === 0);
    if (beantwortet) { var w = app.querySelector('[data-action="uebung-weiter"]'); var r = document.getElementById('rueckmeldung'); if (r) r.focus({ preventScroll: true }); if (w) w.scrollIntoView({ block: 'nearest' }); }
    else if (s.i > 0) { var inp = document.getElementById('antwort') || app.querySelector('.option'); if (inp) inp.focus(); }
  }
  function uebungAntworten(wert) {
    var s = sitzung, item = s.items[s.i];
    var ok = pruefeAntwort(item, wert);
    if (ok === null) { toast('Bitte gib eine Antwort ein (bei Zahlen nur die Zahl).'); return; }
    s.antworten[s.i] = wert; s.ergebnisse[s.i] = ok;
    statistikBuchen(item, ok);
    if (ok) { if (s.art === 'fehler' && S.fehler[fehlerSchluessel(item)]) { delete S.fehler[fehlerSchluessel(item)]; s.entfernt = (s.entfernt || 0) + 1; } }
    else fehlerMerken(item);
    speichern(); navZeichnen();
    ansage(ok ? 'Richtig' : 'Nicht richtig. Richtige Antwort: ' + richtigeAntwortText(item));
    zeigeUebung();
  }
  function zeigeUebungsEnde() {
    var s = sitzung, richtig = s.ergebnisse.filter(function (x) { return x === true; }).length, n = s.ergebnisse.length, p = prozent(richtig, n);
    var lob = p >= 90 ? 'Hervorragend!' : p >= 75 ? 'Gut gemacht!' : p >= 50 ? 'Auf einem guten Weg – dranbleiben.' : 'Nicht aufgeben: Wiederhole die Fehler und schau dir die Lernkarten an.';
    var html = '<h1>Auswertung</h1><div class="karte"><div class="kennzahl">' + richtig + ' von ' + n + ' richtig (' + p + ' %)</div>' + balken(p, p >= 75) + '<p style="margin-top:.6rem">' + lob + '</p>' +
      (s.art === 'fehler' ? '<p>' + (s.entfernt || 0) + ' Aufgabe(n) aus der Fehlerliste entfernt. Noch offen: ' + fehlerAnzahl() + '.</p>' : '') +
      '<div class="zeile">' + (fehlerAnzahl() ? '<a class="knopf haupt" href="#/fehler?start=1">Fehler üben (' + fehlerAnzahl() + ')</a>' : '') +
      '<button class="knopf" data-action="' + (s.art === 'fehler' ? 'fehler-neu' : 'quiz-neu') + '">Neue Runde</button><a class="knopf" href="#/start">Zur Übersicht</a></div></div>';
    if (n) {
      html += '<section class="karte"><h2>Deine Antworten</h2><ul class="ergebnisliste">' + s.items.slice(0, n).map(function (item, i) {
        return '<li><span class="' + (s.ergebnisse[i] ? 'ok">✓ richtig' : 'nok">✗ falsch') + '</span> – ' + esc(itemFrage(item)) +
          (s.ergebnisse[i] ? '' : '<br><span class="leise">Richtig: ' + esc(richtigeAntwortText(item)) + '</span>') + '</li>';
      }).join('') + '</ul></section>';
    }
    sitzung = null;
    zeige(html);
  }

  /* ================= Rechenübungen ================= */
  function seiteRechnen(p) {
    if (sitzung && sitzung.art === 'rechnen' && !p.get('thema')) { zeigeRechnen(); return; }
    var thema = p.get('thema') || (sitzung && sitzung.thema) || 'mix';
    if (p.get('start') || p.get('thema')) {
      sitzung = { art: 'rechnen', thema: thema, aufgabe: R.erzeuge(thema, stufeZahl()), wert: '', ergebnis: undefined, richtig: 0, gesamt: 0, ziel: lernplan().rechnen };
      zeigeRechnen(); return;
    }
    zeige('<h1>Rechenübungen</h1><p>Aufgaben mit immer neuen Zahlen – zu Flächen, Volumen, Gefälle, Baustoffmengen, Einheiten und Höhen. Nach dem Prüfen siehst du den vollständigen Lösungsweg.</p>' +
      '<div class="karte"><div class="feld"><label for="r-thema">Thema</label><select id="r-thema"><option value="mix">Gemischt</option>' +
      R.THEMEN.map(function (t) { return '<option value="' + t.id + '">' + t.name + '</option>'; }).join('') + '</select></div>' +
      '<p class="leise">Schwierigkeit laut Einstellungen: <strong>' + (S.einstellungen.stufe === 'alle' ? 'gemischt' : STUFEN[S.einstellungen.stufe]) + '</strong>. Tipp: Taschenrechner bereitlegen, Ergebnisse auf 2 Nachkommastellen runden (Höhen auf 3).</p>' +
      '<button class="knopf haupt" data-action="rechnen-start">Rechnen starten</button></div>' + rechenStatistik());
  }
  function rechenStatistik() {
    return '<div class="karte"><h2>Deine Ergebnisse</h2><table><thead><tr><th>Thema</th><th>Richtig</th><th>Gesamt</th><th>Quote</th></tr></thead><tbody>' +
      R.THEMEN.map(function (t) { var r = S.rechnen[t.id] || { richtig: 0, falsch: 0 }, g = r.richtig + r.falsch; return '<tr><td>' + t.name + '</td><td>' + r.richtig + '</td><td>' + g + '</td><td>' + (g ? prozent(r.richtig, g) + ' %' : '–') + '</td></tr>'; }).join('') +
      '</tbody></table></div>';
  }
  function zeigeRechnen() {
    var s = sitzung, a = s.aufgabe, item = rechenItem(a), beantwortet = s.ergebnis !== undefined;
    var tt = R.THEMEN.filter(function (t) { return t.id === s.thema; })[0];
    if (!tt) s.thema = 'mix';
    var themaName = tt ? tt.name : 'Gemischt';
    zeige('<div class="kopfzeile"><h1 style="margin:0">Rechenübungen</h1><span class="etikett">' + s.richtig + ' von ' + s.gesamt + ' richtig · Ziel heute: ' + s.ziel + '</span></div>' +
      '<div class="karte" style="margin-top:1rem"><div class="zeile" style="margin-bottom:.6rem"><span class="etikett">' + esc(a.themaName) + '</span><span class="etikett">' + STUFEN[a.stufe] + '</span>' + (s.thema === 'mix' ? '' : '<span class="etikett">Auswahl: ' + esc(themaName) + '</span>') + '</div>' +
      '<p class="frage-text">' + esc(a.frage) + '</p>' +
      (a.hinweis && !beantwortet ? '<p class="leise">' + esc(a.hinweis) + '</p>' : '') +
      eingabeHtml(item, { aktion: 'rechnen-antwort', wert: s.wert, beantwortet: beantwortet }) +
      (beantwortet ? rueckmeldungHtml(item, s.ergebnis, s.wert) : '') + '</div>' +
      '<div class="zeile">' + (beantwortet ? '<button class="knopf haupt" data-action="rechnen-weiter">Neue Aufgabe →</button>' : '<button class="knopf" data-action="rechnen-loesung">Lösungsweg zeigen</button>') +
      '<a class="knopf" href="#/rechnen" data-action="rechnen-ende">Thema wechseln</a></div>', s.gesamt === 0 && !beantwortet);
    if (beantwortet) { var r = document.getElementById('rueckmeldung'); if (r) r.focus({ preventScroll: true }); }
    else if (s.gesamt > 0) { var inp = document.getElementById('antwort'); if (inp) inp.focus(); }
  }

  /* ================= Prüfungssimulation ================= */
  var uhr = null;
  // Prüfungsbereiche der Zwischenprüfung nach BauWiAusbV 1999 (§ 22, Tiefbaufacharbeiter, Schwerpunkt Straßenbau)
  var PRUEF_ARTEN = {
    strassenbau: { name: 'Schwerpunkt Straßenbau', info: 'Original ca. 90–100 Minuten, 40 % des schriftlichen Teils. Vermessung, Entwässerung, Unterlage für Decken und Beläge, Pflaster und Platten, Asphalt.', bereiche: ['vermessung', 'entwaesserung', 'oberbau', 'pflaster', 'zeichnen', 'fachrechnen'], themen: ['flaeche', 'gefaelle', 'mengen', 'hoehen', 'volumen'], anteilRechnen: 0.35, minuten: 100, anzahl: 30 },
    tiefbau: { name: 'Bauwerke im Tiefbau', info: 'Original ca. 90–100 Minuten, 40 % des schriftlichen Teils. Gruben und Gräben sichern, Baustoffe, Böden, Verbau, Maschinen, Wasserhaltung, Verkehrsflächen, Ver- und Entsorgung.', bereiche: ['baustoffe', 'erdbau', 'entwaesserung', 'maschinen', 'arbeitsschutz', 'oberbau', 'grundbildung'], themen: ['volumen', 'einheiten', 'mengen'], anteilRechnen: 0.25, minuten: 100, anzahl: 30 },
    wiso: { name: 'Wirtschafts- und Sozialkunde', info: 'Original ca. 30–40 Minuten, 20 % des schriftlichen Teils, ohne Hilfsmittel.', bereiche: ['wiso'], themen: [], anteilRechnen: 0, minuten: 40, anzahl: 20 },
    frei: { name: 'Freie Übung', info: 'Gemischt aus den Lernbereichen, die du in den Einstellungen gewählt hast.', bereiche: null, themen: null, anteilRechnen: 0.3, minuten: 45, anzahl: 20 }
  };
  function pruefArt() { return PRUEF_ARTEN[S.einstellungen.pruefungArt] ? S.einstellungen.pruefungArt : 'strassenbau'; }
  function seitePruefung(p) {
    if (S.pruefungLauf) { zeigePruefung(); return; }
    if (p.get('ergebnis') && S.letztePruefung) { zeigeAuswertung(S.letztePruefung); return; }
    var e = S.einstellungen;
    var verlauf = S.pruefungen.slice(-10).reverse();
    var art = pruefArt(), A = PRUEF_ARTEN[art];
    zeige('<h1>Prüfungssimulation</h1><p>Übe die schriftlichen Prüfungsbereiche deiner Zwischenprüfung – mit Zeitlimit. Erst am Ende siehst du Punkte, Note und Lösungen.</p>' +
      '<div class="hinweisbox">Aufbau nach der Ausbildungsverordnung Bauwirtschaft von 1999 (gilt für Ausbildungsbeginn bis Juli 2026): Deine Zwischenprüfung entspricht der Abschlussprüfung Tiefbaufacharbeiter. Schriftlich gibt es drei Bereiche – <strong>Schwerpunkt Straßenbau</strong> (40 %), <strong>Bauwerke im Tiefbau</strong> (40 %) und <strong>Wirtschafts- und Sozialkunde</strong> (20 %). Die Dauer wird unterschiedlich angegeben (Verordnungstext: 100/100/40 Min., IHK Berlin: 90/90/30 Min.) – frag bei deiner Kammer nach. Dazu kommt eine praktische Aufgabe, im Straßenbau typischerweise Pflaster- und Plattenbelag mit Längs- und Querneigung und Einfassung. Hilfsmittel bei der IHK: Tabellenbuch, nicht programmierbarer Taschenrechner, Zeichenwerkzeug; in WiSo keine. Die Aufgaben hier sind eigene Übungsaufgaben, keine Original-Prüfungsaufgaben. Termin und Details erfährst du bei deiner Kammer.</div>' +
      '<div class="karte"><div class="feld"><label for="p-art">Prüfungsbereich</label><select id="p-art">' +
      Object.keys(PRUEF_ARTEN).map(function (k) { return '<option value="' + k + '"' + (k === art ? ' selected' : '') + '>' + PRUEF_ARTEN[k].name + '</option>'; }).join('') + '</select>' +
      '<p class="leise" style="margin-top:.3rem">' + esc(A.info) + '</p></div>' +
      '<div class="raster" style="grid-template-columns:repeat(auto-fit,minmax(180px,1fr))">' +
      '<div class="feld" style="margin:0"><label for="p-anzahl">Anzahl Aufgaben</label><select id="p-anzahl">' + [10, 15, 20, 30, 40].map(function (n) { return '<option' + (n === Number(e.pruefungAnzahl) ? ' selected' : '') + '>' + n + '</option>'; }).join('') + '</select></div>' +
      '<div class="feld" style="margin:0"><label for="p-minuten">Zeit (Minuten)</label><select id="p-minuten">' + [15, 30, 40, 45, 60, 90, 100, 120].map(function (n) { return '<option' + (n === Number(e.pruefungMinuten) ? ' selected' : '') + '>' + n + '</option>'; }).join('') + '</select></div>' +
      '</div><p class="leise">Punkte: leicht = 1, mittel = 2, schwer = 3. Notenschlüssel nach dem üblichen 100-Punkte-Schema der Kammern (nur zur Orientierung).</p>' +
      '<button class="knopf haupt" data-action="pruefung-start">Prüfung starten</button></div>' +
      '<section class="karte"><h2>Bisherige Simulationen</h2>' + (verlauf.length ? '<table><thead><tr><th>Datum</th><th>Bereich</th><th>Punkte</th><th>Ergebnis</th><th>Note</th></tr></thead><tbody>' +
        verlauf.map(function (v) { return '<tr><td>' + datumText(v.datum) + '</td><td>' + esc(v.art || '–') + '</td><td>' + v.punkte + '/' + v.max + '</td><td>' + v.prozent + ' %</td><td>' + esc(v.note) + '</td></tr>'; }).join('') + '</tbody></table>' +
        (S.letztePruefung ? '<p style="margin-top:.75rem"><a href="#/pruefung?ergebnis=1">Letzte Auswertung ansehen</a></p>' : '')
        : '<p class="leise">Noch keine Simulation gemacht.</p>') + '</section>');
  }
  function note(p) {
    if (p >= 92) return 'sehr gut (1)'; if (p >= 81) return 'gut (2)'; if (p >= 67) return 'befriedigend (3)';
    if (p >= 50) return 'ausreichend (4)'; if (p >= 30) return 'mangelhaft (5)'; return 'ungenügend (6)';
  }
  function startePruefung() {
    var n = Number(document.getElementById('p-anzahl').value), min = Number(document.getElementById('p-minuten').value);
    S.einstellungen.pruefungAnzahl = n; S.einstellungen.pruefungMinuten = min;
    var art = pruefArt(), A = PRUEF_ARTEN[art];
    var nRechnen = Math.round(n * A.anteilRechnen), nFragen = n - nRechnen;
    var pool = A.bereiche ? I.fragen.filter(function (f) { return A.bereiche.indexOf(f.bereich) >= 0; }) : fragenPool(aktiveBereiche(), 'alle').liste;
    if (!pool.length && !nRechnen) { toast('Für diesen Prüfungsbereich gibt es noch keine Aufgaben.'); return; }
    // möglichst gleichmäßig über die Bereiche verteilen
    var nachBereich = {}; mische(pool).forEach(function (f) { (nachBereich[f.bereich] = nachBereich[f.bereich] || []).push(f); });
    var gewaehlt = [], keys = mische(Object.keys(nachBereich));
    while (gewaehlt.length < nFragen && keys.some(function (k) { return nachBereich[k].length; })) {
      keys.forEach(function (k) { if (gewaehlt.length < nFragen && nachBereich[k].length) gewaehlt.push(nachBereich[k].shift()); });
    }
    if (A.anteilRechnen) nRechnen = n - gewaehlt.length;
    var items = gewaehlt.map(function (f) { return { ref: f.id }; });
    var themen = mische(A.themen || R.THEMEN.map(function (t) { return t.id; }));
    for (var i = 0; i < nRechnen; i++) items.push({ aufgabe: R.erzeuge(themen[i % themen.length], stufeZahl()) });
    S.pruefungLauf = { start: Date.now(), ende: Date.now() + min * 60000, items: mische(items), antworten: [], i: 0, art: A.name };
    speichern();
    zeigePruefung();
  }
  function laufItems() {
    var L = S.pruefungLauf;
    var items = L.items.map(function (x) { return x && x.ref ? (frageById(x.ref) ? alsItem(frageById(x.ref)) : null) : (x && istObj(x.aufgabe) ? rechenItem(x.aufgabe) : null); });
    // fehlende Aufgaben (z. B. nach Inhaltsänderung) zusammen mit ihren Antworten entfernen
    if (items.some(function (x) { return !x; })) {
      var neuItems = [], neuAntw = [];
      items.forEach(function (it, i) { if (it) { neuItems.push(L.items[i]); neuAntw.push(L.antworten[i]); } });
      L.items = neuItems; L.antworten = neuAntw; L.i = Math.min(L.i, Math.max(0, neuItems.length - 1));
      items = items.filter(Boolean); speichern();
    }
    return items;
  }
  function restZeit() { return Math.max(0, Math.round((S.pruefungLauf.ende - Date.now()) / 1000)); }
  function zeitText(sek) { var m = Math.floor(sek / 60), s = sek % 60; return m + ':' + String(s).padStart(2, '0'); }
  function zeigePruefung() {
    var L = S.pruefungLauf, items = laufItems();
    if (restZeit() <= 0 || !items.length) { pruefungAbgeben(restZeit() <= 0); return; }
    if (L.i >= items.length) L.i = items.length - 1;
    var item = items[L.i], wert = L.antworten[L.i];
    var beantwortet = L.antworten.filter(hatAntwort).length;
    zeige('<div class="kopfzeile"><h1 style="margin:0">Prüfungssimulation</h1><span class="timer" id="timer" role="timer" aria-label="Verbleibende Zeit">' + zeitText(restZeit()) + '</span></div>' +
      '<p class="leise">Aufgabe ' + (L.i + 1) + ' von ' + items.length + ' · ' + beantwortet + ' beantwortet · Punkte: ' + item.stufe + '</p>' +
      '<div class="karte"><div class="zeile" style="margin-bottom:.6rem"><span class="etikett">' + esc(itemEtikett(item)) + '</span></div>' +
      '<p class="frage-text">' + esc(itemFrage(item)) + '</p>' +
      eingabeHtml(item, { aktion: 'pruefung-antwort', wert: wert, ohneKnopf: false, knopfText: 'Antwort speichern' }) +
      (hatAntwort(wert) && !(item.quelle === 'frage' && item.f.typ === 'mc') ? '<p class="leise" style="margin-top:.5rem">Gespeichert: ' + esc(wert) + '</p>' : '') +
      '</div>' +
      '<div class="zeile zwischen"><span class="zeile"><button class="knopf" data-action="pruefung-gehe" data-wert="' + (L.i - 1) + '"' + (L.i === 0 ? ' disabled' : '') + '>← Zurück</button>' +
      '<button class="knopf" data-action="pruefung-gehe" data-wert="' + (L.i + 1) + '"' + (L.i + 1 >= items.length ? ' disabled' : '') + '>Weiter →</button></span>' +
      '<button class="knopf haupt" data-action="pruefung-abgeben">Prüfung abgeben</button></div>' +
      '<nav class="nummern" aria-label="Aufgabenübersicht">' + items.map(function (_, i) {
        var b = hatAntwort(L.antworten[i]);
        return '<button data-action="pruefung-gehe" data-wert="' + i + '" class="' + (b ? 'beantwortet' : '') + '"' + (i === L.i ? ' aria-current="true"' : '') + ' aria-label="Aufgabe ' + (i + 1) + (b ? ', beantwortet' : '') + '">' + (i + 1) + '</button>';
      }).join('') + '</nav>', false);
    window.scrollTo(0, 0);
    var ft = app.querySelector('.frage-text'); if (ft) { ft.setAttribute('tabindex', '-1'); ft.focus({ preventScroll: true }); }
    starteUhr();
  }
  function starteUhr() {
    if (uhr) clearInterval(uhr);
    uhr = setInterval(function () {
      if (!S.pruefungLauf) { clearInterval(uhr); uhr = null; return; }
      var r = restZeit(), el = document.getElementById('timer');
      if (el) { el.textContent = zeitText(r); el.classList.toggle('knapp', r <= 120); if (r === 300) ansage('Noch 5 Minuten'); }
      if (r <= 0) { clearInterval(uhr); uhr = null; pruefungAbgeben(true); }
    }, 1000);
  }
  function pruefungSpeichereEingabe() {
    var inp = document.getElementById('antwort');
    if (inp && S.pruefungLauf && aktuelleSeite === 'pruefung' && !inp.disabled) { S.pruefungLauf.antworten[S.pruefungLauf.i] = inp.value.trim(); speichern(); }
  }
  function pruefungAbgeben(zeitAbgelaufen) {
    pruefungSpeichereEingabe();
    var L = S.pruefungLauf; if (!L) return;
    if (uhr) { clearInterval(uhr); uhr = null; }
    var items = laufItems(), punkte = 0, max = 0, richtig = 0, details = [];
    items.forEach(function (item, i) {
      var w = L.antworten[i], ok = pruefeAntwort(item, w) === true;
      max += item.stufe; if (ok) { punkte += item.stufe; richtig++; }
      statistikBuchen(item, ok);
      if (!ok) fehlerMerken(item);
      details.push({ item: L.items[i], wert: w === undefined ? '' : w, ok: ok });
    });
    var p = prozent(punkte, max);
    var erg = { art: L.art || '', datum: Date.now(), punkte: punkte, max: max, prozent: p, note: note(p), richtig: richtig, anzahl: items.length, dauer: Math.round((Math.min(Date.now(), L.ende) - L.start) / 1000), zeitAbgelaufen: !!zeitAbgelaufen };
    S.pruefungen.push(erg); if (S.pruefungen.length > 30) S.pruefungen.shift();
    S.letztePruefung = Object.assign({ details: details }, erg);
    S.pruefungLauf = null;
    speichern(); navZeichnen();
    if (aktuelleSeite !== 'pruefung') { toast('Die Prüfungszeit ist abgelaufen. Ergebnis unter „Prüfungssimulation“.'); return; }
    if (location.hash !== '#/pruefung?ergebnis=1') history.replaceState(null, '', '#/pruefung?ergebnis=1');
    zeigeAuswertung(S.letztePruefung);
  }
  function zeigeAuswertung(e) {
    var nachBereich = {};
    var details = (e.details || []).map(function (d) {
      var item = d.item.ref ? (frageById(d.item.ref) ? alsItem(frageById(d.item.ref)) : null) : rechenItem(d.item.aufgabe);
      if (!item) return null;
      var bn = item.quelle === 'frage' ? bereich(item.bereich).name : 'Fachrechnen (Rechenaufgaben)';
      var b = nachBereich[bn] = nachBereich[bn] || { p: 0, m: 0 };
      b.m += item.stufe; if (d.ok) b.p += item.stufe;
      return { item: item, wert: d.wert, ok: d.ok };
    }).filter(Boolean);
    var schwach = Object.keys(nachBereich).filter(function (k) { return prozent(nachBereich[k].p, nachBereich[k].m) < 67; });
    zeige('<h1>Auswertung der Prüfungssimulation</h1>' +
      (e.zeitAbgelaufen ? '<div class="hinweisbox warn">Die Zeit ist abgelaufen – die Prüfung wurde automatisch abgegeben.</div>' : '') +
      '<div class="raster"><div class="karte"><div class="leise">Punkte</div><div class="kennzahl">' + e.punkte + ' / ' + e.max + '</div>' + balken(e.prozent, e.prozent >= 50) + '</div>' +
      '<div class="karte"><div class="leise">Ergebnis</div><div class="kennzahl">' + e.prozent + ' %</div><p class="leise">Note (Orientierung): <strong>' + esc(e.note) + '</strong></p></div>' +
      '<div class="karte"><div class="leise">Richtige Aufgaben · Zeit</div><div class="kennzahl">' + e.richtig + ' / ' + e.anzahl + '</div><p class="leise">Bearbeitungszeit: ' + zeitText(e.dauer) + ' min</p></div></div>' +
      '<section class="karte"><h2>Ergebnis nach Bereichen</h2><table><thead><tr><th>Bereich</th><th>Punkte</th><th>Quote</th></tr></thead><tbody>' +
      Object.keys(nachBereich).map(function (k) { var b = nachBereich[k]; return '<tr><td>' + esc(k) + '</td><td>' + b.p + '/' + b.m + '</td><td>' + prozent(b.p, b.m) + ' %</td></tr>'; }).join('') + '</tbody></table>' +
      (schwach.length ? '<p style="margin-top:.75rem"><strong>Hier solltest du nacharbeiten:</strong> ' + schwach.map(esc).join(', ') + '.</p>' : '<p style="margin-top:.75rem">In allen Bereichen mindestens befriedigend – weiter so!</p>') +
      '<div class="zeile">' + (fehlerAnzahl() ? '<a class="knopf haupt" href="#/fehler?start=1">Falsche Aufgaben üben</a>' : '') + '<a class="knopf" href="#/pruefung">Neue Simulation</a></div></section>' +
      '<section class="karte"><h2>Alle Aufgaben mit Lösungen</h2><ul class="ergebnisliste">' + details.map(function (d, i) {
        return '<li><span class="' + (d.ok ? 'ok">✓' : 'nok">✗') + ' Aufgabe ' + (i + 1) + '</span> <span class="leise">(' + d.item.stufe + ' P.)</span><br>' + esc(itemFrage(d.item)) +
          '<br><span class="leise">Deine Antwort: ' + esc(antwortAnzeige(d.item, d.wert)) + '</span>' +
          (d.ok ? '' : '<br><strong>Richtig: ' + esc(richtigeAntwortText(d.item)) + '</strong>') +
          '<details><summary>Erklärung</summary>' + erklaerungHtml(d.item) + '</details></li>';
      }).join('') + '</ul></section>');
  }

  /* ================= Fehlertraining ================= */
  function seiteFehler(p) {
    if (p.get('start') && !sitzung) { starteFehler(); return; }
    if (sitzung && sitzung.art === 'fehler') { zeigeUebung(); return; }
    var items = fehlerItems();
    zeige('<h1>Fehlertraining</h1><p>Hier sammeln sich alle Aufgaben, die du falsch beantwortet hast – aus Quiz, Rechenübungen und Prüfungssimulation. Beantwortest du eine Aufgabe richtig, verschwindet sie aus der Liste.</p>' +
      (items.length ? '<div class="karte"><div class="kennzahl">' + items.length + ' offene Aufgabe' + (items.length === 1 ? '' : 'n') + '</div>' +
        '<div class="zeile" style="margin-top:.75rem"><button class="knopf haupt" data-action="fehler-start">Fehler jetzt üben</button><button class="knopf schlecht" data-action="fehler-leeren">Liste leeren</button></div></div>' +
        '<section class="karte"><h2>Übersicht</h2><ul class="ergebnisliste">' + items.map(function (it) {
          var e = S.fehler[fehlerSchluessel(it)];
          return '<li><span class="etikett">' + esc(itemEtikett(it)) + '</span> <span class="leise">· ' + e.anzahl + '× falsch</span><br>' + esc(itemFrage(it)) + '</li>';
        }).join('') + '</ul></section>'
        : '<div class="karte leer"><p>Keine offenen Fehler. 🎉 Mach ein Quiz oder eine Prüfungssimulation, um neue Schwachstellen zu finden.</p><a class="knopf" href="#/quiz">Zum Quiz</a></div>'));
  }
  function starteFehler() {
    var items = mische(fehlerItems());
    if (!items.length) { sitzung = null; gehe('#/fehler'); return; }
    sitzung = { art: 'fehler', items: items.slice(0, 20), i: 0, antworten: [], ergebnisse: [], titel: 'Fehlertraining', entfernt: 0 };
    zeigeUebung();
  }

  /* ================= Merkliste & Notizen ================= */
  var bearbeiteNotiz = null;
  function seiteMerkliste() {
    var karten = S.merkliste.map(karteById).filter(Boolean);
    var n = bearbeiteNotiz ? S.notizen.filter(function (x) { return x.id === bearbeiteNotiz; })[0] : null;
    zeige('<h1>Merkliste & Notizen</h1>' +
      '<section class="karte"><h2>' + (n ? 'Notiz bearbeiten' : 'Neue Notiz') + '</h2><form data-form="notiz-speichern">' +
      '<div class="feld"><label for="n-titel">Begriff oder Titel</label><input id="n-titel" type="text" maxlength="120" required value="' + esc(n ? n.titel : '') + '" placeholder="z. B. Planum"></div>' +
      '<div class="feld"><label for="n-text">Notiz</label><textarea id="n-text" maxlength="4000" placeholder="Was du dir merken willst – in deinen eigenen Worten.">' + esc(n ? n.text : '') + '</textarea></div>' +
      '<div class="zeile"><button class="knopf haupt" type="submit">' + (n ? 'Änderungen speichern' : 'Notiz speichern') + '</button>' + (n ? '<button class="knopf" type="button" data-action="notiz-abbrechen">Abbrechen</button>' : '') + '</div></form></section>' +
      '<section class="karte"><h2>Meine Notizen (' + S.notizen.length + ')</h2>' + (S.notizen.length ? S.notizen.slice().reverse().map(function (x) {
        return '<div class="notiz"><div class="zeile zwischen"><h3 style="margin:0">' + esc(x.titel) + '</h3><span class="leise">' + datumText(x.datum) + '</span></div>' +
          (x.text ? '<p class="notiz-text" style="margin:.4rem 0">' + esc(x.text) + '</p>' : '') +
          '<div class="zeile"><button class="knopf klein" data-action="notiz-bearbeiten" data-wert="' + esc(x.id) + '">Bearbeiten</button><button class="knopf klein schlecht" data-action="notiz-loeschen" data-wert="' + esc(x.id) + '">Löschen</button></div></div>';
      }).join('') : '<p class="leise">Noch keine Notizen.</p>') + '</section>' +
      '<section class="karte"><h2>Gemerkte Lernkarten (' + karten.length + ')</h2>' + (karten.length ?
        '<div class="zeile" style="margin-bottom:.5rem"><a class="knopf klein haupt" href="#/karten?start=1&nur=merk">Gemerkte Karten lernen</a></div>' +
        karten.map(function (k) {
          return '<div class="notiz"><span class="etikett">' + esc(bereich(k.bereich).name) + '</span><h3 style="margin:.4rem 0">' + esc(k.frage) + '</h3><p class="notiz-text">' + esc(k.antwort) + '</p>' +
            '<button class="knopf klein" data-action="merken" data-wert="' + k.id + '">Aus Merkliste entfernen</button></div>';
        }).join('') : '<p class="leise">Markiere Lernkarten mit „☆ Merken“, um sie hier zu sammeln.</p>') + '</section>');
  }

  /* ================= Einstellungen ================= */
  function seiteEinstellungen() {
    var e = S.einstellungen, aktiv = e.bereiche;
    zeige('<h1>Einstellungen</h1><p>Änderungen werden sofort gespeichert.</p>' +
      '<section class="karte"><h2>Lernbereiche</h2><p class="leise">Wähle, was du üben willst. Ohne Auswahl werden alle Bereiche genutzt.</p><div class="auswahl" role="group" aria-label="Lernbereiche">' +
      I.bereiche.map(function (b) { return '<label class="check"><input type="checkbox" data-einst="bereich" value="' + b.id + '"' + (aktiv.indexOf(b.id) >= 0 ? ' checked' : '') + '>' + esc(b.name) + '</label>'; }).join('') +
      '</div><div class="zeile" style="margin-top:.75rem"><button class="knopf klein" data-action="bereiche-alle">Alle auswählen</button><button class="knopf klein" data-action="bereiche-keine">Auswahl aufheben</button></div></section>' +
      '<section class="karte"><h2>Lernen</h2>' +
      '<div class="feld"><label for="e-stufe">Schwierigkeitsgrad</label><select id="e-stufe" data-einst="stufe">' +
      [['alle', 'Gemischt'], ['1', 'Leicht'], ['2', 'Mittel'], ['3', 'Schwer']].map(function (o) { return '<option value="' + o[0] + '"' + (String(e.stufe) === o[0] ? ' selected' : '') + '>' + o[1] + '</option>'; }).join('') + '</select></div>' +
      '<div class="feld"><label for="e-zeit">Verfügbare Lernzeit pro Tag</label><select id="e-zeit" data-einst="lernzeit">' +
      [10, 15, 20, 30, 45, 60, 90].map(function (n) { return '<option value="' + n + '"' + (Number(e.lernzeit) === n ? ' selected' : '') + '>' + n + ' Minuten</option>'; }).join('') + '</select>' +
      '<p class="leise" style="margin-top:.3rem">Bestimmt die Größe deines Tagesplans (Karten, Quizfragen, Rechenaufgaben).</p></div>' +
      '<div class="feld"><label for="e-datum">Termin der Zwischenprüfung (optional)</label><input id="e-datum" type="date" data-einst="pruefungsdatum" value="' + esc(e.pruefungsdatum) + '"></div></section>' +
      '<section class="karte"><h2>Darstellung</h2>' +
      '<div class="feld"><label for="e-design">Farbschema</label><select id="e-design" data-einst="darstellung">' + [['system', 'Wie das Gerät'], ['light', 'Hell'], ['dark', 'Dunkel']].map(function (o) { return '<option value="' + o[0] + '"' + (e.darstellung === o[0] ? ' selected' : '') + '>' + o[1] + '</option>'; }).join('') + '</select></div>' +
      '<div class="feld"><label for="e-schrift">Schriftgröße</label><select id="e-schrift" data-einst="schrift">' + [['normal', 'Normal'], ['gross', 'Groß']].map(function (o) { return '<option value="' + o[0] + '"' + (e.schrift === o[0] ? ' selected' : '') + '>' + o[1] + '</option>'; }).join('') + '</select></div></section>' +
      '<section class="karte"><h2>Daten sichern</h2><p class="leise">Dein Fortschritt wird nur in diesem Browser auf diesem Gerät gespeichert. Mit einer Sicherungsdatei kannst du ihn auf ein anderes Gerät übertragen.</p>' +
      '<div class="zeile"><button class="knopf" data-action="export">Sicherung herunterladen</button><input id="import-datei" type="file" accept="application/json,.json" class="versteckt"><label class="knopf" for="import-datei" style="margin:0">Sicherung laden</label></div></section>' +
      '<section class="karte"><h2>Zurücksetzen</h2><p class="leise">„Lernfortschritt zurücksetzen“ löscht Karten-Status, Antworten, Fehlerliste, Rechenstatistik, Prüfungsergebnisse und Lernzeit. Notizen, Merkliste und Einstellungen bleiben.</p>' +
      '<div class="zeile"><button class="knopf schlecht" data-action="reset-fortschritt">Lernfortschritt zurücksetzen</button><button class="knopf schlecht" data-action="reset-alles">Alles löschen</button></div></section>' +
      '<section class="karte"><h2>Über diese App</h2><p class="leise">Inhalt: ' + I.bereiche.length + ' Lernbereiche, ' + I.karten.length + ' Lernkarten, ' + I.fragen.length + ' Quizfragen und unbegrenzt erzeugte Rechenaufgaben in ' + R.THEMEN.length + ' Themen. Allgemeines Übungsmaterial – keine offizielle Prüfungsaufgabensammlung. Normen und Regelwerke ändern sich; im Zweifel gilt, was in deiner Berufsschule und deinem Betrieb gelehrt wird.</p></section>');
  }
  function darstellungAnwenden() {
    var r = document.documentElement, e = S.einstellungen;
    if (e.darstellung === 'light' || e.darstellung === 'dark') r.setAttribute('data-theme', e.darstellung); else r.removeAttribute('data-theme');
    if (e.schrift === 'gross') r.setAttribute('data-groesse', 'gross'); else r.removeAttribute('data-groesse');
  }

  /* ================= Ereignisse ================= */
  var AKTIONEN = {
    'karten-start': function () { var b = document.getElementById('k-bereich').value, nur = document.getElementById('k-nur').value; starteKarten(b, nur); },
    'karten-neu': function () { sitzung = null; starteKarten(letzteKartenWahl.bid, letzteKartenWahl.nur); },
    'karten-ende': function () { sitzung = null; gehe('#/karten'); },
    'karte-drehen': function () { sitzung.offen = !sitzung.offen; zeigeKarte(); },
    'karte-bewerten': function (el) {
      var k = sitzung.liste[sitzung.i], w = el.dataset.wert;
      S.karten[k.id] = { status: w, datum: Date.now() };
      if (w === 'kann') sitzung.kann++; else sitzung.ueben++;
      speichern(); sitzung.i++; sitzung.offen = false; zeigeKarte();
    },
    'merken': function (el) {
      var id = el.dataset.wert, i = S.merkliste.indexOf(id);
      if (i >= 0) { S.merkliste.splice(i, 1); toast('Aus der Merkliste entfernt'); } else { S.merkliste.push(id); toast('Zur Merkliste hinzugefügt'); }
      speichern();
      if (aktuelleSeite === 'merkliste') seiteMerkliste(); else zeigeKarte();
    },
    'quiz-start': function () { starteQuiz(document.getElementById('q-bereich').value, document.getElementById('q-typ').value, Number(document.getElementById('q-anzahl').value)); },
    'quiz-neu': function () { sitzung = null; gehe('#/quiz'); },
    'uebung-antwort': function (el) { uebungAntworten(el.dataset.wert); },
    'uebung-loesung': function () {
      var s = sitzung, item = s.items[s.i];
      s.antworten[s.i] = ''; s.ergebnisse[s.i] = false; statistikBuchen(item, false); fehlerMerken(item); speichern(); navZeichnen(); zeigeUebung();
    },
    'uebung-weiter': function () { sitzung.i++; zeigeUebung(); },
    'uebung-ende': function () {
      if (!sitzung) return;
      sitzung.items = sitzung.items.slice(0, sitzung.ergebnisse.length);
      if (!sitzung.items.length) { var z = sitzung.art === 'fehler' ? '#/fehler' : '#/quiz'; sitzung = null; gehe(z); return; }
      zeigeUebungsEnde();
    },
    'rechnen-start': function () { gehe('#/rechnen?thema=' + document.getElementById('r-thema').value); },
    'rechnen-loesung': function () {
      var s = sitzung; s.wert = ''; s.ergebnis = false; s.gesamt++;
      var item = rechenItem(s.aufgabe); statistikBuchen(item, false); fehlerMerken(item); speichern(); navZeichnen(); zeigeRechnen();
    },
    'rechnen-weiter': function () { var s = sitzung; s.aufgabe = R.erzeuge(s.thema, stufeZahl()); s.wert = ''; s.ergebnis = undefined; zeigeRechnen(); },
    'rechnen-ende': function () { sitzung = null; gehe('#/rechnen'); },
    'pruefung-start': startePruefung,
    'pruefung-antwort': function (el) { S.pruefungLauf.antworten[S.pruefungLauf.i] = el.dataset.wert; speichern(); zeigePruefung(); },
    'pruefung-gehe': function (el) { pruefungSpeichereEingabe(); var i = Number(el.dataset.wert); if (i >= 0) S.pruefungLauf.i = i; speichern(); zeigePruefung(); },
    'pruefung-abgeben': function () {
      pruefungSpeichereEingabe();
      var L = S.pruefungLauf, offen = L.items.length - L.antworten.filter(hatAntwort).length;
      if (confirm(offen ? 'Noch ' + offen + ' Aufgabe(n) ohne Antwort. Trotzdem abgeben?' : 'Prüfung jetzt abgeben?')) pruefungAbgeben(false);
    },
    'fehler-start': starteFehler,
    'fehler-neu': function () { sitzung = null; starteFehler(); },
    'fehler-leeren': function () { if (confirm('Wirklich alle ' + fehlerAnzahl() + ' Aufgaben aus der Fehlerliste entfernen?')) { S.fehler = {}; speichern(); navZeichnen(); seiteFehler(new URLSearchParams()); toast('Fehlerliste geleert'); } },
    'notiz-bearbeiten': function (el) { bearbeiteNotiz = el.dataset.wert; seiteMerkliste(); document.getElementById('n-titel').focus(); },
    'notiz-abbrechen': function () { bearbeiteNotiz = null; seiteMerkliste(); },
    'notiz-loeschen': function (el) {
      var n = S.notizen.filter(function (x) { return x.id === el.dataset.wert; })[0];
      if (n && confirm('Notiz „' + n.titel + '“ löschen?')) { S.notizen = S.notizen.filter(function (x) { return x !== n; }); if (bearbeiteNotiz === n.id) bearbeiteNotiz = null; speichern(); seiteMerkliste(); toast('Notiz gelöscht'); }
    },
    'bereiche-alle': function () { S.einstellungen.bereiche = I.bereiche.map(function (b) { return b.id; }); speichern(); seiteEinstellungen(); toast('Alle Bereiche ausgewählt'); },
    'bereiche-keine': function () { S.einstellungen.bereiche = []; speichern(); seiteEinstellungen(); toast('Auswahl aufgehoben – alle Bereiche werden genutzt'); },
    'export': function () {
      var blob = new Blob([JSON.stringify(S, null, 1)], { type: 'application/json' });
      var a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'strassenbau-trainer-sicherung-' + heute() + '.json';
      document.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500);
    },
    'reset-fortschritt': function () {
      if (!confirm('Lernfortschritt wirklich zurücksetzen? Das kann nicht rückgängig gemacht werden.')) return;
      var d = standard(); ['karten', 'fragen', 'rechnen', 'fehler', 'pruefungen', 'letztePruefung', 'pruefungLauf', 'zeit'].forEach(function (k) { S[k] = d[k]; });
      sitzung = null; speichern(); navZeichnen(); toast('Lernfortschritt zurückgesetzt');
    },
    'reset-alles': function () {
      if (!confirm('Wirklich ALLES löschen – Fortschritt, Notizen, Merkliste und Einstellungen?')) return;
      S = standard(); sitzung = null; speichern(); darstellungAnwenden(); navZeichnen(); seiteEinstellungen(); toast('Alle Daten gelöscht');
    }
  };

  // Links auf die aktuelle Adresse lösen kein hashchange aus -> selbst neu zeichnen
  document.addEventListener('click', function (ev) {
    var a = ev.target.closest('a[href^="#/"]');
    if (a && !a.dataset.action && a.getAttribute('href') === location.hash) { ev.preventDefault(); sitzung = null; route(); }
  });
  app.addEventListener('click', function (ev) {
    var el = ev.target.closest('[data-action]');
    if (!el || el.disabled) return;
    var fn = AKTIONEN[el.dataset.action];
    if (!fn) return;
    if (el.tagName === 'A') ev.preventDefault();
    merkeAktivitaet();
    fn(el);
  });
  app.addEventListener('submit', function (ev) {
    var f = ev.target; ev.preventDefault(); merkeAktivitaet();
    var art = f.dataset.form, inp = document.getElementById('antwort');
    if (art === 'uebung-antwort') uebungAntworten(inp.value.trim());
    else if (art === 'rechnen-antwort') {
      var s = sitzung, ok = R.pruefe(s.aufgabe, inp.value);
      if (ok === null) { toast('Bitte eine Zahl eingeben, z. B. 12,5'); inp.focus(); return; }
      s.wert = inp.value.trim(); s.ergebnis = ok; s.gesamt++; if (ok) s.richtig++;
      var item = rechenItem(s.aufgabe); statistikBuchen(item, ok); if (!ok) fehlerMerken(item);
      speichern(); navZeichnen(); ansage(ok ? 'Richtig' : 'Nicht richtig'); zeigeRechnen();
    } else if (art === 'pruefung-antwort') {
      S.pruefungLauf.antworten[S.pruefungLauf.i] = inp.value.trim(); speichern();
      var naechste = S.pruefungLauf.i + 1 < S.pruefungLauf.items.length;
      if (naechste) S.pruefungLauf.i++;
      toast('Antwort gespeichert'); zeigePruefung();
    } else if (art === 'notiz-speichern') {
      var t = document.getElementById('n-titel').value.trim(), x = document.getElementById('n-text').value.trim();
      if (!t) { toast('Bitte einen Titel eingeben'); return; }
      if (bearbeiteNotiz) { var n = S.notizen.filter(function (y) { return y.id === bearbeiteNotiz; })[0]; if (n) { n.titel = t; n.text = x; n.datum = Date.now(); } bearbeiteNotiz = null; toast('Notiz aktualisiert'); }
      else { S.notizen.push({ id: 'n' + Date.now().toString(36), titel: t, text: x, datum: Date.now() }); toast('Notiz gespeichert'); }
      speichern(); seiteMerkliste();
    }
  });
  var eingabeTimer = null;
  app.addEventListener('input', function (ev) {
    if (ev.target.id === 'antwort' && aktuelleSeite === 'pruefung' && S.pruefungLauf) {
      S.pruefungLauf.antworten[S.pruefungLauf.i] = ev.target.value.trim();
      clearTimeout(eingabeTimer); eingabeTimer = setTimeout(speichern, 400);
    }
  });
  app.addEventListener('change', function (ev) {
    var el = ev.target;
    if (el.id === 'import-datei' && el.files && el.files[0]) {
      var r = new FileReader();
      r.onload = function () {
        try {
          var d = JSON.parse(r.result);
          if (!d || typeof d !== 'object' || !d.einstellungen) throw new Error('ungültig');
          if (!confirm('Sicherung laden? Dein aktueller Stand in diesem Browser wird ersetzt.')) return;
          S = bereinige(d); sitzung = null; speichern(); darstellungAnwenden(); navZeichnen(); seiteEinstellungen(); toast('Sicherung geladen');
        } catch (e) { toast('Die Datei ist keine gültige Sicherung.'); }
      };
      r.readAsText(el.files[0]); return;
    }
    if (el.id === 'p-art') {
      var A2 = PRUEF_ARTEN[el.value]; S.einstellungen.pruefungArt = el.value;
      S.einstellungen.pruefungMinuten = A2.minuten; S.einstellungen.pruefungAnzahl = A2.anzahl;
      speichern(); seitePruefung(new URLSearchParams()); document.getElementById('p-art').focus(); return;
    }
    var k = el.dataset.einst; if (!k) return;
    if (k === 'bereich') {
      S.einstellungen.bereiche = Array.prototype.slice.call(app.querySelectorAll('[data-einst="bereich"]:checked')).map(function (x) { return x.value; });
    } else S.einstellungen[k] = el.value;
    speichern(); darstellungAnwenden(); navZeichnen(); toast('Gespeichert');
  });
  document.addEventListener('keydown', function (ev) {
    if (sitzung && sitzung.art === 'karten' && !/INPUT|TEXTAREA|SELECT|BUTTON|^A$|SUMMARY|LABEL/.test(document.activeElement.tagName)) {
      if (ev.key === ' ' || ev.key === 'Enter') { ev.preventDefault(); AKTIONEN['karte-drehen'](); }
    }
  });

  /* ================= Lernzeit messen ================= */
  var letzteAktivitaet = 0;
  function merkeAktivitaet() { letzteAktivitaet = Date.now(); }
  ['keydown', 'pointerdown', 'input'].forEach(function (t) { document.addEventListener(t, merkeAktivitaet, { passive: true }); });
  setInterval(function () {
    var uebt = ['karten', 'quiz', 'rechnen', 'pruefung', 'fehler', 'merkliste'].indexOf(aktuelleSeite) >= 0;
    if (document.visibilityState === 'visible' && uebt && Date.now() - letzteAktivitaet < 120000) {
      var t = heute(); S.zeit[t] = (S.zeit[t] || 0) + 15;
      // nur die letzten 60 Tage behalten
      var tage = Object.keys(S.zeit).sort(); while (tage.length > 60) delete S.zeit[tage.shift()];
      speichern();
    }
  }, 15000);

  window.addEventListener('hashchange', route);
  document.querySelector('.sprunglink').addEventListener('click', function (ev) { ev.preventDefault(); app.focus(); });
  darstellungAnwenden();
  if (!I.fragen.length || !R) { app.innerHTML = '<p style="padding:1rem">Die Lerninhalte konnten nicht geladen werden. Bitte alle Dateien der App im selben Ordner lassen und die Seite neu laden.</p>'; return; }
  if (!/^#\//.test(location.hash)) history.replaceState(null, '', '#/start');
  route();
  if (S.pruefungLauf) starteUhr();
})();
