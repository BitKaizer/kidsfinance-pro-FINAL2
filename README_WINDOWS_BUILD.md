# KidsFinance Pro – Windows .exe Installer bauen

## Voraussetzungen

- **Node.js** v18+ → https://nodejs.org
- **pnpm** → `npm install -g pnpm`
- **Windows** (für Windows-Build empfohlen, alternativ auch auf Mac/Linux möglich)

---

## Schritt 1: Projekt einrichten

```bash
# ZIP entpacken und in den Ordner wechseln
cd kidsfinance-pro

# Abhängigkeiten installieren
pnpm install
```

---

## Schritt 2: Windows EXE bauen

```bash
pnpm run dist:win
```

Das führt automatisch aus:
1. `vite build` → baut die React-App nach `dist/public/`
2. `tsc electron-main.ts` → kompiliert den Electron-Einstiegspunkt
3. `electron-builder --win` → packt alles zu einer `.exe`

**Ausgabe:** `dist-electron/KidsFinance Pro Setup 1.0.0.exe`

---

## Schritt 3: Installer testen

Doppelklick auf `KidsFinance Pro Setup 1.0.0.exe` → installiert die App unter Windows.

---

## Für andere Plattformen

```bash
pnpm run dist:mac    # → .dmg für macOS
pnpm run dist:linux  # → .AppImage für Linux
pnpm run dist:all    # → alle drei gleichzeitig
```

---

## Datenspeicherung

Die App speichert **alle Daten lokal** im Browser-localStorage (innerhalb von Electron).
Kein Internet, keine Cloud, keine Accounts nötig. ✅

Gespeichert wird:
- Name des Kindes, Sprache, PIN
- XP, Streak, abgeschlossene Lektionen & Challenges
- Sparschwein-Guthaben und Transaktionen
- Sparziel
- Eigene Lektionen & Challenges (vom Elternteil hinzugefügt)
- Theme

Speicherort auf Windows: `C:\Users\[Username]\AppData\Local\KidsFinance Pro\`

---

## Entwicklungsmodus

```bash
# Web-App im Browser starten
pnpm run dev

# Electron-Fenster starten (braucht laufenden dev-Server)
pnpm run electron:dev
```

---

## Skripte-Übersicht

| Befehl | Beschreibung |
|--------|-------------|
| `pnpm dev` | Web-App im Browser (localhost:3000) |
| `pnpm build` | Web-App für Produktion bauen |
| `pnpm dist:win` | Windows .exe Installer erstellen |
| `pnpm dist:mac` | macOS .dmg erstellen |
| `pnpm dist:linux` | Linux AppImage erstellen |
| `pnpm dist:all` | Alle Plattformen auf einmal |

