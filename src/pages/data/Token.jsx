import { PAGE_LIMIT, getLink, reduceValue } from '../../utils'
import { gql } from 'graphql-request'

export const variables = {
  limit: PAGE_LIMIT,
  transferOffset: 0,
  balanceOffset: 0,
}

export const countQuery = gql`
  query($id: String!) {
    erc20Transfers(filter: {tokenId: {equalTo: $id}}) {totalCount}
    erc721Transfers(filter: {tokenId: {equalTo: $id}}) {totalCount}

    erc20Balances(filter: {tokenId: {equalTo: $id}}) {totalCount}
    erc20Balances(filter: {tokenId: {equalTo: $id}}) {totalCount}
  }
`

export const tokenQuery = gql`
  query($id: String!) {
    erc20Token(id: $id) {
      id
      name
      symbol
      decimal
      supply
      balances {totalCount}
    }
    erc721Token(id: $id) {
      id
      name
      symbol
      balances {totalCount}
    }
  }
`

export const transferQuery = gql`
  query($id: String!, $limit: Int, transferOffset: Int) {
    erc20Transfers(first: $limit, offset: transferOffset, filter: {tokenId: {equalTo: $id}}, orderBy: [BLOCK_NUMBER_DESC, TRANSACTION_INDEX_ASC]) {
      nodes {
        id
        fromId
        toId
        tokenId
        value
        log {
          transactionId
          block {id, timestamp}
        }
      }
    }
    erc721Transfers(first: $limit, offset: transferOffset, filter: {tokenId: {equalTo: $id}}, orderBy: [BLOCK_NUMBER_DESC, TRANSACTION_INDEX_ASC]) {
      nodes {
        id
        fromId
        toId
        tokenId
        value
        log {
          transactionId
          block {id, timestamp}
        }
      }
    }
  }
`

export const balanceQuery = gql`
  query($id: String!, $limit: Int, balanceOffset: Int) {
    erc20Balances(first: $limit, offset: balanceOffset, filter: {tokenId: {equalTo: $id}}, orderBy: [VALUE_DESC]) {
      nodes {
        accountId
        tokenId
        value
      }
    }
    erc721Balances(first: $limit, offset: balanceOffset, filter: {tokenId: {equalTo: $id}}, orderBy: [VALUE_ASC]) {
      nodes {
        accountId
        tokenId
        value
      }
    }
  }
`

export function processCounts(res) {
  const counts = {
    erc20Transfers: res.erc20Transfers.totalCount,
    erc721Transfers: res.erc721Transfers.totalCount,
    erc20Balances: res.erc20Balances.totalCount,
    erc721Balances: res.erc721Balances.totalCount,
  }
  return counts
}

export function processToken(res) {
  const { erc20Token, erc721Token } = res
  let erc20Data = []
  let erc721Data = []

  if (erc20Token) {
    const erc20Data = [
      {label: 'Account', value: getLink(erc20Token.id)},
      {label: 'Name', value: erc20Token.name},
      {label: 'Symbol', value: erc20Token.symbol},
      {label: 'Decimal', value: erc20Token.decimal},
      {label: 'Supply', value: erc20Token.supply},
      {label: 'Holders', value: erc20Token.balances.totalCount},
    ]
  }

  if (erc721Token) {
    const erc721Data = [
      {label: 'Account', value: getLink(erc721Token.id)},
      {label: 'Name', value: erc721Token.name},
      {label: 'Symbol', value: erc721Token.symbol},
      {label: 'Supply', value: erc721Token.balances.totalCount},
    ]
  }

  const overviewParams = {erc20: {data: erc20Data}, erc721: {data: erc721Data}}
  return overviewParams
}

export function processTransfers(res) {
  const erc20TransferData = res.erc20Transfers.nodes.map(d => {return {
    transaction: getLink(d.log.transactionId, 'transaction'),
    timestamp: d.log.block.timestamp,
    from: d.fromId,
    to: d.toId,
    token: d.tokenId,
    value: reduceValue(d.value)
  }})
  const erc20TransferColumns = [
    {Header: 'Transaction', accessor: 'transaction'},
    {Header: 'Timestamp', accessor: 'timestamp'},
    {Header: 'From', accessor: 'from'},
    {Header: 'To', accessor: 'to'},
    {Header: 'Token', accessor: 'token'},
    {Header: 'Value', accessor: 'value'},
  ]
  const erc20TransferParams = {data: erc20TransferData, columns: erc20TransferColumns}
  
  const erc721TransferData = res.erc721Transfers.nodes.map(d => {return {
    transaction: getLink(d.log.transactionId, 'transaction'),
    timestamp: d.log.block.timestamp,
    from: d.fromId,
    to: d.toId,
    token: d.tokenId,
    value: d.value
  }})
  const erc721TransferColumns = [
    {Header: 'Transaction', accessor: 'transaction'},
    {Header: 'Timestamp', accessor: 'timestamp'},
    {Header: 'From', accessor: 'from'},
    {Header: 'To', accessor: 'to'},
    {Header: 'Token ID', accessor: 'token'},
    {Header: 'Value', accessor: 'value'},
  ]
  const erc721TransferParams = {data: erc721TransferData, columns: erc721TransferColumns}
  
  const params = {erc20: erc20TransferParams, erc721: erc721TransferParams}
  return params
}

export function processBalances(res) {
  const erc20BalanceData = res.erc20Balances.nodes.map(d => {return {
    account: getLink(d.accountId, 'account'),
    //token: d.tokenId,
    value: reduceValue(d.value)
  }})
  const erc20BalanceColumns = [
    {Header: 'Account', accessor: 'account'},
    //{Header: 'Token', accessor: 'token'},
    {Header: 'Value', accessor: 'value'},
  ]
  const erc20BalanceParams = {data: erc20BalanceData, columns: erc20BalanceColumns}
  
  const erc721BalanceData = res.erc721Balances.nodes.map(d => {return {
    account: getLink(d.accountId, 'account'),
    //token: d.tokenId,
    value: d.value
  }})
  const erc721BalanceColumns = [
    {Header: 'Account', accessor: 'account'},
    //{Header: 'Token', accessor: 'token'},
    {Header: 'Token ID', accessor: 'value'},
  ]
  const erc721BalanceParams = {data: erc721BalanceData, columns: erc721BalanceColumns}
  
  const params = {erc20: erc20BalanceParams, erc721: erc721BalanceParams}
  return params
}
