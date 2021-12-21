import { PAGE_LIMIT, getLink, successIcon, reduceValue } from '../../utils'
import { gql } from 'graphql-request'

export const variables = {
  limit: PAGE_LIMIT,
  offset: 0,
  orderBy: ['IS_CHOSEN_DESC', 'SELF_BONDED_DESC']
}

export const query = gql`
  query($limit: Int, $orderBy: [CandidatesOrderBy!]) {
    candidates(first: $limit, orderBy: $orderBy) {
      nodes {
        id
        isChosen
        selfBonded
        joinedExtrinsicId
        delegations {totalCount}
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
    id: getLink(d.id, 'account'),
    isChosen: successIcon(d.isChosen),
    selfBonded: reduceValue(d.selfBonded),
    delegators: d.delegations.totalCount,
    joined: d.joinedExtrinsicId
      ? getLink(d.joinedExtrinsicId, 'extrinsic')
      : 'Genesis',
  }))

  const columns = [
    {Header: 'Candidate', accessor: 'id'},
    {Header: 'Chosen', accessor: 'isChosen'},
    {Header: 'Self Bonded', accessor: 'selfBonded'},
    {Header: 'Delegators', accessor: 'delegators'},
    {Header: 'Joined', accessor: 'joined'},
  ]

  return {data: data, columns: columns}
}
