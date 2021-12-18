import React from 'react'
import { useState, useEffect } from 'react'
import { CheckCircleIcon, CloseIcon } from '@chakra-ui/icons'
import { request, gql } from 'graphql-request'
import { Config } from '../utils'
import Table from '../components/Table'


const query = gql`
  query($limit: Int, $orderBy: [CandidatesOrderBy!]) {
    candidates(first: $limit, orderBy: $orderBy) {
      nodes {
        id
        isChosen
        selfBonded
        joinedExtrinsicId
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
  const [candidates, setCandidates] = useState(defaultP)

  useEffect(() => {
    async function getData() {
      const res = await request(Config.endpoint, query, variables)
      console.log(res)
      const candidateP = processCandidates(res.candidates.nodes)
      return candidateP
    }
    getData().then(candidateP => setCandidates(candidateP))
  }, [])

  return (
    <Table {...candidates} />
  )
}


function processCandidates(nodes) {
  const data = nodes.map(d => {return {
    id: d.id,
    isChosen: d.isChosen 
      ? <CheckCircleIcon color='green' />
      : <CloseIcon color='red' />,
    selfBonded: d.selfBonded,
    joined: d.joinedExtrinsicId,
    delegators: d.delegations.totalCount,
  }})

  const columns = [
    {Header: 'Candidate', accessor: 'id'},
    {Header: 'Chosen', accessor: 'isChosen'},
    {Header: 'Self Bonded', accessor: 'selfBonded'},
    {Header: 'Joined', accessor: 'joined'},
    {Header: 'Delegators', accessor: 'delegators'},
  ]

  return {data: data, columns: columns}
}
