import React from 'react';
import { createRoot } from 'react-dom/client';
import { Auth0Provider } from '@auth0/auth0-react';
import App from './App';
import history from './history';
import Home from './Home';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import './index.css'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>
  },
  {
    path:"/home",
    element:<Home/>
}
]);
const root = createRoot(document.getElementById('root'));

root.render(
<Auth0Provider
    domain={process.env.REACT_APP_DOMAIN}
    clientId={process.env.REACT_APP_CLIENTID}
    authorizationParams={{
      redirect_uri: window.location.origin + "/home"
    }}
  >
    <RouterProvider history={history} router={router} />
  </Auth0Provider>,
);