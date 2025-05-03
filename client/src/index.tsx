import { ApolloProvider } from '@apollo/client';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { cacheEvict } from './api/cache';
import { client, setClientId } from './api/client';
import { App } from './components/App';
import { AuthProvider } from './components/AuthContext';
import { LanguageProvider } from './components/LanguageContext';
import { LocaleProvider, initTranslator } from './components/LocaleContext';
import { SettingsProvider } from './components/SettingsContext';
import './index.css';
import { registerServiceWorker } from './sw/client/register';
import { SwWorkerMessageType } from './sw/worker/messages';

registerServiceWorker((message) => {
  if (message.type === SwWorkerMessageType.Initialized) {
    setClientId(message.clientId);
  } else if (message.type === SwWorkerMessageType.SyncOver) {
    if (message.isSuccess && message.hasChanges) {
      cacheEvict();
    }
  }
});

initTranslator();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <AuthProvider>
        <LocaleProvider>
          <SettingsProvider>
            <LanguageProvider>
              <BrowserRouter>
                <App />
              </BrowserRouter>
            </LanguageProvider>
          </SettingsProvider>
        </LocaleProvider>
      </AuthProvider>
    </ApolloProvider>
  </React.StrictMode>,
);
