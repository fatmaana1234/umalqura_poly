import React, { useState } from 'react';
import { Appointment, Patient, StaffMember, MedicalBed, MedicalDevice, Gender } from '../types/clinic';
import { ShieldCheck, AlertCircle, Clock, User, Bed, Cpu, Calendar, Check, X, UserPlus } from 'lucide-react';

interface ResourceConflictManagerProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmBooking: (appointment: Appointment) => void;
  onRegisterNewPatient?: (patient: Patient) => void;
  existingAppointments: Appointment[];
  patients: Patient[];
  staff: StaffMember[];
  beds: MedicalBed[];
  devices: MedicalDevice[];
}

export const ResourceConflictManager: React.FC<ResourceConflictManagerProps> = ({
  isOpen,
  onClose,
  onConfirmBooking,
  onRegisterNewPatient,
  existingAppointments,
  patients,
  staff,
  beds,
  devices
}) => {
  const [selectedPatientId, setSelectedPatientId] = useState<string>(patients[0]?.id || '');
  const [isRegisteringNew, setIsRegisteringNew] = useState<boolean>(patients.length === 0);
  const [newPatientName, setNewPatientName] = useState('');
  const [newPatientCivilId, setNewPatientCivilId] = useState('');
  const [newPatientPhone, setNewPatientPhone] = useState('+968 ');
  const [newPatientGender, setNewPatientGender] = useState<Gender>('female');

  const [date, setDate] = useState<string>('2026-11-01');
  const [startTime, setStartTime] = useState<string>('10:00');
  const [procedureType, setProcedureType] = useState<string>('shockwave');
  const [selectedPhysioId, setSelectedPhysioId] = useState<string>('staff-saba');
  const [selectedBedId, setSelectedBedId] = useState<string>('bed-3');
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('dev-shockwave');

  if (!isOpen) return null;

  const currentPatient = patients.find((p) => p.id === selectedPatientId);

  // Procedure duration mapping
  const procedureDurations: { [key: string]: { name: string; duration: number; defaultDevice: string; defaultBed: string } } = {
    shockwave: {
      name: 'جلسة موجات تصادمية BTL للركبة أو الأوتار',
      duration: 30,
      defaultDevice: 'dev-shockwave',
      defaultBed: 'bed-3'
    },
    traction: {
      name: 'جلسة شد الفقرات العنقية أو القطنية المحوسب',
      duration: 45,
      defaultDevice: 'dev-traction',
      defaultBed: 'bed-2'
    },
    electro_ultrasound: {
      name: 'جلسة علاج كهربائي مسكن + موجات فوق صوتية BTL 4000',
      duration: 35,
      defaultDevice: 'dev-btl4000',
      defaultBed: 'bed-1'
    },
    air_compression: {
      name: 'جلسة تصريف ليمفاوي وتدليك بضغط الهواء Air Compression',
      duration: 30,
      defaultDevice: 'dev-aircompression',
      defaultBed: 'bed-1'
    },
    gym_rehab: {
      name: 'تأهيل حركي وتمارين توازن بصالة الجيم الطبي',
      duration: 45,
      defaultDevice: 'dev-gym',
      defaultBed: 'bed-gym'
    },
    manual_eval: {
      name: 'كشف واستشارة أولية مع علاج يدوي وتقييم (3 ر.ع)',
      duration: 40,
      defaultDevice: 'dev-manual',
      defaultBed: 'bed-1'
    }
  };

  const selectedProc = procedureDurations[procedureType] || procedureDurations.shockwave;
  const duration = selectedProc.duration;

  // Convert "HH:mm" to minutes since midnight for range overlap check
  const toMinutes = (timeStr: string) => {
    const [h, m] = timeStr.split(':').map(Number);
    return h * 60 + m;
  };

  const newStart = toMinutes(startTime);
  const newEnd = newStart + duration;

  // Check 5-Dimensional Conflicts
  const conflicts: { dimension: string; message: string; severity: 'error' | 'warning' }[] = [];

  // Time & Overlap Checks on the same Date
  const sameDayAppointments = existingAppointments.filter((a) => a.date === date && a.status !== 'cancelled');

  sameDayAppointments.forEach((apt) => {
    const aptStart = toMinutes(apt.startTime);
    const aptEnd = aptStart + apt.durationMinutes;

    const hasTimeOverlap = Math.max(newStart, aptStart) < Math.min(newEnd, aptEnd);

    if (hasTimeOverlap) {
      // 1. Specialist Conflict
      if (apt.physioId === selectedPhysioId) {
        conflicts.push({
          dimension: 'الأخصائية المعالجة (Specialist)',
          message: `الأخصائية (${apt.physioName}) محجوزة بالفعل في نفس التوقيت (${apt.startTime}) مع مراجع آخر (${apt.patientName}).`,
          severity: 'error'
        });
      }

      // 2. Bed / Room Conflict
      if (apt.bedId === selectedBedId) {
        const bedObj = beds.find((b) => b.id === selectedBedId);
        conflicts.push({
          dimension: 'السرير / الجناح (Bed/Room)',
          message: `السرير (${bedObj?.name}) مشغول في هذا الوقت لحالة أخرى.`,
          severity: 'error'
        });
      }

      // 3. Device Conflict
      if (selectedDeviceId !== 'dev-manual' && apt.deviceId === selectedDeviceId) {
        const devObj = devices.find((d) => d.id === selectedDeviceId);
        conflicts.push({
          dimension: 'الجهاز الطبي (Medical Device)',
          message: `الجهاز الطبي (${devObj?.name}) قيد الاستخدام في جلسة أخرى خلال نفس الفترة الزمنية.`,
          severity: 'error'
        });
      }

      // 4. Patient Time Conflict
      const checkPatientId = isRegisteringNew ? '' : selectedPatientId;
      if (checkPatientId && apt.patientId === checkPatientId) {
        conflicts.push({
          dimension: 'وقت المريض (Patient Slot)',
          message: `المريض لديه موعد آخر مبرمج مسبقاً في نفس هذا التوقيت.`,
          severity: 'error'
        });
      }
    }
  });

  // Working Hours Check: 9:00 - 13:00 and 16:00 - 20:00 (Saturday to Thursday)
  const isMorningShift = newStart >= 9 * 60 && newEnd <= 13 * 60;
  const isEveningShift = newStart >= 16 * 60 && newEnd <= 20 * 60;

  if (!isMorningShift && !isEveningShift) {
    conflicts.push({
      dimension: 'ساعات العمل الرسمية للمجمع (Working Hours)',
      message: 'التوقيت خارج ساعات دوام المجمع الرسمية (الفترة الصباحية: 9 ص - 1 ظهراً، والمسائية: 4 م - 8 مساءً).',
      severity: 'error'
    });
  }

  const hasFatalConflict = conflicts.some((c) => c.severity === 'error');

  const handleBook = () => {
    if (hasFatalConflict) return;

    let patientId = selectedPatientId;
    let patientName = '';
    let patientGender: Gender = 'female';

    if (isRegisteringNew || !currentPatient) {
      if (!newPatientName.trim()) {
        alert('يرجى كتابة اسم المراجع لتثبيت الموعد');
        return;
      }
      patientId = 'pat-' + Date.now();
      patientName = newPatientName.trim();
      patientGender = newPatientGender;

      const newPat: Patient = {
        id: patientId,
        civilId: newPatientCivilId.trim() || 'OM-' + Math.floor(10000000 + Math.random() * 90000000),
        name: patientName,
        age: 35,
        gender: patientGender,
        phone: newPatientPhone.trim() || '+968 79470050',
        city: 'بركاء (Barka)',
        assignedPhysioId: selectedPhysioId,
        diagnosis: selectedProc.name,
        clinicType: 'spine_care',
        registrationDate: new Date().toISOString().split('T')[0],
        insuranceProvider: 'كاش / نقدي',
        totalSessionsCompleted: 0,
        baselinePainVAS: 6,
        currentPainVAS: 6
      };

      if (onRegisterNewPatient) {
        onRegisterNewPatient(newPat);
      }
    } else {
      patientName = currentPatient.name;
      patientGender = currentPatient.gender;
    }

    const physioObj = staff.find((s) => s.id === selectedPhysioId);

    const newAppointment: Appointment = {
      id: 'apt-' + Date.now(),
      patientId,
      patientName,
      patientGender,
      physioId: selectedPhysioId,
      physioName: physioObj?.name || 'د. سبأ',
      bedId: selectedBedId,
      deviceId: selectedDeviceId,
      date,
      startTime,
      durationMinutes: duration,
      status: 'confirmed',
      procedureName: selectedProc.name,
      notes: `حجز مؤكد عبر نظام الجدولة خماسي الأبعاد لمجمع أم القرى الطبي.`
    };

    onConfirmBooking(newAppointment);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl border border-gray-100 overflow-hidden my-6">
        {/* Header */}
        <div className="bg-[#075563] text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-xl">
              <ShieldCheck className="w-6 h-6 text-[#B59B62]" />
            </div>
            <div>
              <h3 className="font-bold text-lg sm:text-xl">
                نظام الجدولة خماسي الأبعاد لتفادي تعارض الموارد (5D Resource Conflict Manager)
              </h3>
              <p className="text-xs text-[#FAF8F1]/80 mt-0.5">
                التحقق اللحظي الآلي من: الأخصائية + السرير + الجهاز + وقت المريض + المدة الإجرائية
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Form */}
        <div className="p-4 sm:p-6 space-y-5 max-h-[72vh] overflow-y-auto text-right">
          {/* Patient Selection or Quick Register */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-gray-700">بيانات المراجع / المريض:</label>
              {patients.length > 0 && (
                <button
                  type="button"
                  onClick={() => setIsRegisteringNew(!isRegisteringNew)}
                  className="text-xs font-bold text-[#075563] hover:underline flex items-center gap-1"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  {isRegisteringNew ? 'اختيار مراجع مسجل' : 'تسجيل مراجع جديد الآن'}
                </button>
              )}
            </div>

            {isRegisteringNew || patients.length === 0 ? (
              <div className="bg-[#FAF8F1] p-3.5 rounded-2xl border border-[#B59B62]/30 space-y-3">
                <div className="text-[11px] font-bold text-[#075563]">
                  {patients.length === 0 ? 'المجمع جديد • أدخل بيانات أول مراجع لتثبيت الحجز' : 'إدخال بيانات مراجع جديد مباشرة:'}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <input
                      type="text"
                      placeholder="اسم المراجع الثلاثي *"
                      value={newPatientName}
                      onChange={(e) => setNewPatientName(e.target.value)}
                      className="w-full text-xs bg-white border border-gray-300 rounded-xl p-2.5 font-bold"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="الرقم المدني العماني (اختياري)"
                      value={newPatientCivilId}
                      onChange={(e) => setNewPatientCivilId(e.target.value)}
                      className="w-full text-xs bg-white border border-gray-300 rounded-xl p-2.5 font-mono"
                    />
                  </div>
                  <div>
                    <input
                      type="tel"
                      placeholder="رقم الهاتف (+968)"
                      value={newPatientPhone}
                      onChange={(e) => setNewPatientPhone(e.target.value)}
                      className="w-full text-xs bg-white border border-gray-300 rounded-xl p-2.5 font-mono"
                    />
                  </div>
                  <div>
                    <select
                      value={newPatientGender}
                      onChange={(e) => setNewPatientGender(e.target.value as Gender)}
                      className="w-full text-xs bg-white border border-gray-300 rounded-xl p-2.5 font-bold text-[#075563]"
                    >
                      <option value="female">أنثى (د. سبأ)</option>
                      <option value="male">ذكر</option>
                    </select>
                  </div>
                </div>
              </div>
            ) : (
              <select
                value={selectedPatientId}
                onChange={(e) => setSelectedPatientId(e.target.value)}
                className="w-full text-xs sm:text-sm bg-[#FAF8F1] border border-gray-200 rounded-xl p-2.5 font-bold text-gray-800"
              >
                {patients.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.gender === 'female' ? 'أنثى' : 'ذكر'}) - {p.civilId}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Procedure Type */}
          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1">
              الإجراء التأهيلي (تحديد المدة أوتوماتيكياً):
            </label>
            <select
              value={procedureType}
              onChange={(e) => {
                setProcedureType(e.target.value);
                const def = procedureDurations[e.target.value];
                if (def) {
                  setSelectedDeviceId(def.defaultDevice);
                  setSelectedBedId(def.defaultBed);
                }
              }}
              className="w-full text-xs sm:text-sm bg-[#FAF8F1] border border-gray-200 rounded-xl p-2.5 font-medium text-gray-800"
            >
              <option value="shockwave">علاج بالموجات التصادمية BTL (30 دقيقة)</option>
              <option value="traction">شد فقرات عنقية/قطنية بالكمبيوتر (45 دقيقة)</option>
              <option value="electro_ultrasound">علاج كهربائي + موجات فوق صوتية BTL 4000 (35 دقيقة)</option>
              <option value="air_compression">تدليك ضغط الهواء الليمفاوي Air Compression (30 دقيقة)</option>
              <option value="gym_rehab">تأهيل حركي وتمارين الجيم الطبي (45 دقيقة)</option>
              <option value="manual_eval">كشف واستشارة مع علاج يدوي (40 دقيقة - 3 ر.ع)</option>
            </select>
          </div>

          {/* Date & Start Time */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-[#075563]" />
                تاريخ الموعد:
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-xl p-2.5 font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#075563]" />
                وقت البدء:
              </label>
              <select
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-xl p-2.5 font-mono"
              >
                <optgroup label="الفترة الصباحية (9:00 ص - 1:00 م)">
                  <option value="09:00">09:00 صباحاً</option>
                  <option value="09:30">09:30 صباحاً</option>
                  <option value="10:00">10:00 صباحاً</option>
                  <option value="10:30">10:30 صباحاً</option>
                  <option value="11:00">11:00 صباحاً</option>
                  <option value="11:30">11:30 صباحاً</option>
                  <option value="12:00">12:00 ظهراً</option>
                  <option value="12:15">12:15 ظهراً</option>
                </optgroup>
                <optgroup label="الفترة المسائية (4:00 م - 8:00 م)">
                  <option value="16:00">04:00 مساءً</option>
                  <option value="16:30">04:30 مساءً</option>
                  <option value="17:00">05:00 مساءً</option>
                  <option value="17:30">05:30 مساءً</option>
                  <option value="18:00">06:00 مساءً</option>
                  <option value="18:30">06:30 مساءً</option>
                  <option value="19:00">07:00 مساءً</option>
                  <option value="19:15">07:15 مساءً</option>
                </optgroup>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">
                المدة المحسوبة للإجراء:
              </label>
              <div className="bg-[#FAF8F1] border border-[#B59B62]/30 rounded-xl p-2.5 text-xs sm:text-sm font-bold text-[#075563] flex items-center justify-between">
                <span>{duration} دقيقة</span>
                <span className="text-[11px] text-gray-500">حتى {Math.floor(newEnd / 60).toString().padStart(2, '0')}:{(newEnd % 60).toString().padStart(2, '0')}</span>
              </div>
            </div>
          </div>

          {/* Resources: Specialist, Bed, Device */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-gray-100">
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-[#075563]" />
                البُعد 1: الأخصائية المعالجة
              </label>
              <select
                value={selectedPhysioId}
                onChange={(e) => setSelectedPhysioId(e.target.value)}
                className="w-full text-xs bg-gray-50 border border-gray-200 rounded-xl p-2 font-bold"
              >
                {staff
                  .filter((s) => s.role === 'physiotherapist')
                  .map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.title})
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1 flex items-center gap-1">
                <Bed className="w-3.5 h-3.5 text-[#075563]" />
                البُعد 2: السرير / الجناح
              </label>
              <select
                value={selectedBedId}
                onChange={(e) => setSelectedBedId(e.target.value)}
                className="w-full text-xs bg-gray-50 border border-gray-200 rounded-xl p-2"
              >
                {beds.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1 flex items-center gap-1">
                <Cpu className="w-3.5 h-3.5 text-[#075563]" />
                البُعد 3: الجهاز الطبي
              </label>
              <select
                value={selectedDeviceId}
                onChange={(e) => setSelectedDeviceId(e.target.value)}
                className="w-full text-xs bg-gray-50 border border-gray-200 rounded-xl p-2"
              >
                {devices.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name.slice(0, 30)}...
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Validation Feedback */}
          <div className="space-y-2 pt-2 border-t border-gray-100">
            <div className="text-xs font-bold text-gray-700">نتيجة فحص خوارزمية التعارض خماسية الأبعاد:</div>
            {conflicts.length === 0 ? (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-emerald-800 text-xs font-medium">
                <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>
                  ممتاز! الموعد متاح بالكامل ومستوفٍ لكافة الأبعاد الـ 5 بدون أي تعارض في الأخصائي أو السرير أو الجهاز أو وقت المريض.
                </span>
              </div>
            ) : (
              conflicts.map((conf, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-xl border flex items-start gap-2.5 text-xs ${
                    conf.severity === 'error'
                      ? 'bg-red-50 border-red-200 text-red-800'
                      : 'bg-amber-50 border-amber-200 text-amber-800'
                  }`}
                >
                  <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-bold block">{conf.dimension}</span>
                    <span className="leading-relaxed">{conf.message}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-gray-600 hover:text-gray-900"
          >
            إلغاء
          </button>

          <button
            onClick={handleBook}
            disabled={hasFatalConflict}
            className={`px-5 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition flex items-center gap-2 shadow-md ${
              hasFatalConflict
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-[#075563] hover:bg-[#075563]/90 text-white'
            }`}
          >
            <Check className="w-4 h-4 text-[#B59B62]" />
            <span>تثبيت وحجز الموعد</span>
          </button>
        </div>
      </div>
    </div>
  );
};
