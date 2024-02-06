import { Calendar } from '@/components/Calendar'
import {
  Container,
  TimePicker,
  TimePickerContainer,
  TimePickerHeader,
  TimePickerItem,
  TimePickerList,
} from './styles'
import { useState } from 'react'
import dayjs from 'dayjs'
import { api } from '@/lib/axios'
import { useRouter } from 'next/router'
import { useQuery } from '@tanstack/react-query'

interface Availability {
  possibleTimes: number[]
  availableTimes: number[]
}

interface CalendarStepProps {
  onSelectDateTime: (date: Date) => void
}

export default function CalendarStep({ onSelectDateTime }: CalendarStepProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const router = useRouter()
  const isDateSelected = !!selectedDate
  const username = String(router.query.username)

  const weekDay = selectedDate ? dayjs(selectedDate).format('dddd') : null
  const describedDate = selectedDate
    ? dayjs(selectedDate).format('DD[ de ]MMMM')
    : null

  const selectedDateWhitoutTime = selectedDate
    ? dayjs(selectedDate).format('YYYY-MM-DD')
    : null

  const { data: availability } = useQuery<Availability>(
    ['availability', selectedDateWhitoutTime],
    async () => {
      const response = await api.get(`/users/${username}/availability`, {
        params: {
          date: selectedDateWhitoutTime,
          timezoneOffset: selectedDate ? selectedDate.getTimezoneOffset() : 0,
        },
      })

      return response.data
    },
    {
      enabled: !!selectedDate,
    },
  )

  function handleSelectTime(hour: number) {
    const dateTime = dayjs(selectedDate)
      .set('hour', hour)
      .startOf('hour')
      .toDate()
    onSelectDateTime(dateTime)
  }

  return (
    <Container isTimePickerOpen={isDateSelected}>
      <Calendar selectedDate={selectedDate} onDateSelected={setSelectedDate} />

      {isDateSelected && (
        <TimePickerContainer
          isTimePickerOpen={isDateSelected}
          onClick={() => setSelectedDate(null)}
        >
          <TimePicker>
            <TimePickerHeader>
              {weekDay} <span>{describedDate}</span>
            </TimePickerHeader>
            <TimePickerList>
              {availability !== null &&
                availability?.possibleTimes.map((hour) => {
                  return (
                    <TimePickerItem
                      key={hour}
                      disabled={!availability.availableTimes.includes(hour)}
                      onClick={() => handleSelectTime(hour)}
                    >
                      {String(hour).padStart(2, '0')}:00h
                    </TimePickerItem>
                  )
                })}
            </TimePickerList>
          </TimePicker>
        </TimePickerContainer>
      )}
    </Container>
  )
}
