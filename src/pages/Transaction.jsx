import React from 'react'
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Heading } from '@chakra-ui/react'
import { request, gql } from 'graphql-request'
import { ENDPOINT } from '../utils'
import Table from '../components/Table'
import Overview from '../components/Overview'
import Tabs from '../components/Tabs'
import { variables, countQuery, transactionQuery, 
  erc20TransferQuery, erc721TransferQuery, logQuery,
  processCounts, processTransaction,
  processErc20Transfers, processErc721Transfers,
  processLogs 
} from './data/Transaction'


export default function Transaction() {
  const { id } = useParams();
  variables.id = id
  
  const defaultParams = {data: [], columns: []}
  const [overview, setOverview] = useState({data: []})


  const [erc20TransferCurrentPage, setErc20TransferCurrentPage] = useState(0)
  const [erc20TransferTotalPage, setErc20TransferTotalPage] = useState(-1)
  const [erc20Transfers, setErc20Transfers] = useState(defaultParams)

  const [erc721TransferCurrentPage, setErc721TransferCurrentPage] = useState(0)
  const [erc721TransferTotalPage, setErc721TransferTotalPage] = useState(-1)
  const [erc721Transfers, setErc721Transfers] = useState(defaultParams)

  const [logCurrentPage, setLogCurrentPage] = useState(0)
  const [logTotalPage, setLogTotalPage] = useState(-1)
  const [logs, setLogs] = useState(defaultParams)

  useEffect(() => {
    async function getData() {
      const transactionRes = await request(ENDPOINT, transactionQuery, variables)
      const countRes = await request(ENDPOINT, countQuery, variables)
      console.log(transactionRes, countRes)
      
      const counts = processCounts(countRes)
      if (counts.erc20Transfers > 0) {
        setErc20TransferTotalPage(Math.floor((counts.erc20Transfers-1) / variables.limit))
      }
      if (counts.erc721Transfers > 0) {
        setErc721TransferTotalPage(Math.floor((counts.erc721Transfers-1) / variables.limit))
      }
      if (counts.logs > 0) {
        setLogTotalPage(Math.floor((counts.logs-1) / variables.limit))
      }
      
      const params = processTransaction(transactionRes)
      //console.log(params)
      return params
    }
    getData().then(params => {
      setOverview(params)
    })
  }, [])

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

  // get logs (if there are)
  useEffect(() => {
    async function getData() {
      variables.logOffset = logCurrentPage * variables.limit
      const res = await request(ENDPOINT, logQuery, variables)
      console.log(res)
      const params = processLogs(res.logs.nodes)
      return params
    }
    getData().then(params => {
      setLogs(params)
    })
  }, [logTotalPage, logCurrentPage])

  const tabData = [
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
    {
      label: 'Logs',
      content: logTotalPage >= 0 && <Table
          currentPage={logCurrentPage} totalPage={logTotalPage}
          goToPage={setLogCurrentPage} {...logs} />
    },
  ]


  return (
    <>
      <Heading>Transaction: {id}</Heading>
      <Overview {...overview} />
      <br /><br />
      <Tabs data={tabData} />
    </>
  )
}

