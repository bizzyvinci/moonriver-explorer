import { PAGE_LIMIT, getLink } from '../../utils'
import { gql } from 'graphql-request'
import bigInt from 'big-integer'

export const variables = {
  limit: PAGE_LIMIT,
  offset: 0,
  orderBy: ['TOTAL_BALANCE_DESC', 'FREE_BALANCE_DESC']
}

export const query = gql`
  query($limit: Int, $orderBy: [AccountsOrderBy!]) {
    accounts(first: $limit, orderBy: $orderBy) {
      nodes {
        id
        freeBalance
        reservedBalance
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
    freeBalance: bigInt(d.freeBalance) / bigInt(10**18),
    reservedBalance: bigInt(d.reservedBalance) / bigInt(10**18),
    totalBalance: bigInt(d.totalBalance) / bigInt(10**18)
  }})

  const columns = [
    {Header: 'Account', accessor: 'id'},
    {Header: 'Free Balance', accessor: 'freeBalance'},
    {Header: 'Reserved Balance', accessor: 'reservedBalance'},
    {Header: 'Total Balance', accessor: 'totalBalance'}
  ]

  return {data: data, columns: columns}
}
