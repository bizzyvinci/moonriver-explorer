import React from 'react'
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Heading, Link } from '@chakra-ui/react'
import { request, gql } from 'graphql-request'
import { Config } from '../utils'
import Table from '../components/Table'
import Tabs from '../components/Tabs'
import Overview from '../components/Overview'


const query = gql`
  query($id: String!) {
    account(id: $id) {
      id
      freeBalance
      reservedBalance
      totalBalance
      isContract
      creatorId
      createdAt
    }
    eRC20Balances(filter: {accountId: {equalTo: $id}}) {
      nodes {
        token
        value
      }
    }
    eRC721Balances(filter: {accountId: {equalTo: $id}}) {
      nodes {
        token
        value
      }
    }
    extrinsics(orderBy: [BLOCK_NUMBER_DESC, INDEX_DESC], filter: {signerId: {equalTo: $id}}) {
      nodes {
        id
        block {id, timestamp}
        section
        method
      }
    }
    transactions(orderBy: [BLOCK_NUMBER_DESC], filter: {fromId: {equalTo: $id}, toId: {equalTo: $id}}) {
      nodes {
        id
        block {id, timestamp}
        fromId
        toId
        success
        value
      }
    }
    transfers(orderBy: [BLOCK_NUMBER_DESC, INDEX_DESC], filter: {fromId: {equalTo: $id}, toId: {equalTo: $id}}) {
      nodes {
        id
        extrinsicId
        block {id, timestamp}
        fromId
        toId
        value
      }
    }
    eRC20Transfers(filter: {fromId: {equalTo: $id}, toId: {equalTo: $id}}) {
      nodes {
        id
        fromId
        toId
        tokenId
        value
        log {
          transactionId
          block {id, timestamp}
        }
      }
    }
    eRC721Transfers(filter: {fromId: {equalTo: $id}, toId: {equalTo: $id}}) {
      nodes {
        id
        fromId
        toId
        tokenId
        value
        log {
          transactionId
          block {id, timestamp}
        }
      }
    }
    candidate(id: $id) {
      id
      selfBonded
      delegations {
        nodes {
          delegatorId
          candidateId
          value
        }
      }
    }
    delegator(id: $id) {
      id
      delegations {
        nodes {
          delegatorId
          candidateId
          value
        }
      }
    }
    rewards(filter: {accountId: {equalTo: $id}}, orderBy: BLOCK_NUMBER_DESC) {
      nodes {
        blockNumber
        value
        timestamp
      }
    }
  }

`


export default function Block() {
  const defaultParams = {data: [], columns: []}
  const { id } = useParams();
  const [overview, setOverview] = useState({data: []})
  const [extrinsics, setExtrinsics] = useState(defaultParams)
  const [transactions, setTransactions] = useState(defaultParams)
  const [events, setEvents] = useState(defaultParams)

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
      <Heading>Block #{id}</Heading>
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
    id: <Link href={'/extrinsic/'+d.id} color='blue.600'> {d.id} </Link>,
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
    id: <Link href={'/transaction/'+d.id} color='blue.600'> {d.id} </Link>,
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
    extrinsic: <Link href={'/extrinsic/'+d.extrinsicId} color='blue.600'> {d.extrinsicId} </Link>,
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
