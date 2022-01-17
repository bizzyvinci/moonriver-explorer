import {
  Box,
  Flex,
  Text,
  IconButton,
  Image,
  Input,
  Stack,
  Collapse,
  Icon,
  Link,
  Popover,
  PopoverTrigger,
  PopoverContent,
  useColorModeValue,
  useDisclosure
} from '@chakra-ui/react';
import {
  HamburgerIcon,
  CloseIcon,
  ChevronDownIcon,
  ChevronRightIcon
} from '@chakra-ui/icons';
import brandLogo from '../assets/moonriver-logo.svg'
import { getUrl } from '../search'


export default function Navbar() {
  const { isOpen, onToggle } = useDisclosure();
  
  function handleSearch(e) {
    //console.log(`${e.target.value}${e.key}`)
    if (e.key === 'Enter') {
      const target = e.target.value.toLowerCase()
      getUrl(target).then(url => {
        url ? window.open(url, "_self") : window.open(`/missing/${target}`, "_self")
      })
    }
  }

  return (
    <Box>
      <Flex
        bg={useColorModeValue('white', 'gray.800')}
        color={useColorModeValue('gray.600', 'white')}
        minH={'60px'}
        py={{ base: 2 }}
        px={{ base: 4 }}
        borderBottom={1}
        borderStyle={'solid'}
        borderColor={useColorModeValue('gray.200', 'gray.900')}
        align={'center'}
        direction={{base: 'column', xl:'row'}}
        justify='space-between'>
        <Flex direction='row' w='-webkit-fill-available'>
          <Flex flex={{ base: 1 }}>
            <Link href='/'>
              <Image src={brandLogo} alt='brand logo' h={{base: '30px', md:'20px', sm:'30px'}} />
            </Link>
            <Flex display={{ base: 'none', md: 'flex' }} ml={10}>
              <DesktopNav />
            </Flex>
          </Flex>
          <Flex
            flex={{ base: 1, md: 'auto' }}
            justify={{ base: 'end', md: 'end' }}
            ml={{ base: -2 }}
            display={{ base: 'flex', md: 'none' }}>
            <IconButton
              onClick={onToggle}
              icon={
                isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />
              }
              variant={'ghost'}
              aria-label={'Toggle Navigation'}
            />
          </Flex>
        </Flex>

        <Flex w='-webkit-fill-available'
          maxWidth='400px'>
          <Input 
            onKeyPress = {(e) => handleSearch(e)}
            placeholder='Search by address, block, extrinsic, transaction'
          />
        </Flex>
      </Flex>

      <Collapse in={isOpen} animateOpacity>
        <MobileNav />
      </Collapse>
    </Box>
  );
}

const DesktopNav = () => {
  const linkColor = useColorModeValue('gray.600', 'gray.200');
  const linkHoverColor = useColorModeValue('gray.800', 'white');
  const popoverContentBgColor = useColorModeValue('white', 'gray.800');

  return (
    <Stack direction={'row'} spacing={4}>
      {NAV_ITEMS.map((navItem) => (
        <Box key={navItem.label}>
          <Popover trigger={'hover'} placement={'bottom-start'}>
            <PopoverTrigger>
              <Link
                p={2}
                href={navItem.href ?? '#'}
                fontSize={'sm'}
                fontWeight={500}
                color={linkColor}
                _hover={{
                  textDecoration: 'none',
                  color: linkHoverColor,
                }}>
                {navItem.label}
                {navItem.children && <ChevronDownIcon />}
              </Link>
            </PopoverTrigger>

            {navItem.children && (
              <PopoverContent
                border={0}
                boxShadow={'xl'}
                bg={popoverContentBgColor}
                p={4}
                rounded={'xl'}
                minW={'sm'}>
                <Stack>
                  {navItem.children.map((child) => (
                    <DesktopSubNav key={child.label} {...child} />
                  ))}
                </Stack>
              </PopoverContent>
            )}
          </Popover>
        </Box>
      ))}
    </Stack>
  );
};

