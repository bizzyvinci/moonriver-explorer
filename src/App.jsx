import React from 'react';
import { Box } from '@chakra-ui/react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Navbar from './components/Navbar'
import Warning from './components/Warning'
import Footer from './components/Footer'

import Homepage from './pages/Homepage'
import Blocks from './pages/Blocks'
import Extrinsics from './pages/Extrinsics'
import Transactions from './pages/Transactions'
import Events from './pages/Events'
import Accounts from './pages/Accounts'

import Candidates from './pages/Candidates'
import Delegators from './pages/Delegators'
import Delegations from './pages/Delegations'
import Referendums from './pages/Referendums'
import Proposals from './pages/Proposals'
import Transfers from './pages/Transfers'
import Erc20Transfers from './pages/Erc20Transfers'
import Erc721Transfers from './pages/Erc721Transfers'
import Charts from './pages/Charts'

import Block from './pages/Block'
import Extrinsic from './pages/Extrinsic'
import Transaction from './pages/Transaction'

import Account from './pages/Account'
import Token from './pages/Token'
import Stake from './pages/Stake'

import Missing from './pages/Missing'
import Error from './pages/Error'

const linkPage = [
  {path: '/', component: <Homepage />},
  {path: '/blocks', component: <Blocks />},
  {path: '/extrinsics', component: <Extrinsics />},
  {path: '/transactions', component: <Transactions />},
  {path: '/events', component: <Events />},
  {path: '/accounts', component: <Accounts />},

  {path: '/candidates', component: <Candidates />},
  {path: '/delegators', component: <Delegators />},
  {path: '/delegations', component: <Delegations />},

  {path: '/referendums', component: <Referendums />},
  {path: '/proposals', component: <Proposals />},

  {path: '/transfers', component: <Transfers />},
  {path: '/erc20-transfers', component: <Erc20Transfers />},
  {path: '/erc721-transfers', component: <Erc721Transfers />},
  {path: '/charts', component: <Charts />},

  {path: '/block/:id', children: <Block />},
  {path: '/extrinsic/:id', children: <Extrinsic />},
  {path: '/tx/:id', children: <Transaction />},
  
  {path: '/account/:id', children: <Account />},
  {path: '/token/:id', children: <Token />},
  {path: '/stake/:id', children: <Stake />},

  {path: '/missing/:id', component: <Missing />},
  {path: '/error', component: <Error />}
]

function App() {
  return (
    <Box className="App" margin="10px 5%">
      <Router>
        <Navbar />
        <Warning />
        <br />
        <Switch>
          {linkPage.map((obj) => {
            if (obj.component) {
              return (
                <Route exact path={obj.path} key={obj.path}>
                  {obj.component}
                </Route>
              )
            } else {
              return (
                <Route exact path={obj.path} 
                   key={obj.path} children={obj.children}
                />
              )
            }
          })}
        </Switch>
        <br />
        <Footer />
      </Router>
    </Box>
  );
}

export default App;
