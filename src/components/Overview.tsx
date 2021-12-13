import React from 'react'
import { Box, Stack, StackDivider } from '@chakra-ui/react'


export default function Overview() {
	return (
		<Stack direction='column'
			divider={<StackDivider borderColor='gray.200' />}>
			<Stack direction={['column', 'row']}>
				<Box minWidth='300px'>Address</Box>
				<Box>0x0000000000003292032302</Box>
			</Stack>
			<Stack direction={['column', 'row']}>
				<Box minWidth='300px'>Transaction</Box>
				<Box>0x000000000000329203230223424928743</Box>
			</Stack>
			<Stack direction={['column', 'row']}>
				<Box minWidth='300px'>Success</Box>
				<Box>Yes</Box>
			</Stack>
		</Stack>
	)
}
