import { PAGE_LIMIT, reduceValue, getLink } from '../../utils'
import { gql } from 'graphql-request'

export const variables = {
  limit: PAGE_LIMIT,
  offset: 0,
  orderBy: ['PROP_INDEX_DESC']
}

export const query = gql`
  query($limit: Int, $orderBy: [ProposalsOrderBy!], $offset: Int) {
    proposals(first: $limit, orderBy: $orderBy, offset: $offset) {
      nodes {
        id
        author
        deposit
        preimage
        timeline
      }
    }
  }
`

export const pageQuery = gql`
  query {
    proposals {totalCount}
  }
`

export function processProposals(nodes) {
  const data = nodes.map(d => {return {
    id: d.id,
    author: getLink(d.author, 'account'),
    deposit: reduceValue(d.deposit),
    preimage: d.preimage,
    status: d.timeline.at(-1)['status']
  }})

  const columns = [
    {Header: 'PROP ID', accessor: 'id'},
    {Header: 'Author', accessor: 'author'},
    {Header: 'Deposit', accessor: 'deposit'},
    {Header: 'Preimage', accessor: 'preimage'},
    {Header: 'Status', accessor: 'status'},
  ]

  return {data: data, columns: columns}
}
