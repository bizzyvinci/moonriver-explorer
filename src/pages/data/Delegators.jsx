import { PAGE_LIMIT, getLink } from '../../utils'
import { gql } from 'graphql-request'

export const variables = {
  limit: PAGE_LIMIT,
  offset: 0,
  orderBy: ['ID_DESC']
}

export const query = gql`
  query($limit: Int, $orderBy: [DelegatorsOrderBy!]) {
    delegators(first: $limit, orderBy: $orderBy) {
      nodes {
        id
        delegations {totalCount}
      }
    }
  }
`

export const pageQuery = gql`
  query {
    delegators {totalCount}
  }
`

export function processDelegators(nodes) {
  const data = nodes.map(d => {return {
    id: getLink(d.id, 'account'),
    candidates: d.delegations.totalCount,
  }})

  const columns = [
    {Header: 'Delegator', accessor: 'id'},
    {Header: 'Candidates', accessor: 'candidates'},
  ]

  return {data: data, columns: columns}
}
