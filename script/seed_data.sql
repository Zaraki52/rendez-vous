-- Insert sample specialties
INSERT INTO specialties (name, description) VALUES
('Médecine Générale', 'Soins de santé primaires et consultations générales'),
('Cardiologie', 'Spécialiste du cœur et du système cardiovasculaire'),
('Dermatologie', 'Spécialiste de la peau et des troubles cutanés'),
('Pédiatrie', 'Soins médicaux pour enfants et adolescents'),
('Gynécologie', 'Santé reproductive féminine'),
('Orthopédie', 'Troubles musculo-squelettiques et blessures'),
('Ophtalmologie', 'Soins des yeux et troubles visuels'),
('Psychiatrie', 'Santé mentale et troubles psychologiques'),
('Neurologie', 'Système nerveux et troubles neurologiques'),
('Endocrinologie', 'Hormones et troubles métaboliques');

-- Insert sample doctors
INSERT INTO doctors (first_name, last_name, specialty_id, email, phone, city, consultation_fee, years_experience, rating, total_reviews, bio, languages, available_days) VALUES
('Dr. Marie', 'Dubois', 1, 'marie.dubois@email.com', '01-23-45-67-89', 'Paris', 60.00, 15, 4.8, 156, 'Médecin généraliste expérimentée avec une approche holistique des soins.', ARRAY['Français', 'Anglais'], ARRAY['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi']),
('Dr. Pierre', 'Martin', 2, 'pierre.martin@email.com', '01-34-56-78-90', 'Lyon', 120.00, 20, 4.9, 203, 'Cardiologue reconnu spécialisé dans les maladies cardiovasculaires.', ARRAY['Français'], ARRAY['Lundi', 'Mardi', 'Mercredi', 'Jeudi']),
('Dr. Sophie', 'Bernard', 3, 'sophie.bernard@email.com', '01-45-67-89-01', 'Marseille', 80.00, 12, 4.7, 89, 'Dermatologue spécialisée dans les troubles cutanés et esthétiques.', ARRAY['Français', 'Italien'], ARRAY['Mardi', 'Mercredi', 'Jeudi', 'Vendredi']),
('Dr. Jean', 'Petit', 4, 'jean.petit@email.com', '01-56-78-90-12', 'Toulouse', 70.00, 18, 4.6, 134, 'Pédiatre dévoué avec une expertise en développement infantile.', ARRAY['Français', 'Espagnol'], ARRAY['Lundi', 'Mardi', 'Mercredi', 'Vendredi']),
('Dr. Claire', 'Moreau', 5, 'claire.moreau@email.com', '01-67-89-01-23', 'Nice', 90.00, 14, 4.8, 167, 'Gynécologue spécialisée en santé reproductive et obstétrique.', ARRAY['Français', 'Anglais'], ARRAY['Lundi', 'Mercredi', 'Jeudi', 'Vendredi']);

-- Insert sample availability for doctors
INSERT INTO doctor_availability (doctor_id, day_of_week, start_time, end_time) VALUES
-- Dr. Marie Dubois (ID: 1)
(1, 1, '09:00', '17:00'), -- Monday
(1, 2, '09:00', '17:00'), -- Tuesday
(1, 3, '09:00', '17:00'), -- Wednesday
(1, 4, '09:00', '17:00'), -- Thursday
(1, 5, '09:00', '12:00'), -- Friday morning only

-- Dr. Pierre Martin (ID: 2)
(2, 1, '08:00', '16:00'), -- Monday
(2, 2, '08:00', '16:00'), -- Tuesday
(2, 3, '08:00', '16:00'), -- Wednesday
(2, 4, '08:00', '16:00'), -- Thursday

-- Dr. Sophie Bernard (ID: 3)
(3, 2, '10:00', '18:00'), -- Tuesday
(3, 3, '10:00', '18:00'), -- Wednesday
(3, 4, '10:00', '18:00'), -- Thursday
(3, 5, '10:00', '18:00'); -- Friday
