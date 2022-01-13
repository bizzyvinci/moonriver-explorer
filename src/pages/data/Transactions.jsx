import { PAGE_LIMIT, getLink, reduceValue, 
  timeSince
} from '../../utils'
import { gql } from 'graphql-request'

export const variables = {
  limit: PAGE_LIMIT,
  offset: 0,
  orderBy: ['BLOCK_NUMBER_DESC', 'ID_ASC']
}

export const query = gql`
  query($limit: Int, $orderBy: [TransactionsOrderBy!], $offset: Int) {
    transactions(first: $limit, orderBy: $orderBy, offset: $offset) {
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
    id: getLink(d.id, 'tx'),
    block: getLink(d.block.id, 'block'),
    date: timeSince(d.block.timestamp),
    from: getLink(d.fromId, 'account'),
    to: getLink(d.toId, 'account'),
    value: reduceValue(d.value),
  }})

  const columns = [
    {Header: 'Transaction', accessor: 'id'},
    {Header: 'Block', accessor: 'block'},
    {Header: 'Time', accessor: 'date'},
    {Header: 'From', accessor: 'from'},
    {Header: 'To', accessor: 'to'},
    {Header: 'Value', accessor: 'value'},
  ]

  return {data: data, columns: columns}
}
