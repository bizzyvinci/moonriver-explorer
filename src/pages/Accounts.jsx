import React from 'react'
import { useState, useEffect } from 'react';
import { request, gql } from 'graphql-request'
import bigInt from 'big-integer'
import { Config } from '../utils'
import Table from '../components/Table'


const query = gql`
  query($limit: Int, $orderBy: [AccountsOrderBy!]) {
    accounts(first: $limit, orderBy: $orderBy) {
      nodes {
        id
        freeBalance
        reservedBalance
      }
    }
  }

`

const variables = {
  limit: 50,
  orderBy: "FREE_BALANCE_DESC"
}

export default function Blocks() {
  const defaultP = {data: [], columns: []}
  const [accounts, setAccounts] = useState(defaultP)

  useEffect(() => {
    async function getData() {
      const res = await request(Config.endpoint, query, variables)
      console.log(res)
      const accountP = processAccounts(res.accounts.nodes)
      return accountP
    }
    getData().then(accountP => setAccounts(accountP))
  }, [])

  return (
    <Table {...accounts} />
  )
}


function processAccounts(nodes) {
  const data = nodes.map(d => {return {
    id: d.id,
    freeBalance: d.freeBalance,
    reservedBalance: d.reservedBalance,
    totalBalance: (bigInt(d.freeBalance) + bigInt(d.reservedBalance))
  }})

  const columns = [
    {Header: 'Account', accessor: 'id'},
    {Header: 'Free Balance', accessor: 'freeBalance'},
    {Header: 'Reserved Balance', accessor: 'reservedBalance'},
    {Header: 'Total Balance', accessor: 'totalBalance'}
  ]

  return {data: data, columns: columns}
}
