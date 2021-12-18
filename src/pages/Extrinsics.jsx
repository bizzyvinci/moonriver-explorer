import React from 'react'
import { useState, useEffect } from 'react';
import { request, gql } from 'graphql-request'
import { Config } from '../utils'
import Table from '../components/Table'


const query = gql`
  query($limit: Int, $orderBy: [ExtrinsicsOrderBy!]) {
    extrinsics(first: $limit, orderBy: $orderBy) {
      nodes {
        id
        block {id, timestamp}
        section
        method
      }
    }
  }

`

const variables = {
  limit: 50,
  orderBy: "INDEX_ASC"
}

export default function Blocks() {
  const defaultP = {data: [], columns: []}
  const [extrinsics, setExtrinsics] = useState(defaultP)

  useEffect(() => {
    async function getData() {
      const res = await request(Config.endpoint, query, variables)
      console.log(res)
      const extrinsicP = processExtrinsics(res.extrinsics.nodes)
      return extrinsicP
    }
    getData().then(extrinsicP => setExtrinsics(extrinsicP))
  }, [])

  return (
    <Table {...extrinsics} />
  )
}


function processExtrinsics(nodes) {
  const data = nodes.map(d => {return {
    id: d.id,
    block: d.block.id,
    date: d.block.timestamp,
    section: d.section,
    method: d.method,
  }})

  const columns = [
    {Header: 'Extrinsic', accessor: 'id'},
    {Header: 'Block', accessor: 'block'},
    {Header: 'Date', accessor: 'date'},
    {Header: 'Section', accessor: 'section'},
    {Header: 'Method', accessor: 'method'},
  ]

  return {data: data, columns: columns}
}
