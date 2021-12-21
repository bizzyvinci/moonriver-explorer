import React from 'react'
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Heading } from '@chakra-ui/react'
import { request } from 'graphql-request'
import { ENDPOINT } from '../utils'
import Table from '../components/Table'
import Tabs from '../components/Tabs'
import Overview from '../components/Overview'
import { blockQuery, extrinsicQuery, transactionQuery, eventQuery,
  variables, processBlock, processExtrinsics, processTransactions, processEvents
} from './data/Block'


export default function Block() {
  const { id } = useParams();
  variables.id = id
  variables.filter = {blockId: {equalTo: id}}
  
  const defaultParams = {data: [], columns: []}
  const [overview, setOverview] = useState({data: []})

  const [extrinsicCurrentPage, setExtrinsicCurrentPage] = useState(0)
  const [extrinsicTotalPage, setExtrinsicTotalPage] = useState(-1)
  const [extrinsics, setExtrinsics] = useState(defaultParams)

  const [transactionCurrentPage, setTransactionCurrentPage] = useState(0)
  const [transactionTotalPage, setTransactionTotalPage] = useState(-1)
  const [transactions, setTransactions] = useState(defaultParams)

  const [eventCurrentPage, setEventCurrentPage] = useState(0)
  const [eventTotalPage, setEventTotalPage] = useState(-1)
  const [events, setEvents] = useState(defaultParams)

  // get overview
  useEffect(() => {
    async function getData() {
      const res = await request(ENDPOINT, blockQuery, variables)
      console.log(res)
      const [params, counts] = processBlock(res.block)
      if (counts.extrinsics > 0) {
        setExtrinsicTotalPage(Math.floor((counts.extrinsics-1) / variables.limit))
      }
      if (counts.transactions > 0) {
        setTransactionTotalPage(Math.floor((counts.transactions-1) / variables.limit))
      }
      if (counts.events > 0) {
        setEventTotalPage(Math.floor((counts.events-1) / variables.limit))
      }
      //console.log(params)
      return params
    }
    getData().then(params => {
      setOverview(params)
    })
  }, [])

  // get extrinsics (if there are)
  useEffect(() => {
    async function getData() {
      variables.extrinsicOffset = extrinsicCurrentPage * variables.limit
      const res = await request(ENDPOINT, extrinsicQuery, variables)
      console.log(res)
      const params = processExtrinsics(res.extrinsics.nodes)
      return params
    }
    getData().then(params => {
      setExtrinsics(params)
    })
  }, [extrinsicTotalPage, extrinsicCurrentPage])

  // get transactions (if there are)
  useEffect(() => {
    async function getData() {
      variables.transactionOffset = transactionCurrentPage * variables.limit
      const res = await request(ENDPOINT, transactionQuery, variables)
      console.log(res)
      const params = processTransactions(res.transactions.nodes)
      return params
    }
    getData().then(params => {
      setTransactions(params)
    })
  }, [transactionTotalPage, transactionCurrentPage])

  // get events (if there are)
  useEffect(() => {
    async function getData() {
      variables.eventOffset = eventCurrentPage * variables.limit
      const res = await request(ENDPOINT, eventQuery, variables)
      console.log(res)
      const params = processEvents(res.events.nodes)
      return params
    }
    getData().then(params => {
      setEvents(params)
    })
  }, [eventTotalPage, eventCurrentPage])

  const tabData = [
    {
      label: 'Extrinsics', 
      content: extrinsicTotalPage >= 0 && <Table 
          currentPage={extrinsicCurrentPage} totalPage={extrinsicTotalPage} 
          goToPage={setExtrinsicCurrentPage} {...extrinsics} />
    },
    {
      label: 'Transactions',
      content: transactionTotalPage >= 0 && <Table
          currentPage={transactionCurrentPage} totalPage={transactionTotalPage}
          goToPage={setTransactionCurrentPage} {...transactions} />
    },
    {
      label: 'Events',
      content: eventTotalPage >= 0 && <Table
          currentPage={eventCurrentPage} totalPage={eventTotalPage} 
          goToPage={setEventCurrentPage} {...events} />
    },
  ]

  return (
    <>
      <Heading>Block #{id}</Heading>
      <Overview {...overview} />
      <br /><br />
      <Tabs data={tabData} />
    </>
  )
}
