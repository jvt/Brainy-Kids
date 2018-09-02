import React from 'react';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import { PersistGate } from 'redux-persist/integration/react';

import Routes from '../Routes';
import DevTools from '../components/DevTools';

import Helmet from 'react-helmet';

const Root = ({ store, persistor, history }) => {
	return (
		<Provider store={store}>
			<PersistGate loading={null} persistor={persistor}>
				<ConnectedRouter history={history}>
					<div style={{ minHeight: '100vh', width: '100%' }}>
						<main>
							<Helmet>
								<meta charSet="utf-8" />
								<title>Brainy Kids</title>
							</Helmet>
							<Routes />
							{process.env.NODE_ENV !== 'production' && (
								<DevTools />
							)}
						</main>
					</div>
				</ConnectedRouter>
			</PersistGate>
		</Provider>
	);
};

export default Root;
