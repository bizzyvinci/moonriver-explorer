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
    extrinsics(first: $limit, orderBy: INDEX_ASC) {
      nodes {
        id
        block {id, timestamp}
        section
        method
      }
    }
    transactions(first: $limit) {
      nodes {
        id
        block {id, timestamp}
        fromId
        toId
        value
      }
    }
    candidates(first: $limit, filter: {isChosen: {equalTo: true}}) {
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
      const blockP = processBlocks(res.blocks.nodes)
      const extrinsicP = processExtrinsics(res.extrinsics.nodes)
      const transactionP = processTransactions(res.transactions.nodes)
      const candidateP = processCandidates(res.candidates.nodes)
      const P = [blockP, extrinsicP, transactionP, candidateP]
      console.log(P)
      return P
    }
    getData().then(([blockP, extrinsicP, transactionP, candidateP]) => {
      setBlocks(blockP)
      setExtrinsics(extrinsicP)
      setTransactions(transactionP)
      setCandidates(candidateP)
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
    id: d.id,
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
    id: d.id,
    block: d.block.id,
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
    id: d.id,
    block: d.block.id,
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
    id: d.id,
    joined: d.joinedExtrinsic,
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

