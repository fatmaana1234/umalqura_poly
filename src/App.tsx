/**
 * Um Alqura Polyclinic 2026 - Barka, Sultanate of Oman
 * Complete Integrated Physiotherapy & Rehabilitation System
 */

import React, { useState, useEffect } from 'react';
import {
  INITIAL_PATIENTS,
  INITIAL_STAFF,
  INITIAL_BEDS,
  INITIAL_DEVICES,
  INITIAL_APPOINTMENTS,
  INITIAL_PACKAGES,
  INITIAL_SOAP_NOTES
} from './data/clinicData';
import { UserRole, Appointment, SOAPNote, PackageCourse, Patient } from './types/clinic';
import { Header } from './components/Header';
import { Sidebar, ActiveNavTab } from './components/Sidebar';
import { ResourceConflictManager } from './components/ResourceConflictManager';
import { VoiceScribeModal } from './components/VoiceScribeModal';
import { CalculatorsModal } from './components/CalculatorsModal';
import { OmaniVoiceBotModal } from './components/OmaniVoiceBotModal';
import { PredictiveAnalyticsModal } from './components/PredictiveAnalyticsModal';
import { DischargeReportModal } from './components/DischargeReportModal';
import { CodebaseExportModal } from './components/CodebaseExportModal';
import { ElderlyUIMode } from './components/ElderlyUIMode';

// Views
import { DashboardHome } from './views/DashboardHome';
import { AppointmentsScheduleView } from './views/AppointmentsScheduleView';
import { SOAPNotesView } from './views/SOAPNotesView';
import { PackagesView } from './views/PackagesView';
import { ExerciseLibraryView } from './views/ExerciseLibraryView';
import { BillingInsuranceView } from './views/BillingInsuranceView';
import { ClinicEquipmentGallery } from './views/ClinicEquipmentGallery';
import { PatientsDirectoryView } from './views/PatientsDirectoryView';
import { SpecializedClinicsHub } from './views/SpecializedClinicsHub';
import { AIHubView } from './views/AIHubView';
import { BodyMap } from './components/BodyMap';
import { CameraMotionAnalysis } from './components/CameraMotionAnalysis';
import { ExerciseRepCounter } from './components/ExerciseRepCounter';

const loadStorage = <T,>(key: string, defaultVal: T): T => {
  try {
    const saved = localStorage.getItem(key);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.warn(`Could not load ${key} from localStorage`, e);
  }
  return defaultVal;
};

