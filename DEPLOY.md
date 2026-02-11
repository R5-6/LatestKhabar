# Latest Khabar - Production Deployment Guide

## Prerequisites

- Node.js 20+
- pnpm (`npm install -g pnpm`)
- Firebase CLI (`npm install -g firebase-tools`)
- A Firebase project with Firestore, Auth (Email/Password), and Storage enabled

---

## Step 1: Firebase Project Setup

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project (or use existing)
3. Enable **Authentication** > **Email/Password** sign-in method
4. Enable **Cloud Firestore** in production mode
5. Enable **Cloud Storage**
6. Go to **Project Settings** > **General** > scroll to "Your apps" > click **Web** icon
7. Register your app and copy the config values

---

## Step 2: Environment Variables

```bash
cp .env.example .env.local
```

Fill in all `NEXT_PUBLIC_FIREBASE_*` values from Step 1.

---

## Step 3: Create Admin User

1. In Firebase Console > **Authentication** > **Add user**
2. Use `admin@latestkhabar.xyz` with a strong password
3. Copy the user UID
4. In **Firestore** > create collection `users` > add document with:
   - Document ID: `<user-uid-from-step-3>`
   - Fields:
     - `email` (string): `admin@latestkhabar.xyz`
     - `displayName` (string): `Admin`
     - `role` (string): `admin`
     - `createdAt` (string): current ISO date

---

## Step 4: Firestore Security Rules

1. Go to **Firestore** > **Rules** tab
2. Copy the contents of `firestore.rules.example` and paste
3. Click **Publish**

---

## Step 5: Local Development

```bash
pnpm install
pnpm dev
```

Visit `http://localhost:3000` for the frontend, `http://localhost:3000/admin/login` for the admin panel.

---

## Step 6: Build for Production

```bash
pnpm build
```

---

## Step 7: Deploy to Firebase Hosting

### Option A: Manual Deploy

```bash
firebase login
firebase init hosting   # Select your project, use defaults
firebase deploy --only hosting
```

### Option B: GitHub Actions (Recommended)

1. In Firebase Console > **Project Settings** > **Service accounts** > **Generate new private key**
2. In your GitHub repo > **Settings** > **Secrets and variables** > **Actions**, add these secrets:
   - `FIREBASE_SERVICE_ACCOUNT` - paste the entire JSON key
   - `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `NEXT_PUBLIC_FIREBASE_APP_ID`
3. Push to `main` branch -- the workflow at `.github/workflows/firebase-deploy.yml` will auto-deploy.

---

## Step 8: Custom Domain

1. Firebase Console > **Hosting** > **Add custom domain**
2. Enter `latestkhabar.xyz`
3. Add the DNS records shown to your domain provider
4. Wait for SSL provisioning (can take up to 24 hours)

---

## Build Command Reference

| Command        | Description                  |
| -------------- | ---------------------------- |
| `pnpm dev`     | Start dev server             |
| `pnpm build`   | Production build             |
| `pnpm start`   | Start production server      |
| `pnpm lint`    | Run ESLint                   |
