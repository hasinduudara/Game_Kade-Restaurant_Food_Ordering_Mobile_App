import { initializeApp } from 'firebase/app';
// @ts-ignore
import { initializeAuth, getReactNativePersistence, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
    apiKey: "AIzaSyB0Mjb-RPmcmIqc86tUG6wxtyduutLyoeU",
    authDomain: "game-kade.firebaseapp.com",
    projectId: "game-kade",
    storageBucket: "game-kade.firebasestorage.app",
    messagingSenderId: "671726402324",
    appId: "1:671726402324:web:3513a6c9cf6c915b7b6001",
    measurementId: "G-X71KMXMMHC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const auth: Auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
});

export const db: Firestore = getFirestore(app);