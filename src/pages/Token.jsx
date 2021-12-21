import React from 'react'
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Heading } from '@chakra-ui/react'
import { request } from 'graphql-request'
import { ENDPOINT } from '../utils'
import Table from '../components/Table'
import Tabs from '../components/Tabs'
import Overview from '../components/Overview'
import { variables, countQuery, tokenQuery, transferQuery, balanceQuery,
  processCounts, processToken, processTransfers, processBalances
} from './data/Token'


export default function Token() {
  const { id } = useParams();
  variables.id = id

  const defaultParams = {data: [], columns: []}
  const [overview, setOverview] = useState({data: []})
  const [isErc20, setIsErc20] = useState(false)
  
  const [transferCurrentPage, setTransferCurrentPage] = useState(0)
  const [transferTotalPage, setTransferTotalPage] = useState(-1)
  const [transfers, setTransfers] = useState(defaultParams)

  const [balanceCurrentPage, setBalanceCurrentPage] = useState(0)
  const [balanceTotalPage, setBalanceTotalPage] = useState(-1)
  const [balances, setBalances] = useState(defaultParams)

  // Get overview and set totalPage
  useEffect(() => {
    async function getData() {
      const tokenRes = await request(ENDPOINT, tokenQuery, variables)
      const countRes = await request(ENDPOINT, countQuery, variables)
      console.log(tokenRes, countRes)
      
      const counts = processCounts(countRes)
      if (counts.erc20Transfers > 0) {
        setTransferTotalPage(Math.floor((counts.erc20Transfers-1) / variables.limit))
      }
      if (counts.erc721Transfers > 0) {
        setIsErc20(false)
        setTransferTotalPage(Math.floor((counts.erc721Transfers-1) / variables.limit))
      }
      if (counts.erc20Balances > 0) {
        setBalanceTotalPage(Math.floor((counts.erc20Balances-1) / variables.limit))
      }
      if (counts.erc721Balances > 0) {
        setBalanceTotalPage(Math.floor((counts.erc721Balances-1) / variables.limit))
      }
      
      const params = processToken(tokenRes)
      //console.log(params)
      return params
    }
    getData().then(params => {
      setOverview(params)
    })
  }, [])

  // get transfers (if there are)
  useEffect(() => {
    async function getData() {
      variables.transferOffset = transferCurrentPage * variables.limit
      const res = await request(ENDPOINT, transferQuery, variables)
      console.log(res)
      const params = processTransfers(res)
      return params
    }
    getData().then(params => {
      isErc20 ? setTransfers(params.erc20) : setTransfers(params.erc721)
    })
  }, [transferTotalPage, transferCurrentPage])

  // get balances (if there are)
  useEffect(() => {
    async function getData() {
      variables.balanceOffset = balanceCurrentPage * variables.limit
      const res = await request(ENDPOINT, balanceQuery, variables)
      console.log(res)
      const params = processBalances(res)
      return params
    }
    getData().then(params => {
      isErc20 ? setBalances(params.erc20) : setBalances(params.erc721)
    })
  }, [balanceTotalPage, balanceCurrentPage])

  
  const tabData = [
    {
      label: 'Transfers',
      content: transferTotalPage >= 0 && <Table
          currentPage={transferCurrentPage} totalPage={transferTotalPage}
          goToPage={setTransferCurrentPage} {...transfers} />
    },
    {
      label: 'Holders',
      content: balanceTotalPage >= 0 && <Table
          currentPage={balanceCurrentPage} totalPage={balanceTotalPage}
          goToPage={setBalanceCurrentPage} {...balances} />
    },
  ]


  return (
    <>
      <Heading>Token: {id}</Heading>
      <Overview {...overview} />
      <br /><br />
      <Tabs data={tabData} />
    </>
  )
}
