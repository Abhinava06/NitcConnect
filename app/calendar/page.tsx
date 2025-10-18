"use client"

import { useState, useEffect } from "react"
import { Calendar, dateFnsLocalizer } from "react-big-calendar"
import format from "date-fns/format"
import parse from "date-fns/parse"
import startOfWeek from "date-fns/startOfWeek"
import getDay from "date-fns/getDay"
import "react-big-calendar/lib/css/react-big-calendar.css"

const locales = {
  "en-US": require("date-fns/locale/en-US"),
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
})

export default function CalendarPage() {
  const [events, setEvents] = useState([])

  useEffect(() => {
    fetch("/api/events")
      .then((res) => res.json())
      .then((data) => {
        setEvents(
          data.events.map((event: any) => ({
            ...event,
            start: new Date(event.startDate),
            end: new Date(event.endDate),
          }))
        )
      })
  }, [])

  return (
    <div className="p-4 h-screen">
      <h1 className="text-2xl font-bold mb-4">Campus Events Calendar</h1>
      <div className="h-[80vh]">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: "100%" }}
        />
      </div>
    </div>
  )
}
