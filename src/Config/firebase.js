// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDKp0AGXbJawqiN7pKOiy44ufgHCq_EfrE",
  authDomain: "car-rental-9b4a5.firebaseapp.com",
  projectId: "car-rental-9b4a5",
  storageBucket: "car-rental-9b4a5.appspot.com",
  messagingSenderId: "411175515802",
  appId: "1:411175515802:web:abe63849ccc2e06c0e5123",
  measurementId: "G-8MB1GW8LEM"
};

const app = initializeApp(firebaseConfig);
export const storage=getStorage(app)