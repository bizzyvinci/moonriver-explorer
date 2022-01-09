import { PAGE_LIMIT, getLink, reduceValue, successIcon } from '../../utils'
import { gql } from 'graphql-request'

export const variables = {
  limit: PAGE_LIMIT,
  offset: 0,
  orderBy: ['BLOCK_NUMBER_DESC', 'INDEX_ASC']
}

export const query = gql`
  query($limit: Int, $orderBy: [TransfersOrderBy!], $offset: Int) {
    transfers(first: $limit, orderBy: $orderBy, offset: $offset) {
      nodes {
        block {id, timestamp}
        extrinsic {id, success}
        fromId
        toId
        value
      }
    }
  }
`

export const pageQuery = gql`
  query {
    transfers {totalCount}
  }
`

export function processTransfers(nodes) {
  const data = nodes.map(d => {return {
    block: getLink(d.block.id, 'block'),
    timestamp: d.block.timestamp,
    from: getLink(d.fromId, 'account'),
    to: getLink(d.toId, 'account'),
    value: reduceValue(d.value),
    extrinsic: d.extrinsic
      ? getLink(d.extrinsic.id, 'extrinsic')
      : null,
    success: d.extrinsic
      ? successIcon(d.extrinsic.success)
      : successIcon(true)
  }})

  const columns = [
    {Header: 'Block', accessor: 'block'},
    {Header: 'Timestamp', accessor: 'timestamp'},
    {Header: 'From', accessor: 'from'},
    {Header: 'To', accessor: 'to'},
    {Header: 'Amount', accessor: 'value'},
    {Header: 'Extrinsic', accessor: 'extrinsic'},
    {Header: 'Success', accessor: 'success'},
  ]

  return {data: data, columns: columns}
}
