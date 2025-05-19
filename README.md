# Lumora – Your Daily Reflection Companion

**Lumora** is a **Progressive Web App (PWA)** designed to support mindful living through daily affirmations and journaling. Built with **React**, **TypeScript**, **Vite**, and **Firebase**, Lumora empowers users to reflect, grow, and stay motivated every day.

Find the live app here: https://lumora-online-journal.web.app/

---

## Features

- **Secure Authentication**  
  Sign up and log in securely with Firebase Authentication.

- **Online Journaling**  
  Write, read, and edit your journal entries anytime, anywhere.

- **Daily Affirmations**  
  Receive uplifting affirmations upon logging in.

- **Favorite Affirmations**  
  Mark affirmations as favorites and access them in a dedicated list.

- **Streak Tracker**  
  Build and maintain a journaling streak to stay motivated.

- **Profile Management**  
  Edit your profile information or delete your account entirely.

- **PWA Support**  
  Install Lumora on your device for a native app-like experience.

---

## Tech Stack

- **Frontend**: [React](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/), [Shadcn UI](https://ui.shadcn.com/)
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/)
- **Backend & Authentication**: [Firebase](https://firebase.google.com/)
- **Data Storage**: Firebase Firestore
- **Environment**: [Node.js](https://nodejs.org/) (v18+ recommended)

---

## Getting Started

### 1. Clone the repository

```
bash
git clone https://github.com/lenachat/lumora.git
cd lumora 
```

### 2. Install dependencies

Make sure you have Node.js and npm installed.

```
npm install
```

### 3. Set up Firebase

- Create a project in Firebase Console.
- Enable Authentication (Email/Password and optionally Google).
- Set up Firestore Database.
- Create a firebase.ts file in the root directory and add the following variables from your console:

```
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: YOUR_API_KEY,
  authDomain: YOUR_AUTH_DOMAIN,
  projectId: YOUR_PROJECT_ID,
  storageBucket: YOUR_STORAGE_BUCKET,
  messagingSenderId: YOUR_MESSAGING_SENDER_ID,
  appId: YOUR_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
```

### 4. Run the App

``` 
npm run dev 
```

### 5. Build for production

```
npm run build
```

### 6. Start journaling!

You're all set! Log in to Lumora, receive your daily affirmation, and begin writing your thoughts in your journal. Track your streak, reflect daily, and enjoy the journey toward mindfulness.

