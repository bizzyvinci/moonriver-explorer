import React from "react";
import { Box, IconButton, NumberInput, NumberInputField, Stack, Text } from '@chakra-ui/react'
import { ArrowBackIcon,
	ArrowForwardIcon,
	ArrowLeftIcon,
	ArrowRightIcon,
} from '@chakra-ui/icons'



export default function Pagination({ currentPage, totalPage, goToPage }) {
	return (
		<Stack direction='row'>
			<IconButton icon={<ArrowLeftIcon />} 
				aria-label='Go to first page' 
				onClick={() => goToPage(0)}
				isDisabled={currentPage <= 0}
			/>
			<IconButton icon={<ArrowBackIcon />} 
				aria-label='Go back' 
				onClick={() => goToPage(currentPage - 1)}
				isDisabled={currentPage <= 0}
			/>
			<NumberInput value={currentPage+1}
				max={totalPage+1} min={1} inputMode='numeric' 
				onChange={(s, valueAsNumber) => goToPage(valueAsNumber - 1)}
				onEmptied={null}
			>
				<NumberInputField width='fit-content'></NumberInputField>
			</NumberInput>
			<Text>of {totalPage+1}</Text>
			<IconButton icon={<ArrowForwardIcon />} 
				aria-label='Go forward' 
				onClick={() => goToPage(currentPage + 1)}
				isDisabled={currentPage >= totalPage}
			/>
			<IconButton icon={<ArrowRightIcon />} 
				aria-label='Go to last page' 
				onClick={() => goToPage(totalPage)}
				isDisabled={currentPage >= totalPage}
			/>
		</Stack>
	)
}

