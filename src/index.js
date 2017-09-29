import './style';
import App from './components/app';

import { injector } from 'react-services-injector';
import services from './services';

injector.register(services);

export default App;
