import { createStore } from 'mobx-app';
import { Provider } from 'mobx-react';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './app';
import * as stores from './stores/index';

const providerProps = createStore(stores);

ReactDOM.render(<Provider {...providerProps}><App /></Provider>, document.body);
