# KidsFinance Pro - Distribution Guide

## 🎯 Verkaufsfertige App für Windows, Mac und Linux

Diese Anleitung zeigt dir, wie du KidsFinance Pro als eigenständige Desktop-Anwendung verpackst und verkaufst.

---

## 📦 Installation der Build-Tools

### 1. Electron und Electron Builder installieren

```bash
npm install --save-dev electron electron-builder electron-is-dev
# oder mit pnpm
pnpm add -D electron electron-builder electron-is-dev
```

### 2. Preload Script erstellen

Erstelle `preload.js`:

```javascript
const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  platform: process.platform,
  version: process.version,
});
```

---

## 🔨 Bauen für Windows

### Schritt 1: Web-App bauen

```bash
npm run build
# oder
pnpm build
```

### Schritt 2: Electron Main Process kompilieren

```bash
npx tsc electron-main.ts --outDir . --module commonjs --target es2020
```

### Schritt 3: Windows EXE erstellen

```bash
npx electron-builder --win --publish never
```

**Ausgabe:** `dist-electron/KidsFinance Pro Setup 1.0.0.exe`

---

## 🍎 Bauen für Mac

```bash
npx electron-builder --mac --publish never
```

**Ausgabe:** `dist-electron/KidsFinance Pro-1.0.0.dmg`

---

## 🐧 Bauen für Linux

```bash
npx electron-builder --linux --publish never
```

**Ausgabe:** `dist-electron/KidsFinance Pro-1.0.0.AppImage`

---

## 📋 package.json Konfiguration

Füge diese Scripts zu deiner `package.json` hinzu:

```json
{
  "scripts": {
    "electron-dev": "electron .",
    "electron-build": "tsc electron-main.ts --outDir . --module commonjs --target es2020",
    "build-app": "npm run build && npm run electron-build",
    "dist-win": "npm run build-app && electron-builder --win",
    "dist-mac": "npm run build-app && electron-builder --mac",
    "dist-linux": "npm run build-app && electron-builder --linux",
    "dist-all": "npm run build-app && electron-builder -mwl"
  }
}
```

---

## 💾 Lokale Datenspeicherung

KidsFinance Pro speichert alle Daten **lokal auf dem Computer** im:

**Windows:** `C:\Users\[Username]\AppData\Local\KidsFinance Pro\`
**Mac:** `~/Library/Application Support/KidsFinance Pro/`
**Linux:** `~/.config/KidsFinance Pro/`

Keine Cloud-Abhängigkeiten! ✅

---

## 🎁 Verkauf & Verteilung

### Option 1: Direkt verteilen
- Hochladen auf deine Website
- Kunden laden die EXE herunter und installieren sie

### Option 2: App Stores
- **Windows Store:** Microsoft Partner Center
- **Mac App Store:** Apple Developer Program
- **Linux:** Snap Store, Flathub

### Option 3: Installer mit Lizenz
- Erstelle einen Lizenzschlüssel-System
- Validiere beim Start der App

---

## 🔐 Sicherheit & Lizenzierung

### Lizenzschlüssel hinzufügen

Erstelle `license-check.ts`:

```typescript
import crypto from 'crypto';

export function generateLicense(email: string, expiryDays: number = 365): string {
  const expiry = new Date();
  expiry.setDate(expiry.getDate() + expiryDays);
  
  const data = `${email}|${expiry.toISOString()}`;
  const hash = crypto.createHash('sha256').update(data).digest('hex');
  
  return `${Buffer.from(data).toString('base64')}.${hash}`;
}

export function validateLicense(license: string): boolean {
  try {
    const [data, hash] = license.split('.');
    const decoded = Buffer.from(data, 'base64').toString();
    const [email, expiryStr] = decoded.split('|');
    
    const expiry = new Date(expiryStr);
    if (expiry < new Date()) return false;
    
    const expectedHash = crypto.createHash('sha256').update(decoded).digest('hex');
    return hash === expectedHash;
  } catch {
    return false;
  }
}
```

---

## 📊 Größe & Performance

- **Installationsgröße:** ~200-300 MB (mit Electron)
- **RAM-Verbrauch:** ~100-150 MB
- **Startzeit:** ~2-3 Sekunden

---

## 🚀 Veröffentlichungschecklist

- [ ] Alle Lektionen und Inhalte fertig
- [ ] Offline-Funktionalität getestet
- [ ] Datenspeicherung getestet
- [ ] Windows EXE erstellt und getestet
- [ ] Mac DMG erstellt und getestet
- [ ] Linux AppImage erstellt und getestet
- [ ] Lizenzierungssystem implementiert
- [ ] Datenschutz & Nutzungsbedingungen
- [ ] Website mit Download-Links
- [ ] Support-Email eingerichtet

---

## 📞 Support & Updates

### Auto-Update implementieren

```typescript
import { autoUpdater } from 'electron-updater';

autoUpdater.checkForUpdatesAndNotify();
```

Hoste Updates auf GitHub Releases oder deinem Server.

---

## 💡 Tipps für Verkauf

1. **Kostenlose Demo-Version** - Begrenzte Lektionen
2. **Premium-Version** - Alle Inhalte, Eltern-Features
3. **Schullizenzen** - Rabatte für Schulen
4. **Abonnement-Modell** - Monatliche/Jährliche Updates

---

## 📝 Lizenz

Stelle sicher, dass deine App eine klare Lizenz hat (MIT, GPL, Proprietary, etc.)

---

**Viel Erfolg beim Verkauf! 🎉**
