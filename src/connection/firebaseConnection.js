
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyAmEKdKG8UebthiIu8HTj5kpIPJXyNoLkU',
  authDomain: 'topicosespeciaislj.firebaseapp.com',
  projectId: 'topicosespeciaislj',
  storageBucket: 'topicosespeciaislj.appspot.com',
  messagingSenderId: '1:77121295468:web:38ef199c81f31f44087449',
  appId: ''
};

let firebaseApp;

//if (!getApps) {
  firebaseApp = initializeApp(firebaseConfig);
//}

const auth = getAuth(firebaseApp);
const firestore = getFirestore(firebaseApp);

export { auth, firestore };