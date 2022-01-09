import { PAGE_LIMIT, getLink, reduceValue } from '../../utils'
import { gql } from 'graphql-request'

export const variables = {
  limit: PAGE_LIMIT,
  offset: 0,
  orderBy: ['TOTAL_BALANCE_DESC', 'FREE_BALANCE_DESC']
}

export const query = gql`
  query($limit: Int, $orderBy: [AccountsOrderBy!], $offset: Int) {
    accounts(first: $limit, orderBy: $orderBy, offset: $offset) {
      nodes {
        id
        freeBalance
        reservedBalance
        totalBalance
      }
    }
  }
`

export const pageQuery = gql`
  query {
    accounts {totalCount}
  }
`

export function processAccounts(nodes) {
  const data = nodes.map(d => {return {
    id: getLink(d.id, 'account'),
    freeBalance: reduceValue(d.freeBalance),
    reservedBalance: reduceValue(d.reservedBalance),
    totalBalance: reduceValue(d.totalBalance)
  }})

  const columns = [
    {Header: 'Account', accessor: 'id'},
    {Header: 'Free Balance', accessor: 'freeBalance'},
    {Header: 'Reserved Balance', accessor: 'reservedBalance'},
    {Header: 'Total Balance', accessor: 'totalBalance'}
  ]

  return {data: data, columns: columns}
}
