import { createNativeStackNavigator } from "@react-navigation/native-stack"
import HomeScreen from "../screens/HomeScreen"
import DoctorSearchScreen from "../screens/DoctorSearchScreen"
import DoctorListScreen from "../screens/DoctorListScreen"
import DoctorDetailScreen from "../screens/DoctorDetailScreen"
import AppointmentBookingScreen from "../screens/AppointmentBookingScreen"
import AppointmentConfirmationScreen from "../screens/AppointmentConfirmationScreen"
import MyAppointmentsScreen from "../screens/MyAppointmentsScreen"
import MedicalRecordsScreen from "../screens/MedicalRecordsScreen"
import AddMedicalRecordScreen from "../screens/AddMedicalRecordScreen"
import MedicalHistoryScreen from "../screens/MedicalHistoryScreen"
import NotificationsScreen from "../screens/NotificationsScreen"

const Stack = createNativeStackNavigator()

export default function AppNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} options={{ title: "Accueil" }} />
      <Stack.Screen name="DoctorSearch" component={DoctorSearchScreen} options={{ title: "Rechercher un médecin" }} />
      <Stack.Screen name="DoctorList" component={DoctorListScreen} options={{ title: "Médecins disponibles" }} />
      <Stack.Screen name="DoctorDetail" component={DoctorDetailScreen} options={{ title: "Détails du médecin" }} />
      <Stack.Screen
        name="AppointmentBooking"
        component={AppointmentBookingScreen}
        options={{ title: "Prendre rendez-vous" }}
      />
      <Stack.Screen
        name="AppointmentConfirmation"
        component={AppointmentConfirmationScreen}
        options={{ title: "Confirmation" }}
      />
      <Stack.Screen name="MyAppointments" component={MyAppointmentsScreen} options={{ title: "Mes rendez-vous" }} />
      <Stack.Screen name="MedicalRecords" component={MedicalRecordsScreen} options={{ title: "Mon dossier médical" }} />
      <Stack.Screen
        name="AddMedicalRecord"
        component={AddMedicalRecordScreen}
        options={{ title: "Ajouter une information" }}
      />
      <Stack.Screen name="MedicalHistory" component={MedicalHistoryScreen} options={{ title: "Historique médical" }} />
      <Stack.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{ title: "Notifications & Rappels" }}
      />
    </Stack.Navigator>
  )
}
