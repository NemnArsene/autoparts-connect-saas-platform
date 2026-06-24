# AutoParts Connect — Monorepo

> Marketplace de pièces automobiles pour l'Afrique de l'Ouest  
> **Stack:** Turborepo · React (Web) · React Native Expo (Mobile) · NestJS · MongoDB

---

## Structure du Monorepo

```
apps/
  web/     → Application Web React/Vite (PWA + Backoffice admin)
  mobile/  → Application Mobile Expo (React Native Paper + Expo Router)
  api/     → API NestJS + MongoDB (scaffold — Phase 5)

packages/
  models/      → Types TypeScript + mock data
  shared/      → Utilitaires partagés
  hooks/       → Hooks métier cross-platform (Zustand + StorageAdapter)
  validators/  → Schemas Zod partagés
  services/    → Couche API (mocks)
  ui-core/     → Tokens de design partagés
```

---

## 🚀 Comment tester le projet

### Prérequis
- [Node.js](https://nodejs.org/) (version 18+)
- [pnpm](https://pnpm.io/installation) installé globalement (`npm install -g pnpm`)
- Pour tester le mobile: L'application **Expo Go** installée sur votre smartphone (Android/iOS) ou un émulateur.

### 1. Installation des dépendances
À la racine du projet, exécutez :
```bash
pnpm install
```

### 2. Lancer l'Application Web
Pour voir l'interface Web (prototype fonctionnel) :
```bash
pnpm --filter @autoparts/web dev
```
> Ouvrez votre navigateur sur `http://localhost:5173`. L'interface réagit exactement de la même manière qu'auparavant, mais la logique métier est désormais gérée par les hooks du monorepo !

### 3. Lancer l'Application Mobile (Expo)
Pour démarrer l'application mobile React Native :
```bash

```
- Un code QR va s'afficher dans le terminal.
- **Sur Android** : Scannez-le avec l'application "Expo Go".
- **Sur iOS** : Scannez-le avec l'appareil photo de votre iPhone.
- L'application mobile (HomeScreen, Recherche, Panier, Profil, etc.) se lancera sur votre téléphone.

---

## 📦 Comment générer un APK Android (EAS Build)

Pour générer un fichier `.apk` installable sur n'importe quel téléphone Android sans passer par le store, nous utilisons **EAS (Expo Application Services)**.

### Étape 1 : Préparer EAS
Installez le CLI d'EAS et connectez-vous (il vous faut un compte gratuit sur expo.dev) :
```bash
npm install -g eas-cli
eas login
```

### Étape 2 : Configurer le projet mobile
Placez-vous dans le dossier de l'application mobile et configurez EAS :
```bash
cd apps/mobile
eas build:configure
```
> Sélectionnez "Android" et laissez EAS générer le fichier `eas.json`.

### Étape 3 : Modifier le fichier `eas.json`
Pour forcer la génération d'un APK (au lieu d'un fichier .aab pour le Play Store), assurez-vous que votre fichier `apps/mobile/eas.json` contient le profil suivant :
```json
{
  "build": {
    "preview": {
      "android": {
        "buildType": "apk"
      }
    }
  }
}
```

### Étape 4 : Lancer le build dans le cloud
Exécutez la commande suivante depuis le dossier `apps/mobile` :
```bash
eas build -p android --profile preview
```
- EAS va uploader votre code sur ses serveurs et compiler l'APK.
- Vous pourrez suivre la progression en direct via un lien généré dans votre terminal.
- Une fois terminé, **un lien de téléchargement de l'APK** vous sera fourni. Vous pourrez le télécharger et l'installer sur votre téléphone Android.

---

## Phases d'implémentation

| Phase | Description | Statut |
|-------|-------------|--------|
| 1 | Scaffold monorepo + `packages/models` | ✅ Terminé |
| 2 | Hooks métier partagés + Services | ✅ Terminé |
| 3 | Expo Bootstrap + Navigation | ✅ Terminé |
| 4 | Écrans mobile (UI complète) | ✅ Terminé |
| 5 | NestJS + MongoDB + Déploiement API | 🔜 En attente |
