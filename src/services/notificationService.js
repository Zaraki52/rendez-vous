import * as Notifications from "expo-notifications"

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
})

export const notificationService = {
  // Request permissions
  async requestPermissions() {
    const { status: existingStatus } = await Notifications.getPermissionsAsync()
    let finalStatus = existingStatus

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync()
      finalStatus = status
    }

    if (finalStatus !== "granted") {
      throw new Error("Permission not granted for notifications")
    }

    return finalStatus
  },

  // Schedule appointment reminder
  async scheduleAppointmentReminder(appointment) {
    const appointmentDate = new Date(appointment.appointmentDate)
    const reminderTime = new Date(appointmentDate.getTime() - 24 * 60 * 60 * 1000) // 24 hours before

    if (reminderTime <= new Date()) {
      return null // Don't schedule past reminders
    }

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: "Rappel de rendez-vous",
        body: `Vous avez un rendez-vous demain avec ${appointment.doctorName} à ${appointment.time}`,
        data: {
          type: "appointment",
          appointmentId: appointment.id,
          doctorName: appointment.doctorName,
        },
      },
      trigger: reminderTime,
    })

    return notificationId
  },

  // Schedule medication reminder
  async scheduleMedicationReminder(medication) {
    const notificationIds = []

    // Parse frequency to determine reminder times
    const times = this.parseMedicationFrequency(medication.frequency)

    for (const time of times) {
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: "Rappel de médicament",
          body: `Il est temps de prendre ${medication.name} (${medication.dosage})`,
          data: {
            type: "medication",
            medicationId: medication.id,
            medicationName: medication.name,
          },
        },
        trigger: {
          hour: time.hour,
          minute: time.minute,
          repeats: true,
        },
      })
      notificationIds.push(notificationId)
    }

    return notificationIds
  },

  // Schedule vaccination reminder
  async scheduleVaccinationReminder(vaccination) {
    if (!vaccination.nextDue) return null

    const reminderDate = new Date(vaccination.nextDue)
    const reminderTime = new Date(reminderDate.getTime() - 7 * 24 * 60 * 60 * 1000) // 1 week before

    if (reminderTime <= new Date()) {
      return null
    }

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: "Rappel de vaccination",
        body: `Votre rappel ${vaccination.name} est prévu dans une semaine`,
        data: {
          type: "vaccination",
          vaccinationId: vaccination.id,
          vaccinationName: vaccination.name,
        },
      },
      trigger: reminderTime,
    })

    return notificationId
  },

  // Cancel notification
  async cancelNotification(notificationId) {
    await Notifications.cancelScheduledNotificationAsync(notificationId)
  },

  // Cancel all notifications
  async cancelAllNotifications() {
    await Notifications.cancelAllScheduledNotificationsAsync()
  },

  // Get all scheduled notifications
  async getScheduledNotifications() {
    return await Notifications.getAllScheduledNotificationsAsync()
  },

  // Helper function to parse medication frequency
  parseMedicationFrequency(frequency) {
    const times = []

    if (frequency.includes("1 fois par jour") || frequency.includes("une fois par jour")) {
      times.push({ hour: 8, minute: 0 })
    } else if (frequency.includes("2 fois par jour") || frequency.includes("deux fois par jour")) {
      times.push({ hour: 8, minute: 0 }, { hour: 20, minute: 0 })
    } else if (frequency.includes("3 fois par jour") || frequency.includes("trois fois par jour")) {
      times.push({ hour: 8, minute: 0 }, { hour: 14, minute: 0 }, { hour: 20, minute: 0 })
    } else if (frequency.includes("matin")) {
      times.push({ hour: 8, minute: 0 })
    } else if (frequency.includes("soir")) {
      times.push({ hour: 20, minute: 0 })
    } else {
      // Default to once a day at 8 AM
      times.push({ hour: 8, minute: 0 })
    }

    return times
  },

  // Send immediate notification (for testing)
  async sendImmediateNotification(title, body, data = {}) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data,
      },
      trigger: null, // Send immediately
    })
  },
}
