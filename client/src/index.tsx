/* @refresh reload */
import { render } from 'solid-js/web';

import './index.css';
import { ApolloProvider } from '@merged/solid-apollo';
import { client } from './api/client';
import { Router } from '@solidjs/router';
import { Suspense, lazy } from 'solid-js';
import { AppLoading } from './components/AppLoading';

const root = document.getElementById('root');
const App = lazy(() => import('./components/App'));

render(
  () => (
    <ApolloProvider client={client}>
      <Router>
        <Suspense fallback={<AppLoading />}>
          <App />
        </Suspense>
      </Router>
    </ApolloProvider>
  ),
  root!,
);
