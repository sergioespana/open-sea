import { Service } from 'react-services-injector';
import { auth, googleAuthProvider } from '../lib/firebase';

class AuthService extends Service {
	user = false;
	loading = true;

	serviceDidConnect = () => auth.onAuthStateChanged(this.onAuthStateChanged);

	createUserWithEmailAndPassword = (email, pass) => auth.createUserWithEmailAndPassword(email, pass);

	signInWithEmailAndPassword = (email, pass) => auth.signInWithEmailAndPassword(email, pass);

	signInWithGoogle = () => auth.signInWithPopup(googleAuthProvider);

	signOut = () => auth.signOut();

	isAuthed =  () => this.user !== false;

	onAuthStateChanged = (user) => {
		this.user = user || false;
		if (this.loading) this.loading = false;
		this.$update();

		if (user && this.services.OrgService.loading) this.services.OrgService.init();
	}
}

AuthService.publicName = 'AuthService';

export default AuthService;
