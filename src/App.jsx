import React from 'react';
import { Box } from '@chakra-ui/react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Navbar from './components/Navbar'
import Warning from './components/Warning'
import Homepage from './pages/Homepage'
import Blocks from './pages/Blocks'
import Extrinsics from './pages/Extrinsics'
import Transactions from './pages/Transactions'
import Events from './pages/Events'
import Accounts from './pages/Accounts'
import Candidates from './pages/Candidates'
import Delegators from './pages/Delegators'
import Delegations from './pages/Delegations'
import Block from './pages/Block'
import Extrinsic from './pages/Extrinsic'


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

  // {path: '/referenda', component: <Homepage />},
  // {path: '/proposals', component: <Homepage />},

  // {path: '/transfers', component: <Homepage />},
  // {path: '/erc20-transfers', component: <Homepage />},
  // {path: '/erc721-transfers', component: <Homepage />},

  {path: '/block/:id', children: <Block />},
  {path: '/extrinsic/:id', children: <Extrinsic />},
  {path: '/transaction/:id', children: <Homepage />},
  {path: '/account/:id', children: <Homepage />},

  {path: '/token/:id', children: <Homepage />},
  {path: '/candidate/:id', children: <Homepage />},
  {path: '/delegator/:id', children: <Homepage />},
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
      </Router>
    </Box>
  );
}

export default App;
