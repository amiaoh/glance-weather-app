import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ChakraProvider } from '@chakra-ui/react';
import { registerSW } from 'virtual:pwa-register';
import App from './App';
import { system } from './theme';
import { ColorModeProvider } from './components/theme/ColorModeContext';
import './styles/global.css';

registerSW({
  onNeedRefresh() {},
  onOfflineReady() {
    console.log('App ready for offline use');
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ChakraProvider value={system}>
      <ColorModeProvider>
        <App />
      </ColorModeProvider>
    </ChakraProvider>
  </StrictMode>
);
