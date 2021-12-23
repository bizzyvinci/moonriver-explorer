import React from 'react'
import { useState, useEffect } from 'react'
import { Heading } from '@chakra-ui/react'
import { request } from 'graphql-request'
import { ENDPOINT } from '../utils'
import Table from '../components/Table'
import { query, pageQuery, variables, processTransfers } from './data/Erc721Transfers'


export default function Erc721Transfers() {
  const defaultParams = {data: [], columns: []}
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPage, setTotalPage] = useState(0)
  const [transfers, setTransfers] = useState(defaultParams)

  useEffect(() => {
    async function getData() {
      variables.offset = currentPage * variables.limit
      const res = await request(ENDPOINT, query, variables)
      const pageRes = await request(ENDPOINT, pageQuery, variables)
      console.log(res, pageRes)
      setTotalPage((pageRes.erc721Transfers.totalCount
        ? Math.floor((pageRes.erc721Transfers.totalCount-1) / variables.limit)
        : 0))
      const params = processTransfers(res.erc721Transfers.nodes)
      return params
    }
    getData().then(params => setTransfers(params))
  }, [currentPage])

  return (
    <>
      <Heading>ERC721 Transfers</Heading>
      <br />
      <Table currentPage={currentPage} totalPage={totalPage} goToPage={setCurrentPage} {...transfers} />
    </>
  )
}
