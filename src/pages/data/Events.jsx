import { PAGE_LIMIT, getLink } from '../../utils'
import { gql } from 'graphql-request'

export const variables = {
  limit: PAGE_LIMIT,
  offset: 0,
  orderBy: ['BLOCK_NUMBER_DESC', 'INDEX_ASC']
}

export const query = gql`
  query($limit: Int, $orderBy: [EventsOrderBy!], $offset: Int) {
    events(first: $limit, orderBy: $orderBy, offset: $offset) {
      nodes {
        id
        extrinsicId
        block {id, timestamp}
        section
        method
        docs
        data
      }
    }
  }
`

export const pageQuery = gql`
  query {
    events {totalCount}
  }
`

export function processEvents(nodes) {
  const data = nodes.map(d => {return {
    id: d.id,
    extrinsic: getLink(d.extrinsicId, 'extrinsic'),
    block: getLink(d.block.id, 'block'),
    date: d.block.timestamp,
    section: d.section,
    method: d.method,
    //docs: d.docs,
    //data: d.data
  }})

  const columns = [
    {Header: 'Event', accessor: 'id'},
    {Header: 'Extrinsic', accessor: 'extrinsic'},
    {Header: 'Block', accessor: 'block'},
    {Header: 'Date', accessor: 'date'},
    {Header: 'Section', accessor: 'section'},
    {Header: 'Method', accessor: 'method'},
  ]

  return {data: data, columns: columns}
}
