// Import the functions you need from the SDKs you need
const test = false
const API_URL = test ? 'http://localhost:8000' : import.meta.env.VITE_API_URL ?? 'http://localhost:8000' 
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use

// https://firebase.google.com/docs/web/setup#available-libraries


// Your web app's Firebase configuration

const firebaseConfig = {

  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,

  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,

  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,

  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,

  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,

  appId: import.meta.env.VITE_FIREBASE_APP_ID

};


// Initialize Firebase

const app = initializeApp(firebaseConfig);

const auth = getAuth(app)

export const signIn = async () => {

    const provider = new GoogleAuthProvider();

    try {

      const result = await signInWithPopup(auth, provider);

      // Retrieve the Firebase ID token
      console.log('sign in result:', result);
      const idToken = await result.user.getIdToken();

      

      // Send this token to your FastAPI backend

      const response = await fetch(`${API_URL}/api/secure`, {

        headers: { Authorization: `Bearer ${idToken}` }

      });

      const data = await response.json();

      console.log(data);

      //add to the context
      // setUser(result.user);
      return data


    } catch (error) {

      console.error("Sign-in failed", error);

      return null

    }

  };

