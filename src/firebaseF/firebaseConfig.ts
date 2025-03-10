import { initializeApp } from "firebase/app";
import { getAuth, TwitterAuthProvider, signInWithPopup } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
const firebaseConfig = {
    apiKey: "AIzaSyAr8Jh64XsRlvwk8IsSyaKMxCZOl3l9FiY",
    authDomain: "westx-web.firebaseapp.com",
    projectId: "westx-web",
    storageBucket: "westx-web.appspot.com",
    messagingSenderId: "714488118103",
    appId: "1:714488118103:web:23ddf70a606a9b5dbf1c12",
    measurementId: "G-00HFE793PW"
  };
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const analytics = getAnalytics(app);
const twitterProvider = new TwitterAuthProvider();


export { auth, twitterProvider, signInWithPopup   , analytics};
