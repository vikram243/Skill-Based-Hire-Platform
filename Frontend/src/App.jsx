import React from 'react'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent} from './components/ui/Accordion.jsx'

const App = () => {
  return (
    <Accordion type = "single" collapsible>
      <AccordionItem value = "item1">
        <AccordionTrigger>
          section1
        </AccordionTrigger>
        <AccordionContent className={"bg-amber-600"}>
          this is content 1
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

export default App