export default function App() {
  const [currentRole, setCurrentRole] = useState<UserRole>('physiotherapist');
  const [activeTab, setActiveTab] = useState<ActiveNavTab>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isElderlyMode, setIsElderlyMode] = useState(false);

  // App Data State (persisted to localStorage so clinic staff can register and use)
  const [patients, setPatients] = useState<Patient[]>(() =>
    loadStorage<Patient[]>('um_alqura_patients', INITIAL_PATIENTS)
  );
  const [staff] = useState(INITIAL_STAFF);
  const [beds] = useState(INITIAL_BEDS);
  const [devices] = useState(INITIAL_DEVICES);
  const [appointments, setAppointments] = useState<Appointment[]>(() =>
    loadStorage<Appointment[]>('um_alqura_appointments', INITIAL_APPOINTMENTS)
  );
  const [packages, setPackages] = useState<PackageCourse[]>(() =>
    loadStorage<PackageCourse[]>('um_alqura_packages', INITIAL_PACKAGES)
  );
  const [soapNotes, setSoapNotes] = useState<SOAPNote[]>(() =>
    loadStorage<SOAPNote[]>('um_alqura_soap', INITIAL_SOAP_NOTES)
  );

  // Persist whenever state changes
  useEffect(() => {
    try {
      localStorage.setItem('um_alqura_patients', JSON.stringify(patients));
    } catch (e) {
      console.warn(e);
    }
  }, [patients]);

  useEffect(() => {
    try {
      localStorage.setItem('um_alqura_appointments', JSON.stringify(appointments));
    } catch (e) {
      console.warn(e);
    }
  }, [appointments]);

  useEffect(() => {
    try {
      localStorage.setItem('um_alqura_packages', JSON.stringify(packages));
    } catch (e) {
      console.warn(e);
    }
  }, [packages]);

  useEffect(() => {
    try {
      localStorage.setItem('um_alqura_soap', JSON.stringify(soapNotes));
    } catch (e) {
      console.warn(e);
    }
  }, [soapNotes]);

  // Modals state
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isScribeOpen, setIsScribeOpen] = useState(false);
  const [isCalculatorsOpen, setIsCalculatorsOpen] = useState(false);
  const [isVoiceBotOpen, setIsVoiceBotOpen] = useState(false);
  const [isPredictiveOpen, setIsPredictiveOpen] = useState(false);
  const [isDischargeOpen, setIsDischargeOpen] = useState(false);
  const [isExportCenterOpen, setIsExportCenterOpen] = useState(false);
  const [selectedDischargePatient, setSelectedDischargePatient] = useState<Patient | null>(
    patients[0] || null
  );

  // Handlers
  const handleAddNewPatient = (newPat: Patient) => {
    setPatients((prev) => [newPat, ...prev]);
    if (!selectedDischargePatient) {
      setSelectedDischargePatient(newPat);
    }
  };

  const handleConfirmBooking = (newApt: Appointment) => {
    setAppointments((prev) => [newApt, ...prev]);
  };

  const handleSaveSOAP = (newNote: SOAPNote) => {
    setSoapNotes((prev) => [newNote, ...prev.filter((n) => n.id !== newNote.id)]);
  };

  const handleDeductPackageSession = (pkgId: string) => {
    setPackages((prev) =>
      prev.map((pkg) => {
        if (pkg.id === pkgId && pkg.completedSessions < pkg.totalSessions) {
          const nextCompleted = pkg.completedSessions + 1;
          return {
            ...pkg,
            completedSessions: nextCompleted,
            status: nextCompleted >= pkg.totalSessions ? 'completed' : 'active'
          };
        }
        return pkg;
      })
    );
  };

  const handleAddPackage = (newPkg: PackageCourse) => {
    setPackages((prev) => [newPkg, ...prev]);
  };

  const handleOpenDischarge = (pat: Patient) => {
    setSelectedDischargePatient(pat);
    setIsDischargeOpen(true);
  };

  // If Elderly Mode is activated, show the high contrast simple screen
  if (isElderlyMode) {
    return <ElderlyUIMode onBack={() => setIsElderlyMode(false)} />;
  }

  return (
    <div className="min-h-screen bg-[#FAF8F1] text-[#24383B] flex flex-col font-['Cairo',sans-serif]">
      {/* Top Main Header */}
      <Header
        currentRole={currentRole}
        onRoleChange={setCurrentRole}
        onOpenElderlyUI={() => setIsElderlyMode(true)}
        onOpenExportCenter={() => setIsExportCenterOpen(true)}
        onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      />

      {/* Main Workspace with Sidebar & Content */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Navigation Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          isMobileOpen={isMobileMenuOpen}
          onCloseMobile={() => setIsMobileMenuOpen(false)}
        />

        {/* Viewport Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-full overflow-hidden">
          {/* Main Dashboard View */}
          {activeTab === 'dashboard' && (
            <DashboardHome
              appointments={appointments}
              patients={patients}
              devices={devices}
              staff={staff}
              onOpenBookingModal={() => setIsBookingModalOpen(true)}
              onOpenVoiceScribe={() => setIsScribeOpen(true)}
              onOpenMotionAnalysis={() => setActiveTab('ai_motion_camera')}
              onOpenVoiceBot={() => setIsVoiceBotOpen(true)}
              onOpenCalculators={() => setIsCalculatorsOpen(true)}
              onSelectTab={setActiveTab}
            />
          )}

          {/* Module 1: 5-Dimensional Appointments */}
          {activeTab === 'appointments' && (
            <AppointmentsScheduleView
              appointments={appointments}
              patients={patients}
              staff={staff}
              beds={beds}
              devices={devices}
              onOpenBookingModal={() => setIsBookingModalOpen(true)}
              onOpenVoiceBot={() => setIsVoiceBotOpen(true)}
            />
          )}

          {/* Module 2, 3 & 7: SOAP Notes, Body Map & Progress Chart */}
          {activeTab === 'soap_notes' && (
            <SOAPNotesView
              soapNotes={soapNotes}
              patients={patients}
              onSaveNote={handleSaveSOAP}
              onOpenVoiceScribe={() => setIsScribeOpen(true)}
              onOpenDischargeReport={handleOpenDischarge}
            />
          )}

          {/* Standalone Body Map View */}
          {activeTab === 'body_map' && (
            <div className="space-y-4">
              <BodyMap
                painPoints={soapNotes[0]?.painPoints || []}
                onChange={(pts) => {
                  if (soapNotes.length > 0) {
                    const updated = { ...soapNotes[0], painPoints: pts };
                    handleSaveSOAP(updated);
                  }
                }}
              />
            </div>
          )}

          {/* Module 4: Clinical Calculators View */}
          {activeTab === 'calculators' && (
            <div className="space-y-4">
              <div className="bg-white p-5 rounded-3xl border border-[#075563]/15 shadow-xs flex items-center justify-between">
                <div>
                  <h2 className="font-bold text-lg text-[#075563]">
                    الحواسب الطبية الإكلينيكية (DASH, Oswestry ODI, Berg Balance)
                  </h2>
                  <p className="text-xs text-gray-500 mt-1">
                    حساب نسب العجز والتحسن الأوتوماتيكي المعترف بها دولياً في العلاج الطبيعي
                  </p>
                </div>
                <button
                  onClick={() => setIsCalculatorsOpen(true)}
                  className="px-4 py-2 bg-[#075563] text-white text-xs font-bold rounded-xl"
                >
                  فتح الحاسبة في نافذة منبثقة
                </button>
              </div>
              <CalculatorsModal
                isOpen={true}
                onClose={() => setActiveTab('dashboard')}
                onApplyScore={(tool, score, cat) => {
                  alert(`تم تسجيل نتيجة ${tool}: ${score} (${cat}) بنجاح.`);
                }}
              />
            </div>
          )}

          {/* Module 5: Packages & Courses */}
          {activeTab === 'packages' && (
            <PackagesView
              packages={packages}
              patients={patients}
              onDeductSession={handleDeductPackageSession}
              onAddPackage={handleAddPackage}
            />
          )}

          {/* Module 6: Home Exercise Library */}
          {activeTab === 'exercise_library' && (
            <ExerciseLibraryView
              patients={patients}
              onLaunchRepCounter={() => {
                setActiveTab('ai_rep_counter');
              }}
            />
          )}

          {/* Module 7: Progress Charts */}
          {activeTab === 'progress_charts' && (
            <SOAPNotesView
              soapNotes={soapNotes}
              patients={patients}
              onSaveNote={handleSaveSOAP}
              onOpenVoiceScribe={() => setIsScribeOpen(true)}
              onOpenDischargeReport={handleOpenDischarge}
            />
          )}

          {/* Module 8: Insurance & Billing */}
          {activeTab === 'insurance_billing' && (
            <BillingInsuranceView patients={patients} />
          )}

          {/* Module 9: WhatsApp Notifications */}
          {activeTab === 'whatsapp_notifications' && (
            <ExerciseLibraryView patients={patients} />
          )}

          {/* Module 10: Discharge Report Generator */}
          {activeTab === 'discharge_report' && (
            <div className="space-y-4">
              <div className="bg-white p-5 rounded-3xl border border-[#075563]/15 shadow-xs flex items-center justify-between">
                <div>
                  <h2 className="font-bold text-lg text-[#075563]">
                    تقرير التخرج الطبي النهائي (Medical Discharge Report)
                  </h2>
                  <p className="text-xs text-gray-500 mt-1">
                    توليد تقرير رسمي يجمع كافة القياسات والخرائط ورسوم التحسن بضغطة زر واحدة
                  </p>
                </div>
                {patients.length > 0 && (
                  <button
                    onClick={() => handleOpenDischarge(patients[0])}
                    className="px-4 py-2 bg-[#075563] text-white text-xs font-bold rounded-xl"
                  >
                    استعراض التقرير المطبوع
                  </button>
                )}
              </div>
              <DischargeReportModal
                isOpen={true}
                onClose={() => setActiveTab('dashboard')}
                patient={selectedDischargePatient}
                soapNotes={soapNotes}
              />
            </div>
          )}

          {/* Phase 2: AI Hub & Modules 11-15 */}
          {(activeTab === 'ai_scribe' ||
            activeTab === 'ai_motion_camera' ||
            activeTab === 'ai_rep_counter' ||
            activeTab === 'ai_voice_bot' ||
            activeTab === 'ai_predictive') && (
            <AIHubView
              onOpenVoiceScribe={() => setIsScribeOpen(true)}
              onOpenVoiceBot={() => setIsVoiceBotOpen(true)}
              onOpenPredictiveAnalytics={() => setIsPredictiveOpen(true)}
            />
          )}

          {/* Phase 3: Specialized Clinics (16-23) */}
          {(activeTab.startsWith('clinic_')) && (
            <SpecializedClinicsHub
              initialActiveClinic={activeTab}
              onOpenElderlyUI={() => setIsElderlyMode(true)}
            />
          )}

          {/* Real Equipment Gallery */}
          {activeTab === 'equipment_gallery' && <ClinicEquipmentGallery />}

          {/* Patients Directory */}
          {activeTab === 'patients_directory' && (
            <PatientsDirectoryView
              patients={patients}
              packages={packages}
              onOpenDischargeReport={handleOpenDischarge}
              onAddNewPatient={handleAddNewPatient}
            />
          )}
        </main>
      </div>

      {/* Global Interactive Modals */}
      <ResourceConflictManager
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        onConfirmBooking={handleConfirmBooking}
        onRegisterNewPatient={handleAddNewPatient}
        existingAppointments={appointments}
        patients={patients}
        staff={staff}
        beds={beds}
        devices={devices}
      />

      <VoiceScribeModal
        isOpen={isScribeOpen}
        onClose={() => setIsScribeOpen(false)}
        onApplyDraft={(draft) => {
          if (draft.subjective) {
            alert('تم اعتماد مسودة SOAP الموثقة بالصوت بنجاح.');
          }
        }}
        patientName={patients[0]?.name || 'المراجع'}
      />

      <CalculatorsModal
        isOpen={isCalculatorsOpen}
        onClose={() => setIsCalculatorsOpen(false)}
      />

      <OmaniVoiceBotModal
        isOpen={isVoiceBotOpen}
        onClose={() => setIsVoiceBotOpen(false)}
      />

      <PredictiveAnalyticsModal
        isOpen={isPredictiveOpen}
        onClose={() => setIsPredictiveOpen(false)}
      />

      <DischargeReportModal
        isOpen={isDischargeOpen}
        onClose={() => setIsDischargeOpen(false)}
        patient={selectedDischargePatient}
        soapNotes={soapNotes}
      />

      <CodebaseExportModal
        isOpen={isExportCenterOpen}
        onClose={() => setIsExportCenterOpen(false)}
      />
    </div>
  );
}
