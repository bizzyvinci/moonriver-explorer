import React from 'react'
import { Tab, Tabs, TabList, TabPanel, TabPanels } from '@chakra-ui/react'


export default function DataTabs({ data }) {
  return (
    <Tabs>
      <TabList>
        {data.map((tab, index) => (
          <Tab key={index}>{tab.label}</Tab>
        ))}
      </TabList>
      <TabPanels>
        {data.map((tab, index) => (
          <TabPanel p={4} key={index}>
            {tab.content}
          </TabPanel>
        ))}
      </TabPanels>
    </Tabs>
  )
}

// export interface SingleData {label: string; content?: any}
// export interface Data extends Array<SingleData> {}
// export interface Props {data: Data}
