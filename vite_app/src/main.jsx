import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Auth0Provider } from "@auth0/auth0-react";
import App from './App.jsx'
const domain = "dev-egbb4l3omwcp647y.us.auth0.com";
const clientId = "HNicjbHeZOH4sDbpHWvo1x4BonTd8Y4c";
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Auth0Provider domain={domain}
    clientId={clientId}
    authorizationParams={{ redirect_uri: window.location.origin }}
    >
    <App />
    </Auth0Provider>
  </StrictMode>,
)
