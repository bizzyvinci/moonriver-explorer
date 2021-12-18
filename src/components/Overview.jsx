import React from 'react'
import { Box, Stack, StackDivider } from '@chakra-ui/react'


export default function Overview({data}) {
  return (
    <Stack direction='column'
      divider={<StackDivider borderColor='gray.200' />}
    > 
      {data?.length && data.map(d => (
        d.value
        ? <Stack direction={['column', 'row']} key={d.label}>
            <Box minWidth='300px'>{d.label}</Box>
            <Box>{d.value}</Box>
          </Stack>
        : null
      ))}
    </Stack>
  )
}
