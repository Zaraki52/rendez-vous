"use client"

import { useState, useEffect } from "react"
import { View, StyleSheet, ScrollView } from "react-native"
import { Searchbar, Button, Card, Title, Chip, Text, ActivityIndicator } from "react-native-paper"
import { specialtyService, doctorService } from "../services/database"
import { connectDB } from "../config/database"

export default function DoctorSearchScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSpecialty, setSelectedSpecialty] = useState("")
  const [selectedCity, setSelectedCity] = useState("")
  const [specialties, setSpecialties] = useState([])
  const [cities, setCities] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        await connectDB()

        // Load specialties from database
        const specialtiesData = await specialtyService.getAllSpecialties()
        setSpecialties(specialtiesData.map((s) => s.name))

        // Load unique cities from doctors
        const doctorsData = await doctorService.getAllDoctors()
        const uniqueCities = [...new Set(doctorsData.map((d) => d.city).filter(Boolean))]
        setCities(uniqueCities)

        setLoading(false)
      } catch (error) {
        console.error("Error loading search data:", error)
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const handleSearch = () => {
    // Navigate to doctor list with search parameters
    navigation.navigate("DoctorList", {
      searchQuery,
      specialty: selectedSpecialty,
      city: selectedCity,
    })
  }

  const clearFilters = () => {
    setSearchQuery("")
    setSelectedSpecialty("")
    setSelectedCity("")
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Chargement des données...</Text>
      </View>
    )
  }

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.searchCard}>
        <Card.Content>
          <Title>Recherche générale</Title>
          <Searchbar
            placeholder="Nom du médecin, spécialité..."
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={styles.searchbar}
          />
        </Card.Content>
      </Card>

      <Card style={styles.filterCard}>
        <Card.Content>
          <Title>Filtrer par spécialité</Title>
          <View style={styles.chipContainer}>
            {specialties.map((specialty) => (
              <Chip
                key={specialty}
                selected={selectedSpecialty === specialty}
                onPress={() => setSelectedSpecialty(selectedSpecialty === specialty ? "" : specialty)}
                style={styles.chip}
              >
                {specialty}
              </Chip>
            ))}
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.filterCard}>
        <Card.Content>
          <Title>Filtrer par ville</Title>
          <View style={styles.chipContainer}>
            {cities.map((city) => (
              <Chip
                key={city}
                selected={selectedCity === city}
                onPress={() => setSelectedCity(selectedCity === city ? "" : city)}
                style={styles.chip}
              >
                {city}
              </Chip>
            ))}
          </View>
        </Card.Content>
      </Card>

      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          onPress={handleSearch}
          style={styles.searchButton}
          disabled={!searchQuery && !selectedSpecialty && !selectedCity}
        >
          Rechercher des médecins
        </Button>

        <Button mode="outlined" onPress={clearFilters} style={styles.clearButton}>
          Effacer les filtres
        </Button>
      </View>

      {(searchQuery || selectedSpecialty || selectedCity) && (
        <Card style={styles.summaryCard}>
          <Card.Content>
            <Title>Critères de recherche</Title>
            {searchQuery && <Text>Recherche: {searchQuery}</Text>}
            {selectedSpecialty && <Text>Spécialité: {selectedSpecialty}</Text>}
            {selectedCity && <Text>Ville: {selectedCity}</Text>}
          </Card.Content>
        </Card>
      )}
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
  searchCard: {
    margin: 15,
    elevation: 3,
  },
  filterCard: {
    marginHorizontal: 15,
    marginBottom: 15,
    elevation: 3,
  },
  searchbar: {
    marginTop: 10,
  },
  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 10,
  },
  chip: {
    margin: 4,
  },
  buttonContainer: {
    padding: 15,
  },
  searchButton: {
    marginBottom: 10,
    paddingVertical: 5,
  },
  clearButton: {
    borderColor: "#007AFF",
  },
  summaryCard: {
    margin: 15,
    backgroundColor: "#e3f2fd",
  },
})
