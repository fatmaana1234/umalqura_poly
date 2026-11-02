import React, { useState } from 'react';
import { Appointment, Patient, StaffMember, MedicalBed, MedicalDevice } from '../types/clinic';
import {
  Calendar as CalendarIcon,
  Plus,
  Clock,
  User,
  Bed,
  Cpu,
  CheckCircle2,
  AlertCircle,
  PhoneCall,
  Search,
  Filter
} from 'lucide-react';

interface AppointmentsScheduleViewProps {
  appointments: Appointment[];
  patients: Patient[];
  staff: StaffMember[];
  beds: MedicalBed[];
  devices: MedicalDevice[];
  onOpenBookingModal: () => void;
  onOpenVoiceBot: () => void;
  onUpdateStatus?: (aptId: string, status: Appointment['status']) => void;
}

export const AppointmentsScheduleView: React.FC<AppointmentsScheduleViewProps> = ({
  appointments,
  patients,
  staff,
  beds,
  devices,
  onOpenBookingModal,
  onOpenVoiceBot,
  onUpdateStatus
}) => {
  const [selectedDate, setSelectedDate] = useState<string>('2026-11-01');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPhysio, setFilterPhysio] = useState<string>('all');

  const filteredAppointments = appointments.filter((apt) => {
    const matchDate = apt.date === selectedDate;
    const matchSearch =
      apt.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.procedureName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchPhysio = filterPhysio === 'all' || apt.physioId === filterPhysio;
    return matchDate && matchSearch && matchPhysio;
  });

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-white p-5 rounded-3xl border border-[#075563]/15 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-[#075563]/10 text-[#075563]">
              <CalendarIcon className="w-5 h-5" />
            </span>
            <h2 className="font-bold text-lg sm:text-xl text-[#075563]">
              جدول المواعيد بنظام التحقق خماسي الأبعاد (5D Conflict Manager)
            </h2>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            التحقق البرمجي التلقائي من 5 عناصر قبل تثبيت الحجز: الأخصائي • السرير • الجهاز الطبي • وقت المريض • مدة الإجراء
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenVoiceBot}
            className="px-3.5 py-2 bg-[#FAF8F1] hover:bg-[#B59B62]/20 text-[#075563] text-xs font-bold rounded-xl border border-[#B59B62]/40 transition flex items-center gap-1.5"
          >
            <PhoneCall className="w-4 h-4 text-[#B59B62]" />
            مساعد الانتظار العماني
          </button>

          <button
            onClick={onOpenBookingModal}
            className="px-4 py-2.5 bg-[#075563] hover:bg-[#075563]/90 text-white text-xs sm:text-sm font-bold rounded-xl transition shadow-md flex items-center gap-2"
          >
            <Plus className="w-4 h-4 text-[#B59B62]" />
            حجز موعد خماسي الأبعاد
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-[#FAF8F1] p-4 rounded-2xl border border-[#B59B62]/20 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <label className="font-bold text-gray-700">تاريخ المواعيد:</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="bg-white border border-gray-300 rounded-xl p-2 font-mono font-bold text-[#075563]"
          />
        </div>

        <div className="flex items-center gap-3">
          <label className="font-bold text-gray-700">الأخصائي المعالج:</label>
          <select
            value={filterPhysio}
            onChange={(e) => setFilterPhysio(e.target.value)}
            className="bg-white border border-gray-300 rounded-xl p-2 font-bold text-gray-800"
          >
            <option value="all">جميع الكادر الطبي المتاح</option>
            {staff.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.title})
              </option>
            ))}
          </select>
        </div>

        <div className="relative min-w-[200px]">
          <Search className="w-4 h-4 text-gray-400 absolute right-3 top-2.5" />
          <input
            type="text"
            placeholder="بحث باسم المريض أو الإجراء..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-gray-300 rounded-xl py-2 pr-9 pl-3 text-xs"
          />
        </div>
      </div>

      {/* 5-Dimensional Resource Matrix Grid */}
      <div className="bg-white rounded-3xl border border-[#075563]/15 overflow-hidden shadow-xs">
        <div className="p-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between text-xs font-bold text-gray-600">
          <span>المواعيد المسجلة ({filteredAppointments.length} مواعيد مؤكدة بدون أي تعارض):</span>
          <span className="text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
            حماية الجدولة مفعّلة 100%
          </span>
        </div>

        {filteredAppointments.length === 0 ? (
          <div className="p-12 text-center text-gray-400 space-y-2">
            <Clock className="w-10 h-10 mx-auto text-gray-300" />
            <p className="text-sm">لا توجد مواعيد مبرمجة في هذا التاريخ تطابق معايير البحث.</p>
            <button
              onClick={onOpenBookingModal}
              className="px-4 py-2 bg-[#075563] text-white text-xs font-bold rounded-xl mt-2 inline-block"
            >
              حجز موعد جديد
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredAppointments.map((apt) => {
              const bedObj = beds.find((b) => b.id === apt.bedId);
              const devObj = devices.find((d) => d.id === apt.deviceId);

              return (
                <div
                  key={apt.id}
                  className="p-4 sm:p-5 hover:bg-[#FAF8F1]/60 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  {/* Left: Time and Patient */}
                  <div className="flex items-start sm:items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-[#075563] text-white flex flex-col items-center justify-center font-mono font-bold flex-shrink-0 shadow-sm">
                      <span className="text-sm">{apt.startTime}</span>
                      <span className="text-[10px] text-[#B59B62]">{apt.durationMinutes} د</span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-base text-gray-900">{apt.patientName}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                          apt.patientGender === 'female' ? 'bg-pink-100 text-pink-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {apt.patientGender === 'female' ? 'أنثى' : 'ذكر'}
                        </span>
                      </div>
                      <div className="text-xs font-medium text-gray-600">{apt.procedureName}</div>

                      {/* The 5 Resources Badges */}
                      <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px]">
                        <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 px-2 py-0.5 rounded-md">
                          <User className="w-3 h-3 text-[#075563]" /> {apt.physioName}
                        </span>
                        <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 px-2 py-0.5 rounded-md">
                          <Bed className="w-3 h-3 text-[#075563]" /> {bedObj?.name.slice(0, 25)}...
                        </span>
                        <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 px-2 py-0.5 rounded-md">
                          <Cpu className="w-3 h-3 text-[#075563]" /> {devObj?.name.slice(0, 25)}...
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Status & Actions */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2">
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                      مؤكد في النظام
                    </span>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => onUpdateStatus && onUpdateStatus(apt.id, 'completed')}
                        className="px-3 py-1 bg-gray-100 hover:bg-emerald-600 hover:text-white text-gray-700 text-xs font-bold rounded-lg transition"
                      >
                        إتمام الجلسة
                      </button>
                      <button
                        onClick={() => onUpdateStatus && onUpdateStatus(apt.id, 'cancelled')}
                        className="px-3 py-1 bg-gray-100 hover:bg-red-600 hover:text-white text-gray-700 text-xs font-bold rounded-lg transition"
                      >
                        اعتذار / إلغاء
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
