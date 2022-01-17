import React from 'react'
import {
  Box,
  Table as CTable,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from '@chakra-ui/react'
import { useTable } from 'react-table'
import Pagination from './Pagination'


export default function Table({ columns, data, variant, currentPage, totalPage, goToPage }) {
  // Use the state and functions returned from useTable to build your UI
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({
    columns,
    data,
  })

  // Render the UI for your table
  return (
    <>
      <Box display='block' overflowX='auto' whiteSpace='nowrap' >
        <CTable variant={variant || 'simple'} {...getTableProps()}>
          <Thead>
            {headerGroups.map(headerGroup => (
              <Tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                  <Th {...column.getHeaderProps()}>{column.render('Header')}</Th>
                ))}
              </Tr>
            ))}
          </Thead>
          <Tbody {...getTableBodyProps()}>
            {rows.map((row, i) => {
              prepareRow(row)
              return (
                <Tr {...row.getRowProps()}>
                  {row.cells.map(cell => {
                    return <Td {...cell.getCellProps()}>{cell.render('Cell')}</Td>
                  })}
                </Tr>
              )
            })}
          </Tbody>
        </CTable>
      </Box>
      {totalPage > 0 && <Pagination currentPage={currentPage} totalPage={totalPage} goToPage={goToPage} />}
    </>
  )
}


// export interface Column {Header: string; accessor: string}
// export interface Columns extends Array<Column> {}
// export interface SingleData { [index: string]: any; }
// export interface Data extends Array<SingleData> {}
// export interface Props {columns: Columns; data: Data; variant?: string}
