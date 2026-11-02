import React, { useState } from 'react';
import { Volume2, PhoneCall, Calendar, Activity, Heart, ArrowRight, ShieldCheck } from 'lucide-react';
import { CLINIC_INFO } from '../data/clinicData';

interface ElderlyUIModeProps {
  onBack: () => void;
}

export const ElderlyUIMode: React.FC<ElderlyUIModeProps> = ({ onBack }) => {
  const [activeSpeech, setActiveSpeech] = useState<string | null>(null);

  const speak = (text: string) => {
    setActiveSpeech(text);
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'ar-SA';
      u.rate = 0.9; // Calm, slow pace for seniors
      window.speechSynthesis.speak(u);
    }
  };

  return (
    <div className="bg-[#FAF8F1] min-h-screen p-4 sm:p-8 space-y-6 max-w-4xl mx-auto">
      {/* Top Bar with Back Button */}
      <div className="flex items-center justify-between bg-white p-4 sm:p-6 rounded-3xl border-2 border-[#075563] shadow-md">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-5 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-2xl font-bold text-base transition"
        >
          <ArrowRight className="w-6 h-6" />
          العودة للواجهة الرئيسية
        </button>

        <div className="flex items-center gap-3">
          <img
            src="/logo.jpg"
            alt="شعار مجمع أم القرى الطبي"
            className="h-12 w-auto max-w-[120px] object-contain rounded-xl border border-gray-200 bg-white p-0.5"
          />
          <div className="text-right">
            <div className="text-xs font-bold text-[#B59B62]">مجمع أم القرى الطبي - بركاء</div>
            <h1 className="text-xl sm:text-2xl font-black text-[#075563]">واجهة كبار السن الميسرة</h1>
          </div>
        </div>
      </div>

      {/* Voice Prompt Box */}
      <div className="bg-gradient-to-r from-[#075563] to-[#2A9DA5] text-white p-6 rounded-3xl shadow-lg flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold mb-1">مرحباً بكم يا والدنا / والدتنا العزيزة</h2>
          <p className="text-sm text-[#FAF8F1]">
            اضغط على أي زر كبير وسنقوم بمساعدتك وقراءة التعليمات بصوت واضح ومريح
          </p>
        </div>
        <button
          onClick={() => speak('حياكم الله في مجمع أم القرى الطبي، صحتك أولويتنا، اختر الزر الذي ترغب به وسنساعدك فوراً')}
          className="p-4 bg-[#B59B62] text-[#075563] rounded-2xl font-black shadow-md flex items-center gap-2 hover:scale-105 transition"
        >
          <Volume2 className="w-7 h-7" />
          استمع للترحيب
        </button>
      </div>

      {/* Big Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* 1. Today's Exercise */}
        <button
          onClick={() => speak('تمرين اليوم هو تمرين التوازن اللطيف والوقوف الآمن بجانب الطاولة، مدته عشر دقائق')}
          className="p-8 bg-white hover:bg-emerald-50 border-3 border-emerald-600 rounded-3xl shadow-md text-right space-y-3 transition transform hover:-translate-y-1"
        >
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
            <Activity className="w-10 h-10" />
          </div>
          <h3 className="text-2xl font-black text-gray-900">تمرين اليوم المنزلي</h3>
          <p className="text-base text-gray-600 font-medium">
            تمارين خفيفة وآمنة لدعم التوازن ومنع السقوط
          </p>
        </button>

        {/* 2. Direct Phone Call to Clinic */}
        <a
          href="tel:+96879470050"
          onClick={() => speak('جاري الاتصال بموظفة استقبال مجمع أم القرى الطبي لمساعدتك')}
          className="p-8 bg-white hover:bg-blue-50 border-3 border-[#075563] rounded-3xl shadow-md text-right space-y-3 transition transform hover:-translate-y-1 block"
        >
          <div className="w-16 h-16 rounded-2xl bg-blue-100 text-[#075563] flex items-center justify-center">
            <PhoneCall className="w-10 h-10" />
          </div>
          <h3 className="text-2xl font-black text-gray-900">اتصال مباشر بالمجمع</h3>
          <p className="text-base text-gray-600 font-medium">
            تحدث مع موظفة الاستقبال أو الدكتورة سبأ: {CLINIC_INFO.phone1}
          </p>
        </a>

        {/* 3. Next Appointment */}
        <button
          onClick={() => speak('موعد جلستك القادمة يوم الأربعاء القادم في الفترة المسائية الساعة الخامسة والنصف')}
          className="p-8 bg-white hover:bg-amber-50 border-3 border-[#B59B62] rounded-3xl shadow-md text-right space-y-3 transition transform hover:-translate-y-1"
        >
          <div className="w-16 h-16 rounded-2xl bg-amber-100 text-[#B59B62] flex items-center justify-center">
            <Calendar className="w-10 h-10" />
          </div>
          <h3 className="text-2xl font-black text-gray-900">موعد جلستي القادمة</h3>
          <p className="text-base text-gray-600 font-medium">
            الأربعاء 05:30 مساءً مع الدكتورة سبأ
          </p>
        </button>

        {/* 4. Home Safety Tips */}
        <button
          onClick={() => speak('نصائح السلامة: احرص دائماً على إضاءة الممر ليلاً واستخدام الحذاء المانع للانزلاق والتكئ على المسند الثابت')}
          className="p-8 bg-white hover:bg-purple-50 border-3 border-purple-600 rounded-3xl shadow-md text-right space-y-3 transition transform hover:-translate-y-1"
        >
          <div className="w-16 h-16 rounded-2xl bg-purple-100 text-purple-800 flex items-center justify-center">
            <ShieldCheck className="w-10 h-10" />
          </div>
          <h3 className="text-2xl font-black text-gray-900">إرشادات الأمان بالمنزل</h3>
          <p className="text-base text-gray-600 font-medium">
            نصائح صوتية وبصرية للوقاية من الانزلاق والسقوط
          </p>
        </button>
      </div>
    </div>
  );
};
