import React from 'react'
import { useState, useEffect } from 'react';
import { Heading, Box, Flex, Link, Button } from '@chakra-ui/react'
import { request, gql } from 'graphql-request'
import { Config } from '../utils'
import Table from '../components/Table'


const query = gql`
  query($limit: Int) {
    blocks(first: $limit, orderBy: NUMBER_DESC) {
      nodes {
        id
        timestamp
        extrinsics {totalCount}
        transactions {totalCount}
        events {totalCount}
      }
    }
    extrinsics(first: $limit, orderBy: [BLOCK_NUMBER_DESC, INDEX_ASC]) {
      nodes {
        id
        block {id, timestamp}
        section
        method
      }
    }
    transactions(first: $limit, orderBy: [BLOCK_NUMBER_DESC, ID_ASC]) {
      nodes {
        id
        block {id, timestamp}
        fromId
        toId
        value
      }
    }
    candidates(first: $limit, filter: {isChosen: {equalTo: true}}, orderBy:[SELF_BONDED_DESC]) {
      nodes {
        id
        joinedExtrinsicId
        isChosen
        selfBonded
        delegations {totalCount}
      }
    }
  }
`

const variables = {
  limit: 10
}


export default function Homepage() {
  const defaultP = {data: [], columns: []} 
  const [blocks, setBlocks] = useState(defaultP)
  const [extrinsics, setExtrinsics] = useState(defaultP)
  const [transactions, setTransactions] = useState(defaultP)
  const [candidates, setCandidates] = useState(defaultP)

  useEffect(() => {
    async function getData() {
      const res = await request(Config.endpoint, query, variables)
      console.log(res)
      const blockParams = processBlocks(res.blocks.nodes)
      const extrinsicParams = processExtrinsics(res.extrinsics.nodes)
      const transactionParams = processTransactions(res.transactions.nodes)
      const candidateParams = processCandidates(res.candidates.nodes)
      const params = {
        block: blockParams, 
        extrinsic: extrinsicParams, 
        transaction: transactionParams, 
        candidate: candidateParams}
      console.log(params)
      return params
    }
    getData().then((params) => {
      setBlocks(params.block)
      setExtrinsics(params.extrinsic)
      setTransactions(params.transaction)
      setCandidates(params.candidate)
    })
  }, [])

  const data = [
    {heading: 'Blocks', params: blocks, href: '/blocks'},
    {heading: 'Extrinsics', params: extrinsics, href: '/extrinsics'},
    {heading: 'Transactions', params: transactions, href: '/transactions'},
    {heading: 'Candidates', params: candidates, href: '/candidates'},
  ]

	return (
    <Box>
      {data.map(({heading, params, href}) => (
        <Box key={heading}>
          <Flex justify='space-between'>
            <Heading size='lg'>{heading}</Heading>
            <Button href={href} p='5px 10px' borderRadius='3px' as='a'
              bg='#F2A006' color='white' alignContent='center'>
              View All
            </Button>
          </Flex>
          <Table {...params} />
          <br /><br />
        </Box>
      ))}
    </Box>
	)
}


function processBlocks(nodes) {
  const data = nodes.map(d => {return {
    id: <Link href={'block/'+d.id} color='blue.600'> {d.id} </Link>,
    date: d.timestamp,
    extrinsics: d.extrinsics.totalCount,
    transactions: d.transactions.totalCount,
    events: d.events.totalCount
  }})

  const columns = [
    {Header: 'Block', accessor: 'id'},
    {Header: 'Date', accessor: 'date'},
    {Header: 'Extrinsics', accessor: 'extrinsics'},
    {Header: 'Transactions', accessor: 'transactions'},
    {Header: 'Events', accessor: 'events'},
  ]

  return {data: data, columns: columns}
}


function processExtrinsics(nodes) {
  const data = nodes.map(d => {return {
    id: <Link href={'extrinsic/'+d.id} color='blue.600'> {d.id} </Link>,
    block: <Link href={'block/'+d.block.id} color='blue.600'> {d.block.id} </Link>,
    date: d.block.timestamp,
    section: d.section,
    method: d.method,
  }})

  const columns = [
    {Header: 'Extrinsic', accessor: 'id'},
    {Header: 'Block', accessor: 'block'},
    {Header: 'Date', accessor: 'date'},
    {Header: 'Section', accessor: 'section'},
    {Header: 'Method', accessor: 'method'},
  ]

  return {data: data, columns: columns}
}


function processTransactions(nodes) {
  const data = nodes.map(d => {return {
    id: <Link href={'transaction/'+d.id} color='blue.600'> {d.id} </Link>,
    block: <Link href={'block/'+d.block.id} color='blue.600'> {d.block.id} </Link>,
    date: d.block.timestamp,
    from: d.fromId,
    to: d.toId,
    value: d.value,
  }})

  const columns = [
    {Header: 'Transaction', accessor: 'id'},
    {Header: 'Block', accessor: 'block'},
    {Header: 'Date', accessor: 'date'},
    {Header: 'From', accessor: 'from'},
    {Header: 'To', accessor: 'to'},
    {Header: 'Value', accessor: 'value'},
  ]

  return {data: data, columns: columns}
}

function processCandidates(nodes) {
  const data = nodes.map(d => {return {
    id: <Link href={'candidate/'+d.id} color='blue.600'> {d.id} </Link>,
    joined: <Link href={'extrinsic/'+d.joinedExtrinsic} color='blue.600'> {d.joinedExtrinsic} </Link>,
    selfBonded: d.selfBonded,
    delegator: d.delegations.totalCount
  }})

  const columns = [
    {Header: 'Candidate', accessor: 'id'},
    {Header: 'Joined', accessor: 'joined'},
    {Header: 'Self Bonded', accessor: 'selfBonded'},
    {Header: 'Delegator', accessor: 'delegator'}
  ]

  return {data: data, columns: columns}
}

