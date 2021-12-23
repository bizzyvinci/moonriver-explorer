import React from 'react'
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Heading } from '@chakra-ui/react'
import { request } from 'graphql-request'
import { ENDPOINT } from '../utils'
import Table from '../components/Table'
import Tabs from '../components/Tabs'
import Overview from '../components/Overview'
import { variables, countQuery, accountQuery, extrinsicQuery, transactionQuery,
  transferQuery, erc20TransferQuery, erc721TransferQuery,
  processCounts, processAccount, processExtrinsics, processTransactions,
  processTransfers, processErc20Transfers, processErc721Transfers 
} from './data/Account'


export default function Account() {
  const { id } = useParams();
  variables.id = id

  const defaultParams = {data: [], columns: []}
  const [overview, setOverview] = useState({data: []})
  
  const [extrinsicCurrentPage, setExtrinsicCurrentPage] = useState(0)
  const [extrinsicTotalPage, setExtrinsicTotalPage] = useState(-1)
  const [extrinsics, setExtrinsics] = useState(defaultParams)
  
  const [transactionCurrentPage, setTransactionCurrentPage] = useState(0)
  const [transactionTotalPage, setTransactionTotalPage] = useState(-1)
  const [transactions, setTransactions] = useState(defaultParams)
  
  const [transferCurrentPage, setTransferCurrentPage] = useState(0)
  const [transferTotalPage, setTransferTotalPage] = useState(-1)
  const [transfers, setTransfers] = useState(defaultParams)

  const [erc20TransferCurrentPage, setErc20TransferCurrentPage] = useState(0)
  const [erc20TransferTotalPage, setErc20TransferTotalPage] = useState(-1)
  const [erc20Transfers, setErc20Transfers] = useState(defaultParams)

  const [erc721TransferCurrentPage, setErc721TransferCurrentPage] = useState(0)
  const [erc721TransferTotalPage, setErc721TransferTotalPage] = useState(-1)
  const [erc721Transfers, setErc721Transfers] = useState(defaultParams)

  // Get overview and set totalPage
  useEffect(() => {
    async function getData() {
      const accountRes = await request(ENDPOINT, accountQuery, variables)
      const countRes = await request(ENDPOINT, countQuery, variables)
      console.log(accountRes, countRes)
      
      const counts = processCounts(countRes)
      if (counts.extrinsics > 0) {
        setExtrinsicTotalPage(Math.floor((counts.extrinsics-1) / variables.limit))
      }
      if (counts.transactions > 0) {
        setTransactionTotalPage(Math.floor((counts.transactions-1) / variables.limit))
      }
      if (counts.transfers > 0) {
        setTransferTotalPage(Math.floor((counts.transfers-1) / variables.limit))
      }
      if (counts.erc20Transfers > 0) {
        setErc20TransferTotalPage(Math.floor((counts.erc20Transfers-1) / variables.limit))
      }
      if (counts.erc721Transfers > 0) {
        setErc721TransferTotalPage(Math.floor((counts.erc721Transfers-1) / variables.limit))
      }
      
      const params = processAccount(accountRes)
      //console.log(params)
      return params
    }
    getData().then(params => {
      setOverview(params)
    })
  }, [])

  // get extrinsics (if there are)
  useEffect(() => {
    async function getData() {
      variables.extrinsicOffset = extrinsicCurrentPage * variables.limit
      const res = await request(ENDPOINT, extrinsicQuery, variables)
      console.log(res)
      const params = processExtrinsics(res.extrinsics.nodes)
      return params
    }
    getData().then(params => {
      setExtrinsics(params)
    })
  }, [extrinsicTotalPage, extrinsicCurrentPage])

  // get transactions (if there are)
  useEffect(() => {
    async function getData() {
      variables.transactionOffset = transactionCurrentPage * variables.limit
      const res = await request(ENDPOINT, transactionQuery, variables)
      console.log(res)
      const params = processTransactions(res.transactions.nodes)
      return params
    }
    getData().then(params => {
      setTransactions(params)
    })
  }, [transactionTotalPage, transactionCurrentPage])

  // get transfers (if there are)
  useEffect(() => {
    async function getData() {
      variables.transferOffset = transferCurrentPage * variables.limit
      const res = await request(ENDPOINT, transferQuery, variables)
      console.log(res)
      const params = processTransfers(res.transfers.nodes)
      return params
    }
    getData().then(params => {
      setTransfers(params)
    })
  }, [transferTotalPage, transferCurrentPage])

  // get erc20 transfers (if there are)
  useEffect(() => {
    async function getData() {
      variables.erc20TransferOffset = erc20TransferCurrentPage * variables.limit
      const res = await request(ENDPOINT, erc20TransferQuery, variables)
      console.log(res)
      const params = processErc20Transfers(res.erc20Transfers.nodes)
      return params
    }
    getData().then(params => {
      setErc20Transfers(params)
    })
  }, [erc20TransferTotalPage, erc20TransferCurrentPage])

  // get erc721 transfers (if there are)
  useEffect(() => {
    async function getData() {
      variables.erc721TransferOffset = erc721TransferCurrentPage * variables.limit
      const res = await request(ENDPOINT, erc721TransferQuery, variables)
      console.log(res)
      const params = processErc721Transfers(res.erc721Transfers.nodes)
      return params
    }
    getData().then(params => {
      setErc721Transfers(params)
    })
  }, [erc721TransferTotalPage, erc721TransferCurrentPage])

  
  const tabData = [
    {
      label: 'Extrinsics', 
      content: extrinsicTotalPage >= 0 && <Table 
          currentPage={extrinsicCurrentPage} totalPage={extrinsicTotalPage} 
          goToPage={setExtrinsicCurrentPage} {...extrinsics} />
    },
    {
      label: 'Transactions',
      content: transactionTotalPage >= 0 && <Table
          currentPage={transactionCurrentPage} totalPage={transactionTotalPage}
          goToPage={setTransactionCurrentPage} {...transactions} />
    },
    {
      label: 'Transfers',
      content: transferTotalPage >= 0 && <Table
          currentPage={transferCurrentPage} totalPage={transferTotalPage}
          goToPage={setTransferCurrentPage} {...transfers} />
    },
    {
      label: 'ERC20 Transfers',
      content: erc20TransferTotalPage >= 0 && <Table
          currentPage={erc20TransferCurrentPage} totalPage={erc20TransferTotalPage}
          goToPage={setErc20TransferCurrentPage} {...erc20Transfers} />
    },
    {
      label: 'ERC721 Transfers',
      content: erc721TransferTotalPage >= 0 && <Table
          currentPage={erc721TransferCurrentPage} totalPage={erc721TransferTotalPage}
          goToPage={setErc721TransferCurrentPage} {...erc721Transfers} />
    },
  ]


  return (
    <>
      <Heading>Account: {id}</Heading>
      <Overview {...overview} />
      <br /><br />
      <Tabs data={tabData} />
    </>
  )
}