const DesktopSubNav = ({ label, href, subLabel }) => {
  return (
    <Link
      href={href}
      role={'group'}
      display={'block'}
      p={2}
      rounded={'md'}
      _hover={{ bg: useColorModeValue('pink.50', 'gray.900') }}>
      <Stack direction={'row'} align={'center'}>
        <Box>
          <Text
            transition={'all .3s ease'}
            _groupHover={{ color: 'pink.400' }}
            fontWeight={500}>
            {label}
          </Text>
          <Text fontSize={'sm'}>{subLabel}</Text>
        </Box>
        <Flex
          transition={'all .3s ease'}
          transform={'translateX(-10px)'}
          opacity={0}
          _groupHover={{ opacity: '100%', transform: 'translateX(0)' }}
          justify={'flex-end'}
          align={'center'}
          flex={1}>
          <Icon color={'pink.400'} w={5} h={5} as={ChevronRightIcon} />
        </Flex>
      </Stack>
    </Link>
  );
};

const MobileNav = () => {
  return (
    <Stack
      bg={useColorModeValue('white', 'gray.800')}
      p={4}
      display={{ md: 'none' }}>
      {NAV_ITEMS.map((navItem) => (
        <MobileNavItem key={navItem.label} {...navItem} />
      ))}
    </Stack>
  );
};

const MobileNavItem = ({ label, children, href }) => {
  const { isOpen, onToggle } = useDisclosure();

  return (
    <Stack spacing={4} onClick={children && onToggle}>
      <Flex
        py={2}
        as={Link}
        href={href ?? '#'}
        justify={'space-between'}
        align={'center'}
        _hover={{
          textDecoration: 'none',
        }}>
        <Text
          fontWeight={600}
          color={useColorModeValue('gray.600', 'gray.200')}>
          {label}
        </Text>
        {children && (
          <Icon
            as={ChevronDownIcon}
            transition={'all .25s ease-in-out'}
            transform={isOpen ? 'rotate(180deg)' : ''}
            w={6}
            h={6}
          />
        )}
      </Flex>

      <Collapse in={isOpen} animateOpacity style={{ marginTop: '0!important' }}>
        <Stack
          mt={2}
          pl={4}
          borderLeft={1}
          borderStyle={'solid'}
          borderColor={useColorModeValue('gray.200', 'gray.700')}
          align={'start'}>
          {children &&
            children.map((child) => (
              <Link key={child.label} py={2} href={child.href}>
                {child.label}
              </Link>
            ))}
        </Stack>
      </Collapse>
    </Stack>
  );
};

// interface NavItem {
//   label: string;
//   subLabel?: string;
//   children?: Array<NavItem>;
//   href?: string;
// }

const NAV_ITEMS = [
  {
    label: 'Home',
    href: '/'
  },
  {
    label: 'Blockchain',
    children: [
      {
        label: 'Blocks',
        href: '/blocks',
      },
      {
        label: 'Extrinsics',
        href: '/extrinsics',
      },
      {
        label: 'Transactions',
        href: '/transactions',
      },
      {
        label: 'Events',
        href: '/events',
      },
      {
        label: 'Accounts',
        href: '/accounts',
      },
    ],
  },
  {
    label: 'Staking',
    children: [
      {
        label: 'Candidates',
        href: '/candidates',
      },
      {
        label: 'Delegators',
        href: '/delegators',
      },
      {
        label: 'Delegations',
        href: '/delegations',
      }
    ],
  },
  {
    label: 'Governance',
    children: [
      {
        label: 'Referendums',
        href: '/referendums',
      },
      {
        label: 'Proposals',
        href: '/proposals',
      }
    ],
  },
  {
    label: 'Transfers',
    children: [
      {
        label: 'Moonriver (MOVR)',
        href: '/transfers',
      },
      {
        label: 'ERC20 Tokens',
        href: '/erc20-transfers',
      },
      {
        label: 'ERC721 Tokens',
        href: '/erc721-transfers',
      },
    ]
  },
  {
    label: 'Charts',
    href: '/charts',
  },
];
