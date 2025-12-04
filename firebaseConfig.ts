import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getAnalytics, isSupported } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { getReactNativePersistence, initializeAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyD2G0lmjsNeJ94l6y368E7v4vDcZdJCvUY",
    authDomain: "myfinance-f279c.firebaseapp.com",
    databaseURL: "https://myfinance-f279c.firebaseio.com",
    projectId: "myfinance-f279c",
    storageBucket: "myfinance-f279c.firebasestorage.app",
    messagingSenderId: "781311796228",
    appId: "1:781311796228:web:a526b587cf2667493f0151",
    measurementId: "G-CWMZFYHYLJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth with persistence
// Initialize Auth
// Use initializeAuth with persistence for React Native
const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

const db = getFirestore(app);

let analytics;
isSupported().then((supported) => {
    if (supported) {
        analytics = getAnalytics(app);
    }
});

export { analytics, auth, db };

