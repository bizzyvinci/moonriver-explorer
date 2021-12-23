import React from 'react'
import { useState, useEffect } from 'react'
import { Heading } from '@chakra-ui/react'
import { request } from 'graphql-request'
import { ENDPOINT } from '../utils'
import Table from '../components/Table'
import { query, pageQuery, variables, processBlocks } from './data/Blocks'


export default function Blocks() {
  const defaultParams = {data: [], columns: []}
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPage, setTotalPage] = useState(0)
  const [blocks, setBlocks] = useState(defaultParams)

  useEffect(() => {
    async function getData() {
      variables.offset = currentPage * variables.limit
      const res = await request(ENDPOINT, query, variables)
      const pageRes = await request(ENDPOINT, pageQuery, variables)
      console.log(res, pageRes)
      setTotalPage((pageRes.blocks.totalCount
        ? Math.floor((pageRes.blocks.totalCount-1) / variables.limit)
        : 0))
      //console.log(totalPage)
      const blockParams = processBlocks(res.blocks.nodes)
      return blockParams
    }
    getData().then(blockParams => setBlocks(blockParams))
  }, [currentPage])

  return (
    <>
      <Heading>Blocks</Heading>
      <br />
      <Table currentPage={currentPage} totalPage={totalPage} goToPage={setCurrentPage} {...blocks} />
    </>
  )
}

