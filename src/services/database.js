// PostgreSQL database service for medical app
import { client } from "../config/database"

// Doctor services
export const doctorService = {
  // Get all doctors
  async getAllDoctors() {
    try {
      const query = `
        SELECT d.*, s.name as specialty_name 
        FROM doctors d 
        LEFT JOIN specialties s ON d.specialty_id = s.id 
        WHERE d.is_active = true
        ORDER BY d.rating DESC
      `
      const result = await client.query(query)
      return result.rows
    } catch (error) {
      console.error("Error fetching doctors:", error)
      throw error
    }
  },

  // Search doctors by specialty
  async searchBySpecialty(specialty) {
    try {
      const query = `
        SELECT d.*, s.name as specialty_name 
        FROM doctors d 
        JOIN specialties s ON d.specialty_id = s.id 
        WHERE s.name ILIKE $1 AND d.is_active = true
        ORDER BY d.rating DESC
      `
      const result = await client.query(query, [`%${specialty}%`])
      return result.rows
    } catch (error) {
      console.error("Error searching doctors by specialty:", error)
      throw error
    }
  },

  // Search doctors by location
  async searchByLocation(city) {
    try {
      const query = `
        SELECT d.*, s.name as specialty_name 
        FROM doctors d 
        LEFT JOIN specialties s ON d.specialty_id = s.id 
        WHERE d.city ILIKE $1 AND d.is_active = true
        ORDER BY d.rating DESC
      `
      const result = await client.query(query, [`%${city}%`])
      return result.rows
    } catch (error) {
      console.error("Error searching doctors by location:", error)
      throw error
    }
  },

  // Get doctor by ID
  async getDoctorById(doctorId) {
    try {
      const query = `
        SELECT d.*, s.name as specialty_name 
        FROM doctors d 
        LEFT JOIN specialties s ON d.specialty_id = s.id 
        WHERE d.id = $1
      `
      const result = await client.query(query, [doctorId])
      return result.rows[0] || null
    } catch (error) {
      console.error("Error fetching doctor by ID:", error)
      throw error
    }
  },

  // Get doctor availability
  async getDoctorAvailability(doctorId) {
    try {
      const query = `
        SELECT * FROM doctor_availability 
        WHERE doctor_id = $1 AND is_available = true
        ORDER BY day_of_week, start_time
      `
      const result = await client.query(query, [doctorId])
      return result.rows
    } catch (error) {
      console.error("Error fetching doctor availability:", error)
      throw error
    }
  },
}

// Appointment services
export const appointmentService = {
  // Create new appointment
  async createAppointment(appointmentData) {
    try {
      const query = `
        INSERT INTO appointments (user_id, doctor_id, appointment_date, appointment_time, consultation_type, notes, symptoms)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING id
      `
      const values = [
        appointmentData.userId,
        appointmentData.doctorId,
        appointmentData.appointmentDate,
        appointmentData.appointmentTime,
        appointmentData.consultationType || "consultation",
        appointmentData.notes || "",
        appointmentData.symptoms || "",
      ]
      const result = await client.query(query, values)
      return result.rows[0].id
    } catch (error) {
      console.error("Error creating appointment:", error)
      throw error
    }
  },

  // Get user appointments
  async getUserAppointments(userId) {
    try {
      const query = `
        SELECT a.*, d.first_name as doctor_first_name, d.last_name as doctor_last_name, 
               s.name as specialty_name, d.consultation_fee
        FROM appointments a
        JOIN doctors d ON a.doctor_id = d.id
        LEFT JOIN specialties s ON d.specialty_id = s.id
        WHERE a.user_id = $1
        ORDER BY a.appointment_date DESC, a.appointment_time DESC
      `
      const result = await client.query(query, [userId])
      return result.rows
    } catch (error) {
      console.error("Error fetching user appointments:", error)
      throw error
    }
  },

  // Get doctor appointments for a specific date
  async getDoctorAppointments(doctorId, date) {
    try {
      const query = `
        SELECT a.*, u.first_name as user_first_name, u.last_name as user_last_name
        FROM appointments a
        JOIN users u ON a.user_id = u.id
        WHERE a.doctor_id = $1 AND a.appointment_date = $2
        ORDER BY a.appointment_time
      `
      const result = await client.query(query, [doctorId, date])
      return result.rows
    } catch (error) {
      console.error("Error fetching doctor appointments:", error)
      throw error
    }
  },

  // Update appointment status
  async updateAppointmentStatus(appointmentId, status) {
    try {
      const query = `
        UPDATE appointments 
        SET status = $1, updated_at = CURRENT_TIMESTAMP 
        WHERE id = $2
      `
      await client.query(query, [status, appointmentId])
    } catch (error) {
      console.error("Error updating appointment status:", error)
      throw error
    }
  },

  // Cancel appointment
  async cancelAppointment(appointmentId) {
    try {
      await this.updateAppointmentStatus(appointmentId, "cancelled")
    } catch (error) {
      console.error("Error cancelling appointment:", error)
      throw error
    }
  },
}

