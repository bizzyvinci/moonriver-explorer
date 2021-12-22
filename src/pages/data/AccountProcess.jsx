import { getLink, reduceValue, successIcon } from '../../utils'

export function processCounts(res) {
  const counts = {
    extrinsics: res.extrinsics.totalCount,
    transactions: res.transactions.totalCount,
    transfers: res.transfers.totalCount,
    erc20Transfers: res.erc20Transfers.totalCount,
    erc721Transfers: res.erc721Transfers.totalCount,
  }
  return counts
}

export function processAccount(res) {
  const { account, erc20Balances, erc721Balances, rewards, erc20Transfers, erc721Transfers } = res

  // Process erc20Balances and erc721Balances as dropdown menu for Tokens

  const overviewData = [
    {
      label: 'Address', 
      value: account.id
    },
    {
      label: 'Free Balance', 
      value: reduceValue(account.freeBalance)
    },
    {
      label: 'Reserved Balance',
      value: reduceValue(account.reservedBalance)
    },
    {
      label: 'Total Balance',
      value: reduceValue(account.totalBalance)
    },
    {
      label: 'Tokens',
      value: null
    },
    {
      label: 'Is Contract',
      value: account.isContract && 'True'
    },
    {
      label: 'Created By', 
      value: getLink(account.creatorId, 'account')
    },
    {
      label: 'Created At',
      value: getLink(account.createdAt, 'transaction')
    },
    {
      label: 'Token Page',
      value: (erc20Transfers.totalCount > 0 || erc721Transfers.totalCount > 0) && getLink(account.id, 'token')
    },
    {
      label: 'Stake Page',
      value: rewards.totalCount > 0 && getLink(account.id, 'stake')
    }
  ]
  const overviewParams = {data: overviewData}
  return overviewParams
}

export function processExtrinsics(nodes) {
  const extrinsicData = nodes.map(d => {return {
    id: getLink(d.id, 'extrinsic'),
    block: getLink(d.block.id, 'block'),
    timestamp: d.block.timestamp,
    success: successIcon(d.success),
    section: d.section,
    method: d.method,
  }})
  const extrinsicColumns = [
    {Header: 'Extrinsic', accessor: 'id'},
    {Header: 'Block', accessor: 'block'},
    {Header: 'Success', accessor: 'timestamp'},
    {Header: 'Timestamp', accessor: 'success'},
    {Header: 'Section', accessor: 'section'},
    {Header: 'Method', accessor: 'method'},
  ]
  const extrinsicParams = {data: extrinsicData, columns: extrinsicColumns}
  return extrinsicParams
}

export function processTransactions(nodes) {
  const transactionData = nodes.map(d => {return {
    id: getLink(d.id, 'transaction'),
    block: getLink(d.block.id, 'block'),
    timestamp: d.block.timestamp,
    from: d.fromId,
    to: d.toId,
    value: reduceValue(d.value),
    success: successIcon(d.success),
  }})
  const transactionColumns = [
    {Header: 'Transaction', accessor: 'id'},
    {Header: 'Block', accessor: 'block'},
    {Header: 'Timestamp', accessor: 'timestamp'},
    {Header: 'From', accessor: 'from'},
    {Header: 'To', accessor: 'to'},
    {Header: 'Value', accessor: 'value'},
    {Header: 'Success', accessor: 'success'},
  ]
  const transactionParams = {data: transactionData, columns: transactionColumns}
  return transactionParams
}

export function processTransfers(nodes) {
  const transferData = nodes.map(d => {return {
    id: d.id,
    extrinsic: getLink(d.extrinsicId, 'extrinsic'),
    timestamp: d.block.timestamp,
    from: getLink(d.fromId, 'account'),
    to: getLink(d.toId, 'account'),
    value: reduceValue(d.value)
  }})
  const transferColumns = [
    {Header: 'Event', accessor: 'id'},
    {Header: 'Extrinsic', accessor: 'extrinsic'},
    {Header: 'Timestamp', accessor: 'timestamp'},
    {Header: 'From', accessor: 'from'},
    {Header: 'To', accessor: 'to'},
    {Header: 'Value', accessor: 'value'},
  ]
  const transferParams = {data: transferData, columns: transferColumns}
  return transferParams
}

export function processErc20Transfers(nodes) {
  const erc20TransferData = nodes.map(d => {return {
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
  return erc20TransferParams
}

export function processErc721Transfers(nodes) {
  const erc721TransferData = nodes.map(d => {return {
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
  return erc721TransferParams
}
