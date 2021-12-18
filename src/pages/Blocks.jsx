import React from 'react'
import { useState, useEffect } from 'react';
import { request, gql } from 'graphql-request'
import { Config } from '../utils'
import Table from '../components/Table'


const query = gql`
  query($limit: Int, $orderBy: [BlocksOrderBy!]) {
    blocks(first: $limit, orderBy: $orderBy) {
      nodes {
        id
        timestamp
        extrinsics {totalCount}
        transactions {totalCount}
        events {totalCount}
      }
    }
  }

`

const variables = {
  limit: 50,
  orderBy: "NUMBER_DESC"
}

export default function Blocks() {
  const defaultP = {data: [], columns: []}
  const [blocks, setBlocks] = useState(defaultP)

  useEffect(() => {
    async function getData() {
      const res = await request(Config.endpoint, query, variables)
      console.log(res)
      const blockP = processBlocks(res.blocks.nodes)
      return blockP
    }
    getData().then(blockP => setBlocks(blockP))
  }, [])

  return (
    <Table {...blocks} />
  )
}


function processBlocks(nodes) {
  const data = nodes.map(d => {return {
    id: d.id,
    date: d.timestamp,
    extrinsics: d.extrinsics.totalCount,
    transactions: d.transactions.totalCount,
    events: d.events.totalCount
  }})

  const columns = [
    {Header: 'Block', accessor: 'id'},
    {Header: 'Date', accessor: 'date'},
    {Header: 'Extrinsics', accessor: 'extrinsics'},
    {Header: 'Transactions', accessor: 'transactions'},
    {Header: 'Events', accessor: 'events'},
  ]

  return {data: data, columns: columns}
}
