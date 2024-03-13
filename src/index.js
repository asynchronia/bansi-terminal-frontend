import React from "react"
import ReactDOM from 'react-dom/client';
import App from "./App"
import * as serviceWorker from "./serviceWorker"
import { BrowserRouter } from "react-router-dom"
import { Provider } from "react-redux"

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  // <Provider>
      <>
      <BrowserRouter basename={process.env.PUBLIC_URL}>
        <App />
      </BrowserRouter>
  </>
    // </Provider>
);

serviceWorker.unregister()
