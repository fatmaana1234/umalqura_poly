/**
 * Um Alqura Polyclinic - Barka, Sultanate of Oman
 * Core Type Definitions for Physiotherapy & Rehabilitation System 2026
 */

export type UserRole = 'admin' | 'physiotherapist' | 'receptionist' | 'patient';

export type Gender = 'male' | 'female';

export interface StaffMember {
  id: string;
  name: string;
  nameEn: string;
  role: 'physiotherapist' | 'assistant' | 'receptionist' | 'admin';
  gender: Gender;
  specialty: string;
  title: string;
  avatar: string;
  culturalDress: string;
  phone: string;
  isAvailable: boolean;
}

export interface MedicalBed {
  id: string;
  name: string;
  room: string;
  isOccupied: boolean;
  assignedGender?: Gender;
}

export type MedicalDeviceType = 
  | 'cervical_lumbar_traction'
  | 'shockwave_btl'
  | 'electrotherapy_ultrasound_btl4000'
  | 'air_compression_boots'
  | 'medical_gym'
  | 'manual_none';

export interface MedicalDevice {
  id: string;
  name: string;
  nameEn: string;
  type: MedicalDeviceType;
  model: string;
  image: string;
  status: 'available' | 'in_use' | 'maintenance';
  safetyLimitMinutes: number;
  safetyIntensityLimit?: string;
  room: string;
}

export interface Patient {
  id: string;
  civilId: string; // Omani Civil ID (الرقم المدني العماني)
  name: string;
  age: number;
  gender: Gender;
  phone: string;
  city: string; // e.g. Barka (بركاء), Al Musanaah, As Seeb
  assignedPhysioId: string;
  diagnosis: string;
  clinicType: SpecializedClinicType;
  registrationDate: string;
  insuranceProvider?: string; // Daman, MedNet, NextCare, Cash
  insurancePolicyNumber?: string;
  activePackageId?: string;
  totalSessionsCompleted: number;
  baselinePainVAS: number;
  currentPainVAS: number;
  photoUrl?: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  patientGender: Gender;
  physioId: string;
  physioName: string;
  bedId: string;
  deviceId: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  durationMinutes: number;
  status: 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'waitlisted';
  procedureName: string;
  notes?: string;
}

export interface PainPoint {
  id: string;
  bodyRegion: 'cervical' | 'thoracic' | 'lumbar' | 'shoulder_r' | 'shoulder_l' | 'elbow_r' | 'elbow_l' | 'wrist_r' | 'wrist_l' | 'hip_r' | 'hip_l' | 'knee_r' | 'knee_l' | 'ankle_r' | 'ankle_l';
  view: 'anterior' | 'posterior';
  x: number; // percentage
  y: number; // percentage
  severity: 'mild' | 'moderate' | 'severe'; // 1-4, 5-7, 8-10
  score: number;
  description: string;
}

export interface SOAPNote {
  id: string;
  patientId: string;
  appointmentId: string;
  sessionNumber: number;
  date: string;
  physioId: string;
  subjective: {
    chiefComplaint: string;
    painVAS: number; // 0-10
    painCharacter: string; // Sharp, dull, burning, aching
    functionalLimitation: string;
    aggravatingFactors: string;
    relievingFactors: string;
  };
  objective: {
    activeROM: { [joint: string]: number }; // in degrees
    passiveROM: { [joint: string]: number };
    manualMuscleTesting: { [muscle: string]: string }; // 1 to 5
    palpationTenderness: string;
    specialTests: string;
    postureFindings: string;
  };
  assessment: {
    tissueResponse: string;
    recoveryProgressPercent: number;
    clinicalImpression: string;
    prognosis: string;
  };
  plan: {
    nextSessionDate: string;
    prescribedModalities: string[];
    electrotherapyParams?: {
      currentType: string;
      intensityMA: number;
      durationMinutes: number;
    };
    shockwaveParams?: {
      doseJoule: number;
      shocksCount: number;
      frequencyHz: number;
    };
    tractionParams?: {
      target: 'cervical' | 'lumbar';
      tensionKg: number;
      holdSeconds: number;
      restSeconds: number;
      durationMinutes: number;
    };
    homeExercisesPrescribed: string[];
    precautions: string;
  };
  painPoints: PainPoint[];
}

export interface PackageCourse {
  id: string;
  patientId: string;
  packageName: string;
  clinicType: SpecializedClinicType;
  totalSessions: number;
  completedSessions: number;
  pricePerSession: number; // Standard 15 OMR
  discountPercent: number; // 10% for 5+
  totalPrice: number;
  amountPaid: number;
  status: 'active' | 'completed' | 'expired';
  startDate: string;
  expiryDate: string;
}

export interface HomeExercise {
  id: string;
  title: string;
  titleEn: string;
  category: string;
  targetRegion: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  reps: number;
  sets: number;
  holdSeconds: number;
  frequency: string;
  instructions: string;
  safetyCautions: string;
  videoPlaceholderUrl?: string;
  thumbnailUrl: string;
  modestGuidelines: string;
}

export type SpecializedClinicType = 
  | 'spine_care'
  | 'knee_osteoarthritis'
  | 'shoulder_upper_limb'
  | 'sports_return_to_play'
  | 'post_surgical'
  | 'geriatric'
  | 'neurological'
  | 'medical_fitness';

export interface InsuranceClaim {
  id: string;
  patientId: string;
  patientName: string;
  civilId: string;
  insuranceName: string; // Daman, MedNet, NextCare, etc.
  policyNumber: string;
  approvalCode: string;
  diagnosisICD10: string;
  diagnosisDesc: string;
  serviceDate: string;
  procedures: {
    code: string;
    name: string;
    units: number;
    feeOMR: number;
  }[];
  totalGrossOMR: number;
  copayPercent: number;
  copayAmountOMR: number;
  insurancePayableOMR: number;
  claimStatus: 'draft' | 'submitted' | 'approved' | 'settled';
}
