import { PAGE_LIMIT, getLink, successIcon, reduceValue } from '../../utils'
import { gql } from 'graphql-request'

export const variables = {
  limit: PAGE_LIMIT,
  extrinsicOffset: 0,
  transactionOffset: 0,
  eventOffset: 0,
}

export const blockQuery = gql`
  query($id: String!) {
    block(id: $id) {
      id
      hash
      parentHash
      specVersion
      stateRoot
      size
      timestamp
      extrinsics {totalCount}
      transactions {totalCount}
      events {totalCount}
    }
  }
`

export const extrinsicQuery = gql`
  query($filter: ExtrinsicFilter, $extrinsicOffset: Int, $limit: Int) {
    extrinsics(filter:$filter, first: $limit, offset: $extrinsicOffset, orderBy: INDEX_ASC) {
      nodes {
        id
        success
        isSigned
        section
        method
      }
    }
  }
`

export const transactionQuery = gql`
  query($filter: TransactionFilter, $transactionOffset: Int, $limit: Int) {
    transactions(filter:$filter, first: $limit, offset: $transactionOffset, orderBy: ID_ASC) {
      nodes {
        id
        fromId
        toId
        value
      }
    }
  }
`

export const eventQuery = gql`
  query($filter: EventFilter, $eventOffset: Int, $limit: Int) {
    events(filter:$filter, first: $limit, offset: $eventOffset, orderBy: INDEX_ASC) {
      nodes {
        id
        extrinsicId
        section
        method
        docs
        data
      }
    }
  }
`

export function processBlock(block) {
  const overviewData = [
    {label: 'Number', value: block.id},
    {label: 'Timestamp', value: block.timestamp},
    {label: 'Hash', value: block.hash},
    {label: 'Parent Hash', value: block.parentHash},
    {label: 'State Root', value: block.stateRoot},
    {label: 'Spec Version', value: block.specVersion},
    {label: 'Size', value: block.size},
    {label: 'Extrinsics', value: block.extrinsics.totalCount},
    {label: 'Transactions', value: block.transactions.totalCount},
    {label: 'Events', value: block.events.totalCount}
  ]
  const overviewParams = {data: overviewData}
  const counts = {
    extrinsics: block.extrinsics.totalCount,
    transactions: block.transactions.totalCount,
    events: block.events.totalCount
  }
  
  return [overviewParams, counts]
}

export function processExtrinsics(nodes) {
  const extrinsicData = nodes.map(d => {return {
    id: getLink(d.id, 'extrinsic'),
    success: successIcon(d.success),
    signed: successIcon(d.isSigned),
    section: d.section,
    method: d.method,
  }})
  const extrinsicColumns = [
    {Header: 'Extrinsic', accessor: 'id'},
    {Header: 'Success', accessor: 'success'},
    {Header: 'Signed', accessor: 'signed'},
    {Header: 'Section', accessor: 'section'},
    {Header: 'Method', accessor: 'method'},
  ]
  const extrinsicParams = {data: extrinsicData, columns: extrinsicColumns}

  return extrinsicParams
}

export function processTransactions(nodes) {
  const transactionData = nodes.map(d => {return {
    id: getLink(d.id, 'transaction'),
    from: getLink(d.fromId, 'account'),
    to: getLink(d.toId, 'account'),
    value: reduceValue(d.value),
  }})
  const transactionColumns = [
    {Header: 'Transaction', accessor: 'id'},
    {Header: 'From', accessor: 'from'},
    {Header: 'To', accessor: 'to'},
    {Header: 'Value', accessor: 'value'},
  ]
  const transactionParams = {data: transactionData, columns: transactionColumns}

  return transactionParams
}

export function processEvents(nodes) {
  const eventData = nodes.map(d => {return {
    id: d.id,
    extrinsic: getLink(d.extrinsicId, 'extrinsic'),
    section: d.section,
    method: d.method,
    //docs: d.docs,
    //data: d.data
  }})
  const eventColumns = [
    {Header: 'Event', accessor: 'id'},
    {Header: 'Extrinsic', accessor: 'extrinsic'},
    {Header: 'Section', accessor: 'section'},
    {Header: 'Method', accessor: 'method'},
  ]
  const eventParams = {data: eventData, columns: eventColumns}

  return eventParams
}

