import 'babel-polyfill';
import 'url-search-params-polyfill';
import 'whatwg-fetch';

// React
import React from 'react';
import { render } from 'react-dom';

// Redux Store
import { configureStore, history } from './store/configureStore';

import Root from './containers/Root';

import './assets/stylesheets/base.less';

const store = configureStore(history);

render(
	<Root store={store.store} persistor={store.persistor} history={history} />,
	document.getElementById('root')
);
