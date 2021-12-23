import React from 'react'
import { gql, request } from 'graphql-request'
import { ENDPOINT } from './utils'

const query = gql`
  query($id: String!) {
    account(id: $id) {id}
    block(id: $id) {id}
    extrinsic(id: $id) {id}
    transaction(id: $id) {id}
  }
`

const path = {
  account: 'account',
  block: 'block',
  extrinsic: 'extrinsic',
  transaction: 'tx'
}

export async function getUrl(id) {
  const variables = {id: id}
  const res = await request(ENDPOINT, query, variables)
  for (const [key, value] of Object.entries(res)) {
    if (value) {
      return `/${path[key]}/${value.id}`
    }
  }
  return null
}
