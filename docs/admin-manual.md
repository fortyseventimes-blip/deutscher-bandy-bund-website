# Redaktionshandbuch — bandy-bund.de

Für Redakteure, Sportwarte und Medienwarte. Kein technisches Vorwissen nötig.

---

## 1. Anmelden

`https://bandy-bund.de/admin` — E-Mail und Passwort. Administratoren und Redakteure brauchen
zusätzlich einen Code aus der Authenticator-App. Nach acht Stunden ohne Aktivität wirst du
automatisch abgemeldet.

---

## 2. Wie das Backend aufgebaut ist

| Gruppe | Enthält | Wer arbeitet hier |
| --- | --- | --- |
| **Inhalte** | Seiten, Beiträge, Galerien, Medien, Dokumente | Redakteur, Autor, Medienwart |
| **Sport** | Mannschaften, Spieler, Staff, Spiele, Turniere, Gegner, Spielstätten, Saisons | Sportwart |
| **Marketing** | Newsletter-Abonnenten, Formulare, Einsendungen, Partner | Redakteur |
| **Website** | Navigation, Footer, Einstellungen, Weiterleitungen, SEO-Standards | Administrator |
| **System** | Benutzer, Protokoll, KI-Nutzung | Administrator |

---

## 3. Der Grundsatz: alles besteht aus Modulen

Eine Seite ist kein Textfeld, sondern eine Liste von **Modulen**. Du fügst Module hinzu, ziehst sie
in die richtige Reihenfolge und füllst sie. Die Startseite funktioniert genauso wie jede andere
Seite — du kannst sie jederzeit umbauen, ohne dass jemand programmieren muss.

Jedes Modul hat unten die gleichen Einstellungen: **Anker** (für Sprunglinks), **Hintergrund**
(Standard / Gedämpft / Invertiert / Akzent), **Abstand** und **Überschriftenebene**.

Module, die Daten anzeigen — kommende Spiele, letzte Ergebnisse, Kaderraster, News — holen sich
ihren Inhalt selbst. Du stellst nur Filter und Anzahl ein. Trägst du irgendwo ein Ergebnis ein,
aktualisiert sich die Startseite von allein.

---

## 4. Entwurf, Vorschau, Veröffentlichung

Jeder Inhalt hat zwei Zustände: **Entwurf** und **Veröffentlicht**.

1. Anlegen und speichern → Entwurf. Öffentlich nicht sichtbar.
2. **Live-Vorschau** rechts zeigt die echte Seite, umschaltbar zwischen Handy, Tablet und Desktop.
   **Prüfe immer zuerst die Handy-Ansicht** — vier von fünf Besuchern kommen so.
3. **Veröffentlichen** oder **Veröffentlichen am** mit Datum und Uhrzeit für später.

**Versionen**: jede Speicherung wird archiviert. Über den Reiter *Versionen* siehst du, was sich
geändert hat, und stellst jede frühere Fassung wieder her. Es geht nichts verloren.

---

## 5. Wiederkehrende Aufgaben

### 5.1 Ein Spiel anlegen

`Sport → Spiele → Neu`

1. **Anstoß** — Datum und Uhrzeit in deutscher Zeit eingeben, das System rechnet intern um.
2. **Status** — `Geplant`. Ergebnisfelder bleiben gesperrt, bis der Status `Beendet` ist.
3. **Heim** und **Auswärts** — jeweils eine unserer Mannschaften oder ein Gegner. Fehlt der Gegner,
   legst du ihn direkt aus dem Formular an (Name, Land, Wappen).
4. **Spielstätte** auswählen oder neu anlegen.
5. **Turnierspiel?** — Schalter setzen, wenn das Spiel zu einem Turnier gehört, dann das Turnier und
   die Runde wählen. Bei einem Freundschaftsspiel bleibt der Schalter aus.
6. Speichern und veröffentlichen. Das Spiel erscheint sofort im Spielplan und im Kalender-Abo.

