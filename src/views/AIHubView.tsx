import React from 'react';
import { CameraMotionAnalysis } from '../components/CameraMotionAnalysis';
import { ExerciseRepCounter } from '../components/ExerciseRepCounter';
import { Sparkles, Camera, Activity, Bot, BrainCircuit, Play } from 'lucide-react';

interface AIHubViewProps {
  onOpenVoiceScribe: () => void;
  onOpenVoiceBot: () => void;
  onOpenPredictiveAnalytics: () => void;
}

export const AIHubView: React.FC<AIHubViewProps> = ({
  onOpenVoiceScribe,
  onOpenVoiceBot,
  onOpenPredictiveAnalytics
}) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-3xl border border-[#075563]/15 shadow-xs">
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-xl bg-[#075563]/10 text-[#075563]">
            <Sparkles className="w-5 h-5 text-[#B59B62]" />
          </span>
          <h2 className="font-bold text-lg sm:text-xl text-[#075563]">
            منظومة الذكاء الاصطناعي الإكلينيكي 2026 (Clinical AI Hub)
          </h2>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          المرحلة الثانية: 5 إضافات ثورية تعتمد على الرؤية الحاسوبية ومعالجة الصوت والنماذج التنبؤية لدعم قرارات الأخصائي
        </p>
      </div>

      {/* AI Feature Launchers Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Scribe Card */}
        <div className="bg-gradient-to-br from-[#FAF8F1] to-white p-5 rounded-3xl border border-[#B59B62]/30 flex flex-col justify-between space-y-3">
          <div>
            <div className="w-10 h-10 rounded-xl bg-[#075563] text-white flex items-center justify-center mb-2">
              <Sparkles className="w-5 h-5 text-[#B59B62]" />
            </div>
            <h3 className="font-bold text-sm text-[#075563]">11. مساعد التوثيق الصوتي الذكي (AI Scribe)</h3>
            <p className="text-xs text-gray-600 mt-1 leading-relaxed">
              استماع ذكي لمحادثة الطبيب والمريض وصياغة مسودة SOAP Notes الرباعية تلقائياً.
            </p>
          </div>
          <button
            onClick={onOpenVoiceScribe}
            className="w-full py-2 bg-[#075563] hover:bg-[#075563]/90 text-white text-xs font-bold rounded-xl transition shadow-xs"
          >
            فتح الموثق الصوتي
          </button>
        </div>

        {/* Voice Bot Card */}
        <div className="bg-gradient-to-br from-[#FAF8F1] to-white p-5 rounded-3xl border border-[#B59B62]/30 flex flex-col justify-between space-y-3">
          <div>
            <div className="w-10 h-10 rounded-xl bg-[#2A9DA5] text-white flex items-center justify-center mb-2">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <h3 className="font-bold text-sm text-[#075563]">14. المساعد الصوتي العماني للانتظار (Voice Bot)</h3>
            <p className="text-xs text-gray-600 mt-1 leading-relaxed">
              تأكيد المواعيد باللهجة العمانية وإعادة توجيه الشواغر تلقائياً للانتظار عبر WhatsApp.
            </p>
          </div>
          <button
            onClick={onOpenVoiceBot}
            className="w-full py-2 bg-[#2A9DA5] hover:bg-[#2A9DA5]/90 text-white text-xs font-bold rounded-xl transition shadow-xs"
          >
            تشغيل الروبوت العماني
          </button>
        </div>

        {/* Predictive Analytics Card */}
        <div className="bg-gradient-to-br from-[#FAF8F1] to-white p-5 rounded-3xl border border-[#B59B62]/30 flex flex-col justify-between space-y-3">
          <div>
            <div className="w-10 h-10 rounded-xl bg-[#B59B62] text-[#075563] flex items-center justify-center mb-2">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-[#075563]">15. نظام التنبؤ الذكي بالتعافي (Predictive Analytics)</h3>
            <p className="text-xs text-gray-600 mt-1 leading-relaxed">
              تحليل قاعدة البيانات وسن المريض للتنبؤ بعدد الجلسات ونسبة الشفاء المحتملة.
            </p>
          </div>
          <button
            onClick={onOpenPredictiveAnalytics}
            className="w-full py-2 bg-[#B59B62] hover:bg-[#B59B62]/90 text-[#075563] text-xs font-black rounded-xl transition shadow-xs"
          >
            فتح نظام التنبؤ
          </button>
        </div>
      </div>

      {/* Feature 12: Live Camera Markerless Motion Analysis */}
      <div>
        <CameraMotionAnalysis />
      </div>

      {/* Feature 13: Live AI Home Exercise Rep Counter */}
      <div>
        <ExerciseRepCounter />
      </div>
    </div>
  );
};
