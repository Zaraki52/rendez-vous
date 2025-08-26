import { View, StyleSheet, ScrollView } from "react-native"
import { Button, Card, Title, Paragraph, IconButton } from "react-native-paper"
import { signOut } from "firebase/auth"
import { auth } from "../firebase-config"

export default function HomeScreen({ navigation }) {
  const handleLogout = () => {
    signOut(auth).then(() => navigation.navigate("Login"))
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Title style={styles.welcomeText}>Bienvenue dans votre espace santé</Title>
            <Paragraph style={styles.subtitle}>Gérez vos rendez-vous médicaux facilement</Paragraph>
          </View>
          <IconButton
            icon="bell"
            iconColor="white"
            size={24}
            onPress={() => navigation.navigate("Notifications")}
            style={styles.notificationButton}
          />
        </View>
      </View>

      <View style={styles.cardContainer}>
        <Card style={styles.card}>
          <Card.Content>
            <Title>Rechercher un médecin</Title>
            <Paragraph>Trouvez un médecin par spécialité ou localisation</Paragraph>
          </Card.Content>
          <Card.Actions>
            <Button mode="contained" onPress={() => navigation.navigate("DoctorSearch")} style={styles.cardButton}>
              Rechercher
            </Button>
          </Card.Actions>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Title>Mes rendez-vous</Title>
            <Paragraph>Consultez et gérez vos rendez-vous</Paragraph>
          </Card.Content>
          <Card.Actions>
            <Button mode="contained" onPress={() => navigation.navigate("MyAppointments")} style={styles.cardButton}>
              Voir mes RDV
            </Button>
          </Card.Actions>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Title>Mon dossier médical</Title>
            <Paragraph>Accédez à votre historique médical</Paragraph>
          </Card.Content>
          <Card.Actions>
            <Button mode="contained" onPress={() => navigation.navigate("MedicalRecords")} style={styles.cardButton}>
              Mon dossier
            </Button>
          </Card.Actions>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Title>Notifications & Rappels</Title>
            <Paragraph>Gérez vos rappels de médicaments et rendez-vous</Paragraph>
          </Card.Content>
          <Card.Actions>
            <Button mode="contained" onPress={() => navigation.navigate("Notifications")} style={styles.cardButton}>
              Mes rappels
            </Button>
          </Card.Actions>
        </Card>
      </View>

      <View style={styles.logoutContainer}>
        <Button mode="outlined" onPress={handleLogout} style={styles.logoutButton}>
          Se déconnecter
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
  header: {
    padding: 20,
    backgroundColor: "#007AFF",
    marginBottom: 20,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  welcomeText: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
  subtitle: {
    color: "white",
    fontSize: 16,
    opacity: 0.9,
  },
  notificationButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  cardContainer: {
    paddingHorizontal: 20,
  },
  card: {
    marginBottom: 15,
    elevation: 3,
  },
  cardButton: {
    marginTop: 10,
  },
  logoutContainer: {
    padding: 20,
    marginTop: 20,
  },
  logoutButton: {
    borderColor: "#007AFF",
  },
})
