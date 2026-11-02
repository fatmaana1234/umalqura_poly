import React, { useState } from 'react';
import { HomeExercise, Patient } from '../types/clinic';
import { HOME_EXERCISES } from '../data/clinicData';
import {
  Video,
  Send,
  MessageSquare,
  Camera,
  Play,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  Search,
  Filter
} from 'lucide-react';

interface ExerciseLibraryViewProps {
  patients: Patient[];
  onLaunchRepCounter?: (exerciseTitle: string) => void;
}

export const ExerciseLibraryView: React.FC<ExerciseLibraryViewProps> = ({
  patients,
  onLaunchRepCounter
}) => {
  const [exercises] = useState<HomeExercise[]>(HOME_EXERCISES);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPatientId, setSelectedPatientId] = useState<string>(patients[0]?.id || '');
  const [sentNotice, setSentNotice] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'جميع التمارين' },
    { id: 'العمود الفقري والرقبة', label: 'العمود الفقري والرقبة' },
    { id: 'مشاكل الركبة والخشونة', label: 'الركبة والخشونة' },
    { id: 'الكتف والطرف العلوي', label: 'الكتف والطرف العلوي' },
    { id: 'برامج كبار السن والوقاية من السقوط', label: 'كبار السن والتوازن' },
  ];

  const filteredExercises = exercises.filter(
    (ex) => selectedCategory === 'all' || ex.category === selectedCategory
  );

  const currentPatient = patients.find((p) => p.id === selectedPatientId) || patients[0];

  const handleSendWhatsApp = (exercise: HomeExercise) => {
    const text = encodeURIComponent(
      `السلام عليكم ورحمة الله أخي/أختي ${currentPatient.name}،\nتحية طيبة من مجمع أم القرى الطبي في بركاء.\n\nبناءً على تقييم جلستك اليوم مع الأخصائي، إليك تمرينك المنزلي الموصوف:\n📌 *${exercise.title}*\n⏱️ *التكرارات:* ${exercise.reps} تكرار × ${exercise.sets} مجموعات\n🔄 *التكرار اليومي:* ${exercise.frequency}\n\n📝 *طريقة الأداء:* ${exercise.instructions}\n⚠️ *تنبيه الأمان:* ${exercise.safetyCautions}\n\nيمكنك فتح كاميرا التطبيق لمتابعة التكرارات تلقائياً.\nصحتك أولويتنا • مجمع أم القرى الطبي بركاء`
    );

    setSentNotice(`تم إرسال رابط التمرين "${exercise.title}" عبر WhatsApp إلى ${currentPatient.name}`);
    window.open(`https://wa.me/${currentPatient.phone.replace(/[^0-9]/g, '')}?text=${text}`, '_blank');
    setTimeout(() => setSentNotice(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-white p-5 rounded-3xl border border-[#075563]/15 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-[#075563]/10 text-[#075563]">
              <Video className="w-5 h-5" />
            </span>
            <h2 className="font-bold text-lg sm:text-xl text-[#075563]">
              مكتبة فيديوهات وتمارين التأهيل المنزلي الرقمية المحتشمة
            </h2>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            مستودع إكلينيكي مدمج بالكامل مصمم بتغذية بصرية ومحتشمة تلائم المجتمع العماني، مع إرسال فوري للمريض عبر WhatsApp
          </p>
        </div>

        {/* Patient Selector for 1-Click WhatsApp dispatch */}
        <div className="flex items-center gap-2 bg-[#FAF8F1] p-1.5 rounded-2xl border border-[#B59B62]/30 text-xs">
          <span className="text-gray-500 font-bold px-1">إرسال إلى:</span>
          <select
            value={selectedPatientId}
            onChange={(e) => setSelectedPatientId(e.target.value)}
            className="bg-transparent font-bold text-[#075563] focus:outline-hidden"
          >
            {patients.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.phone})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setSelectedCategory(c.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              selectedCategory === c.id
                ? 'bg-[#075563] text-white shadow-xs'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-[#FAF8F1]'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {sentNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{sentNotice}</span>
        </div>
      )}

      {/* Exercises Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredExercises.map((ex) => (
          <div
            key={ex.id}
            className="bg-white rounded-3xl border border-[#075563]/15 overflow-hidden shadow-xs hover:shadow-md transition flex flex-col justify-between"
          >
            <div>
              {/* Media Preview Box */}
              <div className="relative aspect-video bg-slate-900 overflow-hidden">
                <img
                  src={ex.thumbnailUrl}
                  alt={ex.title}
                  className="w-full h-full object-cover opacity-85"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-3">
                  <div className="text-right">
                    <span className="text-[10px] font-bold bg-[#B59B62] text-[#075563] px-2 py-0.5 rounded-md">
                      {ex.category}
                    </span>
                    <h4 className="font-bold text-sm text-white mt-1">{ex.title}</h4>
                    <p className="text-[10px] text-gray-300 font-sans">{ex.titleEn}</p>
                  </div>
                </div>
              </div>

              {/* Instructions and Parameters */}
              <div className="p-4 space-y-3 text-xs">
                {/* Reps and Sets Bar */}
                <div className="grid grid-cols-3 gap-1.5 text-center bg-[#FAF8F1] p-2.5 rounded-xl border border-[#B59B62]/20 font-mono">
                  <div>
                    <span className="text-gray-400 block text-[9px] font-sans">التكرارات</span>
                    <strong className="text-[#075563] text-sm">{ex.reps} reps</strong>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[9px] font-sans">المجموعات</span>
                    <strong className="text-gray-800 text-sm">{ex.sets} sets</strong>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[9px] font-sans">الثبات</span>
                    <strong className="text-emerald-700 text-sm">{ex.holdSeconds} sec</strong>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="font-bold text-gray-800">طريقة الأداء:</span>
                  <p className="text-gray-600 leading-relaxed text-[11px]">{ex.instructions}</p>
                </div>

                <div className="space-y-1 p-2.5 bg-amber-50 rounded-lg border border-amber-200">
                  <span className="font-bold text-amber-900 text-[11px]">محاذير السلامة المفصلية:</span>
                  <p className="text-amber-800 text-[10px] leading-relaxed">{ex.safetyCautions}</p>
                </div>
              </div>
            </div>

            {/* Bottom Actions: 1-Click WhatsApp Send & AI Rep Counter */}
            <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between gap-2">
              <button
                onClick={() => handleSendWhatsApp(ex)}
                className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 shadow-xs"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                إرسال بالواتساب
              </button>

              {onLaunchRepCounter && (
                <button
                  onClick={() => onLaunchRepCounter(ex.title)}
                  className="py-2 px-3 bg-[#075563] hover:bg-[#075563]/90 text-white text-xs font-bold rounded-xl transition flex items-center gap-1 shadow-xs"
                  title="فتح كاميرا مدرب الذكاء الاصطناعي لعد التكرارات"
                >
                  <Camera className="w-3.5 h-3.5 text-[#B59B62]" />
                  <span>المدرب الذكي</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
