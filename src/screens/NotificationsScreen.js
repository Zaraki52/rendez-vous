"use client"

import { useState, useEffect } from "react"
import { View, StyleSheet, ScrollView, Alert } from "react-native"
import { Card, Title, Text, Switch, Button, Chip, ActivityIndicator } from "react-native-paper"
import { notificationService } from "../services/notificationService"
import { sampleMedicalProfile } from "../data/medicalData"

export default function NotificationsScreen({ navigation }) {
  const [loading, setLoading] = useState(true)
  const [permissions, setPermissions] = useState(false)
  const [settings, setSettings] = useState({
    appointmentReminders: true,
    medicationReminders: true,
    vaccinationReminders: true,
    generalNotifications: true,
  })
  const [scheduledNotifications, setScheduledNotifications] = useState([])

  useEffect(() => {
    initializeNotifications()
  }, [])

  const initializeNotifications = async () => {
    try {
      // Check permissions
      const permissionStatus = await notificationService.requestPermissions()
      setPermissions(permissionStatus === "granted")

      // Get scheduled notifications
      const scheduled = await notificationService.getScheduledNotifications()
      setScheduledNotifications(scheduled)

      setLoading(false)
    } catch (error) {
      console.error("Error initializing notifications:", error)
      setLoading(false)
    }
  }

  const handlePermissionRequest = async () => {
    try {
      const status = await notificationService.requestPermissions()
      setPermissions(status === "granted")

      if (status === "granted") {
        Alert.alert("Succès", "Permissions accordées pour les notifications")
      } else {
        Alert.alert("Erreur", "Permissions refusées. Vous pouvez les activer dans les paramètres de votre téléphone.")
      }
    } catch (error) {
      Alert.alert("Erreur", "Impossible de demander les permissions")
    }
  }

  const toggleSetting = (setting) => {
    setSettings((prev) => ({ ...prev, [setting]: !prev[setting] }))
  }

  const setupMedicationReminders = async () => {
    try {
      const medications = sampleMedicalProfile.medications.filter((med) => med.active)

      for (const medication of medications) {
        await notificationService.scheduleMedicationReminder(medication)
      }

      Alert.alert("Succès", `Rappels configurés pour ${medications.length} médicament(s)`)

      // Refresh scheduled notifications
      const scheduled = await notificationService.getScheduledNotifications()
      setScheduledNotifications(scheduled)
    } catch (error) {
      Alert.alert("Erreur", "Impossible de configurer les rappels de médicaments")
    }
  }

  const setupVaccinationReminders = async () => {
    try {
      const vaccinations = sampleMedicalProfile.vaccinations.filter((vac) => vac.nextDue)
      let count = 0

      for (const vaccination of vaccinations) {
        const notificationId = await notificationService.scheduleVaccinationReminder(vaccination)
        if (notificationId) count++
      }

      Alert.alert("Succès", `Rappels configurés pour ${count} vaccination(s)`)

      // Refresh scheduled notifications
      const scheduled = await notificationService.getScheduledNotifications()
      setScheduledNotifications(scheduled)
    } catch (error) {
      Alert.alert("Erreur", "Impossible de configurer les rappels de vaccinations")
    }
  }

  const clearAllNotifications = async () => {
    Alert.alert("Confirmer", "Êtes-vous sûr de vouloir supprimer tous les rappels ?", [
      { text: "Annuler", style: "cancel" },
      {
        text: "Supprimer",
        style: "destructive",
        onPress: async () => {
          await notificationService.cancelAllNotifications()
          setScheduledNotifications([])
          Alert.alert("Succès", "Tous les rappels ont été supprimés")
        },
      },
    ])
  }

  const testNotification = async () => {
    try {
      await notificationService.sendImmediateNotification(
        "Test de notification",
        "Ceci est un test pour vérifier que les notifications fonctionnent correctement",
      )
      Alert.alert("Test envoyé", "Vous devriez recevoir une notification de test")
    } catch (error) {
      Alert.alert("Erreur", "Impossible d'envoyer la notification de test")
    }
  }

  const getNotificationTypeText = (data) => {
    if (data?.type === "appointment") return "Rendez-vous"
    if (data?.type === "medication") return "Médicament"
    if (data?.type === "vaccination") return "Vaccination"
    return "Général"
  }

  const getNotificationTypeColor = (data) => {
    if (data?.type === "appointment") return "#4CAF50"
    if (data?.type === "medication") return "#2196F3"
    if (data?.type === "vaccination") return "#9C27B0"
    return "#666"
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Chargement des notifications...</Text>
      </View>
    )
  }

  return (
    <ScrollView style={styles.container}>
      {/* Permissions */}
      <Card style={styles.card}>
        <Card.Content>
          <Title>Permissions</Title>
          <View style={styles.permissionRow}>
            <View style={styles.permissionInfo}>
              <Text style={styles.permissionText}>Notifications autorisées</Text>
              <Text style={styles.permissionSubtext}>
                {permissions ? "Activées" : "Désactivées - Cliquez pour activer"}
              </Text>
            </View>
            {!permissions && (
              <Button mode="contained" onPress={handlePermissionRequest} compact>
                Activer
              </Button>
            )}
            {permissions && (
              <Chip icon="check" style={styles.successChip}>
                Activé
              </Chip>
            )}
          </View>
        </Card.Content>
      </Card>

      {/* Settings */}
      <Card style={styles.card}>
        <Card.Content>
          <Title>Paramètres des rappels</Title>

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingText}>Rappels de rendez-vous</Text>
              <Text style={styles.settingSubtext}>24h avant le rendez-vous</Text>
            </View>
            <Switch
              value={settings.appointmentReminders}
              onValueChange={() => toggleSetting("appointmentReminders")}
              disabled={!permissions}
            />
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingText}>Rappels de médicaments</Text>
              <Text style={styles.settingSubtext}>Selon la fréquence prescrite</Text>
            </View>
            <Switch
              value={settings.medicationReminders}
              onValueChange={() => toggleSetting("medicationReminders")}
              disabled={!permissions}
            />
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingText}>Rappels de vaccinations</Text>
              <Text style={styles.settingSubtext}>1 semaine avant l'échéance</Text>
            </View>
            <Switch
              value={settings.vaccinationReminders}
              onValueChange={() => toggleSetting("vaccinationReminders")}
              disabled={!permissions}
            />
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingText}>Notifications générales</Text>
              <Text style={styles.settingSubtext}>Informations de santé</Text>
            </View>
            <Switch
              value={settings.generalNotifications}
              onValueChange={() => toggleSetting("generalNotifications")}
              disabled={!permissions}
            />
          </View>
        </Card.Content>
      </Card>

      {/* Quick Setup */}
      <Card style={styles.card}>
        <Card.Content>
          <Title>Configuration rapide</Title>
          <Text style={styles.sectionDescription}>
            Configurez automatiquement vos rappels basés sur votre dossier médical
          </Text>

          <View style={styles.quickSetupButtons}>
            <Button
              mode="outlined"
              onPress={setupMedicationReminders}
              style={styles.setupButton}
              disabled={!permissions || !settings.medicationReminders}
            >
              Configurer médicaments
            </Button>

            <Button
              mode="outlined"
              onPress={setupVaccinationReminders}
              style={styles.setupButton}
              disabled={!permissions || !settings.vaccinationReminders}
            >
              Configurer vaccinations
            </Button>
          </View>
        </Card.Content>
      </Card>

      {/* Scheduled Notifications */}
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.sectionHeader}>
            <Title>Rappels programmés ({scheduledNotifications.length})</Title>
            <Button mode="text" onPress={() => initializeNotifications()} compact>
              Actualiser
            </Button>
          </View>

          {scheduledNotifications.length > 0 ? (
            scheduledNotifications.slice(0, 5).map((notification, index) => (
              <View key={index} style={styles.notificationItem}>
                <View style={styles.notificationHeader}>
                  <Text style={styles.notificationTitle}>{notification.content.title}</Text>
                  <Chip
                    style={[
                      styles.typeChip,
                      { backgroundColor: getNotificationTypeColor(notification.content.data) + "20" },
                    ]}
                    textStyle={{ color: getNotificationTypeColor(notification.content.data) }}
                  >
                    {getNotificationTypeText(notification.content.data)}
                  </Chip>
                </View>
                <Text style={styles.notificationBody}>{notification.content.body}</Text>
                {notification.trigger?.date && (
                  <Text style={styles.notificationDate}>
                    Programmé pour: {new Date(notification.trigger.date * 1000).toLocaleString("fr-FR")}
                  </Text>
                )}
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>Aucun rappel programmé</Text>
          )}

          {scheduledNotifications.length > 5 && (
            <Text style={styles.moreText}>Et {scheduledNotifications.length - 5} autre(s) rappel(s)...</Text>
          )}
        </Card.Content>
      </Card>

      {/* Actions */}
      <Card style={styles.card}>
        <Card.Content>
          <Title>Actions</Title>

          <View style={styles.actionButtons}>
            <Button mode="outlined" onPress={testNotification} style={styles.actionButton} disabled={!permissions}>
              Test de notification
            </Button>

            <Button
              mode="outlined"
              onPress={clearAllNotifications}
              style={[styles.actionButton, styles.dangerButton]}
              textColor="#f44336"
              disabled={scheduledNotifications.length === 0}
            >
              Supprimer tous les rappels
            </Button>
          </View>
        </Card.Content>
      </Card>

      <View style={styles.bottomSpacing} />
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
  card: {
    margin: 15,
    elevation: 3,
  },
  permissionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  permissionInfo: {
    flex: 1,
  },
  permissionText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  permissionSubtext: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  successChip: {
    backgroundColor: "#e8f5e8",
  },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  settingInfo: {
    flex: 1,
  },
  settingText: {
    fontSize: 16,
  },
  settingSubtext: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  sectionDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 15,
  },
  quickSetupButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  setupButton: {
    flex: 1,
    marginHorizontal: 5,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  notificationItem: {
    marginBottom: 15,
    padding: 15,
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
  },
  notificationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: "bold",
    flex: 1,
  },
  typeChip: {
    height: 28,
  },
  notificationBody: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  notificationDate: {
    fontSize: 12,
    color: "#999",
  },
  emptyText: {
    fontSize: 14,
    color: "#999",
    fontStyle: "italic",
    textAlign: "center",
    marginVertical: 20,
  },
  moreText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginTop: 10,
    fontStyle: "italic",
  },
  actionButtons: {
    marginTop: 10,
  },
  actionButton: {
    marginBottom: 10,
  },
  dangerButton: {
    borderColor: "#f44336",
  },
  bottomSpacing: {
    height: 20,
  },
})
