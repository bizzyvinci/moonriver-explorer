import React from 'react'
import { useState, useEffect } from 'react'
import { Heading } from '@chakra-ui/react'
import { request } from 'graphql-request'
import { ENDPOINT } from '../utils'
import Table from '../components/Table'
import { query, pageQuery, variables, processReferendums } from './data/Referendums'


export default function Referendums() {
  const defaultParams = {data: [], columns: []}
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPage, setTotalPage] = useState(0)
  const [referendums, setReferendums] = useState(defaultParams)

  useEffect(() => {
    async function getData() {
      variables.offset = currentPage * variables.limit
      const res = await request(ENDPOINT, query, variables)
      const pageRes = await request(ENDPOINT, pageQuery, variables)
      console.log(res, pageRes)
      setTotalPage((pageRes.referendums.totalCount
        ? Math.floor((pageRes.referendums.totalCount-1) / variables.limit)
        : 0))
      const params = processReferendums(res.referendums.nodes)
      return params
    }
    getData().then(params => setReferendums(params))
  }, [currentPage])

  return (
    <>
      <Heading>Referendums</Heading>
      <br />
      <Table currentPage={currentPage} totalPage={totalPage} goToPage={setCurrentPage} {...referendums} />
    </>
  )
}
