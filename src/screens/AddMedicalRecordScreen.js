"use client"

import { useState } from "react"
import { View, StyleSheet, ScrollView, Alert } from "react-native"
import { Card, Title, TextInput, Button, RadioButton, Text, SegmentedButtons } from "react-native-paper"
import { Calendar } from "react-native-calendars"
import { formatDate } from "../utils/dateUtils"

export default function AddMedicalRecordScreen({ navigation, route }) {
  const { type } = route.params || {}
  const [recordType, setRecordType] = useState(type || "allergy")
  const [formData, setFormData] = useState({
    name: "",
    severity: "Modérée",
    symptoms: "",
    dosage: "",
    frequency: "",
    prescribedBy: "",
    status: "En traitement",
    notes: "",
    administeredBy: "",
    nextDue: "",
  })
  const [selectedDate, setSelectedDate] = useState("")
  const [showCalendar, setShowCalendar] = useState(false)

  const handleSave = () => {
    if (!formData.name.trim()) {
      Alert.alert("Erreur", "Veuillez saisir un nom")
      return
    }

    // In real app, this would save to Firebase
    Alert.alert("Succès", "Information ajoutée à votre dossier médical", [
      {
        text: "OK",
        onPress: () => navigation.goBack(),
      },
    ])
  }

  const updateFormData = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const renderAllergyForm = () => (
    <>
      <TextInput
        label="Nom de l'allergie *"
        value={formData.name}
        onChangeText={(text) => updateFormData("name", text)}
        style={styles.input}
        mode="outlined"
      />

      <Card style={styles.radioCard}>
        <Card.Content>
          <Title>Sévérité</Title>
          <RadioButton.Group onValueChange={(value) => updateFormData("severity", value)} value={formData.severity}>
            <View style={styles.radioOption}>
              <RadioButton value="Légère" />
              <Text style={styles.radioLabel}>Légère</Text>
            </View>
            <View style={styles.radioOption}>
              <RadioButton value="Modérée" />
              <Text style={styles.radioLabel}>Modérée</Text>
            </View>
            <View style={styles.radioOption}>
              <RadioButton value="Grave" />
              <Text style={styles.radioLabel}>Grave</Text>
            </View>
          </RadioButton.Group>
        </Card.Content>
      </Card>

      <TextInput
        label="Symptômes"
        value={formData.symptoms}
        onChangeText={(text) => updateFormData("symptoms", text)}
        style={styles.input}
        mode="outlined"
        multiline
        numberOfLines={3}
      />
    </>
  )

  const renderMedicationForm = () => (
    <>
      <TextInput
        label="Nom du médicament *"
        value={formData.name}
        onChangeText={(text) => updateFormData("name", text)}
        style={styles.input}
        mode="outlined"
      />

      <TextInput
        label="Dosage"
        value={formData.dosage}
        onChangeText={(text) => updateFormData("dosage", text)}
        style={styles.input}
        mode="outlined"
        placeholder="ex: 10mg, 1 comprimé"
      />

      <TextInput
        label="Fréquence"
        value={formData.frequency}
        onChangeText={(text) => updateFormData("frequency", text)}
        style={styles.input}
        mode="outlined"
        placeholder="ex: 1 fois par jour, matin et soir"
      />

      <TextInput
        label="Prescrit par"
        value={formData.prescribedBy}
        onChangeText={(text) => updateFormData("prescribedBy", text)}
        style={styles.input}
        mode="outlined"
        placeholder="Nom du médecin"
      />

      <TextInput
        label="Notes"
        value={formData.notes}
        onChangeText={(text) => updateFormData("notes", text)}
        style={styles.input}
        mode="outlined"
        multiline
        numberOfLines={3}
        placeholder="Instructions particulières, effets secondaires..."
      />
    </>
  )

  const renderConditionForm = () => (
    <>
      <TextInput
        label="Nom de la condition *"
        value={formData.name}
        onChangeText={(text) => updateFormData("name", text)}
        style={styles.input}
        mode="outlined"
      />

      <Card style={styles.radioCard}>
        <Card.Content>
          <Title>Statut</Title>
          <RadioButton.Group onValueChange={(value) => updateFormData("status", value)} value={formData.status}>
            <View style={styles.radioOption}>
              <RadioButton value="En traitement" />
              <Text style={styles.radioLabel}>En traitement</Text>
            </View>
            <View style={styles.radioOption}>
              <RadioButton value="Stabilisé" />
              <Text style={styles.radioLabel}>Stabilisé</Text>
            </View>
            <View style={styles.radioOption}>
              <RadioButton value="Guéri" />
              <Text style={styles.radioLabel}>Guéri</Text>
            </View>
          </RadioButton.Group>
        </Card.Content>
      </Card>

      <TextInput
        label="Diagnostiqué par"
        value={formData.prescribedBy}
        onChangeText={(text) => updateFormData("prescribedBy", text)}
        style={styles.input}
        mode="outlined"
        placeholder="Nom du médecin"
      />

      <TextInput
        label="Notes"
        value={formData.notes}
        onChangeText={(text) => updateFormData("notes", text)}
        style={styles.input}
        mode="outlined"
        multiline
        numberOfLines={3}
        placeholder="Détails sur la condition, traitement..."
      />
    </>
  )

  const renderVaccinationForm = () => (
    <>
      <TextInput
        label="Nom du vaccin *"
        value={formData.name}
        onChangeText={(text) => updateFormData("name", text)}
        style={styles.input}
        mode="outlined"
        placeholder="ex: COVID-19 (Pfizer), Grippe saisonnière"
      />

      <TextInput
        label="Administré par"
        value={formData.administeredBy}
        onChangeText={(text) => updateFormData("administeredBy", text)}
        style={styles.input}
        mode="outlined"
        placeholder="Centre de vaccination, médecin, pharmacie"
      />

      <Button mode="outlined" onPress={() => setShowCalendar(!showCalendar)} style={styles.dateButton} icon="calendar">
        {selectedDate ? `Date: ${formatDate(new Date(selectedDate))}` : "Sélectionner la date"}
      </Button>

      {showCalendar && (
        <Card style={styles.calendarCard}>
          <Card.Content>
            <Calendar
              onDayPress={(day) => {
                setSelectedDate(day.dateString)
                setShowCalendar(false)
              }}
              markedDates={{
                [selectedDate]: { selected: true, selectedColor: "#007AFF" },
              }}
              maxDate={new Date().toISOString().split("T")[0]}
              theme={{
                selectedDayBackgroundColor: "#007AFF",
                selectedDayTextColor: "#ffffff",
                todayTextColor: "#007AFF",
                arrowColor: "#007AFF",
              }}
            />
          </Card.Content>
        </Card>
      )}

      <TextInput
        label="Prochain rappel"
        value={formData.nextDue}
        onChangeText={(text) => updateFormData("nextDue", text)}
        style={styles.input}
        mode="outlined"
        placeholder="Date du prochain rappel (optionnel)"
      />
    </>
  )

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.typeCard}>
        <Card.Content>
          <Title>Type d'information</Title>
          <SegmentedButtons
            value={recordType}
            onValueChange={setRecordType}
            buttons={[
              { value: "allergy", label: "Allergie" },
              { value: "medication", label: "Médicament" },
              { value: "condition", label: "Condition" },
              { value: "vaccination", label: "Vaccination" },
            ]}
            style={styles.segmentedButtons}
          />
        </Card.Content>
      </Card>

      <Card style={styles.formCard}>
        <Card.Content>
          <Title>
            {recordType === "allergy"
              ? "Nouvelle allergie"
              : recordType === "medication"
                ? "Nouveau médicament"
                : recordType === "condition"
                  ? "Nouvelle condition"
                  : "Nouvelle vaccination"}
          </Title>

          {recordType === "allergy" && renderAllergyForm()}
          {recordType === "medication" && renderMedicationForm()}
          {recordType === "condition" && renderConditionForm()}
          {recordType === "vaccination" && renderVaccinationForm()}
        </Card.Content>
      </Card>

      <View style={styles.buttonContainer}>
        <Button mode="contained" onPress={handleSave} style={styles.saveButton} contentStyle={styles.saveButtonContent}>
          Enregistrer
        </Button>

        <Button mode="outlined" onPress={() => navigation.goBack()} style={styles.cancelButton}>
          Annuler
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
  typeCard: {
    margin: 15,
    elevation: 3,
  },
  segmentedButtons: {
    marginTop: 10,
  },
  formCard: {
    marginHorizontal: 15,
    marginBottom: 15,
    elevation: 3,
  },
  input: {
    marginBottom: 15,
  },
  radioCard: {
    marginBottom: 15,
    backgroundColor: "#f8f9fa",
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
  dateButton: {
    marginBottom: 15,
    borderColor: "#007AFF",
  },
  calendarCard: {
    marginBottom: 15,
  },
  buttonContainer: {
    padding: 15,
    paddingBottom: 30,
  },
  saveButton: {
    marginBottom: 10,
    paddingVertical: 5,
  },
  saveButtonContent: {
    paddingVertical: 8,
  },
  cancelButton: {
    borderColor: "#007AFF",
  },
})