### 5.2 Ein Aufgebot zusammenstellen

Im Spiel, Abschnitt **Aufgebot**. Optional — ein Spiel ohne Aufgebot ist völlig in Ordnung.

Pro Spieler: Spieler wählen, **Rückennummer für dieses Spiel**, Position, *Startaufstellung*,
*Kapitän*. Nach dem Spiel kannst du Tore und Vorlagen ergänzen.

Die Nummer wird pro Spiel gespeichert, nicht am Spieler. Nummern dürfen sich zwischen Saisons
wiederholen — nur innerhalb eines Aufgebots muss jede Nummer eindeutig sein. Denselben Spieler
zweimal einzutragen, verhindert das System.

### 5.3 Ein Ergebnis eintragen

Spiel öffnen → Status auf **Beendet** → Tore Heim und Auswärts → optional Halbzeitstand →
veröffentlichen.

Das Ergebnis erscheint danach automatisch im Spielplan, im Ergebnis-Ticker auf der Startseite, auf
der Turnierseite und im RSS-Feed. Du musst nirgendwo sonst etwas nachtragen.

### 5.4 Einen Spielbericht schreiben

`Inhalte → Beiträge → Neu`, Typ **Spielbericht**, unter *Verknüpfungen* das Spiel auswählen. Bericht
und Spiel verlinken sich danach gegenseitig.

### 5.5 Einen Spieler anlegen

`Sport → Spieler → Neu`. Name, Rückennummer, Position, Nationalität, Geburtsdatum, im Verein seit,
Status, Porträtfoto. **Mitgliedschaften**: Mannschaft und Saison. Verlässt jemand den Kader, setze
den Status auf `Ehemalig` — die Spielerseite bleibt unter derselben Adresse erreichbar.

### 5.6 Ein Bild hochladen

`Inhalte → Medien`. Pflichtfelder: **Alternativtext** (was ist zu sehen — für blinde Nutzer und
Suchmaschinen), **Fotograf**, **Nutzungsrecht**. Ohne diese Angaben lässt sich kein Inhalt
veröffentlichen, der das Bild verwendet. Das ist Absicht: es schützt den Verband.

**Fokuspunkt** setzen — meist das Gesicht. Danach bleibt es in jedem Zuschnitt sichtbar.

---

## 6. Der KI-Assistent

Rechts im Editor, Panel **KI-Assistent**. Es gibt kein freies Eingabefeld, sondern sechs feste
Aktionen:

| Aktion | Was sie tut |
| --- | --- |
| **Entwurf erstellen** | Aus Titel und ein paar Stichworten einen Artikelentwurf |
| **Umschreiben** | Markierten Text kürzer, länger, sachlicher oder lebendiger |
| **Spielbericht** | Aus Ergebnis, Aufgebot, Spielstätte und Wettbewerb einen Berichtsentwurf |
| **Übersetzen** | DE → EN oder EN → DE, mit festem Bandy-Glossar |
| **SEO-Metadaten** | Titel und Beschreibung für Suchmaschinen |
| **Alternativtext** | Bildbeschreibung für ein Bild aus der Mediathek |

**Vier Dinge, die du wissen musst:**

1. **Der Assistent veröffentlicht nie.** Alles landet als Entwurf mit dem Status *Prüfung nötig*.
   Ein Mensch mit Veröffentlichungsrecht entscheidet.
2. **Er erfindet nichts.** Er kennt nur die Daten, die im System stehen. Fehlt etwas, schreibt er
   `[[TBD: Torschützen]]` statt zu raten. **Suche vor dem Veröffentlichen nach `[[TBD`** und
   ersetze jede Fundstelle.
3. **Er erzeugt keine Bilder.** Nur Text. Fotos kommen von Menschen.
4. **Jeder Aufruf wird protokolliert** — wer, wann, welche Aktion, welche Kosten. Es gibt ein
   Tages- und ein Monatslimit; ist es erreicht, schreibst du wie immer selbst weiter.

