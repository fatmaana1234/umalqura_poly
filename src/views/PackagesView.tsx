import React, { useState } from 'react';
import { PackageCourse, Patient } from '../types/clinic';
import { Package, Plus, CheckCircle2, TrendingUp, DollarSign, Calendar, RefreshCw, X } from 'lucide-react';

interface PackagesViewProps {
  packages: PackageCourse[];
  patients: Patient[];
  onDeductSession: (packageId: string) => void;
  onAddPackage: (newPkg: PackageCourse) => void;
}

export const PackagesView: React.FC<PackagesViewProps> = ({
  packages,
  patients,
  onDeductSession,
  onAddPackage
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState(patients[0]?.id || '');
  const [customPatientName, setCustomPatientName] = useState('');
  const [packageName, setPackageName] = useState('باقة تأهيل العمود الفقري والمفاصل');
  const [totalSessions, setTotalSessions] = useState(10);

  // Pricing: 15 OMR per session. If sessions >= 5, 10% discount!
  const pricePerSession = 15;
  const discountPercent = totalSessions >= 5 ? 10 : 0;
  const rawTotal = totalSessions * pricePerSession;
  const finalPrice = Math.round(rawTotal * (1 - discountPercent / 100) * 10) / 10;

  const handleCreate = () => {
    const effectivePatientId = selectedPatientId || 'pat-' + Date.now();
    const newPkg: PackageCourse = {
      id: 'pkg-' + Date.now(),
      patientId: effectivePatientId,
      packageName,
      clinicType: 'spine_care',
      totalSessions,
      completedSessions: 0,
      pricePerSession,
      discountPercent,
      totalPrice: finalPrice,
      amountPaid: finalPrice,
      status: 'active',
      startDate: new Date().toISOString().split('T')[0],
      expiryDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    };

    onAddPackage(newPkg);
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-3xl border border-[#075563]/15 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-[#075563]/10 text-[#075563]">
              <Package className="w-5 h-5" />
            </span>
            <h2 className="font-bold text-lg sm:text-xl text-[#075563]">
              نظام باقات وكورسات العلاج المتكاملة (Courses & Packages System)
            </h2>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            بدلاً من المواعيد الفردية: تتبع رصيد الجلسات المنجزة والمتبقية، والخصم التلقائي مع خصم 10% للباقات 5+
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 bg-[#075563] hover:bg-[#075563]/90 text-white text-xs sm:text-sm font-bold rounded-xl transition shadow-md flex items-center gap-2"
        >
          <Plus className="w-4 h-4 text-[#B59B62]" />
          إصدار باقة تأهيلية جديدة
        </button>
      </div>

      {/* Packages Grid or Empty State */}
      {packages.length === 0 ? (
        <div className="bg-white rounded-3xl border border-[#075563]/15 p-10 sm:p-14 text-center space-y-4 shadow-xs">
          <div className="w-16 h-16 rounded-3xl bg-[#075563]/10 text-[#075563] mx-auto flex items-center justify-center">
            <Package className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-gray-900">
              لا توجد باقات أو كورسات علاجية مسجلة حالياً
            </h3>
            <p className="text-xs text-gray-500 max-w-md mx-auto leading-relaxed">
              المجمع جديد ومصمَم للعمل بنظام الباقات والكورسات التأهيلية (مثال: باقة 5 جلسات بخصم 10% بـ 67.5 ر.ع أو باقة 10 جلسات بـ 135 ر.ع). اضغط على الزر أدناه لإصدار أول باقة.
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-5 py-2.5 bg-[#075563] hover:bg-[#075563]/90 text-white text-xs sm:text-sm font-bold rounded-xl transition shadow-md inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4 text-[#B59B62]" />
            <span>إصدار باقة جديدة الآن</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {packages.map((pkg) => {
            const patient = patients.find((p) => p.id === pkg.patientId);
            const remainingSessions = pkg.totalSessions - pkg.completedSessions;
            const progressPercent = Math.round((pkg.completedSessions / pkg.totalSessions) * 100);

            return (
              <div
                key={pkg.id}
                className="bg-white rounded-3xl border border-[#075563]/15 p-5 shadow-xs hover:shadow-md transition space-y-4"
              >
                <div className="flex items-start justify-between gap-3 border-b border-gray-100 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-base text-gray-900">{pkg.packageName}</span>
                      <span className="text-[10px] font-bold bg-[#B59B62]/20 text-[#075563] px-2 py-0.5 rounded-md">
                        خصم {pkg.discountPercent}%
                      </span>
                    </div>
                    <div className="text-xs text-[#075563] font-semibold mt-1">
                      المراجع: {patient?.name || customPatientName || 'مراجع مسجل'} {patient ? `(${patient.civilId})` : ''}
                    </div>
                  </div>

                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                      pkg.status === 'active'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {pkg.status === 'active' ? 'نشطة وسارية' : 'مكتملة بالكامل'}
                  </span>
                </div>

                {/* Progress Bar & Sessions Stats */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-500 font-bold">
                      تم استهلاك {pkg.completedSessions} من {pkg.totalSessions} جلسات
                    </span>
                    <span className="font-mono font-bold text-[#075563]">{progressPercent}%</span>
                  </div>

                  <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-l from-[#075563] to-[#2A9DA5] rounded-full transition-all duration-500"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                {/* Financial Overview */}
                <div className="grid grid-cols-3 gap-2 bg-[#FAF8F1] p-3 rounded-2xl border border-[#B59B62]/20 text-center text-xs">
                  <div>
                    <span className="text-[10px] text-gray-500 block">قيمة الباقة</span>
                    <strong className="font-mono font-bold text-[#075563]">{pkg.totalPrice} ر.ع</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-500 block">الجلسات المتبقية</span>
                    <strong className="font-mono font-bold text-emerald-700">{remainingSessions} جلسة</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-500 block">حالة السداد</span>
                    <strong className="font-mono font-bold text-gray-700">مسدد بالكامل</strong>
                  </div>
                </div>

                {/* Action button to deduct session */}
                <div className="pt-2 flex items-center justify-between gap-3">
                  <div className="text-[11px] text-gray-400">
                    تاريخ البدء: {pkg.startDate} • تنتهي: {pkg.expiryDate}
                  </div>

                  {pkg.status === 'active' && remainingSessions > 0 && (
                    <button
                      onClick={() => onDeductSession(pkg.id)}
                      className="px-4 py-2 bg-[#075563] hover:bg-[#075563]/90 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-xs"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      خصم جلسة من الرصيد
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Package Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 text-right">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-bold text-lg text-[#075563]">إصدار باقة تأهيل جديدة</h3>
              <button onClick={() => setShowAddModal(false)} className="p-1 text-gray-400 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">المراجع:</label>
              {patients.length > 0 ? (
                <select
                  value={selectedPatientId}
                  onChange={(e) => setSelectedPatientId(e.target.value)}
                  className="w-full bg-[#FAF8F1] border border-gray-300 rounded-xl p-2.5 text-xs font-bold"
                >
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} - {p.civilId}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  placeholder="اسم المراجع (المجمع جديد)"
                  value={customPatientName}
                  onChange={(e) => setCustomPatientName(e.target.value)}
                  className="w-full bg-[#FAF8F1] border border-gray-300 rounded-xl p-2.5 text-xs font-bold"
                />
              )}
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">اسم الباقة والبرنامج:</label>
              <input
                type="text"
                value={packageName}
                onChange={(e) => setPackageName(e.target.value)}
                className="w-full bg-white border border-gray-300 rounded-xl p-2.5 text-xs"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">عدد الجلسات:</label>
              <select
                value={totalSessions}
                onChange={(e) => setTotalSessions(Number(e.target.value))}
                className="w-full bg-white border border-gray-300 rounded-xl p-2.5 text-xs font-mono font-bold"
              >
                <option value={5}>5 جلسات (خصم 10% = 67.5 ر.ع)</option>
                <option value={6}>6 جلسات (خصم 10% = 81.0 ر.ع)</option>
                <option value={8}>8 جلسات (خصم 10% = 108.0 ر.ع)</option>
                <option value={10}>10 جلسات (خصم 10% = 135.0 ر.ع)</option>
                <option value={12}>12 جلسة تأهيل ACL / أعصاب (خصم 10% = 162.0 ر.ع)</option>
              </select>
            </div>

            <div className="bg-[#FAF8F1] p-3 rounded-xl border border-[#B59B62]/30 text-xs flex justify-between items-center font-bold">
              <span>السعر الإجمالي بعد خصم 10%:</span>
              <span className="text-[#075563] text-base font-mono">{finalPrice} ر.ع</span>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setShowAddModal(false)}
                className="w-1/2 py-2.5 bg-gray-200 text-gray-700 text-xs font-bold rounded-xl"
              >
                إلغاء
              </button>
              <button
                onClick={handleCreate}
                className="w-1/2 py-2.5 bg-[#075563] text-white text-xs font-bold rounded-xl hover:bg-[#075563]/90 shadow-md"
              >
                تأكيد وإصدار الباقة
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
