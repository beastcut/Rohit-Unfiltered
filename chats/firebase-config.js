// Your Firebase config (replace with your real values)
const firebaseConfig = {
  apiKey: "AIzaSyAPhlmCS7t_NV7VqhRtOiFGp1QFhLzqMh4",
  authDomain: "chat-7b8fc.firebaseapp.com",
  projectId: "chat-7b8fc",
  storageBucket: "chat-7b8fc.firebasestorage.app",
  messagingSenderId: "604456029175",
  appId: "1:604456029175:web:f61e014fe2113671a7bcf2"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firestore
const db = firebase.firestore();