Der Assistent ist ein Werkzeug gegen das leere Blatt, kein Ersatz für Redaktion. **Du bist für
jeden veröffentlichten Satz verantwortlich, auch für den, den er geschrieben hat.**

---

## 7. Navigation und Footer

`Website → Navigation`. Baum mit maximal zwei Ebenen, getrennt für Deutsch und Englisch. Einträge
verweisen auf ein Dokument, eine externe Adresse oder einen Anker. Setzt du einen Eintrag auf eine
Seite, die später wieder auf Entwurf gestellt wird, verschwindet der Eintrag automatisch und du
bekommst im Navigationseditor eine Warnung.

---

## 8. Newsletter

`Marketing → Newsletter-Abonnenten`. Der Ablauf ist rechtlich vorgeschrieben und automatisch:

Eintragen → Status `Ausstehend` → Bestätigungsmail → Klick auf den Link → Status `Bestätigt`.

Nicht bestätigte Adressen werden nach 30 Tagen gelöscht. Adressen manuell einzutragen ist nicht
zulässig — ohne dokumentierte Einwilligung kein Versand. Beim Abonnenten siehst du, wann, über
welches Formular und zu welchem Einwilligungstext die Zustimmung erteilt wurde.

---

## 9. Sprachen

Oben im Dokument stellst du zwischen **DE** und **EN** um. Deutsch ist die Quelle. Änderst du die
deutsche Fassung, wird die englische als *veraltet* markiert. Die Aktion **Übersetzen** erzeugt eine
neue englische Fassung als Entwurf — lies sie, bevor du sie veröffentlichst.

---

## 10. Rollen

| Rolle | Darf |
| --- | --- |
| **Administrator** | Alles, inklusive Benutzer, Rollen, Einstellungen, Weiterleitungen |
| **Redakteur** | Alle Inhalte anlegen, bearbeiten und veröffentlichen |
| **Autor** | Eigene Entwürfe anlegen und zur Prüfung einreichen — nicht veröffentlichen |
| **Sportwart** | Sport-Gruppe vollständig; Seiten und Beiträge nur lesen |
| **Medienwart** | Mediathek und Galerien; keine Beiträge veröffentlichen |
| **Übersetzer** | Nur die englische Fassung bearbeiten |
| **Betrachter** | Nur lesen — für Vorstand und Partner |

Rechte werden serverseitig geprüft. Was du nicht siehst, kannst du auch über Umwege nicht ändern.

---

## 11. Wenn etwas schiefgeht

| Problem | Lösung |
| --- | --- |
| Inhalt versehentlich überschrieben | Reiter *Versionen* → frühere Fassung wiederherstellen |
| Beitrag versehentlich veröffentlicht | Auf Entwurf zurücksetzen — er ist sofort offline |
| Seite ist verschwunden | Administrator prüft `System → Protokoll`: wer, was, wann |
| Bild lässt sich nicht verwenden | Alternativtext, Fotograf oder Nutzungsrecht fehlt |
| Ergebnisfelder gesperrt | Status steht noch nicht auf `Beendet` |
| Spiel lässt sich nicht speichern | *Turnierspiel* ist gesetzt, aber kein Turnier gewählt |
| KI-Assistent nicht sichtbar | Monatslimit erreicht oder vom Administrator abgeschaltet |

---

## 12. Checkliste vor jeder Veröffentlichung

- [ ] Handy-Vorschau geprüft
- [ ] Titel und Meta-Beschreibung gefüllt
- [ ] Alle Bilder mit Alternativtext und Fotograf
- [ ] Keine `[[TBD:` mehr im Text
- [ ] Namen, Zahlen und Datum gegen die Quelle geprüft
- [ ] Verknüpfungen gesetzt (Spiel, Spieler, Turnier)
- [ ] Bei Bedarf englische Fassung angelegt oder bewusst weggelassen
