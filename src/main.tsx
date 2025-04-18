// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import { Provider } from "react-redux"
// import { store } from "./store/index.js"
// import './index.css'
// import App from './App.jsx'
// import '@rainbow-me/rainbowkit/styles.css';

// import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import { WagmiProvider } from 'wagmi';
// import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
// import { config } from './wagmi';
// const queryClient = new QueryClient();
// createRoot(document.getElementById('root')).render(
//     // <Provider store={store}>
//     //   <App />
//     // </Provider>
//     <Provider store={store}>
//     <WagmiProvider config={config}>
//     <QueryClientProvider client={queryClient}>
//       <RainbowKitProvider>
//         <App />
//       </RainbowKitProvider>
//     </QueryClientProvider>
//   </WagmiProvider>
//   </Provider>
// )

import './index.css'
import '@rainbow-me/rainbowkit/styles.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from "react-redux"
import { store ,persistor} from "./store/index.js"
import { PersistGate } from "redux-persist/integration/react"

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider,darkTheme } from '@rainbow-me/rainbowkit';

import App from './App';
import { config } from './wagmi';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  //<React.StrictMode>
    <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider  modalSize="compact" theme={darkTheme()}>
          <App />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
    </PersistGate>
    </Provider>
  //</React.StrictMode>
);
