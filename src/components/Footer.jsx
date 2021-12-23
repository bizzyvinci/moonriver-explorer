import {
  Flex,
  IconButton,
  Image,
  Link,
  useColorMode
} from '@chakra-ui/react';
import {
  MoonIcon,
  SunIcon
} from '@chakra-ui/icons';
import githubLogo from '../assets/github-logo.svg'


export default function Footer() {
  const { colorMode, toggleColorMode} = useColorMode()

  return (
    <Flex justify='space-around'>
      <Link href='https://github.com/bizzyvinci/moonriver-explorer'>
        <Image src={githubLogo} alt='github logo' h='50px' />
      </Link>
      {colorMode === 'light' 
        ? <IconButton aria-label='Switch to dark mode'
            icon={<MoonIcon />} onClick={toggleColorMode} h='50px' w='50px' />
        : <IconButton aria-label='Switch to light mode/>' 
            icon={<SunIcon />} onClick={toggleColorMode} h='50px' w='50px' />
      }
    </Flex>
  )
}
