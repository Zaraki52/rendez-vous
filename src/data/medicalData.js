// Sample medical data for development
export const sampleMedicalProfile = {
  personalInfo: {
    bloodType: "A+",
    height: "175 cm",
    weight: "70 kg",
    emergencyContact: {
      name: "Marie Dupont",
      phone: "06 12 34 56 78",
      relation: "Épouse",
    },
  },
  allergies: [
    {
      id: "1",
      name: "Pénicilline",
      severity: "Grave",
      symptoms: "Éruption cutanée, difficultés respiratoires",
      dateAdded: new Date(2023, 5, 15),
    },
    {
      id: "2",
      name: "Arachides",
      severity: "Modérée",
      symptoms: "Gonflement, démangeaisons",
      dateAdded: new Date(2023, 8, 22),
    },
  ],
  medications: [
    {
      id: "1",
      name: "Lisinopril",
      dosage: "10mg",
      frequency: "1 fois par jour",
      prescribedBy: "Dr. Marie Dubois",
      startDate: new Date(2024, 0, 15),
      endDate: null,
      active: true,
    },
    {
      id: "2",
      name: "Metformine",
      dosage: "500mg",
      frequency: "2 fois par jour",
      prescribedBy: "Dr. Jean Martin",
      startDate: new Date(2023, 11, 10),
      endDate: new Date(2024, 5, 10),
      active: false,
    },
  ],
  conditions: [
    {
      id: "1",
      name: "Hypertension artérielle",
      diagnosedDate: new Date(2024, 0, 15),
      diagnosedBy: "Dr. Marie Dubois",
      status: "En traitement",
      notes: "Contrôle régulier nécessaire",
    },
    {
      id: "2",
      name: "Diabète type 2",
      diagnosedDate: new Date(2023, 11, 10),
      diagnosedBy: "Dr. Jean Martin",
      status: "Stabilisé",
      notes: "Régime alimentaire et exercice",
    },
  ],
  vaccinations: [
    {
      id: "1",
      name: "COVID-19 (Pfizer)",
      date: new Date(2024, 2, 15),
      nextDue: new Date(2024, 8, 15),
      administeredBy: "Centre de vaccination",
    },
    {
      id: "2",
      name: "Grippe saisonnière",
      date: new Date(2023, 9, 20),
      nextDue: new Date(2024, 9, 20),
      administeredBy: "Pharmacie Centrale",
    },
  ],
}

export const sampleMedicalHistory = [
  {
    id: "1",
    date: new Date(2024, 10, 15),
    type: "Consultation",
    doctor: "Dr. Marie Dubois",
    specialty: "Cardiologie",
    diagnosis: "Contrôle hypertension",
    treatment: "Ajustement dosage Lisinopril",
    notes: "Tension stable, continuer traitement",
  },
  {
    id: "2",
    date: new Date(2024, 9, 22),
    type: "Analyse",
    doctor: "Laboratoire Biolab",
    specialty: "Biologie médicale",
    diagnosis: "Bilan lipidique",
    treatment: "Aucun",
    notes: "Résultats dans les normes",
  },
  {
    id: "3",
    date: new Date(2024, 8, 10),
    type: "Urgence",
    doctor: "Dr. Paul Rousseau",
    specialty: "Médecine d'urgence",
    diagnosis: "Entorse cheville droite",
    treatment: "Immobilisation, anti-inflammatoires",
    notes: "Guérison complète en 3 semaines",
  },
]
