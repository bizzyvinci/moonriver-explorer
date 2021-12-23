import { PAGE_LIMIT, getLink, sum, reduceValue } from '../../utils'
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
        delegations(first:100) {
          totalCount
          nodes {value}
        }
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
    id: getLink(d.id, 'stake'),
    bonded: sum(d.delegations.nodes.map(x => reduceValue(x.value))),
    candidates: d.delegations.totalCount > 100
      ? '100+'
      : String(d.delegations.totalCount),
  }})

  const columns = [
    {Header: 'Delegator', accessor: 'id'},
    {Header: 'Bonded', accessor: 'bonded'},
    {Header: 'Candidates', accessor: 'candidates'},
  ]

  return {data: data, columns: columns}
}
