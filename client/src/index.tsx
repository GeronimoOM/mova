import { ApolloProvider } from '@apollo/client/react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { client, setClientId } from './api/client';
import { App } from './components/App';
import { UserProvider } from './components/UserContext';
import './index.css';
import { registerServiceWorker } from './sw/client/register';
import { SwWorkerMessageType } from './sw/worker/messages';
import { initTranslator } from './utils/translator';

registerServiceWorker((message) => {
  if (message.type === SwWorkerMessageType.Initialized) {
    setClientId(message.clientId);
  } else if (message.type === SwWorkerMessageType.SyncOver) {
    if (message.isSuccess && message.hasChanges) {
      client.resetStore();
    }
  }
});

initTranslator();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <ApolloProvider client={client}>
    <BrowserRouter>
      <UserProvider>
        <App />
      </UserProvider>
    </BrowserRouter>
  </ApolloProvider>,
);
