import React from 'react';
import ReactDOM from 'react-dom/client';
import { VisibilityProvider } from './providers/VisibilityProvider';
import { BrowserRouter } from 'react-router-dom';

import Layout from './components/Layout/Layout';
import App from './components/App/App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <VisibilityProvider>
      <BrowserRouter>
        <Layout>
          <App  />
        </Layout>
      </BrowserRouter>
    </VisibilityProvider>
  </React.StrictMode>,
);
