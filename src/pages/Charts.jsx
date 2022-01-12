import React from 'react'
import { useState, useEffect } from 'react'
import { Heading, Stack, Select, Button, Box, Text } from '@chakra-ui/react'
import { request } from 'graphql-request'
import { LineChart, ResponsiveContainer, CartesianGrid, 
  XAxis, YAxis, Tooltip, Legend, Line 
} from 'recharts'
import { ENDPOINT } from '../utils'
import { query, processQuery } from './data/Charts'


const lineKeyArray = [
  {key: 'Extrinsics', value: 'extrinsics'},
  {key: 'Transactions', value: 'transactions'},
  {key: 'Events', value: 'events'},
  {key: 'No. of Transfers', value: 'transferCounts'},
  {key: 'Amount Transferred', value: 'transferAmount'},
  {key: 'No. of ERC20 Transfers', value: 'erc20TransferCounts'},
  {key: 'No. of ERC721 Transfers', value: 'erc721TransferCounts'},
  {key: 'No. of contracts deployed', value: 'newContracts'},
]

export default function Charts() {
  const [data, setData] = useState([])
  const [lineKey, setLineKey] = useState('extrinsics')
  const [legend, setLegend] = useState('Extrinsics')

  useEffect(() => {
    async function getData() {
      const res = await request(ENDPOINT, query)
      //console.log(res)
      return processQuery(res.days.nodes)
    }
    getData().then(days => {
      setData(days)
    })
  }, [])

  const changeKey = (idx) => {
    setLineKey(lineKeyArray[idx]['value'])
    setLegend(lineKeyArray[idx]['key'])
  }

  return (
    <>
      <Heading>Charts</Heading>
      <Stack direction="column">
        <Select display={{ base: 'flex', md: 'none' }} 
          onChange={e => changeKey(e.target.value)}>
          {lineKeyArray.map((x, idx) => (
            <option value={idx} key={x.value}>{x.key}</option>
          ))}
        </Select>
        <Stack direction="row">
          <Stack display={{ base: 'none', md: 'flex' }}>
            {lineKeyArray.map((x, idx) => (
              <Button key={x.value} onClick={() => changeKey(idx)}>{x.key}</Button>
            ))}
          </Stack>
          <Box display="contents">
            <ResponsiveChart data={data} lineKey={lineKey} legend={legend} />
          </Box>
        </Stack>
      </Stack>
      
    </>
  )
}

function ResponsiveChart({ data, lineKey, legend }) {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="1 1" />
        <XAxis dataKey="day" />
        <YAxis />
        <Tooltip />
        <Legend verticalAlign='top'
           content={<Text color="#F2A006">{legend}</Text>}
        />
        <Line type="monotone" dataKey={lineKey} stroke="#F2A006" />
      </LineChart>
    </ResponsiveContainer>
  )
}