// Medical records services
export const medicalRecordService = {
  // Create medical record
  async createRecord(recordData) {
    try {
      const query = `
        INSERT INTO medical_records (user_id, record_type, title, description, date_recorded, doctor_name, severity, dosage, frequency)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING id
      `
      const values = [
        recordData.userId,
        recordData.recordType,
        recordData.title,
        recordData.description || "",
        recordData.dateRecorded || new Date(),
        recordData.doctorName || "",
        recordData.severity || null,
        recordData.dosage || null,
        recordData.frequency || null,
      ]
      const result = await client.query(query, values)
      return result.rows[0].id
    } catch (error) {
      console.error("Error creating medical record:", error)
      throw error
    }
  },

  // Get user medical records
  async getUserRecords(userId) {
    try {
      const query = `
        SELECT * FROM medical_records 
        WHERE user_id = $1 AND is_active = true
        ORDER BY date_recorded DESC, created_at DESC
      `
      const result = await client.query(query, [userId])
      return result.rows
    } catch (error) {
      console.error("Error fetching user medical records:", error)
      throw error
    }
  },

  // Update medical record
  async updateRecord(recordId, updateData) {
    try {
      const query = `
        UPDATE medical_records 
        SET title = $1, description = $2, severity = $3, dosage = $4, frequency = $5, updated_at = CURRENT_TIMESTAMP
        WHERE id = $6
      `
      const values = [
        updateData.title,
        updateData.description,
        updateData.severity,
        updateData.dosage,
        updateData.frequency,
        recordId,
      ]
      await client.query(query, values)
    } catch (error) {
      console.error("Error updating medical record:", error)
      throw error
    }
  },
}

// User profile services
export const userService = {
  // Create or update user profile
  async updateUserProfile(firebaseUid, profileData) {
    try {
      const query = `
        INSERT INTO users (firebase_uid, email, first_name, last_name, phone, date_of_birth, gender, address, city, postal_code, emergency_contact_name, emergency_contact_phone)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        ON CONFLICT (firebase_uid) 
        DO UPDATE SET 
          email = EXCLUDED.email,
          first_name = EXCLUDED.first_name,
          last_name = EXCLUDED.last_name,
          phone = EXCLUDED.phone,
          date_of_birth = EXCLUDED.date_of_birth,
          gender = EXCLUDED.gender,
          address = EXCLUDED.address,
          city = EXCLUDED.city,
          postal_code = EXCLUDED.postal_code,
          emergency_contact_name = EXCLUDED.emergency_contact_name,
          emergency_contact_phone = EXCLUDED.emergency_contact_phone,
          updated_at = CURRENT_TIMESTAMP
        RETURNING id
      `
      const values = [
        firebaseUid,
        profileData.email,
        profileData.firstName || "",
        profileData.lastName || "",
        profileData.phone || "",
        profileData.dateOfBirth || null,
        profileData.gender || "",
        profileData.address || "",
        profileData.city || "",
        profileData.postalCode || "",
        profileData.emergencyContactName || "",
        profileData.emergencyContactPhone || "",
      ]
      const result = await client.query(query, values)
      return result.rows[0].id
    } catch (error) {
      console.error("Error updating user profile:", error)
      throw error
    }
  },

  // Get user profile by Firebase UID
  async getUserProfile(firebaseUid) {
    try {
      const query = `
        SELECT * FROM users WHERE firebase_uid = $1
      `
      const result = await client.query(query, [firebaseUid])
      return result.rows[0] || null
    } catch (error) {
      console.error("Error fetching user profile:", error)
      throw error
    }
  },

  // Get user ID by Firebase UID
  async getUserId(firebaseUid) {
    try {
      const query = `
        SELECT id FROM users WHERE firebase_uid = $1
      `
      const result = await client.query(query, [firebaseUid])
      return result.rows[0]?.id || null
    } catch (error) {
      console.error("Error fetching user ID:", error)
      throw error
    }
  },
}

// Specialty services
export const specialtyService = {
  // Get all specialties
  async getAllSpecialties() {
    try {
      const query = `
        SELECT * FROM specialties ORDER BY name
      `
      const result = await client.query(query)
      return result.rows
    } catch (error) {
      console.error("Error fetching specialties:", error)
      throw error
    }
  },
}
