import { PAGE_LIMIT, getLink } from '../../utils'
import { gql } from 'graphql-request'

export const variables = {
  limit: PAGE_LIMIT,
  offset: 0,
  orderBy: ['BLOCK_NUMBER_DESC', 'ID_ASC']
}

export const query = gql`
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

export const pageQuery = gql`
  query {
    transactions {totalCount}
  }
`

export function processTransactions(nodes) {
  const data = nodes.map(d => {return {
    id: getLink(d.id, 'transaction'),
    block: getLink(d.block.id, 'block'),
    date: d.block.timestamp,
    from: getLink(d.fromId, 'account'),
    to: getLink(d.toId, 'account'),
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
