import React from 'react'
import { Link } from '@chakra-ui/react'
import { CheckCircleIcon, CloseIcon } from '@chakra-ui/icons'


function processRes(res) {
  const overviewData = processOverview(res.account, res.eRC20Balances, res.erc721Balances)

  const extrinsicData = res.extrinsics?.nodes.map(d => {return {
    id: <Link href={'/extrinsic/'+d.id} color='blue.600'> {d.id} </Link>,
    block: <Link href={'/block/'+d.block.id} color='blue.600'> {d.block.id} </Link>,
    timestamp: d.block.timestamp,
    section: d.section,
    method: d.method,
  }})
  const extrinsicColumns = [
    {Header: 'Extrinsic', accessor: 'id'},
    {Header: 'Block', accessor: 'block'},
    {Header: 'Timestamp', accessor: 'timestamp'},
    {Header: 'Section', accessor: 'section'},
    {Header: 'Method', accessor: 'method'},
  ]
  const extrinsicParams = {data: extrinsicData, columns: extrinsicColumns}

  const transactionData = res.transactions?.nodes.map(d => {return {
    id: <Link href={'/transaction/'+d.id} color='blue.600'> {d.id} </Link>,
    block: <Link href={'/block/'+d.block.id} color='blue.600'> {d.block.id} </Link>,
    timestamp: d.block.timestamp,
    from: d.fromId,
    to: d.toId,
    value: d.value,
    success: d.success 
      ? <CheckCircleIcon color='green' />
      : <CloseIcon color='red' />,
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

  const transferData = res.transfers?.nodes.map(d => {return {
    id: id,
    extrinsic: <Link href={'/extrinsic/'+d.extrinsicId} color='blue.600'> {d.extrinsicId} </Link>,
    timestamp: d.block.timestamp,
    from: d.fromId,
    to: d.toId,
    value: d.value
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

  const erc20TransferData = res.eRC20Transfers?.nodes.map(d => {return {
    id: id,
    transaction: <Link href={'/transaction/'+d.log.transactionId} color='blue.600'> {d.log.transactionId} </Link>,
    timestamp: d.log.block.timestamp,
    from: d.fromId,
    to: d.toId,
    value: d.value
  }})
  const erc20TransferColumns = [
    {Header: 'Event', accessor: 'id'},
    {Header: 'Transaction', accessor: 'transaction'},
    {Header: 'Timestamp', accessor: 'timestamp'},
    {Header: 'From', accessor: 'from'},
    {Header: 'To', accessor: 'to'},
    {Header: 'Value', accessor: 'value'},
  ]
  const erc20TransferParams = {data: erc20TransferData, columns: erc20TransferColumns}

  const erc721TransferData = res.transfer?.nodes.map(d => {return {
    id: id,
    transaction: <Link href={'/transaction/'+d.log.transactionId} color='blue.600'> {d.log.transactionId} </Link>,
    timestamp: d.log.block.timestamp,
    from: d.fromId,
    to: d.toId,
    value: d.value
  }})
  const erc721TransferColumns = [
    {Header: 'Event', accessor: 'id'},
    {Header: 'Transaction', accessor: 'transaction'},
    {Header: 'Timestamp', accessor: 'timestamp'},
    {Header: 'From', accessor: 'from'},
    {Header: 'To', accessor: 'to'},
    {Header: 'Value', accessor: 'value'},
  ]
  const erc721ransferParams = {data: erc721TransferData, columns: erc721TransferColumns}

  //candidate and delegation and reward
  return {
    overview: overviewData,
    extrinsic: extrinsicParams,
    transaction: transactionParams,
    transfer: transferParams,
    erc20Transfer: erc20TransferParams,
    erc721Transfer: erc721TransferParams,
  }
}


function processOverview(account, erc20Balance, erc721Balance) {
  
  const overviewData = [
    {
      label: 'Address', 
      value: account.id
    },
    {
      label: 'Free Balance', 
      value: account.freeBalance
    },
    {
      label: 'Reserved Balance',
      value: account.reservedBalance
    },
    {
      label: 'Total Balance',
      value: account.totalBalance
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
      value: account.creatorId && <Link href={'/account/'+account.creatorId}>{account.creatorId}</Link>
    },
    {
      label: 'Created At',
      value: account.createdAt && <Link href={'/transaction/'+account.createdAt}>{account.createdAt}</Link>
    },
    {
      label: 'Token Page',
      value: account.isContract && <Link href={'/token/'+account.id}>{account.id}</Link>
    }
  ]

  return overviewData
}
