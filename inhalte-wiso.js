(function(){
  var I = window.INHALT;

  I.bereiche.push({
    id: 'wiso',
    name: 'Wirtschafts- und Sozialkunde',
    beschreibung: 'Ausbildungsvertrag und BBiG, Jugendarbeitsschutz, Arbeits- und Tarifrecht, Betriebsrat, Sozialversicherung, Lohnabrechnung, Betrieb und Wirtschaft, Umweltschutz und Soziale Marktwirtschaft – Prüfungsbereich WiSo der Zwischenprüfung.'
  });

  I.karten.push(
    { id: 'k-wiso-1', bereich: 'wiso', frage: 'Probezeit im Ausbildungsverhältnis (BBiG)', antwort: 'Mindestens 1 Monat, höchstens 4 Monate. In der Probezeit können beide Seiten jederzeit ohne Einhaltung einer Frist und ohne Angabe von Gründen kündigen – aber immer schriftlich.' },
    { id: 'k-wiso-2', bereich: 'wiso', frage: 'Kündigung des Ausbildungsvertrags nach der Probezeit', antwort: 'Nur noch: 1) aus wichtigem Grund fristlos (beide Seiten), schriftlich mit Angabe der Gründe, innerhalb von 2 Wochen nach Bekanntwerden des Grundes; 2) durch den Azubi mit 4 Wochen Frist, wenn er die Ausbildung aufgibt oder einen anderen Beruf erlernen will. Eine „normale“ Kündigung durch den Betrieb ist nicht möglich.' },
    { id: 'k-wiso-3', bereich: 'wiso', frage: 'Wichtige Pflichten von Azubi und Ausbildungsbetrieb', antwort: 'Azubi: Lernpflicht, Weisungen befolgen, Berufsschule besuchen, Ausbildungsnachweis führen, Betriebsordnung beachten, Schweigepflicht über Betriebsgeheimnisse, Werkzeug pfleglich behandeln. Betrieb: Ausbildungsinhalte vermitteln, Ausbildungsmittel kostenlos stellen, Vergütung zahlen, für Berufsschule und Prüfungen freistellen, Ausbildungsnachweis prüfen, nur ausbildungsbezogene Aufgaben übertragen, Zeugnis ausstellen.' },
    { id: 'k-wiso-4', bereich: 'wiso', frage: 'Ausbildungsnachweis (Berichtsheft)', antwort: 'Der Azubi führt ihn (schriftlich oder elektronisch) während der Ausbildungszeit; der Ausbildende hält dazu an und sieht ihn regelmäßig durch. Ein ordnungsgemäß geführter Ausbildungsnachweis ist Zulassungsvoraussetzung für die Abschluss-/Gesellenprüfung.' },
    { id: 'k-wiso-5', bereich: 'wiso', frage: 'Jugendarbeitsschutzgesetz – Arbeitszeit und Pausen', antwort: 'Gilt für Jugendliche unter 18. Höchstens 8 Stunden täglich und 40 Stunden wöchentlich, 5-Tage-Woche. Pausen: bei mehr als 4,5 bis 6 Std. Arbeit mind. 30 Min., bei mehr als 6 Std. mind. 60 Min.; als Pause zählt nur eine Unterbrechung von mind. 15 Min. Höchstens 4,5 Std. am Stück ohne Pause. Mindestens 12 Std. Freizeit zwischen zwei Arbeitstagen.' },
    { id: 'k-wiso-6', bereich: 'wiso', frage: 'Urlaub nach dem Jugendarbeitsschutzgesetz', antwort: 'Maßgeblich ist das Alter zu Beginn des Kalenderjahres: noch nicht 16 Jahre → mind. 30 Werktage, noch nicht 17 → mind. 27 Werktage, noch nicht 18 → mind. 25 Werktage. (Erwachsene nach Bundesurlaubsgesetz: mind. 24 Werktage; Tarifverträge sehen oft mehr vor.)' },
    { id: 'k-wiso-7', bereich: 'wiso', frage: 'Ärztliche Untersuchungen nach dem JArbSchG', antwort: 'Erstuntersuchung: Ein Jugendlicher darf nur beschäftigt werden, wenn er innerhalb der letzten 14 Monate untersucht wurde und die Bescheinigung vorliegt. Erste Nachuntersuchung: ein Jahr nach Beschäftigungsbeginn; ohne Bescheinigung darf er nach Ablauf von 14 Monaten nicht weiterbeschäftigt werden.' },
    { id: 'k-wiso-8', bereich: 'wiso', frage: 'Kündigungsfrist und Kündigungsschutz im Arbeitsverhältnis', antwort: 'Gesetzliche Grundkündigungsfrist (BGB): 4 Wochen zum 15. oder zum Monatsende; für den Arbeitgeber verlängert sie sich mit der Betriebszugehörigkeit. Tarifverträge können abweichen. Kündigung nur schriftlich (keine E-Mail/WhatsApp). Das Kündigungsschutzgesetz gilt bei mehr als 10 Arbeitnehmern im Betrieb und mehr als 6 Monaten Beschäftigung; Klage innerhalb von 3 Wochen beim Arbeitsgericht.' },
    { id: 'k-wiso-9', bereich: 'wiso', frage: 'Mutterschutz und Elternzeit (Grundzüge)', antwort: 'Mutterschutzfrist: 6 Wochen vor und 8 Wochen nach der Entbindung (bei Früh- oder Mehrlingsgeburten 12 Wochen). Während Schwangerschaft und bis 4 Monate nach der Entbindung besteht grundsätzlich Kündigungsverbot. Elternzeit: Mütter und Väter, bis zu 3 Jahre je Kind, mit besonderem Kündigungsschutz.' },
    { id: 'k-wiso-10', bereich: 'wiso', frage: 'Tarifautonomie und Tarifparteien im Bau', antwort: 'Tarifautonomie (Art. 9 Abs. 3 Grundgesetz): Gewerkschaften und Arbeitgeberverbände handeln Tarifverträge ohne Einmischung des Staates aus. Im Bauhauptgewerbe: IG BAU (Industriegewerkschaft Bauen-Agrar-Umwelt) auf Arbeitnehmerseite; Zentralverband des Deutschen Baugewerbes (ZDB) und Hauptverband der Deutschen Bauindustrie (HDB) auf Arbeitgeberseite. Manteltarifvertrag: allgemeine Arbeitsbedingungen (Arbeitszeit, Urlaub); Lohn-/Entgelttarifvertrag: Höhe von Lohn und Ausbildungsvergütung.' },
    { id: 'k-wiso-11', bereich: 'wiso', frage: 'Ablauf eines Arbeitskampfs', antwort: 'Verhandlungen → Scheitern → evtl. Schlichtung → Urabstimmung der Gewerkschaftsmitglieder → Streik (Arbeitgeber können mit Aussperrung reagieren) → neue Verhandlungen → zweite Urabstimmung über das Ergebnis → neuer Tarifvertrag. Während der Laufzeit eines Tarifvertrags gilt Friedenspflicht. Streiken darf nur eine Gewerkschaft (kein „wilder Streik“).' },
    { id: 'k-wiso-12', bereich: 'wiso', frage: 'Betriebsrat und JAV', antwort: 'Betriebsrat: wählbar in Betrieben mit mind. 5 ständigen wahlberechtigten Arbeitnehmern (davon 3 wählbar); Amtszeit 4 Jahre. JAV (Jugend- und Auszubildendenvertretung): bei mind. 5 Arbeitnehmern unter 18 oder Azubis unter 25 – setzt einen Betriebsrat voraus; Amtszeit 2 Jahre. Echte Mitbestimmung z. B. bei Beginn/Ende der Arbeitszeit, Pausen, Urlaubsgrundsätzen; vor jeder Kündigung muss der Betriebsrat angehört werden.' },
    { id: 'k-wiso-13', bereich: 'wiso', frage: 'Die 5 Zweige der Sozialversicherung', antwort: 'Krankenversicherung (Krankenkassen), Pflegeversicherung (Pflegekassen), Rentenversicherung (Deutsche Rentenversicherung), Arbeitslosenversicherung (Bundesagentur für Arbeit), Unfallversicherung (Berufsgenossenschaften – im Bau die BG BAU). Die ersten vier zahlen Arbeitnehmer und Arbeitgeber grundsätzlich je etwa zur Hälfte, die Unfallversicherung trägt der Arbeitgeber allein.' },
    { id: 'k-wiso-14', bereich: 'wiso', frage: 'Arbeitsunfall und Wegeunfall', antwort: 'Die gesetzliche Unfallversicherung (BG BAU) zahlt bei Arbeitsunfällen, Berufskrankheiten und Wegeunfällen. Wegeunfall: Unfall auf dem unmittelbaren Weg zwischen Wohnung und Arbeitsstätte bzw. Berufsschule. Private Umwege (z. B. Einkaufen) sind grundsätzlich nicht versichert. Führt ein Unfall zu mehr als 3 Tagen Arbeitsunfähigkeit, muss der Betrieb ihn der BG melden.' },
    { id: 'k-wiso-15', bereich: 'wiso', frage: 'Vom Brutto- zum Nettolohn', antwort: 'Bruttolohn minus Steuern (Lohnsteuer, ggf. Kirchensteuer und Solidaritätszuschlag) minus Arbeitnehmeranteile zur Sozialversicherung (Kranken-, Pflege-, Renten-, Arbeitslosenversicherung) = Nettolohn. Die genauen Beitragssätze ändern sich regelmäßig.' },
    { id: 'k-wiso-16', bereich: 'wiso', frage: 'Rechtsformen: e.K., GbR, GmbH', antwort: 'e.K. (eingetragener Kaufmann): ein Inhaber, haftet unbeschränkt auch mit Privatvermögen. GbR: mind. 2 Gesellschafter, die persönlich und unbeschränkt haften. GmbH: juristische Person, Stammkapital mind. 25.000 €, Haftung auf das Gesellschaftsvermögen beschränkt, geführt von Geschäftsführer(n).' },
    { id: 'k-wiso-17', bereich: 'wiso', frage: 'Handwerk, Industrie und Kammern', antwort: 'Straßenbauer ist ein zulassungspflichtiges Handwerk (Anlage A der Handwerksordnung). Handwerksbetriebe sind Pflichtmitglied der Handwerkskammer (HWK) und in der Handwerksrolle eingetragen; die Mitgliedschaft in der Innung ist freiwillig. Industriebetriebe (z. B. große Bauunternehmen) gehören zur Industrie- und Handelskammer (IHK). Kammern überwachen u. a. die Ausbildung und führen Prüfungen durch.' },
    { id: 'k-wiso-18', bereich: 'wiso', frage: 'Umweltschutz und Nachhaltigkeit im Betrieb', antwort: 'Abfallhierarchie (Kreislaufwirtschaftsgesetz): Vermeiden → Wiederverwenden → Recyceln → sonstige Verwertung (z. B. energetisch) → Beseitigen. Auf der Baustelle: Abfälle getrennt sammeln, Ausbauasphalt wiederverwerten, teer-/pechhaltige Stoffe gesondert behandeln, Gefahrstoffe sicher lagern, Boden und Gewässer schützen. Nachhaltigkeit hat drei Säulen: ökologisch, ökonomisch, sozial.' },
    { id: 'k-wiso-19', bereich: 'wiso', frage: 'Soziale Marktwirtschaft', antwort: 'Wirtschaftsordnung der Bundesrepublik (geprägt von Ludwig Erhard und Alfred Müller-Armack): Preise bilden sich über Angebot und Nachfrage im freien Wettbewerb, der Staat setzt Regeln und sorgt für sozialen Ausgleich – z. B. Wettbewerbsschutz (Bundeskartellamt), Sozialversicherung, Arbeitnehmerschutzgesetze, Tarifautonomie.' }
  );

  I.fragen.push(
    { id: 'f-wiso-1', bereich: 'wiso', stufe: 1, typ: 'mc',
      frage: 'Wie lange darf die Probezeit in einem Ausbildungsverhältnis höchstens dauern?',
      optionen: ['4 Monate', '6 Monate', '3 Monate', '1 Monat'],
      richtig: 0,
      erklaerung: 'Nach dem Berufsbildungsgesetz beträgt die Probezeit mindestens 1 Monat und höchstens 4 Monate.' },

    { id: 'f-wiso-2', bereich: 'wiso', stufe: 2, typ: 'mc',
      frage: 'Ein Azubi ist seit 8 Monaten in der Ausbildung und möchte den Beruf wechseln. Wie kann er kündigen?',
      optionen: ['Gar nicht, nach der Probezeit ist keine Kündigung möglich', 'Schriftlich mit einer Frist von 4 Wochen', 'Mündlich ohne Frist', 'Nur mit Zustimmung der Berufsschule'],
      richtig: 1,
      erklaerung: 'Nach der Probezeit kann der Azubi mit 4 Wochen Frist schriftlich kündigen, wenn er die Ausbildung aufgeben oder einen anderen Beruf erlernen will.' },

    { id: 'f-wiso-3', bereich: 'wiso', stufe: 1, typ: 'mc',
      frage: 'Welche Aussage zum Ausbildungsnachweis (Berichtsheft) ist richtig?',
      optionen: ['Er ist freiwillig und nur für die Berufsschule gedacht', 'Er muss in der Freizeit geführt werden', 'Er ist Voraussetzung für die Zulassung zur Abschluss-/Gesellenprüfung', 'Er wird ausschließlich vom Ausbilder geschrieben'],
      richtig: 2,
      erklaerung: 'Der Azubi führt den Ausbildungsnachweis während der Ausbildungszeit, der Ausbildende prüft ihn. Er ist Zulassungsvoraussetzung für die Abschluss-/Gesellenprüfung.' },

    { id: 'f-wiso-4', bereich: 'wiso', stufe: 2, typ: 'mc',
      frage: 'Welche Pflicht hat der Ausbildungsbetrieb?',
      optionen: ['Er darf Azubis für private Besorgungen einsetzen', 'Er kann vom Azubi Geld für Werkzeug verlangen', 'Er muss die Berufsschulnoten veröffentlichen', 'Er muss Ausbildungsmittel kostenlos zur Verfügung stellen'],
      richtig: 3,
      erklaerung: 'Der Ausbildende muss Ausbildungsmittel (Werkzeuge, Werkstoffe) kostenlos stellen und darf nur Aufgaben übertragen, die dem Ausbildungszweck dienen.' },

    { id: 'f-wiso-5', bereich: 'wiso', stufe: 1, typ: 'mc',
      frage: 'Wie viele Stunden darf ein 17-jähriger Azubi nach dem Jugendarbeitsschutzgesetz pro Woche höchstens arbeiten?',
      optionen: ['40 Stunden', '48 Stunden', '35 Stunden', '45 Stunden'],
      richtig: 0,
      erklaerung: 'Jugendliche dürfen höchstens 8 Stunden täglich und 40 Stunden wöchentlich beschäftigt werden.' },

    { id: 'f-wiso-6', bereich: 'wiso', stufe: 2, typ: 'mc',
      frage: 'Ein 16-jähriger Azubi arbeitet 8 Stunden. Wie viel Pause steht ihm mindestens zu?',
      optionen: ['30 Minuten', '60 Minuten', '45 Minuten', '15 Minuten'],
      richtig: 1,
      erklaerung: 'Bei mehr als 6 Stunden Arbeitszeit müssen Jugendliche mindestens 60 Minuten Pause erhalten (bei mehr als 4,5 bis 6 Stunden: 30 Minuten). Eine Pause muss mindestens 15 Minuten dauern.' },

    { id: 'f-wiso-7', bereich: 'wiso', stufe: 2, typ: 'mc',
      frage: 'Ein Azubi ist zu Beginn des Kalenderjahres 16 Jahre alt. Wie viel Urlaub steht ihm nach dem JArbSchG mindestens zu?',
      optionen: ['30 Werktage', '25 Werktage', '27 Werktage', '24 Werktage'],
      richtig: 2,
      erklaerung: 'Wer zu Beginn des Kalenderjahres noch nicht 17 ist, hat Anspruch auf mindestens 27 Werktage (unter 16: 30, unter 18: 25 Werktage).' },

    { id: 'f-wiso-8', bereich: 'wiso', stufe: 3, typ: 'mc',
      frage: 'Was gilt für die ärztliche Untersuchung von Jugendlichen nach dem JArbSchG?',
      optionen: ['Sie ist nur bei Arbeiten im Büro nötig', 'Sie wird erst nach Ende der Probezeit durchgeführt', 'Sie ist freiwillig und wird vom Azubi bezahlt', 'Ohne Bescheinigung über die Erstuntersuchung (nicht älter als 14 Monate) darf der Jugendliche nicht beschäftigt werden'],
      richtig: 3,
      erklaerung: 'Die Erstuntersuchung muss innerhalb der letzten 14 Monate vor Beschäftigungsbeginn erfolgt sein; ein Jahr nach Beginn folgt die erste Nachuntersuchung.' },

    { id: 'f-wiso-9', bereich: 'wiso', stufe: 2, typ: 'mc',
      frage: 'In welcher Form muss eine Kündigung eines Arbeitsverhältnisses erfolgen?',
      optionen: ['Schriftlich mit eigenhändiger Unterschrift', 'Per E-Mail reicht aus', 'Mündlich vor Zeugen', 'Per Kurznachricht auf dem Handy'],
      richtig: 0,
      erklaerung: 'Kündigungen bedürfen der Schriftform (Papier mit Unterschrift). E-Mail, Fax oder Messenger-Nachrichten sind unwirksam.' },

    { id: 'f-wiso-10', bereich: 'wiso', stufe: 3, typ: 'mc',
      frage: 'Wann gilt das Kündigungsschutzgesetz für einen Arbeitnehmer?',
      optionen: ['Ab dem ersten Arbeitstag in jedem Betrieb', 'Wenn er länger als 6 Monate beschäftigt ist und der Betrieb mehr als 10 Arbeitnehmer hat', 'Nur für Mitglieder einer Gewerkschaft', 'Nur in Betrieben mit Betriebsrat'],
      richtig: 1,
      erklaerung: 'Allgemeiner Kündigungsschutz besteht nach mehr als 6 Monaten Betriebszugehörigkeit in Betrieben mit mehr als 10 Arbeitnehmern. Gegen eine Kündigung muss innerhalb von 3 Wochen Klage beim Arbeitsgericht erhoben werden.' },

    { id: 'f-wiso-11', bereich: 'wiso', stufe: 1, typ: 'mc',
      frage: 'Was versteht man unter Tarifautonomie?',
      optionen: ['Der Staat legt alle Löhne per Gesetz fest', 'Jeder Arbeitnehmer verhandelt seinen Lohn allein', 'Gewerkschaften und Arbeitgeberverbände handeln Tarifverträge ohne staatliche Einmischung aus', 'Der Betriebsrat bestimmt die Löhne'],
      richtig: 2,
      erklaerung: 'Die Tarifautonomie ist durch Art. 9 Abs. 3 Grundgesetz (Koalitionsfreiheit) geschützt. Die Tarifparteien regeln Löhne und Arbeitsbedingungen eigenverantwortlich.' },

    { id: 'f-wiso-12', bereich: 'wiso', stufe: 2, typ: 'mc',
      frage: 'Was bedeutet „Friedenspflicht“?',
      optionen: ['Der Betriebsrat darf nicht streiten', 'Arbeitnehmer dürfen nie streiken', 'Arbeitgeber müssen Streiks immer hinnehmen', 'Während der Laufzeit eines Tarifvertrags sind Streiks und Aussperrungen über die darin geregelten Inhalte verboten'],
      richtig: 3,
      erklaerung: 'Solange ein Tarifvertrag gilt, dürfen die Tarifparteien wegen der darin geregelten Punkte keine Arbeitskampfmaßnahmen ergreifen.' },

    { id: 'f-wiso-13', bereich: 'wiso', stufe: 2, typ: 'mc',
      frage: 'Was regelt in der Regel ein Manteltarifvertrag (Rahmentarifvertrag)?',
      optionen: ['Allgemeine Arbeitsbedingungen wie Arbeitszeit, Urlaub und Kündigungsfristen', 'Nur die genaue Lohnhöhe', 'Die Beitragssätze der Krankenkassen', 'Die Höhe der Lohnsteuer'],
      richtig: 0,
      erklaerung: 'Der Manteltarifvertrag gilt meist über mehrere Jahre und regelt allgemeine Arbeitsbedingungen. Die Höhe von Löhnen und Ausbildungsvergütungen steht im Lohn- bzw. Entgelttarifvertrag.' },

    { id: 'f-wiso-14', bereich: 'wiso', stufe: 1, typ: 'mc',
      frage: 'Ab wie vielen ständigen wahlberechtigten Arbeitnehmern kann ein Betriebsrat gewählt werden?',
      optionen: ['Ab 20', 'Ab 5', 'Ab 50', 'Ab 2'],
      richtig: 1,
      erklaerung: 'Nach dem Betriebsverfassungsgesetz kann in Betrieben mit mindestens 5 ständigen wahlberechtigten Arbeitnehmern, von denen 3 wählbar sind, ein Betriebsrat gewählt werden.' },

    { id: 'f-wiso-15', bereich: 'wiso', stufe: 3, typ: 'mc',
      frage: 'Welche Voraussetzung gilt für die Wahl einer Jugend- und Auszubildendenvertretung (JAV)?',
      optionen: ['Es muss eine Innung bestehen', 'Der Betrieb muss mehr als 100 Mitarbeiter haben', 'Mindestens 5 Arbeitnehmer unter 18 oder Azubis unter 25 und ein bestehender Betriebsrat', 'Die Berufsschule muss zustimmen'],
      richtig: 2,
      erklaerung: 'Eine JAV wird gewählt, wenn mindestens 5 Jugendliche unter 18 oder Auszubildende unter 25 im Betrieb sind und ein Betriebsrat besteht. Die Amtszeit beträgt 2 Jahre.' },

    { id: 'f-wiso-16', bereich: 'wiso', stufe: 1, typ: 'mc',
      frage: 'Wer zahlt die Beiträge zur gesetzlichen Unfallversicherung (BG BAU)?',
      optionen: ['Arbeitnehmer und Arbeitgeber je zur Hälfte', 'Nur der Arbeitnehmer', 'Der Staat aus Steuermitteln', 'Allein der Arbeitgeber'],
      richtig: 3,
      erklaerung: 'Die Beiträge zur Berufsgenossenschaft trägt der Arbeitgeber allein. Kranken-, Pflege-, Renten- und Arbeitslosenversicherung werden grundsätzlich etwa hälftig geteilt.' },

    { id: 'f-wiso-17', bereich: 'wiso', stufe: 2, typ: 'mc',
      frage: 'Ein Azubi hat auf dem direkten Heimweg von der Berufsschule einen Fahrradunfall. Welche Versicherung ist zuständig?',
      optionen: ['Die gesetzliche Unfallversicherung (Berufsgenossenschaft), da es ein Wegeunfall ist', 'Nur seine private Haftpflichtversicherung', 'Die Arbeitslosenversicherung', 'Niemand, da er nicht auf der Baustelle war'],
      richtig: 0,
      erklaerung: 'Der unmittelbare Weg zwischen Wohnung und Betrieb bzw. Berufsschule ist gesetzlich unfallversichert (Wegeunfall). Private Umwege sind grundsätzlich nicht versichert.' },

    { id: 'f-wiso-18', bereich: 'wiso', stufe: 2, typ: 'mc',
      frage: 'Welche Aussage zur GmbH ist richtig?',
      optionen: ['Die Gesellschafter haften immer unbeschränkt mit ihrem Privatvermögen', 'Die Haftung ist auf das Gesellschaftsvermögen beschränkt; das Stammkapital beträgt mindestens 25.000 €', 'Eine GmbH braucht kein Startkapital', 'Eine GmbH darf keine Mitarbeiter beschäftigen'],
      richtig: 1,
      erklaerung: 'Die GmbH ist eine juristische Person mit mindestens 25.000 € Stammkapital. Gläubigern haftet nur das Gesellschaftsvermögen. Beim e.K. und bei der GbR haften die Inhaber bzw. Gesellschafter persönlich.' },

    { id: 'f-wiso-19', bereich: 'wiso', stufe: 1, typ: 'mc',
      frage: 'Welche Kammer ist für einen Handwerksbetrieb im Straßenbau zuständig?',
      optionen: ['Die Industrie- und Handelskammer', 'Die Ärztekammer', 'Die Handwerkskammer', 'Die Bundesagentur für Arbeit'],
      richtig: 2,
      erklaerung: 'Straßenbauer ist ein zulassungspflichtiges Handwerk. Handwerksbetriebe sind Pflichtmitglied der Handwerkskammer; die Innung ist ein freiwilliger Zusammenschluss. Industriebetriebe gehören zur IHK.' },

    { id: 'f-wiso-20', bereich: 'wiso', stufe: 2, typ: 'mc',
      frage: 'Welche Reihenfolge entspricht der Abfallhierarchie des Kreislaufwirtschaftsgesetzes?',
      optionen: ['Beseitigen – Recyceln – Vermeiden', 'Recyceln – Vermeiden – Beseitigen', 'Verbrennen – Vermeiden – Recyceln', 'Vermeiden – Wiederverwenden – Recyceln – sonstige Verwertung – Beseitigen'],
      richtig: 3,
      erklaerung: 'Vorrang hat immer die Vermeidung von Abfall, Beseitigung (z. B. Deponie) ist die letzte Möglichkeit. Im Straßenbau wird z. B. Ausbauasphalt wiederverwertet.' },

    { id: 'f-wiso-21', bereich: 'wiso', stufe: 3, typ: 'mc',
      frage: 'Was kennzeichnet die Soziale Marktwirtschaft?',
      optionen: ['Freier Wettbewerb über Angebot und Nachfrage, ergänzt durch staatliche Regeln und sozialen Ausgleich', 'Der Staat plant Produktion und Preise zentral', 'Der Markt bleibt völlig ohne staatliche Regeln', 'Alle Betriebe gehören dem Staat'],
      richtig: 0,
      erklaerung: 'Die Soziale Marktwirtschaft verbindet Marktfreiheit mit sozialer Absicherung (z. B. Sozialversicherung, Kündigungsschutz) und Wettbewerbsschutz durch das Bundeskartellamt.' },

    { id: 'f-wiso-22', bereich: 'wiso', stufe: 1, typ: 'text',
      frage: 'Wie heißt die Gewerkschaft, die die Beschäftigten im Bauhauptgewerbe vertritt? (Abkürzung)',
      antworten: ['IG BAU', 'IG Bau', 'IGBAU', 'IG Bauen-Agrar-Umwelt', 'Industriegewerkschaft Bauen-Agrar-Umwelt'],
      erklaerung: 'Die IG BAU (Industriegewerkschaft Bauen-Agrar-Umwelt) verhandelt mit den Arbeitgeberverbänden ZDB und HDB die Bau-Tarifverträge.' },

    { id: 'f-wiso-23', bereich: 'wiso', stufe: 2, typ: 'text',
      frage: 'Wie heißt der Träger der gesetzlichen Unfallversicherung für Bauunternehmen allgemein?',
      antworten: ['Berufsgenossenschaft', 'BG', 'BG BAU', 'BG Bau', 'Berufsgenossenschaften'],
      erklaerung: 'Träger der gesetzlichen Unfallversicherung sind die Berufsgenossenschaften; für die Bauwirtschaft ist es die BG BAU.' },

    { id: 'f-wiso-24', bereich: 'wiso', stufe: 2, typ: 'zahl',
      frage: 'Ein Azubi erhält 1.000,00 € brutto. Abgezogen werden 205,00 € Sozialversicherungsbeiträge und 15,00 € Steuern. Wie hoch ist der Nettobetrag?',
      loesung: 780, toleranz: 0.01, einheit: '€',
      erklaerung: 'Netto = Brutto − Steuern − Arbeitnehmeranteile zur Sozialversicherung: 1.000 € − 205 € − 15 € = 780 €. (Beispielzahlen, keine echten Beitragssätze.)' }
  );
})();
