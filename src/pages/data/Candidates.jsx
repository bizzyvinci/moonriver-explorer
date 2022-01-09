import { PAGE_LIMIT, getLink, successIcon, reduceValue, sum } from '../../utils'
import { gql } from 'graphql-request'

export const variables = {
  limit: PAGE_LIMIT,
  offset: 0,
  orderBy: ['IS_CHOSEN_ASC', 'SELF_BONDED_DESC']
}

export const query = gql`
  query($limit: Int, $orderBy: [CandidatesOrderBy!], $offset: Int) {
    candidates(first: $limit, orderBy: $orderBy, offset: $offset) {
      nodes {
        id
        isChosen
        selfBonded
        joined
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
    candidates {totalCount}
  }
`

export function processCandidates(nodes) {
  const data = nodes.map(d => ({
    id: getLink(d.id, 'stake'),
    isChosen: successIcon(d.isChosen),
    selfBonded: reduceValue(d.selfBonded),
    totalBonded: reduceValue(d.selfBonded) 
      + sum(d.delegations.nodes.map(x => reduceValue(x.value))),
    delegators: d.delegations.totalCount > 100
      ? '100+'
      : String(d.delegations.totalCount),
    joined: d.joined || 'Genesis',
  }))

  const columns = [
    {Header: 'Candidate', accessor: 'id'},
    {Header: 'Chosen', accessor: 'isChosen'},
    {Header: 'Self Bonded', accessor: 'selfBonded'},
    {Header: 'Total Bonded', accessor: 'totalBonded'},
    {Header: 'Delegators', accessor: 'delegators'},
    {Header: 'Joined', accessor: 'joined'},
  ]

  return {data: data, columns: columns}
}
