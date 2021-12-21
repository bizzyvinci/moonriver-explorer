import React from 'react'
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Heading } from '@chakra-ui/react'
import { request, gql } from 'graphql-request'
import { ENDPOINT } from '../utils'
import Table from '../components/Table'
import Overview from '../components/Overview'
import { extrinsicQuery, eventQuery, variables, 
  processExtrinsic, processEvents } from './data/Extrinsic'


export default function Extrinsic() {
  const { id } = useParams();
  variables.id = id
  variables.filter = {extrinsicId: {equalTo: id}}
  
  const defaultParams = {data: [], columns: []}
  const [overview, setOverview] = useState({data: []})
  const [eventCurrentPage, setEventCurrentPage] = useState(0)
  const [eventTotalPage, setEventTotalPage] = useState(-1)
  const [events, setEvents] = useState(defaultParams)

  useEffect(() => {
    async function getData() {
      const res = await request(ENDPOINT, extrinsicQuery, variables)
      console.log(res)
      if (res.events.totalCount > 0) {
        setEventTotalPage(Math.floor((res.events.totalCount - 1) / variables.limit))
      }
      const params = processExtrinsic(res.extrinsic, res.events.totalCount)
      console.log(params)
      return params
    }
    getData().then(params => {
      setOverview(params)
    })
  }, [])

  // get events (if there are)
  useEffect(() => {
    async function getData() {
      variables.eventOffset = eventCurrentPage * variables.limit
      const res = await request(ENDPOINT, eventQuery, variables)
      console.log(res)
      const params = processEvents(res.events.nodes)
      return params
    }
    getData().then(params => {
      setEvents(params)
    })
  }, [eventTotalPage, eventCurrentPage])

  return (
    <>
      <Heading>Extrinsic #{id}</Heading>
      <Overview {...overview} />
      <br /><br />
      { eventTotalPage >= 0 &&
        <>
          <Heading size='sm'>Events</Heading>
          <Table {...events} />
        </>
      }
    </>
  )
}

