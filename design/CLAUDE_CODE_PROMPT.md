Baue die Bandy-Bund-Website aus dem Design-Handoff in diesem Ordner.

Lies zuerst README.md komplett. Sie enthält Design-Tokens, alle Screens mit Maßen, das Komponenten-Inventar, Interaktionen, Datenmodell und eine vorgeschlagene Build-Reihenfolge. Die .dc.html-Dateien sind Design-Referenzen — im Browser ansehen, aber nicht portieren; image-slot.js und support.js gehören zur Prototyp-Umgebung und werden nicht übernommen.

Rahmen:
- Deutschsprachige Website eines kleinen Sportverbands, inhaltsgetrieben, mit wenig Live-Daten (Spielplan, Live-Ticker). Englische Fassung ist vorgesehen — Texte von Anfang an über i18n, nicht hart im Markup.
- Zwei Breakpoints sind gestaltet: Desktop 1440, Mobile 390. Dazwischen sauber skalieren.
- Die Prototypen nutzen ausschließlich Inline-Styles (Einschränkung der Prototyp-Umgebung). Im echten Projekt in das Styling-System überführen und die Werte aus dem Token-Abschnitt zentral ablegen. Wiederholungen in den Prototypen (Header, Footer, Fixture-Zeile, Scoreboard) sind bewusste Duplikate für die Vorschau — in der Implementierung je eine Komponente.
- Keine Schatten, Elevation nur über Flächenfarbe plus 1px Linie. Alle Zahlen tabular-nums. Fokusring gelb, Trefferflächen mindestens 44px.

Wichtig fachlich: Fehlende Daten sind der Normalfall, nicht der Fehlerfall — kein Portrait, keine Biografie, Aufstellung noch nicht gemeldet, keine Tabelle für diesen Wettbewerb, noch keine Fotos, Finalteilnehmer offen. Für jeden dieser Fälle existiert ein gestalteter Zustand im Handoff. Felder optional modellieren und den vorgesehenen Fallback rendern, nicht das Modul ausblenden.

Consent ist bindend: kein Third-Party-Request vor Zustimmung, Nachfrage pro Einbettung, „Immer erlauben" pro Dienst persistieren, jede gesperrte Einbettung braucht die gestaltete Alternative (Adresse als Text, Link in die Karten-App), Widerruf über die Fußzeile erreichbar.

Vorgehen:
1. Sag mir zuerst, welches Framework und welche Styling-Lösung du vorschlägst und warum — dann warte auf mein OK.
2. Danach in der Reihenfolge aus dem README bauen, beginnend mit Tokens und den Basiskomponenten.
3. Datenzugriff hinter eine Schicht legen, die zunächst gegen Fixtures aus dem Handoff läuft, damit später ein CMS oder eine API dahinter kann. Die Namen, Ergebnisse und Zahlen in den Prototypen sind Platzhalter.
4. Die deutschen Texte aus den Prototypen sind echte Texte und können übernommen werden.

Frag nach, wenn eine Angabe im README für die Umsetzung nicht ausreicht, statt zu raten.
