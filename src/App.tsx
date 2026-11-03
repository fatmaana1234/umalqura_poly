/**
 * Um Alqura Polyclinic & Manufacturing ERP System 2026
 * Barka, Sultanate of Oman
 * Complete Integrated Enterprise ERP & Physiotherapy System
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
import {
  INITIAL_WAREHOUSES,
  INITIAL_INVENTORY_ITEMS,
  INITIAL_BOMS,
  INITIAL_PRODUCTION_ORDERS,
  INITIAL_SUPPLIERS,
  INITIAL_PURCHASE_ORDERS,
  INITIAL_SALES_INVOICES,
  INITIAL_GL_TRANSACTIONS,
  INITIAL_EMPLOYEES,
  INITIAL_BIOMETRIC_TERMINALS,
  INITIAL_BIOMETRIC_LOGS,
  INITIAL_WORKFLOW_RULES,
  INITIAL_INTEGRATIONS
} from './data/erpData';
import { UserRole, Appointment, SOAPNote, PackageCourse, Patient } from './types/clinic';
import {
  Warehouse,
  InventoryItem,
  StockMovement,
  BillOfMaterials,
  ProductionOrder,
  Supplier,
  PurchaseOrder,
  SalesInvoice,
  GLTransaction,
  Employee,
  BiometricTerminal,
  BiometricLog,
  WorkflowRule,
  ExternalIntegration
} from './types/erp';

import { Header } from './components/Header';
import { Sidebar, ActiveNavTab } from './components/Sidebar';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ResourceConflictManager } from './components/ResourceConflictManager';
import { VoiceScribeModal } from './components/VoiceScribeModal';
import { CalculatorsModal } from './components/CalculatorsModal';
import { OmaniVoiceBotModal } from './components/OmaniVoiceBotModal';
import { PredictiveAnalyticsModal } from './components/PredictiveAnalyticsModal';
import { DischargeReportModal } from './components/DischargeReportModal';
import { CodebaseExportModal } from './components/CodebaseExportModal';
import { ElderlyUIMode } from './components/ElderlyUIMode';
import { VoiceAssistantModal } from './components/VoiceAssistantModal';
import { AiManagementAssistantModal } from './components/AiManagementAssistantModal';

// Clinic Views
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

// Enterprise ERP Views
import { ExecutiveDashboardView } from './views/erp/ExecutiveDashboardView';
import { WarehousesView } from './views/erp/WarehousesView';
import { ManufacturingView } from './views/erp/ManufacturingView';
import { SalesPurchasingView } from './views/erp/SalesPurchasingView';
import { FinanceAccountingView } from './views/erp/FinanceAccountingView';
import { HumanResourcesView } from './views/erp/HumanResourcesView';
import { BiometricIntegrationView } from './views/erp/BiometricIntegrationView';
import { ApiIntegrationManagerView } from './views/erp/ApiIntegrationManagerView';
import { WorkflowEngineView } from './views/erp/WorkflowEngineView';

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
  const [activeTab, setActiveTab] = useState<ActiveNavTab>(() =>
    loadStorage<ActiveNavTab>('um_alqura_tab', 'erp_dashboard')
  );
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isElderlyMode, setIsElderlyMode] = useState(false);

  // Clinic State
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

  // Enterprise ERP State
  const [warehouses, setWarehouses] = useState<Warehouse[]>(() =>
    loadStorage<Warehouse[]>('um_alqura_erp_warehouses', INITIAL_WAREHOUSES)
  );
  const [inventory, setInventory] = useState<InventoryItem[]>(() =>
    loadStorage<InventoryItem[]>('um_alqura_erp_inventory', INITIAL_INVENTORY_ITEMS)
  );
  const [movements, setMovements] = useState<StockMovement[]>(() =>
    loadStorage<StockMovement[]>('um_alqura_erp_movements', [])
  );
  const [boms, setBOMs] = useState<BillOfMaterials[]>(() =>
    loadStorage<BillOfMaterials[]>('um_alqura_erp_boms', INITIAL_BOMS)
  );
  const [productionOrders, setProductionOrders] = useState<ProductionOrder[]>(() =>
    loadStorage<ProductionOrder[]>('um_alqura_erp_orders', INITIAL_PRODUCTION_ORDERS)
  );
  const [suppliers, setSuppliers] = useState<Supplier[]>(() =>
    loadStorage<Supplier[]>('um_alqura_erp_suppliers', INITIAL_SUPPLIERS)
  );
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(() =>
    loadStorage<PurchaseOrder[]>('um_alqura_erp_pos', INITIAL_PURCHASE_ORDERS)
  );
  const [salesInvoices, setSalesInvoices] = useState<SalesInvoice[]>(() =>
    loadStorage<SalesInvoice[]>('um_alqura_erp_invoices', INITIAL_SALES_INVOICES)
  );
  const [glTransactions, setGlTransactions] = useState<GLTransaction[]>(() =>
    loadStorage<GLTransaction[]>('um_alqura_erp_gl', INITIAL_GL_TRANSACTIONS)
  );
  const [employees, setEmployees] = useState<Employee[]>(() =>
    loadStorage<Employee[]>('um_alqura_erp_employees', INITIAL_EMPLOYEES)
  );
  const [terminals, setTerminals] = useState<BiometricTerminal[]>(() =>
    loadStorage<BiometricTerminal[]>('um_alqura_erp_terminals', INITIAL_BIOMETRIC_TERMINALS)
  );
  const [biometricLogs, setBiometricLogs] = useState<BiometricLog[]>(() =>
    loadStorage<BiometricLog[]>('um_alqura_erp_biologs', INITIAL_BIOMETRIC_LOGS)
  );
  const [workflowRules, setWorkflowRules] = useState<WorkflowRule[]>(() =>
    loadStorage<WorkflowRule[]>('um_alqura_erp_workflows', INITIAL_WORKFLOW_RULES)
  );
  const [integrations, setIntegrations] = useState<ExternalIntegration[]>(() =>
    loadStorage<ExternalIntegration[]>('um_alqura_erp_integrations', INITIAL_INTEGRATIONS)
  );

  // Modals state
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isScribeOpen, setIsScribeOpen] = useState(false);
  const [isCalculatorsOpen, setIsCalculatorsOpen] = useState(false);
  const [isVoiceBotOpen, setIsVoiceBotOpen] = useState(false);
  const [isPredictiveOpen, setIsPredictiveOpen] = useState(false);
  const [isDischargeOpen, setIsDischargeOpen] = useState(false);
  const [isExportCenterOpen, setIsExportCenterOpen] = useState(false);
  const [isVoiceAssistantOpen, setIsVoiceAssistantOpen] = useState(false);
  const [isAiAdvisorOpen, setIsAiAdvisorOpen] = useState(false);
  const [selectedDischargePatient, setSelectedDischargePatient] = useState<Patient | null>(
    patients[0] || null
  );

  // Persist State
  useEffect(() => {
    localStorage.setItem('um_alqura_tab', JSON.stringify(activeTab));
  }, [activeTab]);

  useEffect(() => {
    localStorage.setItem('um_alqura_patients', JSON.stringify(patients));
  }, [patients]);

  useEffect(() => {
    localStorage.setItem('um_alqura_appointments', JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    localStorage.setItem('um_alqura_packages', JSON.stringify(packages));
  }, [packages]);

  useEffect(() => {
    localStorage.setItem('um_alqura_soap', JSON.stringify(soapNotes));
  }, [soapNotes]);

  useEffect(() => {
    localStorage.setItem('um_alqura_erp_inventory', JSON.stringify(inventory));
  }, [inventory]);

  useEffect(() => {
    localStorage.setItem('um_alqura_erp_orders', JSON.stringify(productionOrders));
  }, [productionOrders]);

  useEffect(() => {
    localStorage.setItem('um_alqura_erp_invoices', JSON.stringify(salesInvoices));
  }, [salesInvoices]);

  useEffect(() => {
    localStorage.setItem('um_alqura_erp_pos', JSON.stringify(purchaseOrders));
  }, [purchaseOrders]);

  useEffect(() => {
    localStorage.setItem('um_alqura_erp_gl', JSON.stringify(glTransactions));
  }, [glTransactions]);

  useEffect(() => {
    localStorage.setItem('um_alqura_erp_employees', JSON.stringify(employees));
  }, [employees]);

  useEffect(() => {
    localStorage.setItem('um_alqura_erp_biologs', JSON.stringify(biometricLogs));
  }, [biometricLogs]);

  useEffect(() => {
    localStorage.setItem('um_alqura_erp_workflows', JSON.stringify(workflowRules));
  }, [workflowRules]);

  useEffect(() => {
    localStorage.setItem('um_alqura_erp_integrations', JSON.stringify(integrations));
  }, [integrations]);

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
    <ErrorBoundary>
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
            onOpenVoiceAssistant={() => setIsVoiceAssistantOpen(true)}
          />

          {/* Viewport Content Area */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-full overflow-hidden">
            {/* ========================================================= */}
            {/* ENTERPRISE ERP MODULES (Factory + Executive Management) */}
            {/* ========================================================= */}

            {activeTab === 'erp_dashboard' && (
              <ExecutiveDashboardView
                warehouses={warehouses}
                inventory={inventory}
                productionOrders={productionOrders}
                salesInvoices={salesInvoices}
                employees={employees}
                terminals={terminals}
                patients={patients}
                appointments={appointments}
                onNavigate={(tab) => setActiveTab(tab as ActiveNavTab)}
                onOpenVoiceAssistant={() => setIsVoiceAssistantOpen(true)}
                onOpenAiAdvisor={() => setIsAiAdvisorOpen(true)}
              />
            )}

            {activeTab === 'erp_warehouses' && (
              <WarehousesView
                warehouses={warehouses}
                inventory={inventory}
                movements={movements}
                onUpdateInventory={setInventory}
                onAddMovement={(m) => setMovements((prev) => [m, ...prev])}
              />
            )}

            {activeTab === 'erp_manufacturing' && (
              <ManufacturingView
                boms={boms}
                productionOrders={productionOrders}
                inventory={inventory}
                onUpdateProductionOrders={setProductionOrders}
                onUpdateInventory={setInventory}
                onAddStockMovements={(newM) => setMovements((prev) => [...newM, ...prev])}
                onAddJournalEntries={(newJ) => setGlTransactions((prev) => [...newJ, ...prev])}
              />
            )}

            {activeTab === 'erp_sales_purchases' && (
              <SalesPurchasingView
                suppliers={suppliers}
                purchaseOrders={purchaseOrders}
                salesInvoices={salesInvoices}
                inventory={inventory}
                onAddPurchaseOrder={(po) => setPurchaseOrders((prev) => [po, ...prev])}
                onAddSalesInvoice={(inv) => setSalesInvoices((prev) => [inv, ...prev])}
              />
            )}

            {activeTab === 'erp_finance' && (
              <FinanceAccountingView
                transactions={glTransactions}
                salesInvoices={salesInvoices}
                purchaseOrders={purchaseOrders}
                appointments={appointments}
                patients={patients}
                onAddTransaction={(tx) => setGlTransactions((prev) => [tx, ...prev])}
              />
            )}

            {activeTab === 'erp_hr' && (
              <HumanResourcesView
                employees={employees}
                biometricLogs={biometricLogs}
                onAddEmployee={(emp) => setEmployees((prev) => [emp, ...prev])}
                onOpenBiometrics={() => setActiveTab('erp_biometrics')}
              />
            )}

            {activeTab === 'erp_biometrics' && (
              <BiometricIntegrationView
                terminals={terminals}
                logs={biometricLogs}
                employees={employees}
                onAddLog={(l) => setBiometricLogs((prev) => [l, ...prev])}
                onUpdateTerminals={setTerminals}
              />
            )}

            {activeTab === 'erp_api_hub' && (
              <ApiIntegrationManagerView
                integrations={integrations}
                onUpdateIntegrations={setIntegrations}
              />
            )}

            {activeTab === 'erp_automation' && (
              <WorkflowEngineView
                rules={workflowRules}
                onUpdateRules={setWorkflowRules}
              />
            )}

            {/* ========================================================= */}
            {/* CLINIC MODULES (1-23) - Um Alqura Polyclinic */}
            {/* ========================================================= */}

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
            {activeTab.startsWith('clinic_') && (
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

        {/* Real Web Speech Voice Assistant Modal */}
        <VoiceAssistantModal
          isOpen={isVoiceAssistantOpen}
          onClose={() => setIsVoiceAssistantOpen(false)}
          warehouses={warehouses}
          inventory={inventory}
          productionOrders={productionOrders}
          salesInvoices={salesInvoices}
          terminals={terminals}
          appointments={appointments}
          patients={patients}
          onNavigateTab={(tab) => {
            setActiveTab(tab as ActiveNavTab);
            setIsVoiceAssistantOpen(false);
          }}
        />

        {/* AI Management Executive Advisor */}
        <AiManagementAssistantModal
          isOpen={isAiAdvisorOpen}
          onClose={() => setIsAiAdvisorOpen(false)}
          warehouses={warehouses}
          inventory={inventory}
          productionOrders={productionOrders}
          salesInvoices={salesInvoices}
          appointments={appointments}
          patients={patients}
        />
      </div>
    </ErrorBoundary>
  );
}
