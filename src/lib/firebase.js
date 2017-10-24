import firebase from 'firebase';
import config from './config.json';
require('firebase/firestore');

firebase.initializeApp(config);

export default firebase;
export const auth = firebase.auth();
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
export const db = firebase.firestore();
export const msg = firebase.messaging();
export const svtime = firebase.database.ServerValue.TIMESTAMP;
