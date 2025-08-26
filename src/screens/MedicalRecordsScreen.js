"use client"

import { useState, useEffect } from "react"
import { View, StyleSheet, ScrollView } from "react-native"
import { Card, Title, Button, Text, Chip, List, FAB, ActivityIndicator } from "react-native-paper"
import { sampleMedicalProfile } from "../data/medicalData"
import { formatDate } from "../utils/dateUtils"

export default function MedicalRecordsScreen({ navigation }) {
  const [medicalProfile, setMedicalProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setMedicalProfile(sampleMedicalProfile)
      setLoading(false)
    }, 1000)
  }, [])

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Chargement de votre dossier médical...</Text>
      </View>
    )
  }

  const { personalInfo, allergies, medications, conditions, vaccinations } = medicalProfile

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Personal Information */}
        <Card style={styles.card}>
          <Card.Content>
            <Title>Informations personnelles</Title>
            <View style={styles.infoGrid}>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Groupe sanguin:</Text>
                <Text style={styles.infoValue}>{personalInfo.bloodType}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Taille:</Text>
                <Text style={styles.infoValue}>{personalInfo.height}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Poids:</Text>
                <Text style={styles.infoValue}>{personalInfo.weight}</Text>
              </View>
            </View>
            <View style={styles.emergencyContact}>
              <Text style={styles.sectionTitle}>Contact d'urgence:</Text>
              <Text style={styles.contactName}>{personalInfo.emergencyContact.name}</Text>
              <Text style={styles.contactDetails}>
                {personalInfo.emergencyContact.phone} • {personalInfo.emergencyContact.relation}
              </Text>
            </View>
          </Card.Content>
        </Card>

        {/* Allergies */}
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.sectionHeader}>
              <Title>Allergies</Title>
              <Button
                mode="outlined"
                compact
                onPress={() => navigation.navigate("AddMedicalRecord", { type: "allergy" })}
              >
                Ajouter
              </Button>
            </View>
            {allergies.length > 0 ? (
              allergies.map((allergy) => (
                <View key={allergy.id} style={styles.allergyItem}>
                  <View style={styles.allergyHeader}>
                    <Text style={styles.allergyName}>{allergy.name}</Text>
                    <Chip
                      style={[
                        styles.severityChip,
                        { backgroundColor: allergy.severity === "Grave" ? "#ffebee" : "#fff3e0" },
                      ]}
                      textStyle={{
                        color: allergy.severity === "Grave" ? "#d32f2f" : "#f57c00",
                      }}
                    >
                      {allergy.severity}
                    </Chip>
                  </View>
                  <Text style={styles.allergySymptoms}>{allergy.symptoms}</Text>
                  <Text style={styles.allergyDate}>Ajouté le {formatDate(allergy.dateAdded)}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.emptyText}>Aucune allergie enregistrée</Text>
            )}
          </Card.Content>
        </Card>

        {/* Current Medications */}
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.sectionHeader}>
              <Title>Médicaments actuels</Title>
              <Button
                mode="outlined"
                compact
                onPress={() => navigation.navigate("AddMedicalRecord", { type: "medication" })}
              >
                Ajouter
              </Button>
            </View>
            {medications.filter((med) => med.active).length > 0 ? (
              medications
                .filter((med) => med.active)
                .map((medication) => (
                  <View key={medication.id} style={styles.medicationItem}>
                    <View style={styles.medicationHeader}>
                      <Text style={styles.medicationName}>{medication.name}</Text>
                      <Text style={styles.medicationDosage}>{medication.dosage}</Text>
                    </View>
                    <Text style={styles.medicationFrequency}>{medication.frequency}</Text>
                    <Text style={styles.medicationDoctor}>Prescrit par {medication.prescribedBy}</Text>
                    <Text style={styles.medicationDate}>Depuis le {formatDate(medication.startDate)}</Text>
                  </View>
                ))
            ) : (
              <Text style={styles.emptyText}>Aucun médicament en cours</Text>
            )}
          </Card.Content>
        </Card>

        {/* Medical Conditions */}
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.sectionHeader}>
              <Title>Conditions médicales</Title>
              <Button
                mode="outlined"
                compact
                onPress={() => navigation.navigate("AddMedicalRecord", { type: "condition" })}
              >
                Ajouter
              </Button>
            </View>
            {conditions.length > 0 ? (
              conditions.map((condition) => (
                <View key={condition.id} style={styles.conditionItem}>
                  <View style={styles.conditionHeader}>
                    <Text style={styles.conditionName}>{condition.name}</Text>
                    <Chip style={styles.statusChip} textStyle={styles.statusText}>
                      {condition.status}
                    </Chip>
                  </View>
                  <Text style={styles.conditionDoctor}>Diagnostiqué par {condition.diagnosedBy}</Text>
                  <Text style={styles.conditionDate}>Le {formatDate(condition.diagnosedDate)}</Text>
                  {condition.notes && <Text style={styles.conditionNotes}>{condition.notes}</Text>}
                </View>
              ))
            ) : (
              <Text style={styles.emptyText}>Aucune condition médicale enregistrée</Text>
            )}
          </Card.Content>
        </Card>

        {/* Vaccinations */}
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.sectionHeader}>
              <Title>Vaccinations</Title>
              <Button
                mode="outlined"
                compact
                onPress={() => navigation.navigate("AddMedicalRecord", { type: "vaccination" })}
              >
                Ajouter
              </Button>
            </View>
            {vaccinations.length > 0 ? (
              vaccinations.map((vaccination) => (
                <View key={vaccination.id} style={styles.vaccinationItem}>
                  <Text style={styles.vaccinationName}>{vaccination.name}</Text>
                  <Text style={styles.vaccinationDate}>Administré le {formatDate(vaccination.date)}</Text>
                  <Text style={styles.vaccinationNext}>Prochain rappel: {formatDate(vaccination.nextDue)}</Text>
                  <Text style={styles.vaccinationBy}>Par {vaccination.administeredBy}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.emptyText}>Aucune vaccination enregistrée</Text>
            )}
          </Card.Content>
        </Card>

        {/* Quick Actions */}
        <Card style={styles.card}>
          <Card.Content>
            <Title>Actions rapides</Title>
            <List.Item
              title="Historique médical complet"
              description="Voir toutes vos consultations et examens"
              left={(props) => <List.Icon {...props} icon="history" />}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => navigation.navigate("MedicalHistory")}
            />
            <List.Item
              title="Exporter mon dossier"
              description="Télécharger un PDF de votre dossier médical"
              left={(props) => <List.Icon {...props} icon="download" />}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => {
                /* TODO: Export functionality */
              }}
            />
          </Card.Content>
        </Card>

        <View style={styles.bottomSpacing} />
      </ScrollView>

      <FAB icon="plus" style={styles.fab} onPress={() => navigation.navigate("AddMedicalRecord")} label="Ajouter" />
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
  card: {
    margin: 15,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  infoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 10,
  },
  infoItem: {
    width: "50%",
    marginBottom: 10,
  },
  infoLabel: {
    fontSize: 14,
    color: "#666",
  },
  infoValue: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 2,
  },
  emergencyContact: {
    marginTop: 15,
    padding: 15,
    backgroundColor: "#fff3e0",
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  contactName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  contactDetails: {
    fontSize: 14,
    color: "#666",
  },
  allergyItem: {
    marginBottom: 15,
    padding: 15,
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
  },
  allergyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  allergyName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  severityChip: {
    height: 28,
  },
  allergySymptoms: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  allergyDate: {
    fontSize: 12,
    color: "#999",
  },
  medicationItem: {
    marginBottom: 15,
    padding: 15,
    backgroundColor: "#e8f5e8",
    borderRadius: 8,
  },
  medicationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  medicationName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  medicationDosage: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#4CAF50",
  },
  medicationFrequency: {
    fontSize: 14,
    color: "#666",
    marginBottom: 3,
  },
  medicationDoctor: {
    fontSize: 14,
    color: "#666",
    marginBottom: 3,
  },
  medicationDate: {
    fontSize: 12,
    color: "#999",
  },
  conditionItem: {
    marginBottom: 15,
    padding: 15,
    backgroundColor: "#e3f2fd",
    borderRadius: 8,
  },
  conditionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  conditionName: {
    fontSize: 16,
    fontWeight: "bold",
    flex: 1,
  },
  statusChip: {
    backgroundColor: "#2196F3",
    height: 28,
  },
  statusText: {
    color: "white",
    fontSize: 12,
  },
  conditionDoctor: {
    fontSize: 14,
    color: "#666",
    marginBottom: 3,
  },
  conditionDate: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  conditionNotes: {
    fontSize: 14,
    fontStyle: "italic",
    color: "#666",
  },
  vaccinationItem: {
    marginBottom: 15,
    padding: 15,
    backgroundColor: "#f3e5f5",
    borderRadius: 8,
  },
  vaccinationName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  vaccinationDate: {
    fontSize: 14,
    color: "#666",
    marginBottom: 3,
  },
  vaccinationNext: {
    fontSize: 14,
    color: "#9C27B0",
    fontWeight: "bold",
    marginBottom: 3,
  },
  vaccinationBy: {
    fontSize: 12,
    color: "#999",
  },
  emptyText: {
    fontSize: 14,
    color: "#999",
    fontStyle: "italic",
    textAlign: "center",
    marginVertical: 10,
  },
  bottomSpacing: {
    height: 80,
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: "#007AFF",
  },
})
