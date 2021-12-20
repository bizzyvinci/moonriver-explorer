import { PAGE_LIMIT, getLink } from '../../utils'
import { gql } from 'graphql-request'

export const variables = {
  limit: PAGE_LIMIT,
  offset: 0,
  orderBy: 'NUMBER_DESC'
}

export const query = gql`
  query($limit: Int, $orderBy: [BlocksOrderBy!], $offset: Int) {
    blocks(first: $limit, orderBy: $orderBy, offset: $offset) {
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

export const pageQuery = gql`
  query {
    blocks {totalCount}
  }
`

export function processBlocks(nodes) {
  const data = nodes.map(d => {return {
    id: getLink(d.id, 'block'),
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
