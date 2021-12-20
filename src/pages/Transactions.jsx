import React from 'react'
import { useState, useEffect } from 'react';
import { Heading } from '@chakra-ui/react'
import { request, gql } from 'graphql-request'
import { ENDPOINT } from '../utils'
import Table from '../components/Table'
import { query, pageQuery, variables, processTransactions } from './data/Transactions'


export default function Blocks() {
  const defaultParams = {data: [], columns: []}
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPage, setTotalPage] = useState(0)
  const [transactions, setTransactions] = useState(defaultParams)

  useEffect(() => {
    async function getData() {
      const res = await request(ENDPOINT, query, variables)
      const pageRes = await request(ENDPOINT, pageQuery, variables)
      console.log(res, pageRes)
      setTotalPage((pageRes.transactions.totalCount
        ? Math.floor(pageRes.transactions.totalCount / variables.limit)
        : 0))
      const transactionParams = processTransactions(res.transactions.nodes)
      return transactionParams
    }
    getData().then(transactionParams => setTransactions(transactionParams))
  }, [])

  return (
    <>
      <Heading>Transactions</Heading>
      <br />
      <Table currentPage={currentPage} totalPage={totalPage} goToPage={setCurrentPage} {...transactions} />
    </>
  )
}
