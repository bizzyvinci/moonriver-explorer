import React from 'react'
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Heading } from '@chakra-ui/react'
import { request } from 'graphql-request'
import { ENDPOINT } from '../utils'
import Table from '../components/Table'
import Tabs from '../components/Tabs'
import Overview from '../components/Overview'
import { variables, countQuery, stakeQuery, candidateQuery, delegatorQuery, rewardQuery,
  processCounts, processStake, processCandidates, processDelegators, processRewards
} from './data/Stake'


export default function Stake() {
  const { id } = useParams();
  variables.id = id

  const defaultParams = {data: [], columns: []}
  const [overview, setOverview] = useState({data: []})
  
  const [candidateCurrentPage, setCandidateCurrentPage] = useState(0)
  const [candidateTotalPage, setCandidateTotalPage] = useState(-1)
  const [candidates, setCandidates] = useState(defaultParams)

  const [delegatorCurrentPage, setDelegatorCurrentPage] = useState(0)
  const [delegatorTotalPage, setDelegatorTotalPage] = useState(-1)
  const [delegators, setDelegators] = useState(defaultParams)

  const [rewardCurrentPage, setRewardCurrentPage] = useState(0)
  const [rewardTotalPage, setRewardTotalPage] = useState(-1)
  const [rewards, setRewards] = useState(defaultParams)

  // Check if they have stakes
  useEffect(() => {
    async function getData() {
      const res = await request(ENDPOINT, countQuery, variables)
      console.log(res)
      
      const counts = processCounts(res)
      if (counts.candidates > 0) {
        setCandidateTotalPage(Math.floor((counts.candidates-1) / variables.limit))
      }
      if (counts.delegators > 0) {
        setDelegatorTotalPage(Math.floor((counts.delegators-1) / variables.limit))
      }
      if (counts.rewards > 0) {
        setRewardTotalPage(Math.floor((counts.rewards-1) / variables.limit))
      }
      return counts
    }
    getData().then(counts => {
      return null
    })
  }, [])

  // Get overview and set totalPage
  useEffect(() => {
    async function getData() {
      const res = await request(ENDPOINT, stakeQuery, variables)
      console.log(res)
      
      const params = processStake(res)
      //console.log(params)
      return params
    }
    getData().then(params => {
      setOverview(params)
    })
  }, [rewardTotalPage, delegatorTotalPage, candidateTotalPage])

  // get candidates (if there are)
  useEffect(() => {
    async function getData() {
      variables.candidateOffset = candidateCurrentPage * variables.limit
      const res = await request(ENDPOINT, candidateQuery, variables)
      console.log(res)
      const params = processCandidates(res.delegations.nodes)
      return params
    }
    getData().then(params => {
      setCandidates(params)
    })
  }, [candidateTotalPage, candidateCurrentPage])

  // get delegators (if there are)
  useEffect(() => {
    async function getData() {
      variables.delegatorOffset = delegatorCurrentPage * variables.limit
      const res = await request(ENDPOINT, delegatorQuery, variables)
      console.log(res)
      const params = processDelegators(res.delegations.nodes)
      return params
    }
    getData().then(params => {
      setDelegators(params)
    })
  }, [delegatorTotalPage, delegatorCurrentPage])

  // get rewards
  useEffect(() => {
    async function getData() {
      variables.rewardOffset = rewardCurrentPage * variables.limit
      const res = await request(ENDPOINT, rewardQuery, variables)
      console.log(res)
      const params = processRewards(res.rewards.nodes)
      return params
    }
    getData().then(params => {
      setRewards(params)
    })
  }, [rewardTotalPage, rewardCurrentPage])


  const tabData = [
    {
      label: 'Candidates',
      content: candidateTotalPage >= 0 && <Table
          currentPage={candidateCurrentPage} totalPage={candidateTotalPage}
          goToPage={setCandidateCurrentPage} {...candidates} />
    },
    {
      label: 'Delegators',
      content: delegatorTotalPage >= 0 && <Table
          currentPage={delegatorCurrentPage} totalPage={delegatorTotalPage}
          goToPage={setDelegatorCurrentPage} {...delegators} />
    },
    {
      label: 'Rewards',
      content: rewardTotalPage >= 0 && <Table
          currentPage={rewardCurrentPage} totalPage={rewardTotalPage}
          goToPage={setRewardCurrentPage} {...rewards} />
    },
  ]


  return (
    <>
      <Heading>Stake: {id}</Heading>
      <Overview {...overview} />
      <br /><br />
      <Tabs data={tabData} />
    </>
  )
}
