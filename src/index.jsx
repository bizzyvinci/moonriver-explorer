import React from 'react';
import ReactDOM from 'react-dom';
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import App from './App';
import theme from './theme'


ReactDOM.render(
  <React.StrictMode>
    <ChakraProvider>
      {/*<ColorModeScript initialColorMode={theme.config.initialColorMode} />*/}
      <App />
    </ChakraProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

