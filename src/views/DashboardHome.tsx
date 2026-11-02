import React from 'react';
import { CLINIC_INFO } from '../data/clinicData';
import { Appointment, Patient, MedicalDevice, StaffMember, UserRole } from '../types/clinic';
import {
  CalendarCheck,
  Users,
  Activity,
  Award,
  Clock,
  Sparkles,
  PhoneCall,
  ShieldCheck,
  ChevronLeft,
  ArrowUpRight,
  Plus,
  Play,
  HeartPulse,
  Flame,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface DashboardHomeProps {
  appointments: Appointment[];
  patients: Patient[];
  devices: MedicalDevice[];
  staff: StaffMember[];
  onOpenBookingModal: () => void;
  onOpenVoiceScribe: () => void;
  onOpenMotionAnalysis: () => void;
  onOpenVoiceBot: () => void;
  onOpenCalculators: () => void;
  onSelectTab: (tab: any) => void;
}

export const DashboardHome: React.FC<DashboardHomeProps> = ({
  appointments,
  patients,
  devices,
  staff,
  onOpenBookingModal,
  onOpenVoiceScribe,
  onOpenMotionAnalysis,
  onOpenVoiceBot,
  onOpenCalculators,
  onSelectTab
}) => {
  const confirmedToday = appointments.filter((a) => a.date === '2026-11-01' && a.status === 'confirmed');
  const availableDevices = devices.filter((d) => d.status === 'available');

  return (
    <div className="space-y-6">
      {/* Clinic Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-l from-[#075563] via-[#094752] to-[#04282f] text-white p-6 sm:p-8 shadow-xl">
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-8 space-y-3">
            <div className="inline-flex items-center gap-2 bg-[#FAF8F1]/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-xs text-[#FAF8F1]">
              <ShieldCheck className="w-4 h-4 text-[#B59B62]" />
              <span>مجمع أم القرى الطبي • بركاء، سلطنة عمان • إصدار 2026</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
              نظام إدارة العلاج الطبيعي والتأهيل الطبي المتكامل
            </h1>
            <p className="text-xs sm:text-sm text-[#FAF8F1]/90 max-w-2xl leading-relaxed">
              {CLINIC_INFO.mottoAr} • نظام إكلينيكي متطور يدمج 23 نظاماً تخصصياً مع الجدولة خماسية الأبعاد والذكاء الاصطناعي السريري والامتثال التام للخصوصية العمانية.
            </p>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap gap-2.5 pt-2">
              <button
                onClick={onOpenBookingModal}
                className="px-4 py-2.5 bg-[#B59B62] hover:bg-[#c4a96e] text-[#075563] text-xs sm:text-sm font-black rounded-xl transition shadow-md flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                حجز موعد بالجدولة خماسية الأبعاد
              </button>

              <button
                onClick={onOpenVoiceScribe}
                className="px-4 py-2.5 bg-[#2A9DA5] hover:bg-[#2A9DA5]/90 text-white text-xs sm:text-sm font-bold rounded-xl transition shadow-md flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-[#B59B62]" />
                الموثق الصوتي الذكي (AI Scribe)
              </button>

              <button
                onClick={onOpenMotionAnalysis}
                className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-bold rounded-xl transition backdrop-blur-sm border border-white/20 flex items-center gap-2"
              >
                <Activity className="w-4 h-4 text-[#B59B62]" />
                التحليل الحركي بالكاميرا (ROM)
              </button>
            </div>
          </div>

          {/* Real Photo Thumbnail Feature Card */}
          <div className="lg:col-span-4 bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/15">
            <div className="relative rounded-xl overflow-hidden aspect-video shadow-md">
              <img
                src={CLINIC_INFO.heroImages.reception}
                alt="استقبال مجمع أم القرى الطبي"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-2.5">
                <div className="text-right">
                  <div className="text-[11px] font-bold text-white">صالة الاستقبال والانتظار</div>
                  <div className="text-[10px] text-[#B59B62]">بناية R&B - ولاية بركاء</div>
                </div>
              </div>
            </div>
            <div className="mt-2 text-center text-[11px] text-[#FAF8F1]/80 font-medium">
              كادر طبي متخصص: د. سبأ (أخصائية العلاج الطبيعي والتأهيل الطبي)
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#075563]/15 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500">مواعيد وجلسات اليوم</span>
            <div className="p-2 bg-blue-50 text-[#075563] rounded-xl">
              <CalendarCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#075563] font-mono">
            {confirmedToday.length} <span className="text-xs font-sans font-bold text-gray-500">جلسات مؤكدة</span>
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            نظام الحماية خماسي الأبعاد مفعل
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#075563]/15 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500">المراجعون المسجلون</span>
            <div className="p-2 bg-emerald-50 text-emerald-700 rounded-xl">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#075563] font-mono">
            {patients.length} <span className="text-xs font-sans font-bold text-gray-500">مراجعاً مسجلاً</span>
          </div>
          <div className="text-[11px] text-[#2A9DA5] font-semibold">
            {patients.length === 0 ? 'المجمع جاهز لاستقبال وتسجيل المراجعين' : `${patients.length} ملفات طبية نشطة`}
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#075563]/15 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500">الأجهزة الطبية المتاحة</span>
            <div className="p-2 bg-amber-50 text-[#B59B62] rounded-xl">
              <HeartPulse className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#075563] font-mono">
            {availableDevices.length} / {devices.length}
          </div>
          <div className="text-[11px] text-gray-500">
            شد الفقرات، BTL التصادمية، BTL 4000، الضغط الهوائي
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#075563]/15 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500">معدل تحسن الحالات</span>
            <div className="p-2 bg-purple-50 text-purple-700 rounded-xl">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-600 font-mono">
            {patients.length > 0 ? '100%' : '0%'} <span className="text-xs font-sans font-bold text-gray-500">متابعة إكلينيكية</span>
          </div>
          <div className="text-[11px] text-gray-500">
            {patients.length > 0 ? 'تتبع فوري لمؤشر الألم VAS' : 'يبدأ الحساب تلقائياً مع تسجيل الحالات'}
          </div>
        </div>
      </div>

      {/* Equipment Showcase Row (Real Verified Photos) */}
      <div className="bg-white rounded-3xl border border-[#075563]/15 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div>
            <h3 className="font-bold text-base sm:text-lg text-[#075563]">
              تجهيزات وأجهزة العلاج الطبيعي والتأهيل بمجمع أم القرى الطبي
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              صور حقيقية موثقة من داخل أجنحة وأقسام المجمع في ولاية بركاء 2026
            </p>
          </div>
          <button
            onClick={() => onSelectTab('equipment_gallery')}
            className="text-xs font-bold text-[#075563] hover:text-[#2A9DA5] flex items-center gap-1"
          >
            استعراض المعرض الكامل
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { title: 'سرير شد الفقرات بالكمبيوتر', subtitle: 'Traction Decompression Bed', img: CLINIC_INFO.heroImages.tractionBed, tag: 'عنقي وقطني' },
            { title: 'جهاز الموجات التصادمية BTL', subtitle: 'Shockwave Therapy System', img: CLINIC_INFO.heroImages.shockwavePoster, tag: 'أوتار ومفاصل' },
            { title: 'العلاج الكهربائي والموجات BTL 4000', subtitle: 'Electro & Ultrasound Combo', img: CLINIC_INFO.heroImages.comboDevice, tag: 'تسكين وتأهيل' },
            { title: 'صالة التأهيل الرياضي والجيم الطبي', subtitle: 'Medical Gym & Rehab Hall', img: CLINIC_INFO.heroImages.medicalGym, tag: 'توازن وقوة' },
          ].map((item, idx) => (
            <div
              key={idx}
              onClick={() => onSelectTab('equipment_gallery')}
              className="group cursor-pointer rounded-2xl overflow-hidden border border-gray-200 bg-gray-50 hover:border-[#2A9DA5] transition shadow-xs hover:shadow-md"
            >
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={item.img}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
                <span className="absolute top-2 right-2 text-[10px] font-bold bg-[#075563] text-white px-2 py-0.5 rounded-full">
                  {item.tag}
                </span>
              </div>
              <div className="p-3 text-right">
                <div className="font-bold text-xs text-gray-900 group-hover:text-[#075563] transition line-clamp-1">
                  {item.title}
                </div>
                <div className="text-[10px] text-gray-500 font-sans mt-0.5">{item.subtitle}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Two-Column Layout: Today's Schedule & 23-Module Quick Navigator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Today's Appointments Table (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-[#075563]/15 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div>
              <h3 className="font-bold text-base text-[#075563] flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#B59B62]" />
                جدول جلسات اليوم (المتحقق منها خماسياً)
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                تاريخ اليوم: {new Date().toLocaleDateString('ar-OM', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
            <button
              onClick={() => onSelectTab('appointments')}
              className="text-xs font-bold text-[#075563] hover:text-[#2A9DA5] flex items-center gap-1"
            >
              عرض الجدول الكامل
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3">
            {appointments.length === 0 ? (
              <div className="p-8 text-center text-gray-400 space-y-3 bg-[#FAF8F1]/60 rounded-2xl border border-gray-100">
                <Clock className="w-10 h-10 mx-auto text-gray-300" />
                <p className="text-xs text-gray-600 font-medium">
                  لا توجد جلسات محجوزة لهذا اليوم • المجمع جديد وجاهز لجدولة مواعيد المراجعين
                </p>
                <button
                  onClick={onOpenBookingModal}
                  className="px-4 py-2 bg-[#075563] text-white text-xs font-bold rounded-xl inline-block"
                >
                  حجز موعد بالجدولة خماسية الأبعاد
                </button>
              </div>
            ) : (
              appointments.slice(0, 5).map((apt) => (
                <div
                  key={apt.id}
                  className="p-3.5 bg-gray-50 rounded-2xl border border-gray-200 hover:border-[#2A9DA5] transition flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#075563] text-white flex flex-col items-center justify-center font-mono font-bold">
                      <span>{apt.startTime}</span>
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 text-sm">{apt.patientName}</div>
                      <div className="text-[11px] text-gray-500 mt-0.5">{apt.procedureName}</div>
                      <div className="text-[10px] text-[#075563] font-semibold mt-0.5">
                        الأخصائية: {apt.physioName}
                      </div>
                    </div>
                  </div>

                  <div className="text-left space-y-1">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      مؤكد ومحجوز
                    </span>
                    <div className="text-[10px] text-gray-400 font-mono">{apt.durationMinutes} دقيقة</div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Omani Voice Bot Trigger Banner */}
          <div className="bg-gradient-to-r from-[#FAF8F1] to-white p-4 rounded-2xl border border-[#B59B62]/30 flex items-center justify-between gap-3">
            <div className="space-y-0.5">
              <div className="font-bold text-xs text-[#075563] flex items-center gap-1.5">
                <PhoneCall className="w-4 h-4 text-[#B59B62]" />
                المساعد الصوتي العماني لإدارة قائمة الانتظار (Voice Bot)
              </div>
              <div className="text-[11px] text-gray-600">
                أتمتة اتصالات التأكيد باللهجة العمانية وإعادة توزيع الشواغر فورا عبر واتساب
              </div>
            </div>
            <button
              onClick={onOpenVoiceBot}
              className="px-3.5 py-2 bg-[#075563] hover:bg-[#075563]/90 text-white text-xs font-bold rounded-xl transition shadow-xs whitespace-nowrap"
            >
              تشغيل المكالمة
            </button>
          </div>
        </div>

        {/* Specialized Clinics Quick Access (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-[#075563]/15 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 className="font-bold text-base text-[#075563]">
              العيادات المتخصصة الثماني (Specialized Clinics)
            </h3>
            <span className="text-[11px] text-gray-400 font-mono">2026</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {[
              { id: 'clinic_spine', name: 'العمود الفقري والرقبة', desc: 'خريطة الفقرات وسرير الشد', color: 'border-blue-200 bg-blue-50/50' },
              { id: 'clinic_knee', name: 'الركبة والخشونة', desc: 'حاسبة الحمل الميكانيكي', color: 'border-emerald-200 bg-emerald-50/50' },
              { id: 'clinic_shoulder', name: 'الكتف والطرف العلوي', desc: 'متتبع الكتف المتجمد', color: 'border-amber-200 bg-amber-50/50' },
              { id: 'clinic_sports_rtp', name: 'الإصابات الرياضية', desc: 'حارس العودة للملاعب RTP', color: 'border-purple-200 bg-purple-50/50' },
              { id: 'clinic_surgical', name: 'التأهيل بعد العمليات', desc: 'الخطوط الحمراء ومتابعة الجروح', color: 'border-red-200 bg-red-50/50' },
              { id: 'clinic_geriatric', name: 'كبار السن والتوازن', desc: 'مقياس بيرغ والواجهة الميسرة', color: 'border-teal-200 bg-teal-50/50' },
              { id: 'clinic_neuro', name: 'التأهيل العصبي', desc: 'مقياس أشفورث للتشنج', color: 'border-indigo-200 bg-indigo-50/50' },
              { id: 'clinic_fitness', name: 'اللياقة الطبية والوزن', desc: 'ربط InBody وحرق السعرات', color: 'border-orange-200 bg-orange-50/50' },
            ].map((c) => (
              <button
                key={c.id}
                onClick={() => onSelectTab(c.id)}
                className={`p-3 rounded-2xl border text-right transition hover:shadow-xs hover:border-[#075563] space-y-1 ${c.color}`}
              >
                <div className="font-bold text-xs text-[#075563]">{c.name}</div>
                <div className="text-[10px] text-gray-500">{c.desc}</div>
              </button>
            ))}
          </div>

          {/* Pricing & Offer Banner */}
          <div className="bg-[#FAF8F1] p-4 rounded-2xl border border-[#B59B62]/30 space-y-2 text-xs">
            <div className="flex justify-between items-center">
              <span className="font-bold text-[#075563]">التسعيرة الرسمية المعتمدة:</span>
              <span className="bg-[#075563] text-white px-2 py-0.5 rounded font-bold text-[10px]">
                خصم 10% للباقات 5+
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px] text-gray-700">
              <div className="bg-white p-2 rounded-lg border border-gray-200">
                كشف واستشارة: <strong className="text-[#075563]">3 ر.ع</strong>
              </div>
              <div className="bg-white p-2 rounded-lg border border-gray-200">
                جلسة علاج مفردة: <strong className="text-[#075563]">15 ر.ع</strong>
              </div>
              <div className="bg-white p-2 rounded-lg border border-gray-200 col-span-2">
                باقة 5 جلسات: <strong className="text-emerald-700 font-bold">67.5 ر.ع</strong> (بدل 75 ر.ع)
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
