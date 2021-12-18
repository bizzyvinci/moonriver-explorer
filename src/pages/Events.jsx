import React from 'react'
import { useState, useEffect } from 'react';
import { request, gql } from 'graphql-request'
import { Config } from '../utils'
import Table from '../components/Table'


const query = gql`
  query($limit: Int, $orderBy: [EventsOrderBy!]) {
    events(first: $limit, orderBy: $orderBy) {
      nodes {
        id
        extrinsicId
        block {id, timestamp}
        section
        method
        docs
        data
      }
    }
  }

`

const variables = {
  limit: 50,
  orderBy: "ID_ASC"
}

export default function Blocks() {
  const defaultP = {data: [], columns: []}
  const [events, setEvents] = useState(defaultP)

  useEffect(() => {
    async function getData() {
      const res = await request(Config.endpoint, query, variables)
      console.log(res)
      const eventP = processEvents(res.events.nodes)
      return eventP
    }
    getData().then(eventP => setEvents(eventP))
  }, [])

  return (
    <Table {...events} />
  )
}


function processEvents(nodes) {
  const data = nodes.map(d => {return {
    id: d.id,
    extrinsic: d.extrinsicId,
    block: d.block.id,
    date: d.block.timestamp,
    section: d.section,
    method: d.method,
    docs: d.docs,
    data: d.data
  }})

  const columns = [
    {Header: 'Event', accessor: 'id'},
    {Header: 'Extrinsic', accessor: 'extrinsic'},
    {Header: 'Block', accessor: 'block'},
    {Header: 'Date', accessor: 'date'},
    {Header: 'Section', accessor: 'section'},
    {Header: 'Method', accessor: 'method'},
  ]

  return {data: data, columns: columns}
}
