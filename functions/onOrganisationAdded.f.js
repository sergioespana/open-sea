const admin = require('firebase-admin');
const functions = require('firebase-functions');

const db = admin.firestore();

export default functions.firestore.document('organisations/{orgId}').onCreate(async (event) => {
	const { orgId } = event.params;
	const data = event.data.data();
	const owner = data.owner;

	await db.doc(`organisations/${orgId}/users/${owner}`).set({ role: 'owner', added: new Date() });
	return db.doc(`organisations/${orgId}`).update({ owner: admin.firestore.FieldValue.delete() });
});