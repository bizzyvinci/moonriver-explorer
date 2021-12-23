import React from 'react'
import { useState, useEffect } from 'react'
import { Heading } from '@chakra-ui/react'
import { request } from 'graphql-request'
import { ENDPOINT } from '../utils'
import Table from '../components/Table'
import { query, pageQuery, variables, processProposals } from './data/Proposals'


export default function Proposals() {
  const defaultParams = {data: [], columns: []}
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPage, setTotalPage] = useState(0)
  const [proposals, setProposals] = useState(defaultParams)

  useEffect(() => {
    async function getData() {
      variables.offset = currentPage * variables.limit
      const res = await request(ENDPOINT, query, variables)
      const pageRes = await request(ENDPOINT, pageQuery, variables)
      console.log(res, pageRes)
      setTotalPage((pageRes.proposals.totalCount
        ? Math.floor((pageRes.proposals.totalCount-1) / variables.limit)
        : 0))
      const params = processProposals(res.proposals.nodes)
      return params
    }
    getData().then(params => setProposals(params))
  }, [currentPage])

  return (
    <>
      <Heading>Proposals</Heading>
      <br />
      <Table currentPage={currentPage} totalPage={totalPage} goToPage={setCurrentPage} {...proposals} />
    </>
  )
}
