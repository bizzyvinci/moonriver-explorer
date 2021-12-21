import React from 'react'
import { useState, useEffect } from 'react';
import { Heading } from '@chakra-ui/react'
import { request } from 'graphql-request'
import { ENDPOINT } from '../utils'
import Table from '../components/Table'
import { query, pageQuery, variables, processAccounts } from './data/Accounts'


export default function Blocks() {
  const defaultParams = {data: [], columns: []}
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPage, setTotalPage] = useState(0)
  const [accounts, setAccounts] = useState(defaultParams)

  useEffect(() => {
    async function getData() {
      variables.offset = currentPage * variables.limit
      const res = await request(ENDPOINT, query, variables)
      const pageRes = await request(ENDPOINT, pageQuery, variables)
      console.log(res, pageRes)
      setTotalPage((pageRes.accounts.totalCount
        ? Math.floor((pageRes.accounts.totalCount-1) / variables.limit)
        : 0))
      const accountParams = processAccounts(res.accounts.nodes)
      return accountParams
    }
    getData().then(accountParams => setAccounts(accountParams))
  }, [currentPage])

  return (
    <>
      <Heading>Accounts</Heading>
      <br />
      <Table currentPage={currentPage} totalPage={totalPage} goToPage={setCurrentPage} {...accounts} />
    </>
  )
}
