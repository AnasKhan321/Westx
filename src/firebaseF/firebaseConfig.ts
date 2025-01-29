// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth, TwitterAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_PUBLIC_API_KEY,
    authDomain: import.meta.env.VITE_PUBLIC_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_PUBLIC_PROJECT_ID,
    storageBucket: import.meta.env.VITE_PUBLIC_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_PUBLIC_MEASUREMENT_ID,
    appId: import.meta.env.VITE_PUBLIC_APP_ID,
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const twitterProvider = new TwitterAuthProvider();

export { auth, twitterProvider, signInWithPopup };
