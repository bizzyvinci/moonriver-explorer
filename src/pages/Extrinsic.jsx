import React from 'react'
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Heading, Link } from '@chakra-ui/react'
import { CheckCircleIcon, CloseIcon } from '@chakra-ui/icons'
import { request, gql } from 'graphql-request'
import { Config } from '../utils'
import Table from '../components/Table'
import Tabs from '../components/Tabs'
import Overview from '../components/Overview'


const query = gql`
  query($id: String!) {
    extrinsic(id: $id) {
      id
      hash
      transaction {id}
      block {id, timestamp}
      signerId
      section
      method
      success
    }
    events(filter: {extrinsicId: {equalTo: $id}}) {
      nodes {
        id
        section
        method
        docs
        data
      }
    }
  }

`


export default function Block() {
  const defaultParams = {data: [], columns: []}
  const { id } = useParams();
  const [overview, setOverview] = useState({data: []})
  const [events, setEvents] = useState(defaultParams)

  useEffect(() => {
    async function getData() {
      const variables = {id: id}
      const res = await request(Config.endpoint, query, variables)
      console.log(res)
      const params = processParams(res)
      console.log(params)
      return params
    }
    getData().then(params => {
      setOverview(params.overview)
      setEvents(params.events)
    })
  }, [])

  return (
    <>
      <Heading>Extrinsic #{id}</Heading>
      <Overview {...overview} />
      <br /><br />
      <Heading size='sm'>Events</Heading>
      <Table {...events} />
    </>
  )
}


function processParams(res) {
  const extrinsic = res.extrinsic
  const overviewData = [
    {label: 'Id', value: extrinsic.id},
    {label: 'Hash', value: extrinsic.hash},
    {label: 'Transaction', value: extrinsic.transaction?.id
      ? <Link href={'/transaction/'+extrinsic.transaction.id} color='blue.600'> 
          {extrinsic.transaction.id} </Link>
      : null},
    {label: 'Block', 
     value: <Link href={'/block/'+extrinsic.block.id} color='blue.600'> 
              {extrinsic.block.id} </Link>},
    {label: 'Timestamp', value: extrinsic.block.timestamp},
    {label: 'Signer', value: extrinsic.signerId
      ? <Link href={'/account/'+extrinsic.signerId} color='blue.600'> 
          {extrinsic.signerId} </Link>
      : null},
    {label: 'Success', value: extrinsic.success 
      ? <CheckCircleIcon color='green' />
      : <CloseIcon color='red' />,},
    {label: 'Section', value: extrinsic.section},
    {label: 'Method', value: extrinsic.method}
  ]
  const overviewParams = {data: overviewData}

  const eventData = res.events?.nodes.map(d => {return {
    id: d.id,
    section: d.section,
    method: d.method,
    //docs: d.docs,
    //data: d.data
  }})
  const eventColumns = [
    {Header: 'Event', accessor: 'id'},
    {Header: 'Section', accessor: 'section'},
    {Header: 'Method', accessor: 'method'},
  ]
  const eventParams = {data: eventData, columns: eventColumns}

  return {
    overview: overviewParams,
    events: eventParams
  }
}
