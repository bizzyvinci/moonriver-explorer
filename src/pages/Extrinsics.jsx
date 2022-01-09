import React from 'react'
import { useState, useEffect } from 'react';
import { Heading } from '@chakra-ui/react'
import { request } from 'graphql-request'
import { ENDPOINT } from '../utils'
import Table from '../components/Table'
import { query, pageQuery, variables, processExtrinsics } from './data/Extrinsics'


export default function Extrinsics() {
  const defaultParams = {data: [], columns: []}
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPage, setTotalPage] = useState(0)
  const [extrinsics, setExtrinsics] = useState(defaultParams)

  useEffect(() => {
    async function getData() {
      variables.offset = currentPage * variables.limit
      const res = await request(ENDPOINT, query, variables)
      const pageRes = await request(ENDPOINT, pageQuery, variables)
      console.log(res, pageRes)
      setTotalPage((pageRes.extrinsics.totalCount
        ? Math.floor((pageRes.extrinsics.totalCount-1) / variables.limit)
        : 0))
      const extrinsicParams = processExtrinsics(res.extrinsics.nodes)
      return extrinsicParams
    }
    getData().then(extrinsicParams => setExtrinsics(extrinsicParams))
  }, [currentPage])

  return (
    <>
      <Heading>Extrinsics</Heading>
      <br />
      <Table currentPage={currentPage} totalPage={totalPage} goToPage={setCurrentPage} {...extrinsics} />
    </>
  )
}
