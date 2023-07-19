/* @refresh reload */
import { render } from 'solid-js/web';

import './index.css';
import { App } from './components/App';
import { ApolloProvider } from '@merged/solid-apollo';
import { client } from './api/client';
import { Router } from '@solidjs/router';

const root = document.getElementById('root');

render(
  () => (
    <ApolloProvider client={client}>
      <Router>
        <App />
      </Router>
    </ApolloProvider>
  ),
  root!,
);
