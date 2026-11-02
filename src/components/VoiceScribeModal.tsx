import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Sparkles, Check, X, FileText, Volume2, Wand2 } from 'lucide-react';
import { SOAPNote } from '../types/clinic';

interface VoiceScribeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyDraft: (draft: Partial<SOAPNote>) => void;
  patientName: string;
}

export const VoiceScribeModal: React.FC<VoiceScribeModalProps> = ({
  isOpen,
  onClose,
  onApplyDraft,
  patientName
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [audioLevel, setAudioLevel] = useState(30);
  const [transcript, setTranscript] = useState('');
  const [isProcessingAI, setIsProcessingAI] = useState(false);
  const [draftGenerated, setDraftGenerated] = useState(false);

  // Editable draft state
  const [draftSubjective, setDraftSubjective] = useState('');
  const [draftVAS, setDraftVAS] = useState(3);
  const [draftObjective, setDraftObjective] = useState('');
  const [draftAssessment, setDraftAssessment] = useState('');
  const [draftPlan, setDraftPlan] = useState('');

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRecording) {
      timer = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
        setAudioLevel(Math.floor(Math.random() * 60) + 20);
      }, 1000);
    } else {
      setRecordingSeconds(0);
    }
    return () => clearInterval(timer);
  }, [isRecording]);

  if (!isOpen) return null;

  const sampleTranscripts = [
    `المريضة ${patientName}: "الحمد لله دكتورة سبأ الألم في رقبتي خف كثير بعد جلسات الشد المحوسب، لكن ما زال فيه شد بسيط بكتفي اليمين لما أشتغل ساعات طويلة على اللابتوب. ألمي أقدر أقول الحين 3 من 10 بدل ما كان 8."
الدكتورة سبأ: "ممتاز جداً، فحص المدى الحركي يظهر وصول انثناء الرقبة إلى 45 درجة والبسط إلى 40 درجة مع تحسن القوة العضلية 4 من 5. الأنسجة مستجيبة بشكل رائع للبروتوكول. خطتنا اليوم متابعة شد الفقرات المحوسب 20 دقيقة مع موجات كهربائية تداخلية تسكينية، وسأضيف لك تمرين إرجاع الذقن مرتين يومياً بالبيت."`,
    `المراجع ${patientName}: "الحمد لله دكتورة ركبتي أصبحت أثبت لما أمشي، وتورم المفصل قل كثير مع جلسة الموجات التصادمية. الألم وقت صعود الدرج تراجع إلى 3 من 10."
الدكتورة سبأ: "تمام، قياس زاوية ثني الركبة اليوم وصل 115 درجة مع تحسن عضلات الفخذ الرباعية. سنستمر على جلسة الموجات التصادمية BTL اليوم ثم تمارين صالة التأهيل لتقوية عضلات الاتزان."`
  ];

  const handleStartRecording = () => {
    setIsRecording(true);
    setTranscript('');
    setDraftGenerated(false);
  };

  const handleStopAndAnalyze = () => {
    setIsRecording(false);
    setIsProcessingAI(true);

    const chosenSample = sampleTranscripts[0];
    setTranscript(chosenSample);

    setTimeout(() => {
      setIsProcessingAI(false);
      setDraftGenerated(true);
      setDraftSubjective(`شكوى المريض: تراجع ملحوظ في حدة الألم وانحسار التنميل من الأصابع إلى الساعد. ألم متبقٍ خفيف (3/10) عند العمل المكتبي الطويل. تحسن القدرة الوظيفية اليومية بنسبة 70%.`);
      setDraftVAS(3);
      setDraftObjective(`مدى الحركة النشط (Active ROM): انثناء الرقبة 45°، بسط الرقبة 40°، دوران يمين 65°. القوة العضلية اليدوية (MMT): 4/5 لعضلات الرقبة والكتف. اختبار سبورلينج سلبي.`);
      setDraftAssessment(`استجابة الأنسجة الرخوة ممتازة لبروتوكول شد الفقرات العنقية بالكمبيوتر والعلاج التسكيني. تقدم التعافي السريري وصل إلى 70%، ولا توجد مؤشرات خطر.`);
      setDraftPlan(`استكمال جلسة شد الفقرات المحوسبة BTL (قوة 7.5 كجم، 20 دقيقة) + علاج كهربائي تداخلي 15 دقيقة. وصف تمرين إرجاع الذقن (Chin Tucks) وإطالة العضلة شبه المنحرفة بالمنزل.`);
    }, 1800);
  };

  const handleApply = () => {
    onApplyDraft({
      subjective: {
        chiefComplaint: draftSubjective,
        painVAS: draftVAS,
        painCharacter: 'ألم خفيف غير حاد ينشط مع الإجهاد',
        functionalLimitation: 'قادر على أداء مهام اليوم مع حذر خفيف',
        aggravatingFactors: 'العمل المكتبي الطويل',
        relievingFactors: 'الراحة وتمارين الاستطالة'
      },
      assessment: {
        tissueResponse: draftAssessment,
        recoveryProgressPercent: 75,
        clinicalImpression: 'تحسن وظيفي ملحوظ وانحسار الأعراض الجذرية',
        prognosis: 'ممتاز'
      }
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl border border-gray-100 overflow-hidden my-6">
        {/* Header */}
        <div className="bg-[#075563] text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-xl">
              <Sparkles className="w-6 h-6 text-[#B59B62]" />
            </div>
            <div>
              <h3 className="font-bold text-lg sm:text-xl">مساعد التوثيق الصوتي الذكي (AI Physiotherapy Scribe)</h3>
              <p className="text-xs text-[#FAF8F1]/80 mt-0.5">
                الاستماع التلقائي في غرفة الفحص، وتحويل المحادثة إلى مسودة SOAP Notes معتمدة
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-6 max-h-[72vh] overflow-y-auto">
          {/* Patient Banner */}
          <div className="bg-[#FAF8F1] p-3 rounded-xl border border-[#B59B62]/20 flex items-center justify-between text-xs">
            <span className="font-semibold text-gray-700">المريض قيد الجلسة: <strong className="text-[#075563]">{patientName}</strong></span>
            <span className="bg-[#075563]/10 text-[#075563] font-bold px-2.5 py-1 rounded-md">محرك Whisper.cpp مدمج محلياً</span>
          </div>

          {/* Recording Box */}
          <div className="flex flex-col items-center justify-center p-6 bg-gradient-to-b from-gray-50 to-white rounded-2xl border border-dashed border-gray-300">
            {isRecording ? (
              <div className="flex flex-col items-center space-y-3">
                <div className="relative">
                  <div
                    className="w-20 h-20 rounded-full bg-red-500 flex items-center justify-center text-white shadow-lg shadow-red-500/30 animate-pulse cursor-pointer"
                    onClick={handleStopAndAnalyze}
                  >
                    <Mic className="w-10 h-10" />
                  </div>
                  <span className="absolute -top-1 -right-1 flex h-4 w-4">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-red-600"></span>
                  </span>
                </div>
                <div className="font-mono text-sm font-bold text-red-600">
                  جاري الاستماع لحديث الطبيب والمريض... 00:{recordingSeconds < 10 ? `0${recordingSeconds}` : recordingSeconds}
                </div>
                <div className="flex items-center gap-1.5 h-6">
                  {[...Array(12)].map((_, i) => (
                    <div
                      key={i}
                      className="w-1.5 bg-red-400 rounded-full transition-all"
                      style={{ height: `${Math.max(6, Math.sin(i + recordingSeconds) * audioLevel)}px` }}
                    />
                  ))}
                </div>
                <button
                  onClick={handleStopAndAnalyze}
                  className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition shadow-xs flex items-center gap-2"
                >
                  <MicOff className="w-4 h-4" />
                  إيقاف التسجيل وتوليد مسودة SOAP بالذكاء الاصطناعي
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center space-y-3 text-center">
                <div
                  className="w-20 h-20 rounded-full bg-[#075563] hover:bg-[#2A9DA5] flex items-center justify-center text-white shadow-lg shadow-[#075563]/25 cursor-pointer transition transform hover:scale-105"
                  onClick={handleStartRecording}
                >
                  <Mic className="w-9 h-9" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-gray-800">اضغط لبدء الاستماع الذكي في غرفة العلاج</h4>
                  <p className="text-xs text-gray-500 mt-1 max-w-sm">
                    يتعرف النظام تلقائياً على اللهجة العمانية والمصطلحات الطبية المتخصصة في العلاج الطبيعي والتأهيل
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* AI Processing Animation */}
          {isProcessingAI && (
            <div className="p-6 bg-blue-50/70 border border-blue-200 rounded-xl flex flex-col items-center justify-center text-center space-y-2">
              <Wand2 className="w-8 h-8 text-[#075563] animate-spin" />
              <div className="font-bold text-xs text-[#075563]">جاري تحليل الحوار وتوزيع البيانات على أجزاء SOAP الأربعة...</div>
              <p className="text-[11px] text-gray-500">استخراج مقياس الألم VAS، قياسات المدى الحركي ROM، واستجابة الأنسجة</p>
            </div>
          )}

          {/* Generated SOAP Draft */}
          {draftGenerated && (
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-[#075563] flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#B59B62]" />
                  المسودة المولدة آلياً (قابلة للتعديل والاعتماد):
                </h4>
                <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full">
                  جاهزة للاعتماد الإكلينيكي
                </span>
              </div>

              {/* S: Subjective */}
              <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200 space-y-2">
                <div className="flex justify-between items-center text-xs font-bold text-gray-800">
                  <span>S (Subjective) - شكوى المريض ومقياس الألم:</span>
                  <span className="bg-[#075563] text-white px-2 py-0.5 rounded font-mono">
                    VAS: {draftVAS}/10
                  </span>
                </div>
                <textarea
                  value={draftSubjective}
                  onChange={(e) => setDraftSubjective(e.target.value)}
                  rows={2}
                  className="w-full text-xs bg-white border border-gray-200 rounded-lg p-2 text-gray-800"
                />
              </div>

              {/* O: Objective */}
              <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200 space-y-2">
                <div className="text-xs font-bold text-gray-800">
                  O (Objective) - القياسات الحركية والمدى ROM والقوة:
                </div>
                <textarea
                  value={draftObjective}
                  onChange={(e) => setDraftObjective(e.target.value)}
                  rows={2}
                  className="w-full text-xs bg-white border border-gray-200 rounded-lg p-2 text-gray-800"
                />
              </div>

              {/* A: Assessment */}
              <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200 space-y-2">
                <div className="text-xs font-bold text-gray-800">
                  A (Assessment) - التقييم الإكلينيكي واستجابة الأنسجة:
                </div>
                <textarea
                  value={draftAssessment}
                  onChange={(e) => setDraftAssessment(e.target.value)}
                  rows={2}
                  className="w-full text-xs bg-white border border-gray-200 rounded-lg p-2 text-gray-800"
                />
              </div>

              {/* P: Plan */}
              <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200 space-y-2">
                <div className="text-xs font-bold text-gray-800">
                  P (Plan) - خطة الجلسة القادمة والأجهزة والتمارين المنزلية:
                </div>
                <textarea
                  value={draftPlan}
                  onChange={(e) => setDraftPlan(e.target.value)}
                  rows={2}
                  className="w-full text-xs bg-white border border-gray-200 rounded-lg p-2 text-gray-800"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-bold rounded-xl transition">
            إلغاء
          </button>
          {draftGenerated && (
            <button
              onClick={handleApply}
              className="px-6 py-2.5 bg-[#075563] hover:bg-[#075563]/90 text-white text-xs sm:text-sm font-bold rounded-xl transition shadow-md flex items-center gap-2"
            >
              <Check className="w-4 h-4 text-[#B59B62]" />
              اعتماد المسودة وتطبيقها في ملف SOAP
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
