import { PAGE_LIMIT, getLink, successIcon } from '../../utils'
import { gql } from 'graphql-request'

export const variables = {
  limit: PAGE_LIMIT,
  offset: 0,
  orderBy: ['BLOCK_NUMBER_DESC', 'INDEX_ASC']
}

export const query = gql`
  query($limit: Int, $orderBy: [ExtrinsicsOrderBy!]) {
    extrinsics(first: $limit, orderBy: $orderBy) {
      nodes {
        id
        block {id, timestamp}
        success
        isSigned
        section
        method
      }
    }
  }
`

export const pageQuery = gql`
  query {
    extrinsics {totalCount}
  }
`

export function processExtrinsics(nodes) {
  const data = nodes.map(d => {return {
    id: getLink(d.id, 'extrinsic'),
    block: getLink(d.block.id, 'block'),
    date: d.block.timestamp,
    success: successIcon(d.success),
    signed: successIcon(d.isSigned),
    section: d.section,
    method: d.method,
  }})

  const columns = [
    {Header: 'Extrinsic', accessor: 'id'},
    {Header: 'Block', accessor: 'block'},
    {Header: 'Date', accessor: 'date'},
    {Header: 'Success', accessor: 'success'},
    {Header: 'Signed', accessor: 'signed'},
    {Header: 'Section', accessor: 'section'},
    {Header: 'Method', accessor: 'method'},
  ]

  return {data: data, columns: columns}
}
