"use client"

import { useState } from "react"
import { View, StyleSheet, ScrollView, Alert } from "react-native"
import {
  Card,
  Title,
  Paragraph,
  Button,
  Avatar,
  Text,
  TextInput,
  ActivityIndicator,
  Checkbox,
} from "react-native-paper"
import { formatDate } from "../utils/dateUtils"
import { notificationService } from "../services/notificationService"

export default function AppointmentConfirmationScreen({ navigation, route }) {
  const { appointmentData, doctor } = route.params
  const [notes, setNotes] = useState("")
  const [loading, setLoading] = useState(false)
  const [enableReminder, setEnableReminder] = useState(true)

  const handleConfirmBooking = async () => {
    setLoading(true)
    try {
      const bookingData = {
        ...appointmentData,
        notes,
        appointmentDate: new Date(`${appointmentData.date}T${appointmentData.time}:00`),
        createdAt: new Date(),
      }

      // In real app, this would save to Firebase
      await new Promise((resolve) => setTimeout(resolve, 2000)) // Simulate API call

      // Schedule reminder if enabled
      if (enableReminder) {
        try {
          await notificationService.scheduleAppointmentReminder({
            ...bookingData,
            id: Date.now().toString(), // Generate temporary ID
            doctorName: doctor.name,
            time: appointmentData.time,
          })
        } catch (error) {
          console.log("Could not schedule reminder:", error)
        }
      }

      Alert.alert(
        "Rendez-vous confirmé !",
        enableReminder
          ? "Votre rendez-vous a été enregistré avec succès. Vous recevrez un rappel 24h avant."
          : "Votre rendez-vous a été enregistré avec succès.",
        [
          {
            text: "OK",
            onPress: () => navigation.navigate("MyAppointments"),
          },
        ],
      )
    } catch (error) {
      Alert.alert("Erreur", "Une erreur est survenue lors de la confirmation du rendez-vous.")
    } finally {
      setLoading(false)
    }
  }

  const totalFee = appointmentData.type === "emergency" ? appointmentData.fee + 20 : appointmentData.fee

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Confirmation en cours...</Text>
      </View>
    )
  }

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.confirmationCard}>
        <Card.Content>
          <View style={styles.successHeader}>
            <Text style={styles.successIcon}>✅</Text>
            <Title style={styles.successTitle}>Confirmation du rendez-vous</Title>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.detailsCard}>
        <Card.Content>
          <View style={styles.doctorHeader}>
            <Avatar.Image size={60} source={{ uri: doctor.image }} style={styles.avatar} />
            <View style={styles.doctorInfo}>
              <Title style={styles.doctorName}>{doctor.name}</Title>
              <Paragraph style={styles.specialty}>{doctor.specialty}</Paragraph>
              <Text style={styles.location}>📍 {doctor.city}</Text>
            </View>
          </View>

          <View style={styles.appointmentDetails}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Date:</Text>
              <Text style={styles.detailValue}>{formatDate(new Date(appointmentData.date))}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Heure:</Text>
              <Text style={styles.detailValue}>{appointmentData.time}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Type:</Text>
              <Text style={styles.detailValue}>
                {appointmentData.type === "consultation"
                  ? "Consultation générale"
                  : appointmentData.type === "followup"
                    ? "Suivi médical"
                    : "Consultation urgente"}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Tarif:</Text>
              <Text style={styles.detailValue}>{totalFee}€</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.reminderCard}>
        <Card.Content>
          <View style={styles.reminderHeader}>
            <Title>Rappel automatique</Title>
            <Checkbox
              status={enableReminder ? "checked" : "unchecked"}
              onPress={() => setEnableReminder(!enableReminder)}
            />
          </View>
          <Text style={styles.reminderText}>
            {enableReminder
              ? "Vous recevrez une notification 24h avant votre rendez-vous"
              : "Aucun rappel ne sera programmé"}
          </Text>
        </Card.Content>
      </Card>

      <Card style={styles.notesCard}>
        <Card.Content>
          <Title>Notes pour le médecin (optionnel)</Title>
          <TextInput
            mode="outlined"
            placeholder="Décrivez brièvement le motif de votre consultation..."
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={4}
            style={styles.notesInput}
          />
        </Card.Content>
      </Card>

      <Card style={styles.infoCard}>
        <Card.Content>
          <Title>Informations importantes</Title>
          <Text style={styles.infoText}>• Arrivez 10 minutes avant votre rendez-vous</Text>
          <Text style={styles.infoText}>• Apportez votre carte vitale et mutuelle</Text>
          <Text style={styles.infoText}>• En cas d'empêchement, prévenez au moins 24h à l'avance</Text>
          <Text style={styles.infoText}>• Le paiement se fait sur place (CB, chèque, espèces)</Text>
        </Card.Content>
      </Card>

      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          onPress={handleConfirmBooking}
          style={styles.confirmButton}
          contentStyle={styles.confirmButtonContent}
        >
          Confirmer définitivement
        </Button>

        <Button mode="outlined" onPress={() => navigation.goBack()} style={styles.backButton}>
          Modifier le rendez-vous
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  confirmationCard: {
    margin: 15,
    backgroundColor: "#e8f5e8",
    elevation: 3,
  },
  successHeader: {
    alignItems: "center",
  },
  successIcon: {
    fontSize: 48,
    marginBottom: 10,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  detailsCard: {
    marginHorizontal: 15,
    marginBottom: 15,
    elevation: 3,
  },
  doctorHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
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
  location: {
    fontSize: 14,
    color: "#666",
  },
  appointmentDetails: {
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    paddingTop: 15,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  detailLabel: {
    fontSize: 16,
    color: "#666",
  },
  detailValue: {
    fontSize: 16,
    fontWeight: "bold",
  },
  reminderCard: {
    marginHorizontal: 15,
    marginBottom: 15,
    backgroundColor: "#e3f2fd",
    elevation: 3,
  },
  reminderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  reminderText: {
    fontSize: 14,
    color: "#666",
  },
  notesCard: {
    marginHorizontal: 15,
    marginBottom: 15,
    elevation: 3,
  },
  notesInput: {
    marginTop: 10,
  },
  infoCard: {
    marginHorizontal: 15,
    marginBottom: 15,
    backgroundColor: "#fff3e0",
    elevation: 3,
  },
  infoText: {
    fontSize: 14,
    marginBottom: 5,
    color: "#666",
  },
  buttonContainer: {
    padding: 15,
    paddingBottom: 30,
  },
  confirmButton: {
    marginBottom: 10,
    paddingVertical: 5,
  },
  confirmButtonContent: {
    paddingVertical: 8,
  },
  backButton: {
    borderColor: "#007AFF",
  },
})
