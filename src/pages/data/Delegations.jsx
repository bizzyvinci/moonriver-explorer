import { PAGE_LIMIT, getLink, successIcon } from '../../utils'
import { gql } from 'graphql-request'
import bigInt from 'big-integer'

export const variables = {
  limit: PAGE_LIMIT,
  offset: 0,
  orderBy: ['VALUE_DESC', 'ID_ASC']
}

export const query = gql`
  query($limit: Int, $orderBy: [DelegationsOrderBy!]) {
    delegations(first: $limit, orderBy: $orderBy) {
      nodes {
        delegatorId
        candidateId
        value
      }
    }
  }
`

export const pageQuery = gql`
  query {
    delegations {totalCount}
  }
`

export function processDelegations(nodes) {
  const data = nodes.map(d => ({
    delegator: getLink(d.delegatorId, 'account'),
    candidate: getLink(d.candidateId, 'account'),
    value: bigInt(d.value) / bigInt(10**18),
  }))

  const columns = [
    {Header: 'Delegator', accessor: 'delegator'},
    {Header: 'Candidate', accessor: 'candidate'},
    {Header: 'Value', accessor: 'value'},
  ]

  return {data: data, columns: columns}
}
