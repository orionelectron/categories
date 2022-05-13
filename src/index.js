import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';

const store = configureStore({ reducer: hoverReducer });

function hoverReducer(state = ["products"], action) {
 
  if (action.type === 'hover/set') {
      const temp = new Set([...action.payload])
    return [
      ...temp
    ]
  }
  if (action.type === 'hover/add'){
    const temp = new Set([...state, ...action.payload]);
    return [...temp]
  }
  return state;
}


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>

  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
