import React from 'react'
import { useState, useEffect } from 'react';
import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  CloseButton
} from '@chakra-ui/react'
import { request, gql } from 'graphql-request'
import { ENDPOINT } from '../utils'


const query = gql`
  query _metadata {
    _metadata {
      lastProcessedHeight
      targetHeight
    }
  }
`

export default function Warning() {
  const [currentBlock, setCurrentBlock] = useState(0)
  const [targetBlock, setTargetBlock] = useState(0)

  useEffect(() => {
    async function getData() {
      const res = await request(ENDPOINT, query)
      //console.log(res)
      const d = res._metadata
      return [d.lastProcessedHeight, d.targetHeight]
    }
    getData().then(([current, target]) => {
      setCurrentBlock(current);
      setTargetBlock(target);
    })
  }, [])

  return (
    <Alert status='error'>
      <AlertIcon />
      <AlertTitle mr={2}>Account balance is not done right and data has not been fully indexed!</AlertTitle>
      <AlertDescription>Current Block: {currentBlock} Target Block:{targetBlock}</AlertDescription>
      <CloseButton position='absolute' right='8px' top='8px' />
    </Alert>
  )
}
