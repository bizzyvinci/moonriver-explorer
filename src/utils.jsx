import { Link } from '@chakra-ui/react'
import { CheckCircleIcon, CloseIcon } from '@chakra-ui/icons'
import bigInt from 'big-integer'


export const PAGE_LIMIT = 50
export const DECIMAL = 18
export const BIGINT_DECIMAL = bigInt(10**DECIMAL)
export const ENDPOINT = 'https://api.subquery.network/sq/bizzyvinci/moonriver'

export const getLink = (id, route, truncate=6) => {
  if (id) {
    return (
      <Link href={`/${route}/${id}`} color='blue.600'>
        {
          ['account', 'stake', 'token', 'tx'].includes(route) 
          ? truncateText(id, truncate)
          : id
        }
      </Link>
    )
  } else {
    return null
  }
}

export const truncateText = (text, l=6) => {
  if (l && l>0) {
    return `${text.slice(0, l+2)}...${text.slice(-l)}`
  } else {
    return text
  }
}

// timeSince copied from https://stackoverflow.com/a/3177838/7283203
export const timeSince = (date) => {
  if (!date) {
    return null
  }
  var seconds = Math.floor((new Date() - new Date(date)) / 1000);

  var interval = seconds / 31536000;

  if (interval > 1) {
    return Math.floor(interval) + " years ago";
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return Math.floor(interval) + " months ago";
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + " days ago";
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + " hours ago";
  }
  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + " minutes ago";
  }
  return Math.floor(seconds) + " seconds ago";
}

export const successIcon = (success) => {
  return (
    success
    ? <CheckCircleIcon color='green' />
    : <CloseIcon color='red' />
  )
}

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
