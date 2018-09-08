import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker.js';
import { store } from './store'

const render = () => ReactDOM.render(<App />, document.getElementById('root'));
store.subscribe(render)
render()

registerServiceWorker();
