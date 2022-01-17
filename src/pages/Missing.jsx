import React from "react";
import { Heading } from '@chakra-ui/react'
import { useParams } from 'react-router-dom';

export default function Missing() {
  const { id } = useParams();
  return (
    <Heading textAlign='center'>{`${id} can't be found`}</Heading>
  )
}
