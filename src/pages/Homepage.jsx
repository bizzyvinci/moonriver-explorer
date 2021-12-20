import React from 'react'
import { useState, useEffect } from 'react';
import { Heading, Box, Flex, Link, Button } from '@chakra-ui/react'
import { request } from 'graphql-request'
import { variables, query, processBlocks, processExtrinsics,
  processTransactions, processCandidates } from './data/Homepage'
import { ENDPOINT } from '../utils'
import Table from '../components/Table'


export default function Homepage() {
  const defaultParams = {data: [], columns: []} 
  const [blocks, setBlocks] = useState(defaultParams)
  const [extrinsics, setExtrinsics] = useState(defaultParams)
  const [transactions, setTransactions] = useState(defaultParams)
  const [candidates, setCandidates] = useState(defaultParams)

  useEffect(() => {
    async function getData() {
      const res = await request(ENDPOINT, query, variables)
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


