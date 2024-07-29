import { ApolloProvider } from '@apollo/client';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { client } from './api/client';
import { App } from './components/App';
import { AuthProvider } from './components/AuthContext';
import { LanguageProvider } from './components/LanguageContext';
import './index.css.ts';

// registerServiceWorker((message) => {
//   if (message.type === SwWorkerMessageType.Initialized) {
//     setClientId(message.clientId);
//   } else if (message.type === SwWorkerMessageType.SyncOver) {
//     if (message.isSuccess) {
//       setIsSynced(true);
//     } else {
//       setIsSynced(false);
//     }
//     client.refetchQueries({
//       include:
//     })
//   }
// });

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <AuthProvider>
        <LanguageProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </LanguageProvider>
      </AuthProvider>
    </ApolloProvider>
  </React.StrictMode>,
);
