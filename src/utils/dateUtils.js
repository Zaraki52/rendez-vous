// Date utility functions for appointments
export const formatDate = (date) => {
  return new Intl.DateTimeFormat("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date)
}

export const formatTime = (time) => {
  return new Intl.DateTimeFormat("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(time)
}

export const formatDateTime = (date) => {
  return new Intl.DateTimeFormat("fr-FR", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date)
}

export const isToday = (date) => {
  const today = new Date()
  return date.toDateString() === today.toDateString()
}

export const isFuture = (date) => {
  return date > new Date()
}

export const addDays = (date, days) => {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

export const getNextWeekDays = () => {
  const days = []
  const today = new Date()

  for (let i = 0; i < 7; i++) {
    days.push(addDays(today, i))
  }

  return days
}

export const generateTimeSlots = (startHour = 8, endHour = 18, interval = 60) => {
  const slots = []

  for (let hour = startHour; hour < endHour; hour++) {
    for (let minute = 0; minute < 60; minute += interval) {
      const time = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`
      slots.push(time)
    }
  }

  return slots
}
