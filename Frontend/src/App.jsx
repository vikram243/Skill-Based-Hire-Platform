import React, { useState } from 'react'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent} from './components/ui/Accordion.jsx';
import Calendar from './components/ui/calendar.jsx';

const App = () => {

  const [date, setDate] = useState(new Date());

  return (
    <div className="flex flex-col items-center gap-4 mt-10">
      <h2 className="text-lg font-semibold">Select a Date</h2>

      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        className="rounded-lg border shadow-md"
      />

      <p className="text-sm text-gray-700">
        Selected Date: {date?.toDateString() || "None"}
      </p>
    </div>
  )
}

export default App
