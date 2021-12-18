import React from 'react'
import { useState, useEffect } from 'react';
import { request, gql } from 'graphql-request'
import { Config } from '../utils'
import Table from '../components/Table'


const query = gql`
  query($limit: Int, $orderBy: [TransactionsOrderBy!]) {
    transactions(first: $limit, orderBy: $orderBy) {
      nodes {
        id
        block {id, timestamp}
        fromId
        toId
        value
      }
    }
  }

`

const variables = {
  limit: 50,
  orderBy: "ID_ASC"
}

export default function Blocks() {
  const defaultP = {data: [], columns: []}
  const [transactions, setTransactions] = useState(defaultP)

  useEffect(() => {
    async function getData() {
      const res = await request(Config.endpoint, query, variables)
      console.log(res)
      const transactionP = processTransactions(res.transactions.nodes)
      return transactionP
    }
    getData().then(transactionP => setTransactions(transactionP))
  }, [])

  return (
    <Table {...transactions} />
  )
}


function processTransactions(nodes) {
  const data = nodes.map(d => {return {
    id: d.id,
    block: d.block.id,
    date: d.block.timestamp,
    from: d.fromId,
    to: d.toId,
    value: d.value,
  }})

  const columns = [
    {Header: 'Transaction', accessor: 'id'},
    {Header: 'Block', accessor: 'block'},
    {Header: 'Date', accessor: 'date'},
    {Header: 'From', accessor: 'from'},
    {Header: 'To', accessor: 'to'},
    {Header: 'Value', accessor: 'value'},
  ]

  return {data: data, columns: columns}
}
