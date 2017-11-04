import { Service } from 'react-services-injector';
import { db } from '../lib/firebase';

class OrgService extends Service {

	loading = true;
	collection = [];

	init = () => {
		let uid = this.services.AuthService.user.uid;
		db.collection('users').doc(uid).get()
			.then((doc) => {
				if (doc.exists) {
					let organisations = doc.data().organisations;
					this.collection = organisations.map((item) => item.ref);
				}
				
				this.loading = false;
				this.$update();
			})
			.catch((error) => {

			});
	}
}

OrgService.publicName = 'OrgService';

export default OrgService;
