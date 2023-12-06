import { useState } from 'react'
import CalendarStep from './CalendarStep'
import { ConfirmStep } from './ConfirmStep'

//  <CalendarStep></CalendarStep>

export default function ScheduleForm() {
  const [selectedDateTime, setSelectedDateTime] = useState<Date | null>()

  function handleClearSelectedDateTime() {
    setSelectedDateTime(null)
  }

  if (selectedDateTime)
    return (
      <ConfirmStep
        schedulingDate={selectedDateTime}
        onCancel={handleClearSelectedDateTime}
      />
    )
  return <CalendarStep onSelectDateTime={setSelectedDateTime} />
}
