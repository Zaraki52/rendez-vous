"use client"

import { useState, useEffect } from "react"
import { View, StyleSheet, FlatList } from "react-native"
import { Card, Title, Paragraph, Button, Avatar, Chip, Text, ActivityIndicator } from "react-native-paper"
import { doctorService } from "../services/database"
import { connectDB } from "../config/database"

export default function DoctorListScreen({ navigation, route }) {
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)

  const { searchQuery, specialty, city } = route.params || {}

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        await connectDB()
        let doctorsData = []

        if (specialty && city) {
          const specialtyDoctors = await doctorService.searchBySpecialty(specialty)
          doctorsData = specialtyDoctors.filter((doctor) => doctor.city.toLowerCase().includes(city.toLowerCase()))
        } else if (specialty) {
          doctorsData = await doctorService.searchBySpecialty(specialty)
        } else if (city) {
          doctorsData = await doctorService.searchByLocation(city)
        } else {
          doctorsData = await doctorService.getAllDoctors()
        }

        if (searchQuery) {
          doctorsData = doctorsData.filter(
            (doctor) =>
              `${doctor.first_name} ${doctor.last_name}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
              doctor.specialty_name?.toLowerCase().includes(searchQuery.toLowerCase()),
          )
        }

        setDoctors(doctorsData)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching doctors:", error)
        setLoading(false)
      }
    }

    fetchDoctors()
  }, [searchQuery, specialty, city])

  const renderDoctorCard = ({ item: doctor }) => (
    <Card style={styles.doctorCard}>
      <Card.Content>
        <View style={styles.doctorHeader}>
          <Avatar.Image
            size={60}
            source={{ uri: doctor.photo_url || "/caring-doctor.png" }}
            style={styles.avatar}
          />
          <View style={styles.doctorInfo}>
            <Title style={styles.doctorName}>
              Dr. {doctor.first_name} {doctor.last_name}
            </Title>
            <Paragraph style={styles.specialty}>{doctor.specialty_name}</Paragraph>
            <View style={styles.ratingContainer}>
              <Text style={styles.rating}>⭐ {doctor.rating || 0}</Text>
              <Text style={styles.experience}>• {doctor.years_experience} ans d'expérience</Text>
            </View>
          </View>
        </View>

        <View style={styles.locationContainer}>
          <Text style={styles.location}>📍 {doctor.city}</Text>
          <Text style={styles.address}>{doctor.address}</Text>
        </View>

        <View style={styles.feeContainer}>
          <Chip icon="currency-eur" style={styles.feeChip}>
            {doctor.consultation_fee}€
          </Chip>
          <Text style={styles.availableSlots}>Disponible</Text>
        </View>
      </Card.Content>

      <Card.Actions>
        <Button
          mode="contained"
          onPress={() => navigation.navigate("DoctorDetail", { doctor })}
          style={styles.detailButton}
        >
          Voir détails
        </Button>
        <Button
          mode="outlined"
          onPress={() => navigation.navigate("AppointmentBooking", { doctor })}
          style={styles.bookButton}
        >
          Prendre RDV
        </Button>
      </Card.Actions>
    </Card>
  )

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Recherche des médecins...</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.resultsHeader}>
        <Text style={styles.resultsCount}>
          {doctors.length} médecin{doctors.length > 1 ? "s" : ""} trouvé{doctors.length > 1 ? "s" : ""}
        </Text>
        {(specialty || city) && (
          <View style={styles.activeFilters}>
            {specialty && <Chip style={styles.filterChip}>{specialty}</Chip>}
            {city && <Chip style={styles.filterChip}>{city}</Chip>}
          </View>
        )}
      </View>

      <FlatList
        data={doctors}
        renderItem={renderDoctorCard}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
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
  resultsHeader: {
    padding: 15,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  resultsCount: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  activeFilters: {
    flexDirection: "row",
    marginTop: 8,
  },
  filterChip: {
    marginRight: 8,
  },
  listContainer: {
    padding: 15,
  },
  doctorCard: {
    marginBottom: 15,
    elevation: 3,
  },
  doctorHeader: {
    flexDirection: "row",
    marginBottom: 15,
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
    marginBottom: 4,
  },
  specialty: {
    fontSize: 16,
    color: "#007AFF",
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  rating: {
    fontSize: 14,
    fontWeight: "bold",
  },
  experience: {
    fontSize: 14,
    color: "#666",
    marginLeft: 5,
  },
  locationContainer: {
    marginBottom: 15,
  },
  location: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 2,
  },
  address: {
    fontSize: 12,
    color: "#666",
  },
  feeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  feeChip: {
    backgroundColor: "#e8f5e8",
  },
  availableSlots: {
    fontSize: 12,
    color: "#666",
  },
  detailButton: {
    marginRight: 8,
  },
  bookButton: {
    borderColor: "#007AFF",
  },
})
