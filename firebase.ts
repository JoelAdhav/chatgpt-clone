import { getApp, getApps, initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: 'AIzaSyB1GUUUYpKOex9vW8YOuTEWYqPss3JeJyU',
    authDomain: 'chatgpt-37bfd.firebaseapp.com',
    projectId: 'chatgpt-37bfd',
    storageBucket: 'chatgpt-37bfd.appspot.com',
    messagingSenderId: '40858140340',
    appId: '1:40858140340:web:bf1cb9ccdf115ce8c5e1e1',
    measurementId: 'G-JSVWTS0T5P',
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
