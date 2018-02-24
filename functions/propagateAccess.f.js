const admin = require('firebase-admin');
const functions = require('firebase-functions');

const db = admin.firestore();

export default functions.firestore.document('organisations/{orgId}/users/{uid}').onWrite((event) => {
	const { orgId, uid } = event.params;
	const ref = db.doc(`users/${uid}/organisations/${orgId}`);
	return event.data.exists ? ref.set(event.data.data()) : ref.delete();
});