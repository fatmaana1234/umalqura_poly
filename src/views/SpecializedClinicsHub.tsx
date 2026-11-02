import React, { useState } from 'react';
import {
  SpineRadarMap,
  JointLoadingCalculator,
  FrozenShoulderDashboard,
  ReturnToPlayGatekeeper,
  SurgicalRedFlagsSystem,
  NeuroSpasticityTracker,
  MedicalFitnessCalculator
} from '../components/SpecializedClinicTools';
import {
  Layers,
  Scale,
  Crosshair,
  Lock,
  ShieldAlert,
  Activity,
  HeartPulse,
  Flame,
  CheckCircle2,
  Info
} from 'lucide-react';

interface SpecializedClinicsHubProps {
  initialActiveClinic?: string;
  onOpenElderlyUI?: () => void;
}

export const SpecializedClinicsHub: React.FC<SpecializedClinicsHubProps> = ({
  initialActiveClinic = 'clinic_spine',
  onOpenElderlyUI
}) => {
  const [activeClinic, setActiveClinic] = useState<string>(initialActiveClinic);

  const clinics = [
    { id: 'clinic_spine', name: '16. العمود الفقري والرقبة', titleEn: 'Spine Care Clinic', icon: Layers },
    { id: 'clinic_knee', name: '17. الركبة والخشونة', titleEn: 'Knee & Osteoarthritis', icon: Scale },
    { id: 'clinic_shoulder', name: '18. الكتف والطرف العلوي', titleEn: 'Shoulder & Upper Limb', icon: Crosshair },
    { id: 'clinic_sports_rtp', name: '19. الإصابات الرياضية والـ RTP', titleEn: 'Sports & Return to Play', icon: Lock },
    { id: 'clinic_surgical', name: '20. التأهيل بعد العمليات', titleEn: 'Post-Surgical Rehab', icon: ShieldAlert },
    { id: 'clinic_geriatric', name: '21. كبار السن والتوازن', titleEn: 'Geriatric Rehab', icon: Activity },
    { id: 'clinic_neuro', name: '22. التأهيل العصبي والجلطات', titleEn: 'Neurological Rehab', icon: HeartPulse },
    { id: 'clinic_fitness', name: '23. اللياقة الطبية والوزن', titleEn: 'Medical Fitness & InBody', icon: Flame },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-3xl border border-[#075563]/15 shadow-xs">
        <h2 className="font-bold text-lg sm:text-xl text-[#075563]">
          أقسام وعيادات العلاج الطبيعي والتأهيل المتخصصة (Specialized Clinics UI)
        </h2>
        <p className="text-xs text-gray-500 mt-1">
          المرحلة الثالثة: 8 عيادات تخصصية متطورة مصممة وفق أحدث البروتوكولات الإكلينيكية لعام 2026 بمجمع أم القرى
        </p>
      </div>

      {/* Clinic Selector Navigation Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
        {clinics.map((c) => {
          const Icon = c.icon;
          const isActive = activeClinic === c.id;
          return (
            <button
              key={c.id}
              onClick={() => setActiveClinic(c.id)}
              className={`p-3 rounded-2xl border text-center transition flex flex-col items-center justify-center space-y-1 ${
                isActive
                  ? 'bg-[#075563] text-white border-[#075563] shadow-md'
                  : 'bg-white text-gray-700 border-gray-200 hover:bg-[#FAF8F1] hover:text-[#075563]'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-[#B59B62]' : 'text-gray-500'}`} />
              <span className="font-bold text-xs truncate max-w-full">{c.name}</span>
            </button>
          );
        })}
      </div>

      {/* Render Selected Specialized Clinic Component */}
      <div className="space-y-6">
        {activeClinic === 'clinic_spine' && <SpineRadarMap />}
        {activeClinic === 'clinic_knee' && <JointLoadingCalculator />}
        {activeClinic === 'clinic_shoulder' && <FrozenShoulderDashboard />}
        {activeClinic === 'clinic_sports_rtp' && <ReturnToPlayGatekeeper />}
        {activeClinic === 'clinic_surgical' && <SurgicalRedFlagsSystem />}
        {activeClinic === 'clinic_geriatric' && (
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-[#075563] to-[#2A9DA5] text-white p-6 rounded-3xl shadow-md flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-lg">قسم كبار السن والوقاية من السقوط (Geriatric Rehabilitation)</h3>
                <p className="text-xs text-[#FAF8F1]/90 max-w-xl mt-1 leading-relaxed">
                  يحتوي على مقياس بيرغ للتوازن (Berg Balance Scale) وتنبيه الخطورة الحمراء عند نزول النتيجة عن 45 نقطة، مع الواجهة الميسرة ذات الأزرار والصوت التوجيهي المباشر.
                </p>
              </div>
              {onOpenElderlyUI && (
                <button
                  onClick={onOpenElderlyUI}
                  className="px-5 py-2.5 bg-[#B59B62] text-[#075563] font-black text-xs sm:text-sm rounded-xl shadow-md hover:scale-105 transition"
                >
                  فتح واجهة كبار السن المكبرة (Elderly UI Mode)
                </button>
              )}
            </div>
          </div>
        )}
        {activeClinic === 'clinic_neuro' && <NeuroSpasticityTracker />}
        {activeClinic === 'clinic_fitness' && <MedicalFitnessCalculator />}
      </div>
    </div>
  );
};
