import { View, StyleSheet, ScrollView } from "react-native"
import { Card, Title, Paragraph, Button, Avatar, Chip, Text, Divider, List } from "react-native-paper"

export default function DoctorDetailScreen({ navigation, route }) {
  const { doctor } = route.params

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.headerCard}>
        <Card.Content>
          <View style={styles.doctorHeader}>
            <Avatar.Image size={80} source={{ uri: doctor.image }} style={styles.avatar} />
            <View style={styles.doctorInfo}>
              <Title style={styles.doctorName}>{doctor.name}</Title>
              <Paragraph style={styles.specialty}>{doctor.specialty}</Paragraph>
              <View style={styles.ratingContainer}>
                <Text style={styles.rating}>⭐ {doctor.rating}/5</Text>
                <Text style={styles.experience}>• {doctor.experience} ans</Text>
              </View>
            </View>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.infoCard}>
        <Card.Content>
          <Title>Informations de contact</Title>
          <List.Item
            title={doctor.phone}
            description="Téléphone"
            left={(props) => <List.Icon {...props} icon="phone" />}
          />
          <List.Item title={doctor.email} description="Email" left={(props) => <List.Icon {...props} icon="email" />} />
          <List.Item
            title={doctor.address}
            description="Adresse"
            left={(props) => <List.Icon {...props} icon="map-marker" />}
          />
        </Card.Content>
      </Card>

      <Card style={styles.infoCard}>
        <Card.Content>
          <Title>Tarifs et disponibilités</Title>
          <View style={styles.feeContainer}>
            <Chip icon="currency-eur" style={styles.feeChip}>
              Consultation: {doctor.consultationFee}€
            </Chip>
          </View>

          <Divider style={styles.divider} />

          <Text style={styles.sectionTitle}>Créneaux disponibles aujourd'hui:</Text>
          <View style={styles.slotsContainer}>
            {doctor.availableSlots.map((slot, index) => (
              <Chip key={index} style={styles.slotChip} textStyle={styles.slotText}>
                {slot}
              </Chip>
            ))}
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.infoCard}>
        <Card.Content>
          <Title>À propos</Title>
          <Paragraph>
            Dr. {doctor.name.split(" ")[1]} est un spécialiste en {doctor.specialty.toLowerCase()}
            avec {doctor.experience} années d'expérience. Diplômé(e) de la faculté de médecine, il/elle exerce dans le
            cabinet situé à {doctor.city}.
          </Paragraph>
          <Paragraph style={styles.aboutText}>
            Consultation sur rendez-vous uniquement. Paiement par carte bancaire, chèque ou espèces accepté.
          </Paragraph>
        </Card.Content>
      </Card>

      <View style={styles.actionContainer}>
        <Button
          mode="contained"
          onPress={() => navigation.navigate("AppointmentBooking", { doctor })}
          style={styles.bookButton}
          contentStyle={styles.bookButtonContent}
        >
          Prendre rendez-vous
        </Button>

        <Button
          mode="outlined"
          onPress={() => {
            /* TODO: Add to favorites */
          }}
          style={styles.favoriteButton}
        >
          Ajouter aux favoris
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
  headerCard: {
    margin: 15,
    elevation: 3,
  },
  doctorHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    marginRight: 20,
  },
  doctorInfo: {
    flex: 1,
  },
  doctorName: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 4,
  },
  specialty: {
    fontSize: 18,
    color: "#007AFF",
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  rating: {
    fontSize: 16,
    fontWeight: "bold",
  },
  experience: {
    fontSize: 14,
    color: "#666",
    marginLeft: 8,
  },
  infoCard: {
    marginHorizontal: 15,
    marginBottom: 15,
    elevation: 3,
  },
  feeContainer: {
    marginVertical: 10,
  },
  feeChip: {
    backgroundColor: "#e8f5e8",
    alignSelf: "flex-start",
  },
  divider: {
    marginVertical: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  slotsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  slotChip: {
    margin: 4,
    backgroundColor: "#e3f2fd",
  },
  slotText: {
    fontSize: 14,
  },
  aboutText: {
    marginTop: 10,
    fontStyle: "italic",
    color: "#666",
  },
  actionContainer: {
    padding: 15,
    paddingBottom: 30,
  },
  bookButton: {
    marginBottom: 10,
    paddingVertical: 5,
  },
  bookButtonContent: {
    paddingVertical: 8,
  },
  favoriteButton: {
    borderColor: "#007AFF",
  },
})
