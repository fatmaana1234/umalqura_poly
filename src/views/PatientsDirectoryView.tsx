import React, { useState } from 'react';
import { Patient, PackageCourse, Gender, SpecializedClinicType } from '../types/clinic';
import {
  Users,
  Search,
  Plus,
  Award,
  MessageSquare,
  Phone,
  Activity,
  ShieldCheck,
  CheckCircle2,
  UserPlus,
  X,
  FileText
} from 'lucide-react';

interface PatientsDirectoryViewProps {
  patients: Patient[];
  packages: PackageCourse[];
  onSelectPatient?: (p: Patient) => void;
  onOpenDischargeReport: (p: Patient) => void;
  onAddNewPatient?: (p: Patient) => void;
}

export const PatientsDirectoryView: React.FC<PatientsDirectoryViewProps> = ({
  patients,
  packages,
  onSelectPatient,
  onOpenDischargeReport,
  onAddNewPatient
}) => {
  const [search, setSearch] = useState('');
  const [genderFilter, setGenderFilter] = useState<'all' | 'female' | 'male'>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Patient Form State
  const [name, setName] = useState('');
  const [civilId, setCivilId] = useState('');
  const [phone, setPhone] = useState('+968 ');
  const [gender, setGender] = useState<Gender>('female');
  const [age, setAge] = useState<number>(30);
  const [city, setCity] = useState('بركاء (Barka)');
  const [diagnosis, setDiagnosis] = useState('');
  const [clinicType, setClinicType] = useState<SpecializedClinicType>('spine_care');
  const [insuranceProvider, setInsuranceProvider] = useState('كاش / نقدي');
  const [insurancePolicyNumber, setInsurancePolicyNumber] = useState('');
  const [baselinePainVAS, setBaselinePainVAS] = useState<number>(7);

  const filtered = patients.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.civilId.includes(search) ||
      p.diagnosis.toLowerCase().includes(search.toLowerCase()) ||
      p.phone.includes(search);
    const matchGender = genderFilter === 'all' || p.gender === genderFilter;
    return matchSearch && matchGender;
  });

  const handleRegisterPatient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !civilId.trim()) {
      alert('يرجى إدخال اسم المراجع والرقم المدني العماني');
      return;
    }

    const newPatient: Patient = {
      id: 'pat-' + Date.now(),
      civilId: civilId.trim(),
      name: name.trim(),
      age: Number(age) || 30,
      gender,
      phone: phone.trim() || '+968 ',
      city: city.trim(),
      assignedPhysioId: 'staff-saba',
      diagnosis: diagnosis.trim() || 'تشخيص عام - علاج طبيعي وتأهيل',
      clinicType,
      registrationDate: new Date().toISOString().split('T')[0],
      insuranceProvider: insuranceProvider.trim(),
      insurancePolicyNumber: insurancePolicyNumber.trim() || undefined,
      totalSessionsCompleted: 0,
      baselinePainVAS: Number(baselinePainVAS) || 5,
      currentPainVAS: Number(baselinePainVAS) || 5
    };

    if (onAddNewPatient) {
      onAddNewPatient(newPatient);
    }

    // Reset Form
    setName('');
    setCivilId('');
    setPhone('+968 ');
    setDiagnosis('');
    setInsurancePolicyNumber('');
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-3xl border border-[#075563]/15 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-[#075563]/10 text-[#075563]">
              <Users className="w-5 h-5" />
            </span>
            <h2 className="font-bold text-lg sm:text-xl text-[#075563]">
              سجل المراجعين الإكلينيكي (Patients Directory)
            </h2>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            إدارة وتوثيق ملفات مراجعي مجمع أم القرى الطبي (بركاء) وفق معايير الخصوصية والتأهيل الطبي
          </p>
        </div>

        {/* Actions: Add Patient + Gender Filter */}
        <div className="flex flex-wrap items-center gap-2.5">
          <select
            value={genderFilter}
            onChange={(e) => setGenderFilter(e.target.value as any)}
            className="text-xs bg-[#FAF8F1] border border-gray-300 rounded-xl p-2.5 font-bold text-[#075563]"
          >
            <option value="all">جميع المراجعين</option>
            <option value="female">المريضات الإناث</option>
            <option value="male">المرضى الذكور</option>
          </select>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2.5 bg-[#075563] hover:bg-[#075563]/90 text-white text-xs sm:text-sm font-bold rounded-xl transition shadow-md flex items-center gap-2"
          >
            <UserPlus className="w-4 h-4 text-[#B59B62]" />
            <span>تسجيل مراجع جديد</span>
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-gray-400 absolute right-4 top-3.5" />
        <input
          type="text"
          placeholder="ابحث بالاسم، الرقم المدني العماني، الهاتف، أو التشخيص..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white border border-gray-200 rounded-2xl py-3 pr-11 pl-4 text-xs sm:text-sm shadow-xs focus:outline-[#075563]"
        />
      </div>

      {/* Empty State when no patients */}
      {patients.length === 0 ? (
        <div className="bg-white rounded-3xl border border-[#075563]/15 p-10 sm:p-14 text-center space-y-4 shadow-xs">
          <div className="w-16 h-16 rounded-3xl bg-[#075563]/10 text-[#075563] mx-auto flex items-center justify-center">
            <Users className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-gray-900">
              المجمع جديد وفي طور الانطلاق • لا توجد ملفات مراجعين مسجلة حتى الآن
            </h3>
            <p className="text-xs text-gray-500 max-w-md mx-auto leading-relaxed">
              تم تصفير كافة البيانات التجريبية بنجاح. النظام جاهز الآن لاستقبال وتسجيل مراجعي العيادة الفعليين وتوثيق المواعيد وخطط العلاج.
            </p>
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-5 py-2.5 bg-[#075563] hover:bg-[#075563]/90 text-white text-xs sm:text-sm font-bold rounded-xl transition shadow-md inline-flex items-center gap-2"
          >
            <UserPlus className="w-4 h-4 text-[#B59B62]" />
            <span>تسجيل أول مراجع الآن</span>
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-3xl border border-gray-200 p-8 text-center text-gray-400">
          <p className="text-sm">لا يوجد مراجع يطابق بحثك الحالي "{search}".</p>
        </div>
      ) : (
        /* Patients Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((patient) => {
            const patientPackage = packages.find((pkg) => pkg.patientId === patient.id);
            const painDiff = patient.baselinePainVAS - patient.currentPainVAS;

            return (
              <div
                key={patient.id}
                className="bg-white rounded-3xl border border-[#075563]/15 p-5 shadow-xs hover:shadow-md transition flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  {/* Top Strip */}
                  <div className="flex items-start justify-between gap-2 border-b border-gray-100 pb-3">
                    <div>
                      <h3 className="font-bold text-base text-gray-900">{patient.name}</h3>
                      <div className="flex items-center gap-2 mt-0.5 text-xs">
                        <span className="font-mono text-gray-500">الرقم المدني: {patient.civilId}</span>
                        <span className="text-gray-300">•</span>
                        <span className="text-gray-500">{patient.age} سنة</span>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                        patient.gender === 'female'
                          ? 'bg-pink-100 text-pink-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {patient.gender === 'female' ? 'أنثى' : 'ذكر'}
                    </span>
                  </div>

                  {/* Diagnosis */}
                  <div className="text-xs space-y-1">
                    <span className="text-gray-400 block text-[10px]">التشخيص الطبي الإكلينيكي:</span>
                    <p className="text-gray-800 font-medium leading-relaxed">{patient.diagnosis}</p>
                  </div>

                  {/* Contact & City */}
                  <div className="text-xs text-gray-600 flex items-center justify-between bg-gray-50 p-2.5 rounded-xl border border-gray-200 font-mono">
                    <span>الهاتف: {patient.phone}</span>
                    <span className="text-gray-400">{patient.city}</span>
                  </div>

                  {/* VAS Pain Tracker Pill */}
                  <div className="bg-[#FAF8F1] p-3 rounded-2xl border border-[#B59B62]/20 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-gray-500 block text-[10px]">مقياس الألم VAS</span>
                      <span className="font-bold text-[#075563]">
                        من {patient.baselinePainVAS} إلى {patient.currentPainVAS} / 10
                      </span>
                    </div>

                    <div className="text-left font-mono">
                      <span className={`font-bold block text-sm ${painDiff > 0 ? 'text-emerald-700' : 'text-gray-600'}`}>
                        {painDiff > 0 ? `-${painDiff} درجات` : 'قيد التقييم'}
                      </span>
                      <span className="text-[10px] text-gray-500">
                        {painDiff > 0 ? 'تحسن إكلينيكي' : 'بداية الخطة'}
                      </span>
                    </div>
                  </div>

                  {/* Sessions Count */}
                  <div className="text-xs flex justify-between items-center bg-gray-50 p-2.5 rounded-xl border border-gray-200">
                    <span className="text-gray-600">الجلسات المنجزة:</span>
                    <span className="font-mono font-bold text-[#075563]">
                      {patient.totalSessionsCompleted} جلسات مكتملة
                    </span>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="pt-2 border-t border-gray-100 flex items-center justify-between gap-2">
                  <a
                    href={`https://wa.me/${patient.phone.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl transition flex items-center gap-1.5 text-xs font-bold"
                    title="مراسلة المريض عبر واتساب"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>واتساب</span>
                  </a>

                  <button
                    onClick={() => onOpenDischargeReport(patient)}
                    className="px-3 py-2 bg-[#075563] hover:bg-[#075563]/90 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-xs"
                  >
                    <Award className="w-3.5 h-3.5 text-[#B59B62]" />
                    <span>تقرير التخرج PDF</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add New Patient Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-lg w-full shadow-2xl border border-gray-100 my-8 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-[#075563]/10 text-[#075563]">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-[#075563]">تسجيل مراجع جديد بالمجمع</h3>
                  <p className="text-[11px] text-gray-500">فتح ملف طبي رقمي لمجمع أم القرى الطبي - بركاء</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-700 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRegisterPatient} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-gray-700 block mb-1">اسم المراجع الثلاثي / الرباعي *</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: أصيلة بنت سالم المعمرية"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#FAF8F1] border border-gray-300 rounded-xl p-2.5 text-xs text-gray-900 focus:outline-[#075563]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">الرقم المدني العُماني (Civil ID) *</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: 10849204"
                    value={civilId}
                    onChange={(e) => setCivilId(e.target.value)}
                    className="w-full bg-[#FAF8F1] border border-gray-300 rounded-xl p-2.5 text-xs font-mono text-gray-900 focus:outline-[#075563]"
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">رقم الهاتف (واتساب) *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+968 9XXXXXXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-[#FAF8F1] border border-gray-300 rounded-xl p-2.5 text-xs font-mono text-gray-900 focus:outline-[#075563]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">الجنس *</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as Gender)}
                    className="w-full bg-[#FAF8F1] border border-gray-300 rounded-xl p-2.5 text-xs font-bold text-[#075563]"
                  >
                    <option value="female">أنثى (د. سبأ)</option>
                    <option value="male">ذكر</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">العمر *</label>
                  <input
                    type="number"
                    min="1"
                    max="120"
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    className="w-full bg-[#FAF8F1] border border-gray-300 rounded-xl p-2.5 text-xs font-mono text-gray-900"
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">الولاية / المنطقة</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-[#FAF8F1] border border-gray-300 rounded-xl p-2.5 text-xs text-gray-900"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">التشخيص الطبي أو الشكوى الرئيسية *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="مثال: ألم بالفقرات القطنية مع خشونة بالركبة اليمنى أو تيبس بالكتف"
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  className="w-full bg-[#FAF8F1] border border-gray-300 rounded-xl p-2.5 text-xs text-gray-900 focus:outline-[#075563]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">العيادة التخصصية</label>
                  <select
                    value={clinicType}
                    onChange={(e) => setClinicType(e.target.value as SpecializedClinicType)}
                    className="w-full bg-[#FAF8F1] border border-gray-300 rounded-xl p-2 text-xs font-bold"
                  >
                    <option value="spine_care">عيادة العمود الفقري والشد المحوسب</option>
                    <option value="knee_osteoarthritis">عيادة خشونة الركبة والتصادمية</option>
                    <option value="shoulder_upper_limb">عيادة الكتف والطرف العلوي</option>
                    <option value="sports_return_to_play">عيادة الإصابات الرياضية والتأهيل</option>
                    <option value="post_surgical_rehab">عيادة تأهيل ما بعد العمليات</option>
                    <option value="geriatric">عيادة كبار السن والوقاية من السقوط</option>
                    <option value="neurological">عيادة التأهيل العصبي والسكتة الدماغية</option>
                    <option value="post_covid_cardiopulmonary">عيادة التأهيل القلبي الرئوي وInBody</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">مستوى الألم الأساسي VAS (0-10)</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min="0"
                      max="10"
                      value={baselinePainVAS}
                      onChange={(e) => setBaselinePainVAS(Number(e.target.value))}
                      className="w-full accent-[#075563]"
                    />
                    <span className="font-mono font-bold text-sm text-[#075563] w-6">{baselinePainVAS}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">طريقة الدفع / شركة التأمين</label>
                  <select
                    value={insuranceProvider}
                    onChange={(e) => setInsuranceProvider(e.target.value)}
                    className="w-full bg-[#FAF8F1] border border-gray-300 rounded-xl p-2 text-xs font-bold"
                  >
                    <option value="كاش / نقدي">كاش / دفع مباشر بالبطاقة (3 ر.ع كشف / 15 ر.ع جلسة)</option>
                    <option value="Daman National Insurance (ضمان)">تأمين ضمان (Daman Oman)</option>
                    <option value="MedNet Oman">تأمين مدنت (MedNet Oman)</option>
                    <option value="NextCare Oman">تأمين نكست كير (NextCare Oman)</option>
                    <option value="Al Madina Takaful">تأمين المدينة تكافل</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">رقم بطاقة التأمين (إن وجد)</label>
                  <input
                    type="text"
                    placeholder="اختياري"
                    value={insurancePolicyNumber}
                    onChange={(e) => setInsurancePolicyNumber(e.target.value)}
                    className="w-full bg-[#FAF8F1] border border-gray-300 rounded-xl p-2 text-xs font-mono"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 font-bold rounded-xl"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#075563] text-white font-bold rounded-xl hover:bg-[#075563]/90 shadow-md flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#B59B62]" />
                  <span>تأكيد تسجيل المراجع</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
