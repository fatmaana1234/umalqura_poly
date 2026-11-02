import React, { useState } from 'react';
import { InsuranceClaim, Patient } from '../types/clinic';
import { Shield, FileCheck, DollarSign, Download, Plus, Trash2, X, Check } from 'lucide-react';

interface InsuranceClaimModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: Patient;
  onSaveClaim?: (claim: InsuranceClaim) => void;
}

export const InsuranceClaimModal: React.FC<InsuranceClaimModalProps> = ({
  isOpen,
  onClose,
  patient,
  onSaveClaim
}) => {
  if (!isOpen) return null;

  if (!patient) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
        <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl text-center space-y-4">
          <Shield className="w-12 h-12 text-[#075563] mx-auto" />
          <h3 className="font-bold text-lg text-[#075563]">لا يوجد مراجع محدد لإنشاء المطالبة</h3>
          <p className="text-xs text-gray-500">
            يرجى تسجيل مراجع في المجمع أولاً من "سجل المراجعين" لإنشاء مطالبة تأمين صحي معتمدة له.
          </p>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-[#075563] text-white text-xs font-bold rounded-xl"
          >
            إغلاق
          </button>
        </div>
      </div>
    );
  }

  const [insuranceName, setInsuranceName] = useState(patient.insuranceProvider || 'Daman National Insurance (ضمان سلطنة عمان)');
  const [policyNumber, setPolicyNumber] = useState(patient.insurancePolicyNumber || 'DAM-984210');
  const [approvalCode, setApprovalCode] = useState('APP-' + Math.floor(10000 + Math.random() * 90000) + '-OM');
  const [diagnosisICD10, setDiagnosisICD10] = useState(patient.diagnosis ? `M50.20 - ${patient.diagnosis}` : 'M50.20 - انزلاق غضروفي عنقي');
  const [copayPercent, setCopayPercent] = useState<number>(10); // 10% or 20% in Oman

  const [procedures, setProcedures] = useState<InsuranceClaim['procedures']>([
    { code: '97012', name: 'جلسة شد فقرات محوسب (Mechanical Traction Bed)', units: 1, feeOMR: 15 },
    { code: '97014', name: 'علاج كهربائي تسكيني (Electrotherapy TENS/Interferential)', units: 1, feeOMR: 8 },
    { code: '97035', name: 'علاج بموجات فوق صوتية (Therapeutic Ultrasound BTL)', units: 1, feeOMR: 8 }
  ]);

  const totalGrossOMR = procedures.reduce((acc, p) => acc + p.units * p.feeOMR, 0);
  const copayAmountOMR = Number(((totalGrossOMR * copayPercent) / 100).toFixed(2));
  const insurancePayableOMR = Number((totalGrossOMR - copayAmountOMR).toFixed(2));

  const standardOmanCodes = [
    { code: '97012', name: 'شد فقرات بالكمبيوتر (Mechanical Traction)', fee: 15 },
    { code: '0278T', name: 'علاج بالموجات التصادمية (Shockwave Therapy BTL)', fee: 20 },
    { code: '97014', name: 'علاج كهربائي (Electrotherapy Modality)', fee: 8 },
    { code: '97035', name: 'علاج بالموجات فوق الصوتية (Ultrasound Therapy)', fee: 8 },
    { code: '97110', name: 'تمارين علاجية حركية (Therapeutic Exercises)', fee: 10 },
    { code: '97140', name: 'علاج يدوي وتحريك مفاصل (Manual Therapy)', fee: 12 },
    { code: '97016', name: 'تدليك ضغط الهواء الليمفاوي (Vasopneumatic Compression)', fee: 10 }
  ];

  const addProcedure = (codeObj: typeof standardOmanCodes[0]) => {
    setProcedures([...procedures, { code: codeObj.code, name: codeObj.name, units: 1, feeOMR: codeObj.fee }]);
  };

  const removeProcedure = (idx: number) => {
    setProcedures(procedures.filter((_, i) => i !== idx));
  };

  const handleSave = () => {
    const claim: InsuranceClaim = {
      id: 'clm-' + Date.now(),
      patientId: patient.id,
      patientName: patient.name,
      civilId: patient.civilId,
      insuranceName,
      policyNumber,
      approvalCode,
      diagnosisICD10,
      diagnosisDesc: patient.diagnosis,
      serviceDate: new Date().toISOString().split('T')[0],
      procedures,
      totalGrossOMR,
      copayPercent,
      copayAmountOMR,
      insurancePayableOMR,
      claimStatus: 'submitted'
    };

    if (onSaveClaim) onSaveClaim(claim);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl border border-gray-100 overflow-hidden my-6">
        {/* Header */}
        <div className="bg-[#075563] text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-xl">
              <Shield className="w-6 h-6 text-[#B59B62]" />
            </div>
            <div>
              <h3 className="font-bold text-lg sm:text-xl">
                نظام مطالبات التأمين الصحي العُماني (Oman Insurance Billing)
              </h3>
              <p className="text-xs text-[#FAF8F1]/80 mt-0.5">
                ترميز الإجراءات التأهيلية وفق منصة ضمان (Daman) وميدنت ونيكست كير بسلطنة عمان
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-6 max-h-[72vh] overflow-y-auto">
          {/* Patient and Policy Details */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-[#FAF8F1] p-4 rounded-xl border border-[#B59B62]/20 text-xs">
            <div>
              <span className="text-gray-500 block">المريض / الرقم المدني:</span>
              <strong className="text-[#075563] font-bold text-sm">{patient.name}</strong>
              <div className="font-mono text-gray-600">{patient.civilId}</div>
            </div>

            <div>
              <label className="text-gray-600 font-bold block mb-1">شركة التأمين:</label>
              <select
                value={insuranceName}
                onChange={(e) => setInsuranceName(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-lg p-2 font-medium"
              >
                <option value="Daman National Insurance (ضمان سلطنة عمان)">ضمان سلطنة عمان (Daman)</option>
                <option value="MedNet Oman">ميدنت عُمان (MedNet)</option>
                <option value="NextCare Oman">نكست كير (NextCare)</option>
                <option value="Oman Insurance Company (شركة عُمان للتأمين)">شركة عُمان للتأمين</option>
                <option value="Al Madina Takaful (المدينة تكافل)">المدينة تكافل</option>
              </select>
            </div>

            <div>
              <label className="text-gray-600 font-bold block mb-1">رقم بطاقة التأمين / البوليصة:</label>
              <input
                type="text"
                value={policyNumber}
                onChange={(e) => setPolicyNumber(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-lg p-2 font-mono"
              />
            </div>
          </div>

          {/* Pre-Authorization Code & Co-pay */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="font-bold text-gray-700 block mb-1">رمز الموافقة المسبقة (Approval Code):</label>
              <input
                type="text"
                value={approvalCode}
                onChange={(e) => setApprovalCode(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2 font-mono text-[#075563] font-bold"
              />
            </div>

            <div>
              <label className="font-bold text-gray-700 block mb-1">نسبة التحمل على المراجع (Co-pay %):</label>
              <select
                value={copayPercent}
                onChange={(e) => setCopayPercent(Number(e.target.value))}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2 font-bold"
              >
                <option value={0}>0% (تغطية كاملة بدون تحمل)</option>
                <option value={10}>10% نسبة تحمل المريض</option>
                <option value={15}>15% نسبة تحمل المريض</option>
                <option value={20}>20% نسبة تحمل المريض</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-gray-700 block mb-1">رمز التشخيص المعتمد (ICD-10):</label>
              <input
                type="text"
                value={diagnosisICD10}
                onChange={(e) => setDiagnosisICD10(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2"
              />
            </div>
          </div>

          {/* Procedures Table */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-bold text-xs sm:text-sm text-[#075563]">
                الإجراءات التأهيلية المحتسبة في المطالبة (CPT Procedures):
              </h4>
              <div className="dropdown relative">
                <select
                  onChange={(e) => {
                    const found = standardOmanCodes.find((c) => c.code === e.target.value);
                    if (found) addProcedure(found);
                  }}
                  defaultValue=""
                  className="text-xs bg-[#075563] text-white px-2.5 py-1.5 rounded-lg cursor-pointer"
                >
                  <option value="" disabled>+ إضافة إجراء تأهيلي معتمد</option>
                  {standardOmanCodes.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.code} - {c.name} ({c.fee} ر.ع)
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <table className="w-full text-xs text-right border-collapse border border-gray-200 rounded-xl overflow-hidden">
              <thead className="bg-[#FAF8F1] text-gray-700 border-b border-gray-200">
                <tr>
                  <th className="p-2.5 font-bold">كود الإجراء (CPT)</th>
                  <th className="p-2.5 font-bold">وصف الجلسة / التقنية</th>
                  <th className="p-2.5 font-bold text-center">الوحدات</th>
                  <th className="p-2.5 font-bold text-left">التسعيرة المعتمدة</th>
                  <th className="p-2.5 text-center">إجراء</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {procedures.map((p, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="p-2.5 font-mono font-bold text-[#075563]">{p.code}</td>
                    <td className="p-2.5 font-medium">{p.name}</td>
                    <td className="p-2.5 text-center font-mono">{p.units}</td>
                    <td className="p-2.5 text-left font-mono font-bold">{p.feeOMR} ر.ع</td>
                    <td className="p-2.5 text-center">
                      <button
                        onClick={() => removeProcedure(idx)}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Financial Calculation Breakdown */}
          <div className="bg-[#FAF8F1] p-4 rounded-xl border border-[#B59B62]/30 space-y-2 text-xs">
            <div className="flex justify-between items-center text-gray-700">
              <span>إجمالي رسوم الخدمات التأهيلية (Gross Total):</span>
              <span className="font-mono font-bold text-sm">{totalGrossOMR} ر.ع</span>
            </div>
            <div className="flex justify-between items-center text-amber-800">
              <span>تحمل المريض ({copayPercent}% Co-payment):</span>
              <span className="font-mono font-bold text-sm">{copayAmountOMR} ر.ع</span>
            </div>
            <div className="flex justify-between items-center text-[#075563] pt-2 border-t border-gray-200 font-bold text-sm">
              <span>المبلغ المستحق على شركة التأمين (Payable by Insurance):</span>
              <span className="font-mono text-base text-[#075563]">{insurancePayableOMR} ر.ع</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-bold rounded-xl transition">
            إلغاء
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2.5 bg-[#075563] hover:bg-[#075563]/90 text-white text-xs sm:text-sm font-bold rounded-xl transition shadow-md flex items-center gap-2"
          >
            <FileCheck className="w-4 h-4 text-[#B59B62]" />
            اعتماد المطالبة وإرسالها لبوابة التأمين
          </button>
        </div>
      </div>
    </div>
  );
};
