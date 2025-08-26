"use client"

import { useState, useEffect } from "react"
import { View, StyleSheet, ScrollView, Alert } from "react-native"
import { Card, Title, Paragraph, Button, Avatar, Text, RadioButton, Chip } from "react-native-paper"
import { Calendar } from "react-native-calendars"
import { getNextWeekDays, formatDate, isFuture, isToday } from "../utils/dateUtils"
import { auth } from "../firebase-config"

export default function AppointmentBookingScreen({ navigation, route }) {
  const { doctor } = route.params
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTime, setSelectedTime] = useState("")
  const [appointmentType, setAppointmentType] = useState("consultation")
  const [availableSlots, setAvailableSlots] = useState([])

  useEffect(() => {
    // Simulate fetching available slots for selected date
    if (selectedDate) {
      // In real app, this would be an API call
      setAvailableSlots(doctor.availableSlots)
    }
  }, [selectedDate, doctor])

  const handleDateSelect = (day) => {
    const selectedDateObj = new Date(day.dateString)
    if (isFuture(selectedDateObj) || isToday(selectedDateObj)) {
      setSelectedDate(day.dateString)
      setSelectedTime("") // Reset time selection
    }
  }

  const handleBooking = () => {
    if (!selectedDate || !selectedTime) {
      Alert.alert("Erreur", "Veuillez sélectionner une date et une heure")
      return
    }

    const appointmentData = {
      doctorId: doctor.id,
      doctorName: doctor.name,
      doctorSpecialty: doctor.specialty,
      userId: auth.currentUser?.uid,
      date: selectedDate,
      time: selectedTime,
      type: appointmentType,
      fee: doctor.consultationFee,
      status: "scheduled",
    }

    navigation.navigate("AppointmentConfirmation", { appointmentData, doctor })
  }

  const getMarkedDates = () => {
    const marked = {}
    const nextWeek = getNextWeekDays()

    nextWeek.forEach((date) => {
      const dateString = date.toISOString().split("T")[0]
      marked[dateString] = {
        disabled: false,
        disableTouchEvent: false,
      }
    })

    if (selectedDate) {
      marked[selectedDate] = {
        ...marked[selectedDate],
        selected: true,
        selectedColor: "#007AFF",
      }
    }

    return marked
  }

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.doctorCard}>
        <Card.Content>
          <View style={styles.doctorHeader}>
            <Avatar.Image size={60} source={{ uri: doctor.image }} style={styles.avatar} />
            <View style={styles.doctorInfo}>
              <Title style={styles.doctorName}>{doctor.name}</Title>
              <Paragraph style={styles.specialty}>{doctor.specialty}</Paragraph>
              <Text style={styles.fee}>Consultation: {doctor.consultationFee}€</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.typeCard}>
        <Card.Content>
          <Title>Type de consultation</Title>
          <RadioButton.Group onValueChange={setAppointmentType} value={appointmentType}>
            <View style={styles.radioOption}>
              <RadioButton value="consultation" />
              <Text style={styles.radioLabel}>Consultation générale</Text>
            </View>
            <View style={styles.radioOption}>
              <RadioButton value="followup" />
              <Text style={styles.radioLabel}>Suivi médical</Text>
            </View>
            <View style={styles.radioOption}>
              <RadioButton value="emergency" />
              <Text style={styles.radioLabel}>Consultation urgente (+20€)</Text>
            </View>
          </RadioButton.Group>
        </Card.Content>
      </Card>

      <Card style={styles.calendarCard}>
        <Card.Content>
          <Title>Sélectionner une date</Title>
          <Calendar
            onDayPress={handleDateSelect}
            markedDates={getMarkedDates()}
            minDate={new Date().toISOString().split("T")[0]}
            maxDate={getNextWeekDays()[6].toISOString().split("T")[0]}
            theme={{
              selectedDayBackgroundColor: "#007AFF",
              selectedDayTextColor: "#ffffff",
              todayTextColor: "#007AFF",
              dayTextColor: "#2d4150",
              textDisabledColor: "#d9e1e8",
              arrowColor: "#007AFF",
              monthTextColor: "#2d4150",
              indicatorColor: "#007AFF",
            }}
          />
        </Card.Content>
      </Card>

      {selectedDate && (
        <Card style={styles.timeCard}>
          <Card.Content>
            <Title>Créneaux disponibles le {formatDate(new Date(selectedDate))}</Title>
            <View style={styles.slotsContainer}>
              {availableSlots.map((slot) => (
                <Chip
                  key={slot}
                  selected={selectedTime === slot}
                  onPress={() => setSelectedTime(slot)}
                  style={[styles.timeSlot, selectedTime === slot && styles.selectedTimeSlot]}
                  textStyle={selectedTime === slot ? styles.selectedTimeText : styles.timeText}
                >
                  {slot}
                </Chip>
              ))}
            </View>
          </Card.Content>
        </Card>
      )}

      {selectedDate && selectedTime && (
        <Card style={styles.summaryCard}>
          <Card.Content>
            <Title>Récapitulatif</Title>
            <Text style={styles.summaryText}>Médecin: {doctor.name}</Text>
            <Text style={styles.summaryText}>Date: {formatDate(new Date(selectedDate))}</Text>
            <Text style={styles.summaryText}>Heure: {selectedTime}</Text>
            <Text style={styles.summaryText}>
              Type:{" "}
              {appointmentType === "consultation"
                ? "Consultation générale"
                : appointmentType === "followup"
                  ? "Suivi médical"
                  : "Consultation urgente"}
            </Text>
            <Text style={styles.summaryTotal}>
              Total: {appointmentType === "emergency" ? doctor.consultationFee + 20 : doctor.consultationFee}€
            </Text>
          </Card.Content>
        </Card>
      )}

      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          onPress={handleBooking}
          disabled={!selectedDate || !selectedTime}
          style={styles.bookButton}
          contentStyle={styles.bookButtonContent}
        >
          Confirmer le rendez-vous
        </Button>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  doctorCard: {
    margin: 15,
    elevation: 3,
  },
  doctorHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    marginRight: 15,
  },
  doctorInfo: {
    flex: 1,
  },
  doctorName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  specialty: {
    color: "#007AFF",
    marginBottom: 4,
  },
  fee: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4CAF50",
  },
  typeCard: {
    marginHorizontal: 15,
    marginBottom: 15,
    elevation: 3,
  },
  radioOption: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  radioLabel: {
    fontSize: 16,
    marginLeft: 8,
  },
  calendarCard: {
    marginHorizontal: 15,
    marginBottom: 15,
    elevation: 3,
  },
  timeCard: {
    marginHorizontal: 15,
    marginBottom: 15,
    elevation: 3,
  },
  slotsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 10,
  },
  timeSlot: {
    margin: 4,
    backgroundColor: "#e3f2fd",
  },
  selectedTimeSlot: {
    backgroundColor: "#007AFF",
  },
  timeText: {
    color: "#333",
  },
  selectedTimeText: {
    color: "white",
  },
  summaryCard: {
    marginHorizontal: 15,
    marginBottom: 15,
    backgroundColor: "#e8f5e8",
    elevation: 3,
  },
  summaryText: {
    fontSize: 16,
    marginBottom: 5,
  },
  summaryTotal: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4CAF50",
    marginTop: 10,
  },
  buttonContainer: {
    padding: 15,
    paddingBottom: 30,
  },
  bookButton: {
    paddingVertical: 5,
  },
  bookButtonContent: {
    paddingVertical: 8,
  },
})
