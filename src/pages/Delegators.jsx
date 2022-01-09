import React from 'react'
import { useState, useEffect } from 'react'
import { Heading } from '@chakra-ui/react'
import { request } from 'graphql-request'
import { ENDPOINT } from '../utils'
import Table from '../components/Table'
import { query, pageQuery, variables, processDelegators } from './data/Delegators'


export default function Delegators() {
  const defaultParams = {data: [], columns: []}
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPage, setTotalPage] = useState(0)
  const [delegators, setDelegators] = useState(defaultParams)

  useEffect(() => {
    async function getData() {
      variables.offset = currentPage * variables.limit
      const res = await request(ENDPOINT, query, variables)
      const pageRes = await request(ENDPOINT, pageQuery, variables)
      console.log(res, pageRes)
      setTotalPage((pageRes.delegators.totalCount
        ? Math.floor((pageRes.delegators.totalCount-1) / variables.limit)
        : 0))
      const delegatorParams = processDelegators(res.delegators.nodes)
      return delegatorParams
    }
    getData().then(delegatorParams => setDelegators(delegatorParams))
  }, [currentPage])

  return (
    <>
      <Heading>Delegators</Heading>
      <br />
      <Table currentPage={currentPage} totalPage={totalPage} goToPage={setCurrentPage} {...delegators} />
    </>
  )
}
