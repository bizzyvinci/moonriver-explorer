import React from 'react'
import { useState, useEffect } from 'react'
import { Heading } from '@chakra-ui/react'
import { request } from 'graphql-request'
import { ENDPOINT } from '../utils'
import Table from '../components/Table'
import { query, pageQuery, variables, processCandidates } from './data/Candidates'


export default function Candidates() {
  const defaultParams = {data: [], columns: []}
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPage, setTotalPage] = useState(0)
  const [candidates, setCandidates] = useState(defaultParams)

  useEffect(() => {
    async function getData() {
      variables.offset = currentPage * variables.limit
      const res = await request(ENDPOINT, query, variables)
      const pageRes = await request(ENDPOINT, pageQuery, variables)
      console.log(res, pageRes)
      setTotalPage((pageRes.candidates.totalCount
        ? Math.floor((pageRes.candidates.totalCount-1) / variables.limit)
        : 0))
      const candidateParams = processCandidates(res.candidates.nodes)
      return candidateParams
    }
    getData().then(candidateParams => setCandidates(candidateParams))
  }, [currentPage])

  return (
    <>
      <Heading>Candidates</Heading>
      <br />
      <Table currentPage={currentPage} totalPage={totalPage} goToPage={setCurrentPage} {...candidates} />
    </>
  )
}
