import { PAGE_LIMIT, getLink, reduceValue, sum,
  truncateText, timeSince
} from '../../utils'
import { gql } from 'graphql-request'

export const variables = {
  limit: PAGE_LIMIT,
  candidateOffset: 0,
  delegatorOffset: 0,
  rewardOffset: 0
}

export const countQuery = gql`
  query($id: String!) {
    candidate(id: $id) {
      delegations {totalCount}
    }
    delegator(id: $id) {
      delegations {totalCount}
    }
    rewards(filter: {accountId: {equalTo: $id}}) {totalCount}
  }
`

export const stakeQuery = gql`
  query($id: String!) {
    candidate(id: $id) {
      id
      selfBonded
      delegations(first: 100) {
        totalCount
        nodes {value}
      }
    }
    delegator(id: $id) {
      id
      delegations(first: 100) {
        totalCount
        nodes {value}
      }
    }
  }
`

export const candidateQuery  = gql`
  query($id: String!, $limit: Int, $candidateOffset: Int) {
    delegations(first: $limit, offset: $candidateOffset, filter: {delegatorId: {equalTo: $id}}, orderBy: VALUE_DESC) {
      nodes {
        delegatorId
        candidateId
        value
      }
    }
  }
`

export const delegatorQuery  = gql`
  query($id: String!, $limit: Int, $delegatorOffset: Int) {
    delegations(first: $limit, offset: $delegatorOffset, filter: {candidateId: {equalTo: $id}}, orderBy: VALUE_DESC) {
      nodes {
        delegatorId
        candidateId
        value
      }
    }
  }  
`

export const rewardQuery  = gql`
  query($id: String!, $limit: Int, $rewardOffset: Int) {
    rewards(first: $limit, offset: $rewardOffset, filter: {accountId: {equalTo: $id}}, orderBy: BLOCK_NUMBER_DESC) {
      nodes {
        blockNumber
        timestamp
        accountId
        value
      }
    }
  }
`

export function processCounts(res) {
  const counts = {
    candidates: res.delegator 
      ? res.delegator.delegations.totalCount
      : 0,
    delegators: res.candidate
      ? res.candidate.delegations.totalCount
      : 0,
    rewards: res.rewards.totalCount,
  }
  return counts
}

export function processStake(res) {
  const { candidate, delegator } = res
  const overviewData = [
    {label: 'Account', value: getLink((candidate?.id || res.delegator?.id), 'account', 0)},
    // as a candidate
    {label: 'Self Bonded', value: reduceValue(candidate?.selfBonded)},
    {
      label: 'Total Bonded',
      value: reduceValue(candidate?.selfBonded)
        + sum(candidate?.delegations.nodes.map(x => reduceValue(x.value)))
    },
    {
      label: 'Delegators',
      value: candidate?.delegations.totalCount > 100
        ? '100+'
        : candidate ? String(candidate?.delegations.totalCount) : null
    },
    // as a delegator
    {
      label: 'Delegated', 
      value: sum(delegator?.delegations.nodes.map(x => reduceValue(x.value)))
    },
    {
      label: 'Candidates',
      value: delegator?.delegations.totalCount > 100
        ? '100+'
        : delegator ? String(delegator?.delegations.totalCount) : null
    },
  ]
  const overviewParams = {data: overviewData}
  return overviewParams
}

export function processCandidates(nodes) {
  const candidateData = nodes.map(d => {return {
    candidate: getLink(d.candidateId, 'stake'),
    delegator: truncateText(d.delegatorId),
    value: reduceValue(d.value),
  }})
  const candidateColumns = [
    {Header: 'Candidate', accessor: 'candidate'},
    {Header: 'Delegator', accessor: 'delegator'},
    {Header: 'Value', accessor: 'value'}
  ]
  const candidateParams = {data: candidateData, columns: candidateColumns}
  return candidateParams
}

export function processDelegators(nodes) {
  const delegatorData = nodes.map(d => {return {
    delegator: getLink(d.delegatorId, 'stake'),
    candidate: truncateText(d.candidateId),
    value: reduceValue(d.value),
  }})
  const delegatorColumns = [
    {Header: 'Delegator', accessor: 'delegator'},
    {Header: 'Candidate', accessor: 'candidate'},
    {Header: 'Value', accessor: 'value'}
  ]
  const delegatorParams = {data: delegatorData, columns: delegatorColumns}
  return delegatorParams
}

export function processRewards(nodes) {
  const rewardData = nodes.map(d => {return {
    block: getLink(d.blockNumber, 'block'),
    timestamp: timeSince(d.timestamp),
    account: truncateText(d.accountId),
    value: reduceValue(d.value),
  }})
  const rewardColumns = [
    {Header: 'Block', accessor: 'block'},
    {Header: 'Time', accessor: 'timestamp'},
    {Header: 'Account', accessor: 'account'},
    {Header: 'Value', accessor: 'value'}
  ]
  const rewardParams = {data: rewardData, columns: rewardColumns}
  return rewardParams
}
