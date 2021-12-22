import { PAGE_LIMIT } from '../../utils'
import { gql } from 'graphql-request'


export const variables = {
  limit: PAGE_LIMIT,
  extrinsicOffset: 0,
  transactionOffset: 0,
  transferOffset: 0,
  erc20TransferOffset: 0,
  erc721TransferOffset: 0,
}

export const countQuery = gql`
  query($id: String!) {
    extrinsics(filter: {signerId: {equalTo: $id}}) {totalCount}
    transactions(filter: {fromId: {equalTo: $id}, toId: {equalTo: $id}}) {totalCount}

    transfers(filter: {fromId: {equalTo: $id}, toId: {equalTo: $id}}) {totalCount}
    erc20Transfers(filter: {fromId: {equalTo: $id}, toId: {equalTo: $id}}) {totalCount}
    erc721Transfers(filter: {fromId: {equalTo: $id}, toId: {equalTo: $id}}) {totalCount}
  }
`

export const accountQuery = gql`
  query($id: String!) {
    account(id: $id) {
      id
      freeBalance
      reservedBalance
      totalBalance
      isContract
      creatorId
      createdAt
    }
    erc20Balances(filter: {accountId: {equalTo: $id}}) {
      nodes {
        tokenId
        value
      }
    }
    erc721Balances(filter: {accountId: {equalTo: $id}}) {
      nodes {
        tokenId
        value
      }
    }
    rewards(filter: {accountId: {equalTo: $id}}) {totalCount}
    erc20Transfers(filter: {tokenId: {equalTo: $id}}) {totalCount}
    erc721Transfers(filter: {tokenId: {equalTo: $id}}) {totalCount}
  }
`

export const extrinsicQuery = gql`
  query($id: String!, $limit: Int, $extrinsicOffset: Int) {
    extrinsics(first: $limit, offset: $extrinsicOffset, filter: {signerId: {equalTo: $id}}, orderBy: [BLOCK_NUMBER_DESC, INDEX_DESC]) {
      nodes {
        id
        block {id, timestamp}
        success
        section
        method
      }
    }
  }
`

export const transactionQuery = gql`
  query($id: String!, $limit: Int, $transactionOffset: Int) {
    transactions(first: $limit, offset: $transactionOffset, filter: {fromId: {equalTo: $id}, toId: {equalTo: $id}}, orderBy: [BLOCK_NUMBER_DESC]) {
      nodes {
        id
        block {id, timestamp}
        fromId
        toId
        success
        value
      }
    }
  }
`

export const transferQuery = gql`
  query($id: String!, $limit: Int, $transferOffset: Int) {
    transfers(first: $limit, offset: $transferOffset, filter: {fromId: {equalTo: $id}, toId: {equalTo: $id}}, orderBy: [BLOCK_NUMBER_DESC, INDEX_DESC]) {
      nodes {
        id
        extrinsicId
        block {id, timestamp}
        fromId
        toId
        value
      }
    }
  }
`

export const erc20TransferQuery = gql`
  query($id: String!, $limit: Int, $erc20TransferOffset: Int) {
    erc20Transfers(first: $limit, offset: $erc20TransferOffset, filter: {fromId: {equalTo: $id}, toId: {equalTo: $id}}) {
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

export const erc721TransferQuery = gql`
  query($id: String!, $limit: Int, $erc721TransferOffset: Int) {
    erc721Transfers(first: $limit, offset: $erc721TransferOffset, filter: {fromId: {equalTo: $id}, toId: {equalTo: $id}}) {
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
