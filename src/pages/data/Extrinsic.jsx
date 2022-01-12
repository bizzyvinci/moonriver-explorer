import { PAGE_LIMIT, getLink, successIcon } from '../../utils'
import { gql } from 'graphql-request'

export const variables = {
  limit: PAGE_LIMIT,
  eventOffset: 0,
}

export const extrinsicQuery = gql`
  query($id: String!, $filter: EventFilter) {
    extrinsic(id: $id) {
      id
      hash
      transaction {id}
      block {id, timestamp}
      signerId
      section
      method
      success
    }
    events(filter: $filter) {
      totalCount
    }
  }
`

export const eventQuery = gql`
  query($filter: EventFilter, $limit: Int, $eventOffset: Int) {
    events(filter: $filter, first: $limit, offset: $eventOffset, orderBy: INDEX_ASC) {
      nodes {
        id
        section
        method
        docs
        data
      }
    }
  }
`

export function processExtrinsic(extrinsic, eventCount) {
	const overviewData = [
    {label: 'Id', value: extrinsic.id},
    {label: 'Extrinsic Hash', value: extrinsic.hash},
    {label: 'EVM Hash', value: extrinsic.transaction?.id
      ? getLink(extrinsic.transaction.id, 'tx')
      : null},
    {label: 'Block', 
     value: getLink(extrinsic.block.id, 'block')},
    {label: 'Timestamp', value: extrinsic.block.timestamp},
    {label: 'Signer', value: extrinsic.signerId
      ? getLink(extrinsic.signerId, 'account')
      : null},
    {label: 'Success', value: successIcon(extrinsic.success)},
    {label: 'Section', value: extrinsic.section},
    {label: 'Method', value: extrinsic.method},
    {label: 'Events', value: eventCount}
  ]
  const overviewParams = {data: overviewData}
  return overviewParams
}

export function processEvents(nodes) {
  const eventData = nodes.map(d => {return {
    id: d.id,
    section: d.section,
    method: d.method,
    //docs: d.docs,
    //data: d.data
  }})
  const eventColumns = [
    {Header: 'Event', accessor: 'id'},
    {Header: 'Section', accessor: 'section'},
    {Header: 'Method', accessor: 'method'},
  ]
  const eventParams = {data: eventData, columns: eventColumns}
  return eventParams
}
