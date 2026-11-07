/* Straßenbau-Trainer – Rechenaufgaben mit Zufallswerten und Lösungsweg.
   Jede Aufgabe: { thema, frage, einheit, loesung, nk (Nachkommastellen), toleranz, weg: [Schritte] } */
(function () {
  'use strict';

  function zufall(min, max, schritt) {
    schritt = schritt || 1;
    var anzahl = Math.round((max - min) / schritt);
    return runde(min + Math.floor(Math.random() * (anzahl + 1)) * schritt, 6);
  }
  function wahl(liste) { return liste[Math.floor(Math.random() * liste.length)]; }
  function runde(x, nk) { var f = Math.pow(10, nk); return Math.round((x + Number.EPSILON) * f) / f; }
  function aufrunden(x) { return Math.ceil(runde(x, 6)); }

  // Deutsche Zahl: 1234.5 -> "1.234,50" (nk Nachkommastellen, Tausenderpunkt optional)
  function zahl(x, nk) {
    if (nk === undefined) nk = 2;
    var s = runde(x, nk).toFixed(nk);
    var teile = s.split('.');
    var ganz = teile[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return teile[1] ? ganz + ',' + teile[1] : ganz;
  }
  // Zahl ohne unnötige Nullen (für Angaben in Aufgabentexten)
  function z(x) {
    var s = String(runde(x, 6));
    var teile = s.split('.');
    var ganz = teile[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return teile[1] ? ganz + ',' + teile[1] : ganz;
  }

  function aufgabe(thema, frage, einheit, loesung, nk, weg, opt) {
    opt = opt || {};
    var l = runde(loesung, nk);
    var tol = opt.toleranz !== undefined ? opt.toleranz
      : Math.max(0.5 * Math.pow(10, -nk), Math.abs(l) * 0.005);
    return { thema: thema, frage: frage, einheit: einheit, loesung: l, nk: nk, toleranz: tol, weg: weg, hinweis: opt.hinweis || '', tausender: !!opt.tausender };
  }

  // Werte je Stufe: 1 = ganze Zahlen, 2/3 = Dezimalzahlen
  function laenge(stufe, min, max) { return stufe === 1 ? zufall(min, max, 1) : zufall(min, max, 0.1); }

  /* ---------- Flächen ---------- */
  function flaeche(stufe) {
    var art = stufe === 1 ? wahl(['rechteck', 'rechteck', 'trapez']) :
      stufe === 2 ? wahl(['rechteck', 'trapez', 'kreis', 'dreieck']) :
      wahl(['lform', 'baumscheibe', 'trapez', 'kreis']);
    var l, b, a, c, h, d, A;
    if (art === 'rechteck') {
      l = laenge(stufe, 8, 25); b = laenge(stufe, 3, 9); A = l * b;
      return aufgabe('flaeche', 'Eine rechteckige Hoffläche soll gepflastert werden. Sie ist ' + z(l) + ' m lang und ' + z(b) + ' m breit. Berechne die Fläche in m².', 'm²', A, 2, [
        'Formel Rechteck: A = l · b',
        'A = ' + z(l) + ' m · ' + z(b) + ' m',
        'A = ' + zahl(A) + ' m²']);
    }
    if (art === 'trapez') {
      a = laenge(stufe, 10, 20); c = runde(a - laenge(stufe, 2, 6), 1); h = laenge(stufe, 4, 9);
      A = (a + c) / 2 * h;
      return aufgabe('flaeche', 'Eine Grundstückseinfahrt hat die Form eines Trapezes: Die parallelen Seiten sind ' + z(a) + ' m und ' + z(c) + ' m lang, der Abstand zwischen ihnen beträgt ' + z(h) + ' m. Berechne die Fläche in m².', 'm²', A, 2, [
        'Formel Trapez: A = (a + c) : 2 · h',
        'A = (' + z(a) + ' m + ' + z(c) + ' m) : 2 · ' + z(h) + ' m',
        'A = ' + zahl((a + c) / 2) + ' m · ' + z(h) + ' m',
        'A = ' + zahl(A) + ' m²']);
    }
    if (art === 'dreieck') {
      a = laenge(stufe, 6, 15); h = laenge(stufe, 3, 8); A = a * h / 2;
      return aufgabe('flaeche', 'Eine dreieckige Restfläche an einer Kreuzung wird gepflastert. Grundseite g = ' + z(a) + ' m, Höhe h = ' + z(h) + ' m. Berechne die Fläche in m².', 'm²', A, 2, [
        'Formel Dreieck: A = g · h : 2',
        'A = ' + z(a) + ' m · ' + z(h) + ' m : 2',
        'A = ' + zahl(A) + ' m²']);
    }
    if (art === 'kreis') {
      d = stufe === 2 ? zufall(2, 8, 0.5) : zufall(2, 10, 0.1); A = Math.PI * d * d / 4;
      return aufgabe('flaeche', 'Ein kreisrunder Platz (Rondell) hat einen Durchmesser von ' + z(d) + ' m. Berechne die Fläche in m².', 'm²', A, 2, [
        'Formel Kreis: A = π · d² : 4 (oder A = π · r²)',
        'A = 3,1416 · (' + z(d) + ' m)² : 4',
        'A = 3,1416 · ' + zahl(d * d) + ' m² : 4',
        'A ≈ ' + zahl(A) + ' m²'], { hinweis: 'Rechne mit π ≈ 3,14 oder der π-Taste. Kleine Rundungsunterschiede werden akzeptiert.' });
    }
    if (art === 'lform') {
      var l1 = laenge(stufe, 10, 20), b1 = laenge(stufe, 3, 6), l2 = laenge(stufe, 4, 8), b2 = laenge(stufe, 3, 6);
      A = l1 * b1 + l2 * b2;
      return aufgabe('flaeche', 'Eine L-förmige Pflasterfläche wird in zwei Rechtecke zerlegt: Rechteck 1 ist ' + z(l1) + ' m × ' + z(b1) + ' m, Rechteck 2 ist ' + z(l2) + ' m × ' + z(b2) + ' m. Berechne die Gesamtfläche in m².', 'm²', A, 2, [
        'Zusammengesetzte Fläche: in einfache Teilflächen zerlegen und addieren',
        'A1 = ' + z(l1) + ' m · ' + z(b1) + ' m = ' + zahl(l1 * b1) + ' m²',
        'A2 = ' + z(l2) + ' m · ' + z(b2) + ' m = ' + zahl(l2 * b2) + ' m²',
        'A = A1 + A2 = ' + zahl(l1 * b1) + ' m² + ' + zahl(l2 * b2) + ' m² = ' + zahl(A) + ' m²']);
    }
    // Baumscheibe aussparen
    l = laenge(stufe, 10, 20); b = laenge(stufe, 5, 10); d = zufall(1.2, 2.4, 0.2);
    var Ak = Math.PI * d * d / 4; A = l * b - Ak;
    return aufgabe('flaeche', 'Ein Platz von ' + z(l) + ' m × ' + z(b) + ' m wird gepflastert. In der Mitte bleibt eine runde Baumscheibe mit ' + z(d) + ' m Durchmesser frei. Wie groß ist die zu pflasternde Fläche in m²?', 'm²', A, 2, [
      'Gesamtfläche minus Aussparung',
      'A Rechteck = ' + z(l) + ' m · ' + z(b) + ' m = ' + zahl(l * b) + ' m²',
      'A Baumscheibe = π · d² : 4 = 3,1416 · (' + z(d) + ' m)² : 4 ≈ ' + zahl(Ak) + ' m²',
      'A = ' + zahl(l * b) + ' m² − ' + zahl(Ak) + ' m² ≈ ' + zahl(A) + ' m²'], { hinweis: 'Rechne mit π ≈ 3,14 oder der π-Taste.' });
  }

  /* ---------- Volumen ---------- */
  function volumen(stufe) {
    var art = stufe === 1 ? wahl(['graben', 'schicht']) :
      stufe === 2 ? wahl(['graben', 'schicht', 'schicht']) :
      wahl(['auflockerung', 'boeschung', 'schicht']);
    var L, B, T, V, d, A;
    if (art === 'graben') {
      L = stufe === 1 ? zufall(10, 40, 1) : zufall(10, 40, 0.5); B = zufall(0.6, 1.2, 0.1); T = zufall(0.8, 1.2, 0.1);
      V = L * B * T;
      return aufgabe('volumen', 'Ein Leitungsgraben mit senkrechten Wänden ist ' + z(L) + ' m lang, ' + z(B) + ' m breit und ' + z(T) + ' m tief. Wie viel m³ Boden werden ausgehoben (festes Volumen)?', 'm³', V, 2, [
        'Formel Quader: V = l · b · h',
        'V = ' + z(L) + ' m · ' + z(B) + ' m · ' + z(T) + ' m',
        'V = ' + zahl(V) + ' m³'], { hinweis: 'Gräben ab 1,25 m Tiefe müssen gesichert oder geböscht werden (DIN 4124).' });
    }
    if (art === 'schicht') {
      L = laenge(stufe, 15, 60); B = laenge(stufe, 3, 8); d = wahl([3, 4, 5, 15, 20, 25, 30]);
      A = L * B; V = A * d / 100;
      var was = d <= 5 ? 'Bettungsmaterial (Splitt)' : 'Frostschutzmaterial';
      return aufgabe('volumen', 'Eine Fläche von ' + z(L) + ' m × ' + z(B) + ' m erhält eine ' + d + ' cm dicke Schicht ' + was + ' (verdichtete Dicke). Wie viel m³ werden eingebaut?', 'm³', V, 2, [
        'Dicke in Meter umrechnen: ' + d + ' cm = ' + zahl(d / 100) + ' m',
        'Fläche: A = ' + z(L) + ' m · ' + z(B) + ' m = ' + zahl(A) + ' m²',
        'Volumen: V = A · d = ' + zahl(A) + ' m² · ' + zahl(d / 100) + ' m',
        'V = ' + zahl(V) + ' m³']);
    }
    if (art === 'auflockerung') {
      L = zufall(12, 40, 0.5); B = zufall(0.8, 1.2, 0.1); T = zufall(0.8, 1.2, 0.1); var f = wahl([1.15, 1.2, 1.25, 1.3]);
      V = L * B * T;
      return aufgabe('volumen', 'Aus einer Baugrube (' + z(L) + ' m × ' + z(B) + ' m × ' + z(T) + ' m) wird Boden ausgehoben. Der Auflockerungsfaktor beträgt ' + z(f) + '. Wie viel m³ lose Masse müssen abgefahren werden?', 'm³', V * f, 2, [
        'Festes Volumen: V fest = ' + z(L) + ' m · ' + z(B) + ' m · ' + z(T) + ' m = ' + zahl(V) + ' m³',
        'Ausgehobener Boden lockert sich auf und braucht mehr Platz.',
        'V lose = V fest · Auflockerungsfaktor = ' + zahl(V) + ' m³ · ' + z(f),
        'V lose = ' + zahl(V * f) + ' m³'], { hinweis: 'Rechne mit dem auf 2 Stellen gerundeten Zwischenergebnis oder ungerundet – beides wird akzeptiert.' });
    }
    // Graben mit Böschung 1:1 (45°), trapezförmiger Querschnitt
    var b = zufall(0.6, 1.0, 0.1); T = zufall(1.4, 2.0, 0.1); L = zufall(10, 30, 1);
    var oben = b + 2 * T; A = (b + oben) / 2 * T; V = A * L;
    return aufgabe('volumen', 'Ein Graben wird mit Böschungen 1 : 1 (45°) ausgehoben. Sohlbreite ' + z(b) + ' m, Tiefe ' + z(T) + ' m, Länge ' + z(L) + ' m. Berechne das Aushubvolumen in m³.', 'm³', V, 2, [
      'Bei Neigung 1 : 1 ist die waagerechte Breite einer Böschung gleich der Tiefe: ' + z(T) + ' m',
      'Breite oben = ' + z(b) + ' m + 2 · ' + z(T) + ' m = ' + zahl(oben) + ' m',
      'Querschnitt (Trapez): A = (' + z(b) + ' m + ' + zahl(oben) + ' m) : 2 · ' + z(T) + ' m = ' + zahl(A) + ' m²',
      'V = A · l = ' + zahl(A) + ' m² · ' + z(L) + ' m = ' + zahl(V) + ' m³']);
  }

  /* ---------- Gefälle & Neigung ---------- */
  function gefaelle(stufe) {
    var art = stufe === 1 ? wahl(['prozent', 'hoehe']) :
      stufe === 2 ? wahl(['prozent', 'hoehe', 'endhoehe', 'verhaeltnis']) :
      wahl(['endhoehe', 'quer', 'laenge', 'verhaeltnis']);
    var p = wahl([0.5, 1, 1.5, 2, 2.5, 3, 4, 5]), L, dh, H;
    if (art === 'prozent') {
      L = stufe === 1 ? wahl([10, 20, 25, 40, 50]) : zufall(10, 50, 1);
      dh = runde(L * p / 100, 4);
      return aufgabe('gefaelle', 'Eine Rinne ist ' + z(L) + ' m lang. Der Höhenunterschied zwischen Anfang und Ende beträgt ' + z(runde(dh * 100, 2)) + ' cm. Wie groß ist das Gefälle in %?', '%', p, 2, [
        'Formel: Gefälle p = Höhenunterschied : Länge · 100 %',
        'Einheiten gleich machen: ' + z(runde(dh * 100, 2)) + ' cm = ' + z(dh) + ' m',
        'p = ' + z(dh) + ' m : ' + z(L) + ' m · 100 %',
        'p = ' + zahl(p) + ' %']);
    }
    if (art === 'hoehe') {
      L = stufe === 1 ? wahl([10, 20, 30, 40, 50]) : zufall(8, 45, 0.5);
      dh = L * p / 100;
      return aufgabe('gefaelle', 'Eine Fläche soll auf ' + z(L) + ' m Länge ein Gefälle von ' + z(p) + ' % erhalten. Wie groß ist der Höhenunterschied in cm?', 'cm', dh * 100, 1, [
        'Formel: Höhenunterschied Δh = Länge · p : 100',
        'Δh = ' + z(L) + ' m · ' + z(p) + ' : 100',
        'Δh = ' + zahl(dh, 3) + ' m',
        'In cm: ' + zahl(dh, 3) + ' m · 100 = ' + zahl(dh * 100, 1) + ' cm']);
    }
    if (art === 'endhoehe') {
      H = zufall(98, 140, 0.005); L = zufall(15, 60, 0.5); dh = runde(L * p / 100, 3);
      return aufgabe('gefaelle', 'Ein Kanal beginnt mit der Sohlhöhe ' + zahl(H, 3) + ' m ü. NHN und fällt auf ' + z(L) + ' m Länge mit ' + z(p) + ' % Gefälle. Welche Sohlhöhe hat er am Ende (in m ü. NHN)?', 'm', H - dh, 3, [
        'Höhenunterschied: Δh = ' + z(L) + ' m · ' + z(p) + ' : 100 = ' + zahl(dh, 3) + ' m',
        'Der Kanal fällt, also abziehen:',
        'H Ende = ' + zahl(H, 3) + ' m − ' + zahl(dh, 3) + ' m',
        'H Ende = ' + zahl(H - dh, 3) + ' m ü. NHN'], { toleranz: 0.002 });
    }
    if (art === 'verhaeltnis') {
      var n = wahl([20, 25, 40, 50, 100, 200]);
      return aufgabe('gefaelle', 'Auf einem Plan ist ein Gefälle von 1 : ' + n + ' angegeben. Wie viel Prozent sind das?', '%', 100 / n, 2, [
        '1 : ' + n + ' bedeutet: 1 m Höhenunterschied auf ' + n + ' m Länge',
        'p = 1 : ' + n + ' · 100 %',
        'p = ' + zahl(100 / n) + ' %']);
    }
    if (art === 'quer') {
      var b = zufall(1.5, 3.5, 0.25); p = wahl([2, 2.5, 3]);
      dh = b * p / 100;
      return aufgabe('gefaelle', 'Ein Gehweg ist ' + zahl(b) + ' m breit und erhält eine Querneigung von ' + z(p) + ' % zur Fahrbahn. Um wie viel cm liegt die Hinterkante höher als die Vorderkante?', 'cm', dh * 100, 1, [
        'Δh = Breite · p : 100',
        'Δh = ' + zahl(b) + ' m · ' + z(p) + ' : 100 = ' + zahl(dh, 4) + ' m',
        'In cm: ' + zahl(dh * 100, 2) + ' cm ≈ ' + zahl(dh * 100, 1) + ' cm']);
    }
    // Länge aus Höhe und Gefälle
    dh = zufall(0.1, 0.6, 0.05); p = wahl([1, 2, 2.5, 4, 5]); L = dh / (p / 100);
    return aufgabe('gefaelle', 'Zwischen zwei Punkten besteht ein Höhenunterschied von ' + z(runde(dh * 100, 2)) + ' cm. Das Gefälle soll ' + z(p) + ' % betragen. Wie lang muss die Strecke in m sein?', 'm', L, 2, [
      'Formel umstellen: Länge = Δh : p · 100',
      'Δh in m: ' + z(runde(dh * 100, 2)) + ' cm = ' + z(dh) + ' m',
      'L = ' + z(dh) + ' m : ' + z(p) + ' · 100',
      'L = ' + zahl(L) + ' m']);
  }

  /* ---------- Baustoffmengen & Kosten ---------- */
  function mengen(stufe) {
    var art = stufe === 1 ? wahl(['bord', 'tonnen', 'kosten', 'pflaster']) :
      stufe === 2 ? wahl(['pflaster', 'bord', 'tonnen', 'kosten']) :
      wahl(['pflasterverschnitt', 'fuhren', 'kostenmwst', 'bordbeton']);
    var A, n, L, V, rho, preis;
    if (art === 'pflaster' || art === 'pflasterverschnitt') {
      var stein = wahl([{ m: '20 × 10 cm', n: 50 }, { m: '20 × 20 cm', n: 25 }, { m: '16 × 24 cm', n: 26 }, { m: '30 × 20 cm', n: 16.67 }]);
      A = stufe === 1 ? zufall(20, 80, 1) : zufall(20, 120, 0.5);
      if (art === 'pflaster') {
        var exakt = A * stein.n, st = aufrunden(exakt);
        return aufgabe('mengen', 'Eine Fläche von ' + z(A) + ' m² wird mit Rechteckpflaster ' + stein.m + ' belegt. Laut Hersteller braucht man ' + z(stein.n) + ' Steine pro m². Wie viele Steine werden benötigt? (auf ganze Steine aufrunden)', 'Stück', st, 0, [
          'Steine = Fläche · Steine pro m²',
          'Steine = ' + z(A) + ' m² · ' + z(stein.n) + ' Stück/m² = ' + z(runde(exakt, 2)) + ' Stück',
          'Aufrunden: ' + st + ' Stück'], { toleranz: 0 });
      }
      var v = wahl([3, 5, 8]), mit = A * stein.n * (1 + v / 100), st2 = aufrunden(mit);
      return aufgabe('mengen', 'Für ' + z(A) + ' m² Pflaster (' + stein.m + ', ' + z(stein.n) + ' Steine/m²) sollen ' + v + ' % Verschnitt eingerechnet werden. Wie viele Steine müssen bestellt werden? (aufrunden)', 'Stück', st2, 0, [
        'Grundbedarf: ' + z(A) + ' m² · ' + z(stein.n) + ' Stück/m² = ' + z(runde(A * stein.n, 2)) + ' Stück',
        'Mit Verschnitt: Grundbedarf · (1 + ' + v + ' : 100) = ' + z(runde(A * stein.n, 2)) + ' · ' + z(1 + v / 100),
        '= ' + z(runde(mit, 2)) + ' Stück → aufgerundet ' + st2 + ' Stück'], { toleranz: 1 });
    }
    if (art === 'bord') {
      var sl = wahl([1, 0.5]); L = stufe === 1 ? zufall(12, 60, 1) : zufall(12, 80, 0.5);
      n = aufrunden(L / sl);
      return aufgabe('mengen', 'Entlang eines Weges werden auf ' + z(L) + ' m Länge Bordsteine gesetzt. Ein Bordstein ist ' + z(sl * 100) + ' cm lang. Wie viele Bordsteine werden benötigt? (Fugen vernachlässigen, aufrunden)', 'Stück', n, 0, [
        'Anzahl = Gesamtlänge : Steinlänge',
        'Anzahl = ' + z(L) + ' m : ' + zahl(sl) + ' m = ' + zahl(L / sl) + ' Stück',
        'Aufrunden: ' + n + ' Stück (angefangene Steine werden zugeschnitten)'], { toleranz: 0 });
    }
    if (art === 'tonnen' || art === 'fuhren') {
      L = zufall(20, 60, 1); var B = zufall(4, 8, 0.5), d = wahl([20, 25, 30]); rho = wahl([1.8, 1.9, 2.0, 2.1]);
      V = L * B * d / 100; var m = V * rho;
      if (art === 'tonnen') {
        return aufgabe('mengen', 'Für eine Frostschutzschicht werden ' + zahl(V) + ' m³ Material eingebaut. Die Schüttdichte beträgt ' + z(rho) + ' t/m³. Wie viele Tonnen müssen geliefert werden?', 't', m, 2, [
          'Masse = Volumen · Dichte',
          'm = ' + zahl(V) + ' m³ · ' + z(rho) + ' t/m³',
          'm = ' + zahl(m) + ' t']);
      }
      var nutz = wahl([10, 12, 14]), f = aufrunden(runde(m, 2) / nutz);
      return aufgabe('mengen', 'Eine Fläche von ' + z(L) + ' m × ' + z(B) + ' m erhält eine ' + d + ' cm dicke Frostschutzschicht (' + z(rho) + ' t/m³). Ein Lkw lädt ' + nutz + ' t. Wie viele Lkw-Fuhren sind nötig?', 'Fuhren', f, 0, [
        'Volumen: ' + z(L) + ' m · ' + z(B) + ' m · ' + zahl(d / 100) + ' m = ' + zahl(V) + ' m³',
        'Masse: ' + zahl(V) + ' m³ · ' + z(rho) + ' t/m³ = ' + zahl(m) + ' t',
        'Fuhren: ' + zahl(m) + ' t : ' + nutz + ' t = ' + zahl(m / nutz) + ' → aufgerundet ' + f + ' Fuhren'], { toleranz: 0 });
    }
    if (art === 'kosten' || art === 'kostenmwst') {
      A = zufall(20, 150, art === 'kosten' && stufe === 1 ? 1 : 0.5); preis = stufe === 1 ? zufall(25, 60, 1) : zufall(25, 75, 0.5);
      var netto = A * preis;
      if (art === 'kosten') {
        return aufgabe('mengen', 'Das Pflastern kostet ' + zahl(preis) + ' € pro m². Wie hoch sind die Kosten für ' + z(A) + ' m² (netto)?', '€', netto, 2, [
          'Kosten = Menge · Einheitspreis',
          'K = ' + z(A) + ' m² · ' + zahl(preis) + ' €/m²',
          'K = ' + zahl(netto) + ' €'], { toleranz: 0.01 });
      }
      var brutto = runde(netto, 2) * 1.19;
      return aufgabe('mengen', 'Ein Angebot: ' + z(A) + ' m² Pflaster zu ' + zahl(preis) + ' €/m² netto. Wie hoch ist der Bruttopreis mit 19 % Mehrwertsteuer?', '€', brutto, 2, [
        'Netto: ' + z(A) + ' m² · ' + zahl(preis) + ' €/m² = ' + zahl(netto) + ' €',
        'MwSt: ' + zahl(netto) + ' € · 0,19 = ' + zahl(netto * 0.19) + ' €',
        'Brutto: ' + zahl(netto) + ' € + ' + zahl(netto * 0.19) + ' € = ' + zahl(brutto) + ' €',
        '(Kurzweg: Netto · 1,19)'], { toleranz: 0.02 });
    }
    // Beton für Bordsteinfundament mit Rückenstütze (vereinfacht als Rechteckquerschnitt)
    L = zufall(20, 60, 1); var q = wahl([0.06, 0.07, 0.08, 0.09]);
    V = L * q;
    return aufgabe('mengen', 'Für das Betonfundament mit Rückenstütze eines Bordsteins rechnet man vereinfacht mit einer Querschnittsfläche von ' + zahl(q) + ' m². Wie viel m³ Beton werden für ' + z(L) + ' m Bordstein benötigt?', 'm³', V, 2, [
      'Volumen = Querschnittsfläche · Länge',
      'V = ' + zahl(q) + ' m² · ' + z(L) + ' m',
      'V = ' + zahl(V) + ' m³']);
  }

  /* ---------- Einheiten ---------- */
  var UMRECHNUNG = [
    { von: 'cm', nach: 'm', f: 0.01, w: [25, 380, 1250, 47.5] },
    { von: 'm', nach: 'cm', f: 100, w: [0.35, 2.4, 1.05, 0.08] },
    { von: 'mm', nach: 'm', f: 0.001, w: [450, 1200, 85, 3500] },
    { von: 'm', nach: 'mm', f: 1000, w: [0.025, 1.6, 0.4, 2.35] },
    { von: 'm²', nach: 'cm²', f: 10000, w: [0.5, 1.2, 0.04, 2.25] },
    { von: 'cm²', nach: 'm²', f: 0.0001, w: [2500, 600, 15000, 400] },
    { von: 'm³', nach: 'Liter', f: 1000, w: [0.25, 1.5, 0.08, 3.2] },
    { von: 'Liter', nach: 'm³', f: 0.001, w: [750, 2500, 40, 1200] },
    { von: 't', nach: 'kg', f: 1000, w: [1.5, 0.75, 24, 2.25] },
    { von: 'kg', nach: 't', f: 0.001, w: [2500, 850, 40000, 1250] },
    { von: 'ha', nach: 'm²', f: 10000, w: [0.5, 1.2, 2.75, 0.08] },
    { von: 'a (Ar)', nach: 'm²', f: 100, w: [3, 12.5, 0.8, 45] },
    { von: 'dm³', nach: 'm³', f: 0.001, w: [500, 1250, 80, 2000] }
  ];
  var ERKLAERUNG = {
    'cm>m': '1 m = 100 cm → durch 100 teilen', 'm>cm': '1 m = 100 cm → mal 100',
    'mm>m': '1 m = 1.000 mm → durch 1.000 teilen', 'm>mm': '1 m = 1.000 mm → mal 1.000',
    'm²>cm²': '1 m² = 100 cm · 100 cm = 10.000 cm² → mal 10.000', 'cm²>m²': '1 m² = 10.000 cm² → durch 10.000 teilen',
    'm³>Liter': '1 m³ = 1.000 Liter → mal 1.000', 'Liter>m³': '1 m³ = 1.000 Liter → durch 1.000 teilen',
    't>kg': '1 t = 1.000 kg → mal 1.000', 'kg>t': '1 t = 1.000 kg → durch 1.000 teilen',
    'ha>m²': '1 ha = 100 m · 100 m = 10.000 m² → mal 10.000', 'a (Ar)>m²': '1 a = 10 m · 10 m = 100 m² → mal 100',
    'dm³>m³': '1 m³ = 1.000 dm³ → durch 1.000 teilen'
  };
  function einheiten(stufe) {
    var pool = stufe === 1 ? UMRECHNUNG.slice(0, 4).concat(UMRECHNUNG.slice(8, 10)) : UMRECHNUNG;
    var u = wahl(pool), w = wahl(u.w), erg = w * u.f;
    var e = runde(erg, 6);
    var nk = Math.min(6, (String(e).split('.')[1] || '').length);
    return aufgabe('einheiten', 'Rechne um: ' + z(w) + ' ' + u.von + ' = ? ' + u.nach, u.nach, e, nk, [
      ERKLAERUNG[u.von + '>' + u.nach],
      z(w) + ' ' + u.von + ' = ' + z(e) + ' ' + u.nach], { toleranz: Math.abs(e) * 0.0001 + 1e-9, tausender: true });
  }

  /* ---------- Höhen & Maßstab ---------- */
  function hoehen(stufe) {
    var art = stufe === 1 ? wahl(['massstab', 'nivellement']) :
      stufe === 2 ? wahl(['massstab', 'massstabZurueck', 'nivellement']) :
      wahl(['nivellement2', 'massstabZurueck', 'nivellement']);
    var M, cm, m, H, R, V;
    if (art === 'massstab') {
      M = wahl([50, 100, 200, 250, 500]); cm = stufe === 1 ? zufall(2, 15, 1) : zufall(2, 15, 0.5);
      m = cm * M / 100;
      return aufgabe('hoehen', 'Auf einem Plan im Maßstab 1 : ' + M + ' misst du eine Strecke von ' + z(cm) + ' cm. Wie lang ist sie in Wirklichkeit in m?', 'm', m, 2, [
        'Maßstab 1 : ' + M + ' → 1 cm im Plan = ' + M + ' cm in Wirklichkeit',
        z(cm) + ' cm · ' + M + ' = ' + z(cm * M) + ' cm',
        z(cm * M) + ' cm : 100 = ' + zahl(m) + ' m']);
    }
    if (art === 'massstabZurueck') {
      M = wahl([50, 100, 250, 500, 1000]); m = zufall(5, 40, 0.5);
      cm = m * 100 / M;
      return aufgabe('hoehen', 'Eine ' + z(m) + ' m lange Mauer soll im Maßstab 1 : ' + M + ' gezeichnet werden. Wie lang wird die Linie in cm?', 'cm', cm, 2, [
        'Wirkliche Länge in cm: ' + z(m) + ' m = ' + z(m * 100) + ' cm',
        'Durch die Maßstabszahl teilen: ' + z(m * 100) + ' cm : ' + M,
        '= ' + zahl(cm) + ' cm']);
    }
    if (art === 'nivellement') {
      H = zufall(100, 140, 0.005); R = zufall(0.8, 2.2, 0.005); V = zufall(0.6, 2.6, 0.005);
      var IH = H + R, HB = IH - V;
      return aufgabe('hoehen', 'Nivellement: Der Festpunkt A hat die Höhe ' + zahl(H, 3) + ' m ü. NHN. Ablesung Rückblick auf A: ' + zahl(R, 3) + ' m, Ablesung Vorblick auf Punkt B: ' + zahl(V, 3) + ' m. Welche Höhe hat Punkt B?', 'm', HB, 3, [
        'Instrumentenhorizont: IH = Höhe A + Rückblick',
        'IH = ' + zahl(H, 3) + ' m + ' + zahl(R, 3) + ' m = ' + zahl(IH, 3) + ' m',
        'Höhe B = IH − Vorblick = ' + zahl(IH, 3) + ' m − ' + zahl(V, 3) + ' m',
        'Höhe B = ' + zahl(HB, 3) + ' m ü. NHN'], { toleranz: 0.0015 });
    }
    // Soll-Ablesung für eine Sollhöhe (Absteckung)
    H = zufall(100, 130, 0.005); R = zufall(1.0, 2.0, 0.005); var Hsoll = runde(H + zufall(-0.4, 0.4, 0.01), 3);
    var IH2 = H + R, Vsoll = IH2 - Hsoll;
    return aufgabe('hoehen', 'Ein Pflock soll auf die Sollhöhe ' + zahl(Hsoll, 3) + ' m ü. NHN eingeschlagen werden. Der Festpunkt hat ' + zahl(H, 3) + ' m ü. NHN, der Rückblick darauf beträgt ' + zahl(R, 3) + ' m. Welche Ablesung muss an der Latte auf dem Pflock erscheinen?', 'm', Vsoll, 3, [
      'Instrumentenhorizont: IH = ' + zahl(H, 3) + ' m + ' + zahl(R, 3) + ' m = ' + zahl(IH2, 3) + ' m',
      'Soll-Ablesung = IH − Sollhöhe',
      '= ' + zahl(IH2, 3) + ' m − ' + zahl(Hsoll, 3) + ' m = ' + zahl(Vsoll, 3) + ' m'], { toleranz: 0.0015 });
  }

  var THEMEN = [
    { id: 'flaeche', name: 'Flächen', gen: flaeche },
    { id: 'volumen', name: 'Volumen & Aushub', gen: volumen },
    { id: 'gefaelle', name: 'Gefälle & Neigung', gen: gefaelle },
    { id: 'mengen', name: 'Baustoffmengen & Kosten', gen: mengen },
    { id: 'einheiten', name: 'Einheiten umrechnen', gen: einheiten },
    { id: 'hoehen', name: 'Höhen & Maßstab', gen: hoehen }
  ];

  function erzeuge(themaId, stufe) {
    var t = themaId && themaId !== 'mix' ? THEMEN.filter(function (x) { return x.id === themaId; })[0] : wahl(THEMEN);
    if (!t) t = wahl(THEMEN);
    var s = stufe === 1 || stufe === 2 || stufe === 3 ? stufe : wahl([1, 2, 3]);
    var a = t.gen(s);
    a.stufe = s;
    a.themaName = t.name;
    a.id = 'r-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 7);
    return a;
  }

  // Eingabe lesen: akzeptiert "52,5", "52.5", "1.050,5", "52,50 m²"
  function leseZahl(text) {
    if (text === null || text === undefined) return NaN;
    var s = String(text).trim().replace(/\s/g, '').replace(/[^0-9,.\-−]/g, '').replace('−', '-');
    if (!s) return NaN;
    if (s.indexOf(',') >= 0) s = s.replace(/\./g, '').replace(',', '.');
    else if ((s.match(/\./g) || []).length > 1) s = s.replace(/\./g, '');
    var n = parseFloat(s);
    return isFinite(n) ? n : NaN;
  }

  // Vergleicht eine Eingabe mit der Lösung. "2.666" ist mehrdeutig (2,666 oder 2666 mit Tausenderpunkt) –
  // beide Lesarten werden geprüft.
  // tausender = true: "1.250" wird nur als 1250 gelesen (beim Umrechnen ist das eindeutig gemeint)
  function pruefeZahl(eingabe, loesung, toleranz, tausender) {
    var n = leseZahl(eingabe);
    if (isNaN(n)) return null;
    var kandidaten = [n];
    var s = String(eingabe).replace(/\s/g, '').replace(/[^0-9,.\-]/g, '');
    if (/^-?[1-9]\d{0,2}\.\d{3}$/.test(s)) {
      var t = parseFloat(s.replace('.', ''));
      kandidaten = tausender ? [t] : [n, t];
    }
    return kandidaten.some(function (k) { return Math.abs(k - loesung) <= toleranz + 1e-9; });
  }
  function pruefe(aufgabe, eingabe) { return pruefeZahl(eingabe, aufgabe.loesung, aufgabe.toleranz, aufgabe.tausender); }

  window.RECHNEN = { THEMEN: THEMEN, erzeuge: erzeuge, pruefe: pruefe, pruefeZahl: pruefeZahl, leseZahl: leseZahl, zahl: zahl, z: z };
})();
