import React from 'react';
import App from './App.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import { store } from '../src/redux/store.js';
import { Provider } from 'react-redux';
import { createRoot } from 'react-dom/client'

const root = createRoot(document.getElementById('root'));

root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
