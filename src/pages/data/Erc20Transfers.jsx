import { PAGE_LIMIT, getLink, reduceValue } from '../../utils'
import { gql } from 'graphql-request'

export const variables = {
  limit: PAGE_LIMIT,
  offset: 0,
  orderBy: ['BLOCK_NUMBER_DESC', 'TRANSACTION_INDEX_ASC']
}

export const query = gql`
  query($limit: Int, $orderBy: [Erc20TransfersOrderBy!], $offset: Int) {
    erc20Transfers(first: $limit, orderBy: $orderBy, offset: $offset) {
      nodes {
        blockNumber
        timestamp
        fromId
        toId
        tokenId
        value
        transactionHash
      }
    }
  }
`

export const pageQuery = gql`
  query {
    erc20Transfers {totalCount}
  }
`

export function processTransfers(nodes) {
  const data = nodes.map(d => {return {
    block: getLink(d.blockNumber, 'block'),
    timestamp: d.timestamp,
    from: getLink(d.fromId, 'account'),
    to: getLink(d.toId, 'account'),
    token: getLink(d.tokenId, 'token'),
    value: reduceValue(d.value),
    transaction: getLink(d.transactionHash, 'tx')
  }})

  const columns = [
    {Header: 'Block', accessor: 'block'},
    {Header: 'Timestamp', accessor: 'timestamp'},
    {Header: 'From', accessor: 'from'},
    {Header: 'To', accessor: 'to'},
    {Header: 'Token', accessor: 'token'},
    {Header: 'Amount', accessor: 'value'},
    {Header: 'Transaction', accessor: 'transaction'},
  ]

  return {data: data, columns: columns}
}
