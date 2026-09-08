# Mitrra — Technical Setup Guide

This document walks through setting up the entire project from a completely empty machine — every command, every package, and why each one is needed. This project has two parts: `backend/` (Node.js/Express API) and `mobile/` (React Native/Expo app). They are set up and run independently.

---

## 1. Prerequisites

Install these before touching the project:

- **Node.js** (v18 or newer) — the JavaScript runtime both the backend and the Expo tooling run on. Download from nodejs.org.
- **npm** — comes bundled with Node.js, used to install all packages.
- **Git** — for version control and pushing to GitHub/Railway.
- **Expo Go app** (on your phone, from the Play Store/App Store) — only needed for early-stage testing before native modules were added. Later stages of this project require a custom Development Build instead (explained in section 5).
- **A code editor** — VS Code recommended.

You will also need free accounts on:
- **MongoDB Atlas** (database)
- **Google AI Studio** (Gemini API key, for script generation)
- **VoiceRSS** (text-to-speech API key)
- **Hugging Face** (image generation API key)
- **Firebase** (for push notifications)
- **Railway** (backend hosting)
- **Expo/EAS** (for building the mobile app)

---

## 2. Backend Setup — From Scratch

### 2.1 Initialize the project

```bash
mkdir backend
cd backend
npm init -y
```
`npm init -y` creates a `package.json` file with default values — this is the manifest that tracks every dependency the backend needs.

### 2.2 Install core dependencies

```bash
npm install express mongoose dotenv cors
```

| Package | Why it's used |
|---|---|
| `express` | The web framework that handles HTTP routes (`/api/auth`, `/api/topics`, etc.) |
| `mongoose` | An ODM (Object-Document Mapper) that lets us define schemas and interact with MongoDB using JavaScript objects instead of raw queries |
| `dotenv` | Loads secret configuration (API keys, database URLs) from a `.env` file into `process.env`, keeping secrets out of the codebase |
| `cors` | Allows the mobile app (running on a different origin) to make requests to this API without being blocked by browser/network security rules |

```bash
npm install -D nodemon
```
`nodemon` (dev dependency only) automatically restarts the server whenever a file changes, so you don't have to manually stop/start it during development.

### 2.3 Authentication packages

```bash
npm install bcryptjs jsonwebtoken
```

| Package | Why it's used |
|---|---|
| `bcryptjs` | Hashes passwords before storing them in the database — never store plain-text passwords |
| `jsonwebtoken` | Generates and verifies JWT (JSON Web Tokens) — this is how the app knows a request is coming from a logged-in user |

```bash
npm install express-rate-limit
```
`express-rate-limit` throttles how many login/signup attempts a single IP can make in a time window, protecting against brute-force attacks.

### 2.4 Content ingestion packages

```bash
npm install rss-parser
```
`rss-parser` reads RSS/XML feed URLs and converts them into clean JavaScript objects (title, link, publish date, etc.) — this powers the "RSS Feed" source type.

```bash
npm install cheerio
```
`cheerio` parses raw HTML using jQuery-like syntax, letting us pull out a page's title, description, and body text from a pasted link — this powers the "From Link" source type.

```bash
npm install axios
```
`axios` is an HTTP client used throughout the backend to call external APIs (RSS feeds, link scraping, TTS services, image generation services).

### 2.5 AI & media generation packages

```bash
npm install @google/generative-ai
```
The official Google SDK used to call the **Gemini** model, which turns ranked articles into a natural, conversational podcast script.

```bash
npm install @huggingface/inference
```
Used to call Hugging Face's hosted **Stable Diffusion XL** model, which generates a unique cover image for each episode based on its content.

*(Text-to-speech uses VoiceRSS via plain `axios` calls — no dedicated SDK needed.)*

### 2.6 File handling

```bash
npm install multer
```
`multer` handles `multipart/form-data` uploads — this is how profile picture uploads are received and saved on the server.

```bash
npm install get-mp3-duration
```
Reads the generated MP3's metadata to calculate its exact playback duration in seconds, which is stored on the episode and shown in the app.

### 2.7 Scheduling

```bash
npm install node-cron
```
Runs a recurring background job (checked every minute) that sends scheduled push notifications at the time each user has configured.

### 2.8 Environment variables (`.env`)

Create a `.env` file in `backend/` (never commit this file):

```
PORT=3000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=a_long_random_string
JWT_EXPIRES_IN=7d
GEMINI_API_KEY=your_gemini_key
VOICERSS_API_KEY=your_voicerss_key
HUGGINGFACE_API_KEY=your_huggingface_key
SERVER_BASE_URL=https://your-deployed-url.up.railway.app
```

