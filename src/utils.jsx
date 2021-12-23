import { Link } from '@chakra-ui/react'
import { CheckCircleIcon, CloseIcon } from '@chakra-ui/icons'
import bigInt from 'big-integer'


export const PAGE_LIMIT = 50
export const DECIMAL = 18
export const BIGINT_DECIMAL = bigInt(10**DECIMAL)
export const ENDPOINT = 'https://api.subquery.network/sq/bizzyvinci/moonriver__Yml6e'

export const getLink = (id, route) => {
  if (id) {
    return <Link href={`/${route}/${id}`} color='blue.600'>{id}</Link>
  } else {
    return null
  }
}

export const successIcon = (success) => (
  success
  ? <CheckCircleIcon color='green' />
  : <CloseIcon color='red' />
)

export const reduceValue = (value, by=BIGINT_DECIMAL) => {
  if (value) {
    return Number(value / by)
  } else {
    return Number(value)
  }
}

export const sum = (arr) => {
  if (arr){
    return arr.reduce((a,b) => a+b, 0)
  } else {
    return 0
  }
}
