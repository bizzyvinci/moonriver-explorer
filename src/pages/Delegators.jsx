import React from 'react'
import { useState, useEffect } from 'react'
import { CheckCircleIcon, CloseIcon } from '@chakra-ui/icons'
import { request, gql } from 'graphql-request'
import { Config } from '../utils'
import Table from '../components/Table'


const query = gql`
  query($limit: Int, $orderBy: [DelegatorsOrderBy!]) {
    delegators(first: $limit, orderBy: $orderBy) {
      nodes {
        id
        delegations {totalCount}
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
  const [delegators, setDelegators] = useState(defaultP)

  useEffect(() => {
    async function getData() {
      const res = await request(Config.endpoint, query, variables)
      console.log(res)
      const delegatorP = processDelegators(res.delegators.nodes)
      return delegatorP
    }
    getData().then(delegatorP => setDelegators(delegatorP))
  }, [])

  return (
    <Table {...delegators} />
  )
}


function processDelegators(nodes) {
  const data = nodes.map(d => {return {
    id: d.id,
    candidates: d.delegations.totalCount,
  }})

  const columns = [
    {Header: 'Delegator', accessor: 'id'},
    {Header: 'Candidates', accessor: 'candidates'},
  ]

  return {data: data, columns: columns}
}
