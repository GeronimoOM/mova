import { ApolloProvider } from '@apollo/client';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { client, setClientId } from './api/client';
import { App } from './components/App';
import { AuthProvider } from './components/AuthContext';
import { LanguageProvider } from './components/LanguageContext';
import { LocaleProvider, initTranslator } from './components/LocaleContext.tsx';
import './index.css.ts';
import { registerServiceWorker } from './sw/client/register.ts';
import { SwWorkerMessageType } from './sw/worker/messages.ts';

registerServiceWorker((message) => {
  if (message.type === SwWorkerMessageType.Initialized) {
    setClientId(message.clientId);
  }
});

initTranslator();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <AuthProvider>
        <LocaleProvider>
          <LanguageProvider>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </LanguageProvider>
        </LocaleProvider>
      </AuthProvider>
    </ApolloProvider>
  </React.StrictMode>,
);