### 2.9 Run the backend locally

```bash
npm run dev
```
This runs `nodemon src/server.js` (defined in `package.json` scripts), starting the API on `http://localhost:3000` and auto-restarting on file changes.

To run it the way production does (no auto-restart):
```bash
npm start
```

---

## 3. MongoDB Atlas Setup

1. Create a free cluster at cloud.mongodb.com.
2. Create a database user (username + password).
3. Under **Network Access**, add `0.0.0.0/0` (Allow Access from Anywhere) — otherwise neither your local machine nor Railway's servers can reach the database.
4. Copy the connection string from **Connect → Drivers**, and paste it into `MONGO_URI` in `.env`, replacing `<username>`/`<password>` with your actual credentials and adding your database name before the `?` query string.

---

## 4. Mobile App Setup — From Scratch

### 4.1 Initialize the project

```bash
npx create-expo-app mobile
cd mobile
```
This scaffolds a new Expo project with a default file structure.

### 4.2 Navigation & state management

```bash
npx expo install expo-router
npm install zustand
```

| Package | Why it's used |
|---|---|
| `expo-router` | File-based navigation — every file in the `app/` folder automatically becomes a route/screen |
| `zustand` | A lightweight global state manager — used for auth state, theme, player state, downloads, etc., without the boilerplate of Redux |

### 4.3 Audio playback

```bash
npx expo install expo-audio
```
The official Expo audio module. Handles loading, playing, pausing, seeking, and background playback of episode audio. (Note: this project originally used the older `expo-av`, which was deprecated in SDK 53+ — `expo-audio` is its replacement.)

### 4.4 UI & interaction libraries

```bash
npm install lucide-react-native
npx expo install react-native-svg
```
`lucide-react-native` provides all icons used across the app (play, pause, trash, settings icons, etc.). It depends on `react-native-svg` to render.

```bash
npm install @gorhom/bottom-sheet
npx expo install react-native-gesture-handler react-native-reanimated
```
`@gorhom/bottom-sheet` powers every slide-up sheet in the app (Add Source, Add Topic Item, Set Notification Time). It requires `react-native-gesture-handler` (for swipe gestures) and `react-native-reanimated` (for smooth animations) as peer dependencies.

> After installing `react-native-reanimated`, its Babel plugin must be added to `babel.config.js`, and the root layout must be wrapped in `GestureHandlerRootView`.

```bash
npx expo install react-native-pager-view
```
Powers the swipeable Player/Transcript tabs on the episode screen.

```bash
npx expo install expo-linear-gradient
```
Used for the gradient backgrounds and buttons that give the app its "premium" visual feel.

### 4.5 Device & storage APIs

```bash
npx expo install expo-secure-store
```
Stores the authentication JWT token in encrypted device storage — safer than plain AsyncStorage for sensitive data.

```bash
npx expo install expo-image-picker
```
Lets users pick a photo from their gallery for their profile picture.

```bash
npx expo install expo-file-system
```
Used for two things: downloading episodes for offline playback (`downloadAsync`/`createDownloadResumable`), and uploading the profile picture to the backend (`uploadAsync`, which avoids a known compatibility issue with plain `fetch` + `FormData` on newer React Native versions).

### 4.6 Push notifications

```bash
npx expo install expo-notifications expo-device
```

