import React from 'react';
import { Box } from '@chakra-ui/react';
import Navbar from './components/Navbar'
import Table from './components/Table'

const columns = [
  {Header: 'Col-1', accessor: 'col-1'},
  {Header: 'Col-2', accessor: 'col-2'},
  {Header: 'Col-3', accessor: 'col-3'},
]

const data = [
  {'col-1': 5, 'col-2': 2, 'col-3': 3},
  {'col-1': 5, 'col-2': 2, 'col-3': 3},
  {'col-1': 5, 'col-2': 2, 'col-3': 3}
]


function App() {
  return (
    <Box className="App">
      <Navbar />
      <Table data={data} columns={columns} />
    </Box>
  );
}

export default App;
