
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyAmEKdKG8UebthiIu8HTj5kpIPJXyNoLkU',
  authDomain: 'topicosespeciaislj.firebaseapp.com',
  projectId: 'topicosespeciaislj',
  storageBucket: 'topicosespeciaislj.appspot.com',
  messagingSenderId: '932310873542',
  appId: '1:932310873542:web:07a078ae8581c0dcb36ec7'
};

let firebaseApp;

if (!getApps) {
  firebaseApp = initializeApp(firebaseConfig);
}

const auth = getAuth(firebaseApp);
const firestore = getFirestore(firebaseApp);

export { auth, firestore };