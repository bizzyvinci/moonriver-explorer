import React from 'react'
import { useState, useEffect } from 'react'
import { Heading } from '@chakra-ui/react'
import { request } from 'graphql-request'
import { ENDPOINT } from '../utils'
import Table from '../components/Table'
import { query, pageQuery, variables, processEvents } from './data/Events'


export default function Blocks() {
  const defaultParams = {data: [], columns: []}
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPage, setTotalPage] = useState(0)
  const [events, setEvents] = useState(defaultParams)

  useEffect(() => {
    async function getData() {
      variables.offset = currentPage * variables.limit
      const res = await request(ENDPOINT, query, variables)
      const pageRes = await request(ENDPOINT, pageQuery, variables)
      console.log(res, pageRes)
      setTotalPage((pageRes.events.totalCount
        ? Math.floor((pageRes.events.totalCount-1) / variables.limit)
        : 0))
      const eventParams = processEvents(res.events.nodes)
      return eventParams
    }
    getData().then(eventParams => setEvents(eventParams))
  }, [currentPage])

  return (
    <>
      <Heading>Events</Heading>
      <br />
      <Table currentPage={currentPage} totalPage={totalPage} goToPage={setCurrentPage} {...events} />
    </>
  )
}
