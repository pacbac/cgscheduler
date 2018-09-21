import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker.js';
import { store } from './store'
import { BrowserRouter as Router } from 'react-router-dom'

const render = () => ReactDOM.render(<Router><App /></Router>, document.getElementById('root'));
store.subscribe(render)
render()

registerServiceWorker();
