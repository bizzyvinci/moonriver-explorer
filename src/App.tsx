import React from 'react';
import { Box } from '@chakra-ui/react';
import Navbar from './components/Navbar'
import Homepage from './pages/Homepage'


function App() {
  return (
    <Box className="App">
      <Navbar />
      <Homepage />
    </Box>
  );
}

export default App;
