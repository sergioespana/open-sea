import './style';
import App from './components/app';

import 'linkstate/polyfill';

import { injector } from 'react-services-injector';
import services from './services';
injector.register(services);

export default App;
