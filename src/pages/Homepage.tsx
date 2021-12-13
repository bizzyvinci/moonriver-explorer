import React from 'react'
import { Heading, Box } from '@chakra-ui/react'
import Table from '../components/Table'
import Overview from '../components/Overview'
import Tabs from '../components/Tabs'


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

const tabData = [
  {
    label: 'Overview',
    content: <Overview />,
  },
  {
    label: 'Table',
    content: <Table data={data} columns={columns} />,
  },
]

export default function Homepage() {
	return (
    <Box>
      <Heading>Homepage</Heading>
  		<Tabs data={tabData} />
    </Box>
	)
}


