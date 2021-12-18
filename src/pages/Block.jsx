import React from 'react'
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { request, gql } from 'graphql-request'
import { Config } from '../utils'
import Table from '../components/Table'
import Tabs from '../components/Tabs'
import Overview from '../components/Overview'


const query = gql`
  query($id: String!) {
    block(id: $id) {
      id
      hash
      parentHash
      specVersion
      stateRoot
      size
      timestamp
      extrinsics(orderBy: INDEX_ASC) {
        nodes {
          id
          section
          method
        }
      }
      transactions {
        nodes {
          id
          fromId
          toId
          value
        }
      }
      events(orderBy: INDEX_ASC) {
        nodes {
          id
          extrinsicId
          section
          method
          docs
          data
        }
      }
    }
  }

`


export default function Block() {
  const defaultP = {data: [], columns: []}
  const { id } = useParams();
  const [overview, setOverview] = useState({data: []})
  const [extrinsics, setExtrinsics] = useState(defaultP)
  const [transactions, setTransactions] = useState(defaultP)
  const [events, setEvents] = useState(defaultP)

  useEffect(() => {
    async function getData() {
      const variables = {id: id}
      const res = await request(Config.endpoint, query, variables)
      console.log(res)
      const params = processBlock(res.block)
      console.log(params)
      return params
    }
    getData().then(params => {
      setOverview(params.overview)
      setExtrinsics(params.extrinsics)
      setTransactions(params.transactions)
      setEvents(params.events)
    })
  }, [])

  const tabData = [
    {label: 'Extrinsics', content: <Table {...extrinsics} />},
    {label: 'Transactions', content: <Table {...transactions} />},
    {label: 'Events', content: <Table {...events} />},
  ]

  return (
    <>
      <Overview {...overview} />
      <br /><br />
      <Tabs data={tabData} />
    </>
  )
}


function processBlock(block) {
  const overviewData = [
    {label: 'Number', value: block.id},
    {label: 'Timestamp', value: block.timestamp},
    {label: 'Hash', value: block.hash},
    {label: 'Parent Hash', value: block.parentHash},
    {label: 'State Root', value: block.stateRoot},
    {label: 'Spec Version', value: block.specVersion},
    {label: 'Size', value: block.size},
    {label: 'Extrinsics', value: block.extrinsics?.nodes.length},
    {label: 'Transactions', value: block.transactions?.nodes.length},
    {label: 'Events', value: block.events?.nodes.length}
  ]
  const overviewParams = {data: overviewData}

  const extrinsicData = block.extrinsics?.nodes.map(d => {return {
    id: d.id,
    section: d.section,
    method: d.method,
  }})
  const extrinsicColumns = [
    {Header: 'Extrinsic', accessor: 'id'},
    {Header: 'Section', accessor: 'section'},
    {Header: 'Method', accessor: 'method'},
  ]
  const extrinsicParams = {data: extrinsicData, columns: extrinsicColumns}

  const transactionData = block.transactions?.nodes.map(d => {return {
    id: d.id,
    from: d.fromId,
    to: d.toId,
    value: d.value,
  }})
  const transactionColumns = [
    {Header: 'Transaction', accessor: 'id'},
    {Header: 'From', accessor: 'from'},
    {Header: 'To', accessor: 'to'},
    {Header: 'Value', accessor: 'value'},
  ]
  const transactionParams = {data: transactionData, columns: transactionColumns}

  const eventData = block.events?.nodes.map(d => {return {
    id: d.id,
    extrinsic: d.extrinsicId,
    section: d.section,
    method: d.method,
    docs: d.docs,
    data: d.data
  }})
  const eventColumns = [
    {Header: 'Event', accessor: 'id'},
    {Header: 'Extrinsic', accessor: 'extrinsic'},
    {Header: 'Section', accessor: 'section'},
    {Header: 'Method', accessor: 'method'},
  ]
  const eventParams = {data: eventData, columns: eventColumns}

  return {
    overview: overviewParams, 
    extrinsics: extrinsicParams, 
    transactions: transactionParams,
    events: eventParams
  }
}
