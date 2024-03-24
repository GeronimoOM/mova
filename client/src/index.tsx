/* @refresh reload */
import { render } from 'solid-js/web';

import './index.css';
import { ApolloProvider } from '@merged/solid-apollo';
import { client, setClientId } from './api/client';
import { Router } from '@solidjs/router';
import App from './components/App';
import { LanguageProvider } from './components/LanguageContext';
import { registerServiceWorker } from './sw/client/register';
import { SwWorkerMessageType } from './sw/worker/messages';

const root = document.getElementById('root')!;

registerServiceWorker((message) => {
  if (message.type === SwWorkerMessageType.Initialized) {
    setClientId(message.clientId);
  } else if (message.type === SwWorkerMessageType.SyncOver) {
    // client.refetchQueries({
    //   include:
    // })
  }
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
