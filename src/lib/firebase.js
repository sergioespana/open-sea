import firebase from 'firebase';
require('firebase/firestore');

firebase.initializeApp({
	apiKey: "AIzaSyBZNfmczPY3fG1m04vDJ0St4eLBcpcLmek",
	authDomain: "seaman-auth.firebaseapp.com",
	databaseURL: "https://seaman-auth.firebaseio.com",
	projectId: "seaman-auth",
	storageBucket: "seaman-auth.appspot.com",
	messagingSenderId: "623156714980"
});

export default firebase;
export const auth = firebase.auth();
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
export const db = firebase.firestore();
export const msg = firebase.messaging();
export const svtime = firebase.database.ServerValue.TIMESTAMP;
