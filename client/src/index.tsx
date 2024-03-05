/* @refresh reload */
import { render } from 'solid-js/web';

import './index.css';
import { ApolloProvider } from '@merged/solid-apollo';
import { client } from './api/client';
import { Router } from '@solidjs/router';
import { registerServiceWorker } from './register-sw';
import App from './components/App';
import { LanguageProvider } from './components/LanguageContext';

const root = document.getElementById('root')!;

registerServiceWorker({
  onMessage: (message) => console.log(message),
});

render(
  () => (
    <ApolloProvider client={client}>
      <LanguageProvider>
        <Router>
          <App />
        </Router>
      </LanguageProvider>
    </ApolloProvider>
  ),
  root,
);
