"use client"

import { useState, useEffect } from "react"
import { View, StyleSheet, FlatList } from "react-native"
import { Card, Title, Text, Chip, ActivityIndicator, SegmentedButtons } from "react-native-paper"
import { sampleMedicalHistory } from "../data/medicalData"
import { formatDate } from "../utils/dateUtils"

export default function MedicalHistoryScreen({ navigation }) {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("all")

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setHistory(sampleMedicalHistory)
      setLoading(false)
    }, 1000)
  }, [])

  const getTypeColor = (type) => {
    switch (type.toLowerCase()) {
      case "consultation":
        return "#4CAF50"
      case "analyse":
        return "#2196F3"
      case "urgence":
        return "#f44336"
      case "chirurgie":
        return "#9C27B0"
      default:
        return "#666"
    }
  }

  const filteredHistory = history.filter((item) => {
    if (filter === "all") return true
    return item.type.toLowerCase() === filter
  })

  const renderHistoryItem = ({ item }) => (
    <Card style={styles.historyCard}>
      <Card.Content>
        <View style={styles.historyHeader}>
          <View style={styles.historyInfo}>
            <Text style={styles.historyDate}>{formatDate(item.date)}</Text>
            <Chip
              style={[styles.typeChip, { backgroundColor: getTypeColor(item.type) + "20" }]}
              textStyle={{ color: getTypeColor(item.type) }}
            >
              {item.type}
            </Chip>
          </View>
        </View>

        <Title style={styles.historyTitle}>{item.diagnosis}</Title>

        <View style={styles.doctorInfo}>
          <Text style={styles.doctorName}>{item.doctor}</Text>
          <Text style={styles.specialty}>{item.specialty}</Text>
        </View>

        {item.treatment && (
          <View style={styles.treatmentSection}>
            <Text style={styles.sectionLabel}>Traitement:</Text>
            <Text style={styles.treatmentText}>{item.treatment}</Text>
          </View>
        )}

        {item.notes && (
          <View style={styles.notesSection}>
            <Text style={styles.sectionLabel}>Notes:</Text>
            <Text style={styles.notesText}>{item.notes}</Text>
          </View>
        )}
      </Card.Content>
    </Card>
  )

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Chargement de votre historique médical...</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Card style={styles.filterCard}>
        <Card.Content>
          <Title>Filtrer par type</Title>
          <SegmentedButtons
            value={filter}
            onValueChange={setFilter}
            buttons={[
              { value: "all", label: "Tous" },
              { value: "consultation", label: "Consultations" },
              { value: "analyse", label: "Analyses" },
              { value: "urgence", label: "Urgences" },
            ]}
            style={styles.segmentedButtons}
          />
        </Card.Content>
      </Card>

      <View style={styles.resultsHeader}>
        <Text style={styles.resultsCount}>
          {filteredHistory.length} entrée{filteredHistory.length > 1 ? "s" : ""} dans votre historique
        </Text>
      </View>

      <FlatList
        data={filteredHistory}
        renderItem={renderHistoryItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Aucun élément trouvé pour ce filtre</Text>
          </View>
        }
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
  filterCard: {
    margin: 15,
    elevation: 3,
  },
  segmentedButtons: {
    marginTop: 10,
  },
  resultsHeader: {
    paddingHorizontal: 15,
    paddingBottom: 10,
  },
  resultsCount: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  listContainer: {
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  historyCard: {
    marginBottom: 15,
    elevation: 3,
  },
  historyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  historyInfo: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  historyDate: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  typeChip: {
    height: 28,
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  doctorInfo: {
    marginBottom: 15,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#007AFF",
  },
  specialty: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  treatmentSection: {
    marginBottom: 10,
  },
  notesSection: {
    marginBottom: 5,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  treatmentText: {
    fontSize: 14,
    color: "#666",
    backgroundColor: "#e8f5e8",
    padding: 10,
    borderRadius: 8,
  },
  notesText: {
    fontSize: 14,
    color: "#666",
    fontStyle: "italic",
    backgroundColor: "#f8f9fa",
    padding: 10,
    borderRadius: 8,
  },
  emptyContainer: {
    alignItems: "center",
    marginTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
  },
})
