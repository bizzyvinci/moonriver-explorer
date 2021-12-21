import { Link } from '@chakra-ui/react'
import { CheckCircleIcon, CloseIcon } from '@chakra-ui/icons'
import bigInt from 'big-integer'

export const Config = {
  endpoint: 'https://api.subquery.network/sq/bizzyvinci/another-moonriver__Yml6e'
}

export const PAGE_LIMIT = 50
export const DECIMAL = 18
export const BIGINT_DECIMAL = bigInt(10**DECIMAL)
export const ENDPOINT = 'https://api.subquery.network/sq/bizzyvinci/another-moonriver__Yml6e'

export const getLink = (id, route) => (
  <Link href={`/${route}/${id}`} color='blue.600'>{id}</Link>
)

export const successIcon = (success) => (
  success
  ? <CheckCircleIcon color='green' />
  : <CloseIcon color='red' />
)

export const reduceValue = (value, by=BIGINT_DECIMAL) => {
  return value / by
}
