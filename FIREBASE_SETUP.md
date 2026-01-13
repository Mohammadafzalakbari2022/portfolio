# Firebase and Environment Setup Guide

This guide explains how to set up Firebase for your project and configure environment variables (`.env`) for both local development and deployment.

## 1. Firebase Setup

1.  **Create a Project**: Go to the [Firebase Console](https://console.firebase.google.com/) and click **Add project**. Follow the prompts.
2.  **Register Web App**:
    *   In your project overview, click the **Web icon (</>)**.
    *   Give your app a nickname (e.g., "My Portfolio") and click **Register app**.
3.  **Get Configuration**:
    *   You will see a code snippet with `firebaseConfig`.
    *   **Do not copy the code yet.** Just keep this screen open or copy the values inside `firebaseConfig` (apiKey, authDomain, etc.).

## 2. Setting up `.env` (Local Development)

The `.env` file stores your sensitive keys locally. It is ignored by Git properly now, so it won't be pushed to GitHub.

1.  **Create the File**:
    *   In VS Code, create a new file named `.env` in the root folder of your project (where `package.json` is).
    *   You can also copy the `env.example` file and rename it to `.env`.
2.  **Fill the Values**:
    *   Copy the keys from your Firebase Console Config and paste them into `.env`.
    *   Ensure they match the format in `.env.example`:

    ```env
    VITE_FIREBASE_API_KEY=AIzaSy...
    VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
    VITE_FIREBASE_PROJECT_ID=your-project-id
    VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
    VITE_FIREBASE_MESSAGING_SENDER_ID=123456...
    VITE_FIREBASE_APP_ID=1:123456...
    ```

## 3. Hosting with Firebase

Firebase Hosting provides fast, secure hosting. Since you are using a Vite app (Single Page Application), follow these steps:

1.  **Install tools**:
    *   Run `npm install -g firebase-tools` (if you haven't already).
2.  **Login**:
    *   Run `firebase login` and follow the browser prompt.
3.  **Initialize**:
    *   Run `firebase init hosting`.
    *   **Public directory**: Type `dist` and press Enter.
    *   **Configure as a single-page app**: Type **Yes** (y).
    *   **Set up automatic builds and deploys with GitHub?**: Type **Yes** (y).
4.  **Deploy Manually**:
    *   Run `npm run build`
    *   Run `firebase deploy`

## 4. Environment Variables in Production

When deploying via GitHub Actions:
1.  Go to your GitHub Repository > **Settings** > **Secrets and variables** > **Actions**.
2.  Add "Repository secrets" for each line in your `.env` file.

## 5. Creating Your Admin User (First Login)

The login page (`/login`) connects to your Firebase Authentication system. There is no public "Sign Up" page because only YOU should be the admin.

1.  **Enable Authentication**:
    *   Go to **Firebase Console** > **Authentication**.
    *   Click **Get Started**.
    *   Click **Sign-in method**.
    *   Enable **Email/Password**.
2.  **Create Your User**:
    *   Go to the **Users** tab.
    *   Click **Add user**.
    *   Enter your desired email (e.g., `admin@myportfolio.com`) and a strong password.
    *   Click **Add user**.
3.  **Log In**:
    *   Go back to your running website (e.g., `localhost:5173/login`).
    *   Enter the email and password you just created.
    *   You should be redirected to the Admin Dashboard!
