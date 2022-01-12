import { gql } from 'graphql-request'
import { reduceValue } from '../../utils'

export const query = gql`
  query {
    days(last: 60, orderBy: [ID_ASC]) {
      nodes {
        id
        month
        day
        extrinsics
        transactions
        events
        transferCounts
        transferAmount
        erc20TransferCounts
        erc721TransferCounts
        newContracts
      }
    }
  }
`

export function processQuery(nodes) {
  return (
    nodes.slice(0, -1).map(d => ({
      day: `${d.month}/${d.day}`,
      extrinsics: Number(d.extrinsics),
      transactions: Number(d.transactions),
      events: Number(d.events),
      transferCounts: Number(d.transferCounts),
      transferAmount: reduceValue(d.transferAmount),
      erc20TransferCounts: Number(d.erc20TransferCounts),
      erc721TransferCounts: Number(d.erc721TransferCounts),
      newContracts: Number(d.newContracts),
    }))
  )
}