| Package | Why it's used |
|---|---|
| `expo-notifications` | Requests notification permissions, registers the device for push notifications, and handles incoming notifications |
| `expo-device` | Checks whether the app is running on a real physical device (push tokens don't work on simulators) |

> Push notifications require a Firebase project (see section 6) and **cannot** be tested in Expo Go on Android since SDK 53 — a custom Development Build is required (see section 5).

### 4.7 Navigation bar & status bar polish

```bash
npx expo install expo-navigation-bar expo-status-bar
```
Used to hide the Android 3-button navigation bar for an immersive look, and to switch the status bar's icon color to match light/dark theme.

### 4.8 Environment variables (frontend)

Unlike the backend, Expo apps don't use a `.env` file for runtime config in the same way — instead, `mobile/api/config.js` hardcodes the API base URL:

```js
export const API_BASE_URL = 'https://your-deployed-backend-url.up.railway.app/api';
```

During early local development, this pointed to a local IP address (e.g. `http://192.168.x.x:3000/api`) so the phone (on the same WiFi/hotspot) could reach the laptop's backend. Once the backend was deployed, this was switched to the permanent Railway URL.

### 4.9 Run the app locally (Expo Go — early stage only)

```bash
npx expo start
```
Scan the QR code with the Expo Go app. This only works before native modules (audio, notifications, file system, etc.) were added — after that, a Development Build is required.

---

## 5. Development Build (EAS) — Required After Native Modules Are Added

Expo Go is a general-purpose sandbox app — it cannot include custom native modules like Firebase. Once features like push notifications were added, testing had to switch to a **Development Build**: a custom version of the app, built specifically for this project, that *can* include those native modules.

### 5.1 Install EAS CLI and log in

```bash
npm install -g eas-cli
eas login
```

### 5.2 Configure the project for EAS

```bash
eas build:configure
```
This generates `eas.json`, which defines build profiles (`development`, `preview`, `production`).

### 5.3 Build a development client

```bash
eas build --profile development --platform android --clear-cache
```
This builds an installable `.apk` in the cloud (Expo's build servers) that includes all native modules. `--clear-cache` avoids stale cached dependencies from previous builds.

### 5.4 Install and run

Download the generated APK link onto the phone and install it. Then, instead of Expo Go, run:

```bash
npx expo start --dev-client
```
and scan the QR code using the newly installed custom app (not Expo Go).

---

## 6. Firebase Setup (Required for Push Notifications)

1. Create a project at console.firebase.google.com.
2. Add an Android app, using the **exact** package name from `app.json`/`app.config.js` (`android.package`).
3. Download the generated `google-services.json`.
4. Because this file contains sensitive project configuration and should not be committed to a public repo, it was uploaded to EAS as a secure file-type environment variable instead:

```bash
eas env:set --name GOOGLE_SERVICES_JSON --type file --value ./google-services.json --environment development
```

5. In `app.config.js`, the config dynamically references it:
```js
googleServicesFile: process.env.GOOGLE_SERVICES_JSON || "./google-services.json",
```
This uses the EAS-injected file during cloud builds, and falls back to the local file during local development.

6. Because `app.json` is static JSON and cannot reference `process.env`, the project was converted from `app.json` to `app.config.js` (a JavaScript file), which supports dynamic values.

---

## 7. Production Build (Standalone APK)

A Development Build still requires the Metro bundler (`npx expo start --dev-client`) running on a computer to serve JavaScript. For a completely standalone app that works without any computer connection, a **production-style build** is needed.

```bash
eas build --profile preview --platform android
```

In `eas.json`, the `preview` profile is configured to output an installable `.apk` directly (instead of Play Store's `.aab` format):
```json
"preview": {
  "distribution": "internal",
  "android": { "buildType": "apk" }
}
```

If the app uses Firebase, the `GOOGLE_SERVICES_JSON` secret must also be registered for this environment:
```bash
eas env:set --name GOOGLE_SERVICES_JSON --type file --value ./google-services.json --environment preview
```

This APK can be shared directly — installing it does not require Expo Go, a Development Build, or the Play Store.

---

## 8. Deploying the Backend (Railway)

1. Push the `backend/` folder to its own GitHub repository (with `.env`, `node_modules/`, and `uploads/` in `.gitignore`).
2. On railway.app, create a **New Project → Deploy from GitHub repo**, selecting that repository.
3. If the backend lives in a subfolder of a monorepo, set **Settings → Root Directory** to `/backend` so Railway knows where `package.json` is.
4. Under the **Variables** tab, add every key from the local `.env` file (Railway injects these directly into `process.env` — no `.env` file is deployed).
5. Under **Settings → Networking**, click **Generate Domain** to get a public HTTPS URL for the API.
6. Update the `SERVER_BASE_URL` variable with that same generated domain, and update `mobile/api/config.js` to point to it.
7. In MongoDB Atlas, confirm `0.0.0.0/0` is in the IP Access List — Railway's servers use dynamic IPs that must be allowed through.

Any future `git push` to the connected branch automatically triggers a new deployment.

---

## 9. Quick Command Reference

| Task | Command |
|---|---|
| Start backend (dev, auto-restart) | `cd backend && npm run dev` |
| Start backend (prod-style, no auto-restart) | `cd backend && npm start` |
| Start mobile app (Expo Go — early stage only) | `cd mobile && npx expo start` |
| Start mobile app (Development Build) | `cd mobile && npx expo start --dev-client` |
| Clear Metro cache and restart | `npx expo start -c` |
| Install a package that includes native code | `npx expo install <package-name>` |
| Install a pure JS package | `npm install <package-name>` |
| Build a development client | `eas build --profile development --platform android --clear-cache` |
| Build a standalone/shareable APK | `eas build --profile preview --platform android` |
| Set a secret file for EAS builds | `eas env:set --name <NAME> --type file --value <path> --environment <env>` |
| Check installed/outdated Expo packages | `npx expo install --check` |
| Diagnose common project issues | `npx expo-doctor` |