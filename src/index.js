
import React from 'react';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { Provider } from 'react-redux';
import configureStore, { history } from './store/configureStore';
const ReactDOM = require('react-dom');
const store = configureStore();
const render = () => {
	ReactDOM.render(
		<Provider store={store}>
			<App history={history} />
		</Provider>,
		document.getElementById('root'),
	);
}

render();

// Hot reloading
if (module.hot) {
  module.hot.accept('./App', () => {
    render()
  })
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
