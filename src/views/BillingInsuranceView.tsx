import React, { useState } from 'react';
import { InsuranceClaim, Patient } from '../types/clinic';
import { INITIAL_INSURANCE_CLAIMS, CLINIC_INFO } from '../data/clinicData';
import { InsuranceClaimModal } from '../components/InsuranceClaimModal';
import {
  ShieldAlert,
  Plus,
  DollarSign,
  FileCheck,
  CheckCircle2,
  Clock,
  Printer,
  FileText
} from 'lucide-react';

interface BillingInsuranceViewProps {
  patients: Patient[];
}

export const BillingInsuranceView: React.FC<BillingInsuranceViewProps> = ({ patients }) => {
  const [claims, setClaims] = useState<InsuranceClaim[]>(INITIAL_INSURANCE_CLAIMS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient>(patients[0]);

  const totalGrossRevenue = claims.reduce((acc, c) => acc + c.totalGrossOMR, 0);
  const totalInsurancePayable = claims.reduce((acc, c) => acc + c.insurancePayableOMR, 0);
  const totalPatientCopay = claims.reduce((acc, c) => acc + c.copayAmountOMR, 0);

  const handleSaveClaim = (newClaim: InsuranceClaim) => {
    setClaims([newClaim, ...claims]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-3xl border border-[#075563]/15 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-[#075563]/10 text-[#075563]">
              <ShieldAlert className="w-5 h-5" />
            </span>
            <h2 className="font-bold text-lg sm:text-xl text-[#075563]">
              نظام الفوترة والتأمين الصحي بسلطنة عُمان (Oman Insurance & Billing)
            </h2>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            إدارة مطالبات شركات التأمين المعتمدة (Daman, MedNet, NextCare) وتسعيرة العلاج الطبيعي والتأهيل
          </p>
        </div>

        <button
          onClick={() => {
            setSelectedPatient(patients[0]);
            setIsModalOpen(true);
          }}
          className="px-4 py-2.5 bg-[#075563] hover:bg-[#075563]/90 text-white text-xs sm:text-sm font-bold rounded-xl transition shadow-md flex items-center gap-2"
        >
          <Plus className="w-4 h-4 text-[#B59B62]" />
          إنشاء مطالبة تأمين جديدة (New Claim)
        </button>
      </div>

      {/* Financial Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200 shadow-xs space-y-1">
          <span className="text-xs text-gray-500 font-bold">إجمالي المطالبات الصادرة</span>
          <div className="text-3xl font-black text-[#075563] font-mono">
            {totalGrossRevenue.toFixed(1)} <span className="text-xs font-sans font-bold">ر.ع</span>
          </div>
          <div className="text-[11px] text-gray-400">إجراءات تأهيلية معتمدة CPT</div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200 shadow-xs space-y-1">
          <span className="text-xs text-gray-500 font-bold">مستحقات شركات التأمين</span>
          <div className="text-3xl font-black text-[#2A9DA5] font-mono">
            {totalInsurancePayable.toFixed(1)} <span className="text-xs font-sans font-bold">ر.ع</span>
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold">بانتظار التحصيل البنكي</div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200 shadow-xs space-y-1">
          <span className="text-xs text-gray-500 font-bold">متحصلات نسبة تحمل المراجعين (Co-pay)</span>
          <div className="text-3xl font-black text-[#B59B62] font-mono">
            {totalPatientCopay.toFixed(1)} <span className="text-xs font-sans font-bold">ر.ع</span>
          </div>
          <div className="text-[11px] text-gray-400">سددت نقداً / ببطاقة بنكية بالاستقبال</div>
        </div>
      </div>

      {/* Official Tariff Table */}
      <div className="bg-[#FAF8F1] p-4 rounded-2xl border border-[#B59B62]/30 space-y-2 text-xs">
        <h4 className="font-bold text-sm text-[#075563]">لائحة أسعار مجمع أم القرى الطبي الرسمية (بركاء):</h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3 bg-white rounded-xl border border-gray-200">
            <span className="text-gray-500 block">كشف واستشارة أولية:</span>
            <strong className="text-base text-[#075563] font-mono">{CLINIC_INFO.pricing.consultationOMR} ر.ع</strong>
          </div>
          <div className="p-3 bg-white rounded-xl border border-gray-200">
            <span className="text-gray-500 block">جلسة علاج طبيعي وتأهيل مفردة:</span>
            <strong className="text-base text-[#075563] font-mono">{CLINIC_INFO.pricing.singleSessionOMR} ر.ع</strong>
          </div>
          <div className="p-3 bg-white rounded-xl border border-gray-200">
            <span className="text-gray-500 block">باقة 5 جلسات فأكثر:</span>
            <strong className="text-base text-emerald-700 font-mono">خصم 10% (67.5 ر.ع لـ 5 جلسات)</strong>
          </div>
        </div>
      </div>

      {/* Claims Records Table */}
      <div className="bg-white rounded-3xl border border-[#075563]/15 overflow-hidden shadow-xs">
        <div className="p-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between text-xs font-bold text-gray-600">
          <span>سجل المطالبات التأهيلية ({claims.length}):</span>
          <span className="text-gray-400 font-mono">ICD-10 & CPT Billing Compliance</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-right border-collapse">
            <thead className="bg-[#FAF8F1] text-gray-700 border-b border-gray-200">
              <tr>
                <th className="p-3 font-bold">رقم المطالبة</th>
                <th className="p-3 font-bold">المراجع والرقم المدني</th>
                <th className="p-3 font-bold">شركة التأمين</th>
                <th className="p-3 font-bold">رمز الموافقة</th>
                <th className="p-3 font-bold">التاريخ</th>
                <th className="p-3 font-bold text-center">الإجمالي</th>
                <th className="p-3 font-bold text-center">التحمل</th>
                <th className="p-3 font-bold text-center">المستحق</th>
                <th className="p-3 font-bold text-center">الحالة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {claims.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-gray-400">
                    <FileCheck className="w-8 h-8 mx-auto text-gray-300 mb-2" />
                    <p className="text-xs text-gray-600 font-medium">
                      لا توجد مطالبات تأمين مسجلة حالياً • المجمع جديد وجاهز لرفع المطالبات لشركات التأمين الصحي
                    </p>
                  </td>
                </tr>
              ) : (
                claims.map((claim) => (
                  <tr key={claim.id} className="hover:bg-gray-50 transition">
                    <td className="p-3 font-mono font-bold text-[#075563]">{claim.id}</td>
                    <td className="p-3">
                      <div className="font-bold text-gray-900">{claim.patientName}</div>
                      <div className="text-[10px] text-gray-500 font-mono">{claim.civilId}</div>
                    </td>
                    <td className="p-3 font-medium text-gray-700">{claim.insuranceName}</td>
                    <td className="p-3 font-mono text-[11px] text-blue-800 bg-blue-50 px-2 py-0.5 rounded">
                      {claim.approvalCode}
                    </td>
                    <td className="p-3 font-mono text-gray-500">{claim.serviceDate}</td>
                    <td className="p-3 font-mono font-bold text-center">{claim.totalGrossOMR} ر.ع</td>
                    <td className="p-3 font-mono text-center text-amber-700">{claim.copayAmountOMR} ر.ع</td>
                    <td className="p-3 font-mono font-bold text-center text-emerald-700">{claim.insurancePayableOMR} ر.ع</td>
                    <td className="p-3 text-center">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          claim.claimStatus === 'approved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {claim.claimStatus === 'approved' ? 'معتمدة ومقبولة' : 'مرسلة للمراجعة'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Insurance Claim Modal */}
      <InsuranceClaimModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        patient={selectedPatient}
        onSaveClaim={handleSaveClaim}
      />
    </div>
  );
};
