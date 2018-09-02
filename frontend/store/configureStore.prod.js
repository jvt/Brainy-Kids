import { createStore, compose, applyMiddleware } from 'redux';
import createHistory from 'history/createBrowserHistory';

import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import { createBlacklistFilter } from 'redux-persist-transform-filter';

import { routerMiddleware } from 'react-router-redux';

import thunk from 'redux-thunk';

import rootReducer from '../reducers/index';

/**
 * We need to do this so that we can ensure clients always have the latest data
 * on page load. We keep the `token` since that's required for refreshing the
 * user data object, but the actual user data isn't persisted across page
 * refreshes
 */
const blacklistSystemActions = createBlacklistFilter('system', ['loading']);

const persistConfig = {
	key: 'root',
	transforms: [blacklistSystemActions],
	storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export function configureStore(history) {
	const middleware = [thunk, routerMiddleware(history)];

	const store = createStore(
		persistedReducer,
		compose(applyMiddleware(...middleware))
	);

	const persistor = persistStore(store);

	return {
		store: store,
		persistor: persistor,
	};
}

export const history = createHistory();
