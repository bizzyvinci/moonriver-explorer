import { PAGE_LIMIT, successIcon } from '../../utils'
import { gql } from 'graphql-request'

export const variables = {
  limit: PAGE_LIMIT,
  offset: 0,
  orderBy: ['REF_INDEX_DESC']
}

export const query = gql`
  query($limit: Int, $orderBy: [ReferendumsOrderBy!]) {
    referendums(first: $limit, orderBy: $orderBy) {
      nodes {
        id
        threshold
        executed
        timeline
      }
    }
  }
`

export const pageQuery = gql`
  query {
    referendums {totalCount}
  }
`

export function processReferendums(nodes) {
  const data = nodes.map(d => {return {
    id: d.id,
    threshold: d.threshold,
    executed: successIcon(d.executed),
    status: d.timeline.at(-1)['status']
  }})

  const columns = [
    {Header: 'REF ID', accessor: 'id'},
    {Header: 'Vote Threshold', accessor: 'threshold'},
    {Header: 'Executed', accessor: 'executed'},
    {Header: 'Status', accessor: 'status'},
  ]

  return {data: data, columns: columns}
}
