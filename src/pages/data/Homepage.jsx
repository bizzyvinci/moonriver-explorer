import { getLink, successIcon, reduceValue,
  timeSince
} from '../../utils'
import { gql } from 'graphql-request'

export const variables = {
  limit: 10
}

export const query = gql`
  query($limit: Int) {
    blocks(first: $limit, orderBy: NUMBER_DESC) {
      nodes {
        id
        timestamp
        extrinsics {totalCount}
        transactions {totalCount}
        events {totalCount}
      }
    }
    extrinsics(first: $limit, orderBy: [BLOCK_NUMBER_DESC, INDEX_ASC]) {
      nodes {
        id
        block {id, timestamp}
        section
        method
      }
    }
    transactions(first: $limit, orderBy: [BLOCK_NUMBER_DESC, ID_ASC]) {
      nodes {
        id
        block {id, timestamp}
        fromId
        toId
        value
      }
    }
    candidates(first: $limit, filter: {isChosen: {equalTo: true}}, orderBy:[SELF_BONDED_DESC]) {
      nodes {
        id
        joined
        isChosen
        selfBonded
        delegations {totalCount}
      }
    }
  }
`

export function processBlocks(nodes) {
  const data = nodes.map(d => {return {
    id: getLink(d.id, 'block'),
    date: timeSince(d.timestamp),
    extrinsics: d.extrinsics.totalCount,
    transactions: d.transactions.totalCount,
    events: d.events.totalCount
  }})

  const columns = [
    {Header: 'Block', accessor: 'id'},
    {Header: 'Time', accessor: 'date'},
    {Header: 'Extrinsics', accessor: 'extrinsics'},
    {Header: 'Transactions', accessor: 'transactions'},
    {Header: 'Events', accessor: 'events'},
  ]

  return {data: data, columns: columns}
}


export function processExtrinsics(nodes) {
  const data = nodes.map(d => {return {
    id: getLink(d.id, 'extrinsic'),
    block: getLink(d.block.id, 'block'),
    date: timeSince(d.block.timestamp),
    section: d.section,
    method: d.method,
  }})

  const columns = [
    {Header: 'Extrinsic', accessor: 'id'},
    {Header: 'Block', accessor: 'block'},
    {Header: 'Time', accessor: 'date'},
    {Header: 'Section', accessor: 'section'},
    {Header: 'Method', accessor: 'method'},
  ]

  return {data: data, columns: columns}
}


export function processTransactions(nodes) {
  const data = nodes.map(d => {return {
    id: getLink(d.id, 'tx'),
    block: getLink(d.block.id, 'block'),
    date: timeSince(d.block.timestamp),
    from: getLink(d.fromId, 'account'),
    to: getLink(d.toId, 'account'),
    value: reduceValue(d.value),
  }})

  const columns = [
    {Header: 'Transaction', accessor: 'id'},
    {Header: 'Block', accessor: 'block'},
    {Header: 'Time', accessor: 'date'},
    {Header: 'From', accessor: 'from'},
    {Header: 'To', accessor: 'to'},
    {Header: 'Value', accessor: 'value'},
  ]

  return {data: data, columns: columns}
}

export function processCandidates(nodes) {
  const data = nodes.map(d => {return {
    id: getLink(d.id, 'stake'),
    isChosen: successIcon(d.isChosen),
    selfBonded: reduceValue(d.selfBonded),
    delegators: d.delegations.totalCount,
    joined: timeSince(d.joined) || 'Genesis',
  }})

  const columns = [
    {Header: 'Candidate', accessor: 'id'},
    {Header: 'Chosen', accessor: 'isChosen'},
    {Header: 'Self Bonded', accessor: 'selfBonded'},
    {Header: 'Delegators', accessor: 'delegators'},
    {Header: 'Joined', accessor: 'joined'},
  ]

  return {data: data, columns: columns}
}
