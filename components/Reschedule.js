"use client"

import { useState, useRef, useEffect } from "react"
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react"
import { updateResheduleDate } from "@/server/order-actions"

export default function RescheduleDelivery() {
  // State for tracking selected option and date
  const [selectedOption, setSelectedOption] = useState(null)
  const [selectedDate, setSelectedDate] = useState(null)
  const [showCalendar, setShowCalendar] = useState(false)
  const [currentMonth, setCurrentMonth] = useState(new Date())

  // Ref for calendar dropdown
  const calendarRef = useRef(null)

  // Calculate tomorrow and day after tomorrow dates
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  const dayAfterTomorrow = new Date(today)
  dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2)

  // Format dates for display
  const formatDate = (date) => {
    return date.getDate() + " " + date.toLocaleString("default", { month: "short" })
  }

  const tomorrowFormatted = formatDate(tomorrow)
  const dayAfterTomorrowFormatted = formatDate(dayAfterTomorrow)

  // Handle option selection
  const handleOptionSelect = (option) => {
    setSelectedOption(option)

    if (option === "tomorrow") {
      setSelectedDate(tomorrow)
    } else if (option === "dayAfter") {
      setSelectedDate(dayAfterTomorrow)
    }

    // Close calendar if it's open
    if (showCalendar) {
      setShowCalendar(false)
    }
  }

  // Handle calendar date selection
  const handleCalendarSelect = (date) => {
    setSelectedDate(date)
    setSelectedOption("calendar")
    setShowCalendar(false)
  }

  // Toggle calendar visibility
  const toggleCalendar = () => {
    setShowCalendar(!showCalendar)
    if (!selectedOption) {
      setSelectedOption("calendar")
    }
  }

  // Handle form submission
  const handleSubmit = ({txn_id}) => {
    if (!selectedDate) {
      alert("Please select a delivery date")
      return
    }

    const formattedDate = selectedDate.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })

    const response = updateResheduleDate(txn_id,selectedDate);

    if(response.status !== 200){
      alert("Error rescheduling delivery. Please try again.")
      return
    }
    alert(`Delivery successfully rescheduled for: ${formattedDate}`)
  }

  // Close calendar when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setShowCalendar(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Calendar navigation functions
  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
  }

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
  }

  // Generate calendar days for current month view
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()

    // First day of the month
    const firstDayOfMonth = new Date(year, month, 1)
    // Last day of the month
    const lastDayOfMonth = new Date(year, month + 1, 0)

    // Day of the week for the first day (0 = Sunday, 6 = Saturday)
    const firstDayWeekday = firstDayOfMonth.getDay()

    // Total days in the month
    const daysInMonth = lastDayOfMonth.getDate()

    // Array to hold all calendar cells
    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayWeekday; i++) {
      days.push(null)
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day)
      days.push(date)
    }

    return days
  }

  // Format date for display in the button
  const formatSelectedDate = (date) => {
    if (!date) return "Select Date"

    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  // Check if a date is before today (to disable past dates)
  const isBeforeToday = (date) => {
    if (!date) return false

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return date < today
  }

  // Check if a date is selected
  const isDateSelected = (date) => {
    if (!selectedDate || !date) return false

    return (
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    )
  }

  const calendarDays = generateCalendarDays()

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-sm">
      <h1 className="text-2xl font-semibold text-[#006838] mb-6">Reschedule Delivery</h1>

      <div className="space-y-4">
        <p className="text-lg font-medium text-gray-800">Select Date</p>

        {/* Tomorrow option */}
        <button
          onClick={() => handleOptionSelect("tomorrow")}
          className={`w-full py-3 px-4 border rounded-md text-center transition-colors ${
            selectedOption === "tomorrow"
              ? "border-[#006838] bg-[#e6f4ee] text-[#006838]"
              : "border-gray-300 text-gray-700 hover:border-[#006838]"
          }`}
        >
          Tomorrow ({tomorrowFormatted})
        </button>

        {/* Day after tomorrow option */}
        <button
          onClick={() => handleOptionSelect("dayAfter")}
          className={`w-full py-3 px-4 border rounded-md text-center transition-colors ${
            selectedOption === "dayAfter"
              ? "border-[#006838] bg-[#e6f4ee] text-[#006838]"
              : "border-gray-300 text-gray-700 hover:border-[#006838]"
          }`}
        >
          Day after tomorrow ({dayAfterTomorrowFormatted})
        </button>

        {/* Calendar option */}
        <p className="text-lg font-medium text-gray-800 mt-6">Calendar</p>

        <div className="relative" ref={calendarRef}>
          <button
            onClick={toggleCalendar}
            className={`w-full py-3 px-4 border rounded-md text-center flex items-center justify-center gap-2 transition-colors ${
              selectedOption === "calendar"
                ? "border-[#006838] bg-[#e6f4ee] text-[#006838]"
                : "border-gray-300 text-gray-700 hover:border-[#006838]"
            }`}
          >
            <Calendar className="h-5 w-5" />
            <span>
              {selectedOption === "calendar" && selectedDate ? formatSelectedDate(selectedDate) : "Select Date"}
            </span>
          </button>

          {/* Calendar dropdown */}
          {showCalendar && (
            <div className="absolute z-10 mt-2 w-full bg-white border border-gray-200 rounded-md shadow-lg">
              {/* Calendar header with month/year navigation */}
              <div className="flex items-center justify-between p-3 border-b">
                <button onClick={prevMonth} className="p-1 rounded-full hover:bg-gray-100">
                  <ChevronLeft className="h-5 w-5" />
                </button>

                <h3 className="font-medium">
                  {currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                </h3>

                <button onClick={nextMonth} className="p-1 rounded-full hover:bg-gray-100">
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>

              {/* Calendar grid */}
              <div className="p-3">
                {/* Day headers */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                    <div key={day} className="text-center text-xs font-medium text-gray-500 py-1">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar days */}
                <div className="grid grid-cols-7 gap-1">
                  {calendarDays.map((date, index) => {
                    if (!date) {
                      // Empty cell for days before the first of the month
                      return <div key={`empty-${index}`} className="w-8 h-8"></div>
                    }

                    const isDisabled = isBeforeToday(date)
                    const isSelected = isDateSelected(date)

                    return (
                      <button
                        key={index}
                        onClick={() => !isDisabled && handleCalendarSelect(date)}
                        disabled={isDisabled}
                        className={`text-center text-sm rounded-full w-8 h-8 flex items-center justify-center ${
                          isSelected
                            ? "bg-[#006838] text-white"
                            : isDisabled
                              ? "text-gray-300 cursor-not-allowed"
                              : "hover:bg-gray-100"
                        }`}
                      >
                        {date.getDate()}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Submit button */}
        <button
          onClick={handleSubmit}
          disabled={!selectedDate}
          className={`w-full mt-8 py-3 px-4 rounded-[15px] transition-colors font-medium ${
            selectedDate ? "bg-[#006838] hover:bg-[#005a30] text-white" : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          Submit
        </button>
      </div>
    </div>
  )
}