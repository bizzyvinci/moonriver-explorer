import React from 'react'
import { useState, useEffect } from 'react'
import { Heading } from '@chakra-ui/react'
import { request } from 'graphql-request'
import { ENDPOINT } from '../utils'
import Table from '../components/Table'
import { query, pageQuery, variables, processDelegations } from './data/Delegations'


export default function Blocks() {
  const defaultParams = {data: [], columns: []}
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPage, setTotalPage] = useState(0)
  const [delegations, setDelegations] = useState(defaultParams)

  useEffect(() => {
    async function getData() {
      const res = await request(ENDPOINT, query, variables)
      const pageRes = await request(ENDPOINT, pageQuery, variables)
      console.log(res, pageRes)
      setTotalPage((pageRes.delegations.totalCount
        ? Math.floor(pageRes.delegations.totalCount / variables.limit)
        : 0))
      const delegationParams = processDelegations(res.delegations.nodes)
      return delegationParams
    }
    getData().then(delegationParams => setDelegations(delegationParams))
  }, [currentPage])

  return (
    <>
      <Heading>Delegations</Heading>
      <br />
      <Table currentPage={currentPage} totalPage={totalPage} goToPage={setCurrentPage} {...delegations} />
    </>
  )
}
