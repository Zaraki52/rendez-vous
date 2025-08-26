import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyALCdjN6WmNRbpUHZ7ty_eggaUxsOCFTuw",
  authDomain: "rendez-vous-d536b.firebaseapp.com",
  projectId: "rendez-vous-d536b",
  storageBucket: "rendez-vous-d536b.firebasestorage.app",
  messagingSenderId: "129090099163",
  appId: "1:129090099163:web:9a9edf464698a9d96139fe",
  measurementId: "G-ELPFVGXCF2"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
