import { PAGE_LIMIT, getLink, reduceValue, successIcon } from '../../utils'
import { gql } from 'graphql-request'

export const variables = {
  limit: PAGE_LIMIT,
  erc20Offset: 0,
  erc721Offset: 0,
  logOffset: 0
}

export const countQuery = gql`
  query($id: String) {
    erc20Transfers(filter: {transactionHash: {equalTo: $id}}) {totalCount}
    erc721Transfers(filter: {transactionHash: {equalTo: $id}}) {totalCount}
    logs(filter: {transactionId: {equalTo: $id}}) {totalCount}
  }
`

export const transactionQuery = gql`
  query($id: String!) {
    transaction(id: $id) {
      id
      success
      block {id, timestamp}
      extrinsicId
      fromId
      toId
      value
      nonce
      gasLimit
      gasPrice
      maxFeePerGas
      data
      arguments
    }
  }
`

export const erc20TransferQuery = gql`
  query($id: String, $limit: Int, $erc20Offset: Int) {
    erc20Transfers(filter: {transactionHash: {equalTo: $id}},
      first: $limit, offset: $erc20Offset, orderBy: ID_ASC
    ) {
      nodes {
        fromId
        toId
        tokenId
        value
      }
    }
  }
`

export const erc721TransferQuery = gql`
  query($id: String, $limit: Int, $erc721Offset: Int) {
    erc721Transfers(filter: {transactionHash: {equalTo: $id}},
      first: $limit, offset: $erc721Offset, orderBy: ID_ASC
    ) {
      nodes {
        fromId
        toId
        tokenId
        value
      }
    }
  }
`

export const logQuery = gql`
  query($id: String, $limit: Int, $logOffset: Int) {
    logs(filter: {transactionId: {equalTo: $id}},
      first: $limit, offset: $logOffset, orderBy: LOG_INDEX_ASC
    ) {
      nodes {
        address
        removed
        topics
        data
        arguments
      }
    }
  }
`

export function processCounts(res) {
  const counts = {
    erc20Transfers: res.erc20Transfers.totalCount,
    erc721Transfers: res.erc721Transfers.totalCount,
    logs: res.logs.totalCount,
  }
  return counts
}

export function processTransaction(res) {
  const { transaction } = res
	const overviewData = [
    {label: 'Hash', value: transaction.id},
    {label: 'Block', value: getLink(transaction.block.id, 'block')},
    {label: 'Timestamp', value: transaction.block.timestamp},
    {label: 'Extrinsic', value: getLink(transaction.extrinsicId, 'extrinsic')},
    {label: 'From', value: getLink(transaction.fromId, 'account')},
    {label: 'To', value: getLink(transaction.toId, 'account')},
    {label: 'Value', value: reduceValue(transaction.value)},
    {label: 'Nonce', value: transaction.nonce},
    {label: 'Gas Limit', value: transaction.gasLimit},
    {label: 'Gas Price', value: reduceValue(transaction.gasPrice)},
    {label: 'Max Fee Per Gas', value: reduceValue(transaction.maxFeePerGas)},
    //{label: 'Data', value: transaction.data},
    //{label: 'Arguments', value: transaction.arguments},
  ]
  const overviewParams = {data: overviewData}
  return overviewParams
}

export function processErc20Transfers(nodes) {
  const erc20TransferData = nodes.map(d => {return {
    from: getLink(d.fromId, 'account'),
    to: getLink(d.toId, 'account'),
    token: getLink(d.tokenId, 'token'),
    value: reduceValue(d.value)
  }})
  const erc20TransferColumns = [
    {Header: 'From', accessor: 'from'},
    {Header: 'To', accessor: 'to'},
    {Header: 'Token', accessor: 'token'},
    {Header: 'Value', accessor: 'value'},
  ]
  const erc20TransferParams = {data: erc20TransferData, columns: erc20TransferColumns}
  return erc20TransferParams
}

export function processErc721Transfers(nodes) {
  const erc721TransferData = nodes.map(d => {return {
    from: getLink(d.fromId, 'account'),
    to: getLink(d.toId, 'account'),
    token: getLink(d.tokenId, 'token'),
    value: d.value
  }})
  const erc721TransferColumns = [
    {Header: 'From', accessor: 'from'},
    {Header: 'To', accessor: 'to'},
    {Header: 'Token', accessor: 'token'},
    {Header: 'Token ID', accessor: 'value'},
  ]
  const erc721TransferParams = {data: erc721TransferData, columns: erc721TransferColumns}
  return erc721TransferParams
}


export function processLogs(nodes) {
  const logData = nodes.map(d => {return {
    address: d.address,
    removed: successIcon(d.removed),
    topics: d.topics,
    //data: d.data,
    //arguments: d.arguments,
  }})
  const logColumns = [
    {Header: 'Address', accessor: 'address'},
    {Header: 'Removed', accessor: 'removed'},
    {Header: 'Topics', accessor: 'topics'},
    //{Header: 'Data', accessor: 'data'},
    //{Header: 'Arguments', accessor: 'arguments'},
  ]
  const logParams = {data: logData, columns: logColumns}
  return logParams
}
