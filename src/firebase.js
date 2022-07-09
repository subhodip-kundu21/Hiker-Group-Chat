import { initializeApp } from "firebase/app";
const firebaseConfig = {
  apiKey: "AIzaSyASGOuiIBwQA7-tY9I_WXTgwUTFcYusCkc",
  authDomain: "chat-application-project-bfe26.firebaseapp.com",
  projectId: "chat-application-project-bfe26",
  storageBucket: "chat-application-project-bfe26.appspot.com",
  messagingSenderId: "43772195961",
  appId: "1:43772195961:web:3a517c0b558182778f50a8"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);