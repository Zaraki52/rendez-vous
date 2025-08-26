"use client"

import { useState, useEffect } from "react"
import { View, StyleSheet, FlatList, Alert } from "react-native"
import { Card, Title, Paragraph, Button, Avatar, Text, Chip, FAB, ActivityIndicator } from "react-native-paper"
import { formatDateTime, isFuture } from "../utils/dateUtils"

// Sample appointments data
const sampleAppointments = [
  {
    id: "1",
    doctorName: "Dr. Marie Dubois",
    doctorSpecialty: "Cardiologie",
    doctorImage: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&h=300&fit=crop&crop=face",
    date: new Date(2024, 11, 28, 10, 0), // December 28, 2024, 10:00
    type: "consultation",
    status: "scheduled",
    fee: 60,
    notes: "Contrôle de routine",
  },
  {
    id: "2",
    doctorName: "Dr. Pierre Martin",
    doctorSpecialty: "Dermatologie",
    doctorImage: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&h=300&fit=crop&crop=face",
    date: new Date(2024, 11, 25, 14, 30), // December 25, 2024, 14:30
    type: "followup",
    status: "completed",
    fee: 55,
    notes: "Suivi traitement acné",
  },
  {
    id: "3",
    doctorName: "Dr. Sophie Laurent",
    doctorSpecialty: "Pédiatrie",
    doctorImage: "https://images.unsplash.com/photo-1594824475317-1c5b8b5b8b5b?w=300&h=300&fit=crop&crop=face",
    date: new Date(2025, 0, 5, 9, 0), // January 5, 2025, 09:00
    type: "consultation",
    status: "scheduled",
    fee: 50,
    notes: "Vaccination enfant",
  },
]

export default function MyAppointmentsScreen({ navigation }) {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("all") // all, upcoming, past

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setAppointments(sampleAppointments)
      setLoading(false)
    }, 1000)
  }, [])

  const getStatusColor = (status) => {
    switch (status) {
      case "scheduled":
        return "#4CAF50"
      case "completed":
        return "#2196F3"
      case "cancelled":
        return "#f44336"
      default:
        return "#666"
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case "scheduled":
        return "Programmé"
      case "completed":
        return "Terminé"
      case "cancelled":
        return "Annulé"
      default:
        return status
    }
  }

  const getTypeText = (type) => {
    switch (type) {
      case "consultation":
        return "Consultation"
      case "followup":
        return "Suivi"
      case "emergency":
        return "Urgence"
      default:
        return type
    }
  }

  const handleCancelAppointment = (appointmentId) => {
    Alert.alert("Annuler le rendez-vous", "Êtes-vous sûr de vouloir annuler ce rendez-vous ?", [
      { text: "Non", style: "cancel" },
      {
        text: "Oui, annuler",
        style: "destructive",
        onPress: () => {
          setAppointments((prev) =>
            prev.map((apt) => (apt.id === appointmentId ? { ...apt, status: "cancelled" } : apt)),
          )
        },
      },
    ])
  }

  const filteredAppointments = appointments.filter((apt) => {
    if (filter === "upcoming") return isFuture(apt.date) && apt.status === "scheduled"
    if (filter === "past") return !isFuture(apt.date) || apt.status === "completed"
    return true
  })

  const renderAppointmentCard = ({ item: appointment }) => (
    <Card style={styles.appointmentCard}>
      <Card.Content>
        <View style={styles.appointmentHeader}>
          <Avatar.Image size={50} source={{ uri: appointment.doctorImage }} style={styles.avatar} />
          <View style={styles.appointmentInfo}>
            <Title style={styles.doctorName}>{appointment.doctorName}</Title>
            <Paragraph style={styles.specialty}>{appointment.doctorSpecialty}</Paragraph>
            <Text style={styles.dateTime}>{formatDateTime(appointment.date)}</Text>
          </View>
          <Chip
            style={[styles.statusChip, { backgroundColor: getStatusColor(appointment.status) + "20" }]}
            textStyle={{ color: getStatusColor(appointment.status) }}
          >
            {getStatusText(appointment.status)}
          </Chip>
        </View>

        <View style={styles.appointmentDetails}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Type:</Text>
            <Text style={styles.detailValue}>{getTypeText(appointment.type)}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Tarif:</Text>
            <Text style={styles.detailValue}>{appointment.fee}€</Text>
          </View>
          {appointment.notes && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Notes:</Text>
              <Text style={styles.detailValue}>{appointment.notes}</Text>
            </View>
          )}
        </View>
      </Card.Content>

      {appointment.status === "scheduled" && isFuture(appointment.date) && (
        <Card.Actions>
          <Button
            mode="outlined"
            onPress={() => handleCancelAppointment(appointment.id)}
            style={styles.cancelButton}
            textColor="#f44336"
          >
            Annuler
          </Button>
          <Button
            mode="contained"
            onPress={() => {
              /* TODO: Reschedule appointment */
            }}
            style={styles.rescheduleButton}
          >
            Reprogrammer
          </Button>
        </Card.Actions>
      )}
    </Card>
  )

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Chargement de vos rendez-vous...</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        <Button
          mode={filter === "all" ? "contained" : "outlined"}
          onPress={() => setFilter("all")}
          style={styles.filterButton}
        >
          Tous
        </Button>
        <Button
          mode={filter === "upcoming" ? "contained" : "outlined"}
          onPress={() => setFilter("upcoming")}
          style={styles.filterButton}
        >
          À venir
        </Button>
        <Button
          mode={filter === "past" ? "contained" : "outlined"}
          onPress={() => setFilter("past")}
          style={styles.filterButton}
        >
          Passés
        </Button>
      </View>

      <FlatList
        data={filteredAppointments}
        renderItem={renderAppointmentCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Aucun rendez-vous trouvé</Text>
            <Button mode="contained" onPress={() => navigation.navigate("DoctorSearch")} style={styles.searchButton}>
              Rechercher un médecin
            </Button>
          </View>
        }
      />

      <FAB icon="plus" style={styles.fab} onPress={() => navigation.navigate("DoctorSearch")} label="Nouveau RDV" />
    </View>
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
  filterContainer: {
    flexDirection: "row",
    padding: 15,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  filterButton: {
    marginRight: 10,
  },
  listContainer: {
    padding: 15,
  },
  appointmentCard: {
    marginBottom: 15,
    elevation: 3,
  },
  appointmentHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 15,
  },
  avatar: {
    marginRight: 15,
  },
  appointmentInfo: {
    flex: 1,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 2,
  },
  specialty: {
    fontSize: 14,
    color: "#007AFF",
    marginBottom: 4,
  },
  dateTime: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },
  statusChip: {
    alignSelf: "flex-start",
  },
  appointmentDetails: {
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    paddingTop: 10,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  detailLabel: {
    fontSize: 14,
    color: "#666",
  },
  detailValue: {
    fontSize: 14,
    fontWeight: "bold",
    flex: 1,
    textAlign: "right",
  },
  cancelButton: {
    borderColor: "#f44336",
  },
  rescheduleButton: {
    marginLeft: 8,
  },
  emptyContainer: {
    alignItems: "center",
    marginTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
  },
  searchButton: {
    paddingHorizontal: 20,
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: "#007AFF",
  },
})